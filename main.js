import './style.css';

// ============================================================
// VARIABLES
// ============================================================
const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');
const btnLeyenda1 = document.getElementById('btn-leyenda-1');
const btnLeyenda2 = document.getElementById('btn-leyenda-2');
const areaTexto = document.getElementById('contenido-dinamico');

// ============================================================
// MENÚ
// ============================================================
btnMenu.addEventListener('click', () => {
  sidebar.classList.toggle('abierto');
});

// ============================================================
// MOSTRAR LEYENDA
// ============================================================
function mostrarLeyenda(titulo, descripcion, contenido = '') {
  areaTexto.innerHTML = `
    <h2>${titulo}</h2>
    <p>${descripcion}</p>
    ${contenido}
  `;
  sidebar.classList.remove('abierto');
}

// ============================================================
// CARRETÓN
// ============================================================
btnLeyenda1.addEventListener('click', () => {
  mostrarLeyenda(
    'El Carretón de la Otra Vida',
    'Se escucha el crujir de las ruedas de madera acercándose en la oscuridad...',
    `
    <div class="historia-leyenda">
      <h3>La Leyenda del Carretón</h3>
      <p>Cuenta la tradición que durante las noches silenciosas puede escucharse el sonido de un carretón que avanza por las calles.</p>
    </div>
    `
  );
});

// ============================================================
// GUAJOJÓ - EXPERIENCIA AR CON MODEL-VIEWER
// ============================================================
btnLeyenda2.addEventListener('click', () => {
  mostrarLeyenda(
    'El Guajojó',
    'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',
    `
    <!-- BOTÓN PARA ENTRAR A AR -->
    <button id="btn-abrir-ar" class="btn-ver-ar" type="button">
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>

    <!-- MODEL-VIEWER (se muestra al tocar el botón) -->
    <div id="visor-ar" style="display: none; margin-top: 16px;">
      <model-viewer
        id="model-viewer-guajojo"
        src="/guajojo.glb"
        alt="Guajojó en Realidad Aumentada"
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        camera-controls
        touch-action="pan-y"
        shadow-intensity="1"
        exposure="1"
        style="width: 100%; height: 360px; background: #1a1a1a; border-radius: 16px;"
      >
        <!-- Botón nativo de AR de model-viewer -->
        <button slot="ar-button" id="btn-ar-nativo" style="
          background: #1b5e20;
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 30px;
          font-size: 16px;
          font-weight: bold;
          position: absolute;
          bottom: 16px;
          left: 50%;
          transform: translateX(-50%);
        ">
          📱 Activar cámara AR
        </button>
      </model-viewer>

      <p style="text-align: center; margin-top: 12px; color: #555; font-size: 14px;">
        1. Toca <strong>Activar cámara AR</strong><br>
        2. Busca una superficie<br>
        3. Coloca el Guajojó<br>
        4. Cuando lo veas, toca <strong>CAPTURAR</strong>
      </p>

      <button id="btn-capturar" class="btn-ver-ar" type="button" style="
        display: none;
        margin: 16px auto;
        background: #2e7d32;
      ">
        ✨ CAPTURAR GUAJOJÓ
      </button>
    </div>

    <!-- CONTENIDO QUE SE REVELA DESPUÉS DE CAPTURAR -->
    <div id="contenido-capturado" style="display: none; margin-top: 20px;">
      <div style="
        background: #e8f5e9;
        border: 2px solid #2e7d32;
        border-radius: 16px;
        padding: 16px;
        text-align: center;
        margin-bottom: 20px;
      ">
        <h3 style="color: #1b5e20; margin: 0 0 8px 0;">✨ ¡CAPTURADO!</h3>
        <p style="margin: 0; color: #333;">Has descubierto al Guajojó</p>
      </div>

      <div class="multimedia-leyenda">
        <div class="reproductor-leyenda">
          <h3>Escucha su canto original</h3>
          <audio id="audio-guajojo" controls>
            <source src="/audio-guajojo.mp3" type="audio/mpeg">
            Tu navegador no soporta audio.
          </audio>
        </div>
        <img src="/foto-guajojo.jpg" alt="Fotografía del Guajojó" class="foto-leyenda">
      </div>

      <div class="historia-leyenda">
        <h3>La Leyenda del Guajojó</h3>
        <p>Cuenta la leyenda que hace muchos años, en una antigua tribu de la selva oriental, la hermosa hija del cacique se enamoró perdidamente de un joven guerrero.</p><br>
        <p>Al enterarse de este romance prohibido, el cacique enfureció y llevó al joven guerrero a lo más profundo de la selva.</p><br>
        <p>La muchacha salió desesperada en busca de su amado y finalmente encontró su cuerpo sin vida.</p><br>
        <p>Su llanto fue tan profundo que los espíritus de la selva la transformaron en un ave.</p><br>
        <p>Desde entonces, durante las noches, puede escucharse su triste canto: <strong>¡Gua... jo... jó!</strong></p>
      </div>
    </div>
    `
  );

  // Cargar la librería model-viewer si no está
  cargarModelViewer().then(() => {
    setTimeout(() => {
      const btnAbrir = document.getElementById('btn-abrir-ar');
      const visor = document.getElementById('visor-ar');
      const btnCapturar = document.getElementById('btn-capturar');
      const modelViewer = document.getElementById('model-viewer-guajojo');

      if (btnAbrir) {
        btnAbrir.addEventListener('click', () => {
          btnAbrir.style.display = 'none';
          if (visor) visor.style.display = 'block';

          // Mostrar botón capturar después de un momento
          setTimeout(() => {
            if (btnCapturar) btnCapturar.style.display = 'block';
          }, 1500);
        });
      }

      if (btnCapturar) {
        btnCapturar.addEventListener('click', () => {
          // Ocultar el visor AR
          if (visor) visor.style.display = 'none';

          // Mostrar contenido capturado
          const contenido = document.getElementById('contenido-capturado');
          if (contenido) contenido.style.display = 'block';

          // Reproducir audio
          const audio = document.getElementById('audio-guajojo');
          if (audio) {
            audio.play().catch(() => {
              console.log('Autoplay bloqueado, el usuario puede darle play');
            });
          }
        });
      }

      // Cuando el usuario sale de AR nativo, podemos detectar el evento
      if (modelViewer) {
        modelViewer.addEventListener('ar-status', (e) => {
          console.log('AR status:', e.detail.status);
          if (e.detail.status === 'session-started') {
            // Está en AR
          }
          if (e.detail.status === 'not-presenting') {
            // Salió de AR
          }
        });
      }
    }, 100);
  });
});

// ============================================================
// CARGAR MODEL-VIEWER
// ============================================================
function cargarModelViewer() {
  return new Promise((resolve) => {
    if (customElements.get('model-viewer')) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    script.onload = () => resolve();
    script.onerror = () => {
      console.error('No se pudo cargar model-viewer');
      resolve();
    };
    document.head.appendChild(script);
  });
}
