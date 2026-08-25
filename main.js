import './style.css';
import './chat.css';

const sidebar =
  document.getElementById('sidebar');

const btnMenu =
  document.getElementById('btn-menu');

const areaTexto =
  document.getElementById('contenido-dinamico');

const botonesLeyenda =
  document.querySelectorAll('.btn-leyenda');

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


btnMenu?.addEventListener(
  'click',
  () => {

    sidebar?.classList.toggle('abierto');

  }
);


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


  configurarAudiolibro(
    tipo
  );

}


function crearContenidoCapturado(
  tipo
) {


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


          const nuevaRuta =
            `/audio/${idioma}/${tipo}.mp3`;


          audio.pause();


          audio.src =
            nuevaRuta;


          audio.load();


          if (
            indicador
          ) {

            indicador.textContent =
              `${idiomas[idioma].bandera} ${idiomas[idioma].nombre}`;

          }


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


function obtenerModelo(
  tipo
) {

  return document.getElementById(
    experiencias[tipo].modeloId
  );

}


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


  mostrarBotonChatFlotante(
    tipo
  );

}


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

    }

  }
);



// ============================================================
// CHAT FLOTANTE CON IA
// ============================================================

const CHAT_API_URL =
  'https://leyendas-sc-xnww.vercel.app/api/chat-leyenda';


// ============================================================
// PERSONAJES DEL CHAT
// ============================================================

const chatPersonajes = {

  carreton: {

    nombre:
      'El Carretón de la Otra Vida',

    nombreCorto:
      'El Carretón',

    emoji:
      '☠️',

    imagen:
      null,

    saludo:
      'Puedes preguntarme sobre mi leyenda, mis apariciones y mi relación con las antiguas epidemias de Santa Cruz.'

  },


  guajojo: {

    nombre:
      'El Guajojó',

    nombreCorto:
      'El Guajojó',

    emoji:
      '🪶',

    imagen:
      null,

    saludo:
      'Puedes preguntarme sobre mi historia, mi transformación, mi amado o el origen de mi triste canto.'

  },


  duende: {

    nombre:
      'El Duende',

    nombreCorto:
      'El Duende',

    emoji:
      '🌿',

    imagen:
      null,

    saludo:
      'Puedes preguntarme sobre mis travesuras, el monte, los niños, mi sombrero de saó o las crines de los caballos.'

  },


  viudita: {

    nombre:
      'La Viudita',

    nombreCorto:
      'La Viudita',

    emoji:
      '🕯️',

    imagen:
      null,

    saludo:
      'Puedes preguntarme sobre mis apariciones, los trasnochadores, mis encantamientos o las antiguas noches cruceñas.'

  },


  jichi: {

    nombre:
      'El Jichi',

    nombreCorto:
      'El Jichi',

    emoji:
      '💧',

    imagen:
      null,

    saludo:
      'Puedes preguntarme sobre las aguas que protejo, mi apariencia, las lagunas o el cuidado de la naturaleza.'

  }

};


// ============================================================
// HISTORIALES
// ============================================================

const historialesChat = {

  carreton: [],
  guajojo: [],
  duende: [],
  viudita: [],
  jichi: []

};


// ============================================================
// IDIOMAS PARA VOZ
// ============================================================

const idiomasChat = {

  carreton:
    'es',

  guajojo:
    'es',

  duende:
    'es',

  viudita:
    'es',

  jichi:
    'es'

};


const idiomasVozChat = {

  es:
    'es-BO',

  en:
    'en-US',

  pt:
    'pt-BR',

  de:
    'de-DE'

};


// ============================================================
// ESTADO
// ============================================================

let chatTipoActivo =
  null;


let reconocimientoChat =
  null;


let reconocimientoChatTipo =
  null;


let chatEnviando =
  false;


// ============================================================
// CREAR BOTÓN FLOTANTE Y PANTALLA
// ============================================================

function crearInterfazChat() {

  if (
    document.getElementById(
      'btn-chat-flotante'
    )
  ) {

    return;

  }


  const botonFlotante =
    document.createElement(
      'button'
    );


  botonFlotante.id =
    'btn-chat-flotante';


  botonFlotante.className =
    'btn-chat-flotante';


  botonFlotante.type =
    'button';


  botonFlotante.hidden =
    true;


  botonFlotante.setAttribute(
    'aria-label',
    'Abrir conversación con la leyenda'
  );


  botonFlotante.innerHTML = `

    <span
      class="btn-chat-flotante-emoji"
      id="btn-chat-flotante-emoji"
      aria-hidden="true"
    >
      💬
    </span>

    <span
      class="btn-chat-flotante-texto"
    >
      HABLA CONMIGO
    </span>

  `;


  document.body.appendChild(
    botonFlotante
  );


  const modal =
    document.createElement(
      'div'
    );


  modal.id =
    'chat-modal';


  modal.className =
    'chat-modal';


  modal.hidden =
    true;


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
            title="Volver"
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
                Conversa con El Duende
              </h2>


            </div>


          </div>


          <button
            id="btn-cerrar-chat-x"
            class="btn-cerrar-chat btn-cerrar-chat-x"
            type="button"
            aria-label="Cerrar chat"
            title="Cerrar chat"
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
            aria-label="Conversación"
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
                  aria-hidden="true"
                >
                  🌿
                </span>


                <strong
                  id="chat-personaje-nombre"
                >
                  El Duende
                </strong>


                <span
                  class="chat-personaje-aviso"
                >
                  Imagen del personaje
                </span>


              </div>


              <img
                id="chat-personaje-imagen"
                class="chat-personaje-imagen"
                src=""
                alt=""
                hidden
              >


            </div>



            <div class="chat-compositor">


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
                rows="4"
                maxlength="1000"
                placeholder="Escribe tu pregunta..."
              ></textarea>


              <div class="chat-compositor-pie">


                <div
                  id="chat-estado"
                  class="chat-estado"
                  aria-live="polite"
                >
                </div>


                <div class="chat-acciones">


                  <button
                    id="btn-chat-microfono"
                    class="btn-chat-microfono"
                    type="button"
                    aria-label="Hablar por micrófono"
                    title="Hablar por micrófono"
                  >
                    🎙️
                  </button>


                  <button
                    id="btn-chat-enviar"
                    class="btn-chat-enviar"
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


              </div>


            </div>


          </section>


        </div>


      </main>


    </div>

  `;


  document.body.appendChild(
    modal
  );


  botonFlotante.addEventListener(
    'click',
    () => {

      if (
        chatTipoActivo
      ) {

        abrirChat(
          chatTipoActivo
        );

      }

    }
  );


  document
    .getElementById(
      'btn-cerrar-chat'
    )
    ?.addEventListener(
      'click',
      cerrarChat
    );


  document
    .getElementById(
      'btn-cerrar-chat-x'
    )
    ?.addEventListener(
      'click',
      cerrarChat
    );


  document
    .getElementById(
      'btn-chat-enviar'
    )
    ?.addEventListener(
      'click',
      enviarPreguntaChat
    );


  document
    .getElementById(
      'chat-input'
    )
    ?.addEventListener(
      'keydown',
      evento => {

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
    .getElementById(
      'btn-chat-microfono'
    )
    ?.addEventListener(
      'click',
      usarMicrofonoChat
    );


  document.addEventListener(
    'keydown',
    evento => {

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
// MOSTRAR BOTÓN FLOTANTE
// ============================================================

function mostrarBotonChatFlotante(
  tipo
) {

  crearInterfazChat();


  const personaje =
    chatPersonajes[tipo];


  const boton =
    document.getElementById(
      'btn-chat-flotante'
    );


  const emoji =
    document.getElementById(
      'btn-chat-flotante-emoji'
    );


  if (
    !personaje ||
    !boton
  ) {

    return;

  }


  chatTipoActivo =
    tipo;


  if (
    emoji
  ) {

    emoji.textContent =
      personaje.emoji;

  }


  boton.hidden =
    false;


  boton.setAttribute(
    'aria-label',
    `Hablar con ${personaje.nombre}`
  );

}


// ============================================================
// OCULTAR BOTÓN FLOTANTE
// ============================================================

function ocultarBotonChatFlotante() {

  const boton =
    document.getElementById(
      'btn-chat-flotante'
    );


  if (
    boton
  ) {

    boton.hidden =
      true;

  }

}


// ============================================================
// ABRIR CHAT
// ============================================================

function abrirChat(
  tipo
) {

  crearInterfazChat();


  const personaje =
    chatPersonajes[tipo];


  const modal =
    document.getElementById(
      'chat-modal'
    );


  if (
    !personaje ||
    !modal
  ) {

    return;

  }


  chatTipoActivo =
    tipo;


  actualizarPersonajeChat(
    tipo
  );


  renderizarChat(
    tipo
  );


  pausarAudiosLeyendas();


  if (
    'speechSynthesis' in window
  ) {

    window.speechSynthesis.cancel();

  }


  modal.hidden =
    false;


  document.body.classList.add(
    'chat-abierto'
  );


  document.body.style.overflow =
    'hidden';


  actualizarDisponibilidadMicrofono();


  setTimeout(
    () => {

      document
        .getElementById(
          'chat-input'
        )
        ?.focus();

    },
    100
  );

}


// ============================================================
// CERRAR CHAT
// ============================================================

function cerrarChat() {

  const modal =
    document.getElementById(
      'chat-modal'
    );


  if (
    modal
  ) {

    modal.hidden =
      true;

  }


  document.body.classList.remove(
    'chat-abierto'
  );


  document.body.style.overflow =
    '';


  detenerMicrofonoChat();


  if (
    'speechSynthesis' in window
  ) {

    window.speechSynthesis.cancel();

  }

}


// ============================================================
// ACTUALIZAR PERSONAJE DEL CHAT
// ============================================================

function actualizarPersonajeChat(
  tipo
) {

  const personaje =
    chatPersonajes[tipo];


  if (
    !personaje
  ) {

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


  if (
    titulo
  ) {

    titulo.textContent =
      `Conversa con ${personaje.nombre}`;

  }


  if (
    avatar
  ) {

    avatar.textContent =
      personaje.emoji;

  }


  if (
    emoji
  ) {

    emoji.textContent =
      personaje.emoji;

  }


  if (
    nombre
  ) {

    nombre.textContent =
      personaje.nombreCorto;

  }


  if (
    label
  ) {

    label.textContent =
      `Pregúntale a ${personaje.nombreCorto}`;

  }


  if (
    imagen &&
    placeholder &&
    personaje.imagen
  ) {

    imagen.src =
      personaje.imagen;


    imagen.alt =
      personaje.nombre;


    imagen.hidden =
      false;


    placeholder.hidden =
      true;

  } else {


    if (
      imagen
    ) {

      imagen.hidden =
        true;


      imagen.removeAttribute(
        'src'
      );

    }


    if (
      placeholder
    ) {

      placeholder.hidden =
        false;

    }

  }

}


// ============================================================
// RENDERIZAR CHAT
// ============================================================

function renderizarChat(
  tipo
) {

  const contenedor =
    document.getElementById(
      'chat-mensajes'
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


  agregarMensajeVisualChat(
    'assistant',
    personaje.saludo,
    false
  );


  historialesChat[tipo]
    .forEach(
      mensaje => {

        agregarMensajeVisualChat(
          mensaje.role,
          mensaje.content,
          false
        );

      }
    );


  desplazarChatAlFinal();

}


// ============================================================
// AGREGAR MENSAJE
// ============================================================

function agregarMensajeVisualChat(
  role,
  texto,
  desplazar = true
) {

  const tipo =
    chatTipoActivo;


  const personaje =
    chatPersonajes[tipo];


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
    document.createElement(
      'div'
    );


  autor.className =
    'chat-autor';


  autor.textContent =

    role === 'user'

      ? 'Tú'

      : `${personaje.emoji} ${personaje.nombreCorto}`;


  const burbuja =
    document.createElement(
      'div'
    );


  burbuja.className =
    'chat-burbuja';


  burbuja.textContent =
    texto;


  mensaje.appendChild(
    autor
  );


  mensaje.appendChild(
    burbuja
  );


  if (
    role === 'assistant'
  ) {

    const pie =
      document.createElement(
        'div'
      );


    pie.className =
      'chat-mensaje-pie';


    const escuchar =
      document.createElement(
        'button'
      );


    escuchar.className =
      'btn-escuchar-chat';


    escuchar.type =
      'button';


    escuchar.textContent =
      '🔊 Escuchar';


    escuchar.addEventListener(
      'click',
      () => {

        leerRespuestaChat(
          texto
        );

      }
    );


    pie.appendChild(
      escuchar
    );


    mensaje.appendChild(
      pie
    );

  }


  contenedor.appendChild(
    mensaje
  );


  if (
    desplazar
  ) {

    desplazarChatAlFinal();

  }

}


// ============================================================
// ENVIAR PREGUNTA
// ============================================================

async function enviarPreguntaChat() {

  if (
    chatEnviando ||
    !chatTipoActivo
  ) {

    return;

  }


  const tipo =
    chatTipoActivo;


  const personaje =
    chatPersonajes[tipo];


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


  if (
    !pregunta
  ) {

    actualizarEstadoChat(
      'Escribe una pregunta antes de enviarla.',
      'aviso'
    );


    input.focus();


    return;

  }


  const historialParaEnviar =
    historialesChat[tipo]
      .slice(-8);


  historialesChat[tipo].push({

    role:
      'user',

    content:
      pregunta

  });


  agregarMensajeVisualChat(
    'user',
    pregunta
  );


  input.value =
    '';


  chatEnviando =
    true;


  botonEnviar.disabled =
    true;


  if (
    botonMicrofono
  ) {

    botonMicrofono.disabled =
      true;

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

    }


    if (
      !respuesta.ok
    ) {

      throw new Error(

        datos.error ||

        `Error ${respuesta.status}`

      );

    }


    const texto =
      String(
        datos.respuesta || ''
      ).trim();


    if (
      !texto
    ) {

      throw new Error(
        'El personaje no devolvió una respuesta.'
      );

    }


    historialesChat[tipo].push({

      role:
        'assistant',

      content:
        texto

    });


    agregarMensajeVisualChat(
      'assistant',
      texto
    );


    actualizarEstadoChat(
      '',
      ''
    );


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


    chatEnviando =
      false;


    botonEnviar.disabled =
      false;


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


  if (
    !contenedor
  ) {

    return;

  }


  const mensaje =
    document.createElement(
      'div'
    );


  mensaje.className =
    'chat-mensaje-sistema';


  mensaje.textContent =
    texto;


  contenedor.appendChild(
    mensaje
  );


  desplazarChatAlFinal();

}


// ============================================================
// ESTADO
// ============================================================

function actualizarEstadoChat(
  texto,
  tipo
) {

  const estado =
    document.getElementById(
      'chat-estado'
    );


  if (
    !estado
  ) {

    return;

  }


  estado.textContent =
    texto || '';


  estado.className =
    'chat-estado';


  if (
    tipo
  ) {

    estado.classList.add(
      `chat-estado-${tipo}`
    );

  }

}


// ============================================================
// SCROLL AUTOMÁTICO
// ============================================================

function desplazarChatAlFinal() {

  requestAnimationFrame(
    () => {

      const contenedor =
        document.getElementById(
          'chat-mensajes'
        );


      if (
        contenedor
      ) {

        contenedor.scrollTop =
          contenedor.scrollHeight;

      }

    }
  );

}


// ============================================================
// PAUSAR AUDIOS
// ============================================================

function pausarAudiosLeyendas() {

  document
    .querySelectorAll(
      'audio'
    )
    .forEach(
      audio => {

        try {

          audio.pause();

        } catch {

        }

      }
    );

}


// ============================================================
// DISPONIBILIDAD DEL MICRÓFONO
// ============================================================

function actualizarDisponibilidadMicrofono() {

  const boton =
    document.getElementById(
      'btn-chat-microfono'
    );


  if (
    !boton
  ) {

    return;

  }


  const Reconocimiento =

    window.SpeechRecognition ||

    window.webkitSpeechRecognition;


  boton.disabled =

    !Reconocimiento ||

    chatEnviando;


  if (
    !Reconocimiento
  ) {

    boton.title =
      'El reconocimiento de voz no está disponible en este navegador.';

  } else {

    boton.title =
      'Hablar por micrófono';

  }

}


// ============================================================
// MICRÓFONO
// ============================================================

function usarMicrofonoChat() {

  if (
    !chatTipoActivo ||
    chatEnviando
  ) {

    return;

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


  if (
    reconocimientoChat
  ) {

    const mismoTipo =

      reconocimientoChatTipo ===
      chatTipoActivo;


    detenerMicrofonoChat();


    if (
      mismoTipo
    ) {

      return;

    }

  }


  const tipo =
    chatTipoActivo;


  const reconocimiento =
    new Reconocimiento();


  reconocimiento.lang =

    idiomasVozChat[
      idiomasChat[tipo]
    ] || 'es-BO';


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


      boton.textContent =
        '⏹️';


      actualizarEstadoChat(

        'Escuchando... habla ahora.',

        'cargando'

      );

    };


  reconocimiento.onresult =
    evento => {


      const texto =

        evento
          .results?.[0]?.[0]
          ?.transcript;


      if (
        texto
      ) {

        input.value =
          texto;


        input.focus();


        input.setSelectionRange(

          input.value.length,

          input.value.length

        );

      }

    };


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


      boton.textContent =
        '🎙️';


      if (
        reconocimientoChat ===
        reconocimiento
      ) {

        reconocimientoChat =
          null;


        reconocimientoChatTipo =
          null;

      }


      const estado =
        document.getElementById(
          'chat-estado'
        );


      if (
        estado?.classList.contains(
          'chat-estado-cargando'
        )
      ) {

        actualizarEstadoChat(
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
// DETENER MICRÓFONO
// ============================================================

function detenerMicrofonoChat() {

  if (
    reconocimientoChat
  ) {

    try {

      reconocimientoChat.stop();

    } catch {

    }

  }


  reconocimientoChat =
    null;


  reconocimientoChatTipo =
    null;


  const boton =
    document.getElementById(
      'btn-chat-microfono'
    );


  if (
    boton
  ) {

    boton.classList.remove(
      'escuchando'
    );


    boton.textContent =
      '🎙️';

  }

}


// ============================================================
// LEER RESPUESTA EN VOZ ALTA
// ============================================================

function leerRespuestaChat(
  texto
) {

  if (
    !chatTipoActivo ||
    !('speechSynthesis' in window)
  ) {

    actualizarEstadoChat(

      'La lectura en voz alta no está disponible en este navegador.',

      'aviso'

    );


    return;

  }


  window.speechSynthesis.cancel();


  const utterance =
    new SpeechSynthesisUtterance(
      texto
    );


  utterance.lang =

    idiomasVozChat[
      idiomasChat[
        chatTipoActivo
      ]
    ] || 'es-BO';


  utterance.rate =
    0.96;


  utterance.pitch =
    1;


  const voces =
    window.speechSynthesis.getVoices();


  const prefijo =

    utterance.lang
      .split('-')[0]
      .toLowerCase();


  const vozCompatible =
    voces.find(
      voz => {

        return String(
          voz.lang || ''
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

    utterance.voice =
      vozCompatible;

  }


  window.speechSynthesis.speak(
    utterance
  );

}


// ============================================================
// IDIOMA SELECCIONADO EN AUDIOLIBRO = IDIOMA DEL CHAT
// ============================================================

document.addEventListener(
  'click',
  evento => {


    const botonIdioma =
      evento.target.closest(
        '[data-audio-lang][data-audio-tipo]'
      );


    if (
      !botonIdioma
    ) {

      return;

    }


    const tipo =
      botonIdioma.dataset.audioTipo;


    const idioma =
      botonIdioma.dataset.audioLang;


    if (
      idiomasChat[tipo] !==
      undefined
    ) {

      idiomasChat[tipo] =
        idioma;

    }

  }
);


// ============================================================
// AL CAMBIAR DE LEYENDA
// ============================================================

botonesLeyenda.forEach(
  boton => {

    boton.addEventListener(
      'click',
      () => {


        cerrarChat();


        ocultarBotonChatFlotante();


        chatTipoActivo =
          null;


      }
    );

  }
);


// ============================================================
// CREAR CHAT AL CARGAR
// ============================================================

crearInterfazChat();


actualizarDisponibilidadMicrofono();
