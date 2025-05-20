package `fun`.eggpop.backend

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
@EnableScheduling
class EggpopBackendApplication

fun main(args: Array<String>) {
	runApplication<EggpopBackendApplication>(*args)
}

@RestController
class HomeController {
    @GetMapping("/")
    fun home(): String {
        return "Hello, Eggpop!"
    }
}