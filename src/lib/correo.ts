import 'server-only';

import nodemailer from 'nodemailer';

/**
 * SMTP de Teo Labs (Zoho, casilla hola@teolabs.app). Acepta los mismos nombres
 * de variables que las demas apps (EMAIL_*, ZOHO_SMTP_*) ademas de SMTP_*,
 * para no inventar nombres nuevos en cada hosting.
 */
const env = (...nombres: string[]) => nombres.map((n) => process.env[n]?.trim()).find(Boolean) ?? '';

const smtp = () => ({
  host: env('SMTP_HOST', 'EMAIL_HOST') || 'smtp.zoho.com',
  port: Number(env('SMTP_PORT', 'EMAIL_PORT') || 465),
  user: env('SMTP_USER', 'EMAIL_USER', 'ZOHO_SMTP_USER'),
  pass: env('SMTP_PASS', 'EMAIL_PASS', 'ZOHO_SMTP_PASS'),
});

export const correoConfigurado = () => Boolean(smtp().user && smtp().pass);

export const escapar = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const PUNTOS = [
  [37, 99, 235],
  [168, 85, 247],
  [34, 197, 94],
]; // azul → morado → verde

/** Los clientes de correo no hacen texto con degradado: cada letra lleva su color. */
export function teoLabsDegradado(): string {
  const texto = 'Teo Labs';
  const n = texto.length - 1;
  return [...texto]
    .map((ch, i) => {
      const t = (i / n) * (PUNTOS.length - 1);
      const a = PUNTOS[Math.floor(t)];
      const b = PUNTOS[Math.min(Math.ceil(t), PUNTOS.length - 1)];
      const f = t - Math.floor(t);
      const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
      return `<span style="color:rgb(${c.join(',')});font-weight:700">${escapar(ch)}</span>`;
    })
    .join('');
}

export async function enviarCorreo(d: { para: string; asunto: string; texto: string; html: string }) {
  const { host, port, user, pass } = smtp();
  const transporte = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  await transporte.sendMail({
    from: `"Teo Labs" <${user}>`,
    to: d.para,
    subject: d.asunto,
    text: d.texto,
    html: d.html,
  });
}
