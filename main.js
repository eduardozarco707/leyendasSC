import './style.css';


// ============================================================
// ELEMENTOS PRINCIPALES
// ============================================================

const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');

const btnLeyenda1 = document.getElementById('btn-leyenda-1');
const btnLeyenda2 = document.getElementById('btn-leyenda-2');

const areaTexto = document.getElementById('contenido-dinamico');


// ============================================================
// VARIABLES
// ============================================================

let streamCamara = null;

let escenaAR = null;

let modeloGuajojo = null;


// ============================================================
// MENÚ
// ============================================================

btnMenu.addEventListener('click', () => {

  sidebar.classList.toggle('abierto');

});


// ============================================================
// MOSTRAR LEYENDA
// ============================================================

function mostrarLeyenda(
  titulo,
  descripcion,
  contenido = ''
) {

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

      <h3>
        La Leyenda del Carretón
      </h3>

      <p>
        Cuenta la tradición que durante las noches
        silenciosas puede escucharse el sonido de un
        carretón que avanza por las calles.
      </p>

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

    <!-- ======================================================
         BOTÓN AR
         ====================================================== -->

    <button
      id="btn-abrir-ar"
      class="btn-ver-ar"
      type="button"
    >
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>


    <!-- ======================================================
         PANTALLA AR
         ====================================================== -->

    <div
      id="pantalla-ar"
      style="
        display: none;
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: #000;
        overflow: hidden;
        z-index: 99999;
      "
    >


      <!-- ==================================================
           CÁMARA DEL TELÉFONO
           ================================================== -->

      <video
        id="video-camara"
        autoplay
        playsinline
        muted
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 1;
          background: #000;
        "
      ></video>


      <!-- ==================================================
           CAPA 3D
           ================================================== -->

      <div
        id="capa-modelo"
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          pointer-events: none;
          background: transparent;
        "
      >

        <a-scene
          id="escena-guajojo"
          embedded
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"

          renderer="
            alpha: true;
            antialias: false;
            precision: lowp;
            colorManagement: false;
            physicallyCorrectLights: false;
            logarithmicDepthBuffer: false;
          "

          style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            height: 100% !important;
            background: transparent !important;
            z-index: 2;
          "
        >


          <!-- ==============================================
               ASSETS
               ============================================== -->

          <a-assets
            id="assets-guajojo"
            timeout="30000"
          >

            <a-asset-item
              id="modelo-guajojo-asset"
              src="/guajojo.glb"
            ></a-asset-item>

          </a-assets>


          <!-- ==============================================
               LUCES
               ============================================== -->

          <a-light
            type="ambient"
            color="#ffffff"
            intensity="1.5"
          ></a-light>


          <a-light
            type="directional"
            color="#ffffff"
            intensity="1.2"
            position="0 3 2"
          ></a-light>


          <!-- ==============================================
               GUAJOJÓ
               ============================================== -->

          <a-entity
            id="modelo-guajojo"
            gltf-model="#modelo-guajojo-asset"

            position="0 0 -1.5"

            rotation="0 180 0"

            scale="0.35 0.35 0.35"

            visible="true"
          ></a-entity>


          <!-- ==============================================
               CÁMARA 3D
               ============================================== -->

          <a-camera
            id="camara-guajojo"

            position="0 0 0"

            rotation="0 0 0"

            look-controls="enabled: false"

            wasd-controls="enabled: false"

            near="0.01"

            far="20"
          ></a-camera>


        </a-scene>

      </div>


      <!-- ==================================================
           MENSAJE SUPERIOR
           ================================================== -->

      <div
        id="mensaje-ar"
        style="
          position: absolute;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          background: rgba(0,0,0,0.75);
          color: white;
          padding: 10px 18px;
          border-radius: 25px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          text-align: center;
          white-space: nowrap;
        "
      >
        🐦 Cargando Guajojó...
      </div>


      <!-- ==================================================
           BOTÓN CAPTURAR
           ================================================== -->

      <button
        id="btn-capturar"
        type="button"
        style="
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;

          background: #1b5e20;
          color: white;

          border: none;

          padding: 16px 42px;

          border-radius: 50px;

          font-size: 17px;

          font-weight: bold;

          box-shadow:
            0 4px 18px rgba(0,0,0,0.5);
        "
      >
        ✨ CAPTURAR
      </button>


      <!-- ==================================================
           CERRAR AR
           ================================================== -->

      <button
        id="btn-cerrar-ar"
        type="button"
        style="
          position: absolute;
          top: 14px;
          right: 14px;

          width: 42px;
          height: 42px;

          border: none;

          border-radius: 50%;

          background: rgba(0,0,0,0.7);

          color: white;

          font-size: 20px;

          z-index: 20;
        "
      >
        ✕
      </button>


    </div>


    <!-- ====================================================
         CONTENIDO DESPUÉS DE CAPTURAR
         ==================================================== -->

    <div
      id="contenido-capturado"
      style="
        display: none;
        margin-top: 20px;
      "
    >

      <div
        style="
          background: #e8f5e9;
          border: 2px solid #2e7d32;
          border-radius: 16px;
          padding: 16px;
          text-align: center;
          margin-bottom: 20px;
        "
      >

        <h3
          style="
            color: #1b5e20;
            margin: 0 0 8px 0;
          "
        >
          ✨ ¡CAPTURADO!
        </h3>

        <p
          style="
            margin: 0;
            color: #333;
          "
        >
          Has descubierto al Guajojó.
        </p>

      </div>


      <div class="multimedia-leyenda">


        <div class="reproductor-leyenda">

          <h3>
            Escucha su canto original
          </h3>

          <audio
            id="audio-guajojo"
            controls
          >

            <source
              src="/audio-guajojo.mp3"
              type="audio/mpeg"
            >

            Tu navegador no soporta audio.

          </audio>

        </div>


        <img
          src="/foto-guajojo.jpg"
          alt="Fotografía del Guajojó"
          class="foto-leyenda"
        >

      </div>


      <div class="historia-leyenda">

        <h3>
          La Leyenda del Guajojó
        </h3>


        <p>
          Cuenta la leyenda que hace muchos años,
          en una antigua tribu de la selva oriental,
          la hermosa hija del cacique se enamoró
          perdidamente de un joven guerrero.
        </p>


        <br>


        <p>
          Al enterarse de este romance prohibido,
          el cacique enfureció y llevó al joven
          guerrero a lo más profundo de la selva.
        </p>


        <br>


        <p>
          La muchacha salió desesperada en busca
          de su amado y finalmente encontró su
          cuerpo sin vida.
        </p>


        <br>


        <p>
          Su llanto fue tan profundo que los
          espíritus de la selva la transformaron
          en un ave.
        </p>


        <br>


        <p>
          Desde entonces, durante las noches,
          puede escucharse su triste canto:

          <strong>
            ¡Gua... jo... jó!
          </strong>
        </p>


      </div>

    </div>

    `

  );


  // ========================================================
  // ACTIVAR BOTÓN AR
  // ========================================================

  setTimeout(() => {

    const boton =
      document.getElementById(
        'btn-abrir-ar'
      );


    if (boton) {

      boton.addEventListener(
        'click',
        iniciarCamaraAR
      );

    }

  }, 100);

});


// ============================================================
// INICIAR CÁMARA AR
// ============================================================

async function iniciarCamaraAR() {

  console.log(
    '================================'
  );

  console.log(
    'INICIANDO CÁMARA AR'
  );

  console.log(
    '================================'
  );


  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );

  const video =
    document.getElementById(
      'video-camara'
    );

  const botonCapturar =
    document.getElementById(
      'btn-capturar'
    );

  const botonCerrar =
    document.getElementById(
      'btn-cerrar-ar'
    );


  if (!pantalla || !video) {

    console.error(
      'No se encontró la pantalla AR.'
    );

    return;

  }


  try {


    // ========================================================
    // PEDIR CÁMARA
    // ========================================================

    streamCamara =
      await navigator.mediaDevices.getUserMedia({

        video: {

          facingMode: {
            ideal: 'environment'
          },

          width: {
            ideal: 1280
          },

          height: {
            ideal: 720
          }

        },

        audio: false

      });


    console.log(
      'Cámara obtenida.'
    );


    // ========================================================
    // ASIGNAR VIDEO
    // ========================================================

    video.srcObject =
      streamCamara;


    await video.play();


    console.log(
      'Video iniciado.'
    );


    // ========================================================
    // MOSTRAR PANTALLA
    // ========================================================

    pantalla.style.display =
      'block';


    document.body.style.overflow =
      'hidden';


    // ========================================================
    // ESPERAR A QUE EL NAVEGADOR PINTE
    // ========================================================

    await esperar(100);


    // ========================================================
    // PREPARAR A-FRAME
    // ========================================================

    await prepararEscena3D();


    // ========================================================
    // BOTONES
    // ========================================================

    if (botonCapturar) {

      botonCapturar.onclick =
        capturarGuajojo;

    }


    if (botonCerrar) {

      botonCerrar.onclick =
        cerrarCamaraAR;

    }


  } catch (error) {

    console.error(
      'ERROR DE CÁMARA:',
      error
    );


    alert(
      'No se pudo abrir la cámara.\n\n' +
      error.message
    );

  }

}


// ============================================================
// PREPARAR ESCENA 3D
// ============================================================

async function prepararEscena3D() {

  escenaAR =
    document.getElementById(
      'escena-guajojo'
    );


  modeloGuajojo =
    document.getElementById(
      'modelo-guajojo'
    );


  if (!escenaAR) {

    console.error(
      'No se encontró escena-guajojo.'
    );

    return;

  }


  if (!modeloGuajojo) {

    console.error(
      'No se encontró modelo-guajojo.'
    );

    return;

  }


  console.log(
    'Esperando A-Frame...'
  );


  // ========================================================
  // ESPERAR A-FRAME
  // ========================================================

  if (!escenaAR.hasLoaded) {

    await new Promise(resolve => {

      escenaAR.addEventListener(
        'loaded',
        resolve,
        {
          once: true
        }
      );

    });

  }


  console.log(
    'A-Frame cargado.'
  );


  // ========================================================
  // FORZAR TAMAÑO
  // ========================================================

  ajustarCanvas();


  // ========================================================
  // EVENTO MODELO CARGADO
  // ========================================================

  modeloGuajojo.addEventListener(
    'model-loaded',
    () => {

      console.log(
        '================================'
      );

      console.log(
        'GUAJOJÓ CARGADO CORRECTAMENTE'
      );

      console.log(
        '================================'
      );


      ajustarModelo();


      mostrarMensaje(
        '🐦 ¡El Guajojó apareció!'
      );

    },
    {
      once: true
    }
  );


  // ========================================================
  // ERROR DEL MODELO
  // ========================================================

  modeloGuajojo.addEventListener(
    'model-error',
    evento => {

      console.error(
        'ERROR CARGANDO GUJOJÓ:',
        evento
      );


      mostrarMensaje(
        '❌ No se pudo cargar guajojo.glb'
      );

    }
  );


  // ========================================================
  // FORZAR MODELO
  // ========================================================

  ajustarModelo();


  // ========================================================
  // FORZAR RENDER
  // ========================================================

  if (escenaAR.renderer) {

    escenaAR.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        1
      )
    );


    escenaAR.renderer.setSize(
      window.innerWidth,
      window.innerHeight,
      false
    );

  }


  // ========================================================
  // REPETIR AJUSTE
  // ========================================================

  setTimeout(
    ajustarCanvas,
    200
  );


  setTimeout(
    ajustarModelo,
    300
  );


  setTimeout(
    ajustarCanvas,
    800
  );


  setTimeout(
    ajustarModelo,
    1000
  );


  setTimeout(
    ajustarCanvas,
    2000
  );

}


// ============================================================
// AJUSTAR CANVAS
// ============================================================

function ajustarCanvas() {

  if (!escenaAR) {
    return;
  }


  escenaAR.style.width =
    '100vw';

  escenaAR.style.height =
    '100vh';

  escenaAR.style.position =
    'absolute';

  escenaAR.style.top =
    '0';

  escenaAR.style.left =
    '0';

  escenaAR.style.background =
    'transparent';


  const canvas =
    escenaAR.querySelector(
      'canvas'
    );


  if (!canvas) {

    console.log(
      'Canvas todavía no disponible.'
    );

    return;

  }


  // ========================================================
  // CANVAS
  // ========================================================

  canvas.style.position =
    'absolute';

  canvas.style.top =
    '0';

  canvas.style.left =
    '0';

  canvas.style.width =
    '100%';

  canvas.style.height =
    '100%';

  canvas.style.background =
    'transparent';

  canvas.style.backgroundColor =
    'transparent';


  canvas.style.zIndex =
    '2';


  // ========================================================
  // RENDERER
  // ========================================================

  if (escenaAR.renderer) {

    escenaAR.renderer.setPixelRatio(
      Math.min(
        window.devicePixelRatio,
        1
      )
    );


    escenaAR.renderer.setSize(
      window.innerWidth,
      window.innerHeight,
      false
    );

  }


  console.log(
    'Canvas AR ajustado.'
  );

}


// ============================================================
// AJUSTAR MODELO
// ============================================================

function ajustarModelo() {

  if (!modeloGuajojo) {

    return;

  }


  // ========================================================
  // POSICIÓN
  // ========================================================

  modeloGuajojo.setAttribute(
    'position',
    '0 0 -1.5'
  );


  // ========================================================
  // ESCALA
  // ========================================================

  modeloGuajojo.setAttribute(
    'scale',
    '0.35 0.35 0.35'
  );


  // ========================================================
  // ROTACIÓN
  // ========================================================

  modeloGuajojo.setAttribute(
    'rotation',
    '0 180 0'
  );


  // ========================================================
  // VISIBLE
  // ========================================================

  modeloGuajojo.setAttribute(
    'visible',
    'true'
  );


  modeloGuajojo.object3D.visible =
    true;


  console.log(
    'Modelo preparado.'
  );

}


// ============================================================
// MENSAJE
// ============================================================

function mostrarMensaje(
  texto
) {

  const mensaje =
    document.getElementById(
      'mensaje-ar'
    );


  if (!mensaje) {

    return;

  }


  mensaje.textContent =
    texto;

}


// ============================================================
// CAPTURAR GUAJOJÓ
// ============================================================

function capturarGuajojo() {

  console.log(
    'GUAJOJÓ CAPTURADO'
  );


  cerrarCamaraAR();


  const botonAbrir =
    document.getElementById(
      'btn-abrir-ar'
    );


  if (botonAbrir) {

    botonAbrir.style.display =
      'none';

  }


  const contenido =
    document.getElementById(
      'contenido-capturado'
    );


  if (contenido) {

    contenido.style.display =
      'block';

  }


  const audio =
    document.getElementById(
      'audio-guajojo'
    );


  if (audio) {

    audio.play().catch(
      () => {}
    );

  }

}


// ============================================================
// CERRAR CÁMARA
// ============================================================

function cerrarCamaraAR() {

  console.log(
    'Cerrando AR...'
  );


  // ========================================================
  // DETENER CÁMARA
  // ========================================================

  if (streamCamara) {

    streamCamara
      .getTracks()
      .forEach(track => {

        track.stop();

      });


    streamCamara =
      null;

  }


  // ========================================================
  // VIDEO
  // ========================================================

  const video =
    document.getElementById(
      'video-camara'
    );


  if (video) {

    video.pause();

    video.srcObject =
      null;

  }


  // ========================================================
  // PANTALLA
  // ========================================================

  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  if (pantalla) {

    pantalla.style.display =
      'none';

  }


  document.body.style.overflow =
    'hidden';

}


// ============================================================
// ESPERAR
// ============================================================

function esperar(
  milisegundos
) {

  return new Promise(
    resolve => {

      setTimeout(
        resolve,
        milisegundos
      );

    }
  );

}


// ============================================================
// CAMBIO DE ORIENTACIÓN
// ============================================================

window.addEventListener(
  'resize',
  () => {

    if (
      pantallaARVisible()
    ) {

      ajustarCanvas();

    }

  }
);


// ============================================================
// COMPROBAR SI AR ESTÁ VISIBLE
// ============================================================

function pantallaARVisible() {

  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  return (
    pantalla &&
    pantalla.style.display === 'block'
  );

}
