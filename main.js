import './style.css';


// ============================================================
// CONFIGURACIÓN GENERAL DEL AR
// ============================================================

const CONFIG_AR = {

  // Posición fija del Guajojó en el mundo virtual.
  // La cámara siempre estará en 0,0,0.
  guajojoX: 2.6,
  guajojoY: 0,
  guajojoZ: -2.6,

  // Tamaño
  escala: 0.55,

  // Qué tan centrado debe estar para capturarlo
  zonaCaptura: 0.40
};


// ============================================================
// VARIABLES GLOBALES
// ============================================================

let streamCamara = null;

let arIniciando = false;

let sesionAR = 0;

let modeloGuajojoCargado = false;

let intervaloEstadoAR = null;


// ============================================================
// COMPONENTE: DETECTOR DE ENFOQUE
// ============================================================

AFRAME.registerComponent(
  'detector-enfoque',
  {

    tick: function () {

      const pantalla =
        document.getElementById(
          'pantalla-ar'
        );

      const btnCapturar =
        document.getElementById(
          'btn-capturar'
        );

      const mensaje =
        document.getElementById(
          'mensaje-ar'
        );


      if (
        !pantalla ||
        !btnCapturar ||
        !mensaje
      ) {
        return;
      }


      if (
        pantalla.style.display ===
        'none'
      ) {
        return;
      }


      if (
        !modeloGuajojoCargado
      ) {

        btnCapturar.disabled =
          true;

        btnCapturar.style.background =
          '#555555';

        btnCapturar.style.opacity =
          '0.6';

        btnCapturar.innerText =
          '⏳ Cargando Guajojó...';

        mensaje.innerText =
          '⏳ Preparando al Guajojó...';

        return;
      }


      const escena =
        this.el.sceneEl;


      if (
        !escena ||
        !escena.camera
      ) {
        return;
      }


      const camera =
        escena.camera;


      // ======================================================
      // POSICIÓN DEL MODELO
      // ======================================================

      const posicionModelo =
        new AFRAME.THREE.Vector3();


      this.el.object3D
        .getWorldPosition(
          posicionModelo
        );


      // ======================================================
      // POSICIÓN DE LA CÁMARA
      // ======================================================

      const posicionCamara =
        new AFRAME.THREE.Vector3();


      camera.getWorldPosition(
        posicionCamara
      );


      // ======================================================
      // DIRECCIÓN HACIA EL GUAJOJÓ
      // ======================================================

      const direccionModelo =
        posicionModelo
          .clone()
          .sub(
            posicionCamara
          )
          .normalize();


      // ======================================================
      // DIRECCIÓN DE LA CÁMARA
      // ======================================================

      const direccionCamara =
        new AFRAME.THREE.Vector3(
          0,
          0,
          -1
        );


      camera.getWorldDirection(
        direccionCamara
      );


      direccionCamara.normalize();


      // ======================================================
      // PROYECCIÓN A PANTALLA
      // ======================================================

      const pantallaModelo =
        posicionModelo.clone();


      pantallaModelo.project(
        camera
      );


      // ======================================================
      // ¿ESTÁ DELANTE?
      // ======================================================

      const producto =
        direccionCamara.dot(
          direccionModelo
        );


      const estaDelante =
        producto > 0;


      // ======================================================
      // ¿ESTÁ DENTRO DE LA PANTALLA?
      // ======================================================

      const estaEnPantalla =
        estaDelante &&
        pantallaModelo.x >= -1 &&
        pantallaModelo.x <= 1 &&
        pantallaModelo.y >= -1 &&
        pantallaModelo.y <= 1 &&
        pantallaModelo.z >= -1 &&
        pantallaModelo.z <= 1;


      // ======================================================
      // ¿ESTÁ CENTRADO?
      // ======================================================

      const limite =
        CONFIG_AR.zonaCaptura;


      const estaCentrado =
        estaEnPantalla &&
        Math.abs(
          pantallaModelo.x
        ) <= limite &&
        Math.abs(
          pantallaModelo.y
        ) <= limite;


      // ======================================================
      // SI ESTÁ CENTRADO
      // ======================================================

      if (estaCentrado) {

        btnCapturar.disabled =
          false;

        btnCapturar.style.background =
          '#1b5e20';

        btnCapturar.style.opacity =
          '1';

        btnCapturar.innerText =
          '✨ CAPTURAR';


        mensaje.innerText =
          '🦉 ¡Encontraste al Guajojó!';

        return;
      }


      // ======================================================
      // SI ESTÁ EN LA PANTALLA PERO NO CENTRADO
      // ======================================================

      if (estaEnPantalla) {

        btnCapturar.disabled =
          true;

        btnCapturar.style.background =
          '#777777';

        btnCapturar.style.opacity =
          '0.8';

        btnCapturar.innerText =
          '🎯 Centra al Guajojó';


        if (
          pantallaModelo.x <
          -limite
        ) {

          mensaje.innerText =
            '⬅️ Muévete un poco a la izquierda';

        } else if (
          pantallaModelo.x >
          limite
        ) {

          mensaje.innerText =
            '➡️ Muévete un poco a la derecha';

        } else if (
          pantallaModelo.y >
          limite
        ) {

          mensaje.innerText =
            '⬆️ Levanta un poco el celular';

        } else if (
          pantallaModelo.y <
          -limite
        ) {

          mensaje.innerText =
            '⬇️ Baja un poco el celular';

        }

        return;
      }


      // ======================================================
      // FUERA DE PANTALLA
      // CALCULAR HACIA QUÉ LADO GIRAR
      // ======================================================

      const frenteHorizontal =
        new AFRAME.THREE.Vector3(
          direccionCamara.x,
          0,
          direccionCamara.z
        );


      const objetivoHorizontal =
        new AFRAME.THREE.Vector3(
          direccionModelo.x,
          0,
          direccionModelo.z
        );


      if (
        frenteHorizontal.lengthSq() >
        0.0001 &&
        objetivoHorizontal.lengthSq() >
        0.0001
      ) {

        frenteHorizontal.normalize();

        objetivoHorizontal.normalize();


        // Producto cruzado horizontal.
        const cruz =
          frenteHorizontal.x *
          objetivoHorizontal.z -
          frenteHorizontal.z *
          objetivoHorizontal.x;


        if (cruz > 0) {

          mensaje.innerText =
            '⬅️ Gira hacia la izquierda';

        } else {

          mensaje.innerText =
            '➡️ Gira hacia la derecha';

        }

      } else {

        mensaje.innerText =
          '🔄 Gira tu celular y busca al Guajojó';

      }


      btnCapturar.disabled =
        true;

      btnCapturar.style.background =
        '#555555';

      btnCapturar.style.opacity =
        '0.6';

      btnCapturar.innerText =
        '👀 Busca al Guajojó...';

    }
  }
);


// ============================================================
// ELEMENTOS PRINCIPALES DE LA PÁGINA
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
          <!-- CAPA A-FRAME                                    -->
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
              <!--                                             -->
              <!-- POSICIÓN FIJA:                              -->
              <!--                                             -->
              <!-- X  2.6                                      -->
              <!-- Y  0                                        -->
              <!-- Z -2.6                                      -->
              <!--                                             -->
              <!-- NO ESTÁ PEGADO A LA CÁMARA.                 -->
              <!-- =========================================== -->

              <a-entity

                id="modelo-guajojo"

                detector-enfoque

                gltf-model="#modelo-guajojo-asset"

                position="
                  ${CONFIG_AR.guajojoX}
                  ${CONFIG_AR.guajojoY}
                  ${CONFIG_AR.guajojoZ}
                "

                scale="
                  ${CONFIG_AR.escala}
                  ${CONFIG_AR.escala}
                  ${CONFIG_AR.escala}
                "

                rotation="90 0 0"

                visible="false"

              ></a-entity>


              <!-- =========================================== -->
              <!-- LUZ                                         -->
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
              <!-- CÁMARA VIRTUAL                              -->
              <!-- =========================================== -->

              <a-camera

                id="camara-ar"

                position="0 0 0"

                look-controls="
                  enabled: true;
                  magicWindowTrackingEnabled: true;
                  touchEnabled: false;
                  mouseEnabled: false;
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
          <!-- MENSAJE DE DIRECCIÓN                            -->
          <!-- =============================================== -->

          <div

            id="mensaje-ar"

            style="
              position: absolute;
              top: 24px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0, 0, 0, 0.82);
              color: #ffffff;
              padding: 12px 20px;
              border-radius: 30px;
              font-size: 16px;
              font-weight: bold;
              text-align: center;
              width: max-content;
              max-width: 72%;
              z-index: 20;
              pointer-events: none;
              box-shadow: 0 4px 14px rgba(0,0,0,0.3);
            "

          >

            ⏳ Preparando al Guajojó...

          </div>


          <!-- =============================================== -->
          <!-- PEQUEÑA MIRA CENTRAL                            -->
          <!-- =============================================== -->

          <div

            style="
              position: absolute;
              left: 50%;
              top: 50%;
              width: 60px;
              height: 60px;
              transform: translate(-50%, -50%);
              border: 2px solid rgba(255,255,255,0.65);
              border-radius: 50%;
              z-index: 15;
              pointer-events: none;
              box-sizing: border-box;
            "

          ></div>


          <div

            style="
              position: absolute;
              left: 50%;
              top: 50%;
              width: 6px;
              height: 6px;
              transform: translate(-50%, -50%);
              background: rgba(255,255,255,0.9);
              border-radius: 50%;
              z-index: 15;
              pointer-events: none;
            "

          ></div>


          <!-- =============================================== -->
          <!-- BOTÓN CAPTURAR                                  -->
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
              z-index: 30;
              opacity: 0.6;
              white-space: nowrap;
              box-shadow: 0 5px 18px rgba(0,0,0,0.5);
              transition: all 0.25s ease;
            "

          >

            ⏳ Cargando Guajojó...

          </button>


          <!-- =============================================== -->
          <!-- BOTÓN CERRAR                                    -->
          <!-- =============================================== -->

          <button

            id="btn-cerrar-ar"

            type="button"

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
              font-size: 27px;
              line-height: 48px;
              z-index: 40;
            "

          >

            ✕

          </button>


        </div>


        <!-- ================================================= -->
        <!-- DESPUÉS DE CAPTURAR                               -->
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


      // ======================================================
      // ESPERAR A QUE SE CREE EL HTML
      // ======================================================

      setTimeout(
        configurarGuajojo,
        100
      );

    }
  );
}


// ============================================================
// CONFIGURAR EVENTOS DEL GUAJOJÓ
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


  const asset =
    document.getElementById(
      'modelo-guajojo-asset'
    );


  // ==========================================================
  // ABRIR AR
  // ==========================================================

  if (btnAbrir) {

    btnAbrir.onclick =
      iniciarCamaraAR;

  }


  // ==========================================================
  // CERRAR AR
  // ==========================================================

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
          '✅ GUAJOJÓ.GLB CARGADO'
        );


        modeloGuajojoCargado =
          true;


        // Utilizamos el atributo de A-Frame,
        // no solamente object3D.visible.
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


        const mensaje =
          document.getElementById(
            'mensaje-ar'
          );


        if (mensaje) {

          mensaje.innerText =
            '🔄 Gira tu celular y encuentra al Guajojó';

        }

      }
    );


    // ========================================================
    // ERROR DEL MODELO
    // ========================================================

    modelo.addEventListener(
      'model-error',
      evento => {

        console.error(
          '❌ ERROR CARGANDO EL GUAJOJÓ:',
          evento
        );


        modeloGuajojoCargado =
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

  }


  // ==========================================================
  // ERROR EN EL ASSET
  // ==========================================================

  if (asset) {

    asset.addEventListener(
      'error',
      error => {

        console.error(
          '❌ ERROR DEL ARCHIVO guajojo.glb:',
          error
        );

      }
    );

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
  video,
  sesionActual
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
      sesionActual !==
      sesionAR
    ) {

      return;

    }


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
        sesionActual !==
          sesionAR ||
        !video.srcObject
      ) {

        return;

      }


      await video.play();


      return;

    }


    throw error;

  }
}


// ============================================================
// PERMISO DE ORIENTACIÓN
// ============================================================

async function pedirPermisoOrientacion() {

  try {


    if (

      typeof DeviceOrientationEvent !==
        'undefined' &&

      typeof DeviceOrientationEvent
        .requestPermission ===
        'function'

    ) {


      const permiso =
        await DeviceOrientationEvent
          .requestPermission();


      return permiso ===
        'granted';

    }


    return true;


  } catch (error) {


    console.warn(
      'Permiso orientación:',
      error
    );


    return false;

  }
}


// ============================================================
// INICIAR REALIDAD AUMENTADA
// ============================================================

async function iniciarCamaraAR() {


  if (arIniciando) {
    return;
  }


  arIniciando =
    true;


  sesionAR++;


  const sesionActual =
    sesionAR;


  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  const video =
    document.getElementById(
      'video-camara'
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


  if (btnAbrir) {

    btnAbrir.disabled =
      true;

  }


  try {


    // ========================================================
    // 1. PERMISO DE ORIENTACIÓN
    // ========================================================

    const permisoOrientacion =
      await pedirPermisoOrientacion();


    if (
      !permisoOrientacion
    ) {

      throw new Error(
        'Debes permitir el uso de los sensores de movimiento.'
      );

    }


    // ========================================================
    // 2. MOSTRAR PANTALLA
    // ========================================================

    pantalla.style.display =
      'block';


    document.body.style.overflow =
      'hidden';


    // ========================================================
    // 3. REINICIAR BOTÓN
    // ========================================================

    if (btnCapturar) {

      btnCapturar.disabled =
        true;

      btnCapturar.style.background =
        '#555555';

      btnCapturar.style.opacity =
        '0.6';

      btnCapturar.innerText =
        modeloGuajojoCargado
          ? '👀 Busca al Guajojó...'
          : '⏳ Cargando Guajojó...';

    }


    // ========================================================
    // 4. MOSTRAR MODELO SI YA ESTABA CARGADO
    // ========================================================

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


      modelo.object3D.position.set(

        CONFIG_AR.guajojoX,

        CONFIG_AR.guajojoY,

        CONFIG_AR.guajojoZ

      );


      modelo.object3D
        .updateMatrixWorld(
          true
        );

    }


    // ========================================================
    // 5. DETENER CÁMARA ANTERIOR
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


    // ========================================================
    // 6. COMPROBAR API
    // ========================================================

    if (

      !navigator.mediaDevices ||

      !navigator.mediaDevices
        .getUserMedia

    ) {

      throw new Error(
        'Este navegador no permite acceder a la cámara.'
      );

    }


    // ========================================================
    // 7. ABRIR CÁMARA TRASERA
    // ========================================================

    const nuevoStream =
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


    if (
      sesionActual !==
      sesionAR
    ) {


      nuevoStream
        .getTracks()
        .forEach(
          track =>
            track.stop()
        );


      return;

    }


    streamCamara =
      nuevoStream;


    // ========================================================
    // 8. CONECTAR VIDEO
    // ========================================================

    video.muted =
      true;


    video.playsInline =
      true;


    video.srcObject =
      streamCamara;


    // ========================================================
    // 9. ESPERAR VIDEO
    // ========================================================

    await esperarVideoListo(
      video
    );


    // ========================================================
    // 10. REPRODUCIR
    // ========================================================

    await reproducirVideoSeguro(

      video,

      sesionActual

    );


    // ========================================================
    // 11. AJUSTAR ESCENA
    // ========================================================

    window.dispatchEvent(
      new Event(
        'resize'
      )
    );


    // ========================================================
    // 12. REINICIAR LOOK CONTROLS
    // ========================================================

    const camaraVirtual =
      escena.querySelector(
        '#camara-ar'
      );


    if (

      camaraVirtual &&

      camaraVirtual
        .components &&

      camaraVirtual
        .components[
          'look-controls'
        ]

    ) {


      const control =
        camaraVirtual
          .components[
            'look-controls'
          ];


      control.pause();


      control.play();

    }


    // ========================================================
    // 13. CANVAS TRANSPARENTE
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
      250
    );


    setTimeout(
      hacerTransparente,
      800
    );


    // ========================================================
    // 14. ASEGURAR POSICIÓN DEL GUAJOJÓ
    // ========================================================

    setTimeout(
      () => {


        if (
          sesionActual !==
          sesionAR
        ) {
          return;
        }


        const modeloActual =
          document.getElementById(
            'modelo-guajojo'
          );


        if (
          modeloActual &&
          modeloGuajojoCargado
        ) {


          modeloActual
            .setAttribute(
              'position',
              `${CONFIG_AR.guajojoX} ${CONFIG_AR.guajojoY} ${CONFIG_AR.guajojoZ}`
            );


          modeloActual
            .setAttribute(
              'visible',
              true
            );


          modeloActual
            .object3D
            .position
            .set(

              CONFIG_AR.guajojoX,

              CONFIG_AR.guajojoY,

              CONFIG_AR.guajojoZ

            );


          modeloActual
            .object3D
            .visible =
              true;


          modeloActual
            .object3D
            .updateMatrixWorld(
              true
            );


          console.log(
            '🦉 Guajojó visible en:',
            CONFIG_AR.guajojoX,
            CONFIG_AR.guajojoY,
            CONFIG_AR.guajojoZ
          );

        }

      },
      800
    );


    // ========================================================
    // 15. BOTONES
    // ========================================================

    if (btnCerrar) {

      btnCerrar.onclick =
        cerrarCamaraAR;

    }


    if (btnCapturar) {

      btnCapturar.onclick =
        capturarGuajojo;

    }


    // ========================================================
    // 16. INFORMACIÓN PARA DEPURACIÓN
    // ========================================================

    if (
      intervaloEstadoAR
    ) {

      clearInterval(
        intervaloEstadoAR
      );

    }


    intervaloEstadoAR =
      setInterval(
        () => {


          if (
            sesionActual !==
            sesionAR
          ) {

            clearInterval(
              intervaloEstadoAR
            );

            intervaloEstadoAR =
              null;

            return;

          }


          const camera =
            escena.camera;


          if (!camera) {
            return;
          }


          const direccion =
            new AFRAME.THREE
              .Vector3();


          camera.getWorldDirection(
            direccion
          );


          console.log(
            '📱 Dirección cámara:',
            direccion.x.toFixed(2),
            direccion.y.toFixed(2),
            direccion.z.toFixed(2)
          );

        },
        2000
      );


  } catch (error) {


    console.error(
      '❌ ERROR AR:',
      error
    );


    if (
      sesionActual !==
      sesionAR
    ) {

      return;

    }


    if (
      streamCamara
    ) {


      streamCamara
        .getTracks()
        .forEach(
          track =>
            track.stop()
        );


      streamCamara =
        null;

    }


    video.srcObject =
      null;


    pantalla.style.display =
      'none';


    document.body.style.overflow =
      '';


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
  // AUDIO
  // ==========================================================

  const audio =
    document.getElementById(
      'audio-guajojo'
    );


  if (audio) {


    audio.play()
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


  sesionAR++;


  arIniciando =
    false;


  // ==========================================================
  // DETENER INTERVALO
  // ==========================================================

  if (
    intervaloEstadoAR
  ) {


    clearInterval(
      intervaloEstadoAR
    );


    intervaloEstadoAR =
      null;

  }


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
  // OCULTAR PANTALLA
  // ==========================================================

  if (pantalla) {

    pantalla.style.display =
      'none';

  }


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
  // RESTAURAR PÁGINA
  // ==========================================================

  document.body.style.overflow =
    '';

}


// ============================================================
// CERRAR CÁMARA AL SALIR DE LA PÁGINA
// ============================================================

window.addEventListener(
  'beforeunload',
  () => {


    if (
      streamCamara
    ) {


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
