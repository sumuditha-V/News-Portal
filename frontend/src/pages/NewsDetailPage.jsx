import { useCallback, useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'
import { extractErrorMessage, formatDate, safeHttpUrl } from '../utils/format'

export default function NewsDetailPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const category = params.get('category') || 'general'
  const country = params.get('country') || 'us'

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get(`/api/news/${id}`, { signal })
      setArticle(data)
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        if (err.response?.status === 404) {
          setError('Article not found.')
        } else {
          setError(extractErrorMessage(err, 'Failed to load article.'))
        }
        setArticle(null)
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  const backHref = `/news?category=${category}&country=${country}`
  const imageUrl = safeHttpUrl(article?.urlToImage)

  return (
    <div className="container detail">
      <Link to={backHref} className="back-link">&larr; Back to headlines</Link>

      {loading && <Spinner label="Loading article" />}
      {error && <ErrorBanner message={error} onRetry={() => { const ctrl = new AbortController(); load(ctrl.signal) }} />}

      {!loading && !error && article && (
        <article className="article">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <span>{article.source?.name || 'Unknown source'}</span>
            <span>{formatDate(article.publishedAt)}</span>
            {article.author && <span>by {article.author}</span>}
          </div>

          {imageUrl && (
            <img
              className="article-image"
              src={imageUrl}
              alt=""
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          )}

          {article.description && <p className="article-description">{article.description}</p>}
          {article.content && <p className="article-content">{article.content}</p>}

          {article.url && (
            <p>
              <a className="external-link" href={article.url} target="_blank" rel="noopener noreferrer">
                Read full article at source &rarr;
              </a>
            </p>
          )}
        </article>
      )}
    </div>
  )
}
