import { useState, useRef } from 'react'
import { useGemini } from '../hooks/useGemini'
import { useSpeech } from '../hooks/useSpeech'

export default function AIPanel({ darkMode, currentText, onApplyEdit, language }) {
  const [activeAssistant, setActiveAssistant] = useState('jarjis')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState({ jarjis: [], ace: [] })
  const [loading, setLoading] = useState(false)
  const { askJarjis, askAce } = useGemini()
  const messagesEndRef = useRef(null)

  const speechLang = language === 'ar' ? 'ar-SA' : 'en-US'

  const { listening, start: startListening, stop: stopListening } = useSpeech({
    language: speechLang,
    onResult: (transcript) => {
      const lower = transcript.toLowerCase()
      if (lower.startsWith('jarjis') || lower.startsWith('جارجيس')) {
        setActiveAssistant('jarjis')
        setInput(transcript.replace(/^jarjis[,\s]*/i, '').replace(/^جارجيس[،\s]*/i, ''))
      } else if (lower.startsWith('ace') || lower.startsWith('ايس')) {
        setActiveAssistant('ace')
        setInput(transcript.replace(/^ace[,\s]*/i, '').replace(/^ايس[،\s]*/i, ''))
      } else {
        setInput(transcript)
      }
    },
  })

  async function send() {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => ({
      ...prev,
      [activeAssistant]: [...prev[activeAssistant], { role: 'user', text: userMsg }],
    }))
    setLoading(true)
    try {
      let response
      if (activeAssistant === 'jarjis') {
        response = await askJarjis(currentText, userMsg)
        setMessages(prev => ({
          ...prev,
          jarjis: [...prev.jarjis, { role: 'assistant', text: response }],
        }))
      } else {
        response = await askAce(currentText, userMsg)
        setMessages(prev => ({
          ...prev,
          ace: [...prev.ace, { role: 'assistant', text: response }],
        }))
      }
    } catch (e) {
      setMessages(prev => ({
        ...prev,
        [activeAssistant]: [
          ...prev[activeAssistant],
          { role: 'error', text: 'Error: ' + e.message },
        ],
      }))
    }
    setLoading(false)
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
  }

  const base = darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
  const border = darkMode ? 'border-gray-700' : 'border-gray-200'

  return (
    <div className={`w-80 flex flex-col border-l ${base} ${border}`} style={{ minWidth: 280 }}>
      {/* Tabs */}
      <div className={`flex border-b ${border}`}>
        {['jarjis', 'ace'].map(name => (
          <button
            key={name}
            onClick={() => setActiveAssistant(name)}
            className={`flex-1 py-3 text-sm font-semibold capitalize transition-colors ${
              activeAssistant === name
                ? darkMode ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {name === 'jarjis' ? '✏️ Jarjis' : '💡 Ace'}
          </button>
        ))}
      </div>

      {/* Description */}
      <div className={`px-3 py-2 text-xs border-b ${border} ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        {activeAssistant === 'jarjis'
          ? 'Jarjis edits your text. Say "Jarjis" or call by name.'
          : 'Ace brainstorms with you. Say "Ace" or call by name.'}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages[activeAssistant].length === 0 && (
          <p className={`text-xs text-center mt-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {activeAssistant === 'jarjis'
              ? 'Tell Jarjis what to write, edit, or change.'
              : 'Ask Ace for ideas, feedback, or inspiration.'}
          </p>
        )}
        {messages[activeAssistant].map((msg, i) => (
          <div key={i} className={`text-sm rounded-lg px-3 py-2 ${
            msg.role === 'user'
              ? 'bg-blue-500 text-white ml-4'
              : msg.role === 'error'
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : darkMode ? 'bg-gray-700 text-gray-100 mr-4' : 'bg-gray-100 text-gray-800 mr-4'
          }`}>
            <p className="whitespace-pre-wrap">{msg.text}</p>
            {msg.role === 'assistant' && activeAssistant === 'jarjis' && (
              <button
                onClick={() => onApplyEdit(msg.text)}
                className="mt-2 text-xs underline opacity-70 hover:opacity-100"
              >
                Apply to editor
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className={`text-sm rounded-lg px-3 py-2 mr-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <span className="animate-pulse">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-3 border-t ${border}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={`Message ${activeAssistant}...`}
            className={`flex-1 text-sm px-3 py-2 rounded-lg border outline-none ${
              darkMode
                ? 'bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400'
                : 'bg-gray-50 text-gray-900 border-gray-300 placeholder-gray-400'
            }`}
          />
          <button
            onClick={listening ? stopListening : startListening}
            title={listening ? 'Stop listening' : 'Voice input'}
            className={`px-2 py-2 rounded-lg text-lg ${
              listening
                ? 'bg-red-500 text-white animate-pulse'
                : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            🎤
          </button>
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-40"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
