import './style.css';


// ============================================================
// ELEMENTOS PRINCIPALES
// ============================================================

const btnMenu =
  document.getElementById('btn-menu');

const sidebar =
  document.getElementById('sidebar');

const btnLeyenda1 =
  document.getElementById('btn-leyenda-1');

const btnLeyenda2 =
  document.getElementById('btn-leyenda-2');

const areaTexto =
  document.getElementById('contenido-dinamico');


// ============================================================
// ELEMENTOS AR
// ============================================================

const contenedorAR =
  document.getElementById('contenedor-ar');

const escenaAR =
  document.getElementById('escena-ar');

const camaraAR =
  document.getElementById('camara-ar');

const guajojoAR =
  document.getElementById('guajojo-ar');

const reticula =
  document.getElementById('reticula');

const interfazAR =
  document.getElementById('interfaz-ar');

const btnCerrarAR =
  document.getElementById('btn-cerrar-ar');

const btnColocarAR =
  document.getElementById('btn-colocar-ar');

const btnCapturar =
  document.getElementById('btn-capturar');

const miraCaptura =
  document.getElementById('mira-captura');

const mensajeCaptura =
  document.getElementById('mensaje-captura');

const btnVerLeyenda =
  document.getElementById('btn-ver-leyenda');

const estadoGuajojo =
  document.getElementById('estado-guajojo');

const audioGuajojo =
  document.getElementById('audio-guajojo');


// ============================================================
// VARIABLES DEL JUEGO
// ============================================================

let camaraStream = null;

let guajojoColocado = false;

let guajojoCapturado = false;

let xrSession = null;

let modoAR = false;


// ============================================================
// MENÚ
// ============================================================

btnMenu.addEventListener('click', () => {

  sidebar.classList.toggle('abierto');

});


// ============================================================
// FUNCIÓN PARA MOSTRAR CONTENIDO
// ============================================================

function mostrarLeyenda(
  titulo,
  descripcion,
  htmlExtra = ''
) {

  areaTexto.innerHTML = `

    <h2>
      ${titulo}
    </h2>

    <p>
      ${descripcion}
    </p>

    ${htmlExtra}

  `;

  sidebar.classList.remove('abierto');
}


// ============================================================
// CARRETÓN
// ============================================================

btnLeyenda1.addEventListener('click', () => {

  mostrarLeyenda(

    "El Carretón de la Otra Vida",

    "Se escucha el crujir de las ruedas de madera acercándose en la oscuridad...",

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

        <br>

        <p>

          Su presencia se relaciona con relatos
          antiguos transmitidos de generación en
          generación.

        </p>

      </div>

    `

  );

});


// ============================================================
// GUAJOJÓ
// ============================================================

btnLeyenda2.addEventListener('click', () => {

  const contenidoGuajojo = `

    <button
      id="btn-abrir-ar"
      class="btn-ver-ar"
    >
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>


    <div class="contenedor-3d">

      <a-scene

        embedded

        vr-mode-ui="
          enabled: false
        "

        renderer="
          antialias: false;
          precision: lowp;
          colorManagement: false;
          physicallyCorrectLights: false;
          maxCanvasWidth: 768;
        "

      >

        <a-assets>

          <a-asset-item
            id="modelo-guajojo"
            src="/guajojo.glb"
          ></a-asset-item>

        </a-assets>


        <a-sky
          color="#87CEEB"
          segments-width="16"
          segments-height="16"
        >
        </a-sky>


        <a-light
          type="ambient"
          color="#ffffff"
          intensity="1.5"
        >
        </a-light>


        <a-light
          type="directional"
          color="#ffffff"
          intensity="1"
          position="-2 4 2"
        >
        </a-light>


        <a-gltf-model

          src="#modelo-guajojo"

          position="0 -2 -10"

          scale="0.2 0.2 0.2"

        >
        </a-gltf-model>


        <a-camera
          position="0 1.6 0"
          far="30"
        >
        </a-camera>


      </a-scene>

    </div>


    <div class="multimedia-leyenda">

      <div class="reproductor-leyenda">

        <h3>
          Escucha su canto original
        </h3>

        <audio controls>

          <source
            src="/audio-guajojo.mp3"
            type="audio/mpeg"
          >

          Tu navegador no soporta el elemento de audio.

        </audio>

      </div>


      <img
        src="/foto-guajojo.jpg"
        alt="Fotografía del ave Guajojó"
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
        perdidamente de un joven guerrero de la
        misma tribu, pero de menor rango.

      </p>


      <br>


      <p>

        Al enterarse de este romance prohibido,
        el cacique, enfurecido, llevó al joven a
        lo más espeso de la selva para quitarle
        la vida y separar así a los amantes para
        siempre.

      </p>


      <br>


      <p>

        La muchacha, al notar la prolongada ausencia
        de su amado, corrió desesperada a buscarlo
        por la espesura del bosque.

        Tras mucho caminar, encontró su cuerpo
        sin vida.

      </p>


      <br>


      <p>

        Su llanto fue tan desgarrador y lleno de
        dolor que conmovió a los espíritus mismos
        de la selva.

      </p>


      <br>


      <p>

        El cacique intentó hechizarla, pero los
        espíritus se adelantaron y transformaron
        a la joven en un ave de plumaje pardo.

      </p>


      <br>


      <p>

        Desde entonces, el Guajojó se posa en los
        árboles de la selva y su canto lúgubre,
        que parece repetir:

        <strong>
          "¡Gua... jo... jó!"
        </strong>

        se escucha durante las noches.

      </p>

    </div>

  `;


  mostrarLeyenda(

    "El Guajojó",

    "Un canto melancólico resuena en la selva. Explora el entorno, conoce al ave y descubre su trágica historia.",

    contenidoGuajojo

  );


  // ----------------------------------------------------------
  // BOTÓN AR
  // ----------------------------------------------------------

  setTimeout(() => {

    const btnAbrirAR =
      document.getElementById('btn-abrir-ar');

    if (btnAbrirAR) {

      btnAbrirAR.addEventListener(
        'click',
        iniciarAR
      );

    }

  }, 0);

});


// ============================================================
// INICIAR AR
// ============================================================

async function iniciarAR() {

  console.log(
    'Iniciando experiencia AR...'
  );


  contenedorAR.classList.add('activo');


  estadoGuajojo.textContent =
    'Activando cámara...';


  guajojoAR.setAttribute(
    'visible',
    'false'
  );


  guajojoColocado = false;

  guajojoCapturado = false;


  btnColocarAR.style.display =
    'block';

  btnCapturar.classList.remove(
    'visible'
  );

  mensajeCaptura.classList.remove(
    'activo'
  );


  // ----------------------------------------------------------
  // INTENTAR CÁMARA
  // ----------------------------------------------------------

  try {

    camaraStream =
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
          },

          frameRate: {
            ideal: 30,
            max: 30
          }

        },

        audio: false

      });


    camaraAR.srcObject =
      camaraStream;


    await camaraAR.play();


    camaraAR.style.display =
      'block';


    estadoGuajojo.textContent =
      'Apunta la cámara hacia el suelo.';


  } catch (error) {

    console.error(
      'No se pudo activar la cámara:',
      error
    );


    estadoGuajojo.textContent =
      'No se pudo acceder a la cámara. Revisa los permisos.';

  }


  // ----------------------------------------------------------
  // COMPROBAR WEBXR
  // ----------------------------------------------------------

  comprobarWebXR();

}


// ============================================================
// COMPROBAR WEBXR
// ============================================================

async function comprobarWebXR() {

  if (
    !navigator.xr ||
    !navigator.xr.isSessionSupported
  ) {

    console.log(
      'WebXR no disponible.'
    );

    return;

  }


  try {

    const compatible =
      await navigator.xr.isSessionSupported(
        'immersive-ar'
      );


    if (compatible) {

      console.log(
        'Este dispositivo soporta immersive-ar.'
      );


      estadoGuajojo.textContent =
        'AR disponible. Busca una superficie.';

      modoAR = true;

    } else {

      console.log(
        'immersive-ar no disponible.'
      );

      modoAR = false;

    }

  } catch (error) {

    console.log(
      'No se pudo comprobar WebXR.',
      error
    );

  }

}


// ============================================================
// BOTÓN COLOCAR
// ============================================================

btnColocarAR.addEventListener(
  'click',
  colocarGuajojo
);


// ============================================================
// COLOCAR GUAJOJÓ
// ============================================================

function colocarGuajojo() {

  if (guajojoColocado) {

    return;

  }


  /*
   * En el modo de cámara de respaldo colocamos
   * el Guajojó delante del usuario.
   *
   * En una futura versión con WebXR hit-test,
   * esta posición será reemplazada por la posición
   * real de una superficie detectada.
   */


  guajojoAR.setAttribute(
    'position',
    '0 0 -3'
  );


  guajojoAR.setAttribute(
    'scale',
    '0.2 0.2 0.2'
  );


  guajojoAR.setAttribute(
    'visible',
    'true'
  );


  guajojoColocado =
    true;


  btnColocarAR.style.display =
    'none';


  btnCapturar.classList.add(
    'visible'
  );


  miraCaptura.classList.add(
    'objetivo'
  );


  estadoGuajojo.textContent =
    '¡Encontraste al Guajojó! Apunta hacia él y captúralo.';


  // ----------------------------------------------------------
  // ANIMACIÓN SIMPLE
  // ----------------------------------------------------------

  animarGuajojo();

}


// ============================================================
// ANIMACIÓN DEL GUAJOJÓ
// ============================================================

function animarGuajojo() {

  if (
    !guajojoColocado ||
    guajojoCapturado
  ) {

    return;

  }


  const tiempo =
    Date.now() / 1000;


  const x =
    Math.sin(tiempo * 1.2) * 0.6;


  const y =
    Math.sin(tiempo * 2) * 0.12;


  const z =
    -3 +
    Math.cos(tiempo * 0.8) * 0.25;


  guajojoAR.object3D.position.x =
    x;


  guajojoAR.object3D.position.y =
    y;


  guajojoAR.object3D.position.z =
    z;


  requestAnimationFrame(
    animarGuajojo
  );

}


// ============================================================
// CAPTURAR GUAJOJÓ
// ============================================================

btnCapturar.addEventListener(
  'click',
  capturarGuajojo
);


function capturarGuajojo() {

  if (
    !guajojoColocado ||
    guajojoCapturado
  ) {

    return;

  }


  guajojoCapturado =
    true;


  // ----------------------------------------------------------
  // OCULTAR MODELO
  // ----------------------------------------------------------

  guajojoAR.setAttribute(
    'visible',
    'false'
  );


  // ----------------------------------------------------------
  // OCULTAR CONTROLES
  // ----------------------------------------------------------

  btnCapturar.classList.remove(
    'visible'
  );


  miraCaptura.classList.remove(
    'objetivo'
  );


  // ----------------------------------------------------------
  // MOSTRAR MENSAJE
  // ----------------------------------------------------------

  mensajeCaptura.classList.add(
    'activo'
  );


  estadoGuajojo.textContent =
    '¡Guajojó capturado!';


  // ----------------------------------------------------------
  // REPRODUCIR CANTO
  // ----------------------------------------------------------

  audioGuajojo.currentTime =
    0;


  audioGuajojo.play()
    .catch(
      error => {

        console.log(
          'El navegador requiere interacción para reproducir audio.',
          error
        );

      }
    );

}


// ============================================================
// VER LEYENDA DESPUÉS DE CAPTURAR
// ============================================================

btnVerLeyenda.addEventListener(
  'click',
  mostrarLeyendaDespuesDeCaptura
);


function mostrarLeyendaDespuesDeCaptura() {

  cerrarAR();


  setTimeout(() => {

    const contenido =
      `

      <div class="leyenda-capturada">

        <h3>
          🐦 El Guajojó
        </h3>


        <p>

          Has descubierto al Guajojó,
          una de las figuras más conocidas
          de las leyendas de la región
          oriental de Bolivia.

        </p>


        <br>


        <p>

          Cuenta la leyenda que una joven
          enamorada perdió a su amado debido
          a la decisión de su padre.

        </p>


        <br>


        <p>

          Desconsolada por la pérdida,
          su dolor conmovió a los espíritus
          de la selva.

        </p>


        <br>


        <p>

          Los espíritus transformaron a la
          joven en un ave de plumaje pardo.

        </p>


        <br>


        <p>

          Desde entonces, su canto nocturno
          recuerda eternamente su amor perdido:

          <strong>
            "¡Gua... jo... jó!"
          </strong>

        </p>


        <div
          class="reproductor-leyenda"
          style="width:100%; margin-top:25px;"
        >

          <h3>
            Escucha su canto
          </h3>


          <audio
            controls
            style="width:100%;"
          >

            <source
              src="/audio-guajojo.mp3"
              type="audio/mpeg"
            >

          </audio>

        </div>

      </div>

      `;


    mostrarLeyenda(

      "🐦 Guajojó descubierto",

      "Has completado la primera leyenda.",

      contenido

    );


  }, 300);

}


// ============================================================
// CERRAR AR
// ============================================================

btnCerrarAR.addEventListener(
  'click',
  cerrarAR
);


function cerrarAR() {

  contenedorAR.classList.remove(
    'activo'
  );


  // ----------------------------------------------------------
  // DETENER CÁMARA
  // ----------------------------------------------------------

  if (camaraStream) {

    camaraStream
      .getTracks()
      .forEach(
        track => track.stop()
      );

    camaraStream =
      null;

  }


  camaraAR.srcObject =
    null;


  // ----------------------------------------------------------
  // REINICIAR JUEGO
  // ----------------------------------------------------------

  guajojoAR.setAttribute(
    'visible',
    'false'
  );


  guajojoColocado =
    false;


  guajojoCapturado =
    false;


  btnColocarAR.style.display =
    'block';


  btnCapturar.classList.remove(
    'visible'
  );


  mensajeCaptura.classList.remove(
    'activo'
  );


  estadoGuajojo.textContent =
    'Preparando la experiencia...';

}


// ============================================================
// PREVENIR ZOOM ACCIDENTAL EN EL MÓVIL
// ============================================================

document.addEventListener(
  'gesturestart',
  event => {

    event.preventDefault();

  }
);


// ============================================================
// MENSAJE INICIAL
// ============================================================

console.log(
  'Sistema de Leyendas de Santa Cruz iniciado.'
);
