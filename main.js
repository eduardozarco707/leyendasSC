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
// GUAJOJÓ
// ============================================================
btnLeyenda2.addEventListener('click', () => {
  // Crear el overlay de estado AR en el body (debe existir ANTES de iniciar AR)
  let estadoAR = document.getElementById('estado-ar');
  if (!estadoAR) {
    estadoAR = document.createElement('div');
    estadoAR.id = 'estado-ar';
    estadoAR.style.cssText = `
      display: none;
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      padding: 12px 20px;
      border-radius: 30px;
      background-color: rgba(0, 0, 0, 0.75);
      color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 15px;
      text-align: center;
      pointer-events: none;
    `;
    document.body.appendChild(estadoAR);
  }

  mostrarLeyenda(
    'El Guajojó',
    'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',
    `
    <!-- BOTÓN AR -->
    <button id="btn-abrir-ar" class="btn-ver-ar" type="button">
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>

    <!-- VISOR 3D -->
    <div class="contenedor-3d">
      <a-scene
        id="escena-guajojo"
        embedded
        vr-mode-ui="enabled: false"
        xr-mode-ui="enabled: false"
        webxr="
          optionalFeatures: dom-overlay;
          overlayElement: #estado-ar;
          referenceSpaceType: local;
        "
        renderer="alpha: true; antialias: true; colorManagement: true;"
        background="transparent: true"
      >
        <a-assets>
          <a-asset-item id="modelo-guajojo" src="/guajojo.glb"></a-asset-item>
        </a-assets>

        <!-- CIELO que se oculta en AR -->
        <a-sky color="#87CEEB" hide-on-enter-ar></a-sky>

        <!-- LUCES -->
        <a-light type="ambient" color="#ffffff" intensity="1.2"></a-light>
        <a-light type="directional" color="#ffffff" intensity="0.8" position="-1 3 2"></a-light>

        <!-- MODELO -->
        <a-gltf-model
          src="#modelo-guajojo"
          position="0 0 -1.5"
          rotation="0 0 0"
          scale="0.25 0.25 0.25"
        ></a-gltf-model>

        <!-- CÁMARA -->
        <a-camera position="0 1.6 0" near="0.01" far="50"></a-camera>
      </a-scene>
    </div>

    <!-- AUDIO + FOTO -->
    <div class="multimedia-leyenda">
      <div class="reproductor-leyenda">
        <h3>Escucha su canto original</h3>
        <audio controls>
          <source src="/audio-guajojo.mp3" type="audio/mpeg">
          Tu navegador no soporta audio.
        </audio>
      </div>
      <img src="/foto-guajojo.jpg" alt="Fotografía del Guajojó" class="foto-leyenda">
    </div>

    <!-- HISTORIA -->
    <div class="historia-leyenda">
      <h3>La Leyenda del Guajojó</h3>
      <p>Cuenta la leyenda que hace muchos años, en una antigua tribu de la selva oriental, la hermosa hija del cacique se enamoró perdidamente de un joven guerrero.</p><br>
      <p>Al enterarse de este romance prohibido, el cacique enfureció y llevó al joven guerrero a lo más profundo de la selva.</p><br>
      <p>La muchacha salió desesperada en busca de su amado y finalmente encontró su cuerpo sin vida.</p><br>
      <p>Su llanto fue tan profundo que los espíritus de la selva la transformaron en un ave.</p><br>
      <p>Desde entonces, durante las noches, puede escucharse su triste canto: <strong>¡Gua... jo... jó!</strong></p>
    </div>
    `
  );

  // Esperar a que el botón exista en el DOM
  setTimeout(() => {
    const botonAR = document.getElementById('btn-abrir-ar');
    if (!botonAR) {
      console.error('No se encontró el botón AR');
      return;
    }
    botonAR.addEventListener('click', iniciarAR);
  }, 150);
});

// ============================================================
// INICIAR IMMERSIVE AR
// ============================================================
function iniciarAR() {
  const escena = document.getElementById('escena-guajojo');
  if (!escena) {
    console.error('No se encontró la escena A-Frame.');
    return;
  }

  // Esperar a que la escena esté completamente cargada
  if (!escena.hasLoaded) {
    escena.addEventListener('loaded', () => {
      intentarEntrarAR(escena);
    });
  } else {
    intentarEntrarAR(escena);
  }
}

function intentarEntrarAR(escena) {
  try {
    // enterAR() debe ejecutarse dentro de un gesto del usuario (click)
    escena.enterAR();
    mostrarEstadoAR('🟢 ¡REALIDAD AUMENTADA INICIADA!');
  } catch (error) {
    console.error('ERROR INICIANDO AR:', error);
    alert('No se pudo iniciar la cámara AR.\n\n' + error.message);
  }
}

// ============================================================
// MOSTRAR ESTADO AR
// ============================================================
function mostrarEstadoAR(mensaje) {
  const estado = document.getElementById('estado-ar');
  if (estado) {
    estado.textContent = mensaje;
    estado.style.display = 'block';
    setTimeout(() => {
      ocultarEstadoAR();
    }, 4000);
  }
}

// ============================================================
// OCULTAR ESTADO AR
// ============================================================
function ocultarEstadoAR() {
  const estado = document.getElementById('estado-ar');
  if (estado) {
    estado.style.display = 'none';
  }
}
