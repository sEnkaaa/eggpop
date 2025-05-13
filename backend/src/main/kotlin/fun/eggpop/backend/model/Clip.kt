package `fun`.eggpop.backend.model

import jakarta.persistence.*

@Entity
@Table(name = "clips")
data class Clip(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    val filename: String
)