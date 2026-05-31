import { useState } from 'react'

export default function ProjectManager({ darkMode, projects, activeProject, onSelect, onNew, onDelete, onRename }) {
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const base = darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
  const border = darkMode ? 'border-gray-700' : 'border-gray-200'

  return (
    <div className={`w-56 flex flex-col border-r ${base} ${border}`} style={{ minWidth: 180 }}>
      <div className={`flex items-center justify-between px-3 py-3 border-b ${border}`}>
        <span className="text-sm font-semibold">My Books</span>
        <button
          onClick={onNew}
          title="New book"
          className="text-blue-500 hover:text-blue-400 text-lg font-bold"
        >+</button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {projects.map(project => (
          <div
            key={project.id}
            onClick={() => onSelect(project.id)}
            className={`group flex items-center justify-between px-3 py-2 cursor-pointer text-sm rounded mx-1 my-0.5 ${
              activeProject === project.id
                ? darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'
                : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            {editingId === project.id ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={() => { onRename(project.id, editName); setEditingId(null) }}
                onKeyDown={e => {
                  if (e.key === 'Enter') { onRename(project.id, editName); setEditingId(null) }
                  if (e.key === 'Escape') setEditingId(null)
                }}
                className="flex-1 bg-transparent outline-none border-b border-blue-400"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 truncate">📖 {project.name}</span>
            )}
            <div className="hidden group-hover:flex gap-1 ml-1">
              <button
                onClick={e => { e.stopPropagation(); setEditingId(project.id); setEditName(project.name) }}
                className="opacity-60 hover:opacity-100 text-xs"
                title="Rename"
              >✏️</button>
              {projects.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); onDelete(project.id) }}
                  className="opacity-60 hover:opacity-100 text-xs"
                  title="Delete"
                >🗑️</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
