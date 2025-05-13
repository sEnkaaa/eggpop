package `fun`.eggpop.backend.websocket.payload

data class CreatorPayload(
    val nickname: String,
    val avatar: String
)

data class CreateRoomPayload(
    val creator: CreatorPayload
)
