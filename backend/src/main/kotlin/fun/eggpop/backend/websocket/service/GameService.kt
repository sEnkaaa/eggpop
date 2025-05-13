package `fun`.eggpop.backend.websocket.service

import org.springframework.stereotype.Service
import `fun`.eggpop.backend.websocket.model.Room
import `fun`.eggpop.backend.websocket.model.Player
import java.util.*
import kotlin.random.Random

@Service
class GameService {
    private val rooms: MutableList<Room> = mutableListOf()

    fun createRoom(creator: Player): Room {
        var roomId: String
        do {
            roomId = generateRoomId()
        } while (rooms.any { it.id == roomId })  
        val room = Room(
            id = roomId,
            players = mutableListOf(creator)
        )
        rooms.add(room)
        return room
    }

    fun getRooms(): List<Room> {
        return rooms
    }

    fun addPlayerToRoom(roomId: String, player: Player): Room? {
        val room = rooms.find { it.id == roomId }
        return if (room != null) {
            room.players.add(player)
            room
        } else {
            null
        }
    }

    fun getRoomById(roomId: String): Room? {
        return rooms.find { it.id == roomId }
    }

    private fun generateRoomId(): String {
        val letters = "abcdefghijklmnopqrstuvwxyz"
        return (1..5)
            .map { letters.random() }
            .joinToString("")
    }
}