import './style.css';

const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');

const btnLeyenda1 = document.getElementById('btn-leyenda-1');
const btnLeyenda2 = document.getElementById('btn-leyenda-2');

const areaTexto = document.getElementById('contenido-dinamico');


// =====================================================
// MENÚ
// =====================================================

btnMenu.addEventListener('click', () => {
  sidebar.classList.toggle('abierto');
});


// =====================================================
// MOSTRAR CONTENIDO
// =====================================================

function mostrarLeyenda(titulo, descripcion, contenido = '') {

  areaTexto.innerHTML = `
    <h2>${titulo}</h2>

    <p>${descripcion}</p>

    ${contenido}
  `;

  sidebar.classList.remove('abierto');
}


// =====================================================
// CARRETÓN
// =====================================================

btnLeyenda1.addEventListener('click', () => {

  mostrarLeyenda(
    'El Carretón de la Otra Vida',

    'Se escucha el crujir de las ruedas de madera acercándose en la oscuridad...',

    `
      <div class="historia-leyenda">

        <h3>La Leyenda del Carretón</h3>

        <p>
          Cuenta la tradición que durante las noches
          silenciosas puede escucharse el sonido de un
          carretón que avanza por las calles.
        </p>

      </div>
    `
  );

});


// =====================================================
// GUAJOJÓ
// =====================================================

btnLeyenda2.addEventListener('click', () => {

  mostrarLeyenda(

    'El Guajojó',

    'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',

    `

      <button
        id="btn-abrir-ar"
        class="btn-ver-ar"
        type="button"
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
          "
        >

          <a-assets>

            <a-asset-item
              id="modelo-guajojo"
              src="/guajojo.glb"
            ></a-asset-item>

          </a-assets>


          <a-light
            type="ambient"
            intensity="1.5"
          ></a-light>


          <a-light
            type="directional"
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
          una joven se enamoró de un guerrero.
        </p>

        <br>

        <p>
          El padre de la joven se opuso a la relación
          y terminó con la vida del guerrero.
        </p>

        <br>

        <p>
          La joven encontró el cuerpo de su amado y
          su dolor fue tan grande que los espíritus
          de la selva la transformaron en un ave.
        </p>

        <br>

        <p>
          Desde entonces su canto puede escucharse
          durante las noches:
          <strong>¡Gua... jo... jó!</strong>
        </p>

      </div>

    `
  );


  // ===================================================
  // BOTÓN AR
  // ===================================================

  setTimeout(() => {

    const botonAR =
      document.getElementById('btn-abrir-ar');

    if (!botonAR) {
      return;
    }

    botonAR.addEventListener(
      'click',
      iniciarAR
    );

  }, 100);

});


// =====================================================
// INICIAR AR
// =====================================================

async function iniciarAR() {

  console.log('Iniciando AR...');


  if (!navigator.xr) {

    alert(
      'Este navegador no proporciona WebXR.'
    );

    return;

  }


  try {

    const compatible =
      await navigator.xr.isSessionSupported(
        'immersive-ar'
      );


    console.log(
      'immersive-ar compatible:',
      compatible
    );


    if (!compatible) {

      alert(
        'Este dispositivo o navegador no soporta immersive-ar.'
      );

      return;

    }


    alert(
      'immersive-ar está disponible.'
    );


  } catch (error) {

    console.error(
      'Error comprobando WebXR:',
      error
    );

    alert(
      'Error comprobando WebXR.'
    );

  }

}
