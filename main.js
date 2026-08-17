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
// MENÚ
// ============================================================

btnMenu.addEventListener('click', () => {

  sidebar.classList.toggle('abierto');

});


// ============================================================
// MOSTRAR CONTENIDO
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

    <button
      id="btn-abrir-ar"
      class="btn-ver-ar"
      type="button"
    >
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>


    <div class="contenedor-3d">

      <a-scene

        embedded

        vr-mode-ui="enabled: false"

        renderer="
          antialias: false;
          precision: lowp;
          colorManagement: false;
          physicallyCorrectLights: false;
        "

      >

        <a-assets>

          <a-asset-item
            id="modelo-guajojo"
            src="/guajojo.glb"
          ></a-asset-item>

        </a-assets>


        <a-light
          type="ambient"
          intensity="1.5"
        ></a-light>


        <a-light
          type="directional"
          intensity="1"
          position="-2 4 2"
        ></a-light>


        <a-gltf-model

          src="#modelo-guajojo"

          position="0 -2 -10"

          scale="0.2 0.2 0.2"

        ></a-gltf-model>


        <a-camera

          position="0 1.6 0"

          near="0.01"

          far="30"

        ></a-camera>

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
        una joven se enamoró de un guerrero.

      </p>


      <br>


      <p>

        El padre de la joven se opuso a la relación
        y terminó con la vida del guerrero.

      </p>


      <br>


      <p>

        La joven encontró el cuerpo de su amado
        y su dolor fue tan grande que los espíritus
        de la selva la transformaron en un ave.

      </p>


      <br>


      <p>

        Desde entonces su canto puede escucharse
        durante las noches:

        <strong>
          ¡Gua... jo... jó!
        </strong>

      </p>

    </div>

    `

  );


  // ========================================================
  // BOTÓN AR
  // ========================================================

  setTimeout(() => {

    const botonAR =
      document.getElementById('btn-abrir-ar');

    if (!botonAR) {
      return;
    }

    botonAR.addEventListener(
      'click',
      iniciarAR
    );

  }, 100);

});


// ============================================================
// INICIAR IMMERSIVE AR
// ============================================================

async function iniciarAR() {

  console.log(
    '===================================='
  );

  console.log(
    'INICIANDO IMMERSIVE AR'
  );

  console.log(
    '===================================='
  );


  // ----------------------------------------------------------
  // COMPROBAR WEBXR
  // ----------------------------------------------------------

  if (!navigator.xr) {

    alert(
      'WebXR no está disponible.'
    );

    return;

  }


  // ----------------------------------------------------------
  // COMPROBAR IMMERSIVE-AR
  // ----------------------------------------------------------

  const compatible =
    await navigator.xr.isSessionSupported(
      'immersive-ar'
    );


  console.log(
    'immersive-ar:',
    compatible
  );


  if (!compatible) {

    alert(
      'immersive-ar no está disponible en este dispositivo.'
    );

    return;

  }


  // ----------------------------------------------------------
  // CREAR INTERFAZ AR
  // ----------------------------------------------------------

  crearInterfazAR();


  try {

    // ========================================================
    // SOLICITAR SESIÓN AR REAL
    // ========================================================

    const session =
      await navigator.xr.requestSession(

        'immersive-ar',

        {

          requiredFeatures: [

            'hit-test'

          ],

          optionalFeatures: [

            'local-floor',

            'dom-overlay'

          ],

          domOverlay: {

            root: document.getElementById(
              'interfaz-ar'
            )

          }

        }

      );


    console.log(
      'SESION IMMERSIVE-AR CREADA'
    );


    // --------------------------------------------------------
    // OBTENER ESCENA A-FRAME
    // --------------------------------------------------------

    const escena =
      document.getElementById(
        'escena-ar'
      );


    // --------------------------------------------------------
    // ESPERAR A QUE A-FRAME ESTÉ LISTO
    // --------------------------------------------------------

    if (!escena.hasLoaded) {

      await new Promise(
        resolve => {

          escena.addEventListener(
            'loaded',
            resolve,
            {
              once: true
            }
          );

        }
      );

    }


    // --------------------------------------------------------
    // OBTENER RENDERER THREE.JS
    // --------------------------------------------------------

    const renderer =
      escena.renderer;


    console.log(
      'Renderer:',
      renderer
    );


    // --------------------------------------------------------
    // CONECTAR SESIÓN WEBXR A A-FRAME
    // --------------------------------------------------------

    await renderer.xr.setSession(
      session
    );


    console.log(
      'WEBXR CONECTADO A A-FRAME'
    );


    // --------------------------------------------------------
    // GUARDAR SESIÓN
    // --------------------------------------------------------

    window.sessionAR =
      session;


    // --------------------------------------------------------
    // PREPARAR HIT TEST
    // --------------------------------------------------------

    await prepararHitTest(
      session
    );


    // --------------------------------------------------------
    // CUANDO TERMINA AR
    // --------------------------------------------------------

    session.addEventListener(
      'end',
      () => {

        console.log(
          'Sesión AR finalizada'
        );

        cerrarInterfazAR();

      }
    );


  } catch (error) {

    console.error(
      'ERROR INICIANDO IMMERSIVE-AR:',
      error
    );


    alert(
      'No se pudo iniciar la cámara AR.\n\n' +
      error.message
    );

    cerrarInterfazAR();

  }

}


// ============================================================
// CREAR INTERFAZ AR
// ============================================================

function crearInterfazAR() {

  let interfaz =
    document.getElementById(
      'interfaz-ar'
    );


  if (!interfaz) {

    interfaz =
      document.createElement(
        'div'
      );

    interfaz.id =
      'interfaz-ar';

    interfaz.innerHTML = `

      <div
        id="estado-ar"
        class="estado-ar"
      >
        🔎 Buscando superficie...
      </div>


      <button
        id="btn-salir-ar"
        class="btn-salir-ar"
      >
        ✕
      </button>


      <div
        id="mensaje-superficie"
        class="mensaje-superficie"
      >
        Mueve lentamente el teléfono
        para detectar el suelo.
      </div>


      <button
        id="btn-colocar-ar"
        class="btn-colocar-ar"
      >
        🐦 COLOCAR GUAJOJÓ
      </button>

    `;


    document.body.appendChild(
      interfaz
    );


    // --------------------------------------------------------
    // BOTÓN SALIR
    // --------------------------------------------------------

    document
      .getElementById(
        'btn-salir-ar'
      )
      .addEventListener(
        'click',
        cerrarAR
      );


    // --------------------------------------------------------
    // BOTÓN COLOCAR
    // --------------------------------------------------------

    document
      .getElementById(
        'btn-colocar-ar'
      )
      .addEventListener(
        'click',
        colocarGuajojo
      );

  }

}


// ============================================================
// VARIABLES HIT TEST
// ============================================================

let hitTestSource = null;

let viewerSpace = null;

let localSpace = null;

let ultimoHit = null;

let guajojoColocado = false;


// ============================================================
// PREPARAR HIT TEST
// ============================================================

async function prepararHitTest(
  session
) {

  try {

    // --------------------------------------------------------
    // ESPACIO VIEWER
    // --------------------------------------------------------

    viewerSpace =
      await session.requestReferenceSpace(
        'viewer'
      );


    // --------------------------------------------------------
    // ESPACIO LOCAL
    // --------------------------------------------------------

    localSpace =
      await session.requestReferenceSpace(
        'local'
      );


    // --------------------------------------------------------
    // HIT TEST
    // --------------------------------------------------------

    hitTestSource =
      await session.requestHitTestSource({

        space:
          viewerSpace

      });


    console.log(
      'HIT TEST ACTIVADO'
    );


    // --------------------------------------------------------
    // FRAME LOOP
    // --------------------------------------------------------

    session.requestAnimationFrame(
      actualizarAR
    );


  } catch (error) {

    console.error(
      'ERROR HIT TEST:',
      error
    );

  }

}


// ============================================================
// ACTUALIZAR AR
// ============================================================

function actualizarAR(
  tiempo,
  frame
) {

  if (
    !window.sessionAR
  ) {

    return;

  }


  window.sessionAR.requestAnimationFrame(
    actualizarAR
  );


  if (!hitTestSource) {

    return;

  }


  // ----------------------------------------------------------
  // RESULTADOS
  // ----------------------------------------------------------

  const resultados =
    frame.getHitTestResults(
      hitTestSource
    );


  const mensaje =
    document.getElementById(
      'mensaje-superficie'
    );


  const estado =
    document.getElementById(
      'estado-ar'
    );


  // ----------------------------------------------------------
  // NO ENCONTRÓ SUPERFICIE
  // ----------------------------------------------------------

  if (
    resultados.length === 0
  ) {

    ultimoHit =
      null;


    if (mensaje) {

      mensaje.textContent =
        'Mueve lentamente el teléfono para detectar el suelo.';

    }


    if (estado) {

      estado.textContent =
        '🔎 Buscando superficie...';

    }


    return;

  }


  // ----------------------------------------------------------
  // ENCONTRÓ SUPERFICIE
  // ----------------------------------------------------------

  const hit =
    resultados[0];


  const pose =
    hit.getPose(
      localSpace
    );


  if (!pose) {

    return;

  }


  ultimoHit =
    pose;


  if (mensaje) {

    mensaje.textContent =
      '✅ ¡Superficie encontrada!';

  }


  if (estado) {

    estado.textContent =
      '🟢 Superficie detectada';

  }


  const boton =
    document.getElementById(
      'btn-colocar-ar'
    );


  if (
    boton &&
    !guajojoColocado
  ) {

    boton.style.display =
      'block';

  }

}


// ============================================================
// COLOCAR GUAJOJÓ
// ============================================================

function colocarGuajojo() {

  if (!ultimoHit) {

    alert(
      'Primero busca una superficie.'
    );

    return;

  }


  const escena =
    document.getElementById(
      'escena-ar'
    );


  const modelo =
    document.getElementById(
      'guajojo-ar'
    );


  if (!modelo) {

    console.error(
      'No se encontró guajojo-ar'
    );

    return;

  }


  // ----------------------------------------------------------
  // MATRIZ DE POSICIÓN
  // ----------------------------------------------------------

  const matriz =
    new THREE.Matrix4();


  matriz.fromArray(
    ultimoHit.transform.matrix
  );


  // ----------------------------------------------------------
  // APLICAR MATRIZ
  // ----------------------------------------------------------

  modelo.object3D.matrix.copy(
    matriz
  );


  modelo.object3D.matrix.decompose(

    modelo.object3D.position,

    modelo.object3D.quaternion,

    modelo.object3D.scale

  );


  // ----------------------------------------------------------
  // ESCALA
  // ----------------------------------------------------------

  modelo.object3D.scale.set(
    0.2,
    0.2,
    0.2
  );


  modelo.setAttribute(
    'visible',
    'true'
  );


  guajojoColocado =
    true;


  // ----------------------------------------------------------
  // OCULTAR BOTÓN
  // ----------------------------------------------------------

  const boton =
    document.getElementById(
      'btn-colocar-ar'
    );


  if (boton) {

    boton.style.display =
      'none';

  }


  const estado =
    document.getElementById(
      'estado-ar'
    );


  if (estado) {

    estado.textContent =
      '🐦 ¡El Guajojó apareció!';

  }


  console.log(
    'GUAJOJÓ COLOCADO'
  );

}


// ============================================================
// CERRAR AR
// ============================================================

async function cerrarAR() {

  if (
    window.sessionAR
  ) {

    try {

      await window.sessionAR.end();

    } catch (error) {

      console.error(
        error
      );

    }

  }

}


// ============================================================
// CERRAR INTERFAZ
// ============================================================

function cerrarInterfazAR() {

  window.sessionAR =
    null;


  hitTestSource =
    null;


  viewerSpace =
    null;


  localSpace =
    null;


  ultimoHit =
    null;


  guajojoColocado =
    false;


  const interfaz =
    document.getElementById(
      'interfaz-ar'
    );


  if (interfaz) {

    interfaz.remove();

  }

}
