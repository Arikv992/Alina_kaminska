# Alinakademis — Pesquisa de mercado + Arquitetura recomendada
### Fase 1 (Pesquisa) + Fase 2 (Solução fundamentada) — para validação ANTES de construir

> Cliente: Alina Kaminska Beauty Academy — salão de estética + academia de formação, Torrevieja (Costa Blanca, Alicante).
> Objetivo deste documento: reunir a evidência e propor uma arquitetura justificada. Nada é construído antes da validação.

---

## 0. Diagnóstico do ponto de partida (site atual analisado)

Site: https://www.alinakaminskabeautyacademy.com/ — WordPress, brochura de 4 páginas.

| Elemento | Estado | Implicação |
|---|---|---|
| Estrutura | 4 páginas (Home, Sobre, Serviços, Contacto) | Informa, não vende |
| Idiomas | **Só espanhol** | Perde o mercado britânico/nórdico/polaco/italiano — o núcleo de Torrevieja |
| Marcação online | **Inexistente** | Toda a marcação passa por ela = gargalo |
| Captação de leads | **Inexistente** | Não constrói base de dados própria via site |
| Preços | Não mostrados | Mais fricção, mais perguntas manuais |
| Prova social | Sem testemunhos/galeria | Baixa conversão |
| Contacto | Telefone + email + WhatsApp manual | 100% dependente do tempo dela |

**Conclusão:** o site é hoje um folheto e todo o trabalho de conversão recai sobre ela.

---

## 1. Pesquisa de mercado — benchmarks (com fontes)

**Retenção (a alavanca #1):**
- Retenção saudável num salão: **60–70%** (top ~75%). Retenção de cliente novo (1ª→2ª visita): média **~35%** (65% nunca volta) — exatamente o padrão dela (~80% perdidos). [Meevo, Boulevard/Salon Today]
- **+5% de retenção → +25% a +95% de lucro** (Reichheld, Bain/HBR) — a estatística-âncora.
- Adquirir cliente novo custa **5–25× mais** que reter/reativar um existente (Bain).

**No-show:**
- Taxa típica **15–30%**; lembretes automáticos reduzem-na **60–70%** (para ~5%). SMS tem 98% de abertura. Depósito/pré-pagamento é ainda mais forte que o lembrete. [Shortcuts, Vocaly AI]

**Ticket médio (Espanha):**
- Manicura semipermanente **15–35 €**; uñas gel/acrílico **35–60 €**; extensión pestañas **40–70 €** (volumen ruso ~70 €); cejas **9–15 €** (baixo ticket, alta frequência → gancho de fidelização).

**Cursos:**
- Presencial certificado (ES): pestañas ~160 €, uñas ~195 €, faixa geral **150–500 €+**.
- Online genérico (Udemy) vende-se a **~13 €** (baixo valor percebido). **Fosso de mercado:** curso online de marca própria com certificado pode posicionar-se a **50–150 €**, sem competir com o presencial.

**LTV / mercado local:**
- LTV anual por cliente retido: **200–800 €/ano**; cliente full-service 4–6 visitas/ano; clientes fiéis gastam ~67% mais.
- Torrevieja: **~98.500 hab., ~40% estrangeiros**; britânicos (20.000+ na zona), nórdicos, ucranianos, etc. → mercado **maduro e fidelizável**, não só turismo de passagem. Confirma o valor do **multilíngue**.

---

## 2. Panorama de soluções por categoria (resumo dos comparativos)

### 2.1 Marcação (booking) + posse de dados
- **SaaS marketplace (Booksy/Fresha/Treatwell):** falham o requisito de posse — o cliente é "deles" e cobram **comissão sobre novos clientes** (Treatwell 25% ES, Fresha 20%, Booksy Boost 30%). Exportar CSV não resolve a dependência.
- **Plugins WordPress (é dona de tudo):**
  - **LatePoint** — WhatsApp+SMS **nativos em todos os planos**, lifetime **$199** (1 site), tudo incluído. Melhor custo/simplicidade.
  - **Amelia** — mais robusto para estética (pacotes, **depósitos anti-no-show no Elite**); WhatsApp nativo a partir do Standard.
  - Evitar **Bookly** (add-ons + Bookly Cloud metered = custo e manutenção altos).

### 2.2 CRM / base de 1000+ contactos
- **Airtable Free (1.000 reg.) e HubSpot Free (1.000 contactos)** ficam aquém logo no requisito.
- **Brevo (ex-Sendinblue)** vence: **100.000 contactos grátis**, empresa **EU/RGPD**, **campanhas WhatsApp + email nativas**, 300 emails/dia no grátis (suficiente). Alternativa de controlo total: **n8n + Postgres** self-host.

### 2.3 Atendimento IA 24h multilíngue (ES/EN/PL/IT)
- **Insight-chave:** um bot de salão é quase todo **reativo** (cliente escreve primeiro). No novo modelo Meta (desde 1 jul 2025), respostas dentro da janela de 24h (*service messages*) são **gratuitas**. → **WhatsApp custa ≈ 0 €** no uso típico; só pagas mensagens proactivas (utility ~0,0166 €, marketing ~0,0509 € em ES).
- O "cérebro" multilíngue (LLM) custa **cêntimos** (gpt-4o-mini ~0,60 $/mês a 300 conversas). A deteção de idioma e resposta nas 4 línguas é nativa do LLM.
- Duas vias:
  - **No-code, mínima manutenção → ManyChat** (~58 $/mês): WhatsApp + Instagram DM + IA num só sítio, montagem em horas.
  - **Mais barato a operar → n8n self-host + Cloud API + gpt-4o-mini** (~5–15 €/mês): requer servidor e setup técnico.

### 2.4 Curso online (funil)
- **Evitar Udemy/Domestika** para o funil (não dás os emails dos alunos → quebra o funil).
- **Posse de dados + funil:** começar leve com **Stripe Checkout + vídeo em área protegida** (mais barato, dados dela) ou **Gumroad/Hotmart** (são **Merchant of Record → tratam o IVA UE automaticamente**, importante para poupar tempo/compliance).
- Escalar para **Tutor LMS Pro ($199/ano) no WordPress** dela (marca própria, multilíngue real) quando validado — mas aí **o IVA OSS passa a ser responsabilidade dela** (custo oculto).
- **Estrutura de oferta (funil):** curso gravado barato (€19–49, capta email) → upsell materiais → **presencial high-ticket (€300–900, o lucro)** → aulas 1:1 (€60–120/h) → combos âncora.
- Gravação low-cost: smartphone 4K + braço cenital (filmar as mãos) + ring light + micro de lapela + CapCut. Entrega em Vimeo privado.

### 2.5 Tráfego pago + criativos
- **Meta Ads** é o melhor motor (encher agenda local + vender curso); **CPL beleza ES ~10–35 €/lead**, mínimo realista ~20–30 €/dia. TikTok orgânico/ads para alcance e criativos virais. Google Search complementa por intenção.
- Criativos low-cost: **CapCut + Canva** (grátis/Pro ~12 €/mês); UGC/avatares IA (HeyGen, Arcads) opcional.

### 2.6 TikTok Shop (objetivo #9 — honestidade)
- TikTok Shop Espanha está **disponível desde fev/2025**, **mas só vende PRODUTOS FÍSICOS** — **não serviços nem cursos**. Comissão geral subiu para 9% (beleza 7%) em jan/2026.
- → **Para serviços e curso, TikTok Shop não serve.** Faz sentido **só se/quando** ela vender cosmética física. Entretanto: **TikTok orgânico + TikTok Ads** com checkout próprio. **Diferir, não fingir.**

### 2.7 Relatórios + sugestões (objetivo #8 — como, não hand-wave)
- Métricas base saem do booking (LatePoint/Amelia) + Brevo. Dashboard via **Looker Studio (grátis)** ou **Metabase (open-source)** sobre a BD de marcações. "Sugere promoções/estratégias" = **job LLM periódico** que lê as stats e devolve recomendações + rascunhos de campanha. Buildable e barato.

### 2.8 Kit Digital (financiamento — arrancar JÁ)
- Reativado pela **Orden TDF/39/2026**. Salão autónomo = **Segmento III → até 3.000 €** total.
- Importes oficiais (Segmento III): web 2.000 €, comércio eletrónico 2.000 €, redes sociais 2.000 €, **CRM 2.000 €**, **BI 1.500 €**, fatura eletrónica 1.000 €.
- Elegibilidade: domicílio fiscal ES, em dia com fisco/SS, **antiguidade ≥6 meses**, Test de Diagnóstico Digital, regra de minimis. **Por ordem de chegada até esgotar** → candidatar cedo.

---

## 3. Arquitetura recomendada (o sistema)

```
                          ┌─────────────────────────────────────────────┐
                          │   SITE WORDPRESS (dela, multilíngue ES/EN/    │
                          │   PL/IT via Polylang) — DONA DOS DADOS        │
                          │                                               │
   Cliente  ───────────▶  │  • LatePoint/Amelia (marcação + depósito)     │
   (web)                  │  • Formulários de captação de lead            │
                          │  • Página do curso (Stripe/Tutor LMS)         │
                          └───────────────┬───────────────────────────────┘
                                          │
   WhatsApp / IG DM ──▶  ┌────────────────▼───────────────┐   ┌──────────────────┐
   (cliente escreve)     │  CAMADA DE AUTOMAÇÃO            │──▶│  CRM = Brevo      │
                         │  (n8n self-host  OU  ManyChat)  │   │  (100k contactos, │
   ┌─────────────────┐   │  • Agente IA multilíngue (LLM)  │   │   EU/RGPD,        │
   │ Base 1047        │──▶│  • Deteção de idioma            │   │   segmentação,    │
   │ clientes (840    │   │  • FAQ/preços/serviços (RAG)    │   │   email+WhatsApp) │
   │ adormecidos)     │   │  • Lembretes (anti no-show)     │   └──────────────────┘
   └─────────────────┘    │  • Reativação + retenção        │
                          │  • Job de relatórios/sugestões  │──▶ Dashboard (Looker/
                          └─────────────────────────────────┘    Metabase)
```

**Princípios da arquitetura (porquê assim):**
1. **WordPress como núcleo** = aproveita o que já existe + Kit Digital + posse total dos dados (requisito inegociável).
2. **Marcação no próprio domínio** (LatePoint/Amelia) em vez de marketplace → 0% comissão sobre os clientes dela.
3. **Brevo como CRM** → único grátis que aguenta 1000+ contactos, é EU/RGPD e faz email+WhatsApp.
4. **Atendimento reativo ≈ 0 €** → o maior medo (custo) está resolvido pela mecânica nova da Meta.
5. **Curso como funil** para o presencial high-ticket → o lucro vive no presencial e no 1:1, não no curso barato.
6. **Tudo orquestrado** numa só camada de automação (n8n ou ManyChat) → reduz o trabalho manual dela a quase zero.

---

## 4. Faseamento — LIDERA PELA CAIXA, antes de qualquer gasto em ads

### Fase 0 — Reativação dos 840 adormecidos (esta semana, ~0–42 €) ⚡ QUICK WIN
O ativo mais valioso que ela já tem. Reativar custa quase nada (Brevo grátis + ~0,05 €/mensagem WhatsApp marketing × 840 ≈ 42 €, ou só email = 0 €).
- **Cálculo conservador:** se só **8–10%** voltarem = ~70–84 clientes × ~50 € = **~3.500–4.200 € quase sem custo.**
- Esta caixa **auto-financia** todas as fases seguintes.
- ⚠️ **RGPD:** email a clientes existentes para serviços similares é geralmente defensável (soft opt-in); **WhatsApp marketing tem regras de opt-in próprias da Meta** → começar por **email/utility** e migrar para WhatsApp quem responder.

### Fase 1 — Fundação (baixo custo): deixar de ser o gargalo
- Site multilíngue (Polylang) + **marcação online** (LatePoint/Amelia, com **depósito** anti-no-show) + **captação de leads**.
- **Brevo** ligado (importar os 1047 contactos).
- **Agente IA WhatsApp/IG 24h** multilíngue (reativo ≈ grátis).
- **Lembretes automáticos** (mata o no-show).
- Resultado: ela passa a ser **dona dos dados** e recupera tempo.

### Fase 2 — Curso online como funil
- Gravar curso (low-cost) → vender (Stripe/Gumroad/Hotmart) → sequência automática que vende o **presencial high-ticket**.
- Meta: ≥2 alunos/dia de presencial; centro de formação dentro do salão.

### Fase 3 — Tráfego pago + criativos (financiado pela caixa das fases 0–2)
- Meta Ads (agenda local + curso) + criativos IA. TikTok orgânico/ads. TikTok Shop só se vender produto físico.

### Em paralelo desde já
- **Kit Digital:** Test de Diagnóstico + candidatura (reembolsa web/CRM/e-commerce/BI → ataca diretamente a restrição de orçamento).
- **Relatórios/sugestões:** dashboard + job LLM semanal.

---

## 5. Custos estimados (a confirmar na bifurcação de manutenção)

| Item | Opção própria (n8n) | Opção SaaS (ManyChat) |
|---|---|---|
| Marcação | LatePoint $199 lifetime (1×) | idem |
| CRM | Brevo grátis | Brevo grátis |
| Atendimento IA | n8n self-host VPS ~7 € + LLM <1 €/mês | ManyChat ~58 $/mês |
| WhatsApp (reativo) | ≈ 0 € | ≈ 0 € |
| Site multilíngue | Polylang grátis / WPML ~99 €/ano | idem |
| Curso (arranque) | Stripe 1,5%+0,25 €/venda | idem |
| Hosting | já tem | já tem |
| **Total ano 1 (aprox.)** | **~$199 + ~100–180 €** | **~$199 + ~700 $/ano** |

Ads e licenças premium só entram quando há caixa. Kit Digital pode reembolsar boa parte.

---

## 6. Impacto esperado (modelo ilustrativo)

- **Ocupação 10–12 → 20+/dia:** vem de reativação + retenção + remoção de fricção de marcação (não de ads).
- **Reativação Fase 0:** ~3.500–4.200 € de caixa quase imediata.
- **No-show de ~20% → ~5%** com lembrete+depósito = recuperação direta de receita.
- **Curso online:** ativo que vende 24/7 e alimenta o presencial high-ticket (o verdadeiro lucro, independente das horas dela).

---

## 7. Suposições, restrições e riscos (a validar)

1. **QUEM MANTÉM A AUTOMAÇÃO?** — *a suposição mais importante.* Todo o argumento de custo "n8n self-host" assume que **tu (engenheiro) operas/manténs a camada por ela**. Se for a **Alina** a manter, o veredito muda para **ManyChat/SaaS** (mais caro, mas mínima manutenção). **Esta é a bifurcação que precisa da tua decisão.**
2. **RGPD / opt-in WhatsApp** na reativação (ver Fase 0).
3. **IVA / Merchant of Record** no curso: Stripe-no-WP torna o IVA OSS problema dela; Hotmart/Gumroad tratam-no.
4. **TikTok Shop** não serve serviços/cursos (só produto físico) — diferido.
5. **Kit Digital** é por ordem de chegada e exige ≥6 meses de antiguidade — candidatar já.
6. **Depósito anti-no-show** favorece Amelia (Elite) vs LatePoint — escolher conforme prioridade.

---

## 8. Decisões que preciso que valides antes de construir
- **(A) Manutenção:** ela opera sozinha (→ SaaS/ManyChat) ou tu/eu operamos a camada de automação (→ n8n self-host, mais barato)?
- **(B) Plugin de marcação:** LatePoint (mais simples/barato) vs Amelia (depósito anti-no-show mais forte)?
- **(C) Curso:** prioridade a "zero compliance" (Gumroad/Hotmart MoR) ou a marca própria/WordPress (Tutor LMS, IVA por conta dela)?
- **(D) Por onde começo a construir:** Fase 0 (reativação — caixa imediata) primeiro, certo?
