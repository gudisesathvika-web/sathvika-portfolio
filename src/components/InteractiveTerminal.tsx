import { useState, useRef, useEffect } from 'react'
import { site, projects, contact } from '../data/content'
import { CloseIcon } from './icons'
import './terminal.css'

interface TerminalHistoryEntry {
  type: 'input' | 'output' | 'error'
  text: string
  link?: string
  linkLabel?: string
}

const COMMAND_LIST = ['help', 'whoami', 'projects', 'skills', 'contact', 'resume', 'clear']

interface InteractiveTerminalProps {
  isOpen: boolean
  onClose: () => void
}

export function InteractiveTerminal({ isOpen, onClose }: InteractiveTerminalProps) {
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([
    { type: 'output', text: `Welcome to ${site.name}'s Interactive CLI v1.2.0` },
    { type: 'output', text: "Type 'help' or click any command chip below to explore." },
  ])
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [history, isOpen])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    const newHistory: TerminalHistoryEntry[] = [
      ...history,
      { type: 'input', text: `$ ${trimmed}` },
    ]

    switch (trimmed) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: `Available commands:
  • whoami    : Learn about Sathvika, role & background
  • projects  : View featured & library intelligent systems
  • skills    : Core tech stack & applied architectures
  • contact   : Get in touch & email info
  • resume    : Link to PDF resume preview
  • clear     : Clear terminal history`,
        })
        break

      case 'whoami':
        newHistory.push({
          type: 'output',
          text: `${site.name} — ${site.identity}
Location: ${site.location}
Education: B.Tech in Artificial Intelligence (CGPA 9.08/10)
Focus: Applied AI, retrieval-augmented generation (RAG), agentic workflows, and full-stack software.`,
        })
        break

      case 'projects': {
        const projectSummary = projects
          .map((p) => `  → ${p.title} (${p.direction})\n    Stack: ${p.stack.join(', ')}`)
          .join('\n\n')
        newHistory.push({
          type: 'output',
          text: `Selected Projects:\n${projectSummary}`,
        })
        break
      }

      case 'skills':
        newHistory.push({
          type: 'output',
          text: `Technical Arsenal:
  • Languages    : Python, TypeScript, JavaScript, SQL
  • AI & ML      : RAG, FAISS, PyTorch, Multi-agent workflows, Vector Embeddings
  • Web & APIs   : React, FastAPI, Node.js, PostgreSQL, TailwindCSS
  • Architecture : Modular backend pipelines, WCAG Accessibility, Anomaly Detection`,
        })
        break

      case 'contact':
        newHistory.push({
          type: 'output',
          text: `Email: ${contact.email}\nGitHub: https://github.com/sathvikagudise`,
        })
        break

      case 'resume':
        newHistory.push({
          type: 'output',
          text: `Opening resume preview... Navigating to /resume`,
          link: '/resume',
          linkLabel: 'View Resume Page →',
        })
        break

      case 'clear':
        setHistory([])
        setInputVal('')
        return

      default:
        newHistory.push({
          type: 'error',
          text: `Command not found: '${trimmed}'. Type 'help' to see available commands.`,
        })
        break
    }

    setHistory(newHistory)
    setInputVal('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeCommand(inputVal)
  }

  if (!isOpen) return null

  return (
    <div className="terminal-overlay" role="dialog" aria-modal="true" aria-labelledby="terminal-title">
      <div className="terminal-overlay__backdrop" onClick={onClose} />
      <div className="terminal-window glass-panel">
        <header className="terminal-window__header">
          <div className="terminal-window__controls">
            <span className="terminal-window__dot terminal-window__dot--red" onClick={onClose} />
            <span className="terminal-window__dot terminal-window__dot--yellow" />
            <span className="terminal-window__dot terminal-window__dot--green" />
          </div>
          <span className="terminal-window__title mono" id="terminal-title">
            terminal://sathvika-portfolio
          </span>
          <button
            type="button"
            className="terminal-window__close"
            onClick={onClose}
            aria-label="Close terminal"
          >
            <CloseIcon size={16} />
          </button>
        </header>

        <div className="terminal-window__body">
          {history.map((entry, index) => (
            <div key={index} className={`terminal-line terminal-line--${entry.type}`}>
              <pre className="terminal-line__text">{entry.text}</pre>
              {entry.link && (
                <a href={entry.link} className="terminal-line__link">
                  {entry.linkLabel || entry.link}
                </a>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Quick Clickable Chips */}
        <div className="terminal-window__chips">
          <span className="terminal-window__chips-label mono">Quick run:</span>
          {COMMAND_LIST.map((cmd) => (
            <button
              key={cmd}
              type="button"
              className="terminal-chip mono"
              onClick={() => executeCommand(cmd)}
            >
              {cmd}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="terminal-window__input-line">
          <span className="terminal-prompt mono">$</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input mono"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Type a command (try 'help')..."
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  )
}

