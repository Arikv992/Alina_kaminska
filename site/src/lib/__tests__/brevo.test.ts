import { describe, it, expect } from 'vitest';
import { buildContactPayload } from '../brevo';

describe('buildContactPayload', () => {
  it('mapeia lead para formato Brevo com lista e atributos', () => {
    const p = buildContactPayload({ name: 'Ana', contact: 'ana@x.com', service: 'manicura', locale: 'es' }, 7);
    expect(p.email).toBe('ana@x.com');
    expect(p.listIds).toContain(7);
    expect(p.attributes.NOMBRE).toBe('Ana');
    expect(p.attributes.IDIOMA).toBe('es');
    expect(p.attributes.SERVICIO).toBe('manicura');
  });
  it('usa telefone como SMS quando o contacto não é email', () => {
    const p = buildContactPayload({ name: 'Ana', contact: '+34600111222', service: 'cejas', locale: 'pl' }, 7);
    expect(p.email).toBeUndefined();
    expect(p.attributes.SMS).toBe('+34600111222');
  });
});
