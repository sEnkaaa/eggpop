import `fun`.eggpop.backend.websocket.model.Player
import `fun`.eggpop.backend.websocket.service.GameService
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test

class GameServiceTest {

    private lateinit var gameService: GameService

    @BeforeEach
    fun setup() {
        gameService = GameService()
    }

    @Test
    fun `createRoom should create a room with the creator as the only player`() {
        val creator = Player(
            id = "player1",
            sessionId = "sess1",
            sessionToken = "token1",
            nickname = "Alice",
            avatar = "avatar1"
        )
        val room = gameService.createRoom(creator)

        assertNotNull(room.id)
        assertEquals(1, room.players.size)
        assertEquals(creator, room.players[0])
    }

    @Test
    fun `addPlayerToRoom should add a player to an existing room`() {
        val creator = Player(
            id = "player1",
            sessionId = "sess1",
            sessionToken = "token1",
            nickname = "Alice",
            avatar = "avatar1"
        )
        val newPlayer = Player(
            id = "player2",
            sessionId = "sess2",
            sessionToken = "token2",
            nickname = "Bob",
            avatar = "avatar2"
        )

        val room = gameService.createRoom(creator)
        val updatedRoom = gameService.addPlayerToRoom(room.id, newPlayer)

        assertNotNull(updatedRoom)
        assertEquals(2, updatedRoom!!.players.size)
        assertTrue(updatedRoom.players.contains(creator))
        assertTrue(updatedRoom.players.contains(newPlayer))
    }

    @Test
    fun `addPlayerToRoom should return null when room does not exist`() {
        val player = Player(
            id = "player1",
            sessionId = "sess1",
            sessionToken = "token1",
            nickname = "Alice",
            avatar = "avatar1"
        )
        val result = gameService.addPlayerToRoom("nonexistentRoomId", player)
        assertNull(result)
    }

    @Test
    fun `getRoomById should return the correct room`() {
        val creator = Player(
            id = "player1",
            sessionId = "sess1",
            sessionToken = "token1",
            nickname = "Alice",
            avatar = "avatar1"
        )
        val createdRoom = gameService.createRoom(creator)

        val fetchedRoom = gameService.getRoomById(createdRoom.id)

        assertNotNull(fetchedRoom)
        assertEquals(createdRoom.id, fetchedRoom?.id)
        assertEquals(createdRoom.players, fetchedRoom?.players)
    }

    @Test
    fun `getRooms should return all created rooms`() {
       val creator1 = Player(
            id = "player1",
            sessionId = "sess1",
            sessionToken = "token1",
            nickname = "Alice",
            avatar = "avatar1"
        )
        val creator2 = Player(
            id = "player2",
            sessionId = "sess2",
            sessionToken = "token2",
            nickname = "Bob",
            avatar = "avatar2"
        )

        gameService.createRoom(creator1)
        gameService.createRoom(creator2)

        val rooms = gameService.getRooms()
        assertEquals(2, rooms.size)
    }
}
