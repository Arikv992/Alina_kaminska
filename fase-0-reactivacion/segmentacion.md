# Segmentação dos 1047 contactos

## Objetivo
Enviar a mensagem certa, no idioma certo, e medir. Mesmo que a base antiga seja "suja",
extraímos o máximo com o que houver.

## Campos mínimos (mapear a partir da exportação)
| Campo Brevo | Origem na lista antiga | Se faltar |
|---|---|---|
| `EMAIL` | coluna email | sem email → vai só para segmento WhatsApp/SMS (se houver telefone + opt-in) |
| `NOMBRE` | nome | usar saudação genérica ("¡Hola!") |
| `TELEFONO` | telefone | formato internacional `+34...`; usado só com opt-in |
| `IDIOMA` | se existir | **inferir** (ver abaixo) → default `ES` |
| `ULTIMA_VISITA` | data última visita/compra | se faltar → segmento "desconhecido" |
| `SERVICIO` | serviço feito | personaliza a oferta (unhas/pestañas/cejas) |

## Inferência de idioma (quando não há campo idioma)
Ordem de pistas:
1. **Indicativo telefónico:** `+44` → EN · `+48` → PL · `+39` → IT · `+34`/ES → ES · nórdicos (`+46/+47/+45/+358`) → EN.
2. **Domínio de email / nome:** heurística suave (ex.: nomes/sobrenomes polacos → PL).
3. **Default seguro:** `ES`. Em caso de dúvida, **enviar versão bilíngue ES+EN** (Torrevieja é majoritariamente ES+EN).

> Regra prática: não sobre-engenhar. ES e EN cobrem a maioria; PL e IT aplicam-se quando o indicativo/nome é claro.

## Segmentos para a campanha
| Segmento | Critério | Tratamento |
|---|---|---|
| **A — Adormecidos com email** | tem email, sem visita recente | Campanha completa (3 toques), idioma inferido |
| **B — Adormecidos só telefone** | sem email, tem telefone | Só se houver opt-in WhatsApp; senão, parqueado |
| **C — Recorrentes (20–30)** | visita recente / frequentes | **Excluir da reativação**; entram na retenção (Fase 1), não receber "te echamos de menos" |
| **D — Inválidos** | email/telefone inválido | Limpar, não enviar |

> Importante: **excluir os recorrentes** da campanha de reativação — mandar "sentimos a tua falta"
> a quem esteve cá há uma semana destrói credibilidade.

## Listas no Brevo (a criar)
- `reactivacion-A-email-ES` / `-EN` / `-PL` / `-IT`
- `reactivacion-B-whatsapp` (só opt-in)
- `clientes-recurrentes` (excluídos da campanha)
- Etiqueta de resultado: `reactivado-2026`

## Entregável técnico associado
O **script de limpeza/segmentação** corre no n8n (nó Code) ou num Google Sheet intermédio:
normaliza telefones, deduplica por email, infere idioma e atribui o segmento — ver
`n8n/workflow-reactivacion.md`.
