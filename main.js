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
    <div class="contenedor-3d">
      <a-scene embedded style="width: 100%; height: 100%;" vr-mode-ui="enabled: true" renderer="antialias: false; precision: lowp; logarithmicDepthBuffer: false;">
        <a-assets>
          <a-asset-item id="modelo-guajojo" src="/guajojo.glb"></a-asset-item>
        </a-assets>

        <!-- TRUCO 1: Cielo con menos segmentos (menos cálculos para el celular) -->
        <a-sky color="#87CEEB" segments-width="16" segments-height="16"></a-sky> 
        
        <a-light type="ambient" color="#ffffff" intensity="1.5"></a-light>
        <a-light type="directional" color="#ffffff" intensity="2" position="-2 4 2"></a-light>

        <a-gltf-model src="#modelo-guajojo" position="0 -1 -5" scale="0.2 0.2 0.2"></a-gltf-model>

        <!-- TRUCO 2: far="30" le prohíbe a la cámara renderizar objetos lejanos innecesarios -->
        <a-camera position="0 1.6 -4" far="30" look-controls="magicWindowTrackingEnabled: true; touchEnabled: true;">
          <a-cursor color="#d4af37"></a-cursor>
        </a-camera>
      </a-scene>
    </div>

    <div class="multimedia-leyenda">
      
      <div class="reproductor-leyenda">
        <h3>Escucha su canto original</h3>
        <audio controls>
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
  `;

  mostrarLeyenda(
    "El Guajojó", 
    "Un canto melancólico resuena en la selva. Explora el entorno, conoce al ave y descubre su trágica historia.",
    contenidoGuajojo
  );
});
