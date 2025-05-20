package `fun`.eggpop.backend.websocket.service

import `fun`.eggpop.backend.websocket.model.Room
import `fun`.eggpop.backend.websocket.model.Player
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.*
import kotlin.random.Random
import java.time.Instant

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

    @Scheduled(fixedRate = 60000)
    fun scheduledCleanup() {
        println("Scheduled cleanup running...")
        cleanOldRooms()
    }
    
    fun cleanOldRooms(maxAgeMinutes: Long = 120) {
        val cutoff = Instant.now().minusSeconds(maxAgeMinutes * 60)
        rooms.removeIf { it.lastActivityAt.isBefore(cutoff) }
    }

    private fun generateRoomId(): String {
        val letters = "abcdefghijklmnopqrstuvwxyz"
        return (1..5)
            .map { letters.random() }
            .joinToString("")
    }
}