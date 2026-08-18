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
// ELEMENTOS REALIDAD AUMENTADA
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

    instruccion:
      'Apunta hacia la imagen del Guajojó'

  },


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

    instruccion:
      'Apunta hacia la imagen del Carretón'

  }


};


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
// MARCAR BOTÓN SELECCIONADO
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

        Explora las leyendas y tradiciones de
        Santa Cruz de la Sierra.

      </p>


    </div>

  `;

}


// ============================================================
// CARRETÓN DE LA OTRA VIDA
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
          'Cuando llegaban las noches oscuras de sur y chilchi, el silencio de la campiña podía romperse con el extraño chirriar de unos ejes y el restallar de un látigo.',

        icono:
          '🛞'

      })}



      <!-- =================================================
           PANEL AR CARRETÓN
           ================================================= -->

      <div class="panel-target">


        <img

          src="/carreton-target.jpg"

          alt="Imagen objetivo del Carretón de la Otra Vida"

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
            Cuando MindAR la reconozca, el Carretón de la
            Otra Vida aparecerá en realidad aumentada.

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
           CONTENIDO BLOQUEADO
           ================================================= -->

      <div

        id="contenido-capturado-carreton"

        style="
          display: none;
        "

      >


        <!-- CAPTURADO -->

        <div class="mensaje-capturado">

          <h3>
            ☠️ ¡Has encontrado el Carretón!
          </h3>

          <p>

            Has desbloqueado uno de los relatos más
            inquietantes de la tradición cruceña.

          </p>

        </div>



        <!-- =================================================
             HISTORIA TRADICIONAL
             ================================================= -->

        <div class="historia-leyenda">


          <span class="sobrelinea">
            TRADICIÓN ORAL
          </span>


          <h3>
            El Carretón de la Otra Vida
          </h3>


          <p>

            Cuentan los antiguos relatos cruceños que en las
            noches más cerradas, especialmente cuando llegaban
            el sur y el chilchi, el silencio de la campiña era
            interrumpido de pronto por un agudo chirriar de
            ejes y el violento restallar de un látigo.

          </p>

          <br>


          <p>

            Nadie necesitaba verlo para saber lo que se
            acercaba. Los ruidos parecían avanzar lentamente
            entre la oscuridad. Se escuchaba también la voz
            del extraño carretero llamando a sus animales,
            pero aquella voz no parecía salir de una garganta
            humana.

          </p>

          <br>


          <p>

            Cuando algún relámpago iluminaba por unos segundos
            la noche, quienes tenían el valor de mirar apenas
            alcanzaban a distinguir la figura imprecisa de un
            antiguo carretón desplazándose entre las sombras.

          </p>

          <br>


          <p>

            La aparición no pertenecía solamente a la
            campiña. También se decía que recorría las
            afueras de Santa Cruz, pasando por el antiguo
            camino cercano al cementerio y avanzando en
            dirección al Lazareto.

          </p>

          <br>


          <p>

            Una noche, un trasnochador que había pasado
            varias horas bebiendo decidió enfrentarse a la
            aparición. Al ver acercarse el misterioso
            vehículo, reunió valor y corrió hacia él para
            descubrir qué era realmente.

          </p>

          <br>


          <p>

            Entonces vio algo que jamás olvidaría.

          </p>

          <br>


          <p>

            El supuesto carretón no estaba construido como
            uno común. Sus partes parecían formadas por
            huesos humanos: largos huesos ocupaban el lugar
            de las estacas y costillas desnudas componían
            partes de su estructura.

          </p>

          <br>


          <p>

            Pero lo más aterrador estaba al frente.

            Del carretero apenas podía distinguirse el
            rostro: una horrenda calavera. Dentro de sus
            cuencas vacías brillaba un resplandor semejante
            al fuego.

          </p>

          <br>


          <p>

            El hombre perdió inmediatamente toda su valentía.
            El miedo le devolvió la sobriedad y salió huyendo
            desesperadamente hasta llegar a su casa.

          </p>

          <br>


          <p>

            Desde entonces, el chirriar de unas ruedas en
            medio de una noche de sur era suficiente para
            recordar a los cruceños que quizás el Carretón
            de la Otra Vida volvía a recorrer los caminos.

          </p>


          <div class="barra-leyenda"></div>


          <p
            style="
              font-family: Arial, sans-serif;
              font-size: 0.82rem;
              color: #6a746f;
              text-align: left;
              line-height: 1.6;
            "
          >

            Relato adaptado de la tradición oral recopilada
            por Hernando Sanabria Fernández en
            <em>
              Tradiciones, Leyendas y Casos de Santa Cruz
              de la Sierra
            </em>.

          </p>


        </div>



        <!-- =================================================
             CONTEXTO HISTÓRICO
             ================================================= -->

        <div class="estado-proximamente">


          <div class="icono">
            📜
          </div>


          <div>


            <strong>
              Tras la leyenda existe también una memoria histórica
            </strong>


            <p>

              Una interpretación difundida sobre el origen del
              mito lo relaciona con las epidemias de viruela que
              golpearon Santa Cruz a finales del siglo XIX.

              Los enfermos y moribundos eran trasladados fuera
              de la ciudad y el paso de aquellos carretones,
              asociado al miedo al contagio y a la muerte,
              habría contribuido a alimentar la leyenda.

            </p>


          </div>


        </div>


      </div>


    </div>

  `;


  // ==========================================================
  // BOTÓN AR CARRETÓN
  // ==========================================================

  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar-carreton'
    );


  btnAbrir?.addEventListener(
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
           PANEL TARGET
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

            Busca físicamente esta imagen con la cámara.
            Cuando el sistema la reconozca, el modelo
            3D del Guajojó aparecerá sobre ella.

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
           CONTENIDO CAPTURADO
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

            Has descubierto una de las leyendas más
            conocidas del oriente boliviano.

          </p>


        </div>



        <!-- MULTIMEDIA -->

        <div class="multimedia-leyenda">


          <div class="reproductor-leyenda">


            <span class="sobrelinea">
              EXPERIENCIA SONORA
            </span>


            <h3>
              Escucha su canto
            </h3>


            <p>

              Escucha el característico canto asociado
              al Guajojó.

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



        <!-- HISTORIA -->

        <div class="historia-leyenda">


          <h3>
            La Leyenda del Guajojó
          </h3>


          <p>

            Cuenta la leyenda que hace muchos años,
            en una antigua tribu del oriente,
            la hija de un cacique se enamoró de un
            joven a quien su padre consideraba indigno
            de ella.

          </p>

          <br>


          <p>

            El cacique descubrió la relación y acabó
            con la vida del joven en la selva.

          </p>

          <br>


          <p>

            Cuando la muchacha descubrió lo sucedido,
            enfrentó a su padre.

          </p>

          <br>


          <p>

            Para impedir que revelara el crimen,
            el cacique utilizó sus poderes y la
            transformó en un ave nocturna.

          </p>

          <br>


          <p>

            Desde entonces, durante las noches,
            su lamento continúa escuchándose entre
            los árboles:

            <strong>
              ¡Gua... jo... jó!
            </strong>

          </p>


        </div>


      </div>


    </div>

  `;


  // ==========================================================
  // BOTÓN AR GUAJOJÓ
  // ==========================================================

  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar-guajojo'
    );


  btnAbrir?.addEventListener(
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

            Aquí agregaremos la historia, modelo 3D
            y experiencia AR del Duende.

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

            Aquí agregaremos la historia y experiencia
            interactiva de La Viudita.

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
          'Un ser ancestral relacionado con la protección del agua.',

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

            Aquí agregaremos la historia, modelo 3D
            y experiencia interactiva del Jichi.

          </p>

        </div>


      </div>


    </div>

  `;

}


// ============================================================
// MOSTRAR SOLO EL MODELO DE LA EXPERIENCIA ACTUAL
// ============================================================

function mostrarSoloModelo(
  tipo
) {

  if (modeloGuajojo) {

    modeloGuajojo.setAttribute(

      'visible',

      tipo ===
      'guajojo'

    );

  }


  if (modeloCarreton) {

    modeloCarreton.setAttribute(

      'visible',

      tipo ===
      'carreton'

    );

  }

}


// ============================================================
// INICIAR REALIDAD AUMENTADA
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
      'Experiencia AR inexistente:',
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


  mostrarSoloModelo(
    tipo
  );


  deshabilitarCaptura();


  actualizarMensajeAR(
    config.mensajeBuscar
  );


  actualizarEstadoTarget(
    '🔎 Preparando reconocimiento...'
  );


  if (textoInstruccionAR) {

    textoInstruccionAR.textContent =
      config.instruccion;

  }


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

    await Promise.resolve(
      sistemaAR.start()
    );


    arActivo =
      true;


    actualizarMensajeAR(
      config.mensajeBuscar
    );


    actualizarEstadoTarget(
      '📷 Apunta hacia la imagen objetivo'
    );


    console.log(

      '✅ MindAR iniciado:',

      tipo

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


    experienciaARActiva =
      null;


    mostrarSoloModelo(
      null
    );


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
// ESPERAR ESCENA A-FRAME
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
  // ENCONTRADO
  // ==========================================================

  target.addEventListener(
    'targetFound',
    () => {


      // Ignorar otros targets
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
        `✅ Target encontrado: ${tipo}`
      );


      targetVisible =
        true;


      actualizarMensajeAR(

        tipo === 'carreton'

          ? '☠️ ¡Encontraste el Carretón!'

          : '🦉 ¡Encontraste al Guajojó!'

      );


      actualizarEstadoTarget(
        '✅ Imagen reconocida'
      );


      if (temporizadorCaptura) {

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
          450
        );


      console.log(
        config.nombre
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


      const config =
        experiencias[
          tipo
        ];


      console.log(
        `Target perdido: ${tipo}`
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
        config.mensajeBuscar
      );


      actualizarEstadoTarget(
        '🔎 Vuelve a enfocar la imagen'
      );

    }
  );

}


// ============================================================
// EVENTOS DE AMBOS TARGETS
// ============================================================

registrarEventosTarget(
  'guajojo',
  targetGuajojo
);


registrarEventosTarget(
  'carreton',
  targetCarreton
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


    if (!experienciaARActiva) {
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
// MODELO GUAJOJÓ
// ============================================================

modeloGuajojo?.addEventListener(
  'model-loaded',
  () => {

    console.log(
      '✅ guajojo.glb cargado'
    );

  }
);


modeloGuajojo?.addEventListener(
  'model-error',
  event => {

    console.error(
      '❌ Error guajojo.glb:',
      event
    );

  }
);


// ============================================================
// MODELO CARRETÓN
// ============================================================

modeloCarreton?.addEventListener(
  'model-loaded',
  () => {

    console.log(
      '✅ carreton.glb cargado'
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


    actualizarMensajeAR(
      '❌ Error cargando el Carretón'
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


  // Guardar antes de cerrar AR
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
  // MOSTRAR CONTENIDO DESBLOQUEADO
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

  const btnAbrir =
    document.getElementById(
      config.botonAbrirId
    );


  if (btnAbrir) {

    btnAbrir.style.display =
      'none';

  }


  // ==========================================================
  // AUDIO SI EXISTE
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


  if (temporizadorCaptura) {


    clearTimeout(
      temporizadorCaptura
    );


    temporizadorCaptura =
      null;

  }


  deshabilitarCaptura();


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


  mostrarSoloModelo(
    null
  );


  if (pantallaAR) {

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
// HABILITAR CAPTURA
// ============================================================

function habilitarCaptura() {


  if (!btnCapturar) {
    return;
  }


  btnCapturar.disabled =
    false;


  if (
    experienciaARActiva ===
    'carreton'
  ) {


    btnCapturar.innerHTML = `

      <span>
        ☠️
      </span>

      CAPTURAR CARRETÓN

    `;


  } else {


    btnCapturar.innerHTML = `

      <span>
        ✨
      </span>

      CAPTURAR

    `;

  }

}


// ============================================================
// DESHABILITAR CAPTURA
// ============================================================

function deshabilitarCaptura() {


  if (!btnCapturar) {
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


    if (!arActivo) {
      return;
    }


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
