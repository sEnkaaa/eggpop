package `fun`.eggpop.backend.websocket.model

import com.fasterxml.jackson.annotation.JsonIgnore

data class PlayerSubtitle(
    val id: String,
    val content: String,
    @JsonIgnore
    val playerSessionId: String,
    var voteCount: Int = 0,
    var isMine: Boolean = false
)