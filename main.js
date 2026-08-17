import './style.css';

// ============================================================
// VARIABLES
// ============================================================
const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');
const btnLeyenda1 = document.getElementById('btn-leyenda-1');
const btnLeyenda2 = document.getElementById('btn-leyenda-2');
const areaTexto = document.getElementById('contenido-dinamico');

// ============================================================
// MENÚ
// ============================================================
btnMenu.addEventListener('click', () => {
  sidebar.classList.toggle('abierto');
});

// ============================================================
// MOSTRAR LEYENDA
// ============================================================
function mostrarLeyenda(titulo, descripcion, contenido = '') {
  areaTexto.innerHTML = `
    <h2>${titulo}</h2>
    <p>${descripcion}</p>
    ${contenido}
  `;
  sidebar.classList.remove('abierto');
}

// ============================================================
// CARRETÓN (sin AR por ahora)
// ============================================================
btnLeyenda1.addEventListener('click', () => {
  mostrarLeyenda(
    'El Carretón de la Otra Vida',
    'Se escucha el crujir de las ruedas de madera acercándose en la oscuridad...',
    `
    <div class="historia-leyenda">
      <h3>La Leyenda del Carretón</h3>
      <p>Cuenta la tradición que durante las noches silenciosas puede escucharse el sonido de un carretón que avanza por las calles.</p>
    </div>
    `
  );
});

// ============================================================
// GUAJOJÓ - EXPERIENCIA TIPO POKÉMON GO
// ============================================================
btnLeyenda2.addEventListener('click', () => {
  // Crear overlay de estado (debe existir antes de iniciar AR)
  let estadoAR = document.getElementById('estado-ar');
  if (!estadoAR) {
    estadoAR = document.createElement('div');
    estadoAR.id = 'estado-ar';
    estadoAR.style.cssText = `
      display: none;
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      padding: 12px 24px;
      border-radius: 30px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #ffffff;
      font-family: Arial, sans-serif;
      font-size: 16px;
      text-align: center;
      pointer-events: none;
      max-width: 90%;
    `;
    document.body.appendChild(estadoAR);
  }

  // Overlay de instrucciones + botón capturar (DOM Overlay)
  let overlayAR = document.getElementById('overlay-ar');
  if (!overlayAR) {
    overlayAR = document.createElement('div');
    overlayAR.id = 'overlay-ar';
    overlayAR.style.cssText = `
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 20px;
      z-index: 9998;
      text-align: center;
      pointer-events: none;
    `;
    overlayAR.innerHTML = `
      <div id="instruccion-ar" style="
        background: rgba(0,0,0,0.75);
        color: white;
        padding: 12px 20px;
        border-radius: 20px;
        margin-bottom: 16px;
        font-size: 15px;
        display: inline-block;
      ">
        📷 Mueve el celular para detectar una superficie
      </div>
      <button id="btn-capturar" style="
        display: none;
        pointer-events: auto;
        background: #2e7d32;
        color: white;
        border: none;
        padding: 16px 40px;
        border-radius: 50px;
        font-size: 18px;
        font-weight: bold;
        box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        cursor: pointer;
      ">
        ✨ CAPTURAR
      </button>
    `;
    document.body.appendChild(overlayAR);
  }

  mostrarLeyenda(
    'El Guajojó',
    'Un canto melancólico resuena en la selva. Explora el entorno y descubre su historia.',
    `
    <!-- BOTÓN PARA ENTRAR A AR -->
    <button id="btn-abrir-ar" class="btn-ver-ar" type="button">
      📱 VER GUAJOJÓ EN REALIDAD AUMENTADA
    </button>

    <!-- VISOR 3D (solo se usa en AR) -->
    <div class="contenedor-3d" style="display:none;">
      <a-scene
        id="escena-guajojo"
        embedded
        vr-mode-ui="enabled: false"
        xr-mode-ui="enabled: false"
        webxr="
          requiredFeatures: hit-test;
          optionalFeatures: dom-overlay;
          overlayElement: #overlay-ar;
          referenceSpaceType: local;
        "
        renderer="alpha: true; antialias: true; colorManagement: true;"
        background="transparent: true"
        ar-hit-test="target: #modelo-guajojo; type: footprint;"
      >
        <a-assets>
          <a-asset-item id="modelo-guajojo-asset" src="/guajojo.glb"></a-asset-item>
        </a-assets>

        <!-- Modelo invisible al inicio. Se colocará con hit-test -->
        <a-entity
          id="modelo-guajojo"
          gltf-model="#modelo-guajojo-asset"
          scale="0.2 0.2 0.2"
          visible="false"
        ></a-entity>

        <!-- Retícula (punto donde se colocará el modelo) -->
        <a-entity
          id="reticle"
          visible="false"
          geometry="primitive: ring; radiusInner: 0.04; radiusOuter: 0.06"
          material="color: #00ff88; shader: flat"
          rotation="-90 0 0"
        ></a-entity>

        <a-camera position="0 1.6 0" near="0.01" far="50"></a-camera>
      </a-scene>
    </div>

    <!-- CONTENIDO QUE SE REVELA DESPUÉS DE CAPTURAR -->
    <div id="contenido-capturado" style="display: none;">
      <div class="multimedia-leyenda">
        <div class="reproductor-leyenda">
          <h3>Escucha su canto original</h3>
          <audio id="audio-guajojo" controls>
            <source src="/audio-guajojo.mp3" type="audio/mpeg">
            Tu navegador no soporta audio.
          </audio>
        </div>
        <img src="/foto-guajojo.jpg" alt="Fotografía del Guajojó" class="foto-leyenda">
      </div>

      <div class="historia-leyenda">
        <h3>La Leyenda del Guajojó</h3>
        <p>Cuenta la leyenda que hace muchos años, en una antigua tribu de la selva oriental, la hermosa hija del cacique se enamoró perdidamente de un joven guerrero.</p><br>
        <p>Al enterarse de este romance prohibido, el cacique enfureció y llevó al joven guerrero a lo más profundo de la selva.</p><br>
        <p>La muchacha salió desesperada en busca de su amado y finalmente encontró su cuerpo sin vida.</p><br>
        <p>Su llanto fue tan profundo que los espíritus de la selva la transformaron en un ave.</p><br>
        <p>Desde entonces, durante las noches, puede escucharse su triste canto: <strong>¡Gua... jo... jó!</strong></p>
      </div>
    </div>
    `
  );

  // Esperar a que el botón exista
  setTimeout(() => {
    const botonAR = document.getElementById('btn-abrir-ar');
    if (botonAR) {
      botonAR.addEventListener('click', iniciarExperienciaAR);
    }
  }, 150);
});

// ============================================================
// INICIAR EXPERIENCIA AR
// ============================================================
function iniciarExperienciaAR() {
  const escena = document.getElementById('escena-guajojo');
  const contenedor = document.querySelector('.contenedor-3d');
  const overlayAR = document.getElementById('overlay-ar');

  if (!escena) {
    console.error('No se encontró la escena');
    return;
  }

  // Mostrar el contenedor de la escena
  if (contenedor) contenedor.style.display = 'block';

  // Mostrar overlay de instrucciones
  if (overlayAR) {
    overlayAR.style.display = 'block';
  }

  // Esperar a que la escena cargue
  const entrar = () => {
    try {
      escena.enterAR();
      mostrarEstadoAR('🟢 Busca una superficie plana...');
      configurarHitTest(escena);
    } catch (err) {
      console.error(err);
      alert('No se pudo iniciar AR:\n' + err.message);
    }
  };

  if (escena.hasLoaded) {
    entrar();
  } else {
    escena.addEventListener('loaded', entrar, { once: true });
  }
}

// ============================================================
// HIT-TEST + COLOCAR MODELO + CAPTURAR
// ============================================================
function configurarHitTest(escena) {
  const reticle = document.getElementById('reticle');
  const modelo = document.getElementById('modelo-guajojo');
  const btnCapturar = document.getElementById('btn-capturar');
  const instruccion = document.getElementById('instruccion-ar');

  let modeloColocado = false;
  let hitTestSource = null;
  let viewerSpace = null;
  let localSpace = null;

  // Cuando entra en sesión AR
  escena.addEventListener('enter-vr', async () => {
    const session = escena.renderer.xr.getSession();
    if (!session) return;

    viewerSpace = await session.requestReferenceSpace('viewer');
    localSpace = await session.requestReferenceSpace('local');

    // Solicitar hit-test
    try {
      hitTestSource = await session.requestHitTestSource({ space: viewerSpace });
    } catch (e) {
      console.warn('Hit-test no disponible:', e);
      // Fallback: colocar modelo frente a la cámara
      colocarModeloFallback(modelo);
    }

    // Loop de hit-test
    session.requestAnimationFrame(function onFrame(time, frame) {
      if (!session) return;
      session.requestAnimationFrame(onFrame);

      if (hitTestSource && !modeloColocado) {
        const hits = frame.getHitTestResults(hitTestSource);
        if (hits.length > 0) {
          const hit = hits[0];
          const pose = hit.getPose(localSpace);

          if (pose && reticle) {
            reticle.setAttribute('visible', true);
            reticle.object3D.position.set(
              pose.transform.position.x,
              pose.transform.position.y,
              pose.transform.position.z
            );
            reticle.object3D.quaternion.set(
              pose.transform.orientation.x,
              pose.transform.orientation.y,
              pose.transform.orientation.z,
              pose.transform.orientation.w
            );

            // Actualizar instrucción
            if (instruccion) {
              instruccion.textContent = '✅ Superficie detectada. Toca CAPTURAR cuando estés listo';
            }

            // Mostrar botón capturar
            if (btnCapturar) {
              btnCapturar.style.display = 'inline-block';
            }
          }
        } else {
          if (reticle) reticle.setAttribute('visible', false);
          if (instruccion) {
            instruccion.textContent = '📷 Mueve el celular para detectar una superficie';
          }
        }
      }
    });
  });

  // Botón CAPTURAR
  if (btnCapturar) {
    btnCapturar.onclick = () => {
      if (modeloColocado) return;

      // Colocar el modelo en la posición de la retícula
      if (reticle && modelo && reticle.getAttribute('visible')) {
        modelo.object3D.position.copy(reticle.object3D.position);
        modelo.object3D.quaternion.copy(reticle.object3D.quaternion);
        modelo.setAttribute('visible', true);
        reticle.setAttribute('visible', false);
        modeloColocado = true;

        // Cambiar UI
        if (instruccion) {
          instruccion.textContent = '✨ ¡Guajojó capturado!';
        }
        btnCapturar.style.display = 'none';

        mostrarEstadoAR('🟢 ¡CAPTURADO!');

        // Después de 1.5 segundos salir de AR y mostrar leyenda + audio
        setTimeout(() => {
          salirYRevelarContenido(escena);
        }, 1500);
      }
    };
  }
}

// Fallback si no hay hit-test
function colocarModeloFallback(modelo) {
  if (!modelo) return;
  modelo.setAttribute('position', '0 0 -1.5');
  modelo.setAttribute('visible', true);

  const btnCapturar = document.getElementById('btn-capturar');
  const instruccion = document.getElementById('instruccion-ar');

  if (instruccion) {
    instruccion.textContent = '✅ Modelo listo. Toca CAPTURAR';
  }
  if (btnCapturar) {
    btnCapturar.style.display = 'inline-block';
    btnCapturar.onclick = () => {
      mostrarEstadoAR('🟢 ¡CAPTURADO!');
      setTimeout(() => {
        const escena = document.getElementById('escena-guajojo');
        salirYRevelarContenido(escena);
      }, 1500);
    };
  }
}

// ============================================================
// SALIR DE AR Y REVELAR LEYENDA + AUDIO
// ============================================================
function salirYRevelarContenido(escena) {
  // Salir de AR
  if (escena && escena.renderer && escena.renderer.xr) {
    const session = escena.renderer.xr.getSession();
    if (session) {
      session.end();
    }
  }

  // Ocultar overlay AR
  const overlayAR = document.getElementById('overlay-ar');
  if (overlayAR) overlayAR.style.display = 'none';

  // Ocultar botón de entrar a AR
  const btnAbrir = document.getElementById('btn-abrir-ar');
  if (btnAbrir) btnAbrir.style.display = 'none';

  // Mostrar contenido capturado
  const contenido = document.getElementById('contenido-capturado');
  if (contenido) {
    contenido.style.display = 'block';
  }

  // Reproducir audio automáticamente
  const audio = document.getElementById('audio-guajojo');
  if (audio) {
    audio.play().catch(() => {
      // Algunos navegadores bloquean autoplay, el usuario puede darle play
      console.log('Autoplay bloqueado, el usuario puede reproducir manualmente');
    });
  }

  mostrarEstadoAR('📖 ¡Leyenda desbloqueada!');
}

// ============================================================
// MOSTRAR / OCULTAR ESTADO
// ============================================================
function mostrarEstadoAR(mensaje) {
  const estado = document.getElementById('estado-ar');
  if (estado) {
    estado.textContent = mensaje;
    estado.style.display = 'block';
    setTimeout(() => {
      estado.style.display = 'none';
    }, 3500);
  }
}
