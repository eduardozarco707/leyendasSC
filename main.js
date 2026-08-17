import './style.css';


// ============================================================
// ELEMENTOS PRINCIPALES
// ============================================================

const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');

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

const guajojoAR =
  document.getElementById('guajojo-ar');

const reticula =
  document.getElementById('reticula');

const btnCerrarAR =
  document.getElementById('btn-cerrar-ar');

const btnCapturar =
  document.getElementById('btn-capturar');

const btnColocarAR =
  document.getElementById('btn-colocar-ar');

const mensajeCaptura =
  document.getElementById('mensaje-captura');

const btnVerLeyenda =
  document.getElementById('btn-ver-leyenda');

const estadoGuajojo =
  document.getElementById('estado-guajojo');

const audioGuajojo =
  document.getElementById('audio-guajojo');


// ============================================================
// VARIABLES WEBXR
// ============================================================

let xrSession = null;
let hitTestSource = null;
let viewerSpace = null;
let localReferenceSpace = null;

let superficieDetectada = false;
let guajojoColocado = false;
let guajojoCapturado = false;


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
  htmlExtra = ''
) {

  areaTexto.innerHTML = `

    <h2>${titulo}</h2>

    <p>${descripcion}</p>

    ${htmlExtra}

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

        <br>

        <p>
          Su presencia forma parte de los relatos
          tradicionales transmitidos de generación
          en generación.
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

        vr-mode-ui="enabled: false"

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
        ></a-sky>


        <a-light
          type="ambient"
          color="#ffffff"
          intensity="1.5"
        ></a-light>


        <a-light
          type="directional"
          color="#ffffff"
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
        perdidamente de un joven guerrero.
      </p>

      <br>

      <p>
        Al enterarse de este romance prohibido,
        el cacique llevó al joven a lo más espeso
        de la selva para quitarle la vida.
      </p>

      <br>

      <p>
        La muchacha, desesperada por encontrar a
        su amado, recorrió la selva hasta encontrar
        su cuerpo sin vida.
      </p>

      <br>

      <p>
        Su dolor fue tan grande que los espíritus
        de la selva la transformaron en un ave.
      </p>

      <br>

      <p>
        Desde entonces su canto nocturno recuerda
        eternamente su amor perdido:
        <strong>¡Gua... jo... jó!</strong>
      </p>

    </div>

  `;


  mostrarLeyenda(

    'El Guajojó',

    'Un canto melancólico resuena en la selva. Explora el entorno, conoce al ave y descubre su trágica historia.',

    contenidoGuajojo

  );


  // ----------------------------------------------------------
  // CREAR BOTÓN AR
  // ----------------------------------------------------------

  setTimeout(() => {

    const btnAbrirAR =
      document.getElementById('btn-abrir-ar');

    if (btnAbrirAR) {

      btnAbrirAR.addEventListener(
        'click',
        iniciarImmersiveAR
      );

    }

  }, 50);

});


// ============================================================
// COMPROBAR SI EL TELÉFONO SOPORTA IMMERSIVE-AR
// ============================================================

async function comprobarSoporteAR() {

  if (!navigator.xr) {

    console.log(
      'navigator.xr no existe.'
    );

    return false;

  }


  try {

    const soportado =
      await navigator.xr.isSessionSupported(
        'immersive-ar'
      );

    console.log(
      'immersive-ar:',
      soportado
    );

    return soportado;

  } catch (error) {

    console.error(
      'Error comprobando immersive-ar:',
      error
    );

    return false;

  }

}


// ============================================================
// INICIAR IMMERSIVE-AR
// ============================================================

async function iniciarImmersiveAR() {

  console.log(
    '================================='
  );

  console.log(
    'INICIANDO IMMERSIVE-AR'
  );

  console.log(
    '================================='
  );


  estadoGuajojo.textContent =
    'Comprobando compatibilidad AR...';


  const soportado =
    await comprobarSoporteAR();


  if (!soportado) {

    estadoGuajojo.textContent =
      '❌ Este navegador/teléfono no permite immersive-ar.';

    alert(
      'Este dispositivo o navegador no soporta WebXR immersive-ar.'
    );

    return;

  }


  // ----------------------------------------------------------
  // PREPARAR ESTADO
  // ----------------------------------------------------------

  guajojoAR.setAttribute(
    'visible',
    'false'
  );


  guajojoColocado =
    false;

  guajojoCapturado =
    false;

  superficieDetectada =
    false;


  btnCapturar.classList.remove(
    'visible'
  );


  btnColocarAR.style.display =
    'none';


  mensajeCaptura.classList.remove(
    'activo'
  );


  contenedorAR.classList.add(
    'activo'
  );


  estadoGuajojo.textContent =
    'Abriendo cámara AR...';


  // ----------------------------------------------------------
  // ENTRAR EN IMMERSIVE-AR
  // ----------------------------------------------------------

  try {

    await escenaAR.enterVR();

  } catch (error) {

    console.error(
      'ERROR AL ENTRAR EN IMMERSIVE-AR:',
      error
    );


    estadoGuajojo.textContent =
      '❌ No se pudo iniciar AR.';

    alert(
      'No se pudo iniciar la realidad aumentada.\n\n' +
      'Revisa que estés usando HTTPS y que el navegador sea compatible con WebXR.'
    );

    contenedorAR.classList.remove(
      'activo'
    );

  }

}


// ============================================================
// EVENTO: ENTRÓ EN XR
// ============================================================

escenaAR.addEventListener(
  'enter-vr',
  async () => {

    console.log(
      '================================='
    );

    console.log(
      'IMMERSIVE-AR ACTIVADO'
    );

    console.log(
      '================================='
    );


    estadoGuajojo.textContent =
      'AR iniciado. Mueve lentamente el celular para buscar el suelo.';


    try {

      xrSession =
        escenaAR.renderer.xr.getSession();


      if (!xrSession) {

        console.error(
          'No se encontró XRSession.'
        );

        return;

      }


      console.log(
        'XRSession:',
        xrSession
      );


      console.log(
        'Características:',
        xrSession.enabledFeatures
      );


      // ------------------------------------------------------
      // REFERENCE SPACE
      // ------------------------------------------------------

      viewerSpace =
        await xrSession.requestReferenceSpace(
          'viewer'
        );


      localReferenceSpace =
        await xrSession.requestReferenceSpace(
          'local'
        );


      // ------------------------------------------------------
      // HIT TEST
      // ------------------------------------------------------

      hitTestSource =
        await xrSession.requestHitTestSource({

          space: viewerSpace

        });


      console.log(
        'Hit-test activado.'
      );


      // ------------------------------------------------------
      // FRAME LOOP
      // ------------------------------------------------------

      xrSession.requestAnimationFrame(
        actualizarHitTest
      );


    } catch (error) {

      console.error(
        'Error preparando hit-test:',
        error
      );


      estadoGuajojo.textContent =
        'No se pudo activar la detección de superficies.';

    }


    xrSession.addEventListener(
      'end',
      finalizarXR
    );

  }
);


// ============================================================
// HIT TEST
// ============================================================

function actualizarHitTest(
  tiempo,
  frame
) {

  if (!xrSession) {

    return;

  }


  xrSession.requestAnimationFrame(
    actualizarHitTest
  );


  if (!hitTestSource) {

    return;

  }


  const resultados =
    frame.getHitTestResults(
      hitTestSource
    );


  if (
    resultados.length === 0
  ) {

    superficieDetectada =
      false;


    reticula.setAttribute(
      'visible',
      'false'
    );


    estadoGuajojo.textContent =
      'Busca una superficie plana...';


    return;

  }


  // ----------------------------------------------------------
  // SUPERFICIE ENCONTRADA
  // ----------------------------------------------------------

  const hit =
    resultados[0];


  const pose =
    hit.getPose(
      localReferenceSpace
    );


  if (!pose) {

    return;

  }


  superficieDetectada =
    true;


  // ----------------------------------------------------------
  // MOSTRAR RETÍCULA
  // ----------------------------------------------------------

  reticula.setAttribute(
    'visible',
    'true'
  );


  // ----------------------------------------------------------
  // OBTENER MATRIZ
  // ----------------------------------------------------------

  const matriz =
    pose.transform.matrix;


  const objeto =
    reticula.object3D;


  objeto.matrix.fromArray(
    matriz
  );


  objeto.matrix.decompose(
    objeto.position,
    objeto.quaternion,
    objeto.scale
  );


  reticula.object3D.visible =
    true;


  if (!guajojoColocado) {

    estadoGuajojo.textContent =
      '¡Superficie encontrada! Pulsa COLOCAR.';

    btnColocarAR.style.display =
      'block';

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
// COLOCAR GUAJOJÓ SOBRE EL SUELO
// ============================================================

function colocarGuajojo() {

  if (
    !superficieDetectada
  ) {

    alert(
      'Primero apunta hacia una superficie plana hasta que aparezca el círculo.'
    );

    return;

  }


  // ----------------------------------------------------------
  // COPIAR POSICIÓN DE LA RETÍCULA
  // ----------------------------------------------------------

  const posicion =
    reticula.object3D.position.clone();


  const quaternion =
    reticula.object3D.quaternion.clone();


  // ----------------------------------------------------------
  // COLOCAR GUAJOJÓ
  // ----------------------------------------------------------

  guajojoAR.object3D.position.copy(
    posicion
  );


  guajojoAR.object3D.quaternion.copy(
    quaternion
  );


  // ----------------------------------------------------------
  // ALTURA DEL MODELO
  // ----------------------------------------------------------

  guajojoAR.object3D.position.y +=
    0.01;


  // ----------------------------------------------------------
  // ESCALA
  // ----------------------------------------------------------

  guajojoAR.object3D.scale.set(
    0.2,
    0.2,
    0.2
  );


  guajojoAR.setAttribute(
    'visible',
    'true'
  );


  guajojoColocado =
    true;


  reticula.setAttribute(
    'visible',
    'false'
  );


  btnColocarAR.style.display =
    'none';


  btnCapturar.classList.add(
    'visible'
  );


  estadoGuajojo.textContent =
    '🐦 ¡El Guajojó apareció! Encuéntralo y captúralo.';


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
    performance.now() / 1000;


  const altura =
    Math.sin(
      tiempo * 2
    ) * 0.04;


  guajojoAR.object3D.position.y =
    reticula.object3D.position.y +
    0.01 +
    altura;


  guajojoAR.object3D.rotation.y +=
    0.003;


  requestAnimationFrame(
    animarGuajojo
  );

}


// ============================================================
// CAPTURAR
// ============================================================

btnCapturar.addEventListener(
  'click',
  capturarGuajojo
);


function capturarGuajojo() {

  if (
    !guajojoColocado
  ) {

    return;

  }


  guajojoCapturado =
    true;


  guajojoAR.setAttribute(
    'visible',
    'false'
  );


  btnCapturar.classList.remove(
    'visible'
  );


  mensajeCaptura.classList.add(
    'activo'
  );


  estadoGuajojo.textContent =
    '¡Guajojó capturado!';


  audioGuajojo.currentTime =
    0;


  audioGuajojo.play()
    .catch(
      error => {

        console.log(
          'No se pudo iniciar el audio:',
          error
        );

      }
    );

}


// ============================================================
// VER LEYENDA
// ============================================================

btnVerLeyenda.addEventListener(
  'click',
  () => {

    cerrarAR();


    mostrarLeyenda(

      '🐦 Guajojó',

      'Has capturado al Guajojó y descubierto su leyenda.',

      `

      <div class="historia-leyenda">

        <h3>
          La Leyenda del Guajojó
        </h3>

        <p>

          Cuenta la leyenda que una joven
          perdió a su amado después de que
          su padre se opusiera a su relación.

        </p>

        <br>

        <p>

          El dolor de la joven fue tan grande
          que los espíritus de la selva
          la transformaron en un ave.

        </p>

        <br>

        <p>

          Desde entonces su canto puede
          escucharse durante las noches
          en la selva oriental.

        </p>

        <br>

        <p>

          <strong>
            ¡Gua... jo... jó!
          </strong>

        </p>


        <div class="reproductor-leyenda">

          <h3>
            Escucha su canto
          </h3>

          <audio controls>

            <source
              src="/audio-guajojo.mp3"
              type="audio/mpeg"
            >

          </audio>

        </div>

      </div>

      `

    );

  }
);


// ============================================================
// CERRAR AR
// ============================================================

btnCerrarAR.addEventListener(
  'click',
  cerrarAR
);


function cerrarAR() {

  if (xrSession) {

    xrSession.end()
      .catch(
        error => {

          console.log(
            error
          );

        }
      );

  } else {

    finalizarXR();

  }

}


// ============================================================
// FINALIZAR XR
// ============================================================

function finalizarXR() {

  console.log(
    'Finalizando immersive-ar.'
  );


  xrSession =
    null;


  hitTestSource =
    null;


  viewerSpace =
    null;


  localReferenceSpace =
    null;


  superficieDetectada =
    false;


  guajojoColocado =
    false;


  guajojoCapturado =
    false;


  guajojoAR.setAttribute(
    'visible',
    'false'
  );


  reticula.setAttribute(
    'visible',
    'false'
  );


  btnCapturar.classList.remove(
    'visible'
  );


  btnColocarAR.style.display =
    'none';


  mensajeCaptura.classList.remove(
    'activo'
  );


  contenedorAR.classList.remove(
    'activo'
  );


  estadoGuajojo.textContent =
    'Preparando la experiencia...';

}


// ============================================================
// MOSTRAR LEYENDA
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

  sidebar.classList.remove(
    'abierto'
  );

}


// ============================================================
// COMPROBACIÓN AL CARGAR
// ============================================================

window.addEventListener(
  'load',
  async () => {

    const soportado =
      await comprobarSoporteAR();


    console.log(
      '¿immersive-ar disponible?:',
      soportado
    );

  }
);
