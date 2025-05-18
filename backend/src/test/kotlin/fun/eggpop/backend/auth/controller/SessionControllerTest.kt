package `fun`.eggpop.backend.auth.controller

import org.junit.jupiter.api.Test
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.assertj.core.api.Assertions.assertThat
import jakarta.servlet.http.Cookie

@WebMvcTest(SessionController::class)
class SessionControllerTest {

    @Autowired
    lateinit var mockMvc: MockMvc

    @Test
    fun `GET on session should return token and set cookie if not present`() {
        val mvcResult = mockMvc.get("/session")
            .andReturn()

        val sessionIdCookie = mvcResult.response.getCookie("SESSIONID")
        assertThat(sessionIdCookie).isNotNull()
        assertThat(sessionIdCookie!!.isHttpOnly).isTrue()
    }

    @Test
    fun `GET on session with existing SESSIONID cookie should return token and not set new cookie`() {
        val existingId = "existing-session-id"
        val jakartaCookie = Cookie("SESSIONID", existingId)

        val mvcResult = mockMvc.get("/session") {
            cookie(jakartaCookie)
        }
            .andExpect {
                status { isOk() }
                jsonPath("$.token") { exists() }
            }
            .andReturn()

        val setCookieHeaders = mvcResult.response.getHeaders("Set-Cookie")
        assertThat(setCookieHeaders).isEmpty()
    }
}
