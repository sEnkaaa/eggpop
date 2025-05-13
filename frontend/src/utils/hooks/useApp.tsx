import { useContext } from "react"
import { AppContext } from "../contexts/AppContext"

const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within a AppProvider')
  }
  return context
}

export default useApp