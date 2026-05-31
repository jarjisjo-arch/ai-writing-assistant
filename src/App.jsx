import { useState, useRef, useCallback } from 'react'
import Toolbar from './components/Toolbar'
import Editor from './components/Editor'
import AIPanel from './components/AIPanel'
import StatusBar from './components/StatusBar'
import ProjectManager from './components/ProjectManager'
import {
  exportAsTxt, exportAsMd, exportAsHtml, exportAsPdf, exportAsDocx, exportAsEpub,
} from './utils/export'
import './index.css'

const newProject = (id, name) => ({ id, name, content: '<p></p>' })

export default function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const [projects, setProjects] = useState([newProject('1', 'My First Book')])
  const [activeProjectId, setActiveProjectId] = useState('1')
  const [plainText, setPlainText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const editorRef = useRef(null)

  const activeProject = projects.find(p => p.id === activeProjectId)

  const handleEditorUpdate = useCallback((html, text) => {
    setPlainText(text)
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    setWordCount(words)
    setCharCount(text.length)
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, content: html } : p))
  }, [activeProjectId])

  const handleExport = useCallback((format) => {
    const name = activeProject?.name || 'document'
    const html = activeProject?.content || ''
    switch (format) {
      case 'txt': exportAsTxt(plainText, name); break
      case 'md': exportAsMd(html, name); break
      case 'html': exportAsHtml(html, name); break
      case 'pdf': exportAsPdf(plainText, name); break
      case 'docx': exportAsDocx(plainText, name); break
      case 'epub': exportAsEpub(name, '', plainText, name); break
    }
  }, [activeProject, plainText])

  const handleApplyEdit = useCallback((text) => {
    if (editorRef.current) {
      editorRef.current.commands.setContent(`<p>${text.replace(/\n/g, '</p><p>')}</p>`)
    }
  }, [])

  const addProject = () => {
    const id = Date.now().toString()
    const p = newProject(id, `Book ${projects.length + 1}`)
    setProjects(prev => [...prev, p])
    setActiveProjectId(id)
  }

  const deleteProject = (id) => {
    setProjects(prev => {
      const updated = prev.filter(p => p.id !== id)
      if (activeProjectId === id) setActiveProjectId(updated[0]?.id)
      return updated
    })
  }

  const renameProject = (id, name) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, name } : p))
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <Toolbar
        editor={editorRef.current}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        onExport={handleExport}
      />
      <div className="flex flex-1 overflow-hidden">
        <ProjectManager
          darkMode={darkMode}
          projects={projects}
          activeProject={activeProjectId}
          onSelect={setActiveProjectId}
          onNew={addProject}
          onDelete={deleteProject}
          onRename={renameProject}
        />
        <Editor
          darkMode={darkMode}
          language={language}
          content={activeProject?.content}
          onEditorReady={(editor) => { editorRef.current = editor }}
          onUpdate={handleEditorUpdate}
        />
        <AIPanel
          darkMode={darkMode}
          currentText={plainText}
          onApplyEdit={handleApplyEdit}
          language={language}
        />
      </div>
      <StatusBar
        darkMode={darkMode}
        wordCount={wordCount}
        charCount={charCount}
        projectName={activeProject?.name || ''}
      />
    </div>
  )
}
