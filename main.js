import './style.css';

const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');
const btnLeyenda1 = document.getElementById('btn-leyenda-1');
const btnLeyenda2 = document.getElementById('btn-leyenda-2');
const areaTexto = document.getElementById('contenido-dinamico');

btnMenu.addEventListener('click', () => {
  sidebar.classList.toggle('abierto');
});

function mostrarLeyenda(titulo, descripcion, htmlExtra = '') {
  areaTexto.innerHTML = `
    <h2>${titulo}</h2>
    <p>${descripcion}</p>
    ${htmlExtra}
  `;
  sidebar.classList.remove('abierto');
}

btnLeyenda1.addEventListener('click', () => {
  mostrarLeyenda("El Carretón de la Otra Vida", "Se escucha el crujir de las ruedas acercándose en la oscuridad...");
});

btnLeyenda2.addEventListener('click', () => {
  
  const contenidoGuajojo = `
    <style>
      /* ESTO ELIMINA POR COMPLETO EL BOTÓN VR Y DEJA SOLO EL DE AR */
      .a-enter-vr-button { display: none !important; }
    </style>

    <div id="interfaz-ar" style="pointer-events: none; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: space-between; padding: 20px; box-sizing: border-box;">
      
      <div id="instruccion-juego" style="pointer-events: auto; background: rgba(6, 64, 43, 0.9); color: #d4af37; padding: 15px; border-radius: 10px; font-weight: bold; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
        Toca el botón 'AR' abajo a la derecha. Busca al Guajojó con tu cámara y ¡tócalo!
      </div>

      <div id="recompensa-oculta" style="display: none; pointer-events: auto; background: rgba(255, 255, 255, 0.95); padding: 20px; border-radius: 10px; width: 90%; max-height: 70vh; overflow-y: auto; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
        <h3 style="color: #008f39; text-align: center; margin-bottom: 15px;">¡Atrapaste al Guajojó! ✨</h3>
        <audio id="audio-guajojo" controls style="width: 100%; margin-bottom: 15px;">
          <source src="/audio-guajojo.mp3" type="audio/mpeg">
        </audio>
        <p style="font-size: 1rem; color: #333; text-align: justify; line-height: 1.6;">
          Cuenta la leyenda que hace muchos años, en una antigua tribu de la selva oriental, la hermosa hija del cacique se enamoró de un joven guerrero. El cacique, enfurecido, le quitó la vida al joven. La muchacha, llorando desconsolada, fue transformada por los espíritus en un ave de plumaje pardo. Desde entonces, el Guajojó se posa en los árboles y su canto lúgubre, que repite "¡Gua... jo... jó!", recuerda eternamente a su amor perdido.
        </p>
      </div>
    </div>

    <div class="contenedor-3d">
      <a-scene embedded style="width: 100%; height: 100%;" 
               webxr="optionalFeatures: dom-overlay; overlayElement: #interfaz-ar;"
               renderer="alpha: true; antialias: false; precision: mediump;" 
               cursor="rayOrigin: mouse" 
               raycaster="objects: .interactivo">
        
        <a-assets>
          <a-asset-item id="modelo-guajojo" src="/guajojo.glb"></a-asset-item>
        </a-assets>

        <!-- Fondo azul que desaparecerá automáticamente al entrar en AR -->
        <a-sky color="#87CEEB" hide-on-enter-ar></a-sky> 
        
        <a-light type="ambient" color="#ffffff" intensity="1.5"></a-light>
        <a-light type="directional" color="#ffffff" intensity="2" position="-2 4 2"></a-light>

        <!-- El Ave sola: Posicionada a 1.5m de altura y 2.5m de distancia, con animación de flote -->
        <a-gltf-model 
          id="el-guajojo" 
          class="interactivo" 
          src="#modelo-guajojo" 
          position="0 1.5 -2.5" 
          scale="0.5 0.5 0.5"
          animation="property: position; to: 0 1.6 -2.5; dir: alternate; dur: 2000; loop: true">
        </a-gltf-model>

        <a-camera position="0 1.6 0" look-controls="magicWindowTrackingEnabled: true; touchEnabled: true;"></a-camera>
      </a-scene>
    </div>
  `;

  mostrarLeyenda("El Minijuego del Guajojó", "", contenidoGuajojo);

  // Lógica del minijuego
  setTimeout(() => {
    const aveInteractiva = document.getElementById('el-guajojo');
    const panelRecompensa = document.getElementById('recompensa-oculta');
    const mensajeInstruccion = document.getElementById('instruccion-juego');
    const sonidoCanto = document.getElementById('audio-guajojo');

    if (aveInteractiva) {
      aveInteractiva.addEventListener('click', () => {
        mensajeInstruccion.style.display = 'none';
        panelRecompensa.style.display = 'block';
        if(sonidoCanto) sonidoCanto.play();
        
        // Animación de captura (el ave da una vuelta)
        aveInteractiva.setAttribute('animation__giro', 'property: rotation; to: 0 360 0; dur: 1000; loop: false; easing: easeInOutSine');
        aveInteractiva.classList.remove('interactivo');
      });
    }
  }, 500);
});
