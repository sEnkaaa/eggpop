package `fun`.eggpop.backend.websocket.model
import java.time.Instant

data class Room(
    val id: String,
    val players: MutableList<Player> = mutableListOf(),
    var status: RoomStatus = RoomStatus.LOBBY,
    var round: Int = 1,
    var maxRounds: Int = 4,
    var currentClip: String = "",
    var subtitles: List<Subtitle> = mutableListOf(),
    var phaseEndTimestamp: Long? = null,
    var shuffledPlayerInputs: List<PlayerSubtitle> = mutableListOf(),
    var voteResults: List<VoteResult> = mutableListOf(),
    var playedClips: MutableSet<String> = mutableSetOf(),
    var lastActivityAt: Instant = Instant.now()
)

enum class RoomStatus {
    LOBBY,
    WATCHING_CLIP,
    SUBTITLE_PHASE,
    WATCHING_ALL_CLIPS,
    VOTE_PHASE,
    VOTE_RESULTS,
    PODIUM
}