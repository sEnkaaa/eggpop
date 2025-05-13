package `fun`.eggpop.backend.websocket.model

import com.fasterxml.jackson.annotation.JsonIgnore

data class Player(
    val id: String,
    @JsonIgnore
    val sessionId: String,
    @JsonIgnore
    var sessionToken: String,
    var connected: Boolean = true,
    val nickname: String,
    val avatar: String,
    var isLeader: Boolean = false,
    var isWatching: Boolean = false,
    var hasSubtitleReady: Boolean = false,
    var hasVoted: Boolean = false,
    var hasWatchedResults: Boolean = false,
    var points: Int = 0,
    @JsonIgnore
    var input: String = "",
    var isMe: Boolean = false
)
