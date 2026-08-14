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
  mostrarLeyenda(
    "El Carretón de la Otra Vida", 
    "Se escucha el crujir de las ruedas de madera acercándose en la oscuridad..."
  );
});

btnLeyenda2.addEventListener('click', () => {
  
  const contenidoGuajojo = `
    <div id="instruccion-juego" style="text-align: center; margin-bottom: 15px; color: #d4af37; font-size: 1.3rem; font-weight: bold; background: #06402B; padding: 10px; border-radius: 8px;">
      Activa el modo AR en tu celular, busca el ave en tu entorno y ¡tócala para descubrir su historia!
    </div>

    <div class="contenedor-3d">
      <!-- cursor="rayOrigin: mouse" habilita el toque en la pantalla. raycaster limita los toques a objetos con la clase interactivo -->
      <a-scene embedded style="width: 100%; height: 100%;" renderer="alpha: true; antialias: false; precision: mediump;" cursor="rayOrigin: mouse" raycaster="objects: .interactivo">
        
        <a-assets>
          <a-asset-item id="modelo-guajojo" src="/guajojo.glb"></a-asset-item>
        </a-assets>

        <a-sky color="#87CEEB" hide-on-enter-ar></a-sky> 
        
        <a-light type="ambient" color="#ffffff" intensity="1.5"></a-light>
        <a-light type="directional" color="#ffffff" intensity="2" position="-2 4 2"></a-light>

        <!-- Agregamos un ID, la clase 'interactivo' y una animación de flotación para que parezca un objeto de juego -->
        <a-gltf-model 
          id="el-guajojo" 
          class="interactivo" 
          src="#modelo-guajojo" 
          position="0 0 -3" 
          scale="0.2 0.2 0.2"
          animation="property: position; to: 0 0.1 -3; dir: alternate; dur: 2000; loop: true">
        </a-gltf-model>

        <a-camera position="0 1.6 0" look-controls="magicWindowTrackingEnabled: true; touchEnabled: true;">
        </a-camera>
        
      </a-scene>
    </div>

    <!-- Sección oculta que actuará como recompensa al atrapar al ave -->
    <div id="recompensa-oculta" style="display: none; transition: opacity 0.5s ease-in-out; margin-top: 20px;">
      
      <div style="text-align: center; color: #008f39; font-size: 1.8rem; font-weight: bold; margin-bottom: 20px;">
        ¡Atrapaste al Guajojó! ✨
      </div>

      <div class="multimedia-leyenda">
        <div class="reproductor-leyenda">
          <h3>Escucha su canto original</h3>
          <!-- Agregamos el ID al audio para poder darle Play desde JavaScript -->
          <audio id="audio-guajojo" controls>
            <source src="/audio-guajojo.mp3" type="audio/mpeg">
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>

        <img src="/foto-guajojo.jpg" alt="Fotografía del ave Guajojó" class="foto-leyenda">
      </div>

      <div class="historia-leyenda">
        <h3>La Leyenda del Guajojó</h3>
        <p>
          Cuenta la leyenda que hace muchos años, en una antigua tribu de la selva oriental, la hermosa hija del cacique se enamoró perdidamente de un joven guerrero de la misma tribu, pero de menor rango. Al enterarse de este romance prohibido, el cacique, enfurecido, usó sus poderes y llevó al joven a lo más espeso de la selva para quitarle la vida y separar así a los amantes para siempre.
        </p>
        <br>
        <p>
          La muchacha, al notar la prolongada ausencia de su amado, corrió desesperada a buscarlo por la espesura del bosque. Tras mucho caminar, encontró su cuerpo sin vida. Su llanto fue tan desgarrador y lleno de dolor que conmovió a los espíritus mismos de la selva.
        </p>
        <br>
        <p>
          El cacique, al encontrar a su hija en medio de su llanto inconsolable y temiendo que su traición fuera descubierta, intentó hechizarla. Sin embargo, los espíritus se le adelantaron y, para librarla de su tormento humano, transformaron a la joven en un ave de plumaje pardo, que se mimetiza con las ramas secas. Desde entonces, el Guajojó se posa en los árboles de la selva y su canto lúgubre, que suena como un lamento que repite "¡Gua... jo... jó!", se escucha en las noches, recordando eternamente a su amor perdido.
        </p>
      </div>
    </div>
  `;

  mostrarLeyenda(
    "El Minijuego del Guajojó", 
    "", 
    contenidoGuajojo
  );

  // --- LÓGICA DE PROGRAMACIÓN DEL MINIJUEGO ---
  // Usamos un ligero retraso (setTimeout) para asegurarnos de que la escena 3D se dibujó en la pantalla antes de buscarla.
  setTimeout(() => {
    const aveInteractiva = document.getElementById('el-guajojo');
    const panelRecompensa = document.getElementById('recompensa-oculta');
    const mensajeInstruccion = document.getElementById('instruccion-juego');
    const sonidoCanto = document.getElementById('audio-guajojo');

    if (aveInteractiva) {
      // Evento que escucha el "toque" en la pantalla sobre el ave
      aveInteractiva.addEventListener('click', () => {
        
        // 1. Ocultar el mensaje de arriba
        mensajeInstruccion.style.display = 'none';

        // 2. Mostrar la historia y la foto
        panelRecompensa.style.display = 'block';

        // 3. Reproducir el canto de forma automática (Funciona porque se activó a través de una acción del usuario)
        if(sonidoCanto) {
          sonidoCanto.play();
        }

        // 4. Efecto visual: Hacemos que el ave gire 360 grados indicando que fue capturada
        aveInteractiva.setAttribute('animation__giro', 'property: rotation; to: 0 360 0; dur: 1000; loop: false; easing: easeInOutSine');
        
        // 5. Opcional: Hacerla inactiva después del primer toque para no repetir la animación
        aveInteractiva.classList.remove('interactivo');
      });
    }
  }, 500);

});
