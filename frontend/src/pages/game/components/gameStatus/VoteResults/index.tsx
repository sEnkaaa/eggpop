import React, { useEffect, useState } from "react"
import styles from './vote-results.module.scss'
import useApp from "../../../../../utils/hooks/useApp"
import useGame from "../../../../../utils/hooks/useGame"

type VoteResult = {
    content: string
    voteCount: number
    nickname: string
}

const VoteResults: React.FC = () => {
    const { ws } = useApp()
    const { room } = useGame()

    const [currentVotes, setCurrentVotes] = useState<number>(0)
    const [displayedResult, setDisplayedResult] = useState<VoteResult | null>(null)

    useEffect(() => {
        const sortedResults = [...room.voteResults].sort((a, b) => a.voteCount - b.voteCount)

        const showResults = async () => {
            await delay(2000)

            for (let i = 0; i < sortedResults.length; i++) {
                const result = sortedResults[i]
                setDisplayedResult(result)
                setCurrentVotes(0)

                await delay(2000)

                for (let v = 1; v <= result.voteCount; v++) {
                    setCurrentVotes(v)
                    await delay(500)
                }

                await delay(2000)
            }

            ws.send(`/app/rooms/${room?.id}/status/vote-results/results-watched`)
        }

        showResults()
    }, [room.voteResults])

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    return (
        <div className={styles['vote-results']}>
            <div className={styles['results-title']}>
                {`Résultats du round ${room.round}/4`}
            </div>

            <div className={styles['result-content']}>
                {displayedResult && (
                    <div className={styles['subtitle-block']}>
                        <div className={styles['subtitle']}>"{displayedResult.content}"</div>
                        <div className={styles['nickname']}>— {displayedResult.nickname}</div>
                        {currentVotes > 0 && (
                            <div className={styles['vote-count']}>
                                +{currentVotes} vote{currentVotes > 1 ? "s" : ""}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default VoteResults
