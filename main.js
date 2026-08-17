import './style.css';


// ============================================================
// CONFIGURACIÓN GENERAL DEL AR
// ============================================================

const CONFIG_AR = {

  // Distancia virtual del Guajojó
  distancia: 3,

  // Tamaño del modelo
  escala: 0.55,

  // El ave aparecerá inicialmente entre 55 y 70 grados
  // respecto a donde estás mirando.
  anguloMin: 55,
  anguloMax: 70,

  // A esta distancia angular debería comenzar a verse
  anguloVisible: 38,

  // A esta distancia angular se habilita CAPTURAR
  anguloCaptura: 9
};


// ============================================================
// ELEMENTOS PRINCIPALES DE LA WEB
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
// VARIABLES GENERALES AR
// ============================================================

let streamCamara = null;

let arActivo = false;
let arIniciando = false;

let modeloCargado = false;


// ============================================================
// VARIABLES DE ORIENTACIÓN
// ============================================================

let orientacionInicialLista = false;

let headingInicial = 0;
let headingObjetivo = 0;
let ultimoHeading = null;

let fuenteHeadingActiva = null;

let sensorDetectado = false;


// ============================================================
// SENSORES GENERIC SENSOR
// ============================================================

let sensorAcelerometro = null;
let sensorGiroscopio = null;
let sensorOrientacionRelativa = null;


// ============================================================
// TEMPORIZADORES
// ============================================================

let timeoutDiagnostico = null;


// ============================================================
// ESTADO DEL DIAGNÓSTICO
// ============================================================

const diagnostico = {

  contextoSeguro: 'pendiente',

  deviceOrientationAPI: 'pendiente',

  deviceMotionAPI: 'pendiente',

  requestOrientation: 'pendiente',

  requestMotion: 'pendiente',

  permisoAcelerometro: 'pendiente',

  permisoGiroscopio: 'pendiente',

  permisoMagnetometro: 'pendiente',

  eventoOrientacion: 'esperando',

  eventoMovimiento: 'esperando',

  acelerometroAPI: 'pendiente',

  giroscopioAPI: 'pendiente',

  relativeOrientationAPI: 'pendiente',

  modelo: 'pendiente'
};


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
// LEYENDA 1: CARRETÓN
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
// LEYENDA 2: GUAJOJÓ
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
        <!-- BOTÓN PARA ABRIR AR                               -->
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
              <!-- MODELO GUAJOJÓ                              -->
              <!-- =========================================== -->

              <a-entity

                id="modelo-guajojo"

                gltf-model="#modelo-guajojo-asset"

                position="0 0 -3"

                scale="
                  ${CONFIG_AR.escala}
                  ${CONFIG_AR.escala}
                  ${CONFIG_AR.escala}
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

                intensity="2.5"

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
              <!--                                            -->
              <!-- NO usamos look-controls.                   -->
              <!-- Nosotros calculamos el giro manualmente.   -->
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
          <!-- MENSAJE PRINCIPAL                               -->
          <!-- =============================================== -->

          <div

            id="mensaje-ar"

            style="
              position: absolute;
              top: 18px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.85);
              color: #ffffff;
              padding: 11px 18px;
              border-radius: 28px;
              font-size: 15px;
              font-weight: bold;
              text-align: center;
              width: max-content;
              max-width: 68%;
              z-index: 50;
              pointer-events: none;
              box-shadow: 0 4px 14px rgba(0,0,0,0.4);
            "

          >

            ⏳ Iniciando realidad aumentada...

          </div>


          <!-- =============================================== -->
          <!-- BOTÓN CERRAR                                    -->
          <!-- =============================================== -->

          <button

            id="btn-cerrar-ar"

            type="button"

            aria-label="Cerrar realidad aumentada"

            style="
              position: absolute;
              top: 14px;
              right: 14px;
              width: 48px;
              height: 48px;
              background: rgba(0,0,0,0.78);
              color: #ffffff;
              border: none;
              border-radius: 50%;
              font-size: 27px;
              z-index: 80;
            "

          >

            ✕

          </button>


          <!-- =============================================== -->
          <!-- PANEL DE DIAGNÓSTICO                            -->
          <!-- =============================================== -->

          <div

            id="panel-diagnostico"

            style="
              position: absolute;
              top: 78px;
              left: 12px;
              right: 12px;
              background: rgba(0,0,0,0.72);
              color: #ffffff;
              border-radius: 14px;
              padding: 10px 12px;
              font-family: monospace;
              font-size: 11px;
              line-height: 1.45;
              z-index: 45;
              pointer-events: none;
              max-height: 195px;
              overflow: hidden;
              box-sizing: border-box;
            "

          >

            🔬 Diagnóstico iniciando...

          </div>


          <!-- =============================================== -->
          <!-- MIRA CENTRAL                                    -->
          <!-- =============================================== -->

          <div

            style="
              position: absolute;
              left: 50%;
              top: 50%;
              width: 72px;
              height: 72px;
              transform: translate(-50%, -50%);
              border: 2px solid rgba(255,255,255,0.75);
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
              background: #ffffff;
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
              z-index: 60;
              opacity: 0.6;
              white-space: nowrap;
              box-shadow: 0 5px 18px rgba(0,0,0,0.5);
              transition: all 0.2s ease;
            "

          >

            👀 Busca al Guajojó...

          </button>


        </div>


        <!-- ================================================= -->
        <!-- CONTENIDO DESPUÉS DE CAPTURAR                     -->
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


      // Esperamos a que el HTML dinámico exista.
      setTimeout(
        configurarGuajojo,
        100
      );

    }
  );

}


// ============================================================
// CONFIGURAR BOTONES Y MODELO
// ============================================================

function configurarGuajojo() {

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


  if (modelo) {

    // ========================================================
    // MODELO CARGADO
    // ========================================================

    modelo.addEventListener(
      'model-loaded',
      () => {

        console.log(
          '✅ guajojo.glb cargado'
        );


        modeloCargado =
          true;


        diagnostico.modelo =
          'OK';


        actualizarPanelDiagnostico();


        if (
          arActivo &&
          orientacionInicialLista &&
          ultimoHeading !== null
        ) {

          mostrarModelo();

          actualizarGuajojo(
            ultimoHeading
          );

        }

      }
    );


    // ========================================================
    // ERROR CARGANDO MODELO
    // ========================================================

    modelo.addEventListener(
      'model-error',
      error => {

        console.error(
          '❌ Error cargando guajojo.glb:',
          error
        );


        modeloCargado =
          false;


        diagnostico.modelo =
          'ERROR';


        actualizarPanelDiagnostico();


        const mensaje =
          document.getElementById(
            'mensaje-ar'
          );


        if (mensaje) {

          mensaje.innerText =
            '❌ No se pudo cargar guajojo.glb';

        }

      }
    );


    // ========================================================
    // COMPROBAR SI YA CARGÓ ANTES DEL LISTENER
    // ========================================================

    setTimeout(
      () => {

        if (
          modelo.getObject3D(
            'mesh'
          )
        ) {

          modeloCargado =
            true;

          diagnostico.modelo =
            'OK';

          actualizarPanelDiagnostico();

        }

      },
      1000
    );

  }

}


// ============================================================
// REINICIAR DIAGNÓSTICO
// ============================================================

function reiniciarDiagnostico() {

  diagnostico.contextoSeguro =
    window.isSecureContext
      ? 'OK'
      : 'NO';


  diagnostico.deviceOrientationAPI =
    typeof DeviceOrientationEvent !== 'undefined'
      ? 'SÍ'
      : 'NO';


  diagnostico.deviceMotionAPI =
    typeof DeviceMotionEvent !== 'undefined'
      ? 'SÍ'
      : 'NO';


  diagnostico.requestOrientation =
    'pendiente';


  diagnostico.requestMotion =
    'pendiente';


  diagnostico.permisoAcelerometro =
    'pendiente';


  diagnostico.permisoGiroscopio =
    'pendiente';


  diagnostico.permisoMagnetometro =
    'pendiente';


  diagnostico.eventoOrientacion =
    'esperando';


  diagnostico.eventoMovimiento =
    'esperando';


  diagnostico.acelerometroAPI =
    'pendiente';


  diagnostico.giroscopioAPI =
    'pendiente';


  diagnostico.relativeOrientationAPI =
    'pendiente';


  diagnostico.modelo =
    modeloCargado
      ? 'OK'
      : 'cargando';


  actualizarPanelDiagnostico();

}


// ============================================================
// EMOJI SEGÚN ESTADO
// ============================================================

function iconoEstado(
  valor
) {

  const texto =
    String(valor).toLowerCase();


  if (
    texto === 'ok' ||
    texto === 'sí' ||
    texto === 'granted' ||
    texto === 'lecturas' ||
    texto.includes('activo')
  ) {

    return '✅';

  }


  if (
    texto === 'no' ||
    texto === 'denied' ||
    texto === 'error' ||
    texto.includes('bloqueado') ||
    texto.includes('no soportado')
  ) {

    return '❌';

  }


  return '⏳';

}


// ============================================================
// ACTUALIZAR PANEL DE DIAGNÓSTICO
// ============================================================

function actualizarPanelDiagnostico() {

  const panel =
    document.getElementById(
      'panel-diagnostico'
    );


  if (!panel) {
    return;
  }


  panel.innerHTML = `

    <div>
      🔬 <strong>DIAGNÓSTICO DE SENSORES</strong>
    </div>

    <div>
      ${iconoEstado(diagnostico.contextoSeguro)}
      HTTPS:
      ${diagnostico.contextoSeguro}
    </div>

    <div>
      ${iconoEstado(diagnostico.requestOrientation)}
      Orientation permiso:
      ${diagnostico.requestOrientation}
    </div>

    <div>
      ${iconoEstado(diagnostico.permisoAcelerometro)}
      Acelerómetro:
      ${diagnostico.permisoAcelerometro}
    </div>

    <div>
      ${iconoEstado(diagnostico.permisoGiroscopio)}
      Giroscopio:
      ${diagnostico.permisoGiroscopio}
    </div>

    <div>
      ${iconoEstado(diagnostico.eventoOrientacion)}
      deviceorientation:
      ${diagnostico.eventoOrientacion}
    </div>

    <div>
      ${iconoEstado(diagnostico.eventoMovimiento)}
      devicemotion:
      ${diagnostico.eventoMovimiento}
    </div>

    <div>
      ${iconoEstado(diagnostico.giroscopioAPI)}
      Gyroscope API:
      ${diagnostico.giroscopioAPI}
    </div>

    <div>
      ${iconoEstado(diagnostico.relativeOrientationAPI)}
      RelativeOrientation:
      ${diagnostico.relativeOrientationAPI}
    </div>

    <div>
      ${iconoEstado(diagnostico.modelo)}
      guajojo.glb:
      ${diagnostico.modelo}
    </div>

  `;

}


// ============================================================
// CONSULTAR UN PERMISO CON PERMISSIONS API
// ============================================================

async function consultarPermiso(
  nombre
) {

  try {

    if (
      !navigator.permissions ||
      !navigator.permissions.query
    ) {

      return 'no soportado';

    }


    const resultado =
      await navigator.permissions.query({

        name: nombre

      });


    return resultado.state;


  } catch (error) {

    console.warn(
      `No se pudo consultar permiso ${nombre}:`,
      error
    );


    return 'no consultable';

  }

}


// ============================================================
// SOLICITAR PERMISOS DE DEVICE ORIENTATION
// ============================================================
//
// IMPORTANTE:
//
// Esta función NO hace await entre las dos solicitudes.
//
// Ambas requestPermission() se ejecutan inmediatamente
// mientras todavía existe el toque del usuario.
// ============================================================

function lanzarSolicitudesPermisos() {

  let promesaOrientacion =
    Promise.resolve(
      'no requerida'
    );


  let promesaMovimiento =
    Promise.resolve(
      'no requerida'
    );


  // ==========================================================
  // DEVICE ORIENTATION
  // ==========================================================

  try {

    if (

      typeof DeviceOrientationEvent !==
        'undefined' &&

      typeof DeviceOrientationEvent
        .requestPermission ===
        'function'

    ) {

      promesaOrientacion =
        DeviceOrientationEvent
          .requestPermission(false);

    }

  } catch (error) {

    console.error(
      'Error solicitando DeviceOrientation:',
      error
    );


    promesaOrientacion =
      Promise.resolve(
        'error'
      );

  }


  // ==========================================================
  // DEVICE MOTION
  // ==========================================================

  try {

    if (

      typeof DeviceMotionEvent !==
        'undefined' &&

      typeof DeviceMotionEvent
        .requestPermission ===
        'function'

    ) {

      promesaMovimiento =
        DeviceMotionEvent
          .requestPermission();

    }

  } catch (error) {

    console.error(
      'Error solicitando DeviceMotion:',
      error
    );


    promesaMovimiento =
      Promise.resolve(
        'error'
      );

  }


  return {

    orientacion:
      promesaOrientacion,

    movimiento:
      promesaMovimiento

  };

}


// ============================================================
// PROCESAR RESULTADO DE PROMESA
// ============================================================

function resultadoPromesa(
  resultado
) {

  if (
    resultado.status ===
    'fulfilled'
  ) {

    return String(
      resultado.value
    );

  }


  if (
    resultado.reason &&
    resultado.reason.name
  ) {

    return 'ERROR ' +
      resultado.reason.name;

  }


  return 'ERROR';

}


// ============================================================
// NORMALIZAR ÁNGULO
// ============================================================

function normalizarAngulo(
  angulo
) {

  while (
    angulo > 180
  ) {

    angulo -= 360;

  }


  while (
    angulo < -180
  ) {

    angulo += 360;

  }


  return angulo;

}


// ============================================================
// GRADOS A RADIANES
// ============================================================

function rad(
  grados
) {

  return grados *
    Math.PI /
    180;

}


// ============================================================
// ORIENTACIÓN ACTUAL DE PANTALLA
// ============================================================

function obtenerAnguloPantalla() {

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
// CONVERTIR ALPHA/BETA/GAMMA A HEADING
// ============================================================

function headingDesdeEuler(
  alpha,
  beta,
  gamma
) {

  if (

    typeof alpha !==
      'number' ||

    typeof beta !==
      'number' ||

    typeof gamma !==
      'number'

  ) {

    return null;

  }


  const THREE =
    AFRAME.THREE;


  const euler =
    new THREE.Euler();


  const quaternion =
    new THREE.Quaternion();


  const qPantalla =
    new THREE.Quaternion();


  const ejeZ =
    new THREE.Vector3(
      0,
      0,
      1
    );


  const qCorreccionCamara =
    new THREE.Quaternion(

      -Math.sqrt(0.5),

      0,

      0,

      Math.sqrt(0.5)

    );


  // ==========================================================
  // CONVERSIÓN DEVICEORIENTATION -> THREE.JS
  // ==========================================================

  euler.set(

    rad(beta),

    rad(alpha),

    -rad(gamma),

    'YXZ'

  );


  quaternion.setFromEuler(
    euler
  );


  quaternion.multiply(
    qCorreccionCamara
  );


  qPantalla.setFromAxisAngle(

    ejeZ,

    -rad(
      obtenerAnguloPantalla()
    )

  );


  quaternion.multiply(
    qPantalla
  );


  return headingDesdeQuaternion(
    quaternion
  );

}


// ============================================================
// OBTENER HEADING DESDE QUATERNION
// ============================================================

function headingDesdeQuaternion(
  quaternion
) {

  const frente =
    new AFRAME.THREE.Vector3(
      0,
      0,
      -1
    );


  frente.applyQuaternion(
    quaternion
  );


  // Ignoramos componente vertical.
  frente.y =
    0;


  if (
    frente.lengthSq() <
    0.00001
  ) {

    return null;

  }


  frente.normalize();


  const grados =

    Math.atan2(

      frente.x,

      -frente.z

    ) *

    180 /

    Math.PI;


  return normalizarAngulo(
    grados
  );

}


// ============================================================
// PROCESAR HEADING
// ============================================================

function procesarHeading(
  heading,
  fuente
) {

  if (
    !arActivo ||
    heading === null ||
    Number.isNaN(heading)
  ) {

    return;

  }


  sensorDetectado =
    true;


  ultimoHeading =
    heading;


  // ==========================================================
  // FIJAR FUENTE PRINCIPAL
  // ==========================================================

  if (
    fuenteHeadingActiva ===
    null
  ) {

    fuenteHeadingActiva =
      fuente;


    console.log(
      '📡 Fuente de orientación seleccionada:',
      fuenteHeadingActiva
    );

  }


  // No mezclar sensores diferentes.
  if (
    fuente !==
    fuenteHeadingActiva
  ) {

    return;

  }


  // ==========================================================
  // PRIMERA LECTURA
  // ==========================================================

  if (
    !orientacionInicialLista
  ) {

    orientacionInicialLista =
      true;


    headingInicial =
      heading;


    const lado =
      Math.random() >= 0.5
        ? 1
        : -1;


    const desplazamiento =

      CONFIG_AR.anguloMin +

      Math.random() *

      (
        CONFIG_AR.anguloMax -
        CONFIG_AR.anguloMin
      );


    headingObjetivo =
      normalizarAngulo(

        headingInicial +

        desplazamiento *
        lado

      );


    console.log(
      '=============================='
    );


    console.log(
      '📱 Heading inicial:',
      headingInicial
    );


    console.log(
      '🦉 Heading objetivo:',
      headingObjetivo
    );


    console.log(
      'Dirección:',
      lado > 0
        ? 'derecha'
        : 'izquierda'
    );


    console.log(
      '=============================='
    );


    mostrarModelo();

  }


  actualizarGuajojo(
    heading
  );

}


// ============================================================
// EVENTO DEVICEORIENTATION
// ============================================================

function manejarDeviceOrientation(
  event
) {

  if (!arActivo) {
    return;
  }


  // El evento llegó.
  if (

    event.alpha === null ||
    event.beta === null ||
    event.gamma === null

  ) {

    diagnostico.eventoOrientacion =
      'evento sin datos';


    actualizarPanelDiagnostico();


    return;

  }


  diagnostico.eventoOrientacion =
    'activo';


  actualizarPanelDiagnostico();


  const heading =
    headingDesdeEuler(

      event.alpha,

      event.beta,

      event.gamma

    );


  if (
    heading !== null
  ) {

    procesarHeading(
      heading,
      'deviceorientation'
    );

  }

}


// ============================================================
// EVENTO DEVICEORIENTATIONABSOLUTE
// ============================================================

function manejarDeviceOrientationAbsolute(
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


  const heading =
    headingDesdeEuler(

      event.alpha,

      event.beta,

      event.gamma

    );


  if (
    heading !== null
  ) {

    procesarHeading(
      heading,
      'deviceorientationabsolute'
    );

  }

}


// ============================================================
// EVENTO DEVICEMOTION
// ============================================================

function manejarDeviceMotion(
  event
) {

  if (!arActivo) {
    return;
  }


  const tieneRotacion =

    event.rotationRate &&

    (
      event.rotationRate.alpha !== null ||
      event.rotationRate.beta !== null ||
      event.rotationRate.gamma !== null
    );


  const tieneAceleracion =

    event.accelerationIncludingGravity &&

    (
      event.accelerationIncludingGravity.x !== null ||
      event.accelerationIncludingGravity.y !== null ||
      event.accelerationIncludingGravity.z !== null
    );


  if (
    tieneRotacion ||
    tieneAceleracion
  ) {

    diagnostico.eventoMovimiento =
      'activo';

  } else {

    diagnostico.eventoMovimiento =
      'evento sin datos';

  }


  actualizarPanelDiagnostico();

}


// ============================================================
// ACTIVAR EVENTOS CLÁSICOS
// ============================================================

function activarEventosClasicos() {

  desactivarEventosClasicos();


  window.addEventListener(
    'deviceorientation',
    manejarDeviceOrientation
  );


  window.addEventListener(
    'deviceorientationabsolute',
    manejarDeviceOrientationAbsolute
  );


  window.addEventListener(
    'devicemotion',
    manejarDeviceMotion
  );

}


// ============================================================
// DESACTIVAR EVENTOS CLÁSICOS
// ============================================================

function desactivarEventosClasicos() {

  window.removeEventListener(
    'deviceorientation',
    manejarDeviceOrientation
  );


  window.removeEventListener(
    'deviceorientationabsolute',
    manejarDeviceOrientationAbsolute
  );


  window.removeEventListener(
    'devicemotion',
    manejarDeviceMotion
  );

}


// ============================================================
// PROBAR ACELERÓMETRO
// ============================================================

function probarAcelerometro() {

  if (
    !(
      'Accelerometer'
      in window
    )
  ) {

    diagnostico.acelerometroAPI =
      'no soportado';


    actualizarPanelDiagnostico();


    return;

  }


  try {

    sensorAcelerometro =
      new Accelerometer({

        frequency: 20

      });


    sensorAcelerometro.onreading =
      () => {

        diagnostico.acelerometroAPI =
          'lecturas';


        actualizarPanelDiagnostico();

      };


    sensorAcelerometro.onerror =
      event => {

        const nombre =
          event.error?.name ||
          'Error';


        diagnostico.acelerometroAPI =
          'ERROR ' +
          nombre;


        actualizarPanelDiagnostico();


        console.error(
          'Accelerometer:',
          event.error
        );

      };


    sensorAcelerometro.start();


    diagnostico.acelerometroAPI =
      'iniciado';


  } catch (error) {

    diagnostico.acelerometroAPI =
      'ERROR ' +
      error.name;


    console.error(
      'Accelerometer constructor:',
      error
    );

  }


  actualizarPanelDiagnostico();

}


// ============================================================
// PROBAR GIROSCOPIO
// ============================================================

function probarGiroscopio() {

  if (
    !(
      'Gyroscope'
      in window
    )
  ) {

    diagnostico.giroscopioAPI =
      'no soportado';


    actualizarPanelDiagnostico();


    return;

  }


  try {

    sensorGiroscopio =
      new Gyroscope({

        frequency: 20

      });


    sensorGiroscopio.onreading =
      () => {

        diagnostico.giroscopioAPI =
          'lecturas';


        actualizarPanelDiagnostico();

      };


    sensorGiroscopio.onerror =
      event => {

        const nombre =
          event.error?.name ||
          'Error';


        diagnostico.giroscopioAPI =
          'ERROR ' +
          nombre;


        actualizarPanelDiagnostico();


        console.error(
          'Gyroscope:',
          event.error
        );

      };


    sensorGiroscopio.start();


    diagnostico.giroscopioAPI =
      'iniciado';


  } catch (error) {

    diagnostico.giroscopioAPI =
      'ERROR ' +
      error.name;


    console.error(
      'Gyroscope constructor:',
      error
    );

  }


  actualizarPanelDiagnostico();

}


// ============================================================
// PROBAR RELATIVE ORIENTATION SENSOR
// ============================================================

function probarRelativeOrientationSensor() {

  if (
    !(
      'RelativeOrientationSensor'
      in window
    )
  ) {

    diagnostico.relativeOrientationAPI =
      'no soportado';


    actualizarPanelDiagnostico();


    return;

  }


  try {

    sensorOrientacionRelativa =
      new RelativeOrientationSensor({

        frequency: 30,

        referenceFrame: 'screen'

      });


    sensorOrientacionRelativa.onreading =
      () => {

        diagnostico.relativeOrientationAPI =
          'lecturas';


        actualizarPanelDiagnostico();


        if (

          !sensorOrientacionRelativa ||
          !sensorOrientacionRelativa.quaternion

        ) {

          return;

        }


        const datos =
          sensorOrientacionRelativa.quaternion;


        const quaternion =
          new AFRAME.THREE.Quaternion(

            datos[0],

            datos[1],

            datos[2],

            datos[3]

          );


        const heading =
          headingDesdeQuaternion(
            quaternion
          );


        if (
          heading !== null
        ) {

          procesarHeading(
            heading,
            'RelativeOrientationSensor'
          );

        }

      };


    sensorOrientacionRelativa.onerror =
      event => {

        const nombre =
          event.error?.name ||
          'Error';


        diagnostico.relativeOrientationAPI =
          'ERROR ' +
          nombre;


        actualizarPanelDiagnostico();


        console.error(
          'RelativeOrientationSensor:',
          event.error
        );

      };


    sensorOrientacionRelativa.start();


    diagnostico.relativeOrientationAPI =
      'iniciado';


  } catch (error) {

    diagnostico.relativeOrientationAPI =
      'ERROR ' +
      error.name;


    console.error(
      'RelativeOrientationSensor constructor:',
      error
    );

  }


  actualizarPanelDiagnostico();

}


// ============================================================
// INICIAR SENSORES GENERIC SENSOR
// ============================================================

function iniciarSensoresGenericos() {

  detenerSensoresGenericos();


  probarAcelerometro();

  probarGiroscopio();

  probarRelativeOrientationSensor();

}


// ============================================================
// DETENER SENSORES GENERIC SENSOR
// ============================================================

function detenerSensoresGenericos() {

  if (sensorAcelerometro) {

    try {

      sensorAcelerometro.stop();

    } catch (error) {

      console.warn(
        error
      );

    }


    sensorAcelerometro =
      null;

  }


  if (sensorGiroscopio) {

    try {

      sensorGiroscopio.stop();

    } catch (error) {

      console.warn(
        error
      );

    }


    sensorGiroscopio =
      null;

  }


  if (
    sensorOrientacionRelativa
  ) {

    try {

      sensorOrientacionRelativa.stop();

    } catch (error) {

      console.warn(
        error
      );

    }


    sensorOrientacionRelativa =
      null;

  }

}


// ============================================================
// MOSTRAR MODELO
// ============================================================

function mostrarModelo() {

  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  if (
    !modelo ||
    !modeloCargado
  ) {

    return;

  }


  modelo.setAttribute(
    'visible',
    true
  );


  modelo.object3D.visible =
    true;


  modelo.object3D
    .updateMatrixWorld(
      true
    );

}


// ============================================================
// ACTUALIZAR POSICIÓN GUAJOJÓ
// ============================================================

function actualizarGuajojo(
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


  const btnCapturar =
    document.getElementById(
      'btn-capturar'
    );


  if (

    !modelo ||
    !mensaje ||
    !btnCapturar ||
    !orientacionInicialLista

  ) {

    return;

  }


  // ==========================================================
  // DIFERENCIA ANGULAR
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
  // POSICIÓN DEL GUAJOJÓ ALREDEDOR DE LA CÁMARA
  // ==========================================================

  const angulo =
    rad(
      diferencia
    );


  const x =

    Math.sin(
      angulo
    ) *

    CONFIG_AR.distancia;


  const z =

    -Math.cos(
      angulo
    ) *

    CONFIG_AR.distancia;


  modelo.object3D.position.set(

    x,

    0,

    z

  );


  modelo.object3D
    .updateMatrixWorld(
      true
    );


  if (modeloCargado) {

    modelo.object3D.visible =
      true;

  }


  // ==========================================================
  // ENCONTRADO
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
  // CERCA
  // ==========================================================

  if (
    gradosRestantes <=
    CONFIG_AR.anguloVisible
  ) {

    btnCapturar.disabled =
      true;


    btnCapturar.style.background =
      '#777777';


    btnCapturar.style.opacity =
      '0.85';


    btnCapturar.innerText =
      '🎯 Centra al Guajojó';


    if (
      diferencia > 0
    ) {

      mensaje.innerText =

        '🦉 Un poco más a la derecha · ' +

        Math.round(
          gradosRestantes
        ) +

        '°';

    } else {

      mensaje.innerText =

        '🦉 Un poco más a la izquierda · ' +

        Math.round(
          gradosRestantes
        ) +

        '°';

    }


    return;

  }


  // ==========================================================
  // LEJOS
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

      '➡️ Gira a la derecha · ' +

      Math.round(
        gradosRestantes
      ) +

      '°';

  } else {

    mensaje.innerText =

      '⬅️ Gira a la izquierda · ' +

      Math.round(
        gradosRestantes
      ) +

      '°';

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
// REPRODUCIR VIDEO DE FORMA SEGURA
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
      'Primer play():',
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
// ABRIR REALIDAD AUMENTADA
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


  const escena =
    document.getElementById(
      'escena-guajojo'
    );


  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  const mensaje =
    document.getElementById(
      'mensaje-ar'
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


  if (
    !pantalla ||
    !video ||
    !escena
  ) {

    arIniciando =
      false;

    return;

  }


  if (btnAbrir) {

    btnAbrir.disabled =
      true;

  }


  // ==========================================================
  // MUY IMPORTANTE
  //
  // Estas solicitudes se lanzan ANTES de cualquier await.
  // Así todavía estamos dentro del clic del usuario.
  // ==========================================================

  const solicitudesPermiso =
    lanzarSolicitudesPermisos();


  try {

    // ========================================================
    // 1. MOSTRAR PANTALLA AR
    // ========================================================

    pantalla.style.display =
      'block';


    document.body.style.overflow =
      'hidden';


    arActivo =
      true;


    // ========================================================
    // 2. REINICIAR VARIABLES
    // ========================================================

    sensorDetectado =
      false;


    orientacionInicialLista =
      false;


    headingInicial =
      0;


    headingObjetivo =
      0;


    ultimoHeading =
      null;


    fuenteHeadingActiva =
      null;


    reiniciarDiagnostico();


    if (mensaje) {

      mensaje.innerText =
        '🔐 Comprobando permisos de sensores...';

    }


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

        -CONFIG_AR.distancia

      );

    }


    // ========================================================
    // 4. ESPERAR RESULTADOS requestPermission
    // ========================================================

    const resultadosPermiso =
      await Promise.allSettled([

        solicitudesPermiso.orientacion,

        solicitudesPermiso.movimiento

      ]);


    diagnostico.requestOrientation =
      resultadoPromesa(
        resultadosPermiso[0]
      );


    diagnostico.requestMotion =
      resultadoPromesa(
        resultadosPermiso[1]
      );


    actualizarPanelDiagnostico();


    // ========================================================
    // 5. CONSULTAR PERMISSIONS API
    // ========================================================

    const permisos =
      await Promise.all([

        consultarPermiso(
          'accelerometer'
        ),

        consultarPermiso(
          'gyroscope'
        ),

        consultarPermiso(
          'magnetometer'
        )

      ]);


    diagnostico.permisoAcelerometro =
      permisos[0];


    diagnostico.permisoGiroscopio =
      permisos[1];


    diagnostico.permisoMagnetometro =
      permisos[2];


    actualizarPanelDiagnostico();


    // ========================================================
    // 6. ACTIVAR EVENTOS DEVICEORIENTATION / DEVICEMOTION
    // ========================================================

    activarEventosClasicos();


    // ========================================================
    // 7. PROBAR GENERIC SENSOR
    // ========================================================

    iniciarSensoresGenericos();


    // ========================================================
    // 8. REVISAR SI ALGÚN SENSOR RESPONDE
    // ========================================================

    if (timeoutDiagnostico) {

      clearTimeout(
        timeoutDiagnostico
      );

    }


    timeoutDiagnostico =
      setTimeout(
        () => {

          if (
            !arActivo
          ) {

            return;

          }


          if (
            !sensorDetectado
          ) {

            const mensajeActual =
              document.getElementById(
                'mensaje-ar'
              );


            if (mensajeActual) {

              mensajeActual.innerText =
                '⚠️ No hay orientación utilizable · revisa diagnóstico';

            }

          }

        },
        4500
      );


    // ========================================================
    // 9. ABRIR CÁMARA
    // ========================================================

    if (streamCamara) {

      streamCamara
        .getTracks()
        .forEach(
          track =>
            track.stop()
        );


      streamCamara =
        null;

    }


    if (

      !navigator.mediaDevices ||

      !navigator.mediaDevices
        .getUserMedia

    ) {

      throw new Error(
        'Este navegador no permite utilizar la cámara.'
      );

    }


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


    video.muted =
      true;


    video.playsInline =
      true;


    video.srcObject =
      streamCamara;


    await esperarVideoListo(
      video
    );


    await reproducirVideoSeguro(
      video
    );


    // ========================================================
    // 10. HACER TRANSPARENTE EL CANVAS DE A-FRAME
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
    // 11. CONFIGURAR BOTONES
    // ========================================================

    if (btnCerrar) {

      btnCerrar.onclick =
        cerrarCamaraAR;

    }


    if (btnCapturar) {

      btnCapturar.onclick =
        capturarGuajojo;

    }


    if (mensaje) {

      mensaje.innerText =
        '📡 Mueve y gira el celular';

    }


  } catch (error) {

    console.error(
      '❌ ERROR AR:',
      error
    );


    cerrarCamaraAR();


    alert(

      'No se pudo iniciar la realidad aumentada.\n\n' +

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
// CERRAR REALIDAD AUMENTADA
// ============================================================

function cerrarCamaraAR() {

  arActivo =
    false;


  arIniciando =
    false;


  sensorDetectado =
    false;


  orientacionInicialLista =
    false;


  fuenteHeadingActiva =
    null;


  ultimoHeading =
    null;


  // ==========================================================
  // DETENER TIMEOUT
  // ==========================================================

  if (timeoutDiagnostico) {

    clearTimeout(
      timeoutDiagnostico
    );


    timeoutDiagnostico =
      null;

  }


  // ==========================================================
  // QUITAR EVENTOS
  // ==========================================================

  desactivarEventosClasicos();


  // ==========================================================
  // DETENER SENSORES
  // ==========================================================

  detenerSensoresGenericos();


  // ==========================================================
  // ELEMENTOS
  // ==========================================================

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
  // OCULTAR AR
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
// CERRAR CÁMARA Y SENSORES AL ABANDONAR LA PÁGINA
// ============================================================

window.addEventListener(
  'beforeunload',
  () => {

    if (streamCamara) {

      streamCamara
        .getTracks()
        .forEach(
          track =>
            track.stop()
        );

    }


    detenerSensoresGenericos();

  }
);
