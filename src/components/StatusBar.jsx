export default function StatusBar({ darkMode, wordCount, charCount, projectName }) {
  const pageCount = Math.max(1, Math.ceil(wordCount / 250))

  return (
    <div className={`flex items-center justify-between px-4 py-1 text-xs border-t ${
      darkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-gray-50 text-gray-500 border-gray-200'
    }`}>
      <span>{projectName}</span>
      <div className="flex gap-4">
        <span>{wordCount} words</span>
        <span>{charCount} characters</span>
        <span>~{pageCount} page{pageCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}
