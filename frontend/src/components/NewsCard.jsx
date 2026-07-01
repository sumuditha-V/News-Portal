import { Link } from 'react-router-dom'
import { formatDate, safeHttpUrl } from '../utils/format'

export default function NewsCard({ article, listParams }) {
  const search = new URLSearchParams(listParams).toString()
  const to = `/news/${article.id}${search ? `?${search}` : ''}`
  const imageUrl = safeHttpUrl(article.urlToImage)

  return (
    <article className="news-card">
      <Link to={to} className="news-card-link">
        {imageUrl ? (
          <img
            className="news-card-image"
            src={imageUrl}
            alt=""
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="news-card-image news-card-image-placeholder" aria-hidden="true" />
        )}
        <div className="news-card-body">
          <h2 className="news-card-title">{article.title}</h2>
          {article.description && (
            <p className="news-card-desc">{article.description}</p>
          )}
          <div className="news-card-meta">
            <span>{article.source?.name || 'Unknown source'}</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}
