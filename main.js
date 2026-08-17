import './style.css';


// ============================================================
// CONFIGURACIÓN AR
// ============================================================
//
// AHORA NO USAMOS look-controls PARA EL GIROSCOPIO.
//
// Nosotros mismos leemos DeviceOrientationEvent y movemos
// el Guajojó según la dirección física del teléfono.
//
// ============================================================

const CONFIG_AR = {

  // Distancia virtual del ave
  distanciaGuajojo: 3,

  // Tamaño del modelo
  escalaGuajojo: 0.55,

  // El Guajojó aparecerá inicialmente entre
  // 55° y 75° a izquierda o derecha.
  anguloMinimo: 55,
  anguloMaximo: 75,

  // Si faltan menos de estos grados,
  // se habilita CAPTURAR.
  anguloCaptura: 10,

  // Si faltan menos de estos grados,
  // consideramos que ya está visible.
  anguloVisible: 38
};


// ============================================================
// VARIABLES PRINCIPALES
// ============================================================

const btnMenu =
  document.getElementById('btn-menu');

const sidebar =
  document.getElementById('sidebar');

const btnLeyenda1 =
  document.getElementById('btn-leyenda-1');

const btnLeyenda2 =
  document.getElementById('btn-leyenda-2');

const areaTexto =
  document.getElementById('contenido-dinamico');


// ============================================================
// VARIABLES AR
// ============================================================

let streamCamara = null;

let arIniciando = false;

let arActivo = false;


// Orientación
let sensorActivo = false;

let orientacionInicialLista = false;

let headingInicial = 0;

let headingObjetivo = 0;

let ultimoHeading = null;


// Modelo
let modeloGuajojoCargado = false;


// Para comprobar si llegan datos del sensor
let temporizadorSensor = null;


// ============================================================
// MENÚ
// ============================================================

if (btnMenu) {

  btnMenu.addEventListener(
    'click',
    () => {

      if (sidebar) {

        sidebar.classList.toggle(
          'abierto'
        );

      }

    }
  );
}


// ============================================================
// MOSTRAR LEYENDA
// ============================================================

function mostrarLeyenda(
  titulo,
  descripcion,
  contenido = ''
) {

  if (!areaTexto) {
    return;
  }


  areaTexto.innerHTML = `

    <h2>
      ${titulo}
    </h2>

    <p>
      ${descripcion}
    </p>

    ${contenido}

  `;


  if (sidebar) {

    sidebar.classList.remove(
      'abierto'
    );

  }
}


// ============================================================
// LEYENDA DEL CARRETÓN
// ============================================================

if (btnLeyenda1) {

  btnLeyenda1.addEventListener(
    'click',
    () => {

      cerrarCamaraAR();


      mostrarLeyenda(

        'El Carretón de la Otra Vida',

        'Se escucha el crujir de las ruedas de madera acercándose en la oscuridad...',

        `

        <div class="historia-leyenda">

          <h3>
            La Leyenda del Carretón
          </h3>

          <p>
            Cuenta la tradición que durante las noches
            silenciosas puede escucharse el sonido de
            un carretón que avanza por las calles.
          </p>

        </div>

        `
      );

    }
  );
}


// ============================================================
// LEYENDA DEL GUAJOJÓ
// ============================================================

if (btnLeyenda2) {

  btnLeyenda2.addEventListener(
    'click',
    () => {

      cerrarCamaraAR();


      mostrarLeyenda(

        'El Guajojó',

        'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',

        `

        <!-- ================================================= -->
        <!-- BOTÓN ABRIR AR                                    -->
        <!-- ================================================= -->

        <button
          id="btn-abrir-ar"
          class="btn-ver-ar"
          type="button"
        >
          📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
        </button>


        <!-- ================================================= -->
        <!-- PANTALLA AR                                       -->
        <!-- ================================================= -->

        <div
          id="pantalla-ar"
          style="
            display: none;
            position: fixed;
            inset: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            z-index: 9999;
            overflow: hidden;
          "
        >


          <!-- =============================================== -->
          <!-- CÁMARA REAL                                     -->
          <!-- =============================================== -->

          <video
            id="video-camara"
            playsinline
            muted
            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              background: #000000;
              z-index: 1;
            "
          ></video>


          <!-- =============================================== -->
          <!-- CAPA 3D                                         -->
          <!-- =============================================== -->

          <div
            id="capa-modelo"
            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              z-index: 2;
              pointer-events: none;
              overflow: hidden;
            "
          >


            <!-- ============================================= -->
            <!-- ESCENA A-FRAME                                -->
            <!-- ============================================= -->

            <a-scene

              id="escena-guajojo"

              embedded

              vr-mode-ui="
                enabled: false
              "

              renderer="
                alpha: true;
                antialias: true;
                colorManagement: true;
              "

              style="
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                background: transparent !important;
              "

            >


              <!-- =========================================== -->
              <!-- ARCHIVOS                                    -->
              <!-- =========================================== -->

              <a-assets timeout="20000">

                <a-asset-item
                  id="modelo-guajojo-asset"
                  src="/guajojo.glb"
                ></a-asset-item>

              </a-assets>


              <!-- =========================================== -->
              <!-- GUAJOJÓ                                     -->
              <!-- =========================================== -->
              <!--                                             -->
              <!-- IMPORTANTE:                                 -->
              <!--                                             -->
              <!-- Su posición será modificada manualmente     -->
              <!-- mediante los sensores del teléfono.         -->
              <!--                                             -->
              <!-- NO ES HIJO DE LA CÁMARA.                    -->
              <!-- =========================================== -->

              <a-entity

                id="modelo-guajojo"

                gltf-model="#modelo-guajojo-asset"

                position="0 0 -3"

                scale="
                  ${CONFIG_AR.escalaGuajojo}
                  ${CONFIG_AR.escalaGuajojo}
                  ${CONFIG_AR.escalaGuajojo}
                "

                rotation="90 0 0"

                visible="false"

              ></a-entity>


              <!-- =========================================== -->
              <!-- ILUMINACIÓN                                 -->
              <!-- =========================================== -->

              <a-light
                type="ambient"
                color="#ffffff"
                intensity="2.2"
              ></a-light>


              <a-light
                type="directional"
                color="#ffffff"
                intensity="1.5"
                position="1 3 2"
              ></a-light>


              <a-light
                type="directional"
                color="#ffffff"
                intensity="1"
                position="-2 1 -2"
              ></a-light>


              <!-- =========================================== -->
              <!-- CÁMARA VIRTUAL FIJA                         -->
              <!-- =========================================== -->
              <!--                                             -->
              <!-- MUY IMPORTANTE:                             -->
              <!-- look-controls ESTÁ DESACTIVADO.             -->
              <!--                                             -->
              <!-- La cámara virtual ya NO gira con A-Frame.   -->
              <!-- Nosotros moveremos el Guajojó.              -->
              <!-- =========================================== -->

              <a-camera

                id="camara-ar"

                position="0 0 0"

                rotation="0 0 0"

                look-controls="
                  enabled: false
                "

                wasd-controls="
                  enabled: false
                "

                near="0.01"

                far="50"

                fov="70"

              ></a-camera>


            </a-scene>

          </div>


          <!-- =============================================== -->
          <!-- MENSAJE SUPERIOR                                -->
          <!-- =============================================== -->

          <div
            id="mensaje-ar"
            style="
              position: absolute;
              top: 24px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.82);
              color: #ffffff;
              padding: 12px 20px;
              border-radius: 30px;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              width: max-content;
              max-width: 75%;
              z-index: 30;
              pointer-events: none;
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            "
          >

            ⏳ Preparando realidad aumentada...

          </div>


          <!-- =============================================== -->
          <!-- INDICADOR DE SENSOR                             -->
          <!-- =============================================== -->

          <div
            id="estado-sensor"
            style="
              position: absolute;
              top: 88px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.55);
              color: #ffffff;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              text-align: center;
              z-index: 30;
              pointer-events: none;
              white-space: nowrap;
            "
          >

            📡 Esperando sensor...

          </div>


          <!-- =============================================== -->
          <!-- MIRA CENTRAL                                    -->
          <!-- =============================================== -->

          <div
            id="mira-ar"
            style="
              position: absolute;
              left: 50%;
              top: 50%;
              width: 72px;
              height: 72px;
              transform: translate(-50%, -50%);
              border: 2px solid rgba(255,255,255,0.7);
              border-radius: 50%;
              z-index: 20;
              pointer-events: none;
              box-sizing: border-box;
            "
          ></div>


          <div
            style="
              position: absolute;
              left: 50%;
              top: 50%;
              width: 7px;
              height: 7px;
              transform: translate(-50%, -50%);
              background: white;
              border-radius: 50%;
              z-index: 20;
              pointer-events: none;
            "
          ></div>


          <!-- =============================================== -->
          <!-- BOTÓN CAPTURAR                                  -->
          <!-- =============================================== -->

          <button

            id="btn-capturar"

            type="button"

            disabled

            style="
              position: absolute;
              bottom: 38px;
              left: 50%;
              transform: translateX(-50%);
              background: #555555;
              color: #ffffff;
              border: none;
              padding: 16px 30px;
              border-radius: 50px;
              font-size: 17px;
              font-weight: bold;
              z-index: 40;
              opacity: 0.6;
              white-space: nowrap;
              box-shadow: 0 5px 18px rgba(0,0,0,0.5);
              transition: all 0.2s ease;
            "

          >

            👀 Busca al Guajojó...

          </button>


          <!-- =============================================== -->
          <!-- CERRAR                                          -->
          <!-- =============================================== -->

          <button

            id="btn-cerrar-ar"

            type="button"

            aria-label="Cerrar realidad aumentada"

            style="
              position: absolute;
              top: 18px;
              right: 16px;
              width: 48px;
              height: 48px;
              background: rgba(0,0,0,0.75);
              color: white;
              border: none;
              border-radius: 50%;
              font-size: 26px;
              z-index: 50;
            "

          >

            ✕

          </button>


        </div>


        <!-- ================================================= -->
        <!-- CONTENIDO DESBLOQUEADO                            -->
        <!-- ================================================= -->

        <div
          id="contenido-capturado"
          style="
            display: none;
            margin-top: 20px;
          "
        >


          <div
            style="
              background: #e8f5e9;
              border: 2px solid #2e7d32;
              border-radius: 16px;
              padding: 16px;
              text-align: center;
              margin-bottom: 20px;
            "
          >

            <h3
              style="
                color: #1b5e20;
                margin: 0 0 8px 0;
              "
            >

              ✨ ¡CAPTURADO!

            </h3>


            <p
              style="
                margin: 0;
                color: #333333;
              "
            >

              Has descubierto al Guajojó

            </p>

          </div>


          <!-- MULTIMEDIA -->

          <div class="multimedia-leyenda">


            <div class="reproductor-leyenda">

              <h3>
                Escucha su canto original
              </h3>


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
              en una antigua tribu de la selva oriental,
              la hermosa hija del cacique se enamoró
              perdidamente de un joven guerrero.
            </p>

            <br>


            <p>
              Al enterarse de este romance prohibido,
              el cacique enfureció y llevó al joven
              guerrero a lo más profundo de la selva.
            </p>

            <br>


            <p>
              La muchacha salió desesperada en busca
              de su amado y finalmente encontró su
              cuerpo sin vida.
            </p>

            <br>


            <p>
              Su llanto fue tan profundo que los
              espíritus de la selva la transformaron
              en un ave.
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

        `
      );


      // Esperar a que el HTML dinámico exista.
      setTimeout(
        configurarElementosGuajojo,
        100
      );

    }
  );
}


// ============================================================
// CONFIGURAR ELEMENTOS DEL GUAJOJÓ
// ============================================================

function configurarElementosGuajojo() {

  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar'
    );


  const btnCerrar =
    document.getElementById(
      'btn-cerrar-ar'
    );


  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  if (btnAbrir) {

    btnAbrir.onclick =
      iniciarCamaraAR;

  }


  if (btnCerrar) {

    btnCerrar.onclick =
      cerrarCamaraAR;

  }


  // ==========================================================
  // MODELO CARGADO
  // ==========================================================

  if (modelo) {


    modelo.addEventListener(
      'model-loaded',
      () => {

        console.log(
          '✅ guajojo.glb cargado correctamente.'
        );


        modeloGuajojoCargado =
          true;


        if (
          arActivo &&
          orientacionInicialLista
        ) {

          modelo.setAttribute(
            'visible',
            true
          );

          modelo.object3D.visible =
            true;

        }

      }
    );


    modelo.addEventListener(
      'model-error',
      error => {

        console.error(
          '❌ No se pudo cargar guajojo.glb:',
          error
        );


        modeloGuajojoCargado =
          false;


        const mensaje =
          document.getElementById(
            'mensaje-ar'
          );


        if (mensaje) {

          mensaje.innerText =
            '❌ Error cargando guajojo.glb';

        }

      }
    );


    // Si ya existe el mesh,
    // significa que cargó antes de registrar el evento.
    setTimeout(
      () => {

        if (
          modelo.getObject3D('mesh')
        ) {

          modeloGuajojoCargado =
            true;

          console.log(
            '✅ Modelo ya estaba cargado.'
          );

        }

      },
      1000
    );

  }
}


// ============================================================
// CONVERTIR GRADOS A RADIANES
// ============================================================

function gradosARadianes(
  grados
) {

  return grados *
    Math.PI /
    180;

}


// ============================================================
// NORMALIZAR UN ÁNGULO A -180 ... +180
// ============================================================

function normalizarAngulo(
  grados
) {

  while (
    grados > 180
  ) {

    grados -= 360;

  }


  while (
    grados < -180
  ) {

    grados += 360;

  }


  return grados;
}


// ============================================================
// OBTENER ÁNGULO DE LA PANTALLA
// ============================================================

function obtenerOrientacionPantalla() {

  if (
    screen.orientation &&
    typeof screen.orientation.angle ===
      'number'
  ) {

    return screen.orientation.angle;

  }


  if (
    typeof window.orientation ===
      'number'
  ) {

    return window.orientation;

  }


  return 0;
}


// ============================================================
// OBTENER HEADING REAL A PARTIR DE alpha beta gamma
// ============================================================
//
// Aquí convertimos DeviceOrientationEvent a un quaternion
// compatible con THREE.js.
//
// Después calculamos hacia qué dirección "mira" el teléfono.
//
// De esta manera NO dependemos de look-controls.
//
// ============================================================

function obtenerHeadingDesdeSensor(
  alpha,
  beta,
  gamma
) {

  const THREE =
    AFRAME.THREE;


  // Pasar a radianes
  const alphaRad =
    gradosARadianes(
      alpha || 0
    );


  const betaRad =
    gradosARadianes(
      beta || 0
    );


  const gammaRad =
    gradosARadianes(
      gamma || 0
    );


  const orientacionPantalla =
    gradosARadianes(
      obtenerOrientacionPantalla()
    );


  // ==========================================================
  // Mismo sistema de conversión utilizado habitualmente
  // para transformar orientación física a WebGL.
  // ==========================================================

  const euler =
    new THREE.Euler();


  const quaternion =
    new THREE.Quaternion();


  const correccionPantalla =
    new THREE.Quaternion();


  const ejeZ =
    new THREE.Vector3(
      0,
      0,
      1
    );


  // Rotación correctora:
  // teléfono vertical -> cámara mirando hacia delante
  const correccionCamara =
    new THREE.Quaternion(
      -Math.sqrt(0.5),
      0,
      0,
      Math.sqrt(0.5)
    );


  euler.set(

    betaRad,

    alphaRad,

    -gammaRad,

    'YXZ'

  );


  quaternion.setFromEuler(
    euler
  );


  quaternion.multiply(
    correccionCamara
  );


  correccionPantalla.setFromAxisAngle(

    ejeZ,

    -orientacionPantalla

  );


  quaternion.multiply(
    correccionPantalla
  );


  // ==========================================================
  // DIRECCIÓN HACIA DELANTE
  // ==========================================================

  const frente =
    new THREE.Vector3(
      0,
      0,
      -1
    );


  frente.applyQuaternion(
    quaternion
  );


  // Ignoramos altura.
  // Solo queremos giro alrededor del usuario.
  frente.y =
    0;


  if (
    frente.lengthSq() <
    0.0001
  ) {

    return null;

  }


  frente.normalize();


  // ==========================================================
  // CONVERTIR VECTOR A ÁNGULO HORIZONTAL
  // ==========================================================

  const heading =
    Math.atan2(
      frente.x,
      -frente.z
    ) *
    180 /
    Math.PI;


  return normalizarAngulo(
    heading
  );
}


// ============================================================
// EVENTO DE ORIENTACIÓN DEL CELULAR
// ============================================================

function manejarOrientacion(
  event
) {


  if (!arActivo) {
    return;
  }


  if (
    event.alpha === null ||
    event.beta === null ||
    event.gamma === null
  ) {

    return;

  }


  // Ya sabemos que el sensor funciona.
  sensorActivo =
    true;


  const heading =
    obtenerHeadingDesdeSensor(

      event.alpha,

      event.beta,

      event.gamma

    );


  if (
    heading === null
  ) {

    return;

  }


  ultimoHeading =
    heading;


  // ==========================================================
  // PRIMERA LECTURA
  // ==========================================================
  //
  // Aquí guardamos hacia dónde estaba mirando el usuario
  // cuando empezó AR.
  //
  // ==========================================================

  if (
    !orientacionInicialLista
  ) {


    orientacionInicialLista =
      true;


    headingInicial =
      heading;


    // Elegir izquierda o derecha.
    const lado =
      Math.random() >= 0.5
        ? 1
        : -1;


    // Elegir ángulo 55° - 75°.
    const desplazamiento =
      CONFIG_AR.anguloMinimo +
      Math.random() *
      (
        CONFIG_AR.anguloMaximo -
        CONFIG_AR.anguloMinimo
      );


    headingObjetivo =
      normalizarAngulo(

        headingInicial +
        desplazamiento *
        lado

      );


    console.log(
      '================================'
    );

    console.log(
      '📱 Dirección inicial:',
      headingInicial
    );

    console.log(
      '🦉 Dirección del Guajojó:',
      headingObjetivo
    );

    console.log(
      'Está:',
      lado > 0
        ? 'a la derecha'
        : 'a la izquierda'
    );

    console.log(
      '================================'
    );


    const modelo =
      document.getElementById(
        'modelo-guajojo'
      );


    if (
      modelo &&
      modeloGuajojoCargado
    ) {

      modelo.setAttribute(
        'visible',
        true
      );

      modelo.object3D.visible =
        true;

    }

  }


  // ==========================================================
  // ACTUALIZAR POSICIÓN
  // ==========================================================

  actualizarPosicionGuajojo(
    heading
  );

}


// ============================================================
// ACTUALIZAR POSICIÓN DEL GUAJOJÓ
// ============================================================
//
// ESTA ES LA PARTE MÁS IMPORTANTE.
//
// El Guajojó NO gira junto con la cámara.
//
// Calculamos cuántos grados faltan para llegar a él.
//
// Ejemplo:
//
// objetivo: 100°
// móvil:     40°
//
// faltan:    60°
//
// entonces el Guajojó está a la derecha.
//
// Cuando el móvil llega a 100°:
//
// diferencia = 0°
//
// Guajojó queda justo en:
//
// x = 0
// z = -3
//
// o sea, DELANTE DE LA CÁMARA.
//
// ============================================================

function actualizarPosicionGuajojo(
  headingActual
) {

  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  const mensaje =
    document.getElementById(
      'mensaje-ar'
    );


  const estadoSensor =
    document.getElementById(
      'estado-sensor'
    );


  const btnCapturar =
    document.getElementById(
      'btn-capturar'
    );


  if (
    !modelo ||
    !mensaje ||
    !estadoSensor ||
    !btnCapturar ||
    !orientacionInicialLista
  ) {

    return;

  }


  // ==========================================================
  // CUÁNTOS GRADOS FALTAN
  // ==========================================================

  const diferencia =
    normalizarAngulo(

      headingObjetivo -
      headingActual

    );


  const gradosRestantes =
    Math.abs(
      diferencia
    );


  // ==========================================================
  // CALCULAR POSICIÓN DEL MODELO
  // ==========================================================

  const radianes =
    gradosARadianes(
      diferencia
    );


  const distancia =
    CONFIG_AR.distanciaGuajojo;


  // El modelo se mueve alrededor de nosotros.
  const x =
    Math.sin(
      radianes
    ) *
    distancia;


  const z =
    -Math.cos(
      radianes
    ) *
    distancia;


  // ==========================================================
  // APLICAR POSICIÓN
  // ==========================================================

  modelo.object3D.position.set(

    x,

    0,

    z

  );


  modelo.object3D.updateMatrixWorld(
    true
  );


  // ==========================================================
  // MOSTRAR MODELO
  // ==========================================================

  if (
    modeloGuajojoCargado
  ) {

    modelo.object3D.visible =
      true;

  }


  // ==========================================================
  // DEBUG DEL SENSOR
  // ==========================================================

  estadoSensor.innerText =

    '📡 Sensor activo · faltan ' +

    Math.round(
      gradosRestantes
    ) +

    '°';


  // ==========================================================
  // ESTÁ CENTRADO
  // ==========================================================

  if (
    gradosRestantes <=
    CONFIG_AR.anguloCaptura
  ) {


    mensaje.innerText =
      '🦉 ¡Encontraste al Guajojó!';


    btnCapturar.disabled =
      false;


    btnCapturar.style.background =
      '#1b5e20';


    btnCapturar.style.opacity =
      '1';


    btnCapturar.innerText =
      '✨ CAPTURAR';


    return;

  }


  // ==========================================================
  // ESTÁ CERCA / YA DEBERÍA VERSE
  // ==========================================================

  if (
    gradosRestantes <=
    CONFIG_AR.anguloVisible
  ) {


    mensaje.innerText =

      diferencia > 0

        ? '🦉 El Guajojó está un poco a la derecha'

        : '🦉 El Guajojó está un poco a la izquierda';


    btnCapturar.disabled =
      true;


    btnCapturar.style.background =
      '#777777';


    btnCapturar.style.opacity =
      '0.8';


    btnCapturar.innerText =
      '🎯 Centra al Guajojó';


    return;

  }


  // ==========================================================
  // ESTÁ LEJOS DE LA VISTA
  // ==========================================================

  btnCapturar.disabled =
    true;


  btnCapturar.style.background =
    '#555555';


  btnCapturar.style.opacity =
    '0.6';


  btnCapturar.innerText =
    '👀 Busca al Guajojó...';


  if (
    diferencia > 0
  ) {

    mensaje.innerText =

      '➡️ Guajojó a la derecha · ' +

      Math.round(
        gradosRestantes
      ) +

      '°';

  } else {

    mensaje.innerText =

      '⬅️ Guajojó a la izquierda · ' +

      Math.round(
        gradosRestantes
      ) +

      '°';

  }

}


// ============================================================
// PEDIR PERMISO DE ORIENTACIÓN
// ============================================================

async function pedirPermisoOrientacion() {

  try {


    // iOS y navegadores que requieren permiso explícito.
    if (

      typeof DeviceOrientationEvent !==
        'undefined' &&

      typeof DeviceOrientationEvent
        .requestPermission ===
        'function'

    ) {


      const resultado =
        await DeviceOrientationEvent
          .requestPermission();


      return resultado ===
        'granted';

    }


    // Android normalmente entra aquí.
    return true;


  } catch (error) {


    console.error(
      'Error permiso orientación:',
      error
    );


    return false;

  }
}


// ============================================================
// ESPERAR VIDEO
// ============================================================

function esperarVideoListo(
  video
) {

  return new Promise(
    (
      resolve,
      reject
    ) => {


      if (
        video.readyState >= 1
      ) {

        resolve();

        return;

      }


      let terminado =
        false;


      const limpiar =
        () => {


          video.removeEventListener(
            'loadedmetadata',
            listo
          );


          video.removeEventListener(
            'canplay',
            listo
          );


          video.removeEventListener(
            'error',
            errorVideo
          );

        };


      const listo =
        () => {


          if (terminado) {
            return;
          }


          terminado =
            true;


          limpiar();


          resolve();

        };


      const errorVideo =
        () => {


          if (terminado) {
            return;
          }


          terminado =
            true;


          limpiar();


          reject(
            new Error(
              'No se pudo preparar el video de la cámara.'
            )
          );

        };


      video.addEventListener(
        'loadedmetadata',
        listo,
        {
          once: true
        }
      );


      video.addEventListener(
        'canplay',
        listo,
        {
          once: true
        }
      );


      video.addEventListener(
        'error',
        errorVideo,
        {
          once: true
        }
      );


      setTimeout(
        () => {

          if (
            !terminado &&
            video.readyState >= 1
          ) {

            listo();

          }

        },
        2000
      );

    }
  );
}


// ============================================================
// REPRODUCIR VIDEO SEGURO
// ============================================================

async function reproducirVideoSeguro(
  video
) {

  try {


    const promesa =
      video.play();


    if (
      promesa !== undefined
    ) {

      await promesa;

    }


  } catch (error) {


    console.warn(
      'Primer intento play():',
      error
    );


    if (

      error.name ===
        'AbortError' ||

      String(
        error.message
      ).includes(
        'interrupted'
      )

    ) {


      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            200
          )
      );


      if (
        video.srcObject
      ) {

        await video.play();

      }


      return;

    }


    throw error;

  }
}


// ============================================================
// INICIAR AR
// ============================================================

async function iniciarCamaraAR() {


  if (
    arIniciando ||
    arActivo
  ) {

    return;

  }


  arIniciando =
    true;


  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  const video =
    document.getElementById(
      'video-camara'
    );


  const mensaje =
    document.getElementById(
      'mensaje-ar'
    );


  const estadoSensor =
    document.getElementById(
      'estado-sensor'
    );


  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar'
    );


  const btnCerrar =
    document.getElementById(
      'btn-cerrar-ar'
    );


  const btnCapturar =
    document.getElementById(
      'btn-capturar'
    );


  const escena =
    document.getElementById(
      'escena-guajojo'
    );


  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  if (
    !pantalla ||
    !video ||
    !escena
  ) {

    arIniciando =
      false;

    return;

  }


  try {


    if (btnAbrir) {

      btnAbrir.disabled =
        true;

    }


    // ========================================================
    // 1. PEDIR PERMISO DEL SENSOR
    // ========================================================

    const permiso =
      await pedirPermisoOrientacion();


    if (!permiso) {


      throw new Error(
        'Debes permitir el acceso a los sensores de movimiento.'
      );

    }


    // ========================================================
    // 2. REINICIAR VARIABLES
    // ========================================================

    sensorActivo =
      false;


    orientacionInicialLista =
      false;


    ultimoHeading =
      null;


    headingInicial =
      0;


    headingObjetivo =
      0;


    // ========================================================
    // 3. OCULTAR MODELO
    // ========================================================

    if (modelo) {


      modelo.setAttribute(
        'visible',
        false
      );


      modelo.object3D.visible =
        false;


      modelo.object3D.position.set(
        0,
        0,
        -3
      );

    }


    // ========================================================
    // 4. MOSTRAR AR
    // ========================================================

    pantalla.style.display =
      'block';


    document.body.style.overflow =
      'hidden';


    arActivo =
      true;


    if (mensaje) {

      mensaje.innerText =
        '📡 Detectando movimiento del celular...';

    }


    if (estadoSensor) {

      estadoSensor.innerText =
        '📡 Esperando sensor...';

    }


    if (btnCapturar) {


      btnCapturar.disabled =
        true;


      btnCapturar.style.background =
        '#555555';


      btnCapturar.style.opacity =
        '0.6';


      btnCapturar.innerText =
        '👀 Busca al Guajojó...';

    }


    // ========================================================
    // 5. ACTIVAR SENSOR MANUAL
    // ========================================================

    window.removeEventListener(
      'deviceorientation',
      manejarOrientacion,
      true
    );


    window.addEventListener(
      'deviceorientation',
      manejarOrientacion,
      true
    );


    // ========================================================
    // 6. COMPROBAR SI EL SENSOR RESPONDE
    // ========================================================

    if (temporizadorSensor) {

      clearTimeout(
        temporizadorSensor
      );

    }


    temporizadorSensor =
      setTimeout(
        () => {


          if (
            arActivo &&
            !sensorActivo
          ) {


            if (mensaje) {

              mensaje.innerText =
                '⚠️ No llegan datos del sensor';

            }


            if (estadoSensor) {

              estadoSensor.innerText =
                '❌ Giroscopio/orientación no detectados';

            }

          }

        },
        3000
      );


    // ========================================================
    // 7. DETENER STREAM ANTERIOR
    // ========================================================

    if (streamCamara) {


      streamCamara
        .getTracks()
        .forEach(
          track => {

            track.stop();

          }
        );


      streamCamara =
        null;

    }


    // ========================================================
    // 8. VERIFICAR API DE CÁMARA
    // ========================================================

    if (

      !navigator.mediaDevices ||

      !navigator.mediaDevices
        .getUserMedia

    ) {


      throw new Error(
        'Este navegador no permite utilizar la cámara.'
      );

    }


    // ========================================================
    // 9. ABRIR CÁMARA TRASERA
    // ========================================================

    streamCamara =
      await navigator.mediaDevices
        .getUserMedia({

          video: {

            facingMode: {
              ideal:
                'environment'
            },

            width: {
              ideal: 1280
            },

            height: {
              ideal: 720
            }

          },

          audio: false

        });


    // ========================================================
    // 10. CONECTAR VIDEO
    // ========================================================

    video.muted =
      true;


    video.playsInline =
      true;


    video.srcObject =
      streamCamara;


    // ========================================================
    // 11. ESPERAR CÁMARA
    // ========================================================

    await esperarVideoListo(
      video
    );


    // ========================================================
    // 12. REPRODUCIR
    // ========================================================

    await reproducirVideoSeguro(
      video
    );


    // ========================================================
    // 13. HACER A-FRAME TRANSPARENTE
    // ========================================================

    const hacerTransparente =
      () => {


        const canvas =
          escena.querySelector(
            'canvas'
          );


        if (canvas) {


          canvas.style.background =
            'transparent';


          canvas.style.backgroundColor =
            'transparent';

        }


        escena.style.background =
          'transparent';


        escena.style.backgroundColor =
          'transparent';

      };


    if (
      escena.hasLoaded
    ) {

      hacerTransparente();

    } else {


      escena.addEventListener(

        'loaded',

        hacerTransparente,

        {
          once: true
        }

      );

    }


    setTimeout(
      hacerTransparente,
      300
    );


    setTimeout(
      hacerTransparente,
      900
    );


    window.dispatchEvent(
      new Event(
        'resize'
      )
    );


    // ========================================================
    // 14. BOTONES
    // ========================================================

    if (btnCerrar) {

      btnCerrar.onclick =
        cerrarCamaraAR;

    }


    if (btnCapturar) {

      btnCapturar.onclick =
        capturarGuajojo;

    }


    console.log(
      '✅ Cámara AR iniciada.'
    );


  } catch (error) {


    console.error(
      '❌ ERROR AR:',
      error
    );


    cerrarCamaraAR();


    alert(

      'No se pudo iniciar la cámara AR.\n\n' +

      error.message

    );


  } finally {


    arIniciando =
      false;


    if (btnAbrir) {

      btnAbrir.disabled =
        false;

    }

  }
}


// ============================================================
// CAPTURAR GUAJOJÓ
// ============================================================

function capturarGuajojo() {


  const btnCapturar =
    document.getElementById(
      'btn-capturar'
    );


  if (

    !btnCapturar ||

    btnCapturar.disabled

  ) {

    return;

  }


  cerrarCamaraAR();


  // ==========================================================
  // OCULTAR BOTÓN AR
  // ==========================================================

  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar'
    );


  if (btnAbrir) {

    btnAbrir.style.display =
      'none';

  }


  // ==========================================================
  // MOSTRAR CONTENIDO
  // ==========================================================

  const contenido =
    document.getElementById(
      'contenido-capturado'
    );


  if (contenido) {

    contenido.style.display =
      'block';

  }


  // ==========================================================
  // REPRODUCIR AUDIO
  // ==========================================================

  const audio =
    document.getElementById(
      'audio-guajojo'
    );


  if (audio) {


    audio
      .play()
      .catch(
        error => {


          console.warn(
            'No se pudo reproducir el audio:',
            error
          );

        }
      );

  }
}


// ============================================================
// CERRAR AR
// ============================================================

function cerrarCamaraAR() {


  arActivo =
    false;


  arIniciando =
    false;


  orientacionInicialLista =
    false;


  sensorActivo =
    false;


  ultimoHeading =
    null;


  // ==========================================================
  // DETENER TEMPORIZADOR
  // ==========================================================

  if (
    temporizadorSensor
  ) {


    clearTimeout(
      temporizadorSensor
    );


    temporizadorSensor =
      null;

  }


  // ==========================================================
  // QUITAR SENSOR
  // ==========================================================

  window.removeEventListener(

    'deviceorientation',

    manejarOrientacion,

    true

  );


  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  const video =
    document.getElementById(
      'video-camara'
    );


  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  // ==========================================================
  // OCULTAR MODELO
  // ==========================================================

  if (modelo) {


    modelo.setAttribute(
      'visible',
      false
    );


    modelo.object3D.visible =
      false;

  }


  // ==========================================================
  // OCULTAR PANTALLA
  // ==========================================================

  if (pantalla) {

    pantalla.style.display =
      'none';

  }


  // ==========================================================
  // DETENER CÁMARA
  // ==========================================================

  if (streamCamara) {


    streamCamara
      .getTracks()
      .forEach(
        track => {

          track.stop();

        }
      );


    streamCamara =
      null;

  }


  // ==========================================================
  // DESCONECTAR VIDEO
  // ==========================================================

  if (video) {

    video.srcObject =
      null;

  }


  // ==========================================================
  // RESTAURAR SCROLL
  // ==========================================================

  document.body.style.overflow =
    '';

}


// ============================================================
// CERRAR CÁMARA AL SALIR
// ============================================================

window.addEventListener(
  'beforeunload',
  () => {


    if (streamCamara) {


      streamCamara
        .getTracks()
        .forEach(
          track => {

            track.stop();

          }
        );

    }

  }
);
