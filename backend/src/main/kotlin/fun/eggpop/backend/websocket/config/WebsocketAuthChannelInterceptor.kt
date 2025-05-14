package `fun`.eggpop.backend.websocket.config

import org.springframework.stereotype.Component
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.messaging.support.MessageHeaderAccessor
import mu.KotlinLogging

private val logger = KotlinLogging.logger {}

@Component
class WebsocketAuthChannelInterceptor : ChannelInterceptor {
    override fun preSend(message: Message<*>, channel: MessageChannel): Message<*>? {
        val accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor::class.java)
            ?: return message

        if (accessor.command == StompCommand.CONNECT) {
            val nativeHeaders = accessor.toNativeHeaderMap()
            val sessionToken = accessor.getFirstNativeHeader("X-SESSION-TOKEN")

            logger.info { "[WS] Interceptor: All native headers -> $nativeHeaders" }
            logger.info { "[WS] Interceptor: X-SESSION-TOKEN -> $sessionToken" }

            if (!sessionToken.isNullOrBlank()) {
                accessor.sessionAttributes?.put("SESSIONTOKEN", sessionToken)
                logger.info { "[WS] Interceptor: SESSIONTOKEN added to sessionAttributes" }
            } else {
                logger.warn { "[WS] Interceptor: SESSIONTOKEN missing!" }
            }
        }

        return message
    }
}