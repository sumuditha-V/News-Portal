import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import NewsCard from '../components/NewsCard'
import Spinner from '../components/Spinner'
import ErrorBanner from '../components/ErrorBanner'
import { extractErrorMessage } from '../utils/format'

const CATEGORIES = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']
const COUNTRIES = [
  ['us', 'United States'],
  ['gb', 'United Kingdom'],
  ['in', 'India'],
  ['au', 'Australia'],
  ['ca', 'Canada'],
  ['de', 'Germany'],
  ['fr', 'France'],
  ['jp', 'Japan'],
]

export default function NewsListPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || 'general'
  const country = params.get('country') || 'us'

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async (signal) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/api/news', {
        params: { category, country },
        signal,
      })
      setArticles(data.articles || [])
    } catch (err) {
      if (err.name !== 'CanceledError' && err.code !== 'ERR_CANCELED') {
        setError(extractErrorMessage(err, 'Failed to load news.'))
        setArticles([])
      }
    } finally {
      setLoading(false)
    }
  }, [category, country])

  useEffect(() => {
    const controller = new AbortController()
    load(controller.signal)
    return () => controller.abort()
  }, [load])

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1>Top headlines</h1>
          <p className="muted">Browse the latest stories from public news feeds.</p>
        </div>
        <div className="filters">
          <label>
            <span>Category</span>
            <select value={category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Country</span>
            <select value={country} onChange={(e) => update('country', e.target.value)}>
              {COUNTRIES.map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {loading && <Spinner label="Loading news" />}
      {error && <ErrorBanner message={error} onRetry={() => { const ctrl = new AbortController(); load(ctrl.signal) }} />}

      {!loading && !error && articles.length === 0 && (
        <p className="muted">No articles available for this selection.</p>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="news-grid">
          {articles.map((a) => (
            <NewsCard key={a.id} article={a} listParams={{ category, country }} />
          ))}
        </div>
      )}
    </div>
  )
}
