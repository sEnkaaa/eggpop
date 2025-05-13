import React, { createContext, ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useApp from '../hooks/useApp'

export const GameContext = createContext<GameContextType | undefined>(undefined)

export interface GameContextType {
  creatingRoom: boolean
  setCreatingRoom: (creatingRoom: boolean) => void
  room: any
  setRoom: (room: any) => void
}

const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  const {ws} = useApp()

  const [room, setRoom] = useState(null)
  const [creatingRoom, setCreatingRoom] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    ws.onRoomCreated((roomData) => {
      setCreatingRoom(false)
      setRoom(roomData)
      if (roomData?.id) {
        navigate(`/game/${roomData?.id}`)
      }
    })
  }, [ws])

  return (
    <GameContext.Provider
      value={{
        room,
        setRoom,
        creatingRoom,
        setCreatingRoom,
      }}
    >
        {children}
    </GameContext.Provider>
  )
}

export default GameProvider
