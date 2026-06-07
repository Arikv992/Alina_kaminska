export type Lead = { name: string; contact: string; service: string; locale: string };

export function buildContactPayload(lead: Lead, listId: number) {
  const isEmail = lead.contact.includes('@');
  const attributes: Record<string, string> = { NOMBRE: lead.name, IDIOMA: lead.locale, SERVICIO: lead.service };
  if (!isEmail) attributes.SMS = lead.contact;
  return { email: isEmail ? lead.contact : undefined, listIds: [listId], attributes, updateEnabled: true };
}

export async function createBrevoContact(lead: Lead) {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID || 0);
  if (!apiKey) throw new Error('BREVO_API_KEY missing');
  const res = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(buildContactPayload(lead, listId)),
  });
  if (!res.ok && res.status !== 204) {
    const t = await res.text();
    if (!t.includes('duplicate_parameter')) throw new Error(`Brevo ${res.status}: ${t}`);
  }
  return true;
}
