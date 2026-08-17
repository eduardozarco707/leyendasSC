import './style.css';


// ============================================================
// CONFIGURACIÓN GENERAL
// ============================================================

const CONFIG_AR = {

  // Distancia virtual del Guajojó
  distancia: 3,

  // Tamaño del modelo
  escala: 0.55,

  // El Guajojó aparecerá a esta cantidad de grados
  // respecto a donde estabas mirando al abrir AR.
  anguloMin: 55,
  anguloMax: 70,

  // A partir de aquí debería empezar a verse
  anguloVisible: 38,

  // A partir de aquí se habilita capturar
  anguloCaptura: 9

};


// ============================================================
// ELEMENTOS PRINCIPALES
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

let arActivo = false;
let arIniciando = false;

let modeloCargado = false;


// ============================================================
// VARIABLES SENSOR
// ============================================================

let sensorDetectado = false;

let orientacionInicialLista = false;

let headingInicial = 0;

let headingObjetivo = 0;

let ultimaFuenteSensor = '';


// Sensor Generic Sensor API
let sensorRelativo = null;


// Timeout para comprobar sensores
let timeoutSensor = null;


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

  if (!areaTexto) return;


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
// CARRETÓN
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
// GUAJOJÓ
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
            background: #000;
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
              background: #000;
              z-index: 1;
            "

          ></video>


          <!-- =============================================== -->
          <!-- ESCENA 3D                                       -->
          <!-- =============================================== -->

          <div

            id="capa-modelo"

            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 2;
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
              <!-- RECURSOS                                    -->
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
              <!-- LUCES                                       -->
              <!-- =========================================== -->

              <a-light

                type="ambient"

                color="#ffffff"

                intensity="2.4"

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
              <!-- CÁMARA 3D FIJA                              -->
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
              max-width: 72%;
              z-index: 30;
              pointer-events: none;
              box-shadow: 0 4px 14px rgba(0,0,0,0.35);
            "

          >

            ⏳ Preparando AR...

          </div>


          <!-- =============================================== -->
          <!-- ESTADO DEL SENSOR                               -->
          <!-- =============================================== -->

          <div

            id="estado-sensor"

            style="
              position: absolute;
              top: 90px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.60);
              color: #ffffff;
              padding: 7px 13px;
              border-radius: 20px;
              font-size: 12px;
              text-align: center;
              white-space: nowrap;
              z-index: 30;
              pointer-events: none;
            "

          >

            📡 Solicitando sensores...

          </div>


          <!-- =============================================== -->
          <!-- MIRA                                            -->
          <!-- =============================================== -->

          <div

            style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 74px;
              height: 74px;
              transform: translate(-50%, -50%);
              border: 2px solid rgba(255,255,255,0.75);
              border-radius: 50%;
              box-sizing: border-box;
              pointer-events: none;
              z-index: 20;
            "

          ></div>


          <div

            style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 7px;
              height: 7px;
              transform: translate(-50%, -50%);
              background: #ffffff;
              border-radius: 50%;
              pointer-events: none;
              z-index: 20;
            "

          ></div>


          <!-- =============================================== -->
          <!-- CAPTURAR                                        -->
          <!-- =============================================== -->

          <button

            id="btn-capturar"

            disabled

            type="button"

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

            aria-label="Cerrar AR"

            style="
              position: absolute;
              top: 18px;
              right: 16px;
              width: 48px;
              height: 48px;
              background: rgba(0,0,0,0.75);
              color: #ffffff;
              border: none;
              border-radius: 50%;
              font-size: 27px;
              z-index: 50;
            "

          >

            ✕

          </button>


        </div>


        <!-- ================================================= -->
        <!-- CONTENIDO CAPTURADO                               -->
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
                color: #333;
              "
            >

              Has descubierto al Guajojó

            </p>

          </div>


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


      setTimeout(
        configurarGuajojo,
        100
      );

    }
  );

}


// ============================================================
// CONFIGURAR MODELO Y BOTONES
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


    modelo.addEventListener(
      'model-loaded',
      () => {

        console.log(
          '✅ guajojo.glb cargado'
        );


        modeloCargado =
          true;


        if (
          arActivo &&
          orientacionInicialLista
        ) {

          mostrarModelo();

        }

      }
    );


    modelo.addEventListener(
      'model-error',
      error => {

        console.error(
          '❌ Error modelo:',
          error
        );


        modeloCargado =
          false;


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


    // Puede haber cargado antes del listener.
    setTimeout(
      () => {

        if (
          modelo.getObject3D(
            'mesh'
          )
        ) {

          modeloCargado =
            true;

        }

      },
      800
    );

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
// RADIANES
// ============================================================

function rad(
  grados
) {

  return grados *
    Math.PI /
    180;

}


// ============================================================
// OBTENER ORIENTACIÓN DE PANTALLA
// ============================================================

function anguloPantalla() {

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
// HEADING DESDE DEVICEORIENTATION
// ============================================================

function headingDesdeEuler(
  alpha,
  beta,
  gamma
) {

  if (
    typeof alpha !== 'number' ||
    typeof beta !== 'number' ||
    typeof gamma !== 'number'
  ) {

    return null;

  }


  const THREE =
    AFRAME.THREE;


  const euler =
    new THREE.Euler();


  const quaternion =
    new THREE.Quaternion();


  const pantallaQuaternion =
    new THREE.Quaternion();


  const ejeZ =
    new THREE.Vector3(
      0,
      0,
      1
    );


  const qCorreccion =
    new THREE.Quaternion(
      -Math.sqrt(0.5),
      0,
      0,
      Math.sqrt(0.5)
    );


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
    qCorreccion
  );


  pantallaQuaternion
    .setFromAxisAngle(

      ejeZ,

      -rad(
        anguloPantalla()
      )

    );


  quaternion.multiply(
    pantallaQuaternion
  );


  return headingDesdeQuaternion(
    quaternion
  );

}


// ============================================================
// HEADING DESDE QUATERNION
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
// RECIBIR HEADING DESDE CUALQUIER SENSOR
// ============================================================

function procesarHeading(
  heading,
  fuente
) {

  if (
    !arActivo ||
    typeof heading !== 'number' ||
    Number.isNaN(heading)
  ) {

    return;

  }


  sensorDetectado =
    true;


  ultimaFuenteSensor =
    fuente;


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


    const angulo =
      CONFIG_AR.anguloMin +

      Math.random() *

      (
        CONFIG_AR.anguloMax -
        CONFIG_AR.anguloMin
      );


    headingObjetivo =
      normalizarAngulo(

        headingInicial +

        angulo *

        lado

      );


    console.log(
      '📱 Dirección inicial:',
      headingInicial
    );


    console.log(
      '🦉 Dirección Guajojó:',
      headingObjetivo
    );


    mostrarModelo();

  }


  actualizarGuajojo(
    heading
  );

}


// ============================================================
// DEVICEORIENTATION NORMAL
// ============================================================

function eventoOrientacion(
  event
) {

  if (!arActivo) {
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
      'DeviceOrientation'
    );

  }

}


// ============================================================
// DEVICEORIENTATION ABSOLUTO
// ============================================================

function eventoOrientacionAbsoluta(
  event
) {

  if (!arActivo) {
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
      'DeviceOrientationAbsolute'
    );

  }

}


// ============================================================
// SOLICITAR PERMISOS DEL SENSOR
// ============================================================

async function solicitarPermisosSensores() {

  const solicitudes = [];


  // ==========================================================
  // CHROME 151 / iOS / NAVEGADORES CON REQUESTPERMISSION
  // ==========================================================

  try {

    if (
      typeof DeviceOrientationEvent !==
        'undefined' &&
      typeof DeviceOrientationEvent
        .requestPermission ===
        'function'
    ) {

      solicitudes.push(

        DeviceOrientationEvent
          .requestPermission()
          .then(
            resultado => {

              console.log(
                'Permiso DeviceOrientation:',
                resultado
              );


              return resultado;

            }
          )

      );

    }

  } catch (error) {

    console.warn(
      'DeviceOrientation permiso:',
      error
    );

  }


  try {

    if (
      typeof DeviceMotionEvent !==
        'undefined' &&
      typeof DeviceMotionEvent
        .requestPermission ===
        'function'
    ) {

      solicitudes.push(

        DeviceMotionEvent
          .requestPermission()
          .then(
            resultado => {

              console.log(
                'Permiso DeviceMotion:',
                resultado
              );


              return resultado;

            }
          )

      );

    }

  } catch (error) {

    console.warn(
      'DeviceMotion permiso:',
      error
    );

  }


  if (
    solicitudes.length === 0
  ) {

    return true;

  }


  try {

    const resultados =
      await Promise.all(
        solicitudes
      );


    const algunoConcedido =
      resultados.some(
        resultado =>
          resultado ===
          'granted'
      );


    return algunoConcedido;

  } catch (error) {

    console.error(
      'Error solicitando permisos:',
      error
    );


    return false;

  }

}


// ============================================================
// ACTIVAR EVENTOS CLÁSICOS
// ============================================================

function activarEventosOrientacion() {

  window.removeEventListener(
    'deviceorientation',
    eventoOrientacion
  );


  window.removeEventListener(
    'deviceorientationabsolute',
    eventoOrientacionAbsoluta
  );


  window.addEventListener(
    'deviceorientation',
    eventoOrientacion
  );


  window.addEventListener(
    'deviceorientationabsolute',
    eventoOrientacionAbsoluta
  );

}


// ============================================================
// DESACTIVAR EVENTOS
// ============================================================

function desactivarEventosOrientacion() {

  window.removeEventListener(
    'deviceorientation',
    eventoOrientacion
  );


  window.removeEventListener(
    'deviceorientationabsolute',
    eventoOrientacionAbsoluta
  );

}


// ============================================================
// GENERIC SENSOR API
// ============================================================
//
// Si DeviceOrientation no entrega datos,
// intentamos RelativeOrientationSensor.
//
// ============================================================

function iniciarSensorRelativo() {

  if (
    sensorDetectado ||
    !arActivo
  ) {

    return;

  }


  const estado =
    document.getElementById(
      'estado-sensor'
    );


  if (
    !(
      'RelativeOrientationSensor'
      in window
    )
  ) {

    console.warn(
      'RelativeOrientationSensor no disponible.'
    );


    mostrarErrorSensores();


    return;

  }


  try {

    if (estado) {

      estado.innerText =
        '🔄 Probando sensor alternativo...';

    }


    sensorRelativo =
      new RelativeOrientationSensor({

        frequency: 30,

        referenceFrame: 'screen'

      });


    sensorRelativo.onreading =
      () => {


        if (
          !arActivo ||
          !sensorRelativo ||
          !sensorRelativo.quaternion
        ) {

          return;

        }


        const q =
          new AFRAME.THREE
            .Quaternion()
            .fromArray(
              sensorRelativo.quaternion
            );


        const heading =
          headingDesdeQuaternion(
            q
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


    sensorRelativo.onerror =
      event => {


        console.error(
          'Sensor alternativo:',
          event.error
        );


        if (
          !sensorDetectado
        ) {

          mostrarErrorSensores(
            event.error
          );

        }

      };


    sensorRelativo.start();


    console.log(
      '📡 RelativeOrientationSensor iniciado.'
    );


    setTimeout(
      () => {

        if (
          arActivo &&
          !sensorDetectado
        ) {

          mostrarErrorSensores();

        }

      },
      2500
    );


  } catch (error) {

    console.error(
      'No se pudo iniciar RelativeOrientationSensor:',
      error
    );


    mostrarErrorSensores(
      error
    );

  }

}


// ============================================================
// MENSAJE DE ERROR DE SENSORES
// ============================================================

function mostrarErrorSensores(
  error = null
) {

  if (!arActivo) {
    return;
  }


  const mensaje =
    document.getElementById(
      'mensaje-ar'
    );


  const estado =
    document.getElementById(
      'estado-sensor'
    );


  if (mensaje) {

    mensaje.innerText =
      '⚠️ Chrome bloquea el sensor de movimiento';

  }


  if (estado) {

    if (
      error &&
      error.name ===
        'NotAllowedError'
    ) {

      estado.innerText =
        '❌ Permiso de sensores bloqueado';

    } else if (
      error &&
      error.name ===
        'SecurityError'
    ) {

      estado.innerText =
        '❌ Sensores bloqueados por seguridad';

    } else {

      estado.innerText =
        '❌ Activa “Sensores de movimiento” en Chrome';

    }

  }


  console.warn(
    'No llegan datos de orientación.'
  );

}


// ============================================================
// ACTUALIZAR POSICIÓN DEL GUAJOJÓ
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


  const estado =
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
    !estado ||
    !btnCapturar ||
    !orientacionInicialLista
  ) {

    return;

  }


  // ==========================================================
  // DIFERENCIA ENTRE DIRECCIÓN ACTUAL Y GUAJOJÓ
  // ==========================================================

  const diferencia =
    normalizarAngulo(

      headingObjetivo -
      headingActual

    );


  const restantes =
    Math.abs(
      diferencia
    );


  // ==========================================================
  // MOVER MODELO ALREDEDOR DE LA CÁMARA
  // ==========================================================

  const a =
    rad(
      diferencia
    );


  const x =
    Math.sin(a) *
    CONFIG_AR.distancia;


  const z =
    -Math.cos(a) *
    CONFIG_AR.distancia;


  modelo.object3D
    .position
    .set(

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
  // MOSTRAR SENSOR QUE ESTÁ FUNCIONANDO
  // ==========================================================

  estado.innerText =

    '✅ ' +

    ultimaFuenteSensor +

    ' · faltan ' +

    Math.round(
      restantes
    ) +

    '°';


  // ==========================================================
  // CAPTURA
  // ==========================================================

  if (
    restantes <=
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


  btnCapturar.disabled =
    true;


  // ==========================================================
  // CERCA
  // ==========================================================

  if (
    restantes <=
    CONFIG_AR.anguloVisible
  ) {


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
          restantes
        ) +

        '°';

    } else {

      mensaje.innerText =

        '🦉 Un poco más a la izquierda · ' +

        Math.round(
          restantes
        ) +

        '°';

    }


    return;

  }


  // ==========================================================
  // LEJOS
  // ==========================================================

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
        restantes
      ) +

      '°';

  } else {

    mensaje.innerText =

      '⬅️ Gira a la izquierda · ' +

      Math.round(
        restantes
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


          if (terminado) return;


          terminado =
            true;


          limpiar();


          resolve();

        };


      const errorVideo =
        () => {


          if (terminado) return;


          terminado =
            true;


          limpiar();


          reject(
            new Error(
              'No se pudo preparar el video.'
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
// REPRODUCIR VIDEO
// ============================================================

async function reproducirVideoSeguro(
  video
) {

  try {


    await video.play();


  } catch (error) {


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


  const estado =
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


  try {


    // ========================================================
    // 1. SOLICITAR PERMISOS INMEDIATAMENTE DESDE EL CLIC
    // ========================================================

    if (mensaje) {

      mensaje.innerText =
        '🔐 Solicitando permiso de movimiento...';

    }


    const permisoSensor =
      await solicitarPermisosSensores();


    console.log(
      'Permiso sensor:',
      permisoSensor
    );


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


    ultimaFuenteSensor =
      '';


    // ========================================================
    // 3. MODELO
    // ========================================================

    if (modelo) {


      modelo.setAttribute(
        'visible',
        false
      );


      modelo.object3D.visible =
        false;


      modelo.object3D
        .position
        .set(
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
        '📡 Detectando movimiento...';

    }


    if (estado) {

      estado.innerText =
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
    // 5. ACTIVAR EVENTOS INMEDIATAMENTE
    // ========================================================

    activarEventosOrientacion();


    // ========================================================
    // 6. SI LOS EVENTOS NORMALES NO RESPONDEN,
    // PROBAR GENERIC SENSOR
    // ========================================================

    if (timeoutSensor) {

      clearTimeout(
        timeoutSensor
      );

    }


    timeoutSensor =
      setTimeout(
        () => {


          if (
            arActivo &&
            !sensorDetectado
          ) {

            console.log(
              '⚠️ DeviceOrientation no respondió. Probando sensor alternativo.'
            );


            iniciarSensorRelativo();

          }

        },
        1500
      );


    // ========================================================
    // 7. CÁMARA
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
    // 8. TRANSPARENCIA
    // ========================================================

    const transparencia =
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


    if (escena.hasLoaded) {

      transparencia();

    } else {


      escena.addEventListener(
        'loaded',
        transparencia,
        {
          once: true
        }
      );

    }


    setTimeout(
      transparencia,
      300
    );


    setTimeout(
      transparencia,
      900
    );


    window.dispatchEvent(
      new Event(
        'resize'
      )
    );


    // ========================================================
    // 9. BOTONES
    // ========================================================

    if (btnCerrar) {

      btnCerrar.onclick =
        cerrarCamaraAR;

    }


    if (btnCapturar) {

      btnCapturar.onclick =
        capturarGuajojo;

    }


  } catch (error) {


    console.error(
      '❌ ERROR AR:',
      error
    );


    cerrarCamaraAR();


    alert(

      'No se pudo iniciar AR.\n\n' +

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
// CAPTURAR
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


  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar'
    );


  if (btnAbrir) {

    btnAbrir.style.display =
      'none';

  }


  const contenido =
    document.getElementById(
      'contenido-capturado'
    );


  if (contenido) {

    contenido.style.display =
      'block';

  }


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
            'Audio:',
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


  sensorDetectado =
    false;


  orientacionInicialLista =
    false;


  // ==========================================================
  // TIMEOUT
  // ==========================================================

  if (timeoutSensor) {


    clearTimeout(
      timeoutSensor
    );


    timeoutSensor =
      null;

  }


  // ==========================================================
  // EVENTOS
  // ==========================================================

  desactivarEventosOrientacion();


  // ==========================================================
  // GENERIC SENSOR
  // ==========================================================

  if (sensorRelativo) {


    try {

      sensorRelativo.stop();

    } catch (error) {

      console.warn(
        error
      );

    }


    sensorRelativo =
      null;

  }


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
  // MODELO
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
  // PANTALLA
  // ==========================================================

  if (pantalla) {

    pantalla.style.display =
      'none';

  }


  // ==========================================================
  // CÁMARA
  // ==========================================================

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


  if (video) {

    video.srcObject =
      null;

  }


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
          track =>
            track.stop()
        );

    }

  }
);
