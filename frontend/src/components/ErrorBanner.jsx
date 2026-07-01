export default function ErrorBanner({ message, onRetry }) {
  return (
    <div className="error-banner" role="alert">
      <span>{message || 'Something went wrong.'}</span>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry}>Retry</button>
      )}
    </div>
  )
}
