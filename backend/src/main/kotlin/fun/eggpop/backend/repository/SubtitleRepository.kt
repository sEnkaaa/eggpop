package `fun`.eggpop.backend.repository

import `fun`.eggpop.backend.model.Subtitle
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface SubtitleRepository : JpaRepository<Subtitle, Long> {
    fun findByClipId(clipId: Long): List<Subtitle>
}