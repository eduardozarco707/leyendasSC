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
// ESTADO AR
// ============================================================

let arActivo =
  false;


let arIniciando =
  false;


let targetVisible =
  false;


let experienciaARActiva =
  null;


let temporizadorCaptura =
  null;


// ============================================================
// CONFIGURACIÓN DE EXPERIENCIAS
// ============================================================

const experiencias = {


  // ==========================================================
  // GUAJOJÓ
  // ==========================================================

  guajojo: {

    nombre:
      'Guajojó',

    target:
      targetGuajojo,

    modelo:
      modeloGuajojo,

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

    iconoCapturar:
      '🦉'

  },


  // ==========================================================
  // CARRETÓN
  // ==========================================================

  carreton: {

    nombre:
      'Carretón de la Otra Vida',

    target:
      targetCarreton,

    modelo:
      modeloCarreton,

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

    iconoCapturar:
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


    default:

      mostrarInicio();

      break;

  }

}


// ============================================================
// CABECERA DE LEYENDA
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
// INICIO
// ============================================================

function mostrarInicio() {

  if (!areaTexto) {
    return;
  }


  areaTexto.innerHTML = `

    <div class="contenido-inicio">


      <span class="sobrelinea">

        EXPERIENCIA CULTURAL INTERACTIVA

      </span>


      <h2>

        Patio de los Abuelos

      </h2>


      <p class="descripcion-principal">

        Explora las leyendas y tradiciones
        de Santa Cruz de la Sierra.

      </p>


    </div>

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



      <!-- =================================================
           TARGET CARRETÓN
           ================================================= -->

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

            Busca físicamente esta imagen
            con la cámara.

            Cuando la imagen sea reconocida,
            el modelo 3D del Carretón aparecerá
            sobre ella.

          </p>


          <button

            id="btn-abrir-ar-carreton"

            class="btn-ver-ar"

            type="button"

          >

            <span>
              📱
            </span>

            BUSCAR EL CARRETÓN EN AR

          </button>


        </div>


      </div>



      <!-- =================================================
           CONTENIDO DESBLOQUEADO
           ================================================= -->

      <div

        id="contenido-capturado-carreton"

        style="
          display: none;
        "

      >


        <div class="mensaje-capturado">


          <h3>

            ☠️ ¡Has encontrado el Carretón!

          </h3>


          <p>

            Has desbloqueado uno de los relatos más
            inquietantes de la tradición cruceña.

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
            cuando llegaban el sur y el chilchi, el
            silencio de la campiña era interrumpido
            de pronto por un agudo chirriar de ejes
            y el violento restallar de un látigo.

          </p>

          <br>


          <p>

            Nadie necesitaba verlo para saber lo que
            se acercaba. Los ruidos parecían avanzar
            lentamente entre la oscuridad.

          </p>

          <br>


          <p>

            Se escuchaba también la voz del extraño
            carretero llamando a sus animales, pero
            aquella voz no parecía salir de una
            garganta humana.

          </p>

          <br>


          <p>

            Cuando algún relámpago iluminaba por unos
            segundos la noche, quienes tenían el valor
            de mirar apenas alcanzaban a distinguir
            la figura de un antiguo carretón
            desplazándose entre las sombras.

          </p>

          <br>


          <p>

            La aparición también recorría las afueras
            de Santa Cruz, pasando por antiguos caminos
            cercanos al cementerio y en dirección
            al Lazareto.

          </p>

          <br>


          <p>

            Una noche, un trasnochador decidió
            enfrentarse a la aparición.

            Al ver acercarse el misterioso vehículo,
            reunió valor y corrió hacia él para
            descubrir qué era realmente.

          </p>

          <br>


          <p>

            Entonces vio algo que jamás olvidaría.

          </p>

          <br>


          <p>

            El carretón no estaba construido como
            uno común.

            Sus partes parecían formadas por huesos
            humanos.

            Largos huesos ocupaban el lugar de las
            estacas y costillas desnudas componían
            partes de su estructura.

          </p>

          <br>


          <p>

            Pero lo más aterrador estaba al frente.

            Del carretero apenas podía distinguirse
            el rostro: una horrenda calavera.

            Dentro de sus cuencas vacías brillaba
            un resplandor semejante al fuego.

          </p>

          <br>


          <p>

            El hombre perdió inmediatamente toda
            su valentía.

            El miedo le devolvió la sobriedad
            y salió huyendo desesperadamente
            hasta llegar a su casa.

          </p>

          <br>


          <p>

            Desde entonces, el chirriar de unas
            ruedas en medio de una noche de sur
            era suficiente para recordar que quizás
            el Carretón de la Otra Vida volvía
            a recorrer los caminos.

          </p>


        </div>


      </div>


    </div>

  `;


  const boton =
    document.getElementById(
      'btn-abrir-ar-carreton'
    );


  boton?.addEventListener(
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



      <!-- =================================================
           TARGET GUAJOJÓ
           ================================================= -->

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

            Busca físicamente esta imagen
            con la cámara.

            Cuando la imagen sea reconocida,
            el Guajojó 3D aparecerá sobre ella.

          </p>


          <button

            id="btn-abrir-ar-guajojo"

            class="btn-ver-ar"

            type="button"

          >

            <span>
              📱
            </span>

            BUSCAR AL GUAJOJÓ EN AR

          </button>


        </div>


      </div>



      <!-- =================================================
           CONTENIDO DESBLOQUEADO
           ================================================= -->

      <div

        id="contenido-capturado-guajojo"

        style="
          display: none;
        "

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
            en una antigua tribu del oriente,
            la hija de un cacique se enamoró de
            un joven a quien su padre consideraba
            indigno de ella.

          </p>

          <br>


          <p>

            El cacique descubrió la relación
            y acabó con la vida del joven
            en la selva.

          </p>

          <br>


          <p>

            Cuando la muchacha descubrió lo sucedido,
            enfrentó a su padre.

          </p>

          <br>


          <p>

            Para impedir que revelara el crimen,
            el cacique utilizó sus poderes
            y la transformó en un ave nocturna.

          </p>

          <br>


          <p>

            Desde entonces, durante las noches,
            su lamento continúa escuchándose
            entre los árboles:

            <strong>

              ¡Gua... jo... jó!

            </strong>

          </p>


        </div>


      </div>


    </div>

  `;


  const boton =
    document.getElementById(
      'btn-abrir-ar-guajojo'
    );


  boton?.addEventListener(
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

  if (!areaTexto) {
    return;
  }


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'MISTERIOS DEL MONTE',

        titulo:
          'El Duende',

        descripcion:
          'Una nueva leyenda se incorpora al recorrido interactivo de Santa Cruz.',

        icono:
          '🌿'

      })}


      <div class="estado-proximamente">


        <div class="icono">
          🌿
        </div>


        <div>

          <strong>
            Próxima experiencia
          </strong>

          <p>

            Aquí agregaremos la historia,
            modelo 3D y experiencia AR
            del Duende.

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

  if (!areaTexto) {
    return;
  }


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'RELATOS DE LA NOCHE',

        titulo:
          'La Viudita',

        descripcion:
          'Una misteriosa aparición de las antiguas noches cruceñas.',

        icono:
          '🕯️'

      })}


      <div class="estado-proximamente">


        <div class="icono">
          🕯️
        </div>


        <div>

          <strong>
            Próxima experiencia
          </strong>

          <p>

            Aquí agregaremos la historia
            y experiencia interactiva
            de La Viudita.

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

  if (!areaTexto) {
    return;
  }


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabeceraLeyenda({

        etiqueta:
          'GUARDIÁN DE LAS AGUAS',

        titulo:
          'El Jichi',

        descripcion:
          'Un ser ancestral relacionado con la protección de las aguas.',

        icono:
          '💧'

      })}


      <div class="estado-proximamente">


        <div class="icono">
          💧
        </div>


        <div>

          <strong>
            Próxima experiencia
          </strong>

          <p>

            Aquí agregaremos la historia,
            modelo 3D y experiencia AR
            del Jichi.

          </p>

        </div>


      </div>


    </div>

  `;

}


// ============================================================
// OCULTAR MODELO
// ============================================================

function ocultarModelo(
  modelo
) {

  if (!modelo) {
    return;
  }


  modelo.setAttribute(
    'visible',
    false
  );


  if (
    modelo.object3D
  ) {

    modelo.object3D.visible =
      false;

  }

}


// ============================================================
// MOSTRAR MODELO
// ============================================================

function mostrarModelo(
  modelo
) {

  if (!modelo) {
    return;
  }


  // ==========================================================
  // A-FRAME
  // ==========================================================

  modelo.setAttribute(
    'visible',
    true
  );


  // ==========================================================
  // THREE.JS
  // ==========================================================

  if (
    modelo.object3D
  ) {

    modelo.object3D.visible =
      true;


    modelo.object3D.traverse(
      objeto => {

        objeto.visible =
          true;

      }
    );


    modelo.object3D.updateMatrixWorld(
      true
    );

  }

}


// ============================================================
// OCULTAR TODOS LOS GLB
// ============================================================

function ocultarTodosLosModelos() {

  ocultarModelo(
    modeloGuajojo
  );


  ocultarModelo(
    modeloCarreton
  );

}


// ============================================================
// COMPROBAR CARGA DEL MODELO
// ============================================================

function modeloCargado(
  modelo
) {

  if (!modelo) {
    return false;
  }


  return Boolean(
    modelo.getObject3D(
      'mesh'
    )
  );

}


// ============================================================
// INICIALIZACIÓN
// ============================================================
//
// MUY IMPORTANTE:
//
// Al cargar la página los dos modelos empiezan ocultos.
// ============================================================

ocultarTodosLosModelos();


// ============================================================
// INICIAR CÁMARA AR
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


  if (!config) {

    console.error(
      'Experiencia desconocida:',
      tipo
    );

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


  experienciaARActiva =
    tipo;


  targetVisible =
    false;


  // ==========================================================
  // IMPORTANTE:
  //
  // NO mostramos el GLB aquí.
  //
  // El modelo SOLO aparecerá cuando MindAR dispare:
  //
  // targetFound
  //
  // ==========================================================

  ocultarTodosLosModelos();


  deshabilitarCaptura();


  actualizarMensajeAR(
    config.mensajeBuscar
  );


  actualizarEstadoTarget(
    '🔎 Buscando imagen...'
  );


  if (
    textoInstruccionAR
  ) {

    textoInstruccionAR.textContent =
      config.instruccion;

  }


  pantallaAR.style.display =
    'block';


  try {


    await esperarEscenaAR();


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
    // INICIAR MINDAR
    // ========================================================

    await Promise.resolve(
      sistemaAR.start()
    );


    arActivo =
      true;


    // ========================================================
    // SIGUEN OCULTOS
    // ========================================================

    ocultarTodosLosModelos();


    actualizarMensajeAR(
      config.mensajeBuscar
    );


    actualizarEstadoTarget(
      '📷 Apunta hacia la imagen objetivo'
    );


    console.log(
      `✅ AR iniciado: ${tipo}`
    );


  } catch (error) {


    console.error(
      '❌ Error iniciando AR:',
      error
    );


    arActivo =
      false;


    experienciaARActiva =
      null;


    ocultarTodosLosModelos();


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
// ESPERAR ESCENA
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
// REGISTRAR TARGET
// ============================================================

function registrarEventosTarget(
  tipo,
  target
) {

  if (!target) {
    return;
  }


  // ==========================================================
  // TARGET ENCONTRADO
  // ==========================================================

  target.addEventListener(
    'targetFound',
    () => {


      console.log(
        `🎯 Imagen reconocida: ${tipo}`
      );


      // ======================================================
      // NO ES LA LEYENDA QUE ESTAMOS BUSCANDO
      // ======================================================

      if (
        experienciaARActiva !==
        tipo
      ) {

        console.log(
          `🚫 ${tipo} ignorado`
        );


        const modeloEquivocado =
          experiencias[
            tipo
          ]?.modelo;


        ocultarModelo(
          modeloEquivocado
        );


        return;

      }


      const config =
        experiencias[
          tipo
        ];


      targetVisible =
        true;


      // ======================================================
      // 🔥 AQUÍ APARECE EL GLB
      // ======================================================
      //
      // Antes de targetFound estaba oculto.
      //
      // En el momento exacto en que MindAR reconoce
      // la imagen, mostramos el modelo.
      //
      // ======================================================

      ocultarTodosLosModelos();


      mostrarModelo(
        config.modelo
      );


      actualizarMensajeAR(
        config.mensajeEncontrado
      );


      actualizarEstadoTarget(
        '✅ Imagen reconocida'
      );


      console.log(
        `✅ Mostrando ${config.nombre}.glb`
      );


      // ======================================================
      // POR SI EL GLB TODAVÍA ESTÁ TERMINANDO DE CARGAR
      // ======================================================

      if (
        !modeloCargado(
          config.modelo
        )
      ) {


        actualizarMensajeAR(
          '⏳ Imagen reconocida · cargando modelo 3D...'
        );


        const alCargar =
          () => {


            if (

              experienciaARActiva ===
                tipo &&

              targetVisible

            ) {


              mostrarModelo(
                config.modelo
              );


              actualizarMensajeAR(
                config.mensajeEncontrado
              );

            }

          };


        config.modelo.addEventListener(
          'model-loaded',
          alCargar,
          {
            once: true
          }
        );

      }


      // ======================================================
      // HABILITAR CAPTURA
      // ======================================================

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


              mostrarModelo(
                config.modelo
              );


              habilitarCaptura();

            }

          },
          450
        );

    }
  );


  // ==========================================================
  // TARGET PERDIDO
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


      const config =
        experiencias[
          tipo
        ];


      console.log(
        `👀 Imagen perdida: ${tipo}`
      );


      targetVisible =
        false;


      // ======================================================
      // 🔥 CUANDO SE PIERDE LA IMAGEN, OCULTAMOS EL GLB
      // ======================================================

      ocultarModelo(
        config.modelo
      );


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
// REGISTRAR GUAJOJÓ
// ============================================================

registrarEventosTarget(
  'guajojo',
  targetGuajojo
);


// ============================================================
// REGISTRAR CARRETÓN
// ============================================================

registrarEventosTarget(
  'carreton',
  targetCarreton
);


// ============================================================
// MINDAR PREPARADO
// ============================================================

escenaAR?.addEventListener(
  'arReady',
  () => {


    console.log(
      '✅ MindAR preparado'
    );


    // ========================================================
    // MUY IMPORTANTE:
    //
    // Aunque la cámara ya esté preparada,
    // los GLB siguen ocultos.
    // ========================================================

    ocultarTodosLosModelos();


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
// ERROR AR
// ============================================================

escenaAR?.addEventListener(
  'arError',
  event => {


    console.error(
      '❌ Error MindAR:',
      event
    );


    ocultarTodosLosModelos();


    actualizarMensajeAR(
      '❌ No se pudo iniciar AR'
    );


    actualizarEstadoTarget(
      'Comprueba el permiso de cámara'
    );

  }
);


// ============================================================
// MODELO GUAJOJÓ CARGADO
// ============================================================

modeloGuajojo?.addEventListener(
  'model-loaded',
  () => {


    console.log(
      '✅ guajojo.glb cargado'
    );


    // ========================================================
    // NO mostrar automáticamente.
    //
    // Solo mostrar si:
    //
    // 1. estamos buscando Guajojó
    // 2. el target está actualmente reconocido
    // ========================================================

    if (

      experienciaARActiva ===
        'guajojo' &&

      targetVisible

    ) {


      mostrarModelo(
        modeloGuajojo
      );


    } else {


      ocultarModelo(
        modeloGuajojo
      );

    }

  }
);


// ============================================================
// MODELO CARRETÓN CARGADO
// ============================================================

modeloCarreton?.addEventListener(
  'model-loaded',
  () => {


    console.log(
      '✅ carreton.glb cargado'
    );


    if (

      experienciaARActiva ===
        'carreton' &&

      targetVisible

    ) {


      mostrarModelo(
        modeloCarreton
      );


    } else {


      ocultarModelo(
        modeloCarreton
      );

    }

  }
);


// ============================================================
// ERROR MODELOS
// ============================================================

modeloGuajojo?.addEventListener(
  'model-error',
  event => {


    console.error(
      '❌ Error guajojo.glb:',
      event
    );

  }
);


modeloCarreton?.addEventListener(
  'model-error',
  event => {


    console.error(
      '❌ Error carreton.glb:',
      event
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

    btnCapturar?.disabled

  ) {

    return;

  }


  const tipo =
    experienciaARActiva;


  const config =
    experiencias[
      tipo
    ];


  console.log(
    `✨ Capturado: ${tipo}`
  );


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
  // OCULTAR BOTÓN DE AR
  // ==========================================================

  const btnAbrir =
    document.getElementById(
      config.botonAbrirId
    );


  if (
    btnAbrir
  ) {

    btnAbrir.style.display =
      'none';

  }


  // ==========================================================
  // AUDIO
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
// CERRAR AR
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


  // ==========================================================
  // OCULTAR MODELOS
  // ==========================================================

  ocultarTodosLosModelos();


  // ==========================================================
  // DETENER MINDAR
  // ==========================================================

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
// HABILITAR CAPTURA
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

      ${config.iconoCapturar}

    </span>

    ${config.textoCapturar}

  `;

}


// ============================================================
// DESHABILITAR CAPTURA
// ============================================================

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


    ocultarTodosLosModelos();


    try {


      escenaAR
        ?.systems[
          'mindar-image-system'
        ]
        ?.stop();


    } catch {

      // Nada.

    }

  }
);
