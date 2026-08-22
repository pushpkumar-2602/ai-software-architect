import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'dark' })

function DiagramViewer({ code }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!code) return

    const renderId = 'diagram-' + Math.random().toString(36).slice(2)

    mermaid
      .render(renderId, code)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
        setError(null)
      })
      .catch((err) => {
        setError('Could not render this diagram: ' + err.message)
      })
  }, [code])

  if (error) {
    return <p style={{ color: '#f87171' }}>{error}</p>
  }

  return <div ref={containerRef} className="diagram-container" />
}

export default DiagramViewer