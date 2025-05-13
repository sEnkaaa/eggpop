import React, { createContext, ReactNode, useEffect, useRef, useMemo, useState } from 'react'
import { useLocalStorageState } from 'ahooks'
import { characters } from '../../components/CharacterSelect'
import WebSocketService from '../services/WebSocketService'

export const AppContext = createContext<AppContextType | undefined>(undefined)

export interface AppContextType {
  nickname?: string
  setNickname: (nickname: string | undefined) => void
  avatar?: string
  setAvatar: (avatar: string | undefined) => void
  ws: WebSocketService
}

const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [nickname, setNickname] = useLocalStorageState<string | undefined>(
    'nickname',
    {
      defaultValue: `Chicken${Math.floor(Math.random() * 90000) + 10000}`,
    }
  )

  const [avatar, setAvatar] = useLocalStorageState<string | undefined>(
    'avatar',
    {
      defaultValue: characters[Math.floor(Math.random() * characters.length)],
    }
  )

  const [connected, setConnected] = useState(false)

  useEffect(() => {
    WebSocketService.onConnect(() => {
      setConnected(true)
    })
    WebSocketService.connect()
    return () => {
      WebSocketService.disconnect()
      setConnected(false)
    }
  }, [])

  useEffect(() => {
    setNickname(nickname)
    setAvatar(avatar)
  }, [nickname, avatar])

  const contextValue = useMemo(
    () => ({
      nickname,
      setNickname,
      avatar,
      setAvatar,
      ws: WebSocketService,
    }),
    [nickname, avatar]
  )

  if (!connected) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Connecting to server...</p>
      </div>
    )
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider
