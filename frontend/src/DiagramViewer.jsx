import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

mermaid.initialize({ startOnLoad: false, theme: 'dark' })

function DiagramViewer({ code, label }) {
  const containerRef = useRef(null)
  const [error, setError] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!code) return
    setReady(false)

    const renderId = 'diagram-' + Math.random().toString(36).slice(2)

    mermaid
      .render(renderId, code)
      .then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg
        }
        setError(null)
        setReady(true)
      })
      .catch((err) => {
        setError('Could not render this diagram: ' + err.message)
      })
  }, [code])

    const handleDownload = () => {
    const svgElement = containerRef.current?.querySelector('svg')
    if (!svgElement) return

    const viewBox = svgElement.getAttribute('viewBox')
    let width = 800
    let height = 600
    if (viewBox) {
      const parts = viewBox.split(' ').map(Number)
      width = parts[2] || width
      height = parts[3] || height
    }

    const scale = 2
    const clone = svgElement.cloneNode(true)
    clone.setAttribute('width', width)
    clone.setAttribute('height', height)
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')

    const svgString = new XMLSerializer().serializeToString(clone)

    // Base64 data URI instead of a Blob URL — avoids canvas "tainted" security errors
    const svg64 = btoa(unescape(encodeURIComponent(svgString)))
    const imageSrc = 'data:image/svg+xml;base64,' + svg64

    const img = new Image()

    img.onerror = (e) => {
      console.error('Failed to load SVG as image:', e)
      alert('Could not convert this diagram to an image.')
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width * scale
      canvas.height = height * scale
      const ctx = canvas.getContext('2d')

      ctx.fillStyle = '#171923'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.scale(scale, scale)
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          alert('Canvas could not generate the image.')
          return
        }
        const pngUrl = URL.createObjectURL(pngBlob)
        const link = document.createElement('a')
        link.href = pngUrl
        link.download = `${(label || 'diagram').replace(/\s+/g, '-').toLowerCase()}.png`
        link.click()
        URL.revokeObjectURL(pngUrl)
      }, 'image/png')
    }

    img.src = imageSrc
  }

  if (error) {
    return <p style={{ color: '#f87171' }}>{error}</p>
  }

  return (
    <div>
      <div ref={containerRef} className="diagram-container" />
      {ready && (
        <button className="download-btn" onClick={handleDownload}>
          Download PNG
        </button>
      )}
    </div>
  )
}

export default DiagramViewer