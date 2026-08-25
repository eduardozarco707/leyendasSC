import './style.css';
import './chat.css';


// ============================================================
// ELEMENTOS PRINCIPALES
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
// ELEMENTOS AR
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
// IDIOMAS DEL AUDIOLIBRO
// ============================================================

const idiomas = {

  es: {
    nombre: 'Español',
    bandera: '🇧🇴'
  },

  en: {
    nombre: 'English',
    bandera: '🇺🇸'
  },

  pt: {
    nombre: 'Português',
    bandera: '🇧🇷'
  },

  de: {
    nombre: 'Deutsch',
    bandera: '🇩🇪'
  }

};


// ============================================================
// CONFIGURACIÓN DE LAS LEYENDAS
// ============================================================

const experiencias = {


  carreton: {

    nombre:
      'El Carretón de la Otra Vida',

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
      'El Guajojó',

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

let experienciaActiva = null;

let arActivo = false;

let arIniciando = false;

let targetEncontrado = false;

let temporizadorCaptura = null;


// ============================================================
// MODELOS CARGADOS
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

    sidebar?.classList.toggle('abierto');

  }
);


// ============================================================
// BOTONES DEL MENÚ
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
// CABECERA DE CADA LEYENDA
// ============================================================

function crearCabecera(
  tipo
) {

  const datos = {


    carreton: {

      etiqueta:
        'HISTORIA Y TRADICIÓN ORAL CRUCEÑA',

      titulo:
        'El Carretón de la Otra Vida',

      descripcion:
        'Una antigua aparición cruceña cuyo origen se relaciona con el recuerdo de las epidemias, la muerte y los carretones que recorrían Santa Cruz durante el siglo XIX.',

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
        'Un pequeño y misterioso personaje relacionado con los montes y las antiguas advertencias familiares.',

      icono:
        '🌿'

    },


    viudita: {

      etiqueta:
        'RELATOS DE LA NOCHE',

      titulo:
        'La Viudita',

      descripcion:
        'Una misteriosa mujer que aparecía durante las antiguas noches cruceñas y encantaba a ciertos trasnochadores.',

      icono:
        '🕯️'

    },


    jichi: {

      etiqueta:
        'GUARDIÁN DE LAS AGUAS',

      titulo:
        'El Jichi',

      descripcion:
        'Un misterioso ser sobrenatural asociado a lagunas, pozas y madrejones y a la protección del agua.',

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

          Cuando sea reconocida,
          el personaje aparecerá en 3D.

          Captúralo para desbloquear
          su historia y audiolibro.

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
// CREAR AUDIOLIBRO
// ============================================================

function crearAudiolibro(
  tipo
) {

  const config =
    experiencias[tipo];


  return `

    <div class="audiolibro">


      <div class="cabecera-audiolibro">


        <div class="icono-audiolibro">
          🎧
        </div>


        <div>

          <span class="sobrelinea">
            AUDIOLIBRO MULTILINGÜE
          </span>

          <h3>
            ${config.nombre}
          </h3>

          <p>
            Escucha la leyenda en el idioma que prefieras.
          </p>

        </div>


      </div>



      <div class="selector-idiomas">


        <button
          class="btn-idioma activo"
          type="button"
          data-audio-lang="es"
          data-audio-tipo="${tipo}"
        >

          <span class="bandera-idioma">
            🇧🇴
          </span>

          <span>
            Español
          </span>

        </button>



        <button
          class="btn-idioma"
          type="button"
          data-audio-lang="en"
          data-audio-tipo="${tipo}"
        >

          <span class="bandera-idioma">
            🇺🇸
          </span>

          <span>
            English
          </span>

        </button>



        <button
          class="btn-idioma"
          type="button"
          data-audio-lang="pt"
          data-audio-tipo="${tipo}"
        >

          <span class="bandera-idioma">
            🇧🇷
          </span>

          <span>
            Português
          </span>

        </button>



        <button
          class="btn-idioma"
          type="button"
          data-audio-lang="de"
          data-audio-tipo="${tipo}"
        >

          <span class="bandera-idioma">
            🇩🇪
          </span>

          <span>
            Deutsch
          </span>

        </button>


      </div>



      <div class="reproductor-audiolibro">


        <div class="idioma-reproduccion">


          <span>
            🎙️ Narración:
          </span>


          <strong
            id="idioma-audio-${tipo}"
          >
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
// MOSTRAR LEYENDA
// ============================================================

function mostrarLeyenda(
  tipo
) {

  if (
    !areaTexto ||
    !experiencias[tipo]
  ) {

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

        style="display:none"

      >

        ${crearContenidoCapturado(tipo)}

      </div>


    </div>

  `;


  // ==========================================================
  // BOTÓN PARA ABRIR AR
  // ==========================================================

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


  // ==========================================================
  // PREPARAMOS AUDIOLIBRO
  // ==========================================================

  configurarAudiolibro(
    tipo
  );

}


// ============================================================
// CONTENIDO DESBLOQUEADO
// ============================================================

function crearContenidoCapturado(
  tipo
) {


  // ==========================================================
  // CARRETÓN
  // ==========================================================

  if (
    tipo === 'carreton'
  ) {

    return `

      <div class="mensaje-capturado">

        <h3>
          ☠️ ¡Carretón capturado!
        </h3>

        <p>
          Has desbloqueado su historia y audiolibro.
        </p>

      </div>


      ${crearAudiolibro(tipo)}


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
          brillaba un resplandor semejante al fuego.

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
          en generación, nació la leyenda de
          El Carretón de la Otra Vida.

        </p>


      </div>

    `;

  }


  // ==========================================================
  // GUAJOJÓ
  // ==========================================================

  if (
    tipo === 'guajojo'
  ) {

    return `

      <div class="mensaje-capturado">

        <h3>
          🦉 ¡Guajojó capturado!
        </h3>

        <p>
          Has desbloqueado su historia y audiolibro.
        </p>

      </div>


      ${crearAudiolibro(tipo)}


      <div class="historia-leyenda">

        <h3>
          La Leyenda del Guajojó
        </h3>


        <p>

          Cuenta la tradición que hace muchos años,
          en las tierras del oriente boliviano,
          la hija de un cacique se enamoró
          profundamente de un joven de su tribu.

        </p>

        <br>


        <p>

          Sin embargo, su padre desaprobaba
          aquella relación.

        </p>

        <br>


        <p>

          El cacique, que además poseía poderes
          de hechicero, decidió terminar con
          aquel romance.

          Engañó al joven y lo llevó hasta
          la espesura de la selva,
          donde acabó con su vida.

        </p>

        <br>


        <p>

          Cuando la muchacha descubrió lo sucedido,
          quedó destrozada por el dolor.

        </p>

        <br>


        <p>

          Furiosa, enfrentó a su padre y amenazó
          con contar a todos los habitantes
          de la tribu el terrible crimen
          que había cometido.

        </p>

        <br>


        <p>

          El cacique, temiendo que su hija revelara
          la verdad, utilizó sus poderes
          y la transformó en un ave nocturna.

        </p>

        <br>


        <p>

          Pero hubo algo que el hechicero
          no pudo quitarle:

          su voz.

        </p>

        <br>


        <p>

          Desde entonces, durante las noches
          silenciosas del bosque, puede escucharse
          el triste lamento de aquella joven
          transformada en ave.

        </p>

        <br>


        <p>

          Un canto profundo y melancólico
          que parece repetir entre los árboles:

          <strong>
            ¡Gua... jo... jó!
          </strong>

        </p>

      </div>


      <div class="multimedia-leyenda">

        <div class="reproductor-leyenda">

          <span class="sobrelinea">
            SONIDO DEL GUAJOJÓ
          </span>

          <h3>
            Escucha su canto
          </h3>

          <audio
            controls
            preload="metadata"
            src="/audio-guajojo.mp3"
          ></audio>

        </div>


        <img
          src="/foto-guajojo.jpg"
          class="foto-leyenda"
          alt="Guajojó"
        >

      </div>

    `;

  }


  // ==========================================================
  // DUENDE
  // ==========================================================

  if (
    tipo === 'duende'
  ) {

    return `

      <div class="mensaje-capturado">

        <h3>
          🌿 ¡Duende capturado!
        </h3>

        <p>
          Has desbloqueado su historia y audiolibro.
        </p>

      </div>


      ${crearAudiolibro(tipo)}


      <div class="historia-leyenda">

        <h3>
          La Leyenda del Duende
        </h3>


        <p>

          El Duende forma parte de los antiguos
          relatos tradicionales cruceños.

        </p>

        <br>


        <p>

          Se lo describe como un ser pequeño,
          de apariencia infantil y carácter travieso.

          En muchos relatos aparece vestido
          con ropa clara y cubierto por
          un gran sombrero de saó.

        </p>

        <br>


        <p>

          Se decía que habitaba cerca de los montes,
          caminos solitarios y lugares apartados.

        </p>

        <br>


        <p>

          Una de sus travesuras favoritas consistía
          en acercarse a los niños cuando estos
          se alejaban demasiado de sus casas.

        </p>

        <br>


        <p>

          El Duende trataba de ganarse su confianza
          ofreciéndoles dulces, juguetes
          o invitándolos a jugar.

        </p>

        <br>


        <p>

          Por esta razón, los mayores advertían
          a los niños que nunca debían seguir
          a un desconocido ni internarse solos
          en el monte.

        </p>

        <br>


        <p>

          También existía la creencia de que,
          durante la noche, podía ingresar
          a corrales y establos.

        </p>

        <br>


        <p>

          A la mañana siguiente, los propietarios
          encontraban las crines y las colas
          de sus caballos cuidadosamente trenzadas.

        </p>

        <br>


        <p>

          Algunos aseguraban que aquellas trenzas
          eran una señal inequívoca de que
          el Duende había visitado el lugar.

        </p>


      </div>

    `;

  }


  // ==========================================================
  // VIUDITA
  // ==========================================================

  if (
    tipo === 'viudita'
  ) {

    return `

      <div class="mensaje-capturado">

        <h3>
          🕯️ ¡La Viudita capturada!
        </h3>

        <p>
          Has desbloqueado su historia y audiolibro.
        </p>

      </div>


      ${crearAudiolibro(tipo)}


      <div class="historia-leyenda">

        <h3>
          La Leyenda de La Viudita
        </h3>


        <p>

          En las antiguas noches de Santa Cruz
          se contaba la historia de una misteriosa
          mujer conocida como La Viudita.

        </p>

        <br>


        <p>

          No era simplemente una aparición aterradora.

        </p>

        <br>


        <p>

          La tradición decía que solía aparecer
          especialmente ante hombres trasnochadores,
          parranderos o aquellos que recorrían
          las calles durante la noche buscando
          conquistas amorosas.

        </p>

        <br>


        <p>

          En medio de la oscuridad aparecía
          una misteriosa mujer.

        </p>

        <br>


        <p>

          Su presencia resultaba irresistible
          para quien la encontraba.

        </p>

        <br>


        <p>

          Bajo una especie de encantamiento,
          el hombre aceptaba acompañarla
          sin sospechar lo que estaba
          a punto de suceder.

        </p>

        <br>


        <p>

          Creía caminar junto a ella hacia
          un lugar agradable, elegante
          y confortable.

        </p>

        <br>


        <p>
          Todo parecía perfecto.
        </p>

        <br>


        <p>
          Pero el encantamiento no duraba para siempre.
        </p>

        <br>


        <p>

          Cuando finalmente recuperaba la conciencia,
          descubría que la realidad era
          completamente diferente.

        </p>

        <br>


        <p>

          Aquello que había imaginado como una
          elegante estancia podía ser simplemente
          un matorral lleno de espinas.

        </p>

        <br>


        <p>

          El cómodo lecho donde creía haber descansado
          podía resultar ser un barrial,
          un terreno abandonado
          o cualquier lugar desagradable.

        </p>

        <br>


        <p>

          Y de aquella misteriosa mujer
          ya no quedaba ninguna señal.

        </p>

        <br>


        <p>
          La Viudita había desaparecido sin dejar rastro.
        </p>


      </div>

    `;

  }


  // ==========================================================
  // JICHI
  // ==========================================================

  return `

    <div class="mensaje-capturado">

      <h3>
        💧 ¡Jichi capturado!
      </h3>

      <p>
        Has desbloqueado su historia y audiolibro.
      </p>

    </div>


    ${crearAudiolibro(tipo)}


    <div class="historia-leyenda">

      <h3>
        La Leyenda del Jichi
      </h3>


      <p>

        Según antiguas tradiciones compartidas
        por pueblos del oriente boliviano,
        las lagunas, pozas, charcos y madrejones
        no eran solamente depósitos de agua.

      </p>

      <br>


      <p>

        En algunos de ellos podía habitar
        un misterioso ser sobrenatural
        conocido como el Jichi.

      </p>

      <br>


      <p>

        El Jichi era considerado
        el guardián de las aguas.

      </p>

      <br>


      <p>

        Se lo describía como una criatura extraña,
        difícil de comparar con cualquier animal
        conocido.

      </p>

      <br>


      <p>

        Su cuerpo era alargado,
        con características que recordaban
        a una enorme culebra y,
        al mismo tiempo, a un saurio.

      </p>

      <br>


      <p>

        Su apariencia podía confundirse con el agua,
        haciendo muy difícil poder observarlo.

      </p>

      <br>


      <p>

        Mientras el Jichi permanecía en su morada,
        el agua se conservaba.

      </p>

      <br>


      <p>

        Por esta razón, las personas debían respetar
        el lugar donde habitaba.

        No debían desperdiciar el agua
        ni destruir la vegetación que crecía
        alrededor de la laguna.

      </p>

      <br>


      <p>

        Si las personas abusaban de aquellos recursos
        o destruían su entorno,
        el Jichi podía molestarse.

      </p>

      <br>


      <p>

        Entonces el guardián abandonaba su morada.

      </p>

      <br>


      <p>

        Después de su partida,
        el nivel del agua comenzaba lentamente
        a disminuir hasta terminar por agotarse.

      </p>

      <br>


      <p>

        De generación en generación quedó
        una sencilla advertencia:

      </p>

      <br>


      <p>

        <strong>

          Mientras el Jichi permanezca,
          el agua permanecerá.

          Pero si el Jichi se marcha,
          el agua también.

        </strong>

      </p>


    </div>

  `;

}


// ============================================================
// CONFIGURAR AUDIOLIBRO
// ============================================================

function configurarAudiolibro(
  tipo
) {

  const audio =
    document.getElementById(
      `audiolibro-${tipo}`
    );


  const indicador =
    document.getElementById(
      `idioma-audio-${tipo}`
    );


  const botones =
    document.querySelectorAll(
      `[data-audio-tipo="${tipo}"]`
    );


  if (
    !audio ||
    !botones.length
  ) {

    return;

  }


  botones.forEach(
    boton => {

      boton.addEventListener(
        'click',
        () => {

          const idioma =
            boton.dataset.audioLang;


          if (
            !idiomas[idioma]
          ) {

            return;

          }


          const estabaReproduciendo =
            !audio.paused;


          // ==================================================
          // CAMBIAR BOTÓN ACTIVO
          // ==================================================

          botones.forEach(
            otro => {

              otro.classList.remove(
                'activo'
              );

            }
          );


          boton.classList.add(
            'activo'
          );


          // ==================================================
          // NUEVA RUTA
          // ==================================================

          const nuevaRuta =
            `/audio/${idioma}/${tipo}.mp3`;


          audio.pause();


          audio.src =
            nuevaRuta;


          audio.load();


          // ==================================================
          // INDICADOR
          // ==================================================

          if (
            indicador
          ) {

            indicador.textContent =
              `${idiomas[idioma].bandera} ${idiomas[idioma].nombre}`;

          }


          // ==================================================
          // SI ESTABA REPRODUCIENDO,
          // CONTINUAMOS AUTOMÁTICAMENTE
          // ==================================================

          if (
            estabaReproduciendo
          ) {

            audio
              .play()
              .catch(
                () => {}
              );

          }


          console.log(
            `🎧 ${tipo} → ${idioma}`
          );

        }
      );

    }
  );


  // ==========================================================
  // ERROR DEL MP3
  // ==========================================================

  audio.addEventListener(
    'error',
    () => {

      console.error(
        '❌ No se pudo cargar:',
        audio.src
      );

    }
  );

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
// PREPARAR MODELOS
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
// CARGAR MODELO
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
  // YA ESTÁ CARGADO
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

          if (
            terminado
          ) {

            return;

          }


          terminado =
            true;


          modelosCargados[tipo] =
            true;


          prepararModelos(
            tipo
          );


          console.log(
            `✅ Modelo cargado: ${tipo}`
          );


          resolve();

        };


      const error =
        evento => {

          if (
            terminado
          ) {

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


      modelo.setAttribute(
        'gltf-model',
        config.archivo
      );


      modelo.setAttribute(
        'visible',
        true
      );


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


  if (
    textoInstruccionAR
  ) {

    textoInstruccionAR.textContent =
      config.instruccion;

  }


  try {


    // ========================================================
    // MODELO
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


    if (
      !sistema
    ) {

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
// TARGETS
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


    if (
      !target
    ) {

      return;

    }


    // ========================================================
    // TARGET ENCONTRADO
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
    // TARGET PERDIDO
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
    btnCapturar?.disabled
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

}


// ============================================================
// CERRAR AR
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
// UI AR
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

// ============================================================
// CHAT CON IA - LEYENDAS
// ============================================================

const CHAT_API_URL =
  'https://leyendas-sc-xnww.vercel.app/api/chat-leyenda';


// ============================================================
// CONFIGURACIÓN DE PERSONAJES
// ============================================================

const chatPersonajes = {

  carreton: {
    nombre: 'El Carretón',
    emoji: '☠️',

    saludo:
      'He vuelto a recorrer estas antiguas historias. Pregúntame sobre mi leyenda, mis apariciones o mi relación con las epidemias de Santa Cruz.'
  },

  guajojo: {
    nombre: 'El Guajojó',
    emoji: '🪶',

    saludo:
      'Puedes preguntarme sobre mi historia, mi transformación, mi amado o el origen de mi triste canto.'
  },

  duende: {
    nombre: 'El Duende',
    emoji: '🌿',

    saludo:
      'Puedes preguntarme sobre mis travesuras, el monte, los niños, mi sombrero de saó o las crines de los caballos.'
  },

  viudita: {
    nombre: 'La Viudita',
    emoji: '🕯️',

    saludo:
      'Puedes preguntarme sobre mis apariciones, los trasnochadores, mis encantamientos o las antiguas noches cruceñas.'
  },

  jichi: {
    nombre: 'El Jichi',
    emoji: '💧',

    saludo:
      'Puedes preguntarme sobre las aguas que protejo, mi apariencia, las lagunas o el cuidado de la naturaleza.'
  }

};


// ============================================================
// HISTORIAL INDEPENDIENTE DE CADA LEYENDA
// ============================================================

const chatHistorial = {

  carreton: [],
  guajojo: [],
  duende: [],
  viudita: [],
  jichi: []

};


// ============================================================
// IDIOMA ACTUAL DEL CHAT
// ============================================================

const chatIdiomaActual = {

  carreton: 'es',
  guajojo: 'es',
  duende: 'es',
  viudita: 'es',
  jichi: 'es'

};


// ============================================================
// IDIOMAS PARA VOZ
// ============================================================

const chatIdiomasVoz = {

  es: 'es-BO',

  en: 'en-US',

  pt: 'pt-BR',

  de: 'de-DE'

};


// ============================================================
// VARIABLES DEL MICRÓFONO
// ============================================================

let chatReconocimientoActivo = null;

let chatTipoReconocimientoActivo = null;


// ============================================================
// CREAR HTML DEL CHAT
// ============================================================

function chatCrearHTML(
  tipo
) {

  const personaje =
    chatPersonajes[tipo];


  if (!personaje) {

    return '';

  }


  return `

    <section
      class="chat-leyenda"
      id="chat-leyenda-${tipo}"
    >


      <!-- ====================================================
           CABECERA
           ==================================================== -->

      <div class="chat-cabecera">


        <div class="chat-cabecera-icono">

          ${personaje.emoji}

        </div>


        <div class="chat-cabecera-texto">


          <span class="sobrelinea">

            EXPERIENCIA INTERACTIVA

          </span>


          <h3>

            💬 Conversa con ${personaje.nombre}

          </h3>


          <p>

            Pregunta sobre su historia y conversa
            directamente con el personaje.

          </p>


        </div>


      </div>



      <!-- ====================================================
           ZONA CELESTE:
           PREGUNTAS Y RESPUESTAS
           ==================================================== -->

      <div

        class="chat-mensajes"

        id="chat-mensajes-${tipo}"

        aria-live="polite"

      ></div>



      <!-- ====================================================
           PARTE INFERIOR
           ==================================================== -->

      <div class="chat-zona-inferior">


        <!-- ==================================================
             ZONA NARANJA:
             AQUÍ IRÁ LA IMAGEN
             ================================================== -->

        <div

          class="chat-personaje-placeholder"

          id="chat-imagen-${tipo}"

        >


          <span class="chat-personaje-emoji">

            ${personaje.emoji}

          </span>


          <span class="chat-personaje-texto">

            Imagen del personaje

          </span>


        </div>



        <!-- ==================================================
             ZONA AMARILLA:
             ESCRIBIR PREGUNTA
             ================================================== -->

        <div class="chat-compositor">


          <label

            class="chat-label"

            for="chat-input-${tipo}"

          >

            Pregúntale a ${personaje.nombre}

          </label>



          <textarea

            id="chat-input-${tipo}"

            class="chat-input"

            maxlength="1000"

            rows="4"

            placeholder="Escribe tu pregunta..."

          ></textarea>



          <div class="chat-acciones">


            <!-- MICRÓFONO -->

            <button

              id="chat-mic-${tipo}"

              class="chat-btn-mic"

              type="button"

              title="Hablar por micrófono"

              aria-label="Hablar por micrófono"

            >

              🎙️

            </button>



            <!-- ENVIAR -->

            <button

              id="chat-enviar-${tipo}"

              class="chat-btn-enviar"

              type="button"

            >


              <span>

                Enviar

              </span>


              <span aria-hidden="true">

                ➤

              </span>


            </button>


          </div>



          <div

            class="chat-estado"

            id="chat-estado-${tipo}"

            aria-live="polite"

          ></div>


        </div>


      </div>


    </section>

  `;

}


// ============================================================
// BUSCAR E INSERTAR LOS CHATS
// ============================================================

function chatInyectarTodos() {

  Object.keys(
    chatPersonajes
  ).forEach(
    tipo => {

      chatInyectar(
        tipo
      );

    }
  );

}


// ============================================================
// INSERTAR CHAT EN UNA LEYENDA
// ============================================================

function chatInyectar(
  tipo
) {

  const config =
    experiencias[tipo];


  if (!config) {

    return;

  }


  const contenido =
    document.getElementById(
      config.contenidoId
    );


  if (!contenido) {

    return;

  }


  // ==========================================================
  // EVITAR DUPLICAR EL CHAT
  // ==========================================================

  if (
    document.getElementById(
      `chat-leyenda-${tipo}`
    )
  ) {

    return;

  }


  const audiolibro =
    contenido.querySelector(
      '.audiolibro'
    );


  // ==========================================================
  // CHAT DESPUÉS DEL AUDIOLIBRO
  // ==========================================================

  if (audiolibro) {

    audiolibro.insertAdjacentHTML(

      'afterend',

      chatCrearHTML(
        tipo
      )

    );

  } else {

    contenido.insertAdjacentHTML(

      'afterbegin',

      chatCrearHTML(
        tipo
      )

    );

  }


  // ==========================================================
  // ACTIVAR FUNCIONES
  // ==========================================================

  chatConfigurar(
    tipo
  );

}


// ============================================================
// CONFIGURAR CHAT
// ============================================================

function chatConfigurar(
  tipo
) {

  const input =
    document.getElementById(
      `chat-input-${tipo}`
    );


  const btnEnviar =
    document.getElementById(
      `chat-enviar-${tipo}`
    );


  const btnMic =
    document.getElementById(
      `chat-mic-${tipo}`
    );


  const mensajes =
    document.getElementById(
      `chat-mensajes-${tipo}`
    );


  if (
    !input ||
    !btnEnviar ||
    !mensajes
  ) {

    return;

  }


  // ==========================================================
  // MOSTRAR HISTORIAL
  // ==========================================================

  chatRenderizarHistorial(
    tipo
  );


  // ==========================================================
  // BOTÓN ENVIAR
  // ==========================================================

  btnEnviar.addEventListener(

    'click',

    () => {

      chatEnviarPregunta(
        tipo
      );

    }

  );


  // ==========================================================
  // ENTER = ENVIAR
  //
  // SHIFT + ENTER = SALTO DE LÍNEA
  // ==========================================================

  input.addEventListener(

    'keydown',

    evento => {

      if (
        evento.key === 'Enter' &&
        !evento.shiftKey
      ) {

        evento.preventDefault();


        chatEnviarPregunta(
          tipo
        );

      }

    }

  );


  // ==========================================================
  // MICRÓFONO
  // ==========================================================

  if (btnMic) {

    const Reconocimiento =

      window.SpeechRecognition ||

      window.webkitSpeechRecognition;


    if (!Reconocimiento) {

      btnMic.disabled =
        true;


      btnMic.title =
        'El reconocimiento de voz no está disponible en este navegador.';


      btnMic.setAttribute(

        'aria-label',

        'Reconocimiento de voz no disponible'

      );

    } else {

      btnMic.addEventListener(

        'click',

        () => {

          chatIniciarMicrofono(
            tipo
          );

        }

      );

    }

  }

}


// ============================================================
// MOSTRAR HISTORIAL
// ============================================================

function chatRenderizarHistorial(
  tipo
) {

  const contenedor =
    document.getElementById(
      `chat-mensajes-${tipo}`
    );


  const personaje =
    chatPersonajes[tipo];


  if (
    !contenedor ||
    !personaje
  ) {

    return;

  }


  contenedor.innerHTML =
    '';


  // ==========================================================
  // SALUDO INICIAL
  // ==========================================================

  chatAgregarMensaje(

    tipo,

    'assistant',

    personaje.saludo,

    false

  );


  // ==========================================================
  // CONVERSACIÓN EXISTENTE
  // ==========================================================

  chatHistorial[tipo].forEach(

    mensaje => {

      chatAgregarMensaje(

        tipo,

        mensaje.role,

        mensaje.content,

        false

      );

    }

  );


  chatScrollAbajo(
    tipo
  );

}


// ============================================================
// AGREGAR MENSAJE VISUAL
// ============================================================

function chatAgregarMensaje(
  tipo,
  role,
  texto,
  desplazar = true
) {

  const contenedor =
    document.getElementById(
      `chat-mensajes-${tipo}`
    );


  const personaje =
    chatPersonajes[tipo];


  if (
    !contenedor ||
    !personaje ||
    !texto
  ) {

    return;

  }


  // ==========================================================
  // CONTENEDOR DEL MENSAJE
  // ==========================================================

  const bloque =
    document.createElement(
      'div'
    );


  bloque.className =

    role === 'user'

      ? 'chat-mensaje chat-mensaje-usuario'

      : 'chat-mensaje chat-mensaje-personaje';


  // ==========================================================
  // NOMBRE
  // ==========================================================

  const etiqueta =
    document.createElement(
      'div'
    );


  etiqueta.className =
    'chat-etiqueta';


  etiqueta.textContent =

    role === 'user'

      ? 'Tú'

      : `${personaje.emoji} ${personaje.nombre}`;


  // ==========================================================
  // BURBUJA
  // ==========================================================

  const burbuja =
    document.createElement(
      'div'
    );


  burbuja.className =
    'chat-burbuja';


  burbuja.textContent =
    texto;


  bloque.appendChild(
    etiqueta
  );


  bloque.appendChild(
    burbuja
  );


  // ==========================================================
  // BOTÓN ESCUCHAR RESPUESTA
  // ==========================================================

  if (
    role === 'assistant'
  ) {

    const acciones =
      document.createElement(
        'div'
      );


    acciones.className =
      'chat-acciones-respuesta';


    const btnEscuchar =
      document.createElement(
        'button'
      );


    btnEscuchar.type =
      'button';


    btnEscuchar.className =
      'chat-btn-escuchar';


    btnEscuchar.textContent =
      '🔊 Escuchar';


    btnEscuchar.addEventListener(

      'click',

      () => {

        chatEscucharRespuesta(

          tipo,

          texto

        );

      }

    );


    acciones.appendChild(
      btnEscuchar
    );


    bloque.appendChild(
      acciones
    );

  }


  contenedor.appendChild(
    bloque
  );


  if (
    desplazar
  ) {

    chatScrollAbajo(
      tipo
    );

  }

}


// ============================================================
// ENVIAR PREGUNTA
// ============================================================

async function chatEnviarPregunta(
  tipo
) {

  const input =
    document.getElementById(
      `chat-input-${tipo}`
    );


  const btnEnviar =
    document.getElementById(
      `chat-enviar-${tipo}`
    );


  const btnMic =
    document.getElementById(
      `chat-mic-${tipo}`
    );


  if (
    !input ||
    !btnEnviar ||
    !chatPersonajes[tipo]
  ) {

    return;

  }


  const pregunta =
    input.value.trim();


  // ==========================================================
  // PREGUNTA VACÍA
  // ==========================================================

  if (!pregunta) {

    chatActualizarEstado(

      tipo,

      'Escribe una pregunta antes de enviarla.',

      'aviso'

    );


    input.focus();


    return;

  }


  // ==========================================================
  // GUARDAR HISTORIAL ANTERIOR
  // ==========================================================

  const historialParaEnviar =

    chatHistorial[tipo]
      .slice(-8);


  // ==========================================================
  // AGREGAR PREGUNTA LOCALMENTE
  // ==========================================================

  chatHistorial[tipo].push({

    role: 'user',

    content: pregunta

  });


  chatAgregarMensaje(

    tipo,

    'user',

    pregunta

  );


  input.value =
    '';


  btnEnviar.disabled =
    true;


  if (btnMic) {

    btnMic.disabled =
      true;

  }


  chatActualizarEstado(

    tipo,

    `${chatPersonajes[tipo].emoji} ${chatPersonajes[tipo].nombre} está pensando...`,

    'cargando'

  );


  try {

    // ========================================================
    // ENVIAR AL BACKEND
    // ========================================================

    const respuesta =
      await fetch(

        CHAT_API_URL,

        {

          method:
            'POST',


          headers: {

            'Content-Type':
              'application/json'

          },


          body:
            JSON.stringify({

              leyenda:
                tipo,

              pregunta:
                pregunta,

              historial:
                historialParaEnviar

            })

        }

      );


    let datos =
      {};


    try {

      datos =
        await respuesta.json();

    } catch {

      // No era JSON

    }


    // ========================================================
    // ERROR DEL SERVIDOR
    // ========================================================

    if (
      !respuesta.ok
    ) {

      throw new Error(

        datos.error ||

        `Error ${respuesta.status}`

      );

    }


    // ========================================================
    // TEXTO DE RESPUESTA
    // ========================================================

    const texto =

      String(
        datos.respuesta || ''
      ).trim();


    if (!texto) {

      throw new Error(
        'La respuesta llegó vacía.'
      );

    }


    // ========================================================
    // GUARDAR RESPUESTA
    // ========================================================

    chatHistorial[tipo].push({

      role: 'assistant',

      content: texto

    });


    // ========================================================
    // MOSTRAR RESPUESTA
    // ========================================================

    chatAgregarMensaje(

      tipo,

      'assistant',

      texto

    );


    chatActualizarEstado(

      tipo,

      '',

      ''

    );


  } catch (error) {


    console.error(

      '❌ Error en el chat:',

      error

    );


    chatActualizarEstado(

      tipo,

      'No pude conectarme con el personaje. Intenta nuevamente.',

      'error'

    );


  } finally {


    btnEnviar.disabled =
      false;


    if (btnMic) {

      const Reconocimiento =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;


      btnMic.disabled =
        !Reconocimiento;

    }


    input.focus();

  }

}


// ============================================================
// MOSTRAR ESTADO
// ============================================================

function chatActualizarEstado(
  tipo,
  texto,
  clase
) {

  const estado =
    document.getElementById(
      `chat-estado-${tipo}`
    );


  if (!estado) {

    return;

  }


  estado.textContent =
    texto || '';


  estado.className =
    'chat-estado';


  if (clase) {

    estado.classList.add(
      `chat-estado-${clase}`
    );

  }

}


// ============================================================
// BAJAR AUTOMÁTICAMENTE AL ÚLTIMO MENSAJE
// ============================================================

function chatScrollAbajo(
  tipo
) {

  requestAnimationFrame(

    () => {

      const contenedor =
        document.getElementById(
          `chat-mensajes-${tipo}`
        );


      if (contenedor) {

        contenedor.scrollTop =
          contenedor.scrollHeight;

      }

    }

  );

}


// ============================================================
// MICRÓFONO
// ============================================================

function chatIniciarMicrofono(
  tipo
) {

  const Reconocimiento =

    window.SpeechRecognition ||

    window.webkitSpeechRecognition;


  const input =
    document.getElementById(
      `chat-input-${tipo}`
    );


  const btnMic =
    document.getElementById(
      `chat-mic-${tipo}`
    );


  if (
    !Reconocimiento ||
    !input ||
    !btnMic
  ) {

    chatActualizarEstado(

      tipo,

      'El reconocimiento de voz no está disponible en este navegador.',

      'aviso'

    );


    return;

  }


  // ==========================================================
  // SI YA ESTÁ ESCUCHANDO
  // ==========================================================

  if (
    chatReconocimientoActivo
  ) {

    try {

      chatReconocimientoActivo.stop();

    } catch {

      // Nada

    }


    if (
      chatTipoReconocimientoActivo === tipo
    ) {

      return;

    }

  }


  const reconocimiento =
    new Reconocimiento();


  reconocimiento.lang =

    chatIdiomasVoz[
      chatIdiomaActual[tipo]
    ] || 'es-BO';


  reconocimiento.interimResults =
    false;


  reconocimiento.continuous =
    false;


  reconocimiento.maxAlternatives =
    1;


  chatReconocimientoActivo =
    reconocimiento;


  chatTipoReconocimientoActivo =
    tipo;


  // ==========================================================
  // EMPEZÓ A ESCUCHAR
  // ==========================================================

  reconocimiento.onstart =
    () => {


      btnMic.classList.add(
        'escuchando'
      );


      btnMic.textContent =
        '⏹️';


      chatActualizarEstado(

        tipo,

        'Escuchando... habla ahora.',

        'cargando'

      );

    };


  // ==========================================================
  // RESULTADO
  // ==========================================================

  reconocimiento.onresult =
    evento => {


      const texto =

        evento
          .results?.[0]?.[0]
          ?.transcript;


      if (texto) {


        input.value =
          texto;


        input.focus();


        input.setSelectionRange(

          input.value.length,

          input.value.length

        );

      }

    };


  // ==========================================================
  // ERROR
  // ==========================================================

  reconocimiento.onerror =
    evento => {


      let mensaje =

        'No pude escuchar la pregunta. Intenta nuevamente.';


      if (

        evento.error === 'not-allowed' ||

        evento.error === 'service-not-allowed'

      ) {

        mensaje =

          'Debes permitir el acceso al micrófono para utilizar esta función.';

      }


      if (
        evento.error === 'no-speech'
      ) {

        mensaje =

          'No detecté ninguna voz. Intenta hablar un poco más cerca del micrófono.';

      }


      chatActualizarEstado(

        tipo,

        mensaje,

        'error'

      );

    };


  // ==========================================================
  // TERMINÓ
  // ==========================================================

  reconocimiento.onend =
    () => {


      btnMic.classList.remove(
        'escuchando'
      );


      btnMic.textContent =
        '🎙️';


      if (
        chatReconocimientoActivo === reconocimiento
      ) {

        chatReconocimientoActivo =
          null;


        chatTipoReconocimientoActivo =
          null;

      }


      const estado =
        document.getElementById(
          `chat-estado-${tipo}`
        );


      if (

        estado &&

        estado.classList.contains(
          'chat-estado-cargando'
        )

      ) {

        chatActualizarEstado(

          tipo,

          '',

          ''

        );

      }

    };


  try {

    reconocimiento.start();

  } catch (error) {

    console.warn(

      'No se pudo iniciar el micrófono:',

      error

    );

  }

}


// ============================================================
// LEER RESPUESTA EN VOZ ALTA
// ============================================================

function chatEscucharRespuesta(
  tipo,
  texto
) {

  if (
    !('speechSynthesis' in window)
  ) {

    chatActualizarEstado(

      tipo,

      'La lectura en voz alta no está disponible en este navegador.',

      'aviso'

    );


    return;

  }


  // ==========================================================
  // DETENER AUDIO ANTERIOR
  // ==========================================================

  window.speechSynthesis.cancel();


  const voz =
    new SpeechSynthesisUtterance(
      texto
    );


  voz.lang =

    chatIdiomasVoz[
      chatIdiomaActual[tipo]
    ] || 'es-BO';


  voz.rate =
    0.96;


  voz.pitch =
    1;


  // ==========================================================
  // BUSCAR UNA VOZ DEL MISMO IDIOMA
  // ==========================================================

  const voces =
    window.speechSynthesis.getVoices();


  const prefijo =

    voz.lang
      .split('-')[0]
      .toLowerCase();


  const vozCompatible =

    voces.find(

      item => {

        return String(
          item.lang || ''
        )

          .toLowerCase()

          .startsWith(
            prefijo
          );

      }

    );


  if (
    vozCompatible
  ) {

    voz.voice =
      vozCompatible;

  }


  window.speechSynthesis.speak(
    voz
  );

}


// ============================================================
// DETECTAR CAMBIO DE IDIOMA DEL AUDIOLIBRO
// ============================================================

document.addEventListener(

  'click',

  evento => {


    const boton =
      evento.target.closest(
        '[data-audio-lang][data-audio-tipo]'
      );


    if (!boton) {

      return;

    }


    const tipo =
      boton.dataset.audioTipo;


    const idioma =
      boton.dataset.audioLang;


    if (
      chatIdiomaActual[tipo] !== undefined
    ) {

      chatIdiomaActual[tipo] =
        idioma;

    }

  }

);


// ============================================================
// OBSERVADOR
//
// TU main.js CREA EL CONTENIDO DE CADA LEYENDA
// DINÁMICAMENTE.
//
// ESTE OBSERVADOR DETECTA CUANDO APARECE Y AGREGA EL CHAT.
// ============================================================

const chatObservador =
  new MutationObserver(

    () => {

      chatInyectarTodos();

    }

  );


// ============================================================
// OBSERVAR CONTENIDO DINÁMICO
// ============================================================

if (areaTexto) {

  chatObservador.observe(

    areaTexto,

    {

      childList:
        true,

      subtree:
        true

    }

  );

}


// ============================================================
// PRIMER INTENTO
// ============================================================

chatInyectarTodos();
