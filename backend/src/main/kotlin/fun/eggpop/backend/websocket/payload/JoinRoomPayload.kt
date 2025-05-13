package `fun`.eggpop.backend.websocket.payload

data class PlayerPayload(
    val nickname: String,
    val avatar: String
)

data class JoinRoomPayload(
    val roomId: String,
    val player: PlayerPayload
)
