package `fun`.eggpop.backend.websocket.model

data class VoteResult(
    val voteCount: Int,
    val content: String,
    var nickname: String
)