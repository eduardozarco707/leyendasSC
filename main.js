import './style.css';


// ============================================================
// CONFIGURACIÓN
// ============================================================
//
// IMPORTANTE:
//
// Debes tener estos archivos dentro de /public:
//
// /guajojo.glb
// /guajojo-target.mind
// /guajojo-target.jpg
// /audio-guajojo.mp3
// /foto-guajojo.jpg
//
// guajojo-target.jpg = imagen física que buscará la cámara.
// guajojo-target.mind = esa misma imagen compilada con MindAR.
//
// ============================================================

const CONFIG_AR = {

  // Archivo compilado por MindAR
  targetMind:
    '/guajojo-target.mind',

  // Imagen original utilizada para crear el .mind
  targetImagen:
    '/guajojo-target.jpg',

  // Modelo
  modelo:
    '/guajojo.glb',

  // Tamaño inicial del Guajojó
  escala:
    0.45,

  // Posición relativa respecto a la imagen
  posicionX:
    0,

  posicionY:
    0,

  posicionZ:
    0.25,

  // Rotación que ya utilizabas
  rotacion:
    '90 0 0',

  // Tiempo mínimo que debe detectarse la imagen
  // para habilitar captura.
  tiempoParaCapturar:
    400
};


// ============================================================
// CDN DE MINDAR
// ============================================================

const MINDAR_SCRIPT =
  'https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js';


// ============================================================
// VARIABLES PRINCIPALES
// ============================================================

const btnMenu =
  document.getElementById(
    'btn-menu'
  );

const sidebar =
  document.getElementById(
    'sidebar'
  );

const btnLeyenda1 =
  document.getElementById(
    'btn-leyenda-1'
  );

const btnLeyenda2 =
  document.getElementById(
    'btn-leyenda-2'
  );

const areaTexto =
  document.getElementById(
    'contenido-dinamico'
  );


// ============================================================
// VARIABLES AR
// ============================================================

let arActivo =
  false;

let arIniciando =
  false;

let targetVisible =
  false;

let temporizadorCaptura =
  null;

let mindARCargado =
  false;


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
// CARGAR SCRIPT EXTERNO
// ============================================================

function cargarScript(
  src,
  id
) {

  return new Promise(
    (resolve, reject) => {

      const existente =
        document.getElementById(
          id
        );


      if (existente) {

        if (
          existente.dataset.cargado ===
          'true'
        ) {

          resolve();

          return;
        }


        existente.addEventListener(
          'load',
          resolve,
          {
            once: true
          }
        );


        existente.addEventListener(
          'error',
          reject,
          {
            once: true
          }
        );


        return;
      }


      const script =
        document.createElement(
          'script'
        );


      script.id =
        id;


      script.src =
        src;


      script.async =
        true;


      script.onload =
        () => {

          script.dataset.cargado =
            'true';


          resolve();

        };


      script.onerror =
        () => {

          reject(
            new Error(
              'No se pudo cargar la biblioteca MindAR.'
            )
          );

        };


      document.head.appendChild(
        script
      );

    }
  );

}


// ============================================================
// ASEGURAR QUE MINDAR ESTÉ DISPONIBLE
// ============================================================

async function cargarMindAR() {

  if (
    mindARCargado &&
    window.AFRAME &&
    AFRAME.components[
      'mindar-image-target'
    ]
  ) {

    return;
  }


  if (
    typeof window.AFRAME ===
    'undefined'
  ) {

    throw new Error(
      'A-Frame no está cargado. Mantén el script de A-Frame que ya tienes en index.html.'
    );

  }


  // Si MindAR ya estaba cargado
  if (
    AFRAME.components[
      'mindar-image-target'
    ]
  ) {

    mindARCargado =
      true;

    return;
  }


  await cargarScript(
    MINDAR_SCRIPT,
    'mindar-image-script'
  );


  // Pequeña espera para que MindAR
  // termine de registrar sus componentes.
  await esperar(
    100
  );


  if (
    !AFRAME.components[
      'mindar-image-target'
    ]
  ) {

    throw new Error(
      'MindAR se descargó pero no pudo registrarse con A-Frame.'
    );

  }


  mindARCargado =
    true;


  console.log(
    '✅ MindAR Image Tracking cargado.'
  );

}


// ============================================================
// ESPERA
// ============================================================

function esperar(
  milisegundos
) {

  return new Promise(
    resolve => {

      setTimeout(
        resolve,
        milisegundos
      );

    }
  );

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
    async () => {

      cerrarCamaraAR();


      // ======================================================
      // CARGAR MINDAR ANTES DE CREAR LA ESCENA
      // ======================================================

      try {

        await cargarMindAR();

      } catch (error) {

        console.error(
          error
        );


        mostrarLeyenda(

          'El Guajojó',

          'No fue posible cargar el sistema de realidad aumentada.',

          `

          <div
            style="
              margin-top: 20px;
              padding: 15px;
              background: #ffebee;
              border: 2px solid #c62828;
              border-radius: 12px;
              color: #b71c1c;
            "
          >

            <strong>
              Error:
            </strong>

            ${error.message}

          </div>

          `

        );


        return;
      }


      // ======================================================
      // MOSTRAR CONTENIDO
      // ======================================================

      mostrarLeyenda(

        'El Guajojó',

        'Un canto melancólico resuena en la selva. Encuentra la imagen escondida para descubrir al Guajojó.',

        `


        <!-- ================================================= -->
        <!-- EXPLICACIÓN                                       -->
        <!-- ================================================= -->

        <div
          style="
            margin: 20px 0;
            padding: 15px;
            background: #f4f8f4;
            border-left: 5px solid #1b5e20;
            border-radius: 10px;
          "
        >

          <strong>
            🔎 ¿Cómo funciona?
          </strong>

          <p
            style="
              margin: 8px 0 0 0;
            "
          >

            Busca con la cámara la imagen objetivo.

            Cuando la cámara la reconozca,
            el Guajojó aparecerá sobre ella.

          </p>

        </div>


        <!-- ================================================= -->
        <!-- MINIATURA DEL OBJETIVO                             -->
        <!-- ================================================= -->

        <div
          style="
            text-align: center;
            margin: 20px 0;
          "
        >

          <p
            style="
              font-weight: bold;
              margin-bottom: 10px;
            "
          >

            Imagen que debes encontrar:

          </p>


          <img

            src="${CONFIG_AR.targetImagen}"

            alt="Imagen objetivo del Guajojó"

            style="
              width: 180px;
              max-width: 70%;
              border-radius: 12px;
              border: 3px solid #1b5e20;
              box-shadow: 0 4px 14px rgba(0,0,0,0.25);
            "

          >

        </div>


        <!-- ================================================= -->
        <!-- BOTÓN ABRIR AR                                    -->
        <!-- ================================================= -->

        <button

          id="btn-abrir-ar"

          class="btn-ver-ar"

          type="button"

        >

          📱 BUSCAR AL GUAJOJÓ EN AR

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
          <!-- ESCENA MINDAR                                   -->
          <!-- =============================================== -->

          <a-scene

            id="escena-guajojo"

            embedded

            mindar-image="
              imageTargetSrc: ${CONFIG_AR.targetMind};
              autoStart: false;
              maxTrack: 1;
            "

            color-space="sRGB"

            renderer="
              colorManagement: true;
              physicallyCorrectLights: true;
              alpha: true;
              antialias: true;
            "

            vr-mode-ui="
              enabled: false
            "

            device-orientation-permission-ui="
              enabled: false
            "

            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
            "

          >


            <!-- ============================================= -->
            <!-- RECURSOS                                      -->
            <!-- ============================================= -->

            <a-assets
              timeout="20000"
            >

              <a-asset-item

                id="modelo-guajojo-asset"

                src="${CONFIG_AR.modelo}"

              ></a-asset-item>

            </a-assets>



            <!-- ============================================= -->
            <!-- CÁMARA                                        -->
            <!-- ============================================= -->
            <!--                                               -->
            <!-- IMPORTANTE:                                   -->
            <!--                                               -->
            <!-- look-controls DESACTIVADO.                    -->
            <!-- No usamos giroscopio.                         -->
            <!--                                               -->
            <!-- ============================================= -->

            <a-camera

              id="camara-mindar"

              position="0 0 0"

              look-controls="
                enabled: false
              "

              wasd-controls="
                enabled: false
              "

            ></a-camera>



            <!-- ============================================= -->
            <!-- IMAGEN OBJETIVO                               -->
            <!-- ============================================= -->
            <!--                                               -->
            <!-- MindAR moverá automáticamente esta entidad    -->
            <!-- cuando encuentre la imagen.                   -->
            <!--                                               -->
            <!-- ============================================= -->

            <a-entity

              id="target-guajojo"

              mindar-image-target="
                targetIndex: 0
              "

            >


              <!-- =========================================== -->
              <!-- GUAJOJÓ                                     -->
              <!-- =========================================== -->

              <a-entity

                id="modelo-guajojo"

                gltf-model="#modelo-guajojo-asset"

                position="
                  ${CONFIG_AR.posicionX}
                  ${CONFIG_AR.posicionY}
                  ${CONFIG_AR.posicionZ}
                "

                rotation="
                  ${CONFIG_AR.rotacion}
                "

                scale="
                  ${CONFIG_AR.escala}
                  ${CONFIG_AR.escala}
                  ${CONFIG_AR.escala}
                "

              ></a-entity>


              <!-- =========================================== -->
              <!-- SOMBRA / BASE SUAVE                         -->
              <!-- =========================================== -->

              <a-circle

                position="0 0 0.02"

                rotation="0 0 0"

                radius="0.28"

                color="#000000"

                opacity="0.15"

              ></a-circle>


            </a-entity>



            <!-- ============================================= -->
            <!-- LUCES                                         -->
            <!-- ============================================= -->

            <a-light

              type="ambient"

              color="#ffffff"

              intensity="2"

            ></a-light>


            <a-light

              type="directional"

              color="#ffffff"

              intensity="1.4"

              position="1 2 3"

            ></a-light>


          </a-scene>



          <!-- =============================================== -->
          <!-- INTERFAZ                                        -->
          <!-- =============================================== -->

          <div

            id="mensaje-ar"

            style="
              position: absolute;
              top: 24px;
              left: 50%;
              transform: translateX(-50%);
              width: max-content;
              max-width: 72%;
              padding: 12px 20px;
              background: rgba(0,0,0,0.82);
              color: white;
              border-radius: 30px;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              z-index: 100;
              pointer-events: none;
              box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            "

          >

            ⏳ Iniciando cámara...

          </div>



          <!-- =============================================== -->
          <!-- ESTADO SECUNDARIO                               -->
          <!-- =============================================== -->

          <div

            id="estado-target"

            style="
              position: absolute;
              top: 90px;
              left: 50%;
              transform: translateX(-50%);
              padding: 8px 14px;
              background: rgba(0,0,0,0.60);
              color: white;
              border-radius: 20px;
              font-size: 13px;
              text-align: center;
              z-index: 100;
              pointer-events: none;
              white-space: nowrap;
            "

          >

            🔎 Preparando reconocimiento...

          </div>



          <!-- =============================================== -->
          <!-- MIRA                                            -->
          <!-- =============================================== -->

          <div

            id="mira-ar"

            style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 86px;
              height: 86px;
              transform: translate(-50%, -50%);
              border: 2px solid rgba(255,255,255,0.8);
              border-radius: 18px;
              z-index: 90;
              pointer-events: none;
              box-sizing: border-box;
            "

          ></div>


          <div

            style="
              position: absolute;
              top: 50%;
              left: 50%;
              width: 8px;
              height: 8px;
              transform: translate(-50%, -50%);
              background: #ffffff;
              border-radius: 50%;
              z-index: 90;
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
              color: white;
              border: none;
              padding: 16px 30px;
              border-radius: 50px;
              font-size: 17px;
              font-weight: bold;
              z-index: 110;
              opacity: 0.65;
              white-space: nowrap;
              box-shadow: 0 5px 18px rgba(0,0,0,0.5);
              transition: all 0.25s ease;
            "

          >

            👀 Busca la imagen...

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
              width: 50px;
              height: 50px;
              background: rgba(0,0,0,0.78);
              color: white;
              border: none;
              border-radius: 50%;
              font-size: 27px;
              line-height: 50px;
              z-index: 120;
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


          <!-- MENSAJE -->

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

          <div
            class="multimedia-leyenda"
          >


            <div
              class="reproductor-leyenda"
            >

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

          <div
            class="historia-leyenda"
          >

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


      // ======================================================
      // ESPERAR A QUE EL DOM DINÁMICO EXISTA
      // ======================================================

      setTimeout(
        configurarARGuajojo,
        150
      );

    }
  );

}


// ============================================================
// CONFIGURAR MINDAR
// ============================================================

function configurarARGuajojo() {

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


  const target =
    document.getElementById(
      'target-guajojo'
    );


  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  // ==========================================================
  // BOTONES
  // ==========================================================

  if (btnAbrir) {

    btnAbrir.onclick =
      iniciarCamaraAR;

  }


  if (btnCerrar) {

    btnCerrar.onclick =
      cerrarCamaraAR;

  }


  if (btnCapturar) {

    btnCapturar.onclick =
      capturarGuajojo;

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

      }
    );


    modelo.addEventListener(
      'model-error',
      error => {

        console.error(
          '❌ Error cargando guajojo.glb:',
          error
        );


        actualizarMensajeAR(
          '❌ Error cargando el modelo del Guajojó'
        );

      }
    );

  }


  // ==========================================================
  // MINDAR PREPARADO
  // ==========================================================

  if (escena) {

    escena.addEventListener(
      'arReady',
      () => {

        console.log(
          '✅ MindAR está listo.'
        );


        actualizarMensajeAR(
          '🔎 Busca la imagen escondida'
        );


        actualizarEstadoTarget(
          '📷 Apunta la cámara hacia la imagen'
        );

      }
    );


    // ========================================================
    // ERROR MINDAR
    // ========================================================

    escena.addEventListener(
      'arError',
      () => {

        console.error(
          '❌ MindAR no pudo iniciar.'
        );


        actualizarMensajeAR(
          '❌ No se pudo iniciar la cámara AR'
        );


        actualizarEstadoTarget(
          'Comprueba el permiso de cámara'
        );


        arIniciando =
          false;

      }
    );

  }


  // ==========================================================
  // IMAGEN ENCONTRADA
  // ==========================================================

  if (target) {

    target.addEventListener(
      'targetFound',
      () => {

        console.log(
          '🦉 IMAGEN OBJETIVO ENCONTRADA'
        );


        targetVisible =
          true;


        actualizarMensajeAR(
          '🦉 ¡Encontraste al Guajojó!'
        );


        actualizarEstadoTarget(
          '✅ Imagen reconocida'
        );


        const mira =
          document.getElementById(
            'mira-ar'
          );


        if (mira) {

          mira.style.border =
            '3px solid #4caf50';

        }


        // Esperar un momento antes
        // de permitir captura.
        if (temporizadorCaptura) {

          clearTimeout(
            temporizadorCaptura
          );

        }


        temporizadorCaptura =
          setTimeout(
            () => {

              if (
                targetVisible
              ) {

                habilitarCaptura();

              }

            },
            CONFIG_AR.tiempoParaCapturar
          );

      }
    );


    // ========================================================
    // IMAGEN PERDIDA
    // ========================================================

    target.addEventListener(
      'targetLost',
      () => {

        console.log(
          '👀 Imagen objetivo perdida'
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
          '👀 Se perdió el Guajojó'
        );


        actualizarEstadoTarget(
          '🔎 Vuelve a buscar la imagen'
        );


        const mira =
          document.getElementById(
            'mira-ar'
          );


        if (mira) {

          mira.style.border =
            '2px solid rgba(255,255,255,0.8)';

        }

      }
    );

  }

}


// ============================================================
// ESPERAR A QUE UNA ESCENA A-FRAME ESTÉ CARGADA
// ============================================================

function esperarEscena(
  escena
) {

  return new Promise(
    resolve => {

      if (
        escena &&
        escena.hasLoaded
      ) {

        resolve();

        return;
      }


      if (!escena) {

        resolve();

        return;
      }


      escena.addEventListener(
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
// INICIAR AR CON MINDAR
// ============================================================

async function iniciarCamaraAR() {

  if (
    arIniciando ||
    arActivo
  ) {

    return;

  }


  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  const escena =
    document.getElementById(
      'escena-guajojo'
    );


  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar'
    );


  if (
    !pantalla ||
    !escena
  ) {

    return;

  }


  arIniciando =
    true;


  if (btnAbrir) {

    btnAbrir.disabled =
      true;

  }


  try {

    // ========================================================
    // MOSTRAR PANTALLA ANTES DE INICIAR
    // ========================================================

    pantalla.style.display =
      'block';


    document.body.style.overflow =
      'hidden';


    actualizarMensajeAR(
      '⏳ Iniciando cámara...'
    );


    actualizarEstadoTarget(
      '🔎 Cargando reconocimiento de imagen'
    );


    deshabilitarCaptura();


    // ========================================================
    // ESPERAR A-FRAME
    // ========================================================

    await esperarEscena(
      escena
    );


    // ========================================================
    // OBTENER SISTEMA MINDAR
    // ========================================================

    const arSystem =
      escena.systems[
        'mindar-image-system'
      ];


    if (!arSystem) {

      throw new Error(
        'No se encontró mindar-image-system.'
      );

    }


    // ========================================================
    // INICIAR MINDAR
    // ========================================================
    //
    // MindAR se encarga de abrir la cámara.
    //
    // YA NO usamos:
    //
    // navigator.mediaDevices.getUserMedia()
    // DeviceOrientationEvent
    // Gyroscope
    // immersive-ar
    //
    // ========================================================

    arSystem.start();


    arActivo =
      true;


    console.log(
      '✅ MindAR iniciado.'
    );


  } catch (error) {

    console.error(
      '❌ Error iniciando MindAR:',
      error
    );


    pantalla.style.display =
      'none';


    document.body.style.overflow =
      '';


    arActivo =
      false;


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
// MENSAJE PRINCIPAL
// ============================================================

function actualizarMensajeAR(
  texto
) {

  const mensaje =
    document.getElementById(
      'mensaje-ar'
    );


  if (mensaje) {

    mensaje.innerText =
      texto;

  }

}


// ============================================================
// ESTADO DE TARGET
// ============================================================

function actualizarEstadoTarget(
  texto
) {

  const estado =
    document.getElementById(
      'estado-target'
    );


  if (estado) {

    estado.innerText =
      texto;

  }

}


// ============================================================
// HABILITAR CAPTURA
// ============================================================

function habilitarCaptura() {

  const btn =
    document.getElementById(
      'btn-capturar'
    );


  if (!btn) {
    return;
  }


  btn.disabled =
    false;


  btn.style.background =
    '#1b5e20';


  btn.style.opacity =
    '1';


  btn.innerText =
    '✨ CAPTURAR';

}


// ============================================================
// DESHABILITAR CAPTURA
// ============================================================

function deshabilitarCaptura() {

  const btn =
    document.getElementById(
      'btn-capturar'
    );


  if (!btn) {
    return;
  }


  btn.disabled =
    true;


  btn.style.background =
    '#555555';


  btn.style.opacity =
    '0.65';


  btn.innerText =
    '👀 Busca la imagen...';

}


// ============================================================
// CAPTURAR GUAJOJÓ
// ============================================================

function capturarGuajojo() {

  const btnCapturar =
    document.getElementById(
      'btn-capturar'
    );


  // ==========================================================
  // SOLO CAPTURAR SI LA IMAGEN SIGUE DETECTADA
  // ==========================================================

  if (
    !btnCapturar ||
    btnCapturar.disabled ||
    !targetVisible
  ) {

    return;

  }


  console.log(
    '✨ Guajojó capturado'
  );


  // ==========================================================
  // CERRAR AR
  // ==========================================================

  cerrarCamaraAR();


  // ==========================================================
  // OCULTAR BOTÓN DE AR
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
  // OCULTAR IMAGEN OBJETIVO PREVIA
  // ==========================================================

  // Dejamos visible únicamente el contenido desbloqueado.


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


    contenido.scrollIntoView({
      behavior:
        'smooth',

      block:
        'start'
    });

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
            'No se pudo reproducir automáticamente el audio:',
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

  targetVisible =
    false;


  arIniciando =
    false;


  // ==========================================================
  // CANCELAR TEMPORIZADOR
  // ==========================================================

  if (temporizadorCaptura) {

    clearTimeout(
      temporizadorCaptura
    );


    temporizadorCaptura =
      null;

  }


  // ==========================================================
  // OBTENER ELEMENTOS
  // ==========================================================

  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  const escena =
    document.getElementById(
      'escena-guajojo'
    );


  // ==========================================================
  // DETENER MINDAR
  // ==========================================================

  if (
    arActivo &&
    escena &&
    escena.systems &&
    escena.systems[
      'mindar-image-system'
    ]
  ) {

    try {

      const arSystem =
        escena.systems[
          'mindar-image-system'
        ];


      arSystem.stop();


      console.log(
        '🛑 MindAR detenido.'
      );


    } catch (error) {

      console.warn(
        'Error deteniendo MindAR:',
        error
      );

    }

  }


  arActivo =
    false;


  // ==========================================================
  // OCULTAR AR
  // ==========================================================

  if (pantalla) {

    pantalla.style.display =
      'none';

  }


  document.body.style.overflow =
    '';


  deshabilitarCaptura();

}


// ============================================================
// CERRAR AR AL SALIR DE LA PÁGINA
// ============================================================

window.addEventListener(
  'beforeunload',
  () => {

    cerrarCamaraAR();

  }
);
