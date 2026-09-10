import { useState } from 'react'
import { Heart } from 'lucide-react'

// An <img> that never breaks the layout if the file is missing. If the image
// fails to load, it swaps to a soft branded placeholder instead of the
// browser's broken-image icon.
export default function SafeImage({ src, alt = '', className = '', style = {}, onClick }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    return (
      <div
        className={className}
        onClick={onClick}
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(160deg, #161c38, #0b0e1a)',
          color: 'rgba(246,241,234,0.35)',
        }}
      >
        <Heart size={28} strokeWidth={1.2} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onClick={onClick}
      onError={() => setFailed(true)}
    />
  )
}
