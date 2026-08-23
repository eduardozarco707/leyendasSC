import './style.css';


// ============================================================
// DOM PRINCIPAL
// ============================================================

const sidebar =
  document.getElementById('sidebar');

const btnMenu =
  document.getElementById('btn-menu');

const areaTexto =
  document.getElementById('contenido-dinamico');

const botonesLeyenda =
  document.querySelectorAll('.btn-leyenda');


// ============================================================
// AR
// ============================================================

const pantallaAR =
  document.getElementById('pantalla-ar');

const escenaAR =
  document.getElementById('escena-ar');

const mensajeAR =
  document.getElementById('mensaje-ar');

const estadoTarget =
  document.getElementById('estado-target');

const textoInstruccionAR =
  document.getElementById('texto-instruccion-ar');

const btnCapturar =
  document.getElementById('btn-capturar');

const btnCerrarAR =
  document.getElementById('btn-cerrar-ar');


// ============================================================
// CONFIGURACIÓN
// ============================================================

const experiencias = {


  carreton: {

    nombre:
      'Carretón de la Otra Vida',

    icono:
      '☠️',

    archivo:
      '/carreton.glb',

    modeloId:
      'modelo-carreton',

    targetId:
      'target-carreton',

    targetImagen:
      '/carreton-target.jpg',

    botonId:
      'btn-abrir-ar-carreton',

    contenidoId:
      'contenido-capturado-carreton',

    textoBuscar:
      'Busca el Carretón de la Otra Vida',

    textoEncontrado:
      '☠️ ¡Encontraste el Carretón!',

    instruccion:
      'Apunta hacia la imagen del Carretón',

    textoCapturar:
      '☠️ CAPTURAR CARRETÓN'

  },


  guajojo: {

    nombre:
      'Guajojó',

    icono:
      '🦉',

    archivo:
      '/guajojo.glb',

    modeloId:
      'modelo-guajojo',

    targetId:
      'target-guajojo',

    targetImagen:
      '/guajojo-target.jpg',

    botonId:
      'btn-abrir-ar-guajojo',

    contenidoId:
      'contenido-capturado-guajojo',

    audioId:
      'audio-guajojo',

    textoBuscar:
      'Busca al Guajojó',

    textoEncontrado:
      '🦉 ¡Encontraste al Guajojó!',

    instruccion:
      'Apunta hacia la imagen del Guajojó',

    textoCapturar:
      '🦉 CAPTURAR GUAJOJÓ'

  },


  duende: {

    nombre:
      'El Duende',

    icono:
      '🌿',

    archivo:
      '/duende.glb',

    modeloId:
      'modelo-duende',

    targetId:
      'target-duende',

    targetImagen:
      '/duende-target.jpg',

    botonId:
      'btn-abrir-ar-duende',

    contenidoId:
      'contenido-capturado-duende',

    textoBuscar:
      'Busca al Duende',

    textoEncontrado:
      '🌿 ¡Encontraste al Duende!',

    instruccion:
      'Apunta hacia la imagen del Duende',

    textoCapturar:
      '🌿 CAPTURAR DUENDE'

  },


  viudita: {

    nombre:
      'La Viudita',

    icono:
      '🕯️',

    archivo:
      '/viudita.glb',

    modeloId:
      'modelo-viudita',

    targetId:
      'target-viudita',

    targetImagen:
      '/viudita-target.jpg',

    botonId:
      'btn-abrir-ar-viudita',

    contenidoId:
      'contenido-capturado-viudita',

    textoBuscar:
      'Busca a La Viudita',

    textoEncontrado:
      '🕯️ ¡Encontraste a La Viudita!',

    instruccion:
      'Apunta hacia la imagen de La Viudita',

    textoCapturar:
      '🕯️ CAPTURAR VIUDITA'

  },


  jichi: {

    nombre:
      'El Jichi',

    icono:
      '💧',

    archivo:
      '/jichi.glb',

    modeloId:
      'modelo-jichi',

    targetId:
      'target-jichi',

    targetImagen:
      '/jichi-target.jpg',

    botonId:
      'btn-abrir-ar-jichi',

    contenidoId:
      'contenido-capturado-jichi',

    textoBuscar:
      'Busca al Jichi',

    textoEncontrado:
      '💧 ¡Encontraste al Jichi!',

    instruccion:
      'Apunta hacia la imagen del Jichi',

    textoCapturar:
      '💧 CAPTURAR JICHI'

  }

};


// ============================================================
// ESTADO
// ============================================================

let experienciaActiva =
  null;

let arActivo =
  false;

let arIniciando =
  false;

let targetEncontrado =
  false;

let temporizadorCaptura =
  null;


// ============================================================
// MODELOS YA DESCARGADOS
// ============================================================

const modelosCargados = {

  carreton: false,

  guajojo: false,

  duende: false,

  viudita: false,

  jichi: false

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
// SELECCIONAR LEYENDA
// ============================================================

botonesLeyenda.forEach(
  boton => {

    boton.addEventListener(
      'click',
      () => {

        const tipo =
          boton.dataset.legend;


        cerrarCamaraAR();


        marcarActivo(
          boton
        );


        mostrarLeyenda(
          tipo
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

function marcarActivo(
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
// CABECERA
// ============================================================

function crearCabecera(
  tipo
) {

  const datos = {

    carreton: {

      etiqueta:
        'TRADICIÓN ORAL CRUCEÑA',

      titulo:
        'El Carretón de la Otra Vida',

      descripcion:
        'El misterioso chirriar de unas ruedas anunciaba una de las apariciones más temidas de las antiguas noches cruceñas.',

      icono:
        '🛞'

    },


    guajojo: {

      etiqueta:
        'LEYENDA DEL ORIENTE BOLIVIANO',

      titulo:
        'El Guajojó',

      descripcion:
        'Un lamento nocturno que, según la tradición, nació de una historia de amor y tragedia.',

      icono:
        '🌙'

    },


    duende: {

      etiqueta:
        'MISTERIOS DEL MONTE',

      titulo:
        'El Duende',

      descripcion:
        'Un pequeño y travieso personaje del imaginario cruceño, ligado a los montes, los niños y antiguas advertencias familiares.',

      icono:
        '🌿'

    },


    viudita: {

      etiqueta:
        'RELATOS DE LA NOCHE',

      titulo:
        'La Viudita',

      descripcion:
        'Una misteriosa mujer que aparecía durante la noche y acostumbraba burlarse de ciertos trasnochadores.',

      icono:
        '🕯️'

    },


    jichi: {

      etiqueta:
        'GUARDIÁN DE LAS AGUAS',

      titulo:
        'El Jichi',

      descripcion:
        'Un ser sobrenatural asociado a lagunas, pozas y madrejones y a la protección del agua.',

      icono:
        '💧'

    }

  };


  const d =
    datos[tipo];


  return `

    <div class="cabecera-leyenda">

      <div class="titulo-leyenda">

        <span class="sobrelinea">
          ${d.etiqueta}
        </span>

        <h2>
          ${d.titulo}
        </h2>

        <p class="descripcion-leyenda">
          ${d.descripcion}
        </p>

      </div>


      <div class="insignia-leyenda">
        ${d.icono}
      </div>

    </div>


    <div class="barra-leyenda"></div>

  `;

}


// ============================================================
// PANEL AR
// ============================================================

function crearPanelAR(
  tipo
) {

  const config =
    experiencias[tipo];


  return `

    <div class="panel-target">


      <img

        src="${config.targetImagen}"

        class="imagen-target"

        alt="Imagen objetivo de ${config.nombre}"

      >


      <div class="info-target">


        <span class="sobrelinea">
          EXPERIENCIA AR
        </span>


        <h3>
          Encuentra ${config.nombre}
        </h3>


        <p>

          Busca esta imagen con la cámara.

          Cuando el sistema la reconozca,
          el personaje aparecerá en 3D
          sobre ella.

        </p>


        <button

          id="${config.botonId}"

          class="btn-ver-ar"

          type="button"

        >

          📱 INICIAR EXPERIENCIA AR

        </button>


      </div>


    </div>

  `;

}


// ============================================================
// MOSTRAR LEYENDA
// ============================================================

function mostrarLeyenda(
  tipo
) {

  if (!areaTexto) {
    return;
  }


  const config =
    experiencias[tipo];


  areaTexto.innerHTML = `

    <div class="vista-leyenda">


      ${crearCabecera(tipo)}


      ${crearPanelAR(tipo)}


      <div

        id="${config.contenidoId}"

        style="display: none;"

      >

        ${crearContenidoCapturado(tipo)}

      </div>


    </div>

  `;


  document
    .getElementById(
      config.botonId
    )
    ?.addEventListener(
      'click',
      () => {

        iniciarCamaraAR(
          tipo
        );

      }
    );

}


// ============================================================
// CONTENIDO DESBLOQUEADO
// ============================================================

function crearContenidoCapturado(
  tipo
) {

  if (
    tipo === 'guajojo'
  ) {

    return `

      <div class="mensaje-capturado">

        <h3>
          ✨ ¡Guajojó capturado!
        </h3>

        <p>
          Has desbloqueado su historia.
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

          La tradición cuenta que la hija de un
          cacique se enamoró de un joven de su tribu.
          El padre, que además era hechicero,
          desaprobó el romance y llevó al joven
          a la espesura, donde le dio muerte.

        </p>

        <br>

        <p>

          Cuando la muchacha descubrió lo sucedido,
          amenazó con revelar el crimen.

          Su padre la transformó entonces en un ave
          nocturna para impedir que pudiera contar
          lo ocurrido.

        </p>

        <br>

        <p>

          Sin embargo, su voz permaneció en el ave
          y desde entonces su triste lamento continúa
          escuchándose en la selva.

        </p>

      </div>

    `;

  }


 if (
  tipo === 'carreton'
) {

  return `

    <div class="mensaje-capturado">

      <h3>
        ☠️ ¡Carretón capturado!
      </h3>

      <p>
        Has desbloqueado la historia del
        Carretón de la Otra Vida.
      </p>

    </div>


    <div class="historia-leyenda">


      <span class="sobrelinea">
        HISTORIA Y TRADICIÓN ORAL CRUCEÑA
      </span>


      <h3>
        El Carretón de la Otra Vida
      </h3>


      <p>

        Corría el año 1861 y Santa Cruz de la Sierra
        atravesaba uno de los momentos más difíciles
        de su historia.

      </p>


      <br>


      <p>

        Una grave epidemia de viruela se extendía
        entre la población.

        Los conocimientos médicos eran todavía
        limitados y el temor al contagio aumentaba
        cada día.

      </p>


      <br>


      <p>

        Durante aquellas jornadas, un carretón
        recorría las calles transportando enfermos
        y moribundos hacia las afueras de la ciudad,
        en dirección al Lazareto.

      </p>


      <br>


      <p>

        Según los relatos que recuerdan aquella
        época, el paso del vehículo era anunciado
        para que los vecinos permanecieran alejados
        y evitaran exponerse al contagio.

      </p>


      <br>


      <p>

        Las familias cerraban sus puertas y ventanas
        mientras aquel carretón avanzaba por las
        calles de una Santa Cruz golpeada por
        la enfermedad y el miedo.

      </p>


      <br>


      <p>

        Con el paso de los años, aquel recuerdo
        comenzó a mezclarse con la imaginación
        y la tradición oral de los cruceños.

      </p>


      <br>


      <p>

        En las noches oscuras, especialmente durante
        el sur y el chilchi, algunas personas
        aseguraban escuchar nuevamente el chirriar
        de unos ejes y el fuerte restallar
        de un látigo.

      </p>


      <br>


      <p>

        El sonido parecía avanzar lentamente
        por los caminos solitarios.

      </p>


      <br>


      <p>

        También se decía que podía escucharse
        la extraña voz del carretero llamando
        a sus animales.

        Pero aquella voz no parecía pertenecer
        a un ser humano.

      </p>


      <br>


      <p>

        En ocasiones, algún relámpago iluminaba
        la noche durante unos segundos y permitía
        distinguir la silueta de un antiguo
        carretón avanzando entre las sombras.

      </p>


      <br>


      <p>

        Cuentan que una noche un trasnochador
        decidió enfrentarse a la aparición.

      </p>


      <br>


      <p>

        Reuniendo valor, se acercó al misterioso
        vehículo para descubrir qué era aquello
        que recorría los caminos durante la noche.

      </p>


      <br>


      <p>

        Entonces vio algo aterrador.

      </p>


      <br>


      <p>

        El carretón ya no parecía construido
        de madera como uno común.

      </p>


      <br>


      <p>

        Sus estacas parecían ser huesos humanos.

        Tibias, peronés y costillas formaban
        parte de aquella macabra estructura.

      </p>


      <br>


      <p>

        Pero lo más aterrador estaba al frente.

      </p>


      <br>


      <p>

        El carretero no tenía un rostro humano.

        En su lugar había una horrenda calavera
        y, dentro de sus cuencas vacías,
        brillaba un resplandor semejante
        al fuego.

      </p>


      <br>


      <p>

        El hombre perdió inmediatamente todo
        su valor y huyó aterrorizado.

      </p>


      <br>


      <p>

        Desde entonces, el recuerdo de aquel
        carretón relacionado con una época
        de enfermedad y muerte terminó
        transformándose en una de las apariciones
        más temidas de la tradición cruceña.

      </p>


      <br>


      <p>

        Para algunos, aquel vehículo ya no
        transportaba solamente enfermos o muertos.

      </p>


      <br>


      <p>

        Transportaba almas hacia la otra vida.

      </p>


      <br>


      <p>

        Y así, entre la memoria de una epidemia,
        el miedo de las antiguas noches cruceñas
        y la tradición transmitida de generación
        en generación, nació la leyenda de:

      </p>


      <br>


      <p class="frase-final-leyenda">

        <strong>
          El Carretón de la Otra Vida.
        </strong>

      </p>


    </div>

  `;

}

  if (
    tipo === 'jichi'
  ) {

    return `

      <div class="mensaje-capturado">

        <h3>
          💧 ¡Jichi capturado!
        </h3>

        <p>
          Has encontrado al guardián de las aguas.
        </p>

      </div>


      <div class="historia-leyenda">

        <h3>
          El Jichi
        </h3>

        <p>

          Según antiguas tradiciones compartidas por
          pueblos del oriente boliviano, en las lagunas,
          charcos y madrejones podía habitar un ser
          sobrenatural encargado de proteger el agua:
          el Jichi.

        </p>

        <br>

        <p>

          Se lo describía como una criatura extraña,
          con rasgos de culebra y saurio, cuerpo
          alargado y una apariencia que podía
          confundirse con el agua.

        </p>

        <br>

        <p>

          Mientras el Jichi permanecía en su morada,
          el agua se conservaba.

          Pero si se desperdiciaba o se destruían
          las plantas de aquel lugar, el guardián
          podía marcharse.

        </p>

        <br>

        <p>

          Cuando el Jichi abandonaba la laguna,
          el agua comenzaba a disminuir hasta
          terminar por agotarse.

        </p>

      </div>

    `;

  }


  if (
    tipo === 'viudita'
  ) {

    return `

      <div class="mensaje-capturado">

        <h3>
          🕯️ ¡La Viudita capturada!
        </h3>

        <p>
          Has desbloqueado su historia.
        </p>

      </div>


      <div class="historia-leyenda">

        <h3>
          La Viudita
        </h3>

        <p>

          En la tradición cruceña, La Viudita
          no era presentada solamente como una
          aparición aterradora.

          Su atención recaía especialmente sobre
          hombres trasnochadores que buscaban
          conquistas amorosas.

        </p>

        <br>

        <p>

          Bajo una especie de encantamiento,
          el hombre creía acompañarla hacia un
          sitio agradable y confortable.

          Pero al recuperar la conciencia,
          descubría que la realidad era muy distinta.

        </p>

        <br>

        <p>

          Lo que había imaginado como una elegante
          estancia podía resultar ser un matorral
          lleno de espinas, y el cómodo lecho
          en el que creía haber descansado,
          un simple barrial.

        </p>

        <br>

        <p>

          La Viudita desaparecía sin dejar rastro,
          dejando a su víctima únicamente con
          la vergüenza y la lección de aquella noche.

        </p>

      </div>

    `;

  }


  // DUENDE

  return `

    <div class="mensaje-capturado">

      <h3>
        🌿 ¡Duende capturado!
      </h3>

      <p>
        Has desbloqueado su historia.
      </p>

    </div>


    <div class="historia-leyenda">

      <h3>
        El Duende
      </h3>

      <p>

        El Duende forma parte de los relatos
        tradicionales cruceños.

        Se lo describe como un ser pequeño,
        de apariencia infantil y carácter
        travieso, frecuentemente representado
        con ropa clara y un gran sombrero de saó.

      </p>

      <br>

      <p>

        En muchos relatos aparecía cerca de
        montes o lugares apartados y trataba
        de atraer a los niños ofreciéndoles
        dulces, juguetes o invitándolos a jugar.

      </p>

      <br>

      <p>

        También existe la creencia de que
        podía realizar travesuras durante la
        noche, incluyendo trenzar las crines
        de los caballos.

      </p>

      <br>

      <p>

        La leyenda servía además como advertencia
        para que los niños obedecieran a sus
        padres y no se alejaran solos hacia
        lugares desconocidos.

      </p>

    </div>

  `;

}


// ============================================================
// OBTENER MODELO
// ============================================================

function obtenerModelo(
  tipo
) {

  return document.getElementById(
    experiencias[tipo].modeloId
  );

}


// ============================================================
// PREPARAR VISIBILIDAD
// ============================================================

function prepararModelos(
  tipoActivo
) {

  Object.keys(
    experiencias
  ).forEach(
    tipo => {

      const modelo =
        obtenerModelo(tipo);


      if (!modelo) {
        return;
      }


      const visible =
        tipo === tipoActivo;


      modelo.setAttribute(
        'visible',
        visible
      );


      if (
        modelo.object3D
      ) {

        modelo.object3D.visible =
          visible;

      }

    }
  );

}


// ============================================================
// CARGAR MODELO ACTIVO
// ============================================================

function cargarModelo(
  tipo
) {

  const config =
    experiencias[tipo];


  const modelo =
    obtenerModelo(tipo);


  if (!modelo) {

    return Promise.reject(
      new Error(
        `No existe ${config.modeloId}`
      )
    );

  }


  // ==========================================================
  // SI YA SE CARGÓ ANTES
  // ==========================================================

  if (
    modelosCargados[tipo] &&
    modelo.getObject3D('mesh')
  ) {

    prepararModelos(
      tipo
    );


    return Promise.resolve();

  }


  return new Promise(
    (resolve, reject) => {


      let terminado =
        false;


      const listo =
        () => {

          if (terminado) {
            return;
          }


          terminado =
            true;


          modelosCargados[tipo] =
            true;


          modelo.removeEventListener(
            'model-error',
            error
          );


          prepararModelos(
            tipo
          );


          console.log(
            `✅ ${config.archivo} cargado`
          );


          resolve();

        };


      const error =
        evento => {

          if (terminado) {
            return;
          }


          terminado =
            true;


          console.error(
            `❌ Error cargando ${config.archivo}`,
            evento
          );


          reject(
            new Error(
              `No se pudo cargar ${config.archivo}`
            )
          );

        };


      modelo.addEventListener(
        'model-loaded',
        listo,
        {
          once: true
        }
      );


      modelo.addEventListener(
        'model-error',
        error,
        {
          once: true
        }
      );


      // ======================================================
      // ACTIVAMOS GLB SOLO PARA ESTA LEYENDA
      // ======================================================

      modelo.setAttribute(
        'gltf-model',
        config.archivo
      );


      modelo.setAttribute(
        'visible',
        true
      );


      // Timeout de seguridad

      setTimeout(
        () => {

          if (
            !terminado &&
            modelo.getObject3D('mesh')
          ) {

            listo();

          }

        },
        15000
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
    experiencias[tipo];


  if (
    !config ||
    !escenaAR ||
    !pantallaAR
  ) {

    return;

  }


  arIniciando =
    true;


  experienciaActiva =
    tipo;


  targetEncontrado =
    false;


  deshabilitarCaptura();


  prepararModelos(
    tipo
  );


  pantallaAR.style.display =
    'block';


  actualizarMensaje(
    `⏳ Cargando ${config.nombre}...`
  );


  actualizarEstado(
    'Preparando modelo 3D'
  );


  textoInstruccionAR.textContent =
    config.instruccion;


  try {


    // ========================================================
    // CARGAR GLB
    // ========================================================

    await cargarModelo(
      tipo
    );


    actualizarEstado(
      '✅ Modelo 3D preparado'
    );


    await esperar(
      60
    );


    window.dispatchEvent(
      new Event('resize')
    );


    await esperarEscena();


    const sistema =
      escenaAR.systems[
        'mindar-image-system'
      ];


    if (!sistema) {

      throw new Error(
        'MindAR no se inicializó correctamente.'
      );

    }


    prepararModelos(
      tipo
    );


    await Promise.resolve(
      sistema.start()
    );


    arActivo =
      true;


    prepararModelos(
      tipo
    );


    actualizarMensaje(
      config.textoBuscar
    );


    actualizarEstado(
      '📷 Apunta hacia la imagen objetivo'
    );


  } catch (error) {


    console.error(
      error
    );


    alert(
      'No se pudo iniciar la experiencia AR.\n\n' +
      error.message
    );


    pantallaAR.style.display =
      'none';


    arActivo =
      false;


    experienciaActiva =
      null;


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
    resolve =>
      setTimeout(
        resolve,
        tiempo
      )
  );

}


// ============================================================
// ESPERAR A-FRAME
// ============================================================

function esperarEscena() {

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
        resolve,
        {
          once: true
        }
      );

    }
  );

}


// ============================================================
// EVENTOS DE TARGET
// ============================================================

Object.keys(
  experiencias
).forEach(
  tipo => {


    const config =
      experiencias[tipo];


    const target =
      document.getElementById(
        config.targetId
      );


    if (!target) {
      return;
    }


    // ========================================================
    // ENCONTRADO
    // ========================================================

    target.addEventListener(
      'targetFound',
      () => {


        console.log(
          `🎯 Detectado: ${tipo}`
        );


        if (
          experienciaActiva !== tipo
        ) {

          return;

        }


        targetEncontrado =
          true;


        prepararModelos(
          tipo
        );


        actualizarMensaje(
          config.textoEncontrado
        );


        actualizarEstado(
          '✅ Imagen reconocida · modelo 3D visible'
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
                targetEncontrado &&
                experienciaActiva === tipo
              ) {

                habilitarCaptura(
                  config
                );

              }

            },
            350
          );

      }
    );


    // ========================================================
    // PERDIDO
    // ========================================================

    target.addEventListener(
      'targetLost',
      () => {


        if (
          experienciaActiva !== tipo
        ) {

          return;

        }


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


        actualizarMensaje(
          config.textoBuscar
        );


        actualizarEstado(
          '🔎 Vuelve a enfocar la imagen'
        );

      }
    );

  }
);


// ============================================================
// CAPTURAR
// ============================================================

btnCapturar?.addEventListener(
  'click',
  capturar
);


function capturar() {

  if (
    !experienciaActiva ||
    !targetEncontrado ||
    btnCapturar.disabled
  ) {

    return;

  }


  const tipo =
    experienciaActiva;


  const config =
    experiencias[tipo];


  cerrarCamaraAR();


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


  prepararModelos(
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
// UI
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
    config.textoCapturar;

}


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
// CERRAR AL SALIR
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
