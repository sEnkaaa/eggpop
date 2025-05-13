package `fun`.eggpop.backend.repository

import `fun`.eggpop.backend.model.Clip
import org.springframework.data.jpa.repository.JpaRepository

interface ClipRepository : JpaRepository<Clip, Long>