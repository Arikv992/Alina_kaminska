# Checklist de credenciais e passos manuais (Fase 0)

> O que preciso de ti / da Alina para ligar e disparar a reativação. Marca cada item.
> Ordenado por **bloqueante primeiro**.

## 🔴 Bloqueantes (sem isto não arranca)

- [ ] **Exportação dos 1047 contactos** (CSV/Excel da plataforma de reservas atual).
      Colunas úteis: nome, email, telefone, último serviço, data última visita, idioma (se existir).
- [ ] **Conta Brevo** criada (plano grátis serve). → dá-me a **API key** (Brevo → SMTP & API).
- [ ] **Domínio de email para envio** (ex.: `hola@alinakaminskabeautyacademy.com`) com acesso ao
      DNS do domínio para configurar **SPF/DKIM/DMARC** (o Brevo dá as instruções).

## 🟠 Necessários para o canal WhatsApp (pode vir depois do email)

- [ ] **WhatsApp Business** + acesso ao **Meta Business Manager** (conta verificada).
- [ ] **WhatsApp Cloud API**: número dedicado, `PHONE_NUMBER_ID`, `WHATSAPP_TOKEN`.
- [ ] Aprovação da **plantilla de marketing** no WhatsApp Manager (texto já pronto nas plantillas).

## 🟡 Infraestrutura (lado do engenheiro)

- [ ] **VPS** para o n8n self-host (~5–7 €/mês; ex.: Hetzner/DigitalOcean). → eu trato do setup.
- [ ] **Chave LLM**: OpenAI (gpt-4o-mini) ou Anthropic (Claude Haiku). → dá-me a API key.
- [ ] **URL da página de reserva** (Amelia). Se ainda não existir, na Fase 0 usamos um link
      provisório (formulário/WhatsApp) e na Fase 1 montamos o Amelia a sério.

## 🟢 Decisões de conteúdo (rápidas, contigo)

- [ ] Confirmar a **oferta** (proposta: diseño de cejas grátis com manicura/pestañas, 14 dias).
- [ ] Confirmar o **remetente** (nome, assinatura, morada, telefone — já nas plantillas).
- [ ] Confirmar os **idiomas a ativar** já (proposta: ES + EN primeiro; PL/IT conforme a base).

## Passos manuais únicos
1. Criar conta Brevo + verificar domínio (DNS).
2. Importar CSV limpo → listas segmentadas.
3. Aprovar plantilla WhatsApp (se/quando usar WhatsApp).
4. Test de Diagnóstico Digital para o **Kit Digital** (em paralelo — ver `../00-PESQUISA-E-ARQUITETURA.md`).

---

### O que EU faço assim que tiver o ⬆️
1. Setup do n8n na VPS.
2. Workflow A (limpeza/segmentação) + carregar contactos no Brevo.
3. Workflows B e C (cadência + agente IA).
4. Lote-piloto de 50 → medir → escalar aos 840.
