'use client'

export default function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton-item">
          <div className="skeleton-line skeleton-line-title"></div>
          <div className="skeleton-line skeleton-line-text"></div>
          <div className="skeleton-line skeleton-line-text"></div>
        </div>
      ))}
    </div>
  )
}

