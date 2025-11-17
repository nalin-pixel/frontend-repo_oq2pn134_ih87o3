import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Editor from './components/Editor'

function App() {
  const [activeSection, setActiveSection] = useState(null)
  const [docs, setDocs] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const loadDocs = async (sectionId) => {
    if (!sectionId) return
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/docs?section_id=${sectionId}`)
    const data = await res.json()
    setDocs(data)
  }

  useEffect(() => {
    if (activeSection?.id) loadDocs(activeSection.id)
  }, [activeSection])

  const createDoc = async () => {
    if (!activeSection?.id || !title.trim()) return
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/docs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        section_id: activeSection.id,
        title,
        content,
        tags: [],
        cover_image: null,
      })
    })
    setTitle('')
    setContent('')
    await loadDocs(activeSection.id)
  }

  return (
    <div className="min-h-screen grid grid-cols-[18rem_1fr]">
      <Sidebar onSelect={setActiveSection} activeId={activeSection?.id} />
      <main className="h-screen overflow-hidden flex flex-col">
        <header className="p-4 border-b bg-white">
          <h1 className="text-2xl font-bold">Documentación de Sistemas Operativos</h1>
          <p className="text-gray-600">Crea secciones, añade artículos con imágenes y organiza tu contenido.</p>
        </header>

        <div className="flex-1 grid grid-cols-2 gap-4 p-4 overflow-auto bg-gray-50">
          <section className="bg-white rounded-lg border p-4 flex flex-col">
            <h2 className="font-semibold mb-2">Nuevo documento</h2>
            {!activeSection && (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-3">
                Selecciona una sección para empezar.
              </div>
            )}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título"
              className="border rounded px-3 py-2 mb-3"
            />
            <Editor value={content} onChange={setContent} />
            <div className="mt-3 flex justify-end">
              <button onClick={createDoc} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50" disabled={!activeSection?.id || !title.trim()}>
                Guardar documento
              </button>
            </div>
          </section>

          <section className="bg-white rounded-lg border p-4">
            <h2 className="font-semibold mb-3">Documentos en "{activeSection?.title || '—'}"</h2>
            {docs.length === 0 ? (
              <div className="text-gray-500 text-sm">No hay documentos todavía.</div>
            ) : (
              <ul className="space-y-3">
                {docs.map(d => (
                  <li key={d.id} className="border rounded p-3">
                    <div className="font-medium">{d.title}</div>
                    <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: d.content }} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
