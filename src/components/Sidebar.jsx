import { useEffect, useState } from 'react'

export default function Sidebar({ onSelect, activeId }) {
  const [sections, setSections] = useState([])
  const [title, setTitle] = useState('')

  const load = async () => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sections`)
    const data = await res.json()
    setSections(data)
  }

  useEffect(() => {
    load()
  }, [])

  const addSection = async () => {
    if (!title.trim()) return
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description: '', order: sections.length })
    })
    setTitle('')
    await load()
  }

  return (
    <aside className="w-72 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Secciones</h2>
        <div className="mt-2 flex gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nueva sección"
            className="flex-1 border rounded px-2 py-1"
          />
          <button onClick={addSection} className="px-3 py-1 bg-blue-600 text-white rounded">Añadir</button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${activeId === s.id ? 'bg-blue-50 text-blue-700' : ''}`}
          >
            <div className="font-medium">{s.title}</div>
            {s.description && <div className="text-xs text-gray-500">{s.description}</div>}
          </button>
        ))}
      </div>
    </aside>
  )
}
