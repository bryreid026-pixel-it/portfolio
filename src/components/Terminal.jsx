import { useState, useEffect, useRef } from 'react';

const COMMANDS = {
  whoami: `bryanna reid
software engineer · appsec · uchicago cs '24`,

  help: `available commands:
  whoami       who is this person
  skills       technical stack
  ls projects  list projects
  cat resume   work history
  ping         are you there?
  clear        clear terminal`,

  skills: `security/
  ├── owasp top 10, burp suite, semgrep, snyk
  ├── sast / dast, threat modeling
  └── comptia security+, azure ai-900

development/
  ├── python, javascript, react, c++, java
  ├── rest apis, docker, git, sql
  └── github actions (ci/cd)

cloud/
  ├── aws (iam, s3, ec2, lambda)
  ├── azure, gcp
  └── terraform, linux`,

  'ls projects': `drwxr-xr-x  cloudsentinel/
drwxr-xr-x  devsecops-pipeline/
drwxr-xr-x  dvwa-audit/
drwxr-xr-x  oss-code-review/
drwxr-xr-x  student-analytics-dashboard/
-rw-r--r--  tryhackme-owasp-writeup.md`,

  'cat resume': `bryanna reid — software engineer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
2026–present  software engineer · pacific life
2025–2026     ai instructor · orange county public schools
2024–2025     data analytics intern · stemz
2023          it intern · lavner education

education: uchicago, b.s. computer science + math, june 2024`,

  ping: `pong 🏓
latency: ${Math.floor(Math.random() * 8) + 1}ms`,
};

const PROMPT = 'visitor@bryanna.dev:~$';

export default function Terminal({ onClose }) {
  const [history, setHistory] = useState([
    { type: 'output', text: 'bryanna reid — portfolio terminal v1.0.0\ntype "help" to see available commands.' },
  ]);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIdx, setHistIdx] = useState(-1);
  const inputRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  function runCommand(raw) {
    const cmd = raw.trim().toLowerCase();
    const entry = { type: 'input', text: `${PROMPT} ${raw}` };

    let output;
    if (cmd === 'clear') {
      setHistory([]);
      setCmdHistory((h) => [raw, ...h]);
      setHistIdx(-1);
      setInput('');
      return;
    } else if (cmd === '') {
      setHistory((h) => [...h, entry]);
      setInput('');
      return;
    } else if (COMMANDS[cmd]) {
      output = { type: 'output', text: COMMANDS[cmd] };
    } else {
      output = { type: 'error', text: `command not found: ${cmd}\ntry "help"` };
    }

    setHistory((h) => [...h, entry, output]);
    setCmdHistory((h) => [raw, ...h]);
    setHistIdx(-1);
    setInput('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      runCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHistory.length - 1);
      setHistIdx(next);
      setInput(cmdHistory[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(histIdx - 1, -1);
      setHistIdx(next);
      setInput(next === -1 ? '' : cmdHistory[next] ?? '');
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0a0a0a] border border-[#00ff9f]/20 rounded-lg shadow-2xl shadow-[#00ff9f]/5 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.03] border-b border-white/5">
          <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/70 hover:bg-red-500 transition-colors" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/40" />
          <span className="w-3 h-3 rounded-full bg-green-500/40" />
          <span className="flex-1 text-center text-xs text-gray-600 font-mono">terminal — bryanna.dev</span>
        </div>

        {/* output */}
        <div
          className="h-80 overflow-y-auto p-4 font-mono text-sm space-y-1 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((line, i) => (
            <pre
              key={i}
              className={`whitespace-pre-wrap leading-relaxed ${
                line.type === 'input' ? 'text-white' :
                line.type === 'error' ? 'text-red-400' :
                'text-[#00ff9f]/80'
              }`}
            >
              {line.text}
            </pre>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-white/5 bg-white/[0.02]">
          <span className="font-mono text-xs text-[#00ff9f] whitespace-nowrap">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent font-mono text-sm text-white outline-none caret-[#00ff9f]"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
