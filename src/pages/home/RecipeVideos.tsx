import { useState } from 'react'
import { RECIPE_VIDEOS, videoEmbedUrl } from './data'

interface PlayerState {
  index: number
  /** False on first load (no surprise playback); true once a playlist item is chosen. */
  shouldAutoplay: boolean
}

/** 05 Recipe videos: 16:9 YouTube player plus a four-item playlist that swaps and autoplays the video. */
export function RecipeVideos() {
  const [player, setPlayer] = useState<PlayerState>({ index: 0, shouldAutoplay: false })
  const current = RECIPE_VIDEOS[player.index]

  return (
    <section className="vids">
      <div className="wrap">
        <div className="head">
          <div>
            <div className="eyebrow">Let’s makan</div>
            <h2>Cook along with Bestari.</h2>
          </div>
        </div>
        <div className="vgrid">
          <div className="player">
            <iframe
              src={videoEmbedUrl(current.id, player.shouldAutoplay)}
              title={`Bestari video: ${current.title}`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <ul className="vlist" aria-label="Recipe videos">
            {RECIPE_VIDEOS.map((video, index) => {
              const isCurrent = index === player.index
              return (
                <li key={video.id}>
                  <button
                    type="button"
                    className={isCurrent ? 'vi on' : 'vi'}
                    aria-pressed={isCurrent}
                    onClick={() => setPlayer({ index, shouldAutoplay: true })}
                  >
                    <span className="t">
                      <img src={video.thumb} alt="" loading="lazy" />
                    </span>
                    <span className="txt">
                      <span className="kind">{video.kind}</span>
                      <span className="title">{video.title}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
