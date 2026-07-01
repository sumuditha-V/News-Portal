export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function extractErrorMessage(err, fallback = 'Something went wrong.') {
  if (!err) return fallback
  const data = err.response?.data
  if (typeof data === 'string') return data
  if (data?.message) return data.message
  if (data?.title) return data.title
  if (err.message) return err.message
  return fallback
}

export function safeHttpUrl(value) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null
  } catch {
    return null
  }
}
