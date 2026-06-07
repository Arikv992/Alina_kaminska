# Alinakademis — Sistema de crescimento e automação
### Salão de estética + academia · Alina Kaminska Beauty Academy · Torrevieja

Sistema que responde e marca sozinho (24h, multilíngue), recupera e retém clientes,
vende o curso online de forma escalável, gera tráfego, reporta e sugere ações — para
transformar um negócio sem lucro num negócio rentável e devolver tempo à dona.

---

## Decisões de arquitetura (validadas)

| Decisão | Escolha | Porquê |
|---|---|---|
| Manutenção | **n8n self-host + WhatsApp Cloud API + LLM** | Mais barato a operar (~5–15 €/mês), posse total dos dados; mantido pelo engenheiro |
| Núcleo / posse de dados | **WordPress (existente) + LatePoint + Brevo** | Site é dela, marcação no próprio domínio (0% comissão), CRM EU/RGPD grátis até 100k contactos |
| Atendimento | **Agente IA multilíngue (ES/EN/PL/IT) sobre WhatsApp + Instagram** | Respostas reativas ≈ 0 € (modelo Meta jul/2025); LLM custa cêntimos |
| Anti no-show | **LatePoint depósito/pré-pagamento (no plano base $199 lifetime) + lembretes via n8n** | No-show de ~20% → ~5%, sem feature-lock por plano; Amelia só teria depósito no Elite ($799). Amelia fica como upgrade se quiser gestão avançada de pacotes/academia |
| Curso | **Validar em Gumroad (MoR) → escalar Hotmart / Tutor LMS** | Zero compliance de IVA UE no arranque, dá os emails dos alunos |
| Financiamento | **Kit Digital (até 3.000 €) + caixa da reativação** | Auto-financia; candidatar já (ordem de chegada) |

Pesquisa completa, comparativos e fontes: **[`00-PESQUISA-E-ARQUITETURA.md`](00-PESQUISA-E-ARQUITETURA.md)**
Pesquisa de tráfego/subsídios: **[`pesquisa-trafego-subsidios.md`](pesquisa-trafego-subsidios.md)**

---

## Ordem de implementação

### ✅ Fase 0 — Reativação dos ~840 adormecidos (caixa imediata, ~0–42 €) → `fase-0-reactivacion/`
O ativo que já existe e está parado. Auto-financia tudo o resto.
- Estratégia + oferta: [`fase-0-reactivacion/estrategia-y-oferta.md`](fase-0-reactivacion/estrategia-y-oferta.md)
- RGPD / opt-in: [`fase-0-reactivacion/rgpd-y-opt-in.md`](fase-0-reactivacion/rgpd-y-opt-in.md)
- Segmentação: [`fase-0-reactivacion/segmentacion.md`](fase-0-reactivacion/segmentacion.md)
- Plantillas ES/EN/PL/IT (email + WhatsApp): [`fase-0-reactivacion/plantillas/`](fase-0-reactivacion/plantillas/)
- Workflow n8n: [`fase-0-reactivacion/n8n/`](fase-0-reactivacion/n8n/)
- Credenciais necessárias: [`fase-0-reactivacion/credenciales-checklist.md`](fase-0-reactivacion/credenciales-checklist.md)

### ⏳ Fase 1 — Fundação: marcação + captação + agente IA + lembretes (deixa de ser o gargalo)
Cérebro do agente IA já preparado em `agente-ia/` (partilhado com a Fase 0 para responder a quem responder).

### ⏳ Fase 2 — Curso online como funil para o presencial high-ticket

### ⏳ Fase 3 — Tráfego pago (Meta Ads) + criativos, financiado pela caixa anterior

### 🔁 Em paralelo desde já — Kit Digital + relatórios/dashboard

---

## Como ler este repositório
1. Lê este README (visão geral + ordem).
2. Lê `00-PESQUISA-E-ARQUITETURA.md` para a justificação de cada escolha.
3. Para implementar, segue a pasta `fase-0-reactivacion/` na ordem do seu próprio README.

## Materiais para a cliente
Tudo o que é virado para a Alina/clientes está em **espanhol** e preparado para tradução
EN/PL/IT (as plantillas já vêm nos 4 idiomas).
