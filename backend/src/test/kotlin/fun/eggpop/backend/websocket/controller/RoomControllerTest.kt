import `fun`.eggpop.backend.websocket.model.Player
import `fun`.eggpop.backend.websocket.model.Room
import `fun`.eggpop.backend.websocket.payload.CreateRoomPayload
import `fun`.eggpop.backend.websocket.payload.CreatorPayload
import `fun`.eggpop.backend.websocket.controller.RoomController
import `fun`.eggpop.backend.websocket.service.GameService
import `fun`.eggpop.backend.repository.ClipRepository
import `fun`.eggpop.backend.repository.SubtitleRepository
import io.mockk.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.messaging.simp.SimpMessageHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import java.util.*
import kotlin.test.assertEquals
import org.junit.jupiter.api.Assertions.*

class TestableRoomController(
    gameService: GameService,
    clipRepository: ClipRepository,
    subtitleRepository: SubtitleRepository,
    messagingTemplate: SimpMessagingTemplate
) : RoomController(gameService, clipRepository, subtitleRepository, messagingTemplate) {
    public override fun sendRoomToAllPlayers(room: Room) {
        super.sendRoomToAllPlayers(room)
    }
}

class RoomControllerTest {

    private lateinit var gameService: GameService
    private lateinit var clipRepository: ClipRepository
    private lateinit var subtitleRepository: SubtitleRepository
    private lateinit var messagingTemplate: SimpMessagingTemplate

    private lateinit var controller: TestableRoomController

    @BeforeEach
    fun setup() {
        gameService = mockk()
        clipRepository = mockk(relaxed = true)
        subtitleRepository = mockk(relaxed = true)
        messagingTemplate = mockk(relaxed = true)

        controller = spyk(TestableRoomController(gameService, clipRepository, subtitleRepository, messagingTemplate))
    }

    @Test
    fun `createRoom should create room and send personalized room message`() {
        val sessionId = "sess123"
        val sessionToken = "token123"
        val nickname = "Alice"
        val avatar = "avatar1"

        val creatorPayload = CreatorPayload(nickname = nickname, avatar = avatar)
        val payload = CreateRoomPayload(creator = creatorPayload)

        val headerAccessor = mockk<SimpMessageHeaderAccessor>()
        val sessionAttributes = mutableMapOf<String, Any>(
            "SESSIONID" to sessionId,
            "SESSIONTOKEN" to sessionToken
        )
        every { headerAccessor.sessionAttributes } returns sessionAttributes

        val createdRoom = Room(
            id = "room1",
            players = mutableListOf(
                Player(
                    id = "player1",
                    sessionId = sessionId,
                    sessionToken = sessionToken,
                    nickname = nickname,
                    avatar = avatar,
                    isLeader = true
                )
            )
        )

        every { gameService.createRoom(any()) } returns createdRoom
        every { gameService.getRooms() } returns listOf(createdRoom)
        every { messagingTemplate.convertAndSend(any<String>(), any<Any>()) } just Runs

        controller.createRoom(payload, headerAccessor)

        verify {
            gameService.createRoom(withArg {
                assertEquals(nickname, it.nickname)
                assertEquals(avatar, it.avatar)
                assertEquals(sessionId, it.sessionId)
                assertEquals(sessionToken, it.sessionToken)
                assert(it.isLeader)
            })

             messagingTemplate.convertAndSend(
                eq("/user/$sessionToken/room/created"),
                match<Room> {
                    assertEquals(createdRoom.id, it.id)
                    assertEquals(1, it.players.size)
                    assert(it.players[0].isMe)
                    true
                }
            )
        }
    }

    @Test
    fun `kickPlayer should remove player, notify others and call sendRoomToAllPlayers - diagnostic`() {
        val roomId = "room1"
        val leaderSessionId = "sess-leader"
        val kickedPlayerId = "player-kicked"
        val kickedPlayerToken = "token-kicked"
        val leaderToken = "token-leader"

        val leader = Player(
            id = "leader-id",
            sessionId = leaderSessionId,
            sessionToken = leaderToken,
            nickname = "Leader",
            avatar = "avatar1",
            isLeader = true
        )
        val playerToKick = Player(
            id = kickedPlayerId,
            sessionId = "sess-kicked",
            sessionToken = kickedPlayerToken,
            nickname = "KickedPlayer",
            avatar = "avatar2",
            isLeader = false
        )
        val otherPlayer = Player(
            id = "player-other",
            sessionId = "sess-other",
            sessionToken = "token-other",
            nickname = "Other",
            avatar = "avatar3",
            isLeader = false
        )

        val room = Room(
            id = roomId,
            players = mutableListOf(leader, playerToKick, otherPlayer)
        )

        val headerAccessor = mockk<SimpMessageHeaderAccessor>()
        every { headerAccessor.sessionAttributes } returns mapOf("SESSIONID" to leaderSessionId)

        every { gameService.getRoomById(roomId) } returns room
        every { messagingTemplate.convertAndSend(any<String>(), any<Any>()) } just Runs
        every { controller.sendRoomToAllPlayers(any()) } just Runs

        println("Before kick, players in room: ${room.players.map { it.id }}")

        controller.kickPlayer(roomId, kickedPlayerId, headerAccessor)

        println("After kick, players in room: ${room.players.map { it.id }}")

        val containsById = room.players.any { it.id == kickedPlayerId }
        println("Contains kickedPlayer by id? $containsById")

        assertFalse(containsById, "Le joueur kické ne doit plus être dans la liste (vérifié par id)")

        verify {
            messagingTemplate.convertAndSend(
                "/user/$kickedPlayerToken/error",
                "You have been kicked from the room."
            )
            messagingTemplate.convertAndSend(
                "/user/${leader.sessionToken}/info",
                "KickedPlayer has been kicked from the room"
            )
            messagingTemplate.convertAndSend(
                "/user/${otherPlayer.sessionToken}/info",
                "KickedPlayer has been kicked from the room"
            )
            controller.sendRoomToAllPlayers(room)
        }
    }

    @Test
    fun `makeLeader should transfer leadership and notify players`() {
        val roomId = "room1"
        val leaderSessionId = "sess-leader"
        val newLeaderId = "player2"
        val leaderToken = "token-leader"
        val newLeaderToken = "token-player2"
        val otherToken = "token-player3"

        val leader = Player(
            id = "player1",
            sessionId = leaderSessionId,
            sessionToken = leaderToken,
            nickname = "Leader",
            avatar = "avatar1",
            isLeader = true
        )
        val newLeader = Player(
            id = newLeaderId,
            sessionId = "sess-player2",
            sessionToken = newLeaderToken,
            nickname = "NewLeader",
            avatar = "avatar2",
            isLeader = false
        )
        val otherPlayer = Player(
            id = "player3",
            sessionId = "sess-player3",
            sessionToken = otherToken,
            nickname = "Other",
            avatar = "avatar3",
            isLeader = false
        )

        val room = Room(
            id = roomId,
            players = mutableListOf(leader, newLeader, otherPlayer)
        )

        val headerAccessor = mockk<SimpMessageHeaderAccessor>()
        every { headerAccessor.sessionAttributes } returns mapOf("SESSIONID" to leaderSessionId)

        every { gameService.getRoomById(roomId) } returns room
        every { messagingTemplate.convertAndSend(any<String>(), any<String>()) } just Runs
        every { controller.sendRoomToAllPlayers(any()) } just Runs

        controller.makeLeader(roomId, newLeaderId, headerAccessor)

        assertTrue(newLeader.isLeader, "New leader should now be marked as leader")
        assertFalse(leader.isLeader, "Old leader should no longer be marked as leader")

        verify(exactly = 1) {
            messagingTemplate.convertAndSend("/user/$leaderToken/info", "${newLeader.nickname} is now the new leader.")
            messagingTemplate.convertAndSend("/user/$newLeaderToken/info", "${newLeader.nickname} is now the new leader.")
            messagingTemplate.convertAndSend("/user/$otherToken/info", "${newLeader.nickname} is now the new leader.")
            controller.sendRoomToAllPlayers(room)
        }
    }
}