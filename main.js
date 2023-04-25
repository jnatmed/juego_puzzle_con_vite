class Juego {

  /* @method 
  *  guardo un parte de la imagen y la devuelvo
  */
  dibujarImagenEnCanvas(canvas, xOrigen, yOrigen){
    let ctx = canvas.getContext("2d");
    var image = new Image();
    image.src = "imgs/paisaje.jpg";
    
    let [anchoOrigen, anchoDestino, altoOrigen, altoDestino] = [100,100,100,100];              
    let [xDestino, yDestino] = [0,0];
  
    ctx.drawImage(image,
                xOrigen, yOrigen, //coordenada x e y en imagen origen
                anchoOrigen, altoOrigen, //cant pixeles en ancho y alto que quiero tomar
                xDestino, yDestino, //coordenada x e y en destino
                anchoDestino, altoDestino//cuanto va a ocupar la imagen en destino
    );
    return canvas;
  }

}

function $(idElement) {
  return document.getElementById(idElement);
}

function $create(idElement,width, height) {
  idElement.width = width;
  idElement.height = height;
  idElement.margin = 0;
  return idElement;
}

function consola(msj){
  console.log(msj)
}

const juego = new Juego();

const coordXOrigen = [0,101,201];
const coordYOrigen = [0,101,201];

let fila = 0;

const puzzle = $('puzzle');
const piezas = $('piezas');
const mensaje = $('mensaje');

let currentCanvas = null;
let contextoAnterior = null;


coordYOrigen.forEach(function(coordY){

    coordXOrigen.forEach(function(coordX, i){
      
      const canvas = document.createElement('canvas');
      $create(canvas,100,100);
      canvas.id = "canvas_" + (i + fila);
      canvas.className = 'pieza';
      juego.dibujarImagenEnCanvas(canvas, coordX, coordY);
      canvas.draggable = true;

      canvas.addEventListener('touchstart', e => {
        const canvaSeccionado = $(e.changedTouches[0].target.id).id;
        consola("canvas seleccionado : " + canvaSeccionado)
        consola("0 " + e)
        let ctx = $(canvaSeccionado).getContext("2d");
        contextoAnterior = ctx;
        let cartel = "Seleccionado";
        /**Si el canvas seleccionado 
         * es distinto del anterior (currentCanvas)
         * entonces al anterior, borrarle el texto indicador
         */
        if(canvaSeccionado!=currentCanvas && currentCanvas!=null){
          consola(currentCanvas)
          

          /** Aca vuelvo a dibujar el lienzo anterior
           * 
           */

        }
        ctx.fillText(cartel,
          20,
          $(canvaSeccionado).clientHeight/2)
        currentCanvas = canvaSeccionado;
      })
      canvas.addEventListener('touchmove', e => {
        consola(currentCanvas.id);
        [...e.changedTouches].forEach(touch => {
          const dot = $(currentCanvas);
          dot.style.top = `${touch.clientY - dot.clientHeight/2}px`
          dot.style.left = `${touch.clientX - dot.clientWidth/2}px`
        })

      })
      consola("1 " + currentCanvas);
      piezas.appendChild(canvas);
    });
    fila = fila + 3;
});

consola("2 " + currentCanvas);

const imagenes = [
  'canvas_0', 'canvas_1', 'canvas_2', 
  'canvas_3', 'canvas_4', 'canvas_5', 
  'canvas_6','canvas_7', 'canvas_8'
];

let terminado = imagenes.length;

for (let i = 0; i < terminado; i++) {
  const div = document.createElement('div');
  div.className = 'placeholder';
  div.id = i;
  puzzle.appendChild(div);
  let placeHolder = $(i);

  placeHolder.addEventListener('touchstart', e => {
    const placeHolderSeccionado = $(e.changedTouches[0].target.id);
    consola("placeHolder seleccionado : " + placeHolderSeccionado.id)
    if ($(currentCanvas).id.split('_')[1] == placeHolderSeccionado.id){
        placeHolderSeccionado.appendChild($(currentCanvas))
    }

    // if(currentCanvas){
    //   placeHolderSeccionado.appendChild(currentCanvas)
    // }
  })
}



piezas.addEventListener('dragstart', e => {
  e.dataTransfer.setData('id', e.target.id);
});

puzzle.addEventListener('dragover', e => {
  e.preventDefault();
  e.target.classList.add('hover');
});

puzzle.addEventListener('dragleave', e => { 
  e.target.classList.remove('hover');
});

puzzle.addEventListener('drop', e => {
  e.target.classList.remove('hover');
  const id = e.dataTransfer.getData('id');
  console.log(`Id : ${id}`);
  const numero = id.split('_')[1];
  console.log(`e.target.id: ${e.target.id}`);
  if(e.target.id === numero){
    e.target.appendChild(document.getElementById(id));
    terminado--;
    if (terminado === 0) {
      document.body.classList.add('ganaste');
    }
  }
});