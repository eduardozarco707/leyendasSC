// ============================================================
// CAMBAMITOS · GENERADOR DE TICKETS (PROTOTIPO FASE 1)
// ------------------------------------------------------------
// Genera un código autocontenible para demostración.
// En producción, la compra y creación del ticket irá al backend.
// ============================================================

const CMT_DEMO_SECRET = 'CAMBAMITOS-DEMO-2026-NO-USAR-EN-PRODUCCION';
const CMT_ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function aleatorioGrupo(longitud = 4) {
  const bytes = new Uint8Array(longitud);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, n => CMT_ALFABETO[n % CMT_ALFABETO.length]).join('');
}

function hex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

async function firmaBase(base) {
  const bytes = new TextEncoder().encode(`${CMT_DEMO_SECRET}|${base}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return hex(digest).slice(0, 4);
}

async function crearCodigoTicket() {
  const base = `CMB-${aleatorioGrupo()}-${aleatorioGrupo()}`;
  const firma = await firmaBase(base);
  return `${base}-${firma}`;
}

function urlDeActivacion(codigo) {
  const origen = window.location.origin;
  return `${origen}/?ticket=${encodeURIComponent(codigo)}#experiencia-cambamitos`;
}

async function generarTicket() {
  const boton = document.getElementById('ticket-comprar');
  if (boton) {
    boton.disabled = true;
    boton.textContent = 'GENERANDO…';
  }

  try {
    const codigo = await crearCodigoTicket();
    const url = urlDeActivacion(codigo);

    const vacio = document.getElementById('ticket-vacio');
    const pase = document.getElementById('ticket-pase');
    const codigoEl = document.getElementById('ticket-codigo');
    const qr = document.getElementById('ticket-qr');
    const abrir = document.getElementById('ticket-abrir');

    if (vacio) vacio.hidden = true;
    if (pase) pase.hidden = false;
    if (codigoEl) codigoEl.textContent = codigo;
    if (abrir) abrir.href = url;

    if (qr) {
      qr.innerHTML = '';

      if (typeof QRCode === 'function') {
        new QRCode(qr, {
          text: url,
          width: 220,
          height: 220,
          colorDark: '#052e23',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        });
      } else {
        qr.innerHTML = '<p style="max-width:260px;text-align:center;color:#8c3c3c">No se pudo cargar el generador QR. Recarga la página con conexión a internet.</p>';
      }
    }

    document.getElementById('ticket-copiar')?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(codigo);
        const btn = document.getElementById('ticket-copiar');
        if (btn) {
          const previo = btn.textContent;
          btn.textContent = '✓ COPIADO';
          setTimeout(() => { btn.textContent = previo; }, 1200);
        }
      } catch {
        // Copiar manualmente sigue disponible.
      }
    }, { once: true });

  } finally {
    if (boton) {
      boton.disabled = false;
      boton.textContent = 'SIMULAR COMPRA Y GENERAR TICKET';
    }
  }
}

document.getElementById('ticket-comprar')?.addEventListener('click', generarTicket);
