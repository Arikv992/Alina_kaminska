# Workflow n8n — Campanha de reativação (spec para construir/validar na instância)

> Esta é a **especificação** do workflow. A construção final em JSON faz-se **contra a tua
> instância n8n real** (via n8n MCP / editor), porque os IDs de credenciais e de listas
> Brevo são específicos da instância e o JSON tem de ser validado lá. Aqui está tudo o que
> o workflow faz, nó a nó, para o montar sem ambiguidade.

## Pré-requisitos
- n8n self-host a correr (VPS) — ver `../credenciales-checklist.md`.
- Credencial **Brevo (Sendinblue) API** ligada no n8n.
- Credencial **WhatsApp Cloud API** (para o ramo de opt-in) — opcional na 1.ª execução.
- Contactos já importados e segmentados no Brevo (ver `../segmentacion.md`).

---

## Workflow A — Limpeza & segmentação (corre 1× antes da campanha)

```
[Manual Trigger]
      │
[Read CSV / Google Sheets]  ← exportação dos 1047 contactos
      │
[Code: normalizar]          ← trim, lowercase email, telefone a +34..., dedupe por email
      │
[Code: inferir idioma]      ← +44→EN, +48→PL, +39→IT, +34→ES, default ES (ver segmentacion.md)
      │
[Code: atribuir segmento]   ← A (email), B (só telefone), C (recorrente→excluir), D (inválido)
      │
[Brevo: Create/Update Contact] (em lote)  ← grava em listas reactivacion-A-{idioma}, etc.
```

**Nó "Code: inferir idioma" (lógica):**
```js
// para cada item
const tel = ($json.TELEFONO || '').replace(/\s+/g,'');
let idioma = ($json.IDIOMA || '').toUpperCase();
if (!['ES','EN','PL','IT'].includes(idioma)) {
  if (tel.startsWith('+44')) idioma = 'EN';
  else if (tel.startsWith('+48')) idioma = 'PL';
  else if (tel.startsWith('+39')) idioma = 'IT';
  else if (/^\+?(46|47|45|358|49)/.test(tel)) idioma = 'EN'; // nórdicos/alemães → EN
  else idioma = 'ES';
}
return { json: { ...$json, IDIOMA: idioma } };
```

---

## Workflow B — Cadência de 3 toques (agendado)

```
[Schedule Trigger: diário 10:00]
      │
[Brevo: Get Contacts] (lista do toque do dia, por idioma)
      │
[Switch: idioma]  ──ES──▶ [Brevo: Send Email — plantilla ES toque N]
      ├────────────EN──▶ [Brevo: Send Email — plantilla EN toque N]
      ├────────────PL──▶ [Brevo: Send Email — plantilla PL toque N]
      └────────────IT──▶ [Brevo: Send Email — plantilla IT toque N]
      │
[Brevo: Add to list "enviado-toque-N"]   ← evita reenviar
```

**Regras de salto (a implementar com filtros Brevo / nós IF):**
- Toque 2 só a quem **não abriu nem clicou** o toque 1 (segmento Brevo "não aberto").
- Toque 3 só a **não convertidos** (sem marcação com código `BIENVENIDA`).
- Quem **clica** o link de reserva → remover da cadência (tag `clicou-reserva`).

---

## Workflow C — Encaminhar respostas ao agente IA (sempre ativo)

```
[Webhook: WhatsApp Cloud API inbound]   ← mensagem recebida do cliente
      │
[Code: extrair texto + telefone]
      │
[IF: dentro da janela 24h?]  ── sim ──▶ [HTTP: LLM (agente-ia/system-prompt)]  ← resposta GRÁTIS
      │                                         │
      │                                  [WhatsApp: Send message] (resposta no idioma detetado)
      │                                         │
      └── não/opt-in pendente ──▶ [WhatsApp: template opt-in aprovado]   [Brevo: tag "respondeu"]
```

- O agente IA (LLM) recebe a mensagem + a **base de conhecimento** (`../agente-ia/base-conocimiento.md`)
  e o **system prompt** (`../agente-ia/system-prompt.md`). Deteta idioma e responde.
- Se o cliente quiser marcar → o agente devolve o `{{ENLACE_RESERVA}}` (Amelia) ou, em Fase 1,
  consulta disponibilidade via API e propõe horas.
- **Handoff humano:** se o cliente pedir algo fora do âmbito ou ficar insatisfeito, o workflow
  notifica a Alina (mensagem/telegram) e pausa o bot nessa conversa.

---

## Variáveis/credenciais a parametrizar (não hardcode)
| Item | Onde obter |
|---|---|
| `BREVO_API_KEY` | Brevo → SMTP & API |
| IDs de listas Brevo | criados no Workflow A |
| `WHATSAPP_TOKEN`, `PHONE_NUMBER_ID` | Meta WhatsApp Cloud API |
| `LLM_API_KEY` | OpenAI (gpt-4o-mini) ou Anthropic |
| `ENLACE_RESERVA` | URL da página Amelia |

## Teste
1. Workflow A com **10 contactos fictícios** → confirmar segmentação/idioma corretos no Brevo.
2. Workflow B em **modo teste** para 1 email teu de cada idioma → verificar render e links.
3. Workflow C: enviar mensagem WhatsApp de teste → confirmar resposta do agente no idioma certo.
4. Só depois: **lote-piloto de ~50** contactos reais, medir, escalar aos 840.

> A construção do JSON final + validação (`validate_workflow`) será feita quando a instância n8n
> e as credenciais estiverem disponíveis (ver checklist). A lógica acima é completa e suficiente
> para montar sem decisões em aberto.
