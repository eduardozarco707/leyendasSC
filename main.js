import './style.css';


// ============================================================
// ELEMENTOS GENERALES
// ============================================================

const sidebar =
  document.getElementById(
    'sidebar'
  );


const btnMenu =
  document.getElementById(
    'btn-menu'
  );


const areaTexto =
  document.getElementById(
    'contenido-dinamico'
  );


const botonesLeyenda =
  document.querySelectorAll(
    '.btn-leyenda'
  );


// ============================================================
// ELEMENTOS AR
// ============================================================

const pantallaAR =
  document.getElementById(
    'pantalla-ar'
  );


const escenaAR =
  document.getElementById(
    'escena-guajojo'
  );


const targetGuajojo =
  document.getElementById(
    'target-guajojo'
  );


const modeloGuajojo =
  document.getElementById(
    'modelo-guajojo'
  );


const btnCerrarAR =
  document.getElementById(
    'btn-cerrar-ar'
  );


const btnCapturar =
  document.getElementById(
    'btn-capturar'
  );


const mensajeAR =
  document.getElementById(
    'mensaje-ar'
  );


const estadoTarget =
  document.getElementById(
    'estado-target'
  );


// ============================================================
// VARIABLES AR
// ============================================================

let arActivo =
  false;


let arIniciando =
  false;


let targetVisible =
  false;


let leyendaActual =
  null;


let temporizadorCaptura =
  null;


// ============================================================
// MENÚ
// ============================================================

btnMenu?.addEventListener(
  'click',
  () => {

    sidebar.classList.toggle(
      'abierto'
    );

  }
);


// ============================================================
// SELECCIÓN DE LEYENDAS
// ============================================================

botonesLeyenda.forEach(
  boton => {

    boton.addEventListener(
      'click',
      () => {

        const leyenda =
          boton.dataset.legend;


        seleccionarLeyenda(
          leyenda
        );


        marcarBotonActivo(
          boton
        );


        // En móvil cerramos el menú
        if (
          window.innerWidth <=
          768
        ) {

          sidebar.classList.remove(
            'abierto'
          );

        }

      }
    );

  }
);


// ============================================================
// MARCAR BOTÓN ACTIVO
// ============================================================

function marcarBotonActivo(
  botonSeleccionado
) {

  botonesLeyenda.forEach(
    boton => {

      boton.classList.remove(
        'activo'
      );

    }
  );


  botonSeleccionado.classList.add(
    'activo'
  );
}


// ============================================================
// ELEGIR LEYENDA
// ============================================================

function seleccionarLeyenda(
  leyenda
) {

  cerrarCamaraAR();


  leyendaActual =
    leyenda;


  switch (leyenda) {


    case 'carreton':

      mostrarCarreton();

      break;


    case 'guajojo':

      mostrarGuajojo();

      break;


    case 'duende':

      mostrarDuende();

      break;


    case 'viudita':

      mostrarViudita();

      break;


    case 'jichi':

      mostrarJichi();

      break;


    default:

      mostrarInicio();

      break;

  }

}


// ============================================================
// CONTENIDO BASE DE LEYENDA
// ============================================================

function crearCabeceraLeyenda({
  etiqueta,
  titulo,
  descripcion,
  icono
}) {

  return `

    <div class="cabecera-leyenda">

      <div class="titulo-leyenda">

        <span class="sobrelinea">
          ${etiqueta}
        </span>

        <h2>
          ${titulo}
        </h2>

        <p class="descripcion-leyenda">
          ${descripcion}
        </p>

      </div>


      <div
        class="insignia-leyenda"
        aria-hidden="true"
      >
        ${icono}
      </div>

    </div>


    <div class="barra-leyenda"></div>

  `;

}


// ============================================================
// CARRETÓN
// ============================================================

function mostrarCarreton() {

  if (!areaTexto) return;


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'LEYENDA TRADICIONAL CRUCEÑA',

        titulo:
          'El Carretón de la Otra Vida',

        descripcion:
          'El crujir de unas antiguas ruedas rompe el silencio de la noche y anuncia el paso de un misterioso carretón.',

        icono:
          '🛞'

      })}


      <div class="historia-leyenda">

        <h3>
          La leyenda
        </h3>

        <p>
          Cuenta la tradición que durante las noches
          silenciosas puede escucharse el sonido de un
          antiguo carretón avanzando lentamente por las
          calles. El sonido de sus ruedas de madera se
          aproxima en medio de la oscuridad, pero quienes
          intentan descubrir su origen pocas veces logran
          encontrarlo.
        </p>

      </div>


      <div class="estado-proximamente">

        <div class="icono">
          🎮
        </div>

        <div>

          <strong>
            Experiencia interactiva en preparación
          </strong>

          <p>
            Esta sección está preparada para incorporar
            posteriormente audio, animación o una experiencia
            de realidad aumentada del Carretón.
          </p>

        </div>

      </div>


    </div>

  `;

}


// ============================================================
// GUAJOJÓ
// ============================================================

function mostrarGuajojo() {

  if (!areaTexto) return;


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'LEYENDA DEL ORIENTE BOLIVIANO',

        titulo:
          'El Guajojó',

        descripcion:
          'Un canto melancólico se escucha entre la vegetación. Encuentra la imagen objetivo y descubre al Guajojó mediante realidad aumentada.',

        icono:
          '🌙'

      })}


      <!-- TARGET -->

      <div class="panel-target">


        <img
          src="/guajojo-target.jpg"
          alt="Imagen objetivo para encontrar al Guajojó"
          class="imagen-target"
        >


        <div class="info-target">

          <span class="sobrelinea">
            EXPERIENCIA AR
          </span>


          <h3>
            Encuentra al Guajojó
          </h3>


          <p>
            Busca físicamente esta imagen con la cámara.
            Cuando el sistema la reconozca, el modelo 3D
            del Guajojó aparecerá anclado sobre ella.
          </p>


          <button
            id="btn-abrir-ar"
            class="btn-ver-ar"
            type="button"
          >
            <span>
              📱
            </span>

            INICIAR EXPERIENCIA AR
          </button>

        </div>


      </div>



      <!-- CONTENIDO CAPTURADO -->

      <div id="contenido-capturado">


        <div class="mensaje-capturado">

          <h3>
            ✨ ¡Guajojó capturado!
          </h3>

          <p>
            Has descubierto una de las leyendas más
            conocidas del oriente boliviano.
          </p>

        </div>



        <div class="multimedia-leyenda">


          <div class="reproductor-leyenda">

            <span class="sobrelinea">
              EXPERIENCIA SONORA
            </span>

            <h3>
              Escucha su canto
            </h3>

            <p>
              Reproduce el audio y escucha el característico
              sonido asociado al Guajojó.
            </p>


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
            el cacique enfureció y llevó al joven guerrero
            a lo más profundo de la selva.
          </p>

          <br>


          <p>
            La muchacha salió desesperada en busca de
            su amado y finalmente encontró su cuerpo
            sin vida.
          </p>

          <br>


          <p>
            Su llanto fue tan profundo que los espíritus
            de la selva la transformaron en un ave.
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


    </div>

  `;


  // ==========================================================
  // BOTÓN AR
  // ==========================================================

  const btnAbrirAR =
    document.getElementById(
      'btn-abrir-ar'
    );


  btnAbrirAR?.addEventListener(
    'click',
    iniciarCamaraAR
  );

}


// ============================================================
// DUENDE
// ============================================================

function mostrarDuende() {

  if (!areaTexto) return;


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'MISTERIOS DEL MONTE',

        titulo:
          'El Duende',

        descripcion:
          'Una nueva leyenda se incorpora a la experiencia. Esta sección está preparada para desarrollar su historia, contenido multimedia y futura interacción.',

        icono:
          '🌿'

      })}


      <div class="estado-proximamente">

        <div class="icono">
          🌿
        </div>

        <div>

          <strong>
            El Duende será la próxima experiencia
          </strong>

          <p>
            Aquí podremos agregar su historia completa,
            fotografías, sonidos, modelo 3D y una mecánica
            interactiva propia.
          </p>

        </div>

      </div>


    </div>

  `;

}


// ============================================================
// VIUDITA
// ============================================================

function mostrarViudita() {

  if (!areaTexto) return;


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'RELATOS DE LA NOCHE',

        titulo:
          'La Viudita',

        descripcion:
          'Una misteriosa figura vinculada a los relatos nocturnos se incorpora al recorrido de Leyendas de Santa Cruz.',

        icono:
          '🕯️'

      })}


      <div class="estado-proximamente">

        <div class="icono">
          🕯️
        </div>

        <div>

          <strong>
            Experiencia de La Viudita en desarrollo
          </strong>

          <p>
            Esta sección está lista para incorporar su
            narración, recursos multimedia y una futura
            experiencia inmersiva.
          </p>

        </div>

      </div>


    </div>

  `;

}


// ============================================================
// JICHI
// ============================================================

function mostrarJichi() {

  if (!areaTexto) return;


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'GUARDIÁN DE LAS AGUAS',

        titulo:
          'El Jichi',

        descripcion:
          'La experiencia incorpora al Jichi como una nueva historia dentro del recorrido de mitos y leyendas del oriente boliviano.',

        icono:
          '💧'

      })}


      <div class="estado-proximamente">

        <div class="icono">
          💧
        </div>

        <div>

          <strong>
            Experiencia del Jichi en preparación
          </strong>

          <p>
            Más adelante podremos crear una experiencia
            vinculada al agua, sonidos ambientales y un
            modelo 3D interactivo.
          </p>

        </div>

      </div>


    </div>

  `;

}


// ============================================================
// INICIAR MINDAR
// ============================================================

async function iniciarCamaraAR() {

  if (
    arActivo ||
    arIniciando
  ) {

    return;

  }


  if (
    !pantallaAR ||
    !escenaAR
  ) {

    alert(
      'No se encontró la escena de realidad aumentada.'
    );

    return;

  }


  arIniciando =
    true;


  targetVisible =
    false;


  deshabilitarCaptura();


  actualizarMensajeAR(
    'Iniciando cámara...'
  );


  actualizarEstadoTarget(
    '🔎 Preparando reconocimiento...'
  );


  pantallaAR.style.display =
    'block';


  try {


    // ========================================================
    // ESPERAR ESCENA
    // ========================================================

    await esperarEscenaAR();


    // ========================================================
    // SISTEMA MINDAR
    // ========================================================

    const sistemaAR =
      escenaAR.systems[
        'mindar-image-system'
      ];


    if (!sistemaAR) {

      throw new Error(
        'MindAR no se inicializó correctamente.'
      );

    }


    // ========================================================
    // INICIAR
    // ========================================================

    await sistemaAR.start();


    arActivo =
      true;


    actualizarMensajeAR(
      'Busca la imagen objetivo'
    );


    actualizarEstadoTarget(
      '📷 Apunta la cámara hacia la imagen'
    );


    console.log(
      '✅ MindAR iniciado'
    );


  } catch (error) {


    console.error(
      'Error iniciando AR:',
      error
    );


    pantallaAR.style.display =
      'none';


    arActivo =
      false;


    alert(

      'No se pudo iniciar la realidad aumentada.\n\n' +

      error.message

    );


  } finally {


    arIniciando =
      false;

  }

}


// ============================================================
// ESPERAR ESCENA
// ============================================================

function esperarEscenaAR() {

  return new Promise(
    resolve => {


      if (
        escenaAR.hasLoaded
      ) {

        resolve();

        return;

      }


      escenaAR.addEventListener(
        'loaded',
        () => {

          resolve();

        },
        {
          once: true
        }
      );

    }
  );

}


// ============================================================
// TARGET ENCONTRADO
// ============================================================

targetGuajojo?.addEventListener(
  'targetFound',
  () => {


    console.log(
      '🦉 Target encontrado'
    );


    targetVisible =
      true;


    actualizarMensajeAR(
      '¡Encontraste al Guajojó!'
    );


    actualizarEstadoTarget(
      '✅ Imagen reconocida'
    );


    // Esperamos un poco para evitar
    // detecciones instantáneas inestables.

    if (temporizadorCaptura) {

      clearTimeout(
        temporizadorCaptura
      );

    }


    temporizadorCaptura =
      setTimeout(
        () => {


          if (
            targetVisible
          ) {

            habilitarCaptura();

          }

        },
        450
      );

  }
);


// ============================================================
// TARGET PERDIDO
// ============================================================

targetGuajojo?.addEventListener(
  'targetLost',
  () => {


    console.log(
      'Target perdido'
    );


    targetVisible =
      false;


    if (temporizadorCaptura) {

      clearTimeout(
        temporizadorCaptura
      );


      temporizadorCaptura =
        null;

    }


    deshabilitarCaptura();


    actualizarMensajeAR(
      'Busca la imagen objetivo'
    );


    actualizarEstadoTarget(
      '🔎 Vuelve a enfocar la imagen'
    );

  }
);


// ============================================================
// MINDAR LISTO
// ============================================================

escenaAR?.addEventListener(
  'arReady',
  () => {


    console.log(
      '✅ Cámara MindAR preparada'
    );


    actualizarMensajeAR(
      'Busca la imagen objetivo'
    );


    actualizarEstadoTarget(
      '📷 Apunta hacia la imagen'
    );

  }
);


// ============================================================
// ERROR AR
// ============================================================

escenaAR?.addEventListener(
  'arError',
  event => {


    console.error(
      'Error MindAR:',
      event
    );


    actualizarMensajeAR(
      'No se pudo iniciar AR'
    );


    actualizarEstadoTarget(
      '❌ Comprueba el permiso de cámara'
    );

  }
);


// ============================================================
// MODELO CARGADO
// ============================================================

modeloGuajojo?.addEventListener(
  'model-loaded',
  () => {

    console.log(
      '✅ guajojo.glb cargado'
    );

  }
);


// ============================================================
// ERROR MODELO
// ============================================================

modeloGuajojo?.addEventListener(
  'model-error',
  event => {


    console.error(
      'Error cargando guajojo.glb:',
      event
    );


    actualizarMensajeAR(
      'Error cargando el Guajojó'
    );

  }
);


// ============================================================
// CAPTURAR
// ============================================================

btnCapturar?.addEventListener(
  'click',
  capturarGuajojo
);


function capturarGuajojo() {


  if (
    !targetVisible ||
    btnCapturar.disabled
  ) {

    return;

  }


  console.log(
    '✨ Guajojó capturado'
  );


  cerrarCamaraAR();


  const contenido =
    document.getElementById(
      'contenido-capturado'
    );


  if (contenido) {


    contenido.style.display =
      'block';


    setTimeout(
      () => {

        contenido.scrollIntoView({

          behavior:
            'smooth',

          block:
            'start'

        });

      },
      200
    );

  }


  const btnAbrirAR =
    document.getElementById(
      'btn-abrir-ar'
    );


  if (btnAbrirAR) {

    btnAbrirAR.style.display =
      'none';

  }


  const audio =
    document.getElementById(
      'audio-guajojo'
    );


  audio
    ?.play()
    .catch(
      () => {}
    );

}


// ============================================================
// CERRAR AR
// ============================================================

btnCerrarAR?.addEventListener(
  'click',
  cerrarCamaraAR
);


function cerrarCamaraAR() {


  targetVisible =
    false;


  if (temporizadorCaptura) {


    clearTimeout(
      temporizadorCaptura
    );


    temporizadorCaptura =
      null;

  }


  deshabilitarCaptura();


  if (
    arActivo &&
    escenaAR?.systems[
      'mindar-image-system'
    ]
  ) {


    try {


      escenaAR
        .systems[
          'mindar-image-system'
        ]
        .stop();


    } catch (error) {


      console.warn(
        'Error deteniendo MindAR:',
        error
      );

    }

  }


  arActivo =
    false;


  arIniciando =
    false;


  if (pantallaAR) {

    pantallaAR.style.display =
      'none';

  }

}


// ============================================================
// MENSAJES AR
// ============================================================

function actualizarMensajeAR(
  texto
) {


  if (mensajeAR) {

    mensajeAR.textContent =
      texto;

  }

}


function actualizarEstadoTarget(
  texto
) {


  if (estadoTarget) {

    estadoTarget.textContent =
      texto;

  }

}


// ============================================================
// BOTÓN CAPTURA
// ============================================================

function habilitarCaptura() {


  if (!btnCapturar) {
    return;
  }


  btnCapturar.disabled =
    false;


  btnCapturar.innerHTML =
    `
      <span>
        ✨
      </span>

      CAPTURAR
    `;

}


function deshabilitarCaptura() {


  if (!btnCapturar) {
    return;
  }


  btnCapturar.disabled =
    true;


  btnCapturar.innerHTML =
    `
      <span>
        👀
      </span>

      Busca la imagen...
    `;

}


// ============================================================
// CERRAR AL ABANDONAR PÁGINA
// ============================================================

window.addEventListener(
  'beforeunload',
  () => {


    if (
      arActivo
    ) {

      try {

        escenaAR
          ?.systems[
            'mindar-image-system'
          ]
          ?.stop();

      } catch {

        // No hacer nada.

      }

    }

  }
);
