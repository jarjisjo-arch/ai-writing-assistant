import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import CharacterCount from '@tiptap/extension-character-count'
import { useEffect } from 'react'

export default function Editor({ darkMode, language, onEditorReady, content, onUpdate }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight,
      CharacterCount,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML(), editor.getText())
    },
  })

  useEffect(() => {
    if (editor) onEditorReady(editor)
  }, [editor])

  useEffect(() => {
    if (editor && content !== undefined) {
      const current = editor.getHTML()
      if (current !== content) {
        editor.commands.setContent(content || '<p></p>', false)
      }
    }
  }, [content])

  return (
    <div className={`flex-1 overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`mx-auto my-8 shadow-lg min-h-[calc(100vh-200px)] ${
        darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
      } ${language === 'ar' ? 'rtl' : ''}`}
        style={{ maxWidth: 800, minHeight: 'calc(100vh - 160px)' }}
      >
        <EditorContent editor={editor} className="tiptap-editor" />
      </div>
    </div>
  )
}
