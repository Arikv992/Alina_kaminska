# Estratégia e oferta de reativação

## Princípio
Trazer de volta clientes antigos **sem destruir margem**. Por isso o incentivo é um
**presente de baixo custo e alta frequência** (diseño de cejas) atrelado a um serviço
pago, em vez de um desconto agressivo. Cria valor percebido alto com custo real baixo,
e o serviço-isco (cejas) é o que melhor fideliza por ser recorrente.

## A oferta (recomendada)

> **«Te echamos de menos» — Regalo de bienvenida**
> Diseño de cejas **gratis** (valor ~12 €) al reservar tu próxima cita de manicura o
> extensión de pestañas. Válido durante **14 días**.

**Porquê assim:**
- Custo real do brinde ≈ poucos minutos + material mínimo; o cliente paga o serviço principal (manicura 15–35 € / pestañas 40–70 €).
- **Urgência** (14 dias) gera ação imediata em vez de "depois marco".
- O serviço de cejas é de **alta frequência** → gancho para o cliente voltar a cada 3–4 semanas.

**Alternativas (escolher 1 e manter consistente):**
- 15% de desconto na próxima visita dentro de 21 dias (mais agressivo na margem — usar só se a oferta-brinde converter pouco).
- "Trae a una amiga": brinde para ambas (ativa boca-a-boca — bom para 2.º toque).

## Cadência — 3 toques (não insistir mais)

| Toque | Quando | Canal | Conteúdo |
|---|---|---|---|
| **1 — Reabertura** | Dia 0 | **Email** (a todos) | Mensagem "te echamos de menos" + oferta + botão marcar |
| **2 — Recordatório** | Dia +6 (só a quem não abriu/não marcou) | Email | Mesma oferta, assunto diferente, reforça urgência ({{DIAS_RESTANTES}} = ~8 dias) |
| **3 — Última chamada** | Dia +13 (só não-conversores) | **WhatsApp** *(só a quem tem opt-in/relação prévia — ver `rgpd-y-opt-in.md`)* ou Email | "Último día del regalo" + link direto |

> ⚠️ **Coerência da oferta:** a oferta dura **14 dias**, por isso o toque 3 ("último día / caduca hoy")
> cai ao **Dia +13** — não antes. Se mudares a duração da oferta, ajusta os dias dos toques em
> sintonia (a plantilla do toque 3 diz "caduca hoy" e tem de bater certo com o último dia real).

Quem **clicar/responder** sai da cadência automática e entra na conversa com o **agente IA**
(`../agente-ia/`), que qualifica idioma, responde dúvidas e leva à marcação na Amelia.

## Ligação à marcação
- Todos os botões/links apontam para a **página de marcação Amelia** no WordPress
  (placeholder: `https://www.alinakaminskabeautyacademy.com/reservar`).
- O código de oferta (`BIENVENIDA`) é registado para medir conversão real.

## Métricas a registar (no Brevo + dashboard)
- Enviados, entregues, abertos, cliques por toque e por idioma.
- Marcações com código `BIENVENIDA` (conversão real → caixa).
- Reativados etiquetados `reactivado-2026` para o motor de retenção (Fase 1).

## Nota de margem
Manter um **teto**: a oferta-brinde não toca no preço dos serviços principais, por isso
cada reativação que marca é **caixa nova com margem quase intacta**. É o oposto de queimar
margem com descontos — exatamente o que uma operação sensível a custos precisa.
