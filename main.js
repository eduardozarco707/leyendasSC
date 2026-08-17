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
let orientacionActiva = false;
let modeloColocado = false;
let baseAlpha = null; // para calibrar al abrir AR

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

    <div id="pantalla-ar" style="
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #000;
      overflow: hidden;
    ">
      <video id="video-camara" autoplay playsinline muted style="
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        z-index: 1;
      "></video>

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

          <!-- Modelo FIJO en el mundo. La cámara gira con el celular. -->
          <a-entity
            id="modelo-guajojo"
            detector-enfoque
            gltf-model="#modelo-guajojo-asset"
            position="0 0 -2"
            scale="0.5 0.5 0.5"
            rotation="0 180 0"
            visible="false"
          ></a-entity>

          <a-light type="ambient" color="#ffffff" intensity="1.8"></a-light>
          <a-light type="directional" color="#ffffff" intensity="1.2" position="0 3 2"></a-light>
          <a-light type="directional" color="#ffffff" intensity="0.6" position="0 -1 -2"></a-light>

          <!-- Cámara SIN look-controls: el giroscopio lo controlamos nosotros -->
          <a-camera
            id="camara-ar"
            position="0 0 0"
            look-controls="enabled: false"
            wasd-controls="enabled: false"
            near="0.01"
            far="30"
          ></a-camera>
        </a-scene>
      </div>

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
// GIROSCOPIO MANUAL → rota la cámara, el modelo se queda fijo
// ============================================================
function onOrientacion(e) {
  if (!orientacionActiva) return;

  const camaraEl = document.getElementById('camara-ar');
  if (!camaraEl || !camaraEl.object3D) return;

  const alpha = e.alpha; // brújula 0–360
  const beta = e.beta;   // frente/atrás -180–180
  const gamma = e.gamma; // izquierda/derecha -90–90

  if (alpha === null || beta === null || gamma === null) return;

  // Guardar orientación inicial para calibrar
  if (baseAlpha === null) {
    baseAlpha = alpha;
  }

  const THREE = AFRAME.THREE;
  const deg = THREE.MathUtils.degToRad;

  // Rotación relativa al momento en que abriste AR
  const yaw = deg(alpha - baseAlpha);   // girar izquierda/derecha
  const pitch = deg(beta - 90);         // inclinar (celular vertical ≈ 90)
  const roll = deg(-gamma);

  // Orden YXZ típico en móviles
  camaraEl.object3D.rotation.order = 'YXZ';
  camaraEl.object3D.rotation.set(pitch, yaw, roll);

  // Colocar el modelo UNA sola vez, delante de la cámara inicial
  if (!modeloColocado) {
    colocarModeloFijo();
    modeloColocado = true;
  }
}

function activarGiroscopio() {
  orientacionActiva = true;
  baseAlpha = null;
  modeloColocado = false;

  // iOS necesita permiso
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    DeviceOrientationEvent.requestPermission()
      .then((state) => {
        if (state === 'granted') {
          window.addEventListener('deviceorientation', onOrientacion, true);
        } else {
          alert('Necesitamos permiso del giroscopio para buscar al Guajojó.');
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener('deviceorientation', onOrientacion, true);
  }
}

function desactivarGiroscopio() {
  orientacionActiva = false;
  baseAlpha = null;
  modeloColocado = false;
  window.removeEventListener('deviceorientation', onOrientacion, true);
}

// ============================================================
// COLOCAR MODELO FIJO EN EL MUNDO (solo una vez)
// ============================================================
function colocarModeloFijo() {
  const modelo = document.getElementById('modelo-guajojo');
  const camaraEl = document.getElementById('camara-ar');
  if (!modelo || !camaraEl) return;

  const THREE = AFRAME.THREE;

  // Dirección en la que mira la cámara AHORA
  const dir = new THREE.Vector3(0, 0, -1);
  dir.applyQuaternion(camaraEl.object3D.quaternion);

  const derecha = new THREE.Vector3(1, 0, 0);
  derecha.applyQuaternion(camaraEl.object3D.quaternion);

  const arriba = new THREE.Vector3(0, 1, 0);

  // Un poco a un lado (±25°) para que tengas que buscarlo
  const lado = (Math.random() > 0.5 ? 1 : -1) * (0.6 + Math.random() * 0.5);
  const distancia = 2.0;

  const pos = new THREE.Vector3()
    .copy(camaraEl.object3D.position)
    .add(dir.multiplyScalar(distancia))
    .add(derecha.multiplyScalar(lado))
    .add(arriba.multiplyScalar(0.2));

  modelo.object3D.position.copy(pos);
  modelo.object3D.lookAt(camaraEl.object3D.position);
  modelo.setAttribute('scale', '0.5 0.5 0.5');
  modelo.setAttribute('visible', true);

  const pista = document.getElementById('texto-pista');
  if (pista) {
    pista.textContent =
      lado > 0
        ? '📷 Gira a la derecha para encontrar al Guajojó'
        : '📷 Gira a la izquierda para encontrar al Guajojó';
  }

  console.log('Guajojó FIJO en el mundo:', pos.x.toFixed(2), pos.y.toFixed(2), pos.z.toFixed(2));
}

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

    // Activar giroscopio manual
    activarGiroscopio();

    // Por si el sensor tarda: colocar modelo de respaldo a los 2s
    setTimeout(() => {
      if (!modeloColocado) {
        const modelo = document.getElementById('modelo-guajojo');
        if (modelo) {
          // Posición fija en el mundo de la escena (no sigue a la cámara)
          modelo.setAttribute('position', '1.2 0.3 -2');
          modelo.setAttribute('visible', true);
          modeloColocado = true;
          const pista = document.getElementById('texto-pista');
          if (pista) pista.textContent = '📷 Gira el celular para buscar al Guajojó';
        }
      }
    }, 2000);

    const hacerTransparente = () => {
      const canvas = escena?.querySelector('canvas');
      if (canvas) {
        canvas.style.background = 'transparent';
        canvas.style.backgroundColor = 'transparent';
      }
      if (escena) escena.style.background = 'transparent';
    };

    if (escena) {
      if (escena.hasLoaded) {
        hacerTransparente();
      } else {
        escena.addEventListener('loaded', hacerTransparente, { once: true });
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
  desactivarGiroscopio();

  if (streamCamara) {
    streamCamara.getTracks().forEach((t) => t.stop());
    streamCamara = null;
  }
  const video = document.getElementById('video-camara');
  if (video) video.srcObject = null;

  const pantalla = document.getElementById('pantalla-ar');
  if (pantalla) pantalla.style.display = 'none';
}
