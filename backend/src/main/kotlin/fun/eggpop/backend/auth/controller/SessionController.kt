package `fun`.eggpop.backend.auth.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import jakarta.servlet.http.Cookie
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import java.util.UUID

data class SessionResponse(
    val token: String
)

@RestController
class SessionController() {
    @GetMapping("/session")
    fun createSession(request: HttpServletRequest, response: HttpServletResponse): SessionResponse {
        val existingCookie = request.cookies?.find { it.name == "SESSIONID" }
        val sessionId: String = if (existingCookie != null) {
            existingCookie.value
        } else {
            val newSessionId = UUID.randomUUID().toString()
            val sessionCookie = Cookie("SESSIONID", newSessionId).apply {
                path = "/"
                isHttpOnly = true
                secure = false // Mettre à true en prod avec HTTPS
                maxAge = 60 * 60 * 24 * 7 // 7 jours
            }
            response.addCookie(sessionCookie)
            newSessionId
        }
        val token = UUID.randomUUID().toString()
        return SessionResponse(token)
    }
}
