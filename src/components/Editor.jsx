import { useCallback, useMemo, useState } from 'react'

/*
 A lightweight rich text editor using contenteditable with markdown-ish output.
 Supports bold/italic/underline, headings, lists, code, and image upload via backend.
*/

const ToolbarButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="px-2 py-1 rounded hover:bg-gray-100 text-sm font-medium"
    type="button"
  >
    {children}
  </button>
)

export default function Editor({ value, onChange, onUpload }) {
  const [html, setHtml] = useState(value || '')

  const exec = useCallback((cmd, val = null) => {
    document.execCommand(cmd, false, val)
  }, [])

  const onInput = useCallback((e) => {
    const newHtml = e.currentTarget.innerHTML
    setHtml(newHtml)
    onChange && onChange(newHtml)
  }, [onChange])

  const handleImage = async (file) => {
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/upload`, {
      method: 'POST',
      body: form,
    })
    const data = await res.json()
    if (data?.url) {
      // insert image tag
      exec('insertImage', `${import.meta.env.VITE_BACKEND_URL}${data.url}`)
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex gap-1 items-center border-b px-2 py-1 bg-gray-50">
        <ToolbarButton onClick={() => exec('bold')}>Bold</ToolbarButton>
        <ToolbarButton onClick={() => exec('italic')}>Italic</ToolbarButton>
        <ToolbarButton onClick={() => exec('underline')}>Underline</ToolbarButton>
        <div className="w-px h-5 bg-gray-200 mx-1" />
        <ToolbarButton onClick={() => exec('formatBlock', 'H1')}>H1</ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'H2')}>H2</ToolbarButton>
        <ToolbarButton onClick={() => exec('insertUnorderedList')}>• List</ToolbarButton>
        <ToolbarButton onClick={() => exec('insertOrderedList')}>1. List</ToolbarButton>
        <ToolbarButton onClick={() => exec('formatBlock', 'PRE')}>Code</ToolbarButton>
        <div className="ml-auto flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImage(e.target.files?.[0])}
            className="text-sm"
          />
        </div>
      </div>
      <div
        contentEditable
        suppressContentEditableWarning
        className="min-h-[200px] p-4 prose prose-sm max-w-none focus:outline-none"
        onInput={onInput}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
