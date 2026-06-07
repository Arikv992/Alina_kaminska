# Plantillas de reactivación (ES / EN / PL / IT)

Mensajes listos para la campaña de los 3 toques. **El español es el original**; EN/PL/IT son
traducciones equivalentes. Cada idioma tiene su archivo con: **3 emails** (toque 1, 2, 3) +
**variantes WhatsApp** (solo para contactos con opt-in — ver `../rgpd-y-opt-in.md`).

## Variables de personalización (las rellena n8n/Brevo)
| Variable | Significado | Si falta |
|---|---|---|
| `{{NOMBRE}}` | nombre del cliente | "¡Hola!" / "Hello!" / etc. |
| `{{SERVICIO}}` | último servicio (uñas, pestañas, cejas) | se omite la frase personalizada |
| `{{ENLACE_RESERVA}}` | enlace a la página de reserva (Amelia) | `https://www.alinakaminskabeautyacademy.com/reservar` |
| `{{DIAS_RESTANTES}}` | días que quedan de la oferta | — |
| `{{ENLACE_BAJA}}` | enlace de baja (obligatorio, lo añade Brevo) | — |

## La oferta (idéntica en los 4 idiomas)
**Diseño de cejas GRATIS** al reservar tu próxima cita de manicura o extensión de pestañas.
Válido **14 días**. Código: **BIENVENIDA**.

## Archivos
- `reactivacion-ES.md` · `reactivacion-EN.md` · `reactivacion-PL.md` · `reactivacion-IT.md`

> Para emails: el **Asunto** importa tanto como el cuerpo. Hay un asunto distinto por toque.
> Para WhatsApp: las plantillas de marketing proactivas necesitan **aprobación previa** en
> WhatsApp Manager (Meta). Las respuestas dentro de 24h no necesitan plantilla.
