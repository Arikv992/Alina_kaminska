import { NextResponse } from 'next/server';

type Msg = { role: 'user' | 'assistant'; content: string };

/**
 * Proxy do chat: o browser fala com esta rota (server-side), que reencaminha
 * para o webhook do agente IA no n8n (OpenRouter LLM + base de conhecimento real).
 * Server-to-server → sem CORS e o URL do webhook fica escondido.
 */
export async function POST(req: Request) {
  try {
    const { message, history, locale } = (await req.json()) as {
      message?: string;
      history?: Msg[];
      locale?: string;
    };
    if (!message || !message.trim()) {
      return NextResponse.json({ reply: '¿En qué puedo ayudarte? 💕' }, { status: 400 });
    }
    const url = process.env.N8N_CHAT_WEBHOOK;
    if (!url) {
      return NextResponse.json(
        { reply: 'El asistente no está configurado todavía.' },
        { status: 500 },
      );
    }
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: message.slice(0, 1500),
        history: Array.isArray(history) ? history.slice(-50) : [],
        locale: locale || 'es',
      }),
      // o agente pode demorar uns segundos a pensar
      signal: AbortSignal.timeout(45000),
    });
    const data = (await r.json().catch(() => ({}))) as { reply?: string };
    return NextResponse.json({
      reply: data.reply || 'Disculpa, no he podido responder. ¿Me dejas tu nombre y un contacto?',
    });
  } catch {
    return NextResponse.json(
      { reply: 'Ha ocurrido un error. Inténtalo de nuevo en un momento.' },
      { status: 500 },
    );
  }
}
