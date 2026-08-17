import './style.css';

// ============================================================
// SISTEMA DE ENFOQUE (DETECTA SI ESTÁS MIRANDO AL AVE)
// ============================================================
AFRAME.registerComponent('detector-enfoque', {
  tick: function () {
    const btn = document.getElementById('btn-capturar');
    const pantalla = document.getElementById('pantalla-ar');
    if (!btn || !pantalla || pantalla.style.display === 'none') return;

    const camera = this.el.sceneEl.camera;
    if (!camera) return;

    const pos = new AFRAME.THREE.Vector3();
    this.el.object3D.getWorldPosition(pos);
    pos.project(camera);

    // Está en pantalla y cerca del centro
    const enfocado =
      pos.z < 1 &&
      pos.x >= -0.55 &&
      pos.x <= 0.55 &&
      pos.y >= -0.55 &&
      pos.y <= 0.55;

    if (enfocado) {
      if (btn.disabled) {
        btn.style.background = '#1b5e20';
        btn.style.opacity = '1';
        btn.innerText = '✨ CAPTURAR';
        btn.disabled = false;
      }
    } else {
      if (!btn.disabled) {
        btn.style.background = '#555555';
        btn.style.opacity = '0.6';
        btn.innerText = '👀 Busca al Guajojó...';
        btn.disabled = true;
      }
    }
  }
});

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
// MENÚ Y MOSTRAR LEYENDA
// ============================================================
btnMenu.addEventListener('click', () => {
  sidebar.classList.toggle('abierto');
});

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
// GUAJOJÓ
// ============================================================
btnLeyenda2.addEventListener('click', () => {
  mostrarLeyenda(
    'El Guajojó',
    'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',
    `
    <button id="btn-abrir-ar" class="btn-ver-ar" type="button">
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>

    <!-- PANTALLA AR -->
    <div id="pantalla-ar" style="
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #000;
      overflow: hidden;
    ">
      <!-- CÁMARA REAL -->
      <video id="video-camara" autoplay playsinline muted style="
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
      "></video>

      <!-- CAPA DEL MODELO 3D -->
      <div id="capa-modelo" style="
        position: absolute;
        inset: 0;
        z-index: 2;
        pointer-events: none;
      ">
        <a-scene
          id="escena-guajojo"
          embedded
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          renderer="alpha: true; antialias: true; colorManagement: true;"
          style="width:100%; height:100%; background:transparent !important;"
        >
          <a-assets timeout="15000">
            <a-asset-item id="modelo-guajojo-asset" src="/guajojo.glb"></a-asset-item>
          </a-assets>

          <!-- El modelo se posiciona por JS delante de la cámara al iniciar -->
          <a-entity
            id="modelo-guajojo"
            detector-enfoque
            gltf-model="#modelo-guajojo-asset"
            position="0 0 -2"
            scale="0.45 0.45 0.45"
            rotation="0 180 0"
            visible="false"
          ></a-entity>

          <a-light type="ambient" color="#ffffff" intensity="1.8"></a-light>
          <a-light type="directional" color="#ffffff" intensity="1.2" position="0 3 2"></a-light>
          <a-light type="directional" color="#ffffff" intensity="0.6" position="0 -1 -2"></a-light>

          <a-camera
            id="camara-ar"
            position="0 0 0"
            look-controls="
              enabled: true;
              magicWindowTrackingEnabled: true;
              touchEnabled: false;
              mouseEnabled: false;
            "
            wasd-controls="enabled: false"
            near="0.01"
            far="30"
          ></a-camera>
        </a-scene>
      </div>

      <!-- UI -->
      <div id="texto-pista" style="
        position: absolute;
        top: 18px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: #fff;
        padding: 10px 18px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 10;
        text-align: center;
        max-width: 90%;
      ">
        📷 Gira el celular para buscar al Guajojó
      </div>

      <button id="btn-capturar" disabled style="
        position: absolute;
        bottom: 36px;
        left: 50%;
        transform: translateX(-50%);
        background: #555555;
        color: white;
        border: none;
        padding: 16px 42px;
        border-radius: 50px;
        font-size: 17px;
        font-weight: bold;
        box-shadow: 0 4px 18px rgba(0,0,0,0.5);
        z-index: 10;
        opacity: 0.6;
        transition: all 0.3s ease;
      ">
        👀 Busca al Guajojó...
      </button>

      <button id="btn-cerrar-ar" style="
        position: absolute;
        top: 14px;
        right: 14px;
        background: rgba(0,0,0,0.65);
        color: white;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 18px;
        z-index: 10;
      ">✕</button>
    </div>

    <!-- DESPUÉS DE CAPTURAR -->
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
    const btn = document.getElementById('btn-abrir-ar');
    if (btn) btn.addEventListener('click', iniciarCamaraAR);
  }, 100);
});

// ============================================================
// INICIAR CÁMARA + MODELO
// ============================================================
async function iniciarCamaraAR() {
  const pantalla = document.getElementById('pantalla-ar');
  const video = document.getElementById('video-camara');
  const btnCapturar = document.getElementById('btn-capturar');
  const btnCerrar = document.getElementById('btn-cerrar-ar');
  const escena = document.getElementById('escena-guajojo');

  if (!pantalla || !video) return;

  try {
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
    pantalla.style.display = 'block';

    // Activar giroscopio
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));

      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        DeviceOrientationEvent.requestPermission().catch(console.error);
      }

      const camaraVirtual = document.getElementById('camara-ar');
      if (camaraVirtual && camaraVirtual.components['look-controls']) {
        camaraVirtual.components['look-controls'].pause();
        camaraVirtual.components['look-controls'].play();
      }
    }, 300);

    const hacerTransparente = () => {
      const canvas = escena?.querySelector('canvas');
      if (canvas) {
        canvas.style.background = 'transparent';
        canvas.style.backgroundColor = 'transparent';
      }
      if (escena) escena.style.background = 'transparent';
    };

    const alistarModelo = () => {
      hacerTransparente();
      // Esperar un momento a que el giroscopio oriente la cámara
      // y luego colocar el ave DELANTE de donde estás mirando
      setTimeout(() => {
        colocarModeloFrenteACamara();
      }, 600);
      setTimeout(() => {
        colocarModeloFrenteACamara();
      }, 1200);
    };

    if (escena) {
      if (escena.hasLoaded) {
        alistarModelo();
      } else {
        escena.addEventListener('loaded', alistarModelo, { once: true });
      }
      setTimeout(hacerTransparente, 500);
      setTimeout(hacerTransparente, 1500);
    }

    if (btnCapturar) {
      btnCapturar.disabled = true;
      btnCapturar.style.background = '#555555';
      btnCapturar.style.opacity = '0.6';
      btnCapturar.innerText = '👀 Busca al Guajojó...';
      btnCapturar.onclick = capturarGuajojo;
    }
    if (btnCerrar) btnCerrar.onclick = cerrarCamaraAR;
  } catch (err) {
    console.error(err);
    alert('No se pudo abrir la cámara.\n\n' + err.message);
  }
}

// ============================================================
// COLOCAR EL AVE FRENTE A LA CÁMARA (un poco a un lado)
// Así siempre está cerca de donde apuntas al abrir AR
// ============================================================
function colocarModeloFrenteACamara() {
  const modelo = document.getElementById('modelo-guajojo');
  const escena = document.getElementById('escena-guajojo');
  if (!modelo || !escena || !escena.camera) return;

  const THREE = AFRAME.THREE;
  const camera = escena.camera;

  const camPos = new THREE.Vector3();
  const camDir = new THREE.Vector3();
  camera.getWorldPosition(camPos);
  camera.getWorldDirection(camDir);

  // Ángulo lateral aleatorio (±35°) para que no quede justo en el centro
  // y tengas que girar un poco para centrarlo
  const angulo = ((Math.random() * 70) - 35) * (Math.PI / 180);
  const distancia = 2.0;

  // Vector "derecha" respecto a donde mira la cámara
  const arriba = new THREE.Vector3(0, 1, 0);
  const derecha = new THREE.Vector3().crossVectors(camDir, arriba).normalize();
  if (derecha.lengthSq() < 0.01) {
    // Si la cámara mira casi arriba/abajo, usar otro eje
    derecha.set(1, 0, 0);
  }

  // Posición = delante + un poco a la izquierda o derecha + un poco arriba
  const pos = new THREE.Vector3()
    .copy(camPos)
    .add(camDir.clone().multiplyScalar(distancia))
    .add(derecha.multiplyScalar(Math.sin(angulo) * 1.1))
    .add(arriba.multiplyScalar(0.25));

  modelo.object3D.position.copy(pos);
  modelo.object3D.lookAt(camPos); // que mire hacia la cámara
  modelo.setAttribute('scale', '0.45 0.45 0.45');
  modelo.setAttribute('visible', true);

  // Pista según el lado
  const pista = document.getElementById('texto-pista');
  if (pista) {
    if (angulo > 0.15) {
      pista.textContent = '📷 Gira un poco a la derecha para encontrar al Guajojó';
    } else if (angulo < -0.15) {
      pista.textContent = '📷 Gira un poco a la izquierda para encontrar al Guajojó';
    } else {
      pista.textContent = '📷 Gira el celular para centrar al Guajojó';
    }
  }

  console.log('Guajojó colocado en', pos.x.toFixed(2), pos.y.toFixed(2), pos.z.toFixed(2));
}

// ============================================================
// CAPTURAR
// ============================================================
function capturarGuajojo() {
  const btn = document.getElementById('btn-capturar');
  if (btn && btn.disabled) return;

  cerrarCamaraAR();

  const btnAbrir = document.getElementById('btn-abrir-ar');
  if (btnAbrir) btnAbrir.style.display = 'none';

  const contenido = document.getElementById('contenido-capturado');
  if (contenido) contenido.style.display = 'block';

  const audio = document.getElementById('audio-guajojo');
  if (audio) {
    audio.play().catch(() => {});
  }
}

// ============================================================
// CERRAR
// ============================================================
function cerrarCamaraAR() {
  if (streamCamara) {
    streamCamara.getTracks().forEach((t) => t.stop());
    streamCamara = null;
  }
  const video = document.getElementById('video-camara');
  if (video) video.srcObject = null;

  const pantalla = document.getElementById('pantalla-ar');
  if (pantalla) pantalla.style.display = 'none';
}
