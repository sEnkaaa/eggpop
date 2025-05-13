import React from "react"
import { Routes, Route } from "react-router-dom"

import HomePage from "./pages/home"
import GamePage from "./pages/game"
import JoinPage from "./pages/join"

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/join/:id?" element={<JoinPage />} />
            <Route path="/game/:id" element={<GamePage />} />
        </Routes>
    )
}

export default AppRoutes