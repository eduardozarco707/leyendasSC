import './style.css';

// ============================================================
// VARIABLES
// ============================================================
const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');
const btnLeyenda1 = document.getElementById('btn-leyenda-1');
const btnLeyenda2 = document.getElementById('btn-leyenda-2');
const areaTexto = document.getElementById('contenido-dinamico');

let streamCamara = null;

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
// GUAJOJÓ - AR SOLO WEB (cámara + modelo 3D)
// ============================================================
btnLeyenda2.addEventListener('click', () => {
  mostrarLeyenda(
    'El Guajojó',
    'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',
    `
    <button id="btn-abrir-ar" class="btn-ver-ar" type="button">
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>

    <!-- CONTENEDOR AR A PANTALLA COMPLETA -->
    <div id="pantalla-ar" style="
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      background: #000;
    ">
      <!-- VIDEO DE LA CÁMARA -->
      <video id="video-camara" autoplay playsinline muted style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      "></video>

      <!-- MODELO 3D ENCIMA DE LA CÁMARA -->
      <div id="contenedor-modelo" style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      ">
        <a-scene
          id="escena-guajojo"
          embedded
          vr-mode-ui="enabled: false"
          xr-mode-ui="enabled: false"
          renderer="alpha: true; antialias: true;"
          style="width: 100%; height: 100%; background: transparent !important;"
        >
          <a-assets>
            <a-asset-item id="modelo-guajojo-asset" src="/guajojo.glb"></a-asset-item>
          </a-assets>

          <a-entity
            id="modelo-guajojo"
            gltf-model="#modelo-guajojo-asset"
            position="0 0 -2"
            scale="0.25 0.25 0.25"
            rotation="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 12000; easing: linear"
          ></a-entity>

          <a-camera position="0 1.6 0" look-controls="enabled: false" wasd-controls="enabled: false"></a-camera>
          <a-light type="ambient" color="#ffffff" intensity="1.3"></a-light>
          <a-light type="directional" color="#ffffff" intensity="0.7" position="1 3 2"></a-light>
        </a-scene>
      </div>

      <!-- UI SUPERIOR -->
      <div style="
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.75);
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        font-size: 15px;
        z-index: 10;
        text-align: center;
        max-width: 90%;
      ">
        📷 Apunta y captura al Guajojó
      </div>

      <!-- BOTÓN CAPTURAR -->
      <button id="btn-capturar" style="
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        background: #1b5e20;
        color: white;
        border: none;
        padding: 18px 48px;
        border-radius: 50px;
        font-size: 18px;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        z-index: 10;
        cursor: pointer;
      ">
        ✨ CAPTURAR
      </button>

      <!-- BOTÓN CERRAR -->
      <button id="btn-cerrar-ar" style="
        position: absolute;
        top: 16px;
        right: 16px;
        background: rgba(0,0,0,0.6);
        color: white;
        border: none;
        width: 42px;
        height: 42px;
        border-radius: 50%;
        font-size: 20px;
        z-index: 10;
        cursor: pointer;
      ">✕</button>
    </div>

    <!-- CONTENIDO DESPUÉS DE CAPTURAR -->
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

  setTimeout(() => {
    const btnAbrir = document.getElementById('btn-abrir-ar');
    if (btnAbrir) {
      btnAbrir.addEventListener('click', iniciarCamaraAR);
    }
  }, 100);
});

// ============================================================
// INICIAR CÁMARA + MODELO (solo web)
// ============================================================
async function iniciarCamaraAR() {
  const pantalla = document.getElementById('pantalla-ar');
  const video = document.getElementById('video-camara');
  const btnCapturar = document.getElementById('btn-capturar');
  const btnCerrar = document.getElementById('btn-cerrar-ar');

  if (!pantalla || !video) return;

  try {
    // Pedir cámara trasera
    streamCamara = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    video.srcObject = streamCamara;
    await video.play();

    // Mostrar pantalla AR
    pantalla.style.display = 'block';

    // Botón capturar
    if (btnCapturar) {
      btnCapturar.onclick = capturarGuajojo;
    }

    // Botón cerrar
    if (btnCerrar) {
      btnCerrar.onclick = cerrarCamaraAR;
    }

  } catch (err) {
    console.error('Error al acceder a la cámara:', err);
    alert('No se pudo acceder a la cámara.\n\nRevisa que hayas dado permiso a la cámara en el navegador.');
  }
}

// ============================================================
// CAPTURAR
// ============================================================
function capturarGuajojo() {
  // Cerrar cámara
  cerrarCamaraAR();

  // Ocultar botón de entrar
  const btnAbrir = document.getElementById('btn-abrir-ar');
  if (btnAbrir) btnAbrir.style.display = 'none';

  // Mostrar contenido capturado
  const contenido = document.getElementById('contenido-capturado');
  if (contenido) contenido.style.display = 'block';

  // Reproducir audio
  const audio = document.getElementById('audio-guajojo');
  if (audio) {
    audio.play().catch(() => {
      console.log('El usuario debe tocar play');
    });
  }
}

// ============================================================
// CERRAR CÁMARA
// ============================================================
function cerrarCamaraAR() {
  // Detener stream de cámara
  if (streamCamara) {
    streamCamara.getTracks().forEach(track => track.stop());
    streamCamara = null;
  }

  const video = document.getElementById('video-camara');
  if (video) {
    video.srcObject = null;
  }

  const pantalla = document.getElementById('pantalla-ar');
  if (pantalla) {
    pantalla.style.display = 'none';
  }
}
