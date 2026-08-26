import './style.css';
import './chat.css';

// ============================================================
// ELEMENTOS PRINCIPALES
// ============================================================

const sidebar = document.getElementById('sidebar');
const btnMenu = document.getElementById('btn-menu');
const areaTexto = document.getElementById('contenido-dinamico');
const botonesLeyenda = document.querySelectorAll('.btn-leyenda');

// ============================================================
// ELEMENTOS AR
// ============================================================

const pantallaAR = document.getElementById('pantalla-ar');
const escenaAR = document.getElementById('escena-ar');
const mensajeAR = document.getElementById('mensaje-ar');
const estadoTarget = document.getElementById('estado-target');
const textoInstruccionAR = document.getElementById('texto-instruccion-ar');
const btnCapturar = document.getElementById('btn-capturar');
const btnCerrarAR = document.getElementById('btn-cerrar-ar');

// ============================================================
// IDIOMAS DEL AUDIOLIBRO
// ============================================================

const idiomas = {
  es: { nombre: 'Español', bandera: '🇧🇴' },
  en: { nombre: 'English', bandera: '🇺🇸' },
  pt: { nombre: 'Português', bandera: '🇧🇷' },
  de: { nombre: 'Deutsch', bandera: '🇩🇪' }
};

// ============================================================
// CONFIGURACIÓN DE LEYENDAS
// ============================================================

const experiencias = {
  carreton: {
    nombre: 'El Carretón de la Otra Vida',
    nombreCorto: 'El Carretón',
    emoji: '☠️',
    archivo: '/carreton.glb',
    modeloId: 'modelo-carreton',
    targetId: 'target-carreton',
    targetImagen: '/carreton-target.jpg',
    botonId: 'btn-abrir-ar-carreton',
    contenidoId: 'contenido-capturado-carreton',
    textoBuscar: 'Busca el Carretón de la Otra Vida',
    textoEncontrado: '☠️ ¡Encontraste el Carretón!',
    instruccion: 'Apunta hacia la imagen del Carretón',
    textoCapturar: '☠️ CAPTURAR CARRETÓN',
    etiqueta: 'HISTORIA Y TRADICIÓN ORAL CRUCEÑA',
    titulo: 'El Carretón de la Otra Vida',
    descripcion: 'Una antigua aparición cruceña cuyo origen se relaciona con el recuerdo de las epidemias, la muerte y los carretones que recorrían Santa Cruz durante el siglo XIX.',
    icono: '🛞',
    saludoChat: 'Soy El Carretón de la Otra Vida. Puedes preguntarme sobre mi leyenda, mis apariciones y mi relación con las antiguas epidemias de Santa Cruz.',
    imagenChat: null
  },

  guajojo: {
    nombre: 'El Guajojó',
    nombreCorto: 'El Guajojó',
    emoji: '🪶',
    archivo: '/guajojo.glb',
    modeloId: 'modelo-guajojo',
    targetId: 'target-guajojo',
    targetImagen: '/guajojo-target.jpg',
    botonId: 'btn-abrir-ar-guajojo',
    contenidoId: 'contenido-capturado-guajojo',
    textoBuscar: 'Busca al Guajojó',
    textoEncontrado: '🦉 ¡Encontraste al Guajojó!',
    instruccion: 'Apunta hacia la imagen del Guajojó',
    textoCapturar: '🦉 CAPTURAR GUAJOJÓ',
    etiqueta: 'LEYENDA DEL ORIENTE BOLIVIANO',
    titulo: 'El Guajojó',
    descripcion: 'Un lamento nocturno que, según la tradición, nació de una historia de amor y tragedia.',
    icono: '🌙',
    saludoChat: 'Soy El Guajojó. Puedes preguntarme sobre mi historia, mi transformación, mi amado o el origen de mi triste canto.',
    imagenChat: null
  },

  duende: {
    nombre: 'El Duende',
    nombreCorto: 'El Duende',
    emoji: '🌿',
    archivo: '/duende.glb',
    modeloId: 'modelo-duende',
    targetId: 'target-duende',
    targetImagen: '/duende-target.jpg',
    botonId: 'btn-abrir-ar-duende',
    contenidoId: 'contenido-capturado-duende',
    textoBuscar: 'Busca al Duende',
    textoEncontrado: '🌿 ¡Encontraste al Duende!',
    instruccion: 'Apunta hacia la imagen del Duende',
    textoCapturar: '🌿 CAPTURAR DUENDE',
    etiqueta: 'MISTERIOS DEL MONTE',
    titulo: 'El Duende',
    descripcion: 'Un pequeño y misterioso personaje relacionado con los montes y las antiguas advertencias familiares.',
    icono: '🌿',
    saludoChat: 'Soy El Duende. Puedes preguntarme sobre mis travesuras, el monte, los niños, mi sombrero de saó o las crines de los caballos.',
    imagenChat: null
  },

  viudita: {
    nombre: 'La Viudita',
    nombreCorto: 'La Viudita',
    emoji: '🕯️',
    archivo: '/viudita.glb',
    modeloId: 'modelo-viudita',
    targetId: 'target-viudita',
    targetImagen: '/viudita-target.jpg',
    botonId: 'btn-abrir-ar-viudita',
    contenidoId: 'contenido-capturado-viudita',
    textoBuscar: 'Busca a La Viudita',
    textoEncontrado: '🕯️ ¡Encontraste a La Viudita!',
    instruccion: 'Apunta hacia la imagen de La Viudita',
    textoCapturar: '🕯️ CAPTURAR VIUDITA',
    etiqueta: 'RELATOS DE LA NOCHE',
    titulo: 'La Viudita',
    descripcion: 'Una misteriosa mujer que aparecía durante las antiguas noches cruceñas y encantaba a ciertos trasnochadores.',
    icono: '🕯️',
    saludoChat: 'Soy La Viudita. Puedes preguntarme sobre mis apariciones, los trasnochadores, mis encantamientos o las antiguas noches cruceñas.',
    imagenChat: null
  },

  jichi: {
    nombre: 'El Jichi',
    nombreCorto: 'El Jichi',
    emoji: '💧',
    archivo: '/jichi.glb',
    modeloId: 'modelo-jichi',
    targetId: 'target-jichi',
    targetImagen: '/jichi-target.jpg',
    botonId: 'btn-abrir-ar-jichi',
    contenidoId: 'contenido-capturado-jichi',
    textoBuscar: 'Busca al Jichi',
    textoEncontrado: '💧 ¡Encontraste al Jichi!',
    instruccion: 'Apunta hacia la imagen del Jichi',
    textoCapturar: '💧 CAPTURAR JICHI',
    etiqueta: 'GUARDIÁN DE LAS AGUAS',
    titulo: 'El Jichi',
    descripcion: 'Un misterioso ser sobrenatural asociado a lagunas, pozas y madrejones y a la protección del agua.',
    icono: '💧',
    saludoChat: 'Soy El Jichi. Puedes preguntarme sobre las aguas que protejo, mi apariencia, las lagunas o el cuidado de la naturaleza.',
    imagenChat: null
  }
};

// ============================================================
// HISTORIAS
// ============================================================

const historias = {
  carreton: {
    titulo: 'El Carretón de la Otra Vida',
    sobrelinea: 'HISTORIA Y TRADICIÓN ORAL CRUCEÑA',
    parrafos: [
      'Corría el año 1861 y Santa Cruz de la Sierra atravesaba uno de los momentos más difíciles de su historia.',
      'Una grave epidemia de viruela se extendía entre la población. Los conocimientos médicos eran todavía limitados y el temor al contagio aumentaba cada día.',
      'Durante aquellas jornadas, un carretón recorría las calles transportando enfermos y moribundos hacia las afueras de la ciudad, en dirección al Lazareto.',
      'Según los relatos que recuerdan aquella época, el paso del vehículo era anunciado para que los vecinos permanecieran alejados y evitaran exponerse al contagio.',
      'Las familias cerraban sus puertas y ventanas mientras aquel carretón avanzaba por las calles de una Santa Cruz golpeada por la enfermedad y el miedo.',
      'Con el paso de los años, aquel recuerdo comenzó a mezclarse con la imaginación y la tradición oral de los cruceños.',
      'En las noches oscuras, especialmente durante el sur y el chilchi, algunas personas aseguraban escuchar nuevamente el chirriar de unos ejes y el fuerte restallar de un látigo.',
      'El sonido parecía avanzar lentamente por los caminos solitarios.',
      'También se decía que podía escucharse la extraña voz del carretero llamando a sus animales. Pero aquella voz no parecía pertenecer a un ser humano.',
      'En ocasiones, algún relámpago iluminaba la noche durante unos segundos y permitía distinguir la silueta de un antiguo carretón avanzando entre las sombras.',
      'Cuentan que una noche un trasnochador decidió enfrentarse a la aparición.',
      'Reuniendo valor, se acercó al misterioso vehículo para descubrir qué era aquello que recorría los caminos durante la noche.',
      'Entonces vio algo aterrador.',
      'El carretón ya no parecía construido de madera como uno común.',
      'Sus estacas parecían ser huesos humanos. Tibias, peronés y costillas formaban parte de aquella macabra estructura.',
      'Pero lo más aterrador estaba al frente.',
      'El carretero no tenía un rostro humano. En su lugar había una horrenda calavera y, dentro de sus cuencas vacías, brillaba un resplandor semejante al fuego.',
      'El hombre perdió inmediatamente todo su valor y huyó aterrorizado.',
      'Desde entonces, el recuerdo de aquel carretón relacionado con una época de enfermedad y muerte terminó transformándose en una de las apariciones más temidas de la tradición cruceña.',
      'Para algunos, aquel vehículo ya no transportaba solamente enfermos o muertos.',
      'Transportaba almas hacia la otra vida.',
      'Y así, entre la memoria de una epidemia, el miedo de las antiguas noches cruceñas y la tradición transmitida de generación en generación, nació la leyenda de El Carretón de la Otra Vida.'
    ]
  },

  guajojo: {
    titulo: 'La Leyenda del Guajojó',
    parrafos: [
      'Cuenta la tradición que hace muchos años, en las tierras del oriente boliviano, la hija de un cacique se enamoró profundamente de un joven de su tribu.',
      'Sin embargo, su padre desaprobaba aquella relación.',
      'El cacique, que además poseía poderes de hechicero, decidió terminar con aquel romance. Engañó al joven y lo llevó hasta la espesura de la selva, donde acabó con su vida.',
      'Cuando la muchacha descubrió lo sucedido, quedó destrozada por el dolor.',
      'Furiosa, enfrentó a su padre y amenazó con contar a todos los habitantes de la tribu el terrible crimen que había cometido.',
      'El cacique, temiendo que su hija revelara la verdad, utilizó sus poderes y la transformó en un ave nocturna.',
      'Pero hubo algo que el hechicero no pudo quitarle: su voz.',
      'Desde entonces, durante las noches silenciosas del bosque, puede escucharse el triste lamento de aquella joven transformada en ave.',
      'Un canto profundo y melancólico que parece repetir entre los árboles: <strong>¡Gua... jo... jó!</strong>'
    ],
    extra: `
      <div class="multimedia-leyenda">
        <div class="reproductor-leyenda">
          <span class="sobrelinea">SONIDO DEL GUAJOJÓ</span>
          <h3>Escucha su canto</h3>
          <audio controls preload="metadata" src="/audio-guajojo.mp3"></audio>
        </div>

        <img
          src="/foto-guajojo.jpg"
          class="foto-leyenda"
          alt="Guajojó"
        >
      </div>
    `
  },

  duende: {
    titulo: 'La Leyenda del Duende',
    parrafos: [
      'El Duende forma parte de los antiguos relatos tradicionales cruceños.',
      'Se lo describe como un ser pequeño, de apariencia infantil y carácter travieso. En muchos relatos aparece vestido con ropa clara y cubierto por un gran sombrero de saó.',
      'Se decía que habitaba cerca de los montes, caminos solitarios y lugares apartados.',
      'Una de sus travesuras favoritas consistía en acercarse a los niños cuando estos se alejaban demasiado de sus casas.',
      'El Duende trataba de ganarse su confianza ofreciéndoles dulces, juguetes o invitándolos a jugar.',
      'Por esta razón, los mayores advertían a los niños que nunca debían seguir a un desconocido ni internarse solos en el monte.',
      'También existía la creencia de que, durante la noche, podía ingresar a corrales y establos.',
      'A la mañana siguiente, los propietarios encontraban las crines y las colas de sus caballos cuidadosamente trenzadas.',
      'Algunos aseguraban que aquellas trenzas eran una señal inequívoca de que el Duende había visitado el lugar.'
    ]
  },

  viudita: {
    titulo: 'La Leyenda de La Viudita',
    parrafos: [
      'En las antiguas noches de Santa Cruz se contaba la historia de una misteriosa mujer conocida como La Viudita.',
      'No era simplemente una aparición aterradora.',
      'La tradición decía que solía aparecer especialmente ante hombres trasnochadores, parranderos o aquellos que recorrían las calles durante la noche buscando conquistas amorosas.',
      'En medio de la oscuridad aparecía una misteriosa mujer.',
      'Su presencia resultaba irresistible para quien la encontraba.',
      'Bajo una especie de encantamiento, el hombre aceptaba acompañarla sin sospechar lo que estaba a punto de suceder.',
      'Creía caminar junto a ella hacia un lugar agradable, elegante y confortable.',
      'Todo parecía perfecto.',
      'Pero el encantamiento no duraba para siempre.',
      'Cuando finalmente recuperaba la conciencia, descubría que la realidad era completamente diferente.',
      'Aquello que había imaginado como una elegante estancia podía ser simplemente un matorral lleno de espinas.',
      'El cómodo lecho donde creía haber descansado podía resultar ser un barrial, un terreno abandonado o cualquier lugar desagradable.',
      'Y de aquella misteriosa mujer ya no quedaba ninguna señal.',
      'La Viudita había desaparecido sin dejar rastro.'
    ]
  },

  jichi: {
    titulo: 'La Leyenda del Jichi',
    parrafos: [
      'Según antiguas tradiciones compartidas por pueblos del oriente boliviano, las lagunas, pozas, charcos y madrejones no eran solamente depósitos de agua.',
      'En algunos de ellos podía habitar un misterioso ser sobrenatural conocido como el Jichi.',
      'El Jichi era considerado el guardián de las aguas.',
      'Se lo describía como una criatura extraña, difícil de comparar con cualquier animal conocido.',
      'Su cuerpo era alargado, con características que recordaban a una enorme culebra y, al mismo tiempo, a un saurio.',
      'Su apariencia podía confundirse con el agua, haciendo muy difícil poder observarlo.',
      'Mientras el Jichi permanecía en su morada, el agua se conservaba.',
      'Por esta razón, las personas debían respetar el lugar donde habitaba. No debían desperdiciar el agua ni destruir la vegetación que crecía alrededor de la laguna.',
      'Si las personas abusaban de aquellos recursos o destruían su entorno, el Jichi podía molestarse.',
      'Entonces el guardián abandonaba su morada.',
      'Después de su partida, el nivel del agua comenzaba lentamente a disminuir hasta terminar por agotarse.',
      'De generación en generación quedó una sencilla advertencia:',
      '<strong>Mientras el Jichi permanezca, el agua permanecerá. Pero si el Jichi se marcha, el agua también.</strong>'
    ]
  }
};

// ============================================================
// ESTADO AR
// ============================================================

let experienciaActiva = null;
let arActivo = false;
let arIniciando = false;
let targetEncontrado = false;
let temporizadorCaptura = null;

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

btnMenu?.addEventListener('click', () => {
  sidebar?.classList.toggle('abierto');
});

botonesLeyenda.forEach((boton) => {
  boton.addEventListener('click', () => {
    const tipo = boton.dataset.legend;

    cerrarCamaraAR();
    cerrarChat();
    marcarActivo(boton);
    mostrarLeyenda(tipo);

    if (window.innerWidth <= 768) {
      sidebar?.classList.remove('abierto');
    }
  });
});

function marcarActivo(seleccionado) {
  botonesLeyenda.forEach((boton) => {
    boton.classList.remove('activo');
  });

  seleccionado.classList.add('activo');
}

// ============================================================
// CABECERA
// ============================================================

function crearCabecera(tipo) {
  const d = experiencias[tipo];

  return `
    <div class="cabecera-leyenda">
      <div class="titulo-leyenda">
        <span class="sobrelinea">${d.etiqueta}</span>
        <h2>${d.titulo}</h2>
        <p class="descripcion-leyenda">${d.descripcion}</p>
      </div>

      <div class="insignia-leyenda">${d.icono}</div>
    </div>

    <div class="barra-leyenda"></div>
  `;
}

// ============================================================
// PANEL AR
// ============================================================

function crearPanelAR(tipo) {
  const config = experiencias[tipo];

  return `
    <div class="panel-target">
      <img
        src="${config.targetImagen}"
        class="imagen-target"
        alt="Imagen objetivo de ${config.nombre}"
      >

      <div class="info-target">
        <span class="sobrelinea">EXPERIENCIA AR</span>

        <h3>Encuentra ${config.nombre}</h3>

        <p>
          Busca esta imagen con la cámara.
          Cuando sea reconocida, el personaje aparecerá en 3D.
          Captúralo para desbloquear su historia y audiolibro.
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
// AUDIOLIBRO
// ============================================================

function crearAudiolibro(tipo) {
  const config = experiencias[tipo];

  return `
    <div class="audiolibro">

      <div class="cabecera-audiolibro">
        <div class="icono-audiolibro">🎧</div>

        <div>
          <span class="sobrelinea">AUDIOLIBRO MULTILINGÜE</span>
          <h3>${config.nombre}</h3>
          <p>Escucha la leyenda en el idioma que prefieras.</p>
        </div>
      </div>

      <div class="selector-idiomas">

        ${Object.entries(idiomas)
          .map(
            ([codigo, info]) => `
              <button
                class="btn-idioma ${codigo === 'es' ? 'activo' : ''}"
                type="button"
                data-audio-lang="${codigo}"
                data-audio-tipo="${tipo}"
              >
                <span class="bandera-idioma">${info.bandera}</span>
                <span>${info.nombre}</span>
              </button>
            `
          )
          .join('')}

      </div>

      <div class="reproductor-audiolibro">

        <div class="idioma-reproduccion">
          <span>🎙️ Narración:</span>

          <strong id="idioma-audio-${tipo}">
            🇧🇴 Español
          </strong>
        </div>

        <audio
          id="audiolibro-${tipo}"
          class="audio-leyenda"
          src="/audio/es/${tipo}.mp3"
          controls
          preload="metadata"
        >
          Tu navegador no soporta reproducción de audio.
        </audio>

      </div>

    </div>
  `;
}

// ============================================================
// BOTÓN DE CHAT DEBAJO DEL AUDIOLIBRO
// ============================================================

function crearBotonChat(tipo) {
  const config = experiencias[tipo];

  return `
    <div class="zona-boton-chat">

      <button
        id="btn-chat-${tipo}"
        class="btn-chat-leyenda"
        type="button"
        aria-label="Conversar con ${config.nombre}"
        title="Conversar con ${config.nombre}"
      >

        <svg
          class="icono-chat-leyenda"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5a8.5 8.5 0 0 1 4.7-7.6A8.38 8.38 0 0 1 12.5 3h.5A8.48 8.48 0 0 1 21 11v.5z"
          ></path>
        </svg>

        <span>CHAT</span>

      </button>

    </div>
  `;
}

// ============================================================
// CONTENIDO DESBLOQUEADO
// ============================================================

function crearContenidoCapturado(tipo) {
  const config = experiencias[tipo];
  const historia = historias[tipo];

  const tituloCaptura =
    tipo === 'viudita'
      ? '🕯️ ¡La Viudita capturada!'
      : `${config.emoji} ¡${config.nombreCorto
          .replace('El ', '')
          .replace('La ', '')} capturado!`;

  const parrafos = historia.parrafos
    .map((texto) => `<p>${texto}</p>`)
    .join('<br>');

  return `
    <div class="mensaje-capturado">
      <h3>${tituloCaptura}</h3>
      <p>Has desbloqueado su historia y audiolibro.</p>
    </div>

    ${crearAudiolibro(tipo)}

    ${crearBotonChat(tipo)}

    <div class="historia-leyenda">

      ${
        historia.sobrelinea
          ? `<span class="sobrelinea">${historia.sobrelinea}</span>`
          : ''
      }

      <h3>${historia.titulo}</h3>

      ${parrafos}

    </div>

    ${historia.extra || ''}
  `;
}

// ============================================================
// MOSTRAR LEYENDA
// ============================================================

function mostrarLeyenda(tipo) {
  if (!areaTexto || !experiencias[tipo]) {
    return;
  }

  const config = experiencias[tipo];

  areaTexto.innerHTML = `
    <div class="vista-leyenda">

      ${crearCabecera(tipo)}

      ${crearPanelAR(tipo)}

      <div
        id="${config.contenidoId}"
        style="display:none"
      >
        ${crearContenidoCapturado(tipo)}
      </div>

    </div>
  `;

  document
    .getElementById(config.botonId)
    ?.addEventListener('click', () => {
      iniciarCamaraAR(tipo);
    });

  configurarAudiolibro(tipo);

  document
    .getElementById(`btn-chat-${tipo}`)
    ?.addEventListener('click', () => {
      abrirChat(tipo);
    });
}

// ============================================================
// CONFIGURAR AUDIOLIBRO
// ============================================================

function configurarAudiolibro(tipo) {
  const audio = document.getElementById(`audiolibro-${tipo}`);
  const indicador = document.getElementById(`idioma-audio-${tipo}`);
  const botones = document.querySelectorAll(
    `[data-audio-tipo="${tipo}"]`
  );

  if (!audio || !botones.length) {
    return;
  }

  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      const idioma = boton.dataset.audioLang;

      if (!idiomas[idioma]) {
        return;
      }

      const estabaReproduciendo = !audio.paused;

      botones.forEach((otro) => {
        otro.classList.remove('activo');
      });

      boton.classList.add('activo');

      audio.pause();
      audio.src = `/audio/${idioma}/${tipo}.mp3`;
      audio.load();

      if (indicador) {
        indicador.textContent =
          `${idiomas[idioma].bandera} ${idiomas[idioma].nombre}`;
      }

      if (estabaReproduciendo) {
        audio.play().catch(() => {});
      }

      console.log(`🎧 ${tipo} → ${idioma}`);
    });
  });

  audio.addEventListener('error', () => {
    console.error('❌ No se pudo cargar:', audio.src);
  });
}

// ============================================================
// MODELOS 3D
// ============================================================

function obtenerModelo(tipo) {
  return document.getElementById(
    experiencias[tipo].modeloId
  );
}

function prepararModelos(tipoActivo) {
  Object.keys(experiencias).forEach((tipo) => {
    const modelo = obtenerModelo(tipo);

    if (!modelo) {
      return;
    }

    const visible = tipo === tipoActivo;

    modelo.setAttribute('visible', visible);

    if (modelo.object3D) {
      modelo.object3D.visible = visible;
    }
  });
}

// ============================================================
// CARGAR MODELO
// ============================================================

function cargarModelo(tipo) {
  const config = experiencias[tipo];
  const modelo = obtenerModelo(tipo);

  if (!modelo) {
    return Promise.reject(
      new Error(`No existe ${config.modeloId}`)
    );
  }

  if (
    modelosCargados[tipo] &&
    modelo.getObject3D('mesh')
  ) {
    prepararModelos(tipo);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    let terminado = false;

    const listo = () => {
      if (terminado) {
        return;
      }

      terminado = true;
      modelosCargados[tipo] = true;

      prepararModelos(tipo);

      console.log(`✅ Modelo cargado: ${tipo}`);

      resolve();
    };

    const error = (evento) => {
      if (terminado) {
        return;
      }

      terminado = true;

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
      { once: true }
    );

    modelo.addEventListener(
      'model-error',
      error,
      { once: true }
    );

    modelo.setAttribute(
      'gltf-model',
      config.archivo
    );

    modelo.setAttribute(
      'visible',
      true
    );

    setTimeout(() => {
      if (
        !terminado &&
        modelo.getObject3D('mesh')
      ) {
        listo();
      }
    }, 15000);
  });
}

// ============================================================
// INICIAR AR
// ============================================================

async function iniciarCamaraAR(tipo) {
  if (arActivo || arIniciando) {
    return;
  }

  const config = experiencias[tipo];

  if (
    !config ||
    !escenaAR ||
    !pantallaAR
  ) {
    return;
  }

  arIniciando = true;
  experienciaActiva = tipo;
  targetEncontrado = false;

  deshabilitarCaptura();
  prepararModelos(tipo);

  pantallaAR.style.display = 'block';

  actualizarMensaje(
    `⏳ Cargando ${config.nombre}...`
  );

  actualizarEstado(
    'Preparando modelo 3D'
  );

  if (textoInstruccionAR) {
    textoInstruccionAR.textContent =
      config.instruccion;
  }

  try {
    await cargarModelo(tipo);

    actualizarEstado(
      '✅ Modelo 3D preparado'
    );

    await esperar(60);

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

    prepararModelos(tipo);

    await Promise.resolve(
      sistema.start()
    );

    arActivo = true;

    prepararModelos(tipo);

    actualizarMensaje(
      config.textoBuscar
    );

    actualizarEstado(
      '📷 Apunta hacia la imagen objetivo'
    );
  } catch (error) {
    console.error(error);

    alert(
      'No se pudo iniciar la experiencia AR.\n\n' +
      error.message
    );

    pantallaAR.style.display = 'none';
    arActivo = false;
    experienciaActiva = null;
  } finally {
    arIniciando = false;
  }
}

function esperar(tiempo) {
  return new Promise((resolve) => {
    setTimeout(resolve, tiempo);
  });
}

function esperarEscena() {
  return new Promise((resolve) => {
    if (escenaAR?.hasLoaded) {
      resolve();
      return;
    }

    escenaAR?.addEventListener(
      'loaded',
      resolve,
      { once: true }
    );
  });
}

// ============================================================
// TARGETS
// ============================================================

Object.keys(experiencias).forEach((tipo) => {
  const config = experiencias[tipo];

  const target =
    document.getElementById(
      config.targetId
    );

  if (!target) {
    return;
  }

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

      targetEncontrado = true;

      prepararModelos(tipo);

      actualizarMensaje(
        config.textoEncontrado
      );

      actualizarEstado(
        '✅ Imagen reconocida · modelo 3D visible'
      );

      if (temporizadorCaptura) {
        clearTimeout(
          temporizadorCaptura
        );
      }

      temporizadorCaptura =
        setTimeout(() => {
          if (
            targetEncontrado &&
            experienciaActiva === tipo
          ) {
            habilitarCaptura(
              config
            );
          }
        }, 350);
    }
  );

  target.addEventListener(
    'targetLost',
    () => {
      if (
        experienciaActiva !== tipo
      ) {
        return;
      }

      targetEncontrado = false;

      if (temporizadorCaptura) {
        clearTimeout(
          temporizadorCaptura
        );

        temporizadorCaptura = null;
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
});

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
    btnCapturar?.disabled
  ) {
    return;
  }

  const tipo = experienciaActiva;
  const config = experiencias[tipo];

  cerrarCamaraAR();

  const contenido =
    document.getElementById(
      config.contenidoId
    );

  if (contenido) {
    contenido.style.display =
      'block';

    setTimeout(() => {
      contenido.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 200);
  }

  const boton =
    document.getElementById(
      config.botonId
    );

  if (boton) {
    boton.style.display = 'none';
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
  targetEncontrado = false;

  if (temporizadorCaptura) {
    clearTimeout(
      temporizadorCaptura
    );

    temporizadorCaptura = null;
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
      console.warn(error);
    }
  }

  arActivo = false;
  arIniciando = false;
  experienciaActiva = null;

  prepararModelos(null);

  if (pantallaAR) {
    pantallaAR.style.display = 'none';
  }
}

// ============================================================
// UI AR
// ============================================================

function actualizarMensaje(texto) {
  if (mensajeAR) {
    mensajeAR.textContent = texto;
  }
}

function actualizarEstado(texto) {
  if (estadoTarget) {
    estadoTarget.textContent = texto;
  }
}

function habilitarCaptura(config) {
  if (!btnCapturar) {
    return;
  }

  btnCapturar.disabled = false;
  btnCapturar.textContent =
    config.textoCapturar;
}

function deshabilitarCaptura() {
  if (!btnCapturar) {
    return;
  }

  btnCapturar.disabled = true;
  btnCapturar.textContent =
    '👀 Busca la imagen...';
}

// ============================================================
// CHAT CON IA
// ============================================================

const CHAT_API_URL =
  'https://leyendas-sc-xnww.vercel.app/api/chat-leyenda';

const historialesChat = {
  carreton: [],
  guajojo: [],
  duende: [],
  viudita: [],
  jichi: []
};

const idiomasChatInfo = {
  es: {
    nombre: 'Español',
    voz: 'es-BO',
    bandera: '🇧🇴'
  },
  en: {
    nombre: 'English',
    voz: 'en-US',
    bandera: '🇺🇸'
  },
  pt: {
    nombre: 'Português',
    voz: 'pt-BR',
    bandera: '🇧🇷'
  },
  de: {
    nombre: 'Deutsch',
    voz: 'de-DE',
    bandera: '🇩🇪'
  }
};

// Esto es SOLO para el micrófono.
// No cambia con el idioma del audiolibro.

const idiomasMicrofonoChat = {
  carreton: 'es',
  guajojo: 'es',
  duende: 'es',
  viudita: 'es',
  jichi: 'es'
};

let chatTipoActivo = null;
let reconocimientoChat = null;
let reconocimientoChatTipo = null;
let chatEnviando = false;

// ============================================================
// CREAR MODAL DEL CHAT
// ============================================================

function crearInterfazChat() {
  if (
    document.getElementById(
      'chat-modal'
    )
  ) {
    return;
  }

  const modal =
    document.createElement('div');

  modal.id = 'chat-modal';
  modal.className = 'chat-modal';
  modal.hidden = true;

  modal.setAttribute(
    'role',
    'dialog'
  );

  modal.setAttribute(
    'aria-modal',
    'true'
  );

  modal.setAttribute(
    'aria-labelledby',
    'chat-modal-titulo'
  );

  modal.innerHTML = `
    <div class="chat-pantalla">

      <header class="chat-barra-superior">

        <div class="chat-barra-contenido">

          <button
            id="btn-cerrar-chat"
            class="btn-cerrar-chat"
            type="button"
            aria-label="Volver a la leyenda"
          >
            ←
          </button>

          <div class="chat-identidad">

            <div
              id="chat-avatar-superior"
              class="chat-avatar-superior"
              aria-hidden="true"
            >
              🌿
            </div>

            <div class="chat-identidad-texto">
              <span class="chat-sobrelinea">
                EXPERIENCIA INTERACTIVA
              </span>

              <h2 id="chat-modal-titulo">
                Conversa con la leyenda
              </h2>
            </div>

          </div>

          <button
            id="btn-cerrar-chat-x"
            class="btn-cerrar-chat btn-cerrar-chat-x"
            type="button"
            aria-label="Cerrar chat"
          >
            ✕
          </button>

        </div>

      </header>

      <main class="chat-cuerpo">

        <div class="chat-cuerpo-interior">

          <section
            id="chat-mensajes"
            class="chat-mensajes"
            aria-live="polite"
          >
          </section>

          <section class="chat-zona-inferior">

            <div
              id="chat-zona-personaje"
              class="chat-zona-personaje"
            >

              <div
                id="chat-personaje-placeholder"
                class="chat-personaje-placeholder"
              >

                <span
                  id="chat-personaje-emoji"
                  class="chat-personaje-emoji"
                >
                  🌿
                </span>

                <strong
                  id="chat-personaje-nombre"
                >
                  El Duende
                </strong>

                <span class="chat-personaje-aviso">
                  Imagen del personaje
                </span>

              </div>

              <img
                id="chat-personaje-imagen"
                class="chat-personaje-imagen"
                alt=""
                hidden
              >

            </div>

            <div class="chat-compositor">

              <div class="chat-selector-superior">

                <span class="chat-label-secundaria">
                  Idioma del micrófono
                </span>

                <div
                  id="chat-selector-idiomas"
                  class="chat-selector-idiomas"
                >

                  <button
                    class="btn-chat-lang activo"
                    type="button"
                    data-chat-lang="es"
                  >
                    🇧🇴 ES
                  </button>

                  <button
                    class="btn-chat-lang"
                    type="button"
                    data-chat-lang="en"
                  >
                    🇺🇸 EN
                  </button>

                  <button
                    class="btn-chat-lang"
                    type="button"
                    data-chat-lang="pt"
                  >
                    🇧🇷 PT
                  </button>

                  <button
                    class="btn-chat-lang"
                    type="button"
                    data-chat-lang="de"
                  >
                    🇩🇪 DE
                  </button>

                </div>

              </div>

              <label
                id="chat-label-pregunta"
                class="chat-label"
                for="chat-input"
              >
                Pregúntale al personaje
              </label>

              <textarea
                id="chat-input"
                class="chat-input"
                rows="3"
                maxlength="1000"
                placeholder="Escribe tu pregunta..."
              ></textarea>

              <div class="chat-compositor-pie">

                <div
                  id="chat-estado"
                  class="chat-estado"
                  aria-live="polite"
                ></div>

                <div class="chat-acciones">

                  <button
                    id="btn-chat-microfono"
                    class="btn-chat-microfono"
                    type="button"
                    aria-label="Hablar por micrófono"
                  >
                    🎙️
                  </button>

                  <button
                    id="btn-chat-enviar"
                    class="btn-chat-enviar"
                    type="button"
                  >
                    <span>Enviar</span>
                    <span aria-hidden="true">➤</span>
                  </button>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

    </div>
  `;

  document.body.appendChild(modal);

  document
    .getElementById('btn-cerrar-chat')
    ?.addEventListener(
      'click',
      cerrarChat
    );

  document
    .getElementById('btn-cerrar-chat-x')
    ?.addEventListener(
      'click',
      cerrarChat
    );

  document
    .getElementById('btn-chat-enviar')
    ?.addEventListener(
      'click',
      () => {
        enviarPreguntaChat();
      }
    );

  document
    .getElementById('chat-input')
    ?.addEventListener(
      'keydown',
      (evento) => {
        if (
          evento.key === 'Enter' &&
          !evento.shiftKey
        ) {
          evento.preventDefault();
          enviarPreguntaChat();
        }
      }
    );

  document
    .getElementById('btn-chat-microfono')
    ?.addEventListener(
      'click',
      usarMicrofonoChat
    );

  document
    .getElementById('chat-selector-idiomas')
    ?.addEventListener(
      'click',
      (evento) => {
        const boton =
          evento.target.closest(
            '[data-chat-lang]'
          );

        if (
          !boton ||
          !chatTipoActivo
        ) {
          return;
        }

        const idioma =
          boton.dataset.chatLang;

        if (
          !idiomasChatInfo[idioma]
        ) {
          return;
        }

        idiomasMicrofonoChat[
          chatTipoActivo
        ] = idioma;

        renderizarSelectorIdiomaChat(
          chatTipoActivo
        );

        actualizarEstadoChat(
          `Micrófono: ${idiomasChatInfo[idioma].bandera} ${idiomasChatInfo[idioma].nombre}`,
          'aviso'
        );
      }
    );

  document.addEventListener(
    'keydown',
    (evento) => {
      if (
        evento.key === 'Escape' &&
        !modal.hidden
      ) {
        cerrarChat();
      }
    }
  );
}

// ============================================================
// ABRIR / CERRAR CHAT
// ============================================================

function abrirChat(tipo) {
  crearInterfazChat();

  const personaje =
    experiencias[tipo];

  const modal =
    document.getElementById(
      'chat-modal'
    );

  if (!personaje || !modal) {
    return;
  }

  chatTipoActivo = tipo;

  actualizarPersonajeChat(tipo);
  renderizarSelectorIdiomaChat(tipo);
  renderizarChat(tipo);
  pausarAudiosLeyendas();

  if (
    'speechSynthesis' in window
  ) {
    window.speechSynthesis.cancel();
  }

  modal.hidden = false;

  document.body.classList.add(
    'chat-abierto'
  );

  document.body.style.overflow =
    'hidden';

  actualizarDisponibilidadMicrofono();

  setTimeout(() => {
    document
      .getElementById('chat-input')
      ?.focus();
  }, 100);
}

function cerrarChat() {
  const modal =
    document.getElementById(
      'chat-modal'
    );

  if (modal) {
    modal.hidden = true;
  }

  document.body.classList.remove(
    'chat-abierto'
  );

  document.body.style.overflow = '';

  detenerMicrofonoChat();

  if (
    'speechSynthesis' in window
  ) {
    window.speechSynthesis.cancel();
  }
}

// ============================================================
// ACTUALIZAR PERSONAJE
// ============================================================

function actualizarPersonajeChat(tipo) {
  const personaje =
    experiencias[tipo];

  if (!personaje) {
    return;
  }

  const titulo =
    document.getElementById(
      'chat-modal-titulo'
    );

  const avatar =
    document.getElementById(
      'chat-avatar-superior'
    );

  const emoji =
    document.getElementById(
      'chat-personaje-emoji'
    );

  const nombre =
    document.getElementById(
      'chat-personaje-nombre'
    );

  const label =
    document.getElementById(
      'chat-label-pregunta'
    );

  const placeholder =
    document.getElementById(
      'chat-personaje-placeholder'
    );

  const imagen =
    document.getElementById(
      'chat-personaje-imagen'
    );

  if (titulo) {
    titulo.textContent =
      `Conversa con ${personaje.nombre}`;
  }

  if (avatar) {
    avatar.textContent =
      personaje.emoji;
  }

  if (emoji) {
    emoji.textContent =
      personaje.emoji;
  }

  if (nombre) {
    nombre.textContent =
      personaje.nombreCorto;
  }

  if (label) {
    label.textContent =
      `Pregúntale a ${personaje.nombreCorto}`;
  }

  if (
    imagen &&
    placeholder &&
    personaje.imagenChat
  ) {
    imagen.src =
      personaje.imagenChat;

    imagen.alt =
      personaje.nombre;

    imagen.hidden = false;
    placeholder.hidden = true;
  } else {
    if (imagen) {
      imagen.hidden = true;
      imagen.removeAttribute('src');
      imagen.alt = '';
    }

    if (placeholder) {
      placeholder.hidden = false;
    }
  }
}

// ============================================================
// IDIOMA DEL MICRÓFONO
// ============================================================

function renderizarSelectorIdiomaChat(tipo) {
  const idiomaActivo =
    idiomasMicrofonoChat[tipo] ||
    'es';

  document
    .querySelectorAll(
      '.btn-chat-lang'
    )
    .forEach((boton) => {
      boton.classList.toggle(
        'activo',
        boton.dataset.chatLang ===
          idiomaActivo
      );
    });
}

// ============================================================
// RENDERIZAR CHAT
// ============================================================

function renderizarChat(tipo) {
  const contenedor =
    document.getElementById(
      'chat-mensajes'
    );

  const personaje =
    experiencias[tipo];

  if (!contenedor || !personaje) {
    return;
  }

  contenedor.innerHTML = '';

  agregarMensajeVisualChat(
    'assistant',
    personaje.saludoChat,
    false,
    'es'
  );

  historialesChat[tipo].forEach(
    (mensaje) => {
      agregarMensajeVisualChat(
        mensaje.role,
        mensaje.content,
        false,
        mensaje.idioma || 'es'
      );
    }
  );

  desplazarChatAlFinal();
}

// ============================================================
// MENSAJES
// ============================================================

function agregarMensajeVisualChat(
  role,
  texto,
  desplazar = true,
  idiomaMensaje = 'es'
) {
  const personaje =
    experiencias[
      chatTipoActivo
    ];

  const contenedor =
    document.getElementById(
      'chat-mensajes'
    );

  if (
    !personaje ||
    !contenedor ||
    !texto
  ) {
    return;
  }

  const mensaje =
    document.createElement(
      'article'
    );

  mensaje.className =
    role === 'user'
      ? 'chat-mensaje chat-mensaje-usuario'
      : 'chat-mensaje chat-mensaje-personaje';

  const autor =
    document.createElement('div');

  autor.className = 'chat-autor';

  autor.textContent =
    role === 'user'
      ? 'Tú'
      : `${personaje.emoji} ${personaje.nombreCorto}`;

  const burbuja =
    document.createElement('div');

  burbuja.className =
    'chat-burbuja';

  burbuja.textContent = texto;

  mensaje.appendChild(autor);
  mensaje.appendChild(burbuja);

  if (role === 'assistant') {
    const pie =
      document.createElement('div');

    pie.className =
      'chat-mensaje-pie';

    const escuchar =
      document.createElement('button');

    escuchar.className =
      'btn-escuchar-chat';

    escuchar.type = 'button';
    escuchar.textContent =
      '🔊 Escuchar';

    escuchar.addEventListener(
      'click',
      () => {
        leerRespuestaChat(
          texto,
          idiomaMensaje
        );
      }
    );

    pie.appendChild(escuchar);
    mensaje.appendChild(pie);
  }

  contenedor.appendChild(mensaje);

  if (desplazar) {
    desplazarChatAlFinal();
  }
}

// ============================================================
// DETECCIÓN SIMPLE DEL IDIOMA ESCRITO
// ============================================================

function detectarIdiomaPorTexto(
  texto,
  fallback = 'es'
) {
  const original =
    String(texto || '');

  const limpio =
    original
      .toLowerCase()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .trim();

  if (!limpio) {
    return fallback;
  }

  const puntajes = {
    es: 0,
    en: 0,
    pt: 0,
    de: 0
  };

  const vocabulario = {
    es: [
      'que',
      'por que',
      'porque',
      'como',
      'donde',
      'quien',
      'cuando',
      'eres',
      'historia',
      'leyenda',
      'agua',
      'noche',
      'monte',
      'caballos',
      'aparecias',
      'tu',
      'tus'
    ],
    en: [
      'what',
      'why',
      'how',
      'where',
      'who',
      'when',
      'you',
      'your',
      'are',
      'story',
      'legend',
      'water',
      'night',
      'forest',
      'horse',
      'horses'
    ],
    pt: [
      'porque',
      'como',
      'onde',
      'quem',
      'quando',
      'voce',
      'seu',
      'sua',
      'lenda',
      'historia',
      'agua',
      'noite',
      'floresta',
      'cavalo'
    ],
    de: [
      'was',
      'warum',
      'wie',
      'wo',
      'wer',
      'wann',
      'du',
      'dein',
      'deine',
      'bist',
      'geschichte',
      'legende',
      'wasser',
      'nacht',
      'wald',
      'pferd'
    ]
  };

  Object.entries(vocabulario)
    .forEach(
      ([idioma, palabras]) => {
        palabras.forEach(
          (palabra) => {
            const patron =
              new RegExp(
                `(^|\\s|[¿?¡!.,;:])${palabra.replace(
                  / /g,
                  '\\s+'
                )}($|\\s|[¿?¡!.,;:])`,
                'i'
              );

            if (patron.test(limpio)) {
              puntajes[idioma] += 1;
            }
          }
        );
      }
    );

  if (/[¿¡]/.test(original)) {
    puntajes.es += 2;
  }

  if (
    /\b(the|is|did|does|were|was)\b/i.test(
      original
    )
  ) {
    puntajes.en += 2;
  }

  if (
    /\b(der|die|das|und|ist|war)\b/i.test(
      original
    )
  ) {
    puntajes.de += 2;
  }

  if (
    /\b(não|você|vocês|uma|muito)\b/i.test(
      original
    )
  ) {
    puntajes.pt += 2;
  }

  let mejorIdioma = fallback;
  let mejorPuntaje = 0;

  Object.entries(puntajes)
    .forEach(
      ([idioma, puntaje]) => {
        if (puntaje > mejorPuntaje) {
          mejorPuntaje = puntaje;
          mejorIdioma = idioma;
        }
      }
    );

  return mejorPuntaje > 0
    ? mejorIdioma
    : fallback;
}

// ============================================================
// ENVIAR PREGUNTA
// ============================================================

async function enviarPreguntaChat(
  opciones = {}
) {
  if (
    chatEnviando ||
    !chatTipoActivo
  ) {
    return;
  }

  const origen =
    opciones.origen ||
    'texto';

  const idiomaReconocimiento =
    opciones.idiomaReconocimiento ||
    null;

  const autoHablar =
    Boolean(
      opciones.autoHablar
    );

  const tipo = chatTipoActivo;
  const personaje =
    experiencias[tipo];

  const input =
    document.getElementById(
      'chat-input'
    );

  const botonEnviar =
    document.getElementById(
      'btn-chat-enviar'
    );

  const botonMicrofono =
    document.getElementById(
      'btn-chat-microfono'
    );

  if (
    !personaje ||
    !input ||
    !botonEnviar
  ) {
    return;
  }

  const pregunta =
    input.value.trim();

  if (!pregunta) {
    actualizarEstadoChat(
      'Escribe una pregunta antes de enviarla.',
      'aviso'
    );

    input.focus();
    return;
  }

  const fallbackIdioma =
    idiomaReconocimiento ||
    idiomasMicrofonoChat[tipo] ||
    'es';

  const idiomaPregunta =
    detectarIdiomaPorTexto(
      pregunta,
      fallbackIdioma
    );

  const historialParaEnviar =
    historialesChat[tipo]
      .slice(-8)
      .map((mensaje) => ({
        role: mensaje.role,
        content: mensaje.content
      }));

  historialesChat[tipo].push({
    role: 'user',
    content: pregunta,
    idioma: idiomaPregunta
  });

  agregarMensajeVisualChat(
    'user',
    pregunta,
    true,
    idiomaPregunta
  );

  input.value = '';
  chatEnviando = true;
  botonEnviar.disabled = true;

  if (botonMicrofono) {
    botonMicrofono.disabled = true;
  }

  actualizarEstadoChat(
    `${personaje.emoji} ${personaje.nombreCorto} está pensando...`,
    'cargando'
  );

  try {
    const respuesta =
      await fetch(
        CHAT_API_URL,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json'
          },
          body: JSON.stringify({
            leyenda: tipo,
            pregunta,
            historial:
              historialParaEnviar,
            idioma_chat:
              idiomaPregunta,
            origen_chat:
              origen
          })
        }
      );

    let datos = {};

    try {
      datos =
        await respuesta.json();
    } catch {
      // Nada
    }

    if (!respuesta.ok) {
      throw new Error(
        datos.error ||
        `Error ${respuesta.status}`
      );
    }

    const texto =
      String(
        datos.respuesta || ''
      ).trim();

    if (!texto) {
      throw new Error(
        'El personaje no devolvió una respuesta.'
      );
    }

    historialesChat[tipo].push({
      role: 'assistant',
      content: texto,
      idioma: idiomaPregunta
    });

    agregarMensajeVisualChat(
      'assistant',
      texto,
      true,
      idiomaPregunta
    );

    actualizarEstadoChat('', '');

    if (
      autoHablar ||
      origen === 'voz'
    ) {
      leerRespuestaChat(
        texto,
        idiomaPregunta
      );
    }
  } catch (error) {
    console.error(
      '❌ Error en chat:',
      error
    );

    agregarMensajeSistemaChat(
      'No pude comunicarme con el personaje en este momento. Intenta nuevamente.'
    );

    actualizarEstadoChat(
      'Error de conexión con la IA.',
      'error'
    );
  } finally {
    chatEnviando = false;
    botonEnviar.disabled = false;

    actualizarDisponibilidadMicrofono();

    input.focus();
  }
}

// ============================================================
// MENSAJE DEL SISTEMA
// ============================================================

function agregarMensajeSistemaChat(
  texto
) {
  const contenedor =
    document.getElementById(
      'chat-mensajes'
    );

  if (!contenedor) {
    return;
  }

  const mensaje =
    document.createElement('div');

  mensaje.className =
    'chat-mensaje-sistema';

  mensaje.textContent = texto;

  contenedor.appendChild(mensaje);

  desplazarChatAlFinal();
}

function actualizarEstadoChat(
  texto,
  tipo
) {
  const estado =
    document.getElementById(
      'chat-estado'
    );

  if (!estado) {
    return;
  }

  estado.textContent = texto || '';
  estado.className = 'chat-estado';

  if (tipo) {
    estado.classList.add(
      `chat-estado-${tipo}`
    );
  }
}

function desplazarChatAlFinal() {
  requestAnimationFrame(() => {
    const contenedor =
      document.getElementById(
        'chat-mensajes'
      );

    if (contenedor) {
      contenedor.scrollTop =
        contenedor.scrollHeight;
    }
  });
}

function pausarAudiosLeyendas() {
  document
    .querySelectorAll('audio')
    .forEach((audio) => {
      try {
        audio.pause();
      } catch {
        // Nada
      }
    });
}

// ============================================================
// MICRÓFONO
// ============================================================

function actualizarDisponibilidadMicrofono() {
  const boton =
    document.getElementById(
      'btn-chat-microfono'
    );

  if (!boton) {
    return;
  }

  const Reconocimiento =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  boton.disabled =
    !Reconocimiento ||
    chatEnviando;

  boton.title =
    Reconocimiento
      ? 'Hablar por micrófono'
      : 'El reconocimiento de voz no está disponible en este navegador.';
}

function usarMicrofonoChat() {
  if (
    !chatTipoActivo ||
    chatEnviando
  ) {
    return;
  }

  // ==========================================================
  // SI EL PERSONAJE ESTÁ HABLANDO,
  // LO CALLAMOS ANTES DE ENCENDER EL MICRÓFONO
  // ==========================================================

  let estabaHablando = false;

  if (
    'speechSynthesis' in window
  ) {
    estabaHablando =
      window.speechSynthesis.speaking ||
      window.speechSynthesis.pending;

    window.speechSynthesis.cancel();
  }

  const Reconocimiento =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const input =
    document.getElementById(
      'chat-input'
    );

  const boton =
    document.getElementById(
      'btn-chat-microfono'
    );

  if (
    !Reconocimiento ||
    !input ||
    !boton
  ) {
    actualizarEstadoChat(
      'El reconocimiento de voz no está disponible en este navegador.',
      'aviso'
    );

    return;
  }

  if (reconocimientoChat) {
    const mismoTipo =
      reconocimientoChatTipo ===
      chatTipoActivo;

    detenerMicrofonoChat();

    if (mismoTipo) {
      return;
    }
  }

  const tipo =
    chatTipoActivo;

  const idiomaMicrofono =
    idiomasMicrofonoChat[tipo] ||
    'es';

  const configIdioma =
    idiomasChatInfo[
      idiomaMicrofono
    ] ||
    idiomasChatInfo.es;

  const reconocimiento =
    new Reconocimiento();

  reconocimiento.lang =
    configIdioma.voz;

  reconocimiento.interimResults =
    false;

  reconocimiento.continuous =
    false;

  reconocimiento.maxAlternatives =
    1;

  reconocimientoChat =
    reconocimiento;

  reconocimientoChatTipo =
    tipo;

  reconocimiento.onstart =
    () => {
      boton.classList.add(
        'escuchando'
      );

      boton.textContent = '⏹️';

      actualizarEstadoChat(
        `Escuchando en ${configIdioma.bandera} ${configIdioma.nombre}...`,
        'cargando'
      );
    };

  reconocimiento.onresult =
    (evento) => {
      const texto =
        evento
          .results?.[0]?.[0]
          ?.transcript;

      if (!texto) {
        return;
      }

      input.value = texto;

      input.focus();

      input.setSelectionRange(
        input.value.length,
        input.value.length
      );

      // HABLA → SE ESCRIBE → SE ENVÍA →
      // RESPONDE → HABLA AUTOMÁTICAMENTE

      enviarPreguntaChat({
        origen: 'voz',
        idiomaReconocimiento:
          idiomaMicrofono,
        autoHablar: true
      });
    };

  reconocimiento.onerror =
    (evento) => {
      let mensaje =
        'No pude escuchar la pregunta. Intenta nuevamente.';

      if (
        evento.error ===
          'not-allowed' ||
        evento.error ===
          'service-not-allowed'
      ) {
        mensaje =
          'Debes permitir el acceso al micrófono para utilizar esta función.';
      }

      if (
        evento.error ===
        'no-speech'
      ) {
        mensaje =
          'No detecté ninguna voz. Intenta hablar más cerca del micrófono.';
      }

      actualizarEstadoChat(
        mensaje,
        'error'
      );
    };

  reconocimiento.onend =
    () => {
      boton.classList.remove(
        'escuchando'
      );

      boton.textContent = '🎙️';

      if (
        reconocimientoChat ===
        reconocimiento
      ) {
        reconocimientoChat = null;
        reconocimientoChatTipo = null;
      }

      const estado =
        document.getElementById(
          'chat-estado'
        );

      if (
        estado
          ?.classList
          .contains(
            'chat-estado-cargando'
          ) &&
        !chatEnviando
      ) {
        actualizarEstadoChat('', '');
      }
    };

  const iniciarReconocimiento =
    () => {
      try {
        reconocimiento.start();
      } catch (error) {
        console.warn(
          'No se pudo iniciar el micrófono:',
          error
        );
      }
    };

  // En algunos celulares esperamos unas décimas
  // después de callar la voz.

  if (estabaHablando) {
    setTimeout(
      iniciarReconocimiento,
      180
    );
  } else {
    iniciarReconocimiento();
  }
}

function detenerMicrofonoChat() {
  if (reconocimientoChat) {
    try {
      reconocimientoChat.stop();
    } catch {
      // Nada
    }
  }

  reconocimientoChat = null;
  reconocimientoChatTipo = null;

  const boton =
    document.getElementById(
      'btn-chat-microfono'
    );

  if (boton) {
    boton.classList.remove(
      'escuchando'
    );

    boton.textContent = '🎙️';
  }
}

// ============================================================
// LEER RESPUESTA
// ============================================================

function leerRespuestaChat(
  texto,
  idioma = 'es'
) {
  if (
    !(
      'speechSynthesis'
      in window
    )
  ) {
    actualizarEstadoChat(
      'La lectura en voz alta no está disponible en este navegador.',
      'aviso'
    );

    return;
  }

  window.speechSynthesis.cancel();

  const configIdioma =
    idiomasChatInfo[idioma] ||
    idiomasChatInfo.es;

  const utterance =
    new SpeechSynthesisUtterance(
      texto
    );

  utterance.lang =
    configIdioma.voz;

  utterance.rate = 0.96;
  utterance.pitch = 1;

  const voces =
    window.speechSynthesis
      .getVoices();

  const prefijo =
    utterance.lang
      .split('-')[0]
      .toLowerCase();

  const vozCompatible =
    voces.find((voz) =>
      String(voz.lang || '')
        .toLowerCase()
        .startsWith(prefijo)
    );

  if (vozCompatible) {
    utterance.voice =
      vozCompatible;
  }

  window.speechSynthesis.speak(
    utterance
  );
}

// ============================================================
// INICIAR CHAT
// ============================================================

crearInterfazChat();
actualizarDisponibilidadMicrofono();

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

    if (
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel();
    }
  }
);
