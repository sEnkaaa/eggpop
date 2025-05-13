package `fun`.eggpop.backend.websocket.config

import `fun`.eggpop.backend.websocket.service.GameService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.event.EventListener
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import org.springframework.web.socket.messaging.SessionDisconnectEvent

@Component
class WebSocketEventListener @Autowired constructor(
    private val gameService: GameService,
    private val messagingTemplate: SimpMessagingTemplate
) {
    @EventListener
    fun handleWebSocketDisconnectListener(event: SessionDisconnectEvent) {
        val accessor = StompHeaderAccessor.wrap(event.message)
        val sessionToken = accessor.sessionAttributes?.get("SESSIONTOKEN") as? String

        if (!sessionToken.isNullOrBlank()) {
            val room = gameService.getRooms()
                .find { it.players.any { p -> p.sessionToken == sessionToken } }

            if (room != null) {
                room.players.find { it.sessionToken == sessionToken }?.connected = false

                room.players.forEach { player ->
                    messagingTemplate.convertAndSend(
                        "/user/${player.sessionToken}/room/${room.id}",
                        room
                    )
                }
            }
        }
    }
}