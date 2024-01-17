let form = document.querySelector(".search-form");
let resultShowMusic = document.querySelector(".result-show-music");
let resultImageMusic= document.querySelector(".result-image-music");
let resultShowVideo = document.querySelector(".result-show-video");
let button = document.querySelector(".search");
let input = document.querySelector(".searchname");
let audio = document.querySelector("audio");
let video = document.querySelector("video");
let checkbox = document.querySelector("#autoplay");
let autoplay = ""; // Se usa más adelante para capturar datos para el autoplay
let idSong="";
let idVideo="";
let audioCount=0;
let videoCount=0;

console.log(audio);
// text value need to storage when the submit button action happen
form.addEventListener("submit", function (event) {
  event.preventDefault();

  let searchText = document.querySelector("#searchname").value;

  console.log("searchText", searchText);

  resultShowMusic.textContent = "";
  resultShowVideo.textContent = "";

  fetch(`https://cors-anywhere.herokuapp.com/https://itunes.apple.com/search?term=${searchText}`) // fetch pattern
    .then(function (data) {
      return data.json();
    })
    .then(function (json) {
      console.log(json); // fetch pattern

      for (var i = 0; i < json.results.length; i++) {
        let name = json.results[i].artistName;
        let img = json.results[i].artworkUrl100;
        let songName = json.results[i].collectionName;
        let audio2 = json.results[i].previewUrl;
        let kind = json.results[i].kind;
        let showMusic='';
        let showVideo='';
        
        if (kind==='song'){ // Detecta si es audio.
          // Guarda en una variable la imagen y con su nombre del autor y de la canción, luego podrá ser llamado para mostrar.
          // TODO y tipo de archivo? "type="audio/mpeg"
          showMusic = `
              <div class = "song">
                  <img id="audio-${audioCount}" src="${img}" value= "${audio2}" alt="">
                  <h3> ${name} </h3>
                  <h2> ${songName} </h2>
                  <!--<audio controls class = "play">-->
                  <source value="" src="${audio2}" type="audio/mpeg">
              </div>
              `;

              audioCount++; //por qué solo asigna hasta el número 16??
              ///img scr tag, then add new value tag, so I can call it later
              ///when other event happend///
        } else if (kind==='feature-movie' || kind === 'music-video') { // Detecta si es video            
            // La variable guarda la canción obtenida para mostrar una imagen de ella, con su nombre. TODO (y tipo de archivo?).
            showVideo = `
              <div class = "song">
                  <img id="video-${videoCount}" src="${img}" value= "${audio2}" alt="">                  
                  <h3> ${name} </h3>
                  <h2> ${songName} </h2>

                  <source value="" src="${audio2}" type="audio/mpeg">
              </div>
              `;

              videoCount++;
        }
        
        // Por cada iteneración mostrará una canión y vídeo en el último elemento (no borra datos).
         resultShowMusic.insertAdjacentHTML("beforeEnd", showMusic);
         resultShowVideo.insertAdjacentHTML("beforeEnd", showVideo);
      }
    });

});

// Listener del checkbox Autoplay
checkbox.addEventListener('change', function(){
  if(this.checked){
    audio.autoplay=true;
    audio.load();
    audio.pause();

    video.autoplay=true;
    video.load();
    video.pause()
  } else {
    audio.autoplay=false;
    audio.load();
    audio.pause();
    
    video.autoplay=false;
    video.load();
    video.pause();
  }
});

// Capta el click a una canción para reproducir en el reproductor.
resultShowMusic.addEventListener("click", function (click) {
  video.pause(); //sin esto el video continuaría corriendo y encima la siguiente sentencia lo haría invisible.
  document.getElementById("video-player").style.display="none";
  document.getElementById("audio-player").style.display="inline-block";
  
  autoplay = document.querySelectorAll("img");
  console.log(autoplay); 
  if (click.target && click.target.nodeName === "IMG")
    audio.src = click.target.getAttribute("value"); //obtiene la url del audio y lo manda al reproductor.
    idSong=click.target.getAttribute("id"); //Intentando obtener el número de la canción por el arrayNode de img.    
    console.log(idSong);
    console.log(document.getElementById(idSong).parentNode);
    console.log(click.target);
    console.log("audio", audio.src);
    
    //Mostramos el contenedor para el reproductor con su imagen y título (para en caso de que esté "hidden").
    let imageToDelete=document.querySelector(".result-image-music").parentNode;
    console.log(imageToDelete);
    imageToDelete.style.display="block";
    
    //Obtenemos la imagen para cargar en el reproductor.
    console.log(click.target);
    let imageAudio=click.target.src;
    let contenedorClick=document.getElementById(idSong).parentNode;
    let nombreArtista=contenedorClick.querySelector("h3").outerHTML;
    let nombreCancion=contenedorClick.querySelector("h2").outerHTML;
    console.log(nombreArtista);
    let showImageMusic=`
      <img src="${imageAudio}" alt="">
      ${nombreArtista}
      ${nombreCancion}`;
    resultImageMusic.innerHTML = showImageMusic;
});

//TODO Se le debería pasar por param la canción que ha hecho saltar este Listener
audio.addEventListener("ended", function(){
  /* Esto funciona pero es una ñapa, hay que intentar sacar el array de nodos img e haciendo el autoplay con eso, 
  el siguiente if daría error si la canción que hace saltar el Listenner es la última.
  */

  if(audio.autoplay==true){
    idSong=parseInt(idSong.substring(6));
    idSong++;
    idSong="audio-"+idSong;
    console.log(idSong);
    
    console.log(document.getElementById(idSong).getAttribute("value"));
    audio.src=document.getElementById(idSong).getAttribute("value");
    
    //Obtenemos la imagen para cargar en el reproductor cuando sucede autoplay.
    console.log(document.getElementById(idSong));
    let imageAudio=document.getElementById(idSong).getAttribute("src");
    let contenedorClick=document.getElementById(idSong).parentNode;
    let nombreArtista=contenedorClick.querySelector("h3").outerHTML;
    let nombreCancion=contenedorClick.querySelector("h2").outerHTML;
    let showImageMusic=`
      <img src="${imageAudio}" alt="">
      ${nombreArtista}
      ${nombreCancion}`;
    resultImageMusic.innerHTML = showImageMusic;
  }    
});

resultShowVideo.addEventListener("click", function (click){
  audio.pause(); //sin esto el audio continuaría corriendo y la sentencia de abajo también hace que sea invisible.
  document.getElementById("audio-player").style.display="none";
  document.getElementById("video-player").style.display="inline-block";
  
  let img = document.querySelectorAll("img");
  if (click.target && click.target.nodeName === "IMG")
    // capital img tag
    video.src = click.target.getAttribute("value"); // obtiene la url del video y la manda al reproductor.
  console.log("video", video.src);

  //Borra la imagen del audio para dar paso al reproductor
  let imageToDelete=document.querySelector(".result-image-music").parentNode;
  console.log(imageToDelete);
  imageToDelete.style.display="none";
  //removeChild(document.querySelector(".result-image-music"));
  
});

video.addEventListener("ended", function(){
  /* Esto funciona pero es una ñapa, hay que intentar sacar el array de nodos img e haciendo el autoplay con eso, 
  el siguiente if daría error si la canción que hace saltar el Listenner es la última.
  */

  /*TODO no puedo usar el valor idVideo (que es lo que quiería) debido a que no se le da ningún valor puesto que,
  este se obtiene del parámetro de entrada del Listener "click" y esto se le asigna a la variable idSong. Habría que
  cambiar el nombre de esta variable por idItem para que fuera más entendible.
  */
  if(audio.autoplay==true){
    idSong=parseInt(idSong.substring(6));
    idSong++;
    idSong="video-"+idSong;
    console.log(idSong);
    console.log(document.getElementById(idSong).getAttribute("value"));
    video.src=document.getElementById(idSong).getAttribute("value");
  }    
});
