export default function Toolbar({ editor, darkMode, setDarkMode, language, setLanguage, onExport }) {
  if (!editor) return null

  const btn = (active, onClick, title, children) => (
    <button
      onClick={onClick}
      title={title}
      className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : darkMode
          ? 'text-gray-300 hover:bg-gray-700'
          : 'text-gray-700 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )

  const divider = () => (
    <span className={`w-px h-5 mx-1 ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
  )

  return (
    <div className={`flex flex-wrap items-center gap-1 px-3 py-2 border-b ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Text style */}
      {btn(editor.isActive('bold'), () => editor.chain().focus().toggleBold().run(), 'Bold', <b>B</b>)}
      {btn(editor.isActive('italic'), () => editor.chain().focus().toggleItalic().run(), 'Italic', <i>I</i>)}
      {btn(editor.isActive('underline'), () => editor.chain().focus().toggleUnderline().run(), 'Underline', <u>U</u>)}
      {btn(editor.isActive('strike'), () => editor.chain().focus().toggleStrike().run(), 'Strikethrough', <s>S</s>)}
      {divider()}

      {/* Headings */}
      {btn(editor.isActive('heading', { level: 1 }), () => editor.chain().focus().toggleHeading({ level: 1 }).run(), 'Heading 1', 'H1')}
      {btn(editor.isActive('heading', { level: 2 }), () => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'Heading 2', 'H2')}
      {btn(editor.isActive('heading', { level: 3 }), () => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'Heading 3', 'H3')}
      {divider()}

      {/* Lists */}
      {btn(editor.isActive('bulletList'), () => editor.chain().focus().toggleBulletList().run(), 'Bullet list', '• List')}
      {btn(editor.isActive('orderedList'), () => editor.chain().focus().toggleOrderedList().run(), 'Numbered list', '1. List')}
      {btn(editor.isActive('blockquote'), () => editor.chain().focus().toggleBlockquote().run(), 'Quote', '" "')}
      {divider()}

      {/* Alignment */}
      {btn(editor.isActive({ textAlign: 'left' }), () => editor.chain().focus().setTextAlign('left').run(), 'Align left', '⫷')}
      {btn(editor.isActive({ textAlign: 'center' }), () => editor.chain().focus().setTextAlign('center').run(), 'Center', '≡')}
      {btn(editor.isActive({ textAlign: 'right' }), () => editor.chain().focus().setTextAlign('right').run(), 'Align right', '⫸')}
      {divider()}

      {/* Undo/Redo */}
      <button onClick={() => editor.chain().focus().undo().run()} title="Undo"
        className={`px-2 py-1 rounded text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}>↩</button>
      <button onClick={() => editor.chain().focus().redo().run()} title="Redo"
        className={`px-2 py-1 rounded text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}>↪</button>
      {divider()}

      {/* Language toggle */}
      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className={`text-sm px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
      </select>
      {divider()}

      {/* Export */}
      <select
        defaultValue=""
        onChange={e => { if (e.target.value) { onExport(e.target.value); e.target.value = '' } }}
        className={`text-sm px-2 py-1 rounded border ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
      >
        <option value="" disabled>Export as...</option>
        <option value="txt">Text (.txt)</option>
        <option value="md">Markdown (.md)</option>
        <option value="html">HTML (.html)</option>
        <option value="pdf">PDF (.pdf)</option>
        <option value="docx">Word (.docx)</option>
        <option value="epub">ePub (.xhtml)</option>
      </select>
      {divider()}

      {/* Dark mode */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        title="Toggle dark/light mode"
        className={`px-2 py-1 rounded text-sm ${darkMode ? 'text-yellow-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-200'}`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </div>
  )
}
