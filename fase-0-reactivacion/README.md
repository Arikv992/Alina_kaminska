# Fase 0 — Reativação dos clientes adormecidos

> **Objetivo:** gerar caixa **imediata e quase sem custo** reativando parte dos ~840 clientes
> que nunca voltaram, e capturá-los para os fluxos de retenção. Esta caixa auto-financia o resto.

## Porquê esta é a primeira coisa

- A base de 1047 contactos já existe — é o ativo mais barato de ativar.
- Reativar custa **5–25× menos** que adquirir um cliente novo (Bain/Reichheld).
- **Conta conservadora:** 840 × **8–10%** de regresso = ~70–84 clientes × ~50 € de ticket = **~3.500–4.200 €**, com um custo de ~0–42 €.
- Não depende de publicidade nem de site novo — só da base e do canal.

## O que esta fase entrega (nesta pasta)

| Ficheiro | O que é |
|---|---|
| `estrategia-y-oferta.md` | A oferta de regresso (margem protegida) + cadência de 3 toques + métricas |
| `rgpd-y-opt-in.md` | Como reativar **legalmente** (email-first, regras WhatsApp Meta) |
| `segmentacion.md` | Como segmentar os 1047 e inferir idioma; campos mínimos |
| `plantillas/` | Mensagens prontas em **ES/EN/PL/IT** (email + WhatsApp) |
| `n8n/workflow-reactivacion.md` | Spec do workflow (envio + seguimento + encaminhar respostas ao agente IA) |
| `credenciales-checklist.md` | O que preciso de ti/da Alina para ligar tudo |

## Ordem de execução

1. **Candidatar ao Kit Digital já** (em paralelo — ver `00-PESQUISA-E-ARQUITETURA.md`).
2. Reunir credenciais (`credenciales-checklist.md`) — sobretudo **a exportação dos 1047 contactos** e a **conta Brevo**.
3. Limpar + segmentar a lista (`segmentacion.md`).
4. Validar o canal legal (`rgpd-y-opt-in.md`) → **arrancar por EMAIL**.
5. Carregar as plantillas e a oferta (`estrategia-y-oferta.md`, `plantillas/`).
6. Construir/validar o workflow n8n contra a instância real (`n8n/`).
7. Disparar o 1.º toque a um **lote-piloto (~50 contactos)**, medir, depois escalar.
8. Respostas entram no **agente IA** (`../agente-ia/`) que qualifica e leva à marcação.

## Métrica de sucesso da fase
- Taxa de abertura email > 30%, CTR > 3%, **≥ 8–10% de reativação** no total contactado.
- Toda a reativação fica **etiquetada no Brevo** (`reactivado-2026`) para entrar na retenção.
