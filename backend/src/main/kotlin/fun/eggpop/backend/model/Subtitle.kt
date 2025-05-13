package `fun`.eggpop.backend.model

import java.time.LocalDateTime
import jakarta.persistence.*

@Entity
@Table(name = "subtitles")
data class Subtitle(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clip_id", nullable = false)
    val clip: Clip,

    @Column(nullable = false)
    val locale: String,

    @Column(nullable = false)
    val content: String,

    @Column(nullable = false)
    val startTime: Int,

    @Column(nullable = false)
    val endTime: Int,

    @Column(nullable = false)
    val editable: Boolean = false,

    @Column(name = "created_at", updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
