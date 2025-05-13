package `fun`.eggpop.backend.websocket.config

import org.springframework.http.HttpStatus
import org.springframework.web.socket.server.HandshakeInterceptor
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.WebSocketSession

class WebSocketSessionInterceptor : HandshakeInterceptor {

    override fun beforeHandshake(
        request: ServerHttpRequest, 
        response: ServerHttpResponse, 
        wsHandler: WebSocketHandler, 
        attributes: MutableMap<String, Any>
    ): Boolean {
        val cookiesHeader = request.headers.get("Cookie")
        val cookies = cookiesHeader?.firstOrNull()?.split(";")?.associate {
            val (key, value) = it.split("=")
            key.trim() to value.trim()
        } ?: emptyMap()
        val sessionId = cookies["SESSIONID"]
       if (sessionId != null) {
            attributes["SESSIONID"] = sessionId
            return true
        }
        if (response is org.springframework.http.server.ServletServerHttpResponse) {
            response.servletResponse.status = HttpStatus.FORBIDDEN.value()
        }
        return false 
    }

    override fun afterHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        exception: Exception?
    ) {
        // Pas d'action ici pour l'instant
    }
}