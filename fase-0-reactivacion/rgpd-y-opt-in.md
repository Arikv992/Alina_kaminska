# RGPD e opt-in — como reativar legalmente

> ⚠️ Não sou advogado; isto é orientação prática conforme RGPD (UE) + LSSI-CE (Espanha) +
> regras da Meta. Em caso de dúvida sobre a base de dados concreta, validar com gestor/assessoria.

## Princípio geral
Os 1047 contactos são **clientes existentes** (já compraram serviços). Isso muda tudo
face a uma lista fria comprada.

## Canal 1 — EMAIL (canal de arranque, o mais seguro)
- **Base legal:** interesse legítimo / "soft opt-in" — podes contactar **clientes existentes**
  sobre **serviços semelhantes** aos que já compraram (art. relativo a marketing a clientes).
- **Requisitos:**
  - Incluir sempre **link de baixa (unsubscribe)** visível — já tratado nas plantillas.
  - Identificar claramente o remetente (Alina Kaminska Beauty Academy + morada).
  - Só a quem comprou serviços semelhantes (estética) — é o caso de todos.
- **Veredito:** **email-first é defensável** para esta base. É por aqui que se começa.

## Canal 2 — WhatsApp (cuidado: regras da Meta + RGPD)
WhatsApp é mais sensível porque:
1. **A Meta exige opt-in** para enviares *templates* de **marketing** proativos (a pessoa
   tem de ter aceitado receber mensagens tuas por WhatsApp).
2. Enviar marketing a quem nunca deu opt-in pode levar a **bloqueio do número** pela Meta
   e a queixa RGPD.

**Como fazer certo:**
- **NÃO** disparar WhatsApp marketing à fria para os 840.
- Usar WhatsApp **só** com:
  - contactos que **já te escreveram por WhatsApp** antes (há relação/opt-in implícito na conversa que eles iniciaram), **ou**
  - quem, no email, **clicar e aceitar** continuar por WhatsApp, **ou**
  - quem **responder** à campanha.
- As mensagens **de resposta** dentro da janela de 24h são *service messages* (grátis e sem template).
- Templates de marketing proativos precisam de **aprovação prévia** no WhatsApp Manager.

## Fluxo recomendado (combina os dois)
```
1. EMAIL a todos (toque 1 e 2)  ──▶  base legal sólida, custo 0
2. Quem CLICA / RESPONDE         ──▶  opt-in WhatsApp ("¿Seguimos por WhatsApp?")
3. A partir daí, WhatsApp com agente IA (respostas reativas = grátis)
4. WhatsApp proativo (toque 3 / futuras promos) só a quem deu opt-in
```

## Higiene de dados (obrigatório antes de enviar)
- Remover emails inválidos/duplicados (reduz bounces e protege a reputação do domínio).
- Registar a **fonte e data do consentimento** de cada contacto que migra para WhatsApp.
- Honrar **imediatamente** qualquer baixa/opt-out (o n8n + Brevo tratam disto).
- Guardar prova de que são clientes existentes (histórico de marcações) — justifica o soft opt-in.

## Domínio de envio (deliverability)
- Enviar de um **domínio próprio** (ex.: `hola@alinakaminskabeautyacademy.com`), não Gmail.
- Configurar **SPF, DKIM e DMARC** no domínio (o Brevo dá as instruções) — evita ir para spam.
- Aquecer: começar pelo **lote-piloto de ~50** antes de disparar os 840 (protege a reputação).
