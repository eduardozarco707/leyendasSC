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
    'escena-ar'
  );

const targetGuajojo =
  document.getElementById(
    'target-guajojo'
  );

const targetCarreton =
  document.getElementById(
    'target-carreton'
  );

const modeloGuajojo =
  document.getElementById(
    'modelo-guajojo'
  );

const modeloCarreton =
  document.getElementById(
    'modelo-carreton'
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

const textoInstruccionAR =
  document.getElementById(
    'texto-instruccion-ar'
  );


// ============================================================
// VARIABLES
// ============================================================

let arActivo = false;

let arIniciando = false;

let targetVisible = false;

let experienciaARActiva = null;

let temporizadorCaptura = null;


// ============================================================
// CONFIGURACIÓN
// ============================================================

const experiencias = {

  guajojo: {

    nombre:
      'Guajojó',

    modelo:
      modeloGuajojo,

    target:
      targetGuajojo,

    botonAbrirId:
      'btn-abrir-ar-guajojo',

    contenidoId:
      'contenido-capturado-guajojo',

    audioId:
      'audio-guajojo',

    mensajeBuscar:
      'Busca al Guajojó',

    mensajeEncontrado:
      '🦉 ¡Encontraste al Guajojó!',

    instruccion:
      'Apunta hacia la imagen del Guajojó',

    textoCapturar:
      'CAPTURAR GUAJOJÓ',

    icono:
      '🦉'

  },


  carreton: {

    nombre:
      'Carretón de la Otra Vida',

    modelo:
      modeloCarreton,

    target:
      targetCarreton,

    botonAbrirId:
      'btn-abrir-ar-carreton',

    contenidoId:
      'contenido-capturado-carreton',

    audioId:
      null,

    mensajeBuscar:
      'Busca el Carretón de la Otra Vida',

    mensajeEncontrado:
      '☠️ ¡Encontraste el Carretón!',

    instruccion:
      'Apunta hacia la imagen del Carretón',

    textoCapturar:
      'CAPTURAR CARRETÓN',

    icono:
      '☠️'

  }

};


// ============================================================
// MENÚ
// ============================================================

btnMenu?.addEventListener(
  'click',
  () => {

    sidebar?.classList.toggle(
      'abierto'
    );

  }
);


// ============================================================
// BOTONES DE LEYENDAS
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


        if (
          window.innerWidth <= 768
        ) {

          sidebar?.classList.remove(
            'abierto'
          );

        }

      }
    );

  }
);


// ============================================================
// BOTÓN ACTIVO
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
// SELECCIONAR LEYENDA
// ============================================================

function seleccionarLeyenda(
  leyenda
) {

  cerrarCamaraAR();


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

  }

}


// ============================================================
// CABECERA
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

  if (!areaTexto) {
    return;
  }


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'TRADICIÓN ORAL CRUCEÑA',

        titulo:
          'El Carretón de la Otra Vida',

        descripcion:
          'Cuando llegaban las noches oscuras de sur y chilchi, el silencio podía romperse con el extraño chirriar de unos ejes y el restallar de un látigo.',

        icono:
          '🛞'

      })}



      <div class="panel-target">


        <img

          src="/carreton-target.jpg"

          alt="Imagen objetivo del Carretón"

          class="imagen-target"

        >


        <div class="info-target">


          <span class="sobrelinea">
            EXPERIENCIA AR
          </span>


          <h3>
            Encuentra el Carretón
          </h3>


          <p>

            Busca físicamente esta imagen con la cámara.

            Cuando sea reconocida,
            el Carretón de la Otra Vida
            aparecerá sobre ella.

          </p>


          <button

            id="btn-abrir-ar-carreton"

            class="btn-ver-ar"

            type="button"

          >

            📱 BUSCAR EL CARRETÓN EN AR

          </button>


        </div>


      </div>



      <div

        id="contenido-capturado-carreton"

        style="display:none"

      >


        <div class="mensaje-capturado">

          <h3>
            ☠️ ¡Has encontrado el Carretón!
          </h3>

          <p>

            Has desbloqueado uno de los relatos
            más inquietantes de la tradición cruceña.

          </p>

        </div>



        <div class="historia-leyenda">


          <span class="sobrelinea">
            TRADICIÓN ORAL
          </span>


          <h3>
            El Carretón de la Otra Vida
          </h3>


          <p>

            Cuentan los antiguos relatos cruceños que,
            en las noches más cerradas, especialmente
            cuando llegaban el sur y el chilchi,
            el silencio de la campiña era interrumpido
            por el chirriar de unos ejes y el
            restallar de un látigo.

          </p>

          <br>


          <p>

            Los sonidos avanzaban lentamente entre
            la oscuridad.

            Se escuchaba además la voz de un extraño
            carretero llamando a sus animales.

          </p>

          <br>


          <p>

            Cuando algún relámpago iluminaba la noche,
            podía distinguirse un antiguo carretón
            avanzando entre las sombras.

          </p>

          <br>


          <p>

            La aparición recorría también las afueras
            de Santa Cruz, pasando por antiguos caminos
            cercanos al cementerio y al Lazareto.

          </p>

          <br>


          <p>

            Una noche, un trasnochador decidió
            enfrentarse a la aparición.

            Corrió hacia el misterioso vehículo
            para descubrir qué era realmente.

          </p>

          <br>


          <p>

            Entonces vio que el carretón parecía
            construido con huesos humanos.

            Largos huesos ocupaban el lugar de las
            estacas y costillas desnudas formaban
            parte de su estructura.

          </p>

          <br>


          <p>

            Al frente se encontraba el carretero.

            En lugar de un rostro humano tenía
            una horrenda calavera y dentro de sus
            cuencas brillaba un resplandor semejante
            al fuego.

          </p>

          <br>


          <p>

            El hombre huyó aterrorizado.

            Desde entonces, el chirriar de unas ruedas
            durante una oscura noche de sur podía
            significar que el Carretón de la Otra Vida
            volvía a recorrer los caminos.

          </p>


        </div>


      </div>


    </div>

  `;


  document
    .getElementById(
      'btn-abrir-ar-carreton'
    )
    ?.addEventListener(
      'click',
      () => {

        iniciarCamaraAR(
          'carreton'
        );

      }
    );

}


// ============================================================
// GUAJOJÓ
// ============================================================

function mostrarGuajojo() {

  if (!areaTexto) {
    return;
  }


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



      <div class="panel-target">


        <img

          src="/guajojo-target.jpg"

          alt="Imagen objetivo del Guajojó"

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

            Cuando sea reconocida,
            el Guajojó 3D aparecerá sobre ella.

          </p>


          <button

            id="btn-abrir-ar-guajojo"

            class="btn-ver-ar"

            type="button"

          >

            📱 BUSCAR AL GUAJOJÓ EN AR

          </button>


        </div>


      </div>



      <div

        id="contenido-capturado-guajojo"

        style="display:none"

      >


        <div class="mensaje-capturado">

          <h3>
            ✨ ¡Guajojó capturado!
          </h3>

          <p>

            Has descubierto una de las leyendas
            más conocidas del oriente boliviano.

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

              Escucha el característico canto
              asociado al Guajojó.

            </p>


            <audio
              id="audio-guajojo"
              controls
            >

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
            la hija de un cacique se enamoró
            de un joven.

          </p>

          <br>


          <p>

            Su padre se opuso a aquella relación
            y terminó con la vida del muchacho
            en la selva.

          </p>

          <br>


          <p>

            Cuando la joven descubrió lo ocurrido,
            enfrentó a su padre.

          </p>

          <br>


          <p>

            Para impedir que revelara lo sucedido,
            fue transformada en un ave nocturna.

          </p>

          <br>


          <p>

            Desde entonces su triste canto
            continúa escuchándose entre los árboles:

            <strong>
              ¡Gua... jo... jó!
            </strong>

          </p>


        </div>


      </div>


    </div>

  `;


  document
    .getElementById(
      'btn-abrir-ar-guajojo'
    )
    ?.addEventListener(
      'click',
      () => {

        iniciarCamaraAR(
          'guajojo'
        );

      }
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
          'Próximamente experiencia interactiva.',

        icono:
          '🌿'

      })}

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
          'Próximamente experiencia interactiva.',

        icono:
          '🕯️'

      })}

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
          'Próximamente experiencia interactiva.',

        icono:
          '💧'

      })}

    </div>

  `;

}


// ============================================================
// CONFIGURAR MODELOS
// ============================================================
//
// IMPORTANTE:
//
// Durante una experiencia:
// - modelo correcto = visible
// - modelo incorrecto = oculto
//
// DESPUÉS NO VOLVEMOS A CAMBIAR SU VISIBILIDAD.
//
// MindAR se encarga de mostrar/ocultar EL TARGET.
// ============================================================

function prepararModeloParaExperiencia(
  tipo
) {

  if (modeloGuajojo) {

    modeloGuajojo.setAttribute(
      'visible',
      tipo === 'guajojo'
    );

  }


  if (modeloCarreton) {

    modeloCarreton.setAttribute(
      'visible',
      tipo === 'carreton'
    );

  }


  console.log(
    'MODELO ACTIVO:',
    tipo
  );

}


// ============================================================
// ESPERAR A-FRAME
// ============================================================

function esperarEscenaAR() {

  return new Promise(
    resolve => {


      if (
        escenaAR?.hasLoaded
      ) {

        resolve();

        return;

      }


      escenaAR?.addEventListener(
        'loaded',
        resolve,
        {
          once: true
        }
      );

    }
  );

}


// ============================================================
// INICIAR AR
// ============================================================

async function iniciarCamaraAR(
  tipo
) {

  if (
    arActivo ||
    arIniciando
  ) {

    return;

  }


  const config =
    experiencias[
      tipo
    ];


  if (
    !config ||
    !escenaAR ||
    !pantallaAR
  ) {

    return;

  }


  arIniciando =
    true;


  experienciaARActiva =
    tipo;


  targetVisible =
    false;


  deshabilitarCaptura();


  // ==========================================================
  // ESTA ES LA PARTE IMPORTANTE
  // ==========================================================

  prepararModeloParaExperiencia(
    tipo
  );


  pantallaAR.style.display =
    'block';


  actualizarMensajeAR(
    config.mensajeBuscar
  );


  actualizarEstadoTarget(
    '🔎 Preparando cámara...'
  );


  if (
    textoInstruccionAR
  ) {

    textoInstruccionAR.textContent =
      config.instruccion;

  }


  try {


    await esperarEscenaAR();


    const sistemaAR =
      escenaAR.systems[
        'mindar-image-system'
      ];


    if (!sistemaAR) {

      throw new Error(
        'No se encontró MindAR.'
      );

    }


    // Aseguramos nuevamente el modelo correcto
    prepararModeloParaExperiencia(
      tipo
    );


    await Promise.resolve(
      sistemaAR.start()
    );


    arActivo =
      true;


    // ========================================================
    // NO OCULTAR MODELOS AQUÍ
    // ========================================================


    actualizarMensajeAR(
      config.mensajeBuscar
    );


    actualizarEstadoTarget(
      '📷 Apunta hacia la imagen objetivo'
    );


    console.log(
      `✅ Experiencia iniciada: ${tipo}`
    );


  } catch (error) {


    console.error(
      error
    );


    experienciaARActiva =
      null;


    arActivo =
      false;


    pantallaAR.style.display =
      'none';


    alert(

      'Error iniciando realidad aumentada:\n\n' +

      error.message

    );


  } finally {


    arIniciando =
      false;

  }

}


// ============================================================
// TARGET FOUND / TARGET LOST
// ============================================================

function registrarTarget(
  tipo,
  target
) {

  if (!target) {
    return;
  }


  // ==========================================================
  // ENCONTRADO
  // ==========================================================

  target.addEventListener(
    'targetFound',
    () => {


      console.log(
        'TARGET FOUND:',
        tipo
      );


      // Si no corresponde a la leyenda actual,
      // lo ignoramos.

      if (
        experienciaARActiva !==
        tipo
      ) {

        return;

      }


      const config =
        experiencias[
          tipo
        ];


      targetVisible =
        true;


      // ======================================================
      // NO TOCAMOS visible AQUÍ
      //
      // MindAR acaba de hacer visible el TARGET padre.
      //
      // Como el modelo ya estaba preparado como visible,
      // aparecerá automáticamente.
      // ======================================================


      actualizarMensajeAR(
        config.mensajeEncontrado
      );


      actualizarEstadoTarget(
        '✅ Imagen reconocida'
      );


      if (
        temporizadorCaptura
      ) {

        clearTimeout(
          temporizadorCaptura
        );

      }


      temporizadorCaptura =
        setTimeout(
          () => {


            if (

              targetVisible &&

              experienciaARActiva ===
              tipo

            ) {

              habilitarCaptura();

            }

          },
          400
        );

    }
  );


  // ==========================================================
  // PERDIDO
  // ==========================================================

  target.addEventListener(
    'targetLost',
    () => {


      if (
        experienciaARActiva !==
        tipo
      ) {

        return;

      }


      console.log(
        'TARGET LOST:',
        tipo
      );


      const config =
        experiencias[
          tipo
        ];


      targetVisible =
        false;


      // ======================================================
      // NO OCULTAMOS EL GLB AQUÍ.
      //
      // MindAR oculta automáticamente el target padre,
      // por lo que el GLB desaparece igualmente.
      // ======================================================


      if (
        temporizadorCaptura
      ) {

        clearTimeout(
          temporizadorCaptura
        );


        temporizadorCaptura =
          null;

      }


      deshabilitarCaptura();


      actualizarMensajeAR(
        config.mensajeBuscar
      );


      actualizarEstadoTarget(
        '🔎 Vuelve a enfocar la imagen'
      );

    }
  );

}


// ============================================================
// REGISTRAR TARGETS
// ============================================================

registrarTarget(
  'carreton',
  targetCarreton
);


registrarTarget(
  'guajojo',
  targetGuajojo
);


// ============================================================
// MODELOS CARGADOS
// ============================================================

modeloGuajojo?.addEventListener(
  'model-loaded',
  () => {

    console.log(
      '✅ GUAJOJO GLB CARGADO'
    );

  }
);


modeloCarreton?.addEventListener(
  'model-loaded',
  () => {

    console.log(
      '✅ CARRETON GLB CARGADO'
    );

  }
);


// ============================================================
// ERROR MODELOS
// ============================================================

modeloGuajojo?.addEventListener(
  'model-error',
  error => {

    console.error(
      '❌ ERROR GUAJOJO GLB',
      error
    );

  }
);


modeloCarreton?.addEventListener(
  'model-error',
  error => {

    console.error(
      '❌ ERROR CARRETON GLB',
      error
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
      '✅ MINDAR LISTO'
    );


    // ========================================================
    // IMPORTANTE:
    //
    // NO ejecutar:
    //
    // ocultarTodosLosModelos()
    //
    // aquí.
    // ========================================================


    if (
      !experienciaARActiva
    ) {

      return;

    }


    const config =
      experiencias[
        experienciaARActiva
      ];


    actualizarMensajeAR(
      config.mensajeBuscar
    );


    actualizarEstadoTarget(
      '📷 Apunta hacia la imagen objetivo'
    );

  }
);


// ============================================================
// CAPTURAR
// ============================================================

btnCapturar?.addEventListener(
  'click',
  capturarExperiencia
);


function capturarExperiencia() {


  if (

    !experienciaARActiva ||

    !targetVisible ||

    btnCapturar.disabled

  ) {

    return;

  }


  const tipo =
    experienciaARActiva;


  const config =
    experiencias[
      tipo
    ];


  cerrarCamaraAR();


  // ==========================================================
  // MOSTRAR CONTENIDO
  // ==========================================================

  const contenido =
    document.getElementById(
      config.contenidoId
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


  // ==========================================================
  // OCULTAR BOTÓN AR
  // ==========================================================

  const botonAbrir =
    document.getElementById(
      config.botonAbrirId
    );


  if (
    botonAbrir
  ) {

    botonAbrir.style.display =
      'none';

  }


  // ==========================================================
  // AUDIO GUAJOJÓ
  // ==========================================================

  if (
    config.audioId
  ) {


    const audio =
      document.getElementById(
        config.audioId
      );


    audio
      ?.play()
      .catch(
        () => {}
      );

  }

}


// ============================================================
// CERRAR
// ============================================================

btnCerrarAR?.addEventListener(
  'click',
  cerrarCamaraAR
);


function cerrarCamaraAR() {


  targetVisible =
    false;


  if (
    temporizadorCaptura
  ) {

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
        error
      );

    }

  }


  arActivo =
    false;


  arIniciando =
    false;


  experienciaARActiva =
    null;


  if (
    pantallaAR
  ) {

    pantallaAR.style.display =
      'none';

  }

}


// ============================================================
// MENSAJES
// ============================================================

function actualizarMensajeAR(
  texto
) {

  if (
    mensajeAR
  ) {

    mensajeAR.textContent =
      texto;

  }

}


function actualizarEstadoTarget(
  texto
) {

  if (
    estadoTarget
  ) {

    estadoTarget.textContent =
      texto;

  }

}


// ============================================================
// CAPTURA
// ============================================================

function habilitarCaptura() {


  if (
    !btnCapturar ||
    !experienciaARActiva
  ) {

    return;

  }


  const config =
    experiencias[
      experienciaARActiva
    ];


  btnCapturar.disabled =
    false;


  btnCapturar.innerHTML = `

    <span>

      ${config.icono}

    </span>

    ${config.textoCapturar}

  `;

}


function deshabilitarCaptura() {


  if (
    !btnCapturar
  ) {

    return;

  }


  btnCapturar.disabled =
    true;


  btnCapturar.innerHTML = `

    <span>
      👀
    </span>

    Busca la imagen...

  `;

}


// ============================================================
// SALIR
// ============================================================

window.addEventListener(
  'beforeunload',
  () => {


    try {


      escenaAR
        ?.systems[
          'mindar-image-system'
        ]
        ?.stop();


    } catch {

      // Nada

    }

  }
);
