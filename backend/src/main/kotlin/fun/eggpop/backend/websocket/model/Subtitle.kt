package `fun`.eggpop.backend.websocket.model

data class Subtitle(
    val locale: String,
    val content: String,
    val editable: Boolean,
    val startTime: Int,
    val endTime: Int
)