import { Client, IMessage } from '@stomp/stompjs'
import Notification from '../../components/UI/Notification'

class WebSocketService {
  private client: Client | null = null
  private isConnected = false
  private token: string | null = null

  private roomCreatedCallback?: (data: any) => void
  private onConnectCallback?: () => void
  private errorCallback?: (data: any) => void
  private infoCallback?: (data: any) => void

  constructor() {
    this.token = null
  }

  private initClient() {
    this.client = new Client({
      brokerURL: import.meta.env.VITE_BACKEND_WS,
      reconnectDelay: 5000,
      connectHeaders: {
        'X-SESSION-TOKEN': this.token || ''
      },
      onConnect: () => {
        console.log('[WS] Connected to server')
        this.initSubscriptions()
        this.isConnected = true
        if (this.onConnectCallback) {
          this.onConnectCallback()
        }
      },
      onStompError: (err) => {
        console.error('[WS] Connection error', err)
      },
    })
  }

  public async connect() {
    if (this.isConnected) return

    const ok = await this.ensureSession()
    if (!ok) {
      console.warn('[WS] Retry in 5s...')
      setTimeout(() => this.connect(), 5000)
      return
    }

    this.initClient()
    this.client!.activate()
  }

  private async ensureSession(): Promise<boolean> {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_HTTP}/session`, {
        credentials: 'include'
      })
      let json = null
      if (res.body) {
        const reader = res.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let result = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          result += decoder.decode(value, { stream: true })
        }
        json = JSON.parse(result)
      }
      this.token = json?.token
      if (!res.ok) throw new Error('Session failed')
      return true
    } catch (err) {
      console.error('[Session] Failed to establish session', err)
      return false
    }
  }

  private initSubscriptions() {
    this.client.subscribe(`/user/${this.token}/error`, (message) => {
      let data = message.body
      try {
        const parsedData = JSON.parse(data)
        data = parsedData
      } catch (err) {
        console.error('[WS] Failed to parse message', err)
      }
      Notification.push(data)
      if (this.errorCallback) {
        this.errorCallback(data)
      }
    })
    this.client.subscribe(`/user/${this.token}/info`, (message) => {
      let data = message.body
      try {
        const parsedData = JSON.parse(data)
        data = parsedData
      } catch (err) {
        console.error('[WS] Failed to parse message', err)
      }
      Notification.push(data, 'info')
      if (this.infoCallback) {
        this.infoCallback(data)
      }
    })
    
    this.client.subscribe(`/user/${this.token}/room/created`, (message) => {
      let data = message.body
      try {
        const parsedData = JSON.parse(data)
        data = parsedData
      } catch (err) {
        console.error('[WS] Failed to parse message', err)
      }
      if (this.roomCreatedCallback) {
        this.roomCreatedCallback(data)
      }
    })
  }

  public isReady(): boolean {
    return this.isConnected
  }

  public onConnect(callback: () => void) {
    this.onConnectCallback = callback
  }

  public onError(callback: (data: any) => void) {
    this.errorCallback = callback
  }

  public disconnect() {
    this.client.deactivate()
  }

  public subscribe(topic: string, callback: (msg: IMessage) => void) {
    if (this.client.connected) {
      console.log(`[WS] Subscribing to ${topic}`)
      this.client.subscribe(topic, callback)
    } else {
      console.warn('[WS] Client not connected yet, waiting...')
    }
  }

  public unsubscribe(topic: string) {
    if (!this.client.connected) {
      console.warn('[WS] Client not connected yet')
      return
    }
    this.client.unsubscribe(topic)
  }

  public send(destination: string, body: string) {
    if (this.client.connected) {
      console.log(`[WS] Sending to ${destination}`)
      this.client.publish({ destination, body })
    } else { 
      console.warn('[WS] Client not connected yet, waiting...')
    }
  }

  public createRoom(creator: { nickname: string, avatar: string }) {
    const parsedBody = JSON.stringify({
      creator: {
        nickname: creator.nickname,
        avatar: creator.avatar
      }
    })
    this.send('/app/rooms/create', parsedBody)
  }

  public onRoomCreated(callback: (data: any) => void) {
    this.roomCreatedCallback = callback
  }
}

const ws = new WebSocketService()
export default ws