import './style.css';

// ============================================================
// COMPONENTE: DETECTOR DE ENFOQUE
// Detecta si el Guajojó está realmente dentro y cerca
// del centro de la cámara.
// ============================================================

AFRAME.registerComponent('detector-enfoque', {

  tick: function () {

    const btn = document.getElementById('btn-capturar');
    const pantalla = document.getElementById('pantalla-ar');

    // Si la pantalla AR no está abierta, no hacemos nada.
    if (
      !btn ||
      !pantalla ||
      pantalla.style.display === 'none' ||
      !this.el.object3D.visible
    ) {
      return;
    }

    const scene = this.el.sceneEl;

    if (!scene || !scene.camera) return;

    const camera = scene.camera;

    // ---------------------------------------------------------
    // POSICIÓN MUNDIAL DEL GUAJOJÓ
    // ---------------------------------------------------------

    const posicionModelo = new AFRAME.THREE.Vector3();

    this.el.object3D.getWorldPosition(
      posicionModelo
    );

    // ---------------------------------------------------------
    // POSICIÓN MUNDIAL DE LA CÁMARA
    // ---------------------------------------------------------

    const posicionCamara = new AFRAME.THREE.Vector3();

    camera.getWorldPosition(
      posicionCamara
    );

    // ---------------------------------------------------------
    // DIRECCIÓN DESDE LA CÁMARA HACIA EL GUAJOJÓ
    // ---------------------------------------------------------

    const direccionModelo = posicionModelo
      .clone()
      .sub(posicionCamara)
      .normalize();

    // ---------------------------------------------------------
    // DIRECCIÓN HACIA DONDE ESTÁ MIRANDO LA CÁMARA
    // ---------------------------------------------------------

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

    // ---------------------------------------------------------
    // VER SI EL MODELO ESTÁ DELANTE DE LA CÁMARA
    // ---------------------------------------------------------

    const producto =
      direccionCamara.dot(
        direccionModelo
      );

    const estaDelante =
      producto > 0;

    // ---------------------------------------------------------
    // PROYECTAR EL MODELO A LA PANTALLA
    // ---------------------------------------------------------

    const posicionPantalla =
      posicionModelo.clone();

    posicionPantalla.project(
      camera
    );

    // ---------------------------------------------------------
    // VERIFICAR SI ESTÁ CERCA DEL CENTRO
    // ---------------------------------------------------------

    const dentroPantalla =
      posicionPantalla.x >= -1 &&
      posicionPantalla.x <= 1 &&
      posicionPantalla.y >= -1 &&
      posicionPantalla.y <= 1 &&
      posicionPantalla.z >= -1 &&
      posicionPantalla.z <= 1;

    // Zona central necesaria para capturar
    const centrado =
      estaDelante &&
      dentroPantalla &&
      posicionPantalla.x >= -0.38 &&
      posicionPantalla.x <= 0.38 &&
      posicionPantalla.y >= -0.38 &&
      posicionPantalla.y <= 0.38;

    // ---------------------------------------------------------
    // BOTÓN
    // ---------------------------------------------------------

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

let streamCamara = null;


// ============================================================
// MENÚ
// ============================================================

if (btnMenu) {

  btnMenu.addEventListener(
    'click',
    () => {

      sidebar?.classList.toggle(
        'abierto'
      );

    }
  );
}


// ============================================================
// FUNCIÓN MOSTRAR LEYENDA
// ============================================================

function mostrarLeyenda(
  titulo,
  descripcion,
  contenido = ''
) {

  if (!areaTexto) return;

  areaTexto.innerHTML = `
    <h2>${titulo}</h2>

    <p>
      ${descripcion}
    </p>

    ${contenido}
  `;

  sidebar?.classList.remove(
    'abierto'
  );
}


// ============================================================
// LEYENDA 1 - CARRETÓN
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
            silenciosas puede escucharse el sonido de un
            carretón que avanza por las calles.
          </p>

        </div>
        `
      );

    }
  );
}


// ============================================================
// LEYENDA 2 - GUAJOJÓ
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

        <button
          id="btn-abrir-ar"
          class="btn-ver-ar"
          type="button"
        >
          📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
        </button>


        <!-- ================================================= -->
        <!-- PANTALLA AR                                      -->
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
            background: #000;
            overflow: hidden;
          "
        >


          <!-- =============================================== -->
          <!-- CÁMARA REAL                                     -->
          <!-- =============================================== -->

          <video
            id="video-camara"
            autoplay
            playsinline
            muted
            style="
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              z-index: 1;
            "
          >
          </video>


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

              vr-mode-ui="enabled: false"

              renderer="
                alpha: true;
                antialias: true;
                colorManagement: true;
              "

              style="
                width: 100%;
                height: 100%;
                background: transparent !important;
              "
            >


              <!-- =========================================== -->
              <!-- RECURSOS                                    -->
              <!-- =========================================== -->

              <a-assets timeout="15000">

                <a-asset-item
                  id="modelo-guajojo-asset"
                  src="/guajojo.glb"
                >
                </a-asset-item>

              </a-assets>


              <!-- =========================================== -->
              <!-- GUAJOJÓ                                     -->
              <!-- =========================================== -->

              <a-entity

                id="modelo-guajojo"

                detector-enfoque

                gltf-model="#modelo-guajojo-asset"

                position="0 0 -3"

                scale="0.45 0.45 0.45"

                rotation="90 0 0"

                visible="false"

              >
              </a-entity>


              <!-- =========================================== -->
              <!-- ILUMINACIÓN                                 -->
              <!-- =========================================== -->

              <a-light

                type="ambient"

                color="#ffffff"

                intensity="1.8"

              >
              </a-light>


              <a-light

                type="directional"

                color="#ffffff"

                intensity="1.2"

                position="0 3 2"

              >
              </a-light>


              <a-light

                type="directional"

                color="#ffffff"

                intensity="0.6"

                position="0 -1 -2"

              >
              </a-light>


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

              >
              </a-camera>


            </a-scene>

          </div>


          <!-- =============================================== -->
          <!-- MENSAJE SUPERIOR                                -->
          <!-- =============================================== -->

          <div
            id="mensaje-ar"
            style="
              position: absolute;
              top: 18px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(0,0,0,0.8);
              color: #ffffff;
              padding: 10px 18px;
              border-radius: 24px;
              font-size: 14px;
              z-index: 10;
              text-align: center;
              max-width: 80%;
              pointer-events: none;
            "
          >

            📷 Gira tu celular y encuentra al Guajojó

          </div>


          <!-- =============================================== -->
          <!-- BOTÓN CAPTURAR                                  -->
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
              color: white;
              border: none;
              padding: 16px 42px;
              border-radius: 50px;
              font-size: 17px;
              font-weight: bold;
              box-shadow: 0 4px 18px rgba(0,0,0,0.5);
              z-index: 10;
              opacity: 0.6;
              transition: all 0.3s ease;
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

            style="
              position: absolute;
              top: 14px;
              right: 14px;
              background: rgba(0,0,0,0.65);
              color: white;
              border: none;
              width: 42px;
              height: 42px;
              border-radius: 50%;
              font-size: 20px;
              z-index: 20;
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


      // -------------------------------------------------------
      // Esperar a que el HTML dinámico exista
      // -------------------------------------------------------

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
// INICIAR CÁMARA AR
// ============================================================

async function iniciarCamaraAR() {

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
    return;
  }


  try {

    // ========================================================
    // 1. PERMISO PARA SENSORES / GIROSCOPIO
    // Especialmente necesario en iPhone
    // ========================================================

    if (
      typeof DeviceOrientationEvent !==
        'undefined' &&
      typeof DeviceOrientationEvent
        .requestPermission === 'function'
    ) {

      const permiso =
        await DeviceOrientationEvent
          .requestPermission();

      if (permiso !== 'granted') {

        alert(
          'Debes permitir el acceso al movimiento del celular para buscar al Guajojó.'
        );

        return;
      }
    }


    // ========================================================
    // 2. OCULTAR MODELO ANTES DE ABRIR
    // Evita que aparezca primero pegado al centro.
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
    // 4. ABRIR CÁMARA TRASERA
    // ========================================================

    streamCamara =
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


    video.srcObject =
      streamCamara;


    await video.play();


    // ========================================================
    // 5. MOSTRAR PANTALLA AR
    // ========================================================

    pantalla.style.display =
      'block';


    // Evitar scroll del sitio mientras AR está abierto
    document.body.style.overflow =
      'hidden';


    // ========================================================
    // 6. FORZAR REDIMENSIONADO
    // ========================================================

    window.dispatchEvent(
      new Event('resize')
    );


    // ========================================================
    // 7. REACTIVAR LOOK-CONTROLS
    // ========================================================

    const camaraVirtual =
      escena.querySelector(
        '#camara-ar'
      );


    if (
      camaraVirtual &&
      camaraVirtual.components[
        'look-controls'
      ]
    ) {

      camaraVirtual.components[
        'look-controls'
      ].pause();


      camaraVirtual.components[
        'look-controls'
      ].play();

    }


    // ========================================================
    // 8. FONDO TRANSPARENTE
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
      300
    );

    setTimeout(
      hacerTransparente,
      1000
    );


    // ========================================================
    // 9. COLOCAR EL GUAJOJÓ
    //
    // IMPORTANTE:
    //
    // Esperamos un poco para que el giroscopio tenga tiempo
    // de darle una orientación real a la cámara.
    //
    // El Guajojó se colocará 55° - 75° hacia un lado.
    // ========================================================

    setTimeout(
      () => {

        colocarGuajojoEnElMundo();

      },
      1000
    );


    // ========================================================
    // 10. EVENTOS
    // ========================================================

    if (btnCapturar) {

      btnCapturar.onclick =
        capturarGuajojo;

    }


    if (btnCerrar) {

      btnCerrar.onclick =
        cerrarCamaraAR;

    }


  } catch (err) {

    console.error(
      'Error cámara AR:',
      err
    );


    cerrarCamaraAR();


    alert(
      'No se pudo abrir la cámara.\n\n' +
      err.message
    );
  }
}


// ============================================================
// COLOCAR GUAJOJÓ FIJO EN EL "MUNDO"
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


  if (
    !escena ||
    !modelo ||
    !escena.camera
  ) {

    console.warn(
      'Todavía no está lista la escena AR.'
    );

    // Intentar nuevamente
    setTimeout(
      colocarGuajojoEnElMundo,
      300
    );

    return;
  }


  const camera =
    escena.camera;


  // ==========================================================
  // OBTENER ORIENTACIÓN ACTUAL DEL TELÉFONO
  // ==========================================================

  const quaternion =
    new AFRAME.THREE.Quaternion();


  camera.getWorldQuaternion(
    quaternion
  );


  // Dirección hacia donde mira actualmente el usuario
  const direccion =
    new AFRAME.THREE.Vector3(
      0,
      0,
      -1
    );


  direccion.applyQuaternion(
    quaternion
  );


  // Para ubicar el ave principalmente de forma horizontal
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
  // ELEGIR IZQUIERDA O DERECHA
  // ==========================================================

  const lado =
    Math.random() >
      0.5
      ? 1
      : -1;


  // ==========================================================
  // ÁNGULO DEL GUAJOJÓ
  //
  // Entre 55 y 75 grados respecto a donde estás mirando.
  //
  // Esto hace que inicialmente NO aparezca en el centro.
  // ==========================================================

  const anguloGrados =
    55 +
    Math.random() * 20;


  const angulo =
    AFRAME.THREE.MathUtils
      .degToRad(
        anguloGrados *
        lado
      );


  // Girar dirección sobre eje Y
  direccion.applyAxisAngle(

    new AFRAME.THREE.Vector3(
      0,
      1,
      0
    ),

    angulo

  );


  // ==========================================================
  // DISTANCIA VIRTUAL
  // ==========================================================

  const distancia =
    3;


  const posicion =
    direccion
      .multiplyScalar(
        distancia
      );


  // ==========================================================
  // ALTURA DEL GUAJOJÓ
  //
  // 0 = aproximadamente altura de la cámara.
  //
  // Puedes cambiar a:
  //
  // 0.4
  //
  // para que esté un poco más arriba.
  // ==========================================================

  posicion.y =
    0;


  // ==========================================================
  // COLOCAR MODELO
  // ==========================================================

  modelo.object3D.position.copy(
    posicion
  );


  // Mostrar SOLO después de colocarlo
  modelo.object3D.visible =
    true;


  // Asegurar matrices actualizadas
  modelo.object3D.updateMatrixWorld(
    true
  );


  console.log(
    '================================'
  );

  console.log(
    'GUAJOJÓ COLOCADO'
  );

  console.log(
    'Lado:',
    lado === 1
      ? 'Derecha'
      : 'Izquierda'
  );

  console.log(
    'Ángulo:',
    anguloGrados
  );

  console.log(
    'Posición:',
    posicion
  );

  console.log(
    '================================'
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
  // si todavía está deshabilitado,
  // no permitir captura.
  if (
    btnCapturar &&
    btnCapturar.disabled
  ) {
    return;
  }


  // Cerrar AR
  cerrarCamaraAR();


  // Ocultar botón de abrir AR
  const btnAbrir =
    document.getElementById(
      'btn-abrir-ar'
    );


  if (btnAbrir) {

    btnAbrir.style.display =
      'none';

  }


  // Mostrar contenido desbloqueado
  const contenido =
    document.getElementById(
      'contenido-capturado'
    );


  if (contenido) {

    contenido.style.display =
      'block';

  }


  // Reproducir canto
  const audio =
    document.getElementById(
      'audio-guajojo'
    );


  if (audio) {

    audio
      .play()
      .catch(
        () => {}
      );

  }
}


// ============================================================
// CERRAR CÁMARA AR
// ============================================================

function cerrarCamaraAR() {

  // ==========================================================
  // DETENER CÁMARA REAL
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
  // QUITAR VIDEO
  // ==========================================================

  const video =
    document.getElementById(
      'video-camara'
    );


  if (video) {

    video.pause();

    video.srcObject =
      null;

  }


  // ==========================================================
  // OCULTAR MODELO
  // ==========================================================

  const modelo =
    document.getElementById(
      'modelo-guajojo'
    );


  if (modelo) {

    modelo.object3D.visible =
      false;

  }


  // ==========================================================
  // OCULTAR PANTALLA AR
  // ==========================================================

  const pantalla =
    document.getElementById(
      'pantalla-ar'
    );


  if (pantalla) {

    pantalla.style.display =
      'none';

  }


  // Volver a permitir scroll
  document.body.style.overflow =
    '';
}
