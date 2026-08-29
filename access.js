// ============================================================
// CAMBAMITOS · CONTROL DE ACCESO PREMIUM (PROTOTIPO)
// ------------------------------------------------------------
// Este archivo NO modifica main.js.
// Fase 1: validación local/autocontenida para demostrar el flujo.
// En producción, la validación debe trasladarse al backend.
// ============================================================

const CMT_ACCESS_KEY = 'cambamitos_access_v1';
const CMT_DEMO_SECRET = 'CAMBAMITOS-DEMO-2026-NO-USAR-EN-PRODUCCION';
const CMT_HORAS_ACCESO = 24;

let cmtScannerStream = null;
let cmtScannerTimer = null;

function cmtNormalizarCodigo(valor) {
  return String(valor || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^A-Z0-9-]/g, '');
}

function cmtHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .toUpperCase();
}

async function cmtFirmaBase(base) {
  const bytes = new TextEncoder().encode(`${CMT_DEMO_SECRET}|${base}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return cmtHex(digest).slice(0, 4);
}

async function cmtCodigoEsValido(codigo) {
  const limpio = cmtNormalizarCodigo(codigo);
  const partes = limpio.split('-');

  if (partes.length !== 4 || partes[0] !== 'CMB') {
    return false;
  }

  const [prefijo, grupo1, grupo2, firma] = partes;

  if (!/^[A-Z0-9]{4}$/.test(grupo1) || !/^[A-Z0-9]{4}$/.test(grupo2) || !/^[A-F0-9]{4}$/.test(firma)) {
    return false;
  }

  const base = `${prefijo}-${grupo1}-${grupo2}`;
  const esperada = await cmtFirmaBase(base);
  return esperada === firma;
}

function cmtLeerAcceso() {
  try {
    const dato = JSON.parse(localStorage.getItem(CMT_ACCESS_KEY) || 'null');
    if (!dato || !dato.codigo || !dato.expira) return null;
    if (Date.now() >= Number(dato.expira)) {
      localStorage.removeItem(CMT_ACCESS_KEY);
      return null;
    }
    return dato;
  } catch {
    return null;
  }
}

function cmtTieneAcceso() {
  return Boolean(cmtLeerAcceso());
}

function cmtGuardarAcceso(codigo) {
  const ahora = Date.now();
  const acceso = {
    codigo: cmtNormalizarCodigo(codigo),
    activado: ahora,
    expira: ahora + (CMT_HORAS_ACCESO * 60 * 60 * 1000)
  };

  localStorage.setItem(CMT_ACCESS_KEY, JSON.stringify(acceso));
  return acceso;
}

function cmtFormatoExpiracion(timestamp) {
  try {
    return new Intl.DateTimeFormat('es-BO', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(new Date(timestamp));
  } catch {
    return new Date(timestamp).toLocaleString();
  }
}

function cmtCrearModal() {
  if (document.getElementById('cmt-modal-acceso')) return;

  const modal = document.createElement('div');
  modal.id = 'cmt-modal-acceso';
  modal.className = 'cmt-modal';
  modal.hidden = true;

  modal.innerHTML = `
    <div class="cmt-modal-card" role="dialog" aria-modal="true" aria-labelledby="cmt-modal-titulo">
      <div class="cmt-modal-top">
        <div>
          <span class="cmt-modal-kicker">PASE DIGITAL CAMBAMITOS</span>
          <h2 id="cmt-modal-titulo">Desbloquea la experiencia.</h2>
          <p>
            Valida el QR de tu ticket o escribe el código alfanumérico.
            El texto de las leyendas permanece disponible de forma gratuita.
          </p>
        </div>
        <button class="cmt-modal-cerrar" id="cmt-modal-cerrar" type="button" aria-label="Cerrar">✕</button>
      </div>

      <label class="cmt-codigo-label" for="cmt-codigo-input">Código de acceso</label>
      <div class="cmt-codigo-fila">
        <input
          id="cmt-codigo-input"
          class="cmt-codigo-input"
          type="text"
          inputmode="text"
          autocomplete="off"
          placeholder="CMB-XXXX-XXXX-XXXX"
          maxlength="18"
        >
        <button id="cmt-validar-codigo" class="cmt-validar" type="button">VALIDAR</button>
      </div>

      <div class="cmt-separador"><span>O</span></div>

      <button id="cmt-escanear-qr" class="cmt-escanear" type="button">▦ ESCANEAR QR</button>

      <div id="cmt-scanner" class="cmt-scanner" hidden>
        <video id="cmt-scanner-video" playsinline muted></video>
        <div class="cmt-scanner-ayuda">Coloca el QR completo dentro de la cámara.</div>
      </div>

      <div id="cmt-estado" class="cmt-estado" aria-live="polite"></div>

      <div class="cmt-modal-footer">
        <a class="cmt-boton-ticket" href="/tickets.html">¿No tienes ticket? Comprar ticket</a>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal.querySelector('#cmt-modal-cerrar')?.addEventListener('click', cmtCerrarModal);
  modal.addEventListener('click', evento => {
    if (evento.target === modal) cmtCerrarModal();
  });

  modal.querySelector('#cmt-validar-codigo')?.addEventListener('click', () => {
    cmtValidarDesdeInput();
  });

  modal.querySelector('#cmt-codigo-input')?.addEventListener('keydown', evento => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      cmtValidarDesdeInput();
    }
  });

  modal.querySelector('#cmt-escanear-qr')?.addEventListener('click', cmtIniciarScanner);
}

function cmtAbrirModal() {
  cmtCrearModal();
  const modal = document.getElementById('cmt-modal-acceso');
  if (!modal) return;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('cmt-codigo-input')?.focus(), 60);
}

function cmtCerrarModal() {
  const modal = document.getElementById('cmt-modal-acceso');
  if (modal) modal.hidden = true;
  cmtDetenerScanner();
  document.body.style.overflow = '';
}

function cmtEstado(texto, tipo = '') {
  const el = document.getElementById('cmt-estado');
  if (!el) return;
  el.textContent = texto || '';
  el.className = 'cmt-estado';
  if (tipo) el.classList.add(tipo);
}

async function cmtValidarCodigo(codigo, { cerrar = true } = {}) {
  const limpio = cmtNormalizarCodigo(codigo);

  if (!limpio) {
    cmtEstado('Escribe o escanea un código.', 'aviso');
    return false;
  }

  cmtEstado('Validando ticket…');

  const valido = await cmtCodigoEsValido(limpio);

  if (!valido) {
    cmtEstado('El código no es válido. Revisa el ticket e intenta nuevamente.', 'error');
    return false;
  }

  const acceso = cmtGuardarAcceso(limpio);
  cmtEstado(`✓ Ticket válido. Acceso activo hasta ${cmtFormatoExpiracion(acceso.expira)}.`, 'ok');

  cmtAplicarAccesoEnLeyenda();
  cmtActualizarIndicadorGlobal();

  if (cerrar) {
    setTimeout(cmtCerrarModal, 650);
  }

  return true;
}

async function cmtValidarDesdeInput() {
  const input = document.getElementById('cmt-codigo-input');
  await cmtValidarCodigo(input?.value || '');
}

function cmtExtraerCodigoEscaneado(valor) {
  const texto = String(valor || '').trim();

  try {
    const url = new URL(texto, window.location.origin);
    const ticket = url.searchParams.get('ticket');
    if (ticket) return cmtNormalizarCodigo(ticket);
  } catch {
    // Puede ser el código directamente.
  }

  const match = texto.toUpperCase().match(/CMB-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-F0-9]{4}/);
  return match ? match[0] : '';
}

async function cmtIniciarScanner() {
  cmtEstado('Preparando cámara…');

  if (!('BarcodeDetector' in window)) {
    cmtEstado(
      'Este navegador no permite escanear QR dentro de la web. Puedes usar la cámara normal del celular para abrir el QR, o escribir el código.',
      'aviso'
    );
    return;
  }

  let formatos = [];
  try {
    formatos = await BarcodeDetector.getSupportedFormats();
  } catch {
    formatos = [];
  }

  if (!formatos.includes('qr_code')) {
    cmtEstado('El navegador no admite lectura de códigos QR. Usa la cámara del celular o escribe el código.', 'aviso');
    return;
  }

  try {
    cmtScannerStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' } },
      audio: false
    });

    const contenedor = document.getElementById('cmt-scanner');
    const video = document.getElementById('cmt-scanner-video');

    if (!contenedor || !video) return;

    contenedor.hidden = false;
    video.srcObject = cmtScannerStream;
    await video.play();

    const detector = new BarcodeDetector({ formats: ['qr_code'] });
    cmtEstado('Escaneando QR…');

    const escanear = async () => {
      if (!cmtScannerStream || video.readyState < 2) {
        cmtScannerTimer = setTimeout(escanear, 250);
        return;
      }

      try {
        const codigos = await detector.detect(video);
        if (codigos.length) {
          const codigo = cmtExtraerCodigoEscaneado(codigos[0].rawValue);
          if (codigo) {
            cmtDetenerScanner();
            const input = document.getElementById('cmt-codigo-input');
            if (input) input.value = codigo;
            await cmtValidarCodigo(codigo);
            return;
          }
        }
      } catch {
        // Se continúa intentando.
      }

      cmtScannerTimer = setTimeout(escanear, 280);
    };

    escanear();
  } catch (error) {
    console.warn('No se pudo abrir la cámara del lector QR:', error);
    cmtEstado('No se pudo abrir la cámara. Revisa los permisos del navegador.', 'error');
  }
}

function cmtDetenerScanner() {
  if (cmtScannerTimer) {
    clearTimeout(cmtScannerTimer);
    cmtScannerTimer = null;
  }

  if (cmtScannerStream) {
    cmtScannerStream.getTracks().forEach(track => track.stop());
    cmtScannerStream = null;
  }

  const video = document.getElementById('cmt-scanner-video');
  if (video) video.srcObject = null;

  const contenedor = document.getElementById('cmt-scanner');
  if (contenedor) contenedor.hidden = true;
}

function cmtLeyendaActiva() {
  return document.querySelector('.btn-leyenda.activo')?.dataset?.legend || null;
}

function cmtCrearBloqueo() {
  const panel = document.createElement('section');
  panel.className = 'cmt-candado-panel';
  panel.dataset.cmtLock = 'true';
  panel.innerHTML = `
    <div class="cmt-candado-grid">
      <div class="cmt-candado-icono" aria-hidden="true">🔒</div>
      <div class="cmt-candado-texto">
        <span class="sobrelinea">CONTENIDO PREMIUM</span>
        <h3>Desbloquea la experiencia completa.</h3>
        <p>
          El texto de esta leyenda es gratuito. Valida tu Pase CAMBAMITOS para usar
          realidad aumentada, audiolibro multilingüe y conversación interactiva.
        </p>
      </div>
      <button class="cmt-boton-desbloquear" type="button">DESBLOQUEAR</button>
    </div>
  `;

  panel.querySelector('.cmt-boton-desbloquear')?.addEventListener('click', cmtAbrirModal);
  return panel;
}

function cmtCrearIndicadorAcceso(acceso) {
  const caja = document.createElement('div');
  caja.className = 'cmt-acceso-activo';
  caja.dataset.cmtActive = 'true';
  caja.innerHTML = `
    <div>
      <strong>✓ Pase CAMBAMITOS activo</strong><br>
      <small>Acceso premium hasta ${cmtFormatoExpiracion(acceso.expira)}</small>
    </div>
    <span aria-hidden="true">✦</span>
  `;
  return caja;
}

function cmtExtraerHistoriaGratis(vista) {
  if (!vista || vista.querySelector('.cmt-historia-gratis')) return;

  const contenidoPremium = vista.querySelector('[id^="contenido-capturado-"]');
  const historiaOriginal = contenidoPremium?.querySelector('.historia-leyenda');

  if (!historiaOriginal) return;

  const clon = historiaOriginal.cloneNode(true);
  clon.classList.add('cmt-historia-gratis');
  clon.removeAttribute('id');

  const bloqueo = vista.querySelector('[data-cmt-lock="true"]');
  if (bloqueo) {
    bloqueo.insertAdjacentElement('afterend', clon);
  } else {
    vista.appendChild(clon);
  }
}

function cmtAplicarAccesoEnLeyenda() {
  const vista = document.querySelector('#contenido-dinamico .vista-leyenda');
  if (!vista) return;

  if (vista.dataset.cmtProcesada === 'si') {
    // Aun así actualizamos si cambió el estado del pase.
  }

  vista.dataset.cmtProcesada = 'si';

  const panelAR = vista.querySelector('.panel-target');
  const contenidoPremium = vista.querySelector('[id^="contenido-capturado-"]');

  vista.querySelectorAll('[data-cmt-lock="true"], [data-cmt-active="true"], .cmt-historia-gratis')
    .forEach(el => el.remove());

  if (cmtTieneAcceso()) {
    const acceso = cmtLeerAcceso();

    panelAR?.classList.remove('cmt-premium-bloqueado');

    if (panelAR && acceso) {
      panelAR.insertAdjacentElement('afterend', cmtCrearIndicadorAcceso(acceso));
    }

    if (contenidoPremium) {
      contenidoPremium.style.display = 'block';
      contenidoPremium.querySelector('.mensaje-capturado')?.style.setProperty('display', 'none');
    }

    return;
  }

  panelAR?.classList.add('cmt-premium-bloqueado');

  if (contenidoPremium) {
    contenidoPremium.style.display = 'none';
  }

  const bloqueo = cmtCrearBloqueo();
  panelAR?.insertAdjacentElement('afterend', bloqueo);
  cmtExtraerHistoriaGratis(vista);
}

function cmtActualizarIndicadorGlobal() {
  const selector = document.querySelector('.camba-selector-cabecera');
  if (!selector) return;

  selector.querySelector('.cmt-selector-estado')?.remove();

  const acceso = cmtLeerAcceso();
  const estado = document.createElement('div');
  estado.className = 'cmt-selector-estado';
  estado.style.cssText = 'grid-column:1/-1;margin-top:7px;font-size:.78rem;color:#66716b;';

  if (acceso) {
    estado.innerHTML = `✓ Pase premium activo hasta <strong>${cmtFormatoExpiracion(acceso.expira)}</strong>`;
  } else {
    estado.innerHTML = `Modo gratuito · <button type="button" style="border:0;background:none;color:#07563b;font-weight:800;cursor:pointer;padding:0;">Desbloquear experiencia</button>`;
    estado.querySelector('button')?.addEventListener('click', cmtAbrirModal);
  }

  selector.appendChild(estado);
}

function cmtInterceptarPremium(evento) {
  const botonAR = evento.target.closest?.('.btn-ver-ar');
  if (!botonAR || cmtTieneAcceso()) return;

  evento.preventDefault();
  evento.stopPropagation();
  evento.stopImmediatePropagation();
  cmtAbrirModal();
}

async function cmtProcesarTicketURL() {
  const url = new URL(window.location.href);
  const codigo = url.searchParams.get('ticket');
  if (!codigo) return;

  cmtCrearModal();
  const input = document.getElementById('cmt-codigo-input');
  if (input) input.value = cmtNormalizarCodigo(codigo);

  const valido = await cmtValidarCodigo(codigo, { cerrar: false });

  if (valido) {
    url.searchParams.delete('ticket');
    history.replaceState({}, '', `${url.pathname}${url.search}${url.hash || '#experiencia-cambamitos'}`);
    setTimeout(cmtCerrarModal, 700);
  }
}

function cmtInicializar() {
  cmtCrearModal();

  // Captura el clic ANTES del listener que main.js coloca en cada botón AR.
  document.addEventListener('click', cmtInterceptarPremium, true);

  const area = document.getElementById('contenido-dinamico');
  if (area) {
    const observer = new MutationObserver(() => {
      requestAnimationFrame(cmtAplicarAccesoEnLeyenda);
    });

    observer.observe(area, { childList: true, subtree: true });
  }

  document.querySelectorAll('.btn-leyenda').forEach(boton => {
    boton.addEventListener('click', () => {
      setTimeout(cmtAplicarAccesoEnLeyenda, 0);
    });
  });

  cmtActualizarIndicadorGlobal();
  cmtProcesarTicketURL();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', cmtInicializar, { once: true });
} else {
  cmtInicializar();
}
