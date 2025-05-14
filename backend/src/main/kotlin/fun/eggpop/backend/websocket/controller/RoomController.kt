package `fun`.eggpop.backend.websocket.controller

import `fun`.eggpop.backend.repository.ClipRepository
import `fun`.eggpop.backend.repository.SubtitleRepository
import `fun`.eggpop.backend.websocket.model.RoomStatus
import `fun`.eggpop.backend.websocket.model.Room
import `fun`.eggpop.backend.websocket.model.Player
import `fun`.eggpop.backend.websocket.model.Subtitle
import `fun`.eggpop.backend.websocket.model.PlayerSubtitle
import `fun`.eggpop.backend.websocket.model.VoteResult
import `fun`.eggpop.backend.websocket.payload.CreateRoomPayload
import `fun`.eggpop.backend.websocket.payload.JoinRoomPayload
import `fun`.eggpop.backend.websocket.service.GameService
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.Payload
import org.springframework.messaging.handler.annotation.DestinationVariable
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Controller
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.TimeUnit
import java.util.UUID
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

@Controller
class RoomController(
    private val gameService: GameService,
    private val clipRepository: ClipRepository,
    private val subtitleRepository: SubtitleRepository,
    private val messagingTemplate: SimpMessagingTemplate
) {
    @MessageMapping("/rooms/create")
    fun createRoom(
        @Payload payload: CreateRoomPayload,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONID not found in session attributes" }
            return
        }

        val sessionToken = headerAccessor.sessionAttributes?.get("SESSIONTOKEN") as? String
        if (sessionToken.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONTOKEN not found in session attributes" }
            return
        }

        val creator = Player(
            id = UUID.randomUUID().toString(),
            sessionId = sessionId,
            sessionToken = sessionToken,
            nickname = payload.creator.nickname,
            avatar = payload.creator.avatar,
            isLeader = true
        )
        val room: Room = gameService.createRoom(creator)
        logger.info { "[WS] Room created. Total rooms: ${gameService.getRooms().size}" }

        val personalizedRoom = room.copy(
            players = room.players.map { p ->
                if (p.sessionId == sessionId) p.copy(isMe = true)
                else p.copy(isMe = false)
            }.toMutableList()
        )
        messagingTemplate.convertAndSend("/user/$sessionToken/room/created", personalizedRoom)
    }

    @MessageMapping("/rooms/{roomId}/kick")
    fun kickPlayer(
        @DestinationVariable roomId: String,
        @Payload playerId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val room = gameService.getRoomById(roomId) ?: return
        val leader = room.players.find { it.sessionId == sessionId }
        if (leader == null || !leader.isLeader) {
            logger.warn { "[WS] Unauthorized kick attempt by sessionId=$sessionId in room $roomId" }
            return
        }

        val playerToKick = room.players.find { it.id == playerId }
        if (playerToKick == null) {
            logger.warn { "[WS] Player to kick not found: $playerId" }
            return
        }

        room.players.remove(playerToKick)
        logger.info { "[WS] 🚪 Player ${playerToKick.nickname} has been kicked from room $roomId" }

        messagingTemplate.convertAndSend("/user/${playerToKick.sessionToken}/error", "You have been kicked from the room.")

        room.players.forEach {
            messagingTemplate.convertAndSend("/user/${it.sessionToken}/info", "${playerToKick.nickname} has been kicked from the room")
        }

        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/make-leader")
    fun makeLeader(
        @DestinationVariable roomId: String,
        @Payload playerId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val room = gameService.getRoomById(roomId) ?: return
        val currentLeader = room.players.find { it.sessionId == sessionId }
        if (currentLeader == null || !currentLeader.isLeader) {
            logger.warn { "[WS] Unauthorized leader change attempt by sessionId=$sessionId in room $roomId" }
            return
        }

        val newLeader = room.players.find { it.id == playerId }
        if (newLeader == null) {
            logger.warn { "[WS] New leader not found: $playerId" }
            return
        }

        room.players.forEach {
            it.isLeader = false
            messagingTemplate.convertAndSend("/user/${it.sessionToken}/info", "${newLeader.nickname} is now the new leader.")
        }
        newLeader.isLeader = true
        logger.info { "👑 ${newLeader.nickname} is now the leader of room $roomId" }

        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/get")
    fun getRoom(
        @Payload roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val sessionToken = headerAccessor.sessionAttributes?.get("SESSIONTOKEN") as? String
        if (sessionToken.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONTOKEN is missing in session attributes" }
            return
        }

        if (roomId.isBlank()) {
            logger.warn { "[WS] Room ID is missing or blank in the payload" }
            messagingTemplate.convertAndSend("/user/$sessionToken/error", "Missing room ID")
            return
        }

        val room = gameService.getRooms().find { it.id == roomId }
        if (room == null) {
            logger.warn { "[WS] Room not found for ID: $roomId" }
            messagingTemplate.convertAndSend("/user/$sessionToken/error", "Room not found")
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null) {
            logger.warn { "[WS] Player with sessionId=$sessionId not in room $roomId" }
            messagingTemplate.convertAndSend("/user/$sessionToken/error", "Unauthorized access")
            return
        }

        val isNewSessionToken = player.sessionToken != sessionToken
        if (isNewSessionToken) {
            player.sessionToken = sessionToken
            player.connected = true
            sendRoomToAllPlayers(room)
        }

        val personalizedRoom = room.copy(
            players = room.players.map { p ->
                if (p.sessionId == sessionId) p.copy(isMe = true)
                else p.copy(isMe = false)
            }.toMutableList()
        )
        messagingTemplate.convertAndSend("/user/$sessionToken/room/${room.id}", personalizedRoom)
    }

    @MessageMapping("/rooms/join")
    fun getRoom(
        @Payload payload: JoinRoomPayload,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val sessionToken = headerAccessor.sessionAttributes?.get("SESSIONTOKEN") as? String
        if (sessionToken.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONTOKEN is missing in session attributes" }
            return
        }

        val roomId = payload.roomId.lowercase()

        if (roomId.isBlank()) {
            logger.warn { "[WS] Room ID is missing or blank in the payload" }
            messagingTemplate.convertAndSend("/user/$sessionToken/error", "Missing room ID")
            return
        }

        val room = gameService.getRooms().find { it.id == roomId }
        if (room == null) {
            logger.warn { "[WS] Room not found for ID: $roomId" }
            messagingTemplate.convertAndSend("/user/$sessionToken/error", "Room not found")
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player != null) {
            logger.warn { "[WS] Player with sessionId=$sessionId is already in $roomId" }
            messagingTemplate.convertAndSend("/user/$sessionToken/error", "Already in the room")
            return
        }

        val newPlayer = Player(
            id = UUID.randomUUID().toString(),
            sessionId = sessionId,
            sessionToken = sessionToken,
            nickname = payload.player.nickname,
            avatar = payload.player.avatar,
            isLeader = false
        )
        gameService.addPlayerToRoom(roomId, newPlayer)
        messagingTemplate.convertAndSend("/user/$sessionToken/room/$roomId/joined", room)

        sendRoomToAllPlayers(room)
        logger.info { "[WS] Player with sessionId=$sessionId joined room $roomId" }
    }

    @MessageMapping("/rooms/{roomId}/start")
    fun startGame(@DestinationVariable roomId: String) {
        logger.info { "[WS] ▶️ startGame triggered for roomId: $roomId" }
        val room = gameService.getRoomById(roomId)
        if (room == null) {
            logger.error { "[WS] ❌ No room found for id: $roomId" }
            return
        }

        logger.info { "[WS] ✅ Room found: ${room.id} with ${room.players.size} players" }
        loadRandomClipAndSubtitles(room)

        room.players.forEach { it.isWatching = true }
        room.status = RoomStatus.WATCHING_CLIP
        logger.info { "[WS] 📺 Room status set to WATCHING_CLIP" }

        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/status/watching-clip/change-clip")
    fun changeClip(
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.error { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val room = gameService.getRoomById(roomId) ?: return

        if (room.status != RoomStatus.WATCHING_CLIP) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut WATCHING_CLIP, changement de clip refusé." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null || !player.isLeader) {
            logger.error { "[WS] ❌ Le joueur $sessionId n'est pas leader ou introuvable, changement de clip refusé." }
            return
        }

        logger.info { "[WS] 🔄 Le leader ${player.nickname} demande un nouveau clip pour la room $roomId." }

        loadRandomClipAndSubtitles(room)
        room.phaseEndTimestamp = null
        room.players.forEach { it.isWatching = true }
        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/status/watching-clip/stopwatch")
    fun stopwatch(
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.error { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val room = gameService.getRoomById(roomId) ?: return

        if (room.status != RoomStatus.WATCHING_CLIP) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut WATCHING_CLIP, action ignorée." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null) {
            logger.warn { "[WS] ⚠️ Aucun joueur trouvé pour session $sessionId dans la room $roomId" }
            return
        }

        player.isWatching = false
        logger.info { "[WS] 🕒 Player ${player.nickname} a terminé de regarder la vidéo." }

        if (room.players.all { !it.isWatching }) {
            room.status = RoomStatus.SUBTITLE_PHASE
            logger.info { "[WS] 🎉 Tous les joueurs ont terminé la vidéo, le statut de la room passe à SUBTITLE_PHASE" }
            room.phaseEndTimestamp = System.currentTimeMillis() + 60_000

            val scheduler = Executors.newSingleThreadScheduledExecutor()
            scheduler.schedule({
                transitionToWatchAllClips(room)
                scheduler.shutdown()
            }, 60, TimeUnit.SECONDS)
        }

        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/status/subtitle-phase/submit-subtitle")
    fun submitSubtitle(
        @Payload input: String,
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.error { "[WS] SESSIONID is missing in session attributes" }
            return
        }
        
        val room = gameService.getRoomById(roomId) ?: return

        if (room.status != RoomStatus.SUBTITLE_PHASE) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut SUBTITLE_PHASE, action ignorée." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null) {
            logger.warn { "[WS] ⚠️ Aucun joueur trouvé pour session $sessionId dans la room $roomId" }
            return
        }

        player.input = input.trim()
        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/status/subtitle-phase/ready-subtitle")
    fun readySubtitle(
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.error { "[WS] SESSIONID is missing in session attributes" }
            return
        }
        
        val room = gameService.getRoomById(roomId) ?: return
        if (room.status != RoomStatus.SUBTITLE_PHASE) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut SUBTITLE_PHASE, action ignorée." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null) {
            logger.warn { "[WS] ⚠️ Aucun joueur trouvé pour session $sessionId dans la room $roomId" }
            return
        }
        player.hasSubtitleReady = true
        val allReady = room.players.all { it.hasSubtitleReady }
        if (allReady) {
            logger.info { "[WS] ✅ Tous les joueurs ont indiqué qu'ils ont terminé" }
            transitionToWatchAllClips(room)
        }
        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/status/watching-all-clips/stopwatch")
    fun watchinAllClipsStopwatch(
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.error { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val room = gameService.getRoomById(roomId) ?: return

        if (room.status != RoomStatus.WATCHING_ALL_CLIPS) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut WATCHING_ALL_CLIPS, action ignorée." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null) {
            logger.warn { "[WS] ⚠️ Aucun joueur trouvé pour session $sessionId dans la room $roomId" }
            return
        }

        player.isWatching = false
        logger.info { "[WS] 🕒 Player ${player.nickname} a terminé de regarder la vidéo." }

        if (room.players.all { !it.isWatching }) {
            room.status = RoomStatus.VOTE_PHASE
            logger.info { "[WS] 🎉 Tous les joueurs ont terminé la vidéo, le statut de la room passe à VOTE_PHASE" }
            room.phaseEndTimestamp = System.currentTimeMillis() + 60_000

            val scheduler = Executors.newSingleThreadScheduledExecutor()
            scheduler.schedule({
                transitionToVoteResults(room)
                scheduler.shutdown()
            }, 60, TimeUnit.SECONDS)
        }

        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/status/vote-phase/vote")
    fun vote(
        @Payload playerSubtitleId: String,
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.error { "[WS] SESSIONID is missing in session attributes" }
            return
        }
        
        val room = gameService.getRoomById(roomId) ?: return
        if (room.status != RoomStatus.VOTE_PHASE) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut VOTE_PHASE, action ignorée." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null) {
            logger.warn { "[WS] ⚠️ Aucun joueur trouvé pour session $sessionId dans la room $roomId" }
            return
        }
        if (player.hasVoted) {
            logger.warn { "[WS] ⚠️ Le joueur ${player.nickname} a déjà voté. Action ignorée." }
            return
        }

        val subtitle = room.shuffledPlayerInputs.find { it.id == playerSubtitleId }
        if (subtitle == null) {
            logger.warn { "[WS] ⚠️ Aucun PlayerSubtitle trouvé avec l'id $playerSubtitleId dans la room $roomId" }
            return
        }

        if (subtitle.playerSessionId == sessionId) {
            logger.warn { "[WS] 🚫 Le joueur ${player.nickname} a tenté de voter pour son propre sous-titre. Action ignorée." }
            return
        }

        player.hasVoted = true
        subtitle.voteCount += 1
        logger.info { "[WS] ✅ Vote enregistré pour subtitle ${subtitle.id} (total votes: ${subtitle.voteCount})" }

        if (room.players.all { it.hasVoted }) {
            logger.info { "[WS] 🎯 Tous les joueurs ont voté, on passe directement à VOTE_RESULTS" }
            transitionToVoteResults(room)
        }
    }

    @MessageMapping("/rooms/{roomId}/status/vote-results/results-watched")
    fun resultsWatched(
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.error { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val room = gameService.getRoomById(roomId) ?: return
        if (room.status != RoomStatus.VOTE_RESULTS) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut VOTE_RESULTS, action ignorée." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId } ?: return
        player.hasWatchedResults = true
        logger.info { "[WS] 👁️ Le joueur ${player.nickname} a vu les résultats." }
        transitionToNextRoundOrPodium(room)
    }

    private fun loadRandomClipAndSubtitles(room: Room) {
        val allClips = clipRepository.findAll()
        val availableClips = allClips.filterNot { room.playedClips.contains(it.filename) }
        val selectedClip = when {
            availableClips.isNotEmpty() -> availableClips.random()
            allClips.isNotEmpty() -> {
                logger.info { "[WS] 🔁 Tous les clips ont été joués, réinitialisation..." }
                room.playedClips.clear()
                allClips.random()
            }
            else -> null
        }
        if (selectedClip != null) {
            room.currentClip = selectedClip.filename
            room.playedClips.add(selectedClip.filename)
            val subtitlesFromDb = subtitleRepository.findByClipId(selectedClip.id)
            room.subtitles = subtitlesFromDb.map {
                Subtitle(
                    locale = it.locale,
                    content = it.content,
                    editable = it.editable,
                    startTime = it.startTime,
                    endTime = it.endTime
                )
            }
            logger.info { "[WS] 🎬 Clip sélectionné : ${selectedClip.filename}" }
            logger.info { "[WS] 📜 ${room.subtitles.size} sous-titres chargés." }
        } else {
            logger.error { "[WS] ❌ Aucun clip disponible." }
        }
    }

    fun transitionToWatchAllClips(room: Room) {
        synchronized(room) {
            if (room.status != RoomStatus.SUBTITLE_PHASE) return
            room.phaseEndTimestamp = null
            val inputs = room.players
                .mapNotNull { player ->
                    val content = player.input?.trim()
                    if (!content.isNullOrBlank()) {
                        PlayerSubtitle(
                            id = UUID.randomUUID().toString(),
                            content = content,
                            playerSessionId = player.sessionId
                        )
                    } else null
                }
                .shuffled()
            room.shuffledPlayerInputs = inputs
            logger.info { "[WS] 🎭 Inputs anonymisés et mélangés : $inputs" }

            if (inputs.isEmpty()) {
                logger.warn { "[WS] ⚠️ Aucun input reçu, transition immédiate vers prochaine phase." }
                transitionToNextRoundOrPodium(room)
                return
            }

            room.players.forEach {
                it.isWatching = true
                it.hasSubtitleReady = false
            }
            room.status = RoomStatus.WATCHING_ALL_CLIPS
            logger.info { "[WS] 🎬 Transition vers ${RoomStatus.WATCHING_ALL_CLIPS}" }
            room.players.forEach {
                messagingTemplate.convertAndSend("/user/${it.sessionToken}/room/${room.id}", room)
            }
        }
    }

    fun transitionToNextRoundOrPodium(room: Room) {
        room.players.forEach {
            it.hasVoted = false
            it.hasWatchedResults = false
            it.input = ""
            it.isWatching = true
        }

        for (subtitle in room.shuffledPlayerInputs) {
            val player = room.players.find { it.sessionId == subtitle.playerSessionId }
            if (player != null) {
                player.points += subtitle.voteCount
                logger.info { "[WS] 🏅 ${player.nickname} gagne ${subtitle.voteCount} point(s), total = ${player.points}" }
            }
        }

        room.shuffledPlayerInputs = emptyList()
        room.voteResults = emptyList()
        room.phaseEndTimestamp = null

        if (room.round < room.maxRounds) {
            room.round += 1
            room.status = RoomStatus.WATCHING_CLIP
            loadRandomClipAndSubtitles(room)
            logger.info { "[WS] 🔁 Round ${room.round} initialisé, envoi de la room à tous les joueurs." }
        } else {
            room.status = RoomStatus.PODIUM
            logger.info { "[WS] 🏅 Room status set to podium" }
        }

        sendRoomToAllPlayers(room)
    }

    @MessageMapping("/rooms/{roomId}/restart")
    fun restartGame(
        @DestinationVariable roomId: String,
        headerAccessor: SimpMessageHeaderAccessor
    ) {
        val sessionId = headerAccessor.sessionAttributes?.get("SESSIONID") as? String
        if (sessionId.isNullOrBlank()) {
            logger.warn { "[WS] SESSIONID is missing in session attributes" }
            return
        }

        val room = gameService.getRoomById(roomId) ?: return

        if (room.status != RoomStatus.PODIUM) {
            logger.warn { "[WS] ⚠️ La room $roomId n'est pas dans le statut PODIUM, redémarrage refusé." }
            return
        }

        val player = room.players.find { it.sessionId == sessionId }
        if (player == null || !player.isLeader) {
            logger.warn { "[WS] ❌ Le joueur $sessionId n'est pas leader ou introuvable, redémarrage refusé." }
            return
        }

        // Reset room fields
        room.status = RoomStatus.LOBBY
        room.round = 1
        room.currentClip = ""
        room.phaseEndTimestamp = null
        room.shuffledPlayerInputs = emptyList()
        room.voteResults = emptyList()
        room.playedClips.clear()

        // Reset players
        room.players.forEach { p ->
            p.isWatching = false
            p.hasSubtitleReady = false
            p.hasVoted = false
            p.hasWatchedResults = false
            p.points = 0
            p.input = ""
        }

        logger.info { "[WS] 🔁 Le leader ${player.nickname} a redémarré la room $roomId." }
        sendRoomToAllPlayers(room)
    }

    private fun transitionToVoteResults(room: Room) {
        synchronized(room) {
            if (room.status != RoomStatus.VOTE_PHASE) return
            room.status = RoomStatus.VOTE_RESULTS
            val results = room.shuffledPlayerInputs
                .filter { it.voteCount > 0 }
                .map { subtitle ->
                    val player = room.players.find { it.sessionId == subtitle.playerSessionId }
                    VoteResult(
                        voteCount = subtitle.voteCount,
                        content = subtitle.content,
                        nickname = player?.nickname ?: "?"
                    )
                }
            room.voteResults = results
            sendRoomToAllPlayers(room)
            logger.info { "[WS] 📊 Tous les votes sont traités, passage à VOTE_RESULTS" }
        }
    }

    private fun sendRoomToAllPlayers(room: Room) {
        for (player in room.players) {
            val personalizedRoom = room.copy(
                players = room.players.map { p ->
                    if (p.sessionId == player.sessionId) p.copy(isMe = true)
                    else p.copy(isMe = false)
                }.toMutableList(),
                shuffledPlayerInputs = room.shuffledPlayerInputs.map { subtitle ->
                    subtitle.copy(isMine = subtitle.playerSessionId == player.sessionId)
                }
            )
            logger.info { "[WS] 📡 Sending room state to player sessionToken=${player.sessionToken}" }
            messagingTemplate.convertAndSend("/user/${player.sessionToken}/room/${room.id}", personalizedRoom)
        }
    }
}