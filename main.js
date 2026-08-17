import './style.css';


// ============================================================
// COMPONENTE: DETECTOR DE ENFOQUE
// ============================================================
// Detecta si el Guajojó está dentro de la cámara y suficientemente
// cerca del centro como para permitir la captura.
// ============================================================

AFRAME.registerComponent('detector-enfoque', {

  tick: function () {

    const btn = document.getElementById('btn-capturar');
    const pantalla = document.getElementById('pantalla-ar');

    if (
      !btn ||
      !pantalla ||
      pantalla.style.display === 'none' ||
      !this.el.object3D.visible
    ) {
      return;
    }

    const escena = this.el.sceneEl;

    if (!escena || !escena.camera) {
      return;
    }

    const camera = escena.camera;


    // ========================================================
    // POSICIÓN DEL GUAJOJÓ EN EL MUNDO
    // ========================================================

    const posicionModelo = new AFRAME.THREE.Vector3();

    this.el.object3D.getWorldPosition(
      posicionModelo
    );


    // ========================================================
    // POSICIÓN DE LA CÁMARA
    // ========================================================

    const posicionCamara = new AFRAME.THREE.Vector3();

    camera.getWorldPosition(
      posicionCamara
    );


    // ========================================================
    // DIRECCIÓN DE LA CÁMARA HACIA EL GUAJOJÓ
    // ========================================================

    const direccionModelo = posicionModelo
      .clone()
      .sub(posicionCamara)
      .normalize();


    // ========================================================
    // DIRECCIÓN HACIA DONDE ESTÁ MIRANDO LA CÁMARA
    // ========================================================

    const quaternionCamara =
      new AFRAME.THREE.Quaternion();

    camera.getWorldQuaternion(
      quaternionCamara
    );

    const direccionCamara =
      new AFRAME.THREE.Vector3(
        0,
        0,
        -1
      );

    direccionCamara
      .applyQuaternion(quaternionCamara)
      .normalize();


    // ========================================================
    // COMPROBAR QUE EL GUAJOJÓ ESTÉ DELANTE
    // ========================================================

    const producto =
      direccionCamara.dot(
        direccionModelo
      );

    const estaDelante =
      producto > 0;


    // ========================================================
    // CONVERTIR POSICIÓN 3D A POSICIÓN DE PANTALLA
    // ========================================================

    const posicionPantalla =
      posicionModelo.clone();

    posicionPantalla.project(
      camera
    );


    // ========================================================
    // COMPROBAR SI ESTÁ DENTRO DE LA PANTALLA
    // ========================================================

    const dentroPantalla =
      estaDelante &&
      posicionPantalla.x >= -1 &&
      posicionPantalla.x <= 1 &&
      posicionPantalla.y >= -1 &&
      posicionPantalla.y <= 1 &&
      posicionPantalla.z >= -1 &&
      posicionPantalla.z <= 1;


    // ========================================================
    // ZONA DONDE SE HABILITA CAPTURAR
    // ========================================================
    // Mientras más pequeño sea 0.38,
    // más exactamente tienes que centrar al Guajojó.
    // ========================================================

    const centrado =
      dentroPantalla &&
      posicionPantalla.x >= -0.38 &&
      posicionPantalla.x <= 0.38 &&
      posicionPantalla.y >= -0.38 &&
      posicionPantalla.y <= 0.38;


    // ========================================================
    // CAMBIAR BOTÓN
    // ========================================================

    if (centrado) {

      btn.style.background =
        '#1b5e20';

      btn.style.opacity =
        '1';

      btn.innerText =
        '✨ CAPTURAR';

      btn.disabled =
        false;

    } else {

      btn.style.background =
        '#555555';

      btn.style.opacity =
        '0.6';

      btn.innerText =
        '👀 Busca al Guajojó...';

      btn.disabled =
        true;
    }
  }
});


// ============================================================
// VARIABLES GENERALES
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


// Stream de la cámara real
let streamCamara = null;


// Evita abrir AR dos veces al tocar rápido
let arIniciando = false;


// Identifica cada sesión AR
let idSesionAR = 0;


// Temporizador para colocar el Guajojó
let temporizadorGuajojo = null;


// ============================================================
// MENÚ LATERAL
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

    <h2>${titulo}</h2>

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
            Cuenta la tradición que durante las noches silenciosas
            puede escucharse el sonido de un carretón que avanza
            por las calles.
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
            z-index: 9999;
            background: #000000;
            overflow: hidden;
          "
        >


          <!-- =============================================== -->
          <!-- VIDEO DE LA CÁMARA REAL                         -->
          <!-- =============================================== -->
          <!-- IMPORTANTE: NO TIENE AUTOPLAY                   -->
          <!-- El video se inicia manualmente desde JS         -->
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
          <!-- CAPA DEL MODELO 3D                              -->
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
            <!-- ESCENA A-FRAME                               -->
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
                logarithmicDepthBuffer: true;
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

              <a-assets timeout="15000">

                <a-asset-item
                  id="modelo-guajojo-asset"
                  src="/guajojo.glb"
                ></a-asset-item>

              </a-assets>


              <!-- =========================================== -->
              <!-- MODELO DEL GUAJOJÓ                           -->
              <!-- =========================================== -->

              <a-entity

                id="modelo-guajojo"

                detector-enfoque

                gltf-model="#modelo-guajojo-asset"

                position="0 0 -3"

                scale="0.45 0.45 0.45"

                rotation="90 0 0"

                visible="false"

              ></a-entity>


              <!-- =========================================== -->
              <!-- LUCES                                       -->
              <!-- =========================================== -->

              <a-light
                type="ambient"
                color="#ffffff"
                intensity="1.8"
              ></a-light>


              <a-light
                type="directional"
                color="#ffffff"
                intensity="1.2"
                position="0 3 2"
              ></a-light>


              <a-light
                type="directional"
                color="#ffffff"
                intensity="0.7"
                position="0 -1 -2"
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

                far="30"

              ></a-camera>


            </a-scene>

          </div>


          <!-- =============================================== -->
          <!-- INSTRUCCIÓN SUPERIOR                            -->
          <!-- =============================================== -->

          <div
            id="mensaje-ar"
            style="
              position: absolute;
              top: 18px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.78);
              color: #ffffff;
              padding: 11px 18px;
              border-radius: 24px;
              font-size: 14px;
              font-weight: 600;
              z-index: 10;
              text-align: center;
              width: max-content;
              max-width: 75%;
              pointer-events: none;
            "
          >
            📷 Gira tu celular y encuentra al Guajojó
          </div>


          <!-- =============================================== -->
          <!-- BOTÓN DE CAPTURA                                -->
          <!-- =============================================== -->

          <button

            id="btn-capturar"

            disabled

            type="button"

            style="
              position: absolute;
              bottom: 36px;
              left: 50%;
              transform: translateX(-50%);
              background: #555555;
              color: #ffffff;
              border: none;
              padding: 16px 32px;
              border-radius: 50px;
              font-size: 16px;
              font-weight: bold;
              box-shadow: 0 4px 18px rgba(0,0,0,0.5);
              z-index: 20;
              opacity: 0.6;
              transition:
                background 0.25s ease,
                opacity 0.25s ease,
                transform 0.25s ease;
              white-space: nowrap;
            "
          >
            👀 Busca al Guajojó...
          </button>


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
              background: rgba(0,0,0,0.72);
              color: #ffffff;
              border: none;
              width: 44px;
              height: 44px;
              border-radius: 50%;
              font-size: 21px;
              font-weight: bold;
              z-index: 30;
              cursor: pointer;
            "
          >
            ✕
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


          <!-- MENSAJE CAPTURADO -->

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
      // ESPERAR A QUE EL HTML DINÁMICO EXISTA
      // ======================================================

      setTimeout(
        () => {

          const btnAbrir =
            document.getElementById(
              'btn-abrir-ar'
            );

          if (btnAbrir) {

            btnAbrir.addEventListener(
              'click',
              iniciarCamaraAR
            );

          }

        },
        100
      );

    }
  );
}


// ============================================================
// ESPERAR A QUE EL VIDEO DE LA CÁMARA ESTÉ PREPARADO
// ============================================================

function esperarVideoListo(video) {

  return new Promise(
    (resolve, reject) => {

      if (!video) {

        reject(
          new Error(
            'No existe el elemento de video.'
          )
        );

        return;
      }


      // Si ya está listo, continuar.
      if (video.readyState >= 1) {

        resolve();

        return;
      }


      let terminado = false;


      const limpiar = () => {

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


      const listo = () => {

        if (terminado) {
          return;
        }

        terminado = true;

        limpiar();

        resolve();

      };


      const errorVideo = () => {

        if (terminado) {
          return;
        }

        terminado = true;

        limpiar();

        reject(
          new Error(
            'No se pudieron cargar los datos de la cámara.'
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


      // Seguridad para ciertos Android donde loadedmetadata
      // puede tardar demasiado en dispararse.
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
// Si Chrome lanza un AbortError momentáneo,
// intenta una segunda vez.
// ============================================================

async function reproducirVideoSeguro(
  video,
  sesionActual
) {

  if (!video) {
    return;
  }


  try {

    const promesa =
      video.play();

    if (promesa !== undefined) {

      await promesa;

    }

    return;

  } catch (error) {

    console.warn(
      'Primer intento de video.play():',
      error
    );


    // Si la sesión ya fue cerrada,
    // no debemos volver a intentar.
    if (
      sesionActual !== idSesionAR
    ) {
      return;
    }


    // AbortError:
    // Chrome interrumpió temporalmente play()
    if (
      error.name === 'AbortError' ||
      String(error.message)
        .includes('interrupted')
    ) {

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            180
          )
      );


      if (
        sesionActual !== idSesionAR ||
        !video.srcObject
      ) {
        return;
      }


      const segundoIntento =
        video.play();

      if (
        segundoIntento !== undefined
      ) {

        await segundoIntento;

      }

      return;
    }


    throw error;
  }
}


// ============================================================
// PEDIR PERMISO PARA EL GIROSCOPIO
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


    // En Android normalmente no existe requestPermission().
    return true;

  } catch (error) {

    console.warn(
      'No se pudo solicitar permiso de orientación:',
      error
    );

    return false;
  }
}


// ============================================================
// INICIAR CÁMARA + AR
// ============================================================

async function iniciarCamaraAR() {

  // ==========================================================
  // EVITAR DOBLE TOQUE
  // ==========================================================

  if (arIniciando) {

    console.log(
      'AR ya se está iniciando...'
    );

    return;
  }


  arIniciando = true;


  // Nueva sesión AR
  idSesionAR++;

  const sesionActual =
    idSesionAR;


  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );

  const video =
    document.getElementById(
      'video-camara'
    );

  const btnCapturar =
    document.getElementById(
      'btn-capturar'
    );

  const btnCerrar =
    document.getElementById(
      'btn-cerrar-ar'
    );

  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar'
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

    console.error(
      'No se encontraron los elementos necesarios para AR.'
    );

    arIniciando = false;

    return;
  }


  // Deshabilitar temporalmente el botón AR
  if (btnAbrir) {

    btnAbrir.disabled =
      true;

  }


  try {

    // ========================================================
    // 1. PERMISO DE GIROSCOPIO / ORIENTACIÓN
    // ========================================================

    const permisoOrientacion =
      await pedirPermisoOrientacion();


    if (!permisoOrientacion) {

      throw new Error(
        'No se concedió permiso para utilizar los sensores de movimiento.'
      );

    }


    // Verificar que no se haya cerrado mientras pedíamos permiso
    if (
      sesionActual !== idSesionAR
    ) {

      return;

    }


    // ========================================================
    // 2. REINICIAR MODELO
    // ========================================================

    if (modelo) {

      modelo.object3D.visible =
        false;

    }


    // ========================================================
    // 3. REINICIAR BOTÓN CAPTURAR
    // ========================================================

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
    // 4. MOSTRAR PANTALLA AR
    // ========================================================

    pantalla.style.display =
      'block';

    document.body.style.overflow =
      'hidden';


    // ========================================================
    // 5. DETENER STREAM ANTERIOR SI EXISTIERA
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
    // 6. SOLICITAR CÁMARA TRASERA
    // ========================================================

    if (
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {

      throw new Error(
        'Este navegador no permite acceder a la cámara.'
      );

    }


    const nuevoStream =
      await navigator.mediaDevices
        .getUserMedia({

          video: {

            facingMode: {
              ideal: 'environment'
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
    // 7. COMPROBAR QUE LA SESIÓN SIGA ACTIVA
    // ========================================================

    if (
      sesionActual !== idSesionAR
    ) {

      nuevoStream
        .getTracks()
        .forEach(
          track => track.stop()
        );

      return;

    }


    streamCamara =
      nuevoStream;


    // ========================================================
    // 8. CONFIGURAR VIDEO
    // ========================================================

    video.muted =
      true;

    video.playsInline =
      true;


    // IMPORTANTE:
    // solamente asignamos srcObject UNA VEZ.
    video.srcObject =
      streamCamara;


    // ========================================================
    // 9. ESPERAR METADATOS DEL STREAM
    // ========================================================

    await esperarVideoListo(
      video
    );


    if (
      sesionActual !== idSesionAR
    ) {

      return;

    }


    // ========================================================
    // 10. REPRODUCIR VIDEO DE FORMA SEGURA
    // ========================================================

    await reproducirVideoSeguro(
      video,
      sesionActual
    );


    if (
      sesionActual !== idSesionAR
    ) {

      return;

    }


    console.log(
      '✅ Cámara trasera iniciada.'
    );


    // ========================================================
    // 11. ACTUALIZAR TAMAÑO DE LA ESCENA
    // ========================================================

    window.dispatchEvent(
      new Event('resize')
    );


    // ========================================================
    // 12. REACTIVAR LOOK-CONTROLS
    // ========================================================

    const camaraVirtual =
      escena.querySelector(
        '#camara-ar'
      );


    if (
      camaraVirtual &&
      camaraVirtual.components &&
      camaraVirtual.components[
        'look-controls'
      ]
    ) {

      const controles =
        camaraVirtual.components[
          'look-controls'
        ];


      controles.pause();

      controles.play();

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


    if (escena.hasLoaded) {

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
      200
    );


    setTimeout(
      hacerTransparente,
      600
    );


    // ========================================================
    // 14. COLOCAR GUAJOJÓ DESPUÉS DE QUE EL SENSOR SE ESTABILICE
    // ========================================================

    if (temporizadorGuajojo) {

      clearTimeout(
        temporizadorGuajojo
      );

    }


    temporizadorGuajojo =
      setTimeout(
        () => {

          if (
            sesionActual !==
            idSesionAR
          ) {

            return;

          }


          colocarGuajojoEnElMundo();

        },
        1200
      );


    // ========================================================
    // 15. CONFIGURAR BOTONES
    // ========================================================

    if (btnCapturar) {

      btnCapturar.onclick =
        capturarGuajojo;

    }


    if (btnCerrar) {

      btnCerrar.onclick =
        cerrarCamaraAR;

    }


  } catch (error) {

    console.error(
      '❌ ERROR AL INICIAR AR:',
      error
    );


    // Si la sesión fue cerrada intencionalmente,
    // no mostramos un error.
    if (
      sesionActual !== idSesionAR
    ) {

      return;

    }


    // Limpiar stream si existiera
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


    if (video) {

      video.srcObject =
        null;

    }


    pantalla.style.display =
      'none';

    document.body.style.overflow =
      '';


    let mensaje =
      'No se pudo abrir la cámara.';


    // ========================================================
    // MENSAJES MÁS CLAROS
    // ========================================================

    if (
      error.name ===
      'NotAllowedError'
    ) {

      mensaje =
        'No se pudo abrir la cámara porque el permiso fue rechazado.\n\nPermite el uso de la cámara en Chrome e inténtalo nuevamente.';

    } else if (
      error.name ===
      'NotFoundError'
    ) {

      mensaje =
        'No se encontró una cámara disponible en este dispositivo.';

    } else if (
      error.name ===
      'NotReadableError'
    ) {

      mensaje =
        'La cámara está siendo utilizada por otra aplicación o no está disponible en este momento.';

    } else if (
      error.name ===
      'OverconstrainedError'
    ) {

      mensaje =
        'La cámara no soporta la configuración solicitada.';

    } else if (
      error.name ===
      'AbortError'
    ) {

      mensaje =
        'Chrome interrumpió el inicio de la cámara. Intenta abrir AR nuevamente.';

    } else if (
      error.message
    ) {

      mensaje =
        'No se pudo iniciar la cámara AR.\n\n' +
        error.message;

    }


    alert(
      mensaje
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
// COLOCAR GUAJOJÓ FIJO EN UNA DIRECCIÓN DEL MUNDO
// ============================================================
// El Guajojó se coloca entre aproximadamente 55° y 75°
// a la izquierda o derecha de donde estás mirando.
// Por eso debes girar el teléfono para encontrarlo.
// ============================================================

function colocarGuajojoEnElMundo() {

  const escena =
    document.getElementById(
      'escena-guajojo'
    );

  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );

  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  if (
    !pantalla ||
    pantalla.style.display ===
      'none'
  ) {

    return;

  }


  if (
    !escena ||
    !modelo ||
    !escena.camera
  ) {

    console.warn(
      'La escena todavía no está preparada. Reintentando...'
    );


    temporizadorGuajojo =
      setTimeout(
        colocarGuajojoEnElMundo,
        300
      );


    return;
  }


  const camera =
    escena.camera;


  // ==========================================================
  // OBTENER ORIENTACIÓN ACTUAL
  // ==========================================================

  const quaternion =
    new AFRAME.THREE.Quaternion();


  camera.getWorldQuaternion(
    quaternion
  );


  // ==========================================================
  // OBTENER DIRECCIÓN HACIA DONDE MIRA EL USUARIO
  // ==========================================================

  const direccion =
    new AFRAME.THREE.Vector3(
      0,
      0,
      -1
    );


  direccion.applyQuaternion(
    quaternion
  );


  // Solo nos interesa inicialmente el giro horizontal
  direccion.y =
    0;


  if (
    direccion.lengthSq() <
    0.001
  ) {

    direccion.set(
      0,
      0,
      -1
    );

  }


  direccion.normalize();


  // ==========================================================
  // ELEGIR LADO ALEATORIO
  // ==========================================================

  const lado =
    Math.random() >= 0.5
      ? 1
      : -1;


  // ==========================================================
  // ÁNGULO
  // ==========================================================
  // 55° a 75° hace que normalmente no esté visible
  // al abrir la cámara.
  // ==========================================================

  const anguloGrados =
    55 +
    Math.random() * 20;


  const anguloRadianes =
    AFRAME.THREE.MathUtils
      .degToRad(
        anguloGrados *
        lado
      );


  // ==========================================================
  // ROTAR LA DIRECCIÓN
  // ==========================================================

  direccion.applyAxisAngle(

    new AFRAME.THREE.Vector3(
      0,
      1,
      0
    ),

    anguloRadianes

  );


  // ==========================================================
  // DISTANCIA VIRTUAL DEL GUAJOJÓ
  // ==========================================================

  const distancia =
    3;


  const posicion =
    direccion
      .multiplyScalar(
        distancia
      );


  // Altura
  posicion.y =
    0;


  // ==========================================================
  // COLOCAR EL MODELO
  // ==========================================================

  modelo.object3D.position.copy(
    posicion
  );


  modelo.object3D.visible =
    true;


  modelo.object3D.updateMatrixWorld(
    true
  );


  console.log(
    '==============================='
  );

  console.log(
    '🦉 GUAJOJÓ COLOCADO'
  );

  console.log(
    'Lado:',
    lado === 1
      ? 'derecha'
      : 'izquierda'
  );

  console.log(
    'Ángulo:',
    anguloGrados.toFixed(1),
    'grados'
  );

  console.log(
    'Posición:',
    posicion
  );

  console.log(
    '==============================='
  );
}


// ============================================================
// CAPTURAR GUAJOJÓ
// ============================================================

function capturarGuajojo() {

  const btnCapturar =
    document.getElementById(
      'btn-capturar'
    );


  // Seguridad:
  // no capturar si el botón sigue deshabilitado.
  if (
    !btnCapturar ||
    btnCapturar.disabled
  ) {

    return;

  }


  // ==========================================================
  // CERRAR AR
  // ==========================================================

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
  // MOSTRAR CONTENIDO CAPTURADO
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
  // REPRODUCIR SONIDO
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
            'El audio no pudo reproducirse automáticamente:',
            error
          );

        }
      );

  }
}


// ============================================================
// CERRAR CÁMARA AR
// ============================================================

function cerrarCamaraAR() {

  // ==========================================================
  // INVALIDAR CUALQUIER INICIO PENDIENTE
  // ==========================================================

  idSesionAR++;

  arIniciando =
    false;


  // ==========================================================
  // CANCELAR TEMPORIZADOR
  // ==========================================================

  if (temporizadorGuajojo) {

    clearTimeout(
      temporizadorGuajojo
    );

    temporizadorGuajojo =
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
  // OCULTAR PANTALLA PRIMERO
  // ==========================================================

  if (pantalla) {

    pantalla.style.display =
      'none';

  }


  // ==========================================================
  // OCULTAR GUAJOJÓ
  // ==========================================================

  if (modelo) {

    modelo.object3D.visible =
      false;

  }


  // ==========================================================
  // DETENER STREAM
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
  // NO utilizamos video.load().
  // NO llamamos video.pause() mientras play() podría estar
  // iniciándose.
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
// SI EL USUARIO SALE DE LA PÁGINA, APAGAR LA CÁMARA
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
