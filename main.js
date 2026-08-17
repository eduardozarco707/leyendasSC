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
  mostrarLeyenda(
    'El Guajojó',
    'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',
    `
      <!-- ================================================
           BOTÓN AR GIGANTE
           ================================================ -->
      <button id="btn-abrir-ar" class="btn-ver-ar" type="button">
        📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
      </button>

      <!-- ================================================
           VISOR 3D NORMAL
           ================================================ -->
      <div class="contenedor-3d">
        <!-- IMPORTANTE: Añadí alpha: true al renderer para que el fondo pueda ser transparente y se vea la cámara -->
        <a-scene
          id="escena-guajojo"
          embedded
          vr-mode-ui="enabled: false"
          renderer="alpha: true; antialias: false; precision: lowp; colorManagement: false; physicallyCorrectLights: false;"
        >
          <a-assets>
            <a-asset-item id="modelo-guajojo" src="/guajojo.glb"></a-asset-item>
          </a-assets>

          <!-- IMPORTANTE: El cielo azul con hide-on-enter-ar para que desaparezca al usar la cámara -->
          <a-sky color="#87CEEB" hide-on-enter-ar></a-sky> 

          <!-- LUZ -->
          <a-light type="ambient" color="#ffffff" intensity="1.5"></a-light>
          <a-light type="directional" color="#ffffff" intensity="1" position="-2 4 2"></a-light>

          <!-- MODELO (A 2 metros frente a la cámara para que no quede muy lejos en el cuarto) -->
          <a-gltf-model
            src="#modelo-guajojo"
            position="0 0 -2"
            rotation="0 0 0"
            scale="0.2 0.2 0.2"
          ></a-gltf-model>

          <!-- CÁMARA -->
          <a-camera position="0 1.6 0" near="0.01" far="30"></a-camera>
        </a-scene>
      </div>

      <!-- ================================================
           AUDIO + FOTO
           ================================================ -->
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

      <!-- ================================================
           HISTORIA
           ================================================ -->
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

  // ======================================================
  // ESPERAR BOTÓN
  // ======================================================
  setTimeout(() => {
    const botonAR = document.getElementById('btn-abrir-ar');

    if (!botonAR) {
      console.error('No se encontró el botón AR');
      return;
    }

    botonAR.addEventListener('click', iniciarAR);

    // Escuchar cuando A-Frame entre en AR para mostrar tu mensaje de estado
    const escena = document.getElementById('escena-guajojo');
    escena.addEventListener('enter-vr', () => {
      // En A-Frame, 'enter-vr' también se dispara para AR. 
      // Comprobamos si es AR revisando el estado interno.
      if (escena.is('ar-mode')) {
        mostrarEstadoAR('🟢 ¡REALIDAD AUMENTADA INICIADA!');
      }
    });

  }, 100);
});

// ============================================================
// INICIAR IMMERSIVE AR (VERSIÓN OPTIMIZADA A-FRAME)
// ============================================================
async function iniciarAR() {
  console.log('====================================');
  console.log('INICIANDO IMMERSIVE-AR');
  console.log('====================================');

  if (!navigator.xr) {
    alert('WebXR no está disponible en este navegador.');
    return;
  }

  try {
    const compatible = await navigator.xr.isSessionSupported('immersive-ar');
    console.log('immersive-ar disponible:', compatible);

    if (!compatible) {
      alert('Tu dispositivo o navegador no soporta Realidad Aumentada.');
      return;
    }

    const escena = document.getElementById('escena-guajojo');
    
    if (escena) {
      // ¡ESTA ES LA MAGIA DE A-FRAME!
      // Ejecuta todas las conexiones WebXR, esconde el fondo y ajusta la cámara con 1 sola línea de código
      escena.enterAR();
    } else {
      console.error('No se encontró la escena A-Frame.');
    }

  } catch (error) {
    console.error('ERROR INICIANDO AR:', error);
    alert('No se pudo iniciar la cámara AR.\n\n' + error.message);
  }
}

// ============================================================
// MOSTRAR ESTADO AR
// ============================================================
function mostrarEstadoAR(mensaje) {
  let estado = document.getElementById('estado-ar');

  if (!estado) {
    estado = document.createElement('div');
    estado.id = 'estado-ar';
    document.body.appendChild(estado);
  }

  estado.textContent = mensaje;
  estado.style.display = 'block';

  setTimeout(() => {
    ocultarEstadoAR();
  }, 4000);
}

// ============================================================
// OCULTAR ESTADO
// ============================================================
function ocultarEstadoAR() {
  const estado = document.getElementById('estado-ar');
  if (estado) {
    estado.style.display = 'none';
  }
}
