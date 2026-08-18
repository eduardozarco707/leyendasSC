import './style.css';


// ============================================================
// ELEMENTOS PRINCIPALES
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


const targetCarreton =
  document.getElementById(
    'target-carreton'
  );


const targetGuajojo =
  document.getElementById(
    'target-guajojo'
  );


const modeloCarreton =
  document.getElementById(
    'modelo-carreton'
  );


const modeloGuajojo =
  document.getElementById(
    'modelo-guajojo'
  );


const contenedorCarreton =
  document.getElementById(
    'contenedor-modelo-carreton'
  );


const contenedorGuajojo =
  document.getElementById(
    'contenedor-modelo-guajojo'
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
// ESTADO
// ============================================================

let arActivo =
  false;


let arIniciando =
  false;


let experienciaActiva =
  null;


let targetEncontrado =
  false;


let temporizadorCaptura =
  null;


// ============================================================
// ESTADO DE MODELOS
// ============================================================

const modelosCargados = {

  carreton:
    false,

  guajojo:
    false

};


// ============================================================
// CONFIGURACIÓN EXPERIENCIAS
// ============================================================

const experiencias = {


  carreton: {

    nombre:
      'Carretón de la Otra Vida',

    modelo:
      modeloCarreton,

    contenedor:
      contenedorCarreton,

    target:
      targetCarreton,

    botonId:
      'btn-abrir-ar-carreton',

    contenidoId:
      'contenido-capturado-carreton',

    audioId:
      null,

    buscar:
      'Busca el Carretón de la Otra Vida',

    encontrado:
      '☠️ ¡Encontraste el Carretón!',

    instruccion:
      'Apunta hacia la imagen del Carretón',

    captura:
      '☠️ CAPTURAR CARRETÓN'

  },


  guajojo: {

    nombre:
      'Guajojó',

    modelo:
      modeloGuajojo,

    contenedor:
      contenedorGuajojo,

    target:
      targetGuajojo,

    botonId:
      'btn-abrir-ar-guajojo',

    contenidoId:
      'contenido-capturado-guajojo',

    audioId:
      'audio-guajojo',

    buscar:
      'Busca al Guajojó',

    encontrado:
      '🦉 ¡Encontraste al Guajojó!',

    instruccion:
      'Apunta hacia la imagen del Guajojó',

    captura:
      '🦉 CAPTURAR GUAJOJÓ'

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


        cerrarCamaraAR();


        marcarBotonActivo(
          boton
        );


        switch (leyenda) {


          case 'carreton':

            mostrarCarreton();

            break;


          case 'guajojo':

            mostrarGuajojo();

            break;


          case 'duende':

            mostrarProximamente(

              'El Duende',

              'MISTERIOS DEL MONTE',

              '🌿',

              'Esta experiencia será incorporada próximamente.'

            );

            break;


          case 'viudita':

            mostrarProximamente(

              'La Viudita',

              'RELATOS DE LA NOCHE',

              '🕯️',

              'Esta experiencia será incorporada próximamente.'

            );

            break;


          case 'jichi':

            mostrarProximamente(

              'El Jichi',

              'GUARDIÁN DE LAS AGUAS',

              '💧',

              'Esta experiencia será incorporada próximamente.'

            );

            break;


        }


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
  seleccionado
) {


  botonesLeyenda.forEach(
    boton => {


      boton.classList.remove(
        'activo'
      );


    }
  );


  seleccionado.classList.add(
    'activo'
  );


}


// ============================================================
// CABECERA DE LEYENDA
// ============================================================

function crearCabecera({
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



      <div class="insignia-leyenda">

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


      ${crearCabecera({

        etiqueta:
          'TRADICIÓN ORAL CRUCEÑA',

        titulo:
          'El Carretón de la Otra Vida',

        descripcion:
          'Un misterioso carretón cuyo chirriar rompía el silencio de las antiguas noches cruceñas.',

        icono:
          '🛞'

      })}



      <div class="panel-target">


        <img

          src="/carreton-target.jpg"

          class="imagen-target"

          alt="Imagen objetivo del Carretón"

        >



        <div class="info-target">


          <span class="sobrelinea">

            EXPERIENCIA AR

          </span>


          <h3>

            Encuentra el Carretón

          </h3>


          <p>

            Busca esta imagen utilizando la cámara.

            Cuando sea reconocida,
            el Carretón de la Otra Vida
            aparecerá en 3D sobre ella.

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
        style="display: none;"
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

            Cuentan los antiguos relatos cruceños que
            en las noches más cerradas, especialmente
            cuando llegaban el sur y el chilchi,
            el silencio de la campiña era interrumpido
            por el agudo chirriar de unos ejes y
            el violento restallar de un látigo.

          </p>


          <br>


          <p>

            Los sonidos parecían avanzar lentamente
            entre la oscuridad.

            También podía escucharse la voz de un
            extraño carretero llamando a sus animales.

          </p>


          <br>


          <p>

            Cuando algún relámpago iluminaba la noche,
            quienes se atrevían a mirar alcanzaban
            a distinguir un antiguo carretón
            desplazándose entre las sombras.

          </p>


          <br>


          <p>

            Una noche, un trasnochador decidió
            enfrentarse a la aparición.

            Corrió hacia el vehículo para descubrir
            qué era aquello que recorría los caminos.

          </p>


          <br>


          <p>

            Entonces observó que aquel carretón
            parecía estar construido con huesos humanos.

            Largos huesos ocupaban el lugar de las
            estacas y costillas desnudas formaban
            parte de su estructura.

          </p>


          <br>


          <p>

            Pero lo más aterrador era el carretero.

            En lugar de un rostro humano tenía
            una horrenda calavera y dentro de sus
            cuencas brillaba un resplandor semejante
            al fuego.

          </p>


          <br>


          <p>

            El hombre huyó aterrorizado.

            Desde entonces, escuchar unas ruedas
            chirriando durante una oscura noche
            de sur podía significar que el
            Carretón de la Otra Vida volvía
            a recorrer los caminos.

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


      ${crearCabecera({

        etiqueta:
          'LEYENDA DEL ORIENTE BOLIVIANO',

        titulo:
          'El Guajojó',

        descripcion:
          'Un canto melancólico continúa escuchándose entre los árboles del oriente boliviano.',

        icono:
          '🌙'

      })}



      <div class="panel-target">


        <img

          src="/guajojo-target.jpg"

          class="imagen-target"

          alt="Imagen objetivo del Guajojó"

        >



        <div class="info-target">


          <span class="sobrelinea">

            EXPERIENCIA AR

          </span>


          <h3>

            Encuentra al Guajojó

          </h3>


          <p>

            Busca esta imagen con la cámara.

            Cuando el sistema la reconozca,
            el Guajojó aparecerá en 3D.

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

        style="display: none;"

      >


        <div class="mensaje-capturado">


          <h3>

            ✨ ¡Guajojó capturado!

          </h3>


        </div>



        <div class="multimedia-leyenda">


          <div class="reproductor-leyenda">


            <span class="sobrelinea">

              EXPERIENCIA SONORA

            </span>


            <h3>

              Escucha su canto

            </h3>


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

            class="foto-leyenda"

            alt="Guajojó"

          >


        </div>



        <div class="historia-leyenda">


          <h3>

            La Leyenda del Guajojó

          </h3>


          <p>

            Cuenta la tradición que la hija de un
            cacique se enamoró de un joven.

            Su padre se opuso a aquella relación
            y terminó con la vida del muchacho
            en la selva.

          </p>


          <br>


          <p>

            Cuando la joven descubrió lo ocurrido
            enfrentó a su padre.

            Para impedir que revelara lo sucedido,
            fue transformada en un ave nocturna.

          </p>


          <br>


          <p>

            Desde entonces, su triste canto
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
// OTRAS LEYENDAS
// ============================================================

function mostrarProximamente(
  titulo,
  etiqueta,
  icono,
  descripcion
) {


  if (!areaTexto) {
    return;
  }


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabecera({

        etiqueta,
        titulo,
        descripcion,
        icono

      })}


      <div class="estado-proximamente">


        <div class="icono">

          ${icono}

        </div>


        <div>


          <strong>

            Próxima experiencia

          </strong>


          <p>

            Estamos preparando su contenido
            interactivo y experiencia AR.

          </p>


        </div>


      </div>


    </div>

  `;


}


// ============================================================
// MODELO CARGADO
// ============================================================

function registrarModelo(
  tipo,
  modelo
) {


  if (!modelo) {
    return;
  }


  modelo.addEventListener(
    'model-loaded',
    () => {


      modelosCargados[
        tipo
      ] = true;


      console.log(
        `✅ MODELO CARGADO: ${tipo}`
      );


      // Si esta es la experiencia activa,
      // aseguramos que el modelo esté visible.

      if (
        experienciaActiva ===
        tipo
      ) {


        modelo.setAttribute(
          'visible',
          true
        );


        if (
          modelo.object3D
        ) {

          modelo.object3D.visible =
            true;

        }


      }


    }
  );


  modelo.addEventListener(
    'model-error',
    error => {


      modelosCargados[
        tipo
      ] = false;


      console.error(

        `❌ ERROR CARGANDO MODELO: ${tipo}`,

        error

      );


      if (
        experienciaActiva ===
        tipo
      ) {


        actualizarMensaje(
          `❌ No se pudo cargar ${tipo}.glb`
        );


      }


    }
  );


}


// ============================================================
// REGISTRAMOS GLB
// ============================================================

registrarModelo(
  'carreton',
  modeloCarreton
);


registrarModelo(
  'guajojo',
  modeloGuajojo
);


// ============================================================
// ACTIVAR SOLO EL MODELO CORRECTO
// ============================================================

function activarModelo(
  tipo
) {


  // ==========================================================
  // CARRETÓN
  // ==========================================================

  if (
    modeloCarreton
  ) {


    const visible =
      tipo ===
      'carreton';


    modeloCarreton.setAttribute(
      'visible',
      visible
    );


    if (
      modeloCarreton.object3D
    ) {

      modeloCarreton.object3D.visible =
        visible;

    }


  }


  // ==========================================================
  // GUAJOJÓ
  // ==========================================================

  if (
    modeloGuajojo
  ) {


    const visible =
      tipo ===
      'guajojo';


    modeloGuajojo.setAttribute(
      'visible',
      visible
    );


    if (
      modeloGuajojo.object3D
    ) {

      modeloGuajojo.object3D.visible =
        visible;

    }


  }


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
    !pantallaAR ||
    !escenaAR
  ) {

    return;

  }


  arIniciando =
    true;


  experienciaActiva =
    tipo;


  targetEncontrado =
    false;


  // ==========================================================
  // ACTIVAMOS EL MODELO ANTES DE ARRANCAR MINDAR
  // ==========================================================

  activarModelo(
    tipo
  );


  deshabilitarCaptura();


  actualizarMensaje(
    config.buscar
  );


  actualizarEstado(
    '🔎 Preparando reconocimiento...'
  );


  if (
    textoInstruccionAR
  ) {


    textoInstruccionAR.textContent =
      config.instruccion;


  }


  // ==========================================================
  // MOSTRAR PANTALLA
  // ==========================================================

  pantallaAR.style.display =
    'block';


  // Como la escena estaba display:none,
  // forzamos actualización del viewport.

  await esperar(
    50
  );


  window.dispatchEvent(
    new Event(
      'resize'
    )
  );


  try {


    await esperarEscena();


    const sistema =
      escenaAR.systems[
        'mindar-image-system'
      ];


    if (!sistema) {


      throw new Error(
        'No se encontró mindar-image-system.'
      );


    }


    // Volvemos a asegurarlo
    // inmediatamente antes de start().

    activarModelo(
      tipo
    );


    await Promise.resolve(
      sistema.start()
    );


    arActivo =
      true;


    activarModelo(
      tipo
    );


    actualizarMensaje(
      config.buscar
    );


    actualizarEstado(
      modelosCargados[tipo]

        ? '📷 Modelo 3D listo · busca la imagen'

        : '⏳ Cargando modelo 3D...'
    );


    console.log(
      `✅ AR iniciado: ${tipo}`
    );


  } catch (error) {


    console.error(
      '❌ ERROR AR:',
      error
    );


    arActivo =
      false;


    experienciaActiva =
      null;


    pantallaAR.style.display =
      'none';


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
// ESPERAR
// ============================================================

function esperar(
  tiempo
) {


  return new Promise(
    resolve => {


      setTimeout(
        resolve,
        tiempo
      );


    }
  );


}


// ============================================================
// ESPERAR ESCENA
// ============================================================

function esperarEscena() {


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
// EVENTOS TARGET
// ============================================================

function configurarTarget(
  tipo
) {


  const config =
    experiencias[
      tipo
    ];


  if (
    !config?.target
  ) {

    return;

  }


  // ==========================================================
  // TARGET ENCONTRADO
  // ==========================================================

  config.target.addEventListener(
    'targetFound',
    () => {


      console.log(
        `🎯 TARGET DETECTADO: ${tipo}`
      );


      // Si el usuario está en la otra leyenda,
      // no hacemos nada.

      if (
        experienciaActiva !==
        tipo
      ) {


        return;


      }


      targetEncontrado =
        true;


      // ======================================================
      // IMPORTANTE:
      //
      // No ocultamos el modelo.
      // Nos aseguramos de que continúe visible.
      // ======================================================

      activarModelo(
        tipo
      );


      actualizarMensaje(
        config.encontrado
      );


      if (
        modelosCargados[tipo]
      ) {


        actualizarEstado(
          '✅ Imagen reconocida · modelo 3D visible'
        );


      } else {


        actualizarEstado(
          '✅ Imagen reconocida · cargando modelo 3D...'
        );


      }


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

              targetEncontrado &&

              experienciaActiva ===
              tipo

            ) {


              activarModelo(
                tipo
              );


              habilitarCaptura(
                config
              );


            }


          },
          350
        );


    }
  );


  // ==========================================================
  // TARGET PERDIDO
  // ==========================================================

  config.target.addEventListener(
    'targetLost',
    () => {


      if (
        experienciaActiva !==
        tipo
      ) {

        return;

      }


      console.log(
        `👀 TARGET PERDIDO: ${tipo}`
      );


      targetEncontrado =
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


      // NO ponemos modelo visible=false.
      //
      // MindAR oculta automáticamente
      // el target padre.


      deshabilitarCaptura();


      actualizarMensaje(
        config.buscar
      );


      actualizarEstado(
        '🔎 Vuelve a enfocar la imagen'
      );


    }
  );


}


// ============================================================
// REGISTRAR TARGETS
// ============================================================

configurarTarget(
  'carreton'
);


configurarTarget(
  'guajojo'
);


// ============================================================
// CAPTURA
// ============================================================

btnCapturar?.addEventListener(
  'click',
  capturar
);


function capturar() {


  if (

    !experienciaActiva ||

    !targetEncontrado ||

    btnCapturar?.disabled

  ) {

    return;

  }


  const tipo =
    experienciaActiva;


  const config =
    experiencias[
      tipo
    ];


  cerrarCamaraAR();


  // ==========================================================
  // MOSTRAR HISTORIA
  // ==========================================================

  const contenido =
    document.getElementById(
      config.contenidoId
    );


  if (
    contenido
  ) {


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
  // OCULTAR BOTÓN
  // ==========================================================

  const boton =
    document.getElementById(
      config.botonId
    );


  if (
    boton
  ) {


    boton.style.display =
      'none';


  }


  // ==========================================================
  // AUDIO
  // ==========================================================

  if (
    config.audioId
  ) {


    document
      .getElementById(
        config.audioId
      )
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


  targetEncontrado =
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
        'Error cerrando MindAR:',
        error
      );


    }


  }


  arActivo =
    false;


  arIniciando =
    false;


  experienciaActiva =
    null;


  // Ahora sí podemos ocultar los dos.

  activarModelo(
    null
  );


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

function actualizarMensaje(
  texto
) {


  if (
    mensajeAR
  ) {


    mensajeAR.textContent =
      texto;


  }


}


function actualizarEstado(
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
// HABILITAR CAPTURA
// ============================================================

function habilitarCaptura(
  config
) {


  if (
    !btnCapturar
  ) {

    return;

  }


  btnCapturar.disabled =
    false;


  btnCapturar.textContent =
    config.captura;


}


// ============================================================
// DESHABILITAR
// ============================================================

function deshabilitarCaptura() {


  if (
    !btnCapturar
  ) {

    return;

  }


  btnCapturar.disabled =
    true;


  btnCapturar.textContent =
    '👀 Busca la imagen...';


}


// ============================================================
// SALIR DE LA WEB
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
