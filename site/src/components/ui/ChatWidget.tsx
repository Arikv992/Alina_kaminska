'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

type Msg = { role: 'user' | 'assistant'; content: string };

const UI: Record<
  string,
  { title: string; greeting: string; placeholder: string; send: string; open: string; teaserName: string; teaser: string; dismiss: string }
> = {
  es: {
    title: 'Asistente · 24h',
    greeting: '¡Hola! 💕 Soy la asistente de Alina. Pregúntame por servicios, precios o reserva tu cita.',
    placeholder: 'Escribe tu mensaje…',
    send: 'Enviar',
    open: 'Abrir chat',
    teaserName: 'Asistente de Alina',
    teaser: '¿Tienes alguna duda? Escríbeme 💬',
    dismiss: 'Cerrar aviso',
  },
  en: {
    title: 'Assistant · 24h',
    greeting: "Hi! 💕 I'm Alina's assistant. Ask me about services, prices or book your appointment.",
    placeholder: 'Type your message…',
    send: 'Send',
    open: 'Open chat',
    teaserName: "Alina's assistant",
    teaser: 'Any questions? Chat with me 💬',
    dismiss: 'Dismiss',
  },
  pl: {
    title: 'Asystentka · 24h',
    greeting: 'Cześć! 💕 Jestem asystentką Aliny. Zapytaj o usługi, ceny lub umów wizytę.',
    placeholder: 'Napisz wiadomość…',
    send: 'Wyślij',
    open: 'Otwórz czat',
    teaserName: 'Asystentka Aliny',
    teaser: 'Masz pytania? Napisz do mnie 💬',
    dismiss: 'Zamknij',
  },
  it: {
    title: 'Assistente · 24h',
    greeting: "Ciao! 💕 Sono l'assistente di Alina. Chiedimi servizi, prezzi o prenota il tuo appuntamento.",
    placeholder: 'Scrivi il tuo messaggio…',
    send: 'Invia',
    open: 'Apri chat',
    teaserName: 'Assistente di Alina',
    teaser: 'Hai domande? Scrivimi 💬',
    dismiss: 'Chiudi',
  },
};

export default function ChatWidget() {
  const locale = useLocale();
  const t = UI[locale] ?? UI.es;
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  // `seen` starts true so the first (SSR-matching) render shows no teaser/dot.
  const [seen, setSeen] = useState(true);
  const [teaserOpen, setTeaserOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Teaser: show a few seconds after each page load, unless the visitor
  // explicitly dismissed it (×) earlier in this browser session.
  useEffect(() => {
    if (sessionStorage.getItem('ak-chat-dismissed') === '1') return;
    setSeen(false);
    const id = setTimeout(() => setTeaserOpen(true), 5000);
    return () => clearTimeout(id);
  }, []);

  // Explicit "×": stop nudging for the rest of the session.
  function dismissTeaser() {
    setSeen(true);
    setTeaserOpen(false);
    try {
      sessionStorage.setItem('ak-chat-dismissed', '1');
    } catch {
      /* private mode — ignore */
    }
  }

  // Opening the chat just hides the nudge; it may reappear on a later load.
  function openChat() {
    setOpen(true);
    setSeen(true);
    setTeaserOpen(false);
  }

  // greeting on first open
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, history: next.slice(-50), locale }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [...m, { role: 'assistant', content: data.reply || '…' }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: '…' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Teaser bubble — small, non-intrusive nudge; click opens the chat */}
      {!open && teaserOpen && (
        <div className="teaser-in fixed bottom-[5.5rem] right-5 z-50 max-w-[16rem]">
          <div className="relative">
            <button
              type="button"
              onClick={openChat}
              className="flex items-start gap-2.5 text-left bg-crema border border-oro/15 rounded-2xl rounded-br-md
                         shadow-[0_12px_40px_rgba(20,20,20,0.22)] pl-3 pr-4 py-3 transition-transform hover:scale-[1.02]
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2"
            >
              <span className="w-8 h-8 shrink-0 rounded-full bg-carbon flex items-center justify-center text-oro-light font-display text-sm">
                AK
              </span>
              <span className="min-w-0">
                <span className="block font-display text-sm text-carbon leading-tight">{t.teaserName}</span>
                <span className="block font-sans text-xs text-carbon/70 mt-0.5 leading-snug">{t.teaser}</span>
              </span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismissTeaser();
              }}
              aria-label={t.dismiss}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-carbon text-crema flex items-center justify-center
                         shadow-md hover:bg-oro transition-colors
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oro focus-visible:ring-offset-2"
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openChat())}
        aria-label={t.open}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full bg-oro text-crema shadow-[0_8px_30px_rgba(140,93,73,0.45)]
                   flex items-center justify-center transition-transform duration-300 hover:scale-105
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon focus-visible:ring-offset-2"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
            <path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.2 1 4.2 2.7 5.7L4 21l4.2-1.6c1.2.4 2.5.6 3.8.6 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" />
          </svg>
        )}

        {/* Notification dot — subtle, only until the visitor engages */}
        {!open && !seen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#e5544a] opacity-70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#e5544a] ring-2 ring-crema" />
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] h-[min(70vh,560px)] flex flex-col
                     bg-crema rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(20,20,20,0.35)] border border-oro/30"
          role="dialog"
          aria-label={t.title}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-carbon text-crema">
            <span className="w-9 h-9 rounded-full bg-oro-light/20 border border-oro-light/40 flex items-center justify-center text-oro-light font-display text-lg">
              AK
            </span>
            <div className="leading-tight">
              <p className="font-display text-base">Alina Kaminska</p>
              <p className="font-sans text-[11px] tracking-wide text-crema/60">{t.title}</p>
            </div>
            <span className="ml-auto w-2 h-2 rounded-full bg-green-400" aria-hidden="true" />
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    'max-w-[80%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ' +
                    (m.role === 'user'
                      ? 'bg-oro text-crema rounded-br-sm'
                      : 'bg-white text-carbon border border-oro/15 rounded-bl-sm')
                  }
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2.5 rounded-2xl bg-white border border-oro/15">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-oro/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-oro/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-oro/60 animate-bounce" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 p-2.5 border-t border-oro/20 bg-crema">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder={t.placeholder}
              className="flex-1 bg-white border border-oro/25 rounded-full px-4 py-2.5 text-sm text-carbon
                         placeholder:text-carbon/40 focus:outline-none focus:border-oro"
            />
            <button
              type="button"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label={t.send}
              className="w-10 h-10 shrink-0 rounded-full bg-oro text-crema flex items-center justify-center
                         disabled:opacity-40 transition-opacity hover:opacity-90
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carbon"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                <path d="M3 11l18-8-8 18-2.5-7.5L3 11z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
