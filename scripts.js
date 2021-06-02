/*Para implementar a futuro, voy a crear funciones, que llame a cada cosa. El el formulario, el usuario podra introducir, artista, y buscar todas las canciones del artista (funcion buscarArtista). Luego, si quiere buscar artista, y que contenga X palabra en su canciones, funcion buscaArtistaPalabras, etc. Cada vez que se envie informacion, en base a la que se envie, llamar a una funcion u otra.*/

document.querySelector("#searchImput").addEventListener("click", function (e) {
    e.preventDefault(); //Esto es para evitar que la pagina recarge por defecto
    let pickedArtist = (document.querySelector("#artistField").value).replace(" ", "_"); //Metemos el replace, para sustituir espacios por barras bajas
    console.log(pickedArtist);
    axios.get(`https://api.deezer.com/search/artist?q=${pickedArtist}`)
    .then(function(response1){
        console.log(response1)
        let artistData = response1.data.data
        let artist = {artistName :artistData[0].name, artistPicture : artistData[0].picture_big, artistNbAlbum : artistData[0].nb_album, artistNbFan :artistData[0].nb_fan, songList:[] }
        //De momento, he decido mostrar unicamente el primer resultado (posicion [0] en el array de artistData), a futuro dejare selecionar entre los distintos artistas encontrados con el nombre de artista introducido.)
        
        //  
        document.querySelector(".artistSection").innerHTML += `<h1 class="artistTitle">${artist.artistName}</h1>
                <img src="${artist.artistPicture}" alt="">
                <p>Artist's albums: ${artist.artistNbAlbum}</p>
                <p>Artist's fans: ${artist.artistNbFan}</p>`
        //Una vez conseguimos el artista principal que busca el usuario (artistData[0].name), realizamos una nueva llamada a la api, pidiendo su top canciones:
        axios.get(`https://api.deezer.com/search/track?q=${artistData[0].name}`)
        .then(function(response2){
            console.log(response2);
            let trackData = response2.data.data
            trackData.forEach(trackElement => {
                if (trackElement.artist.id == artistData[0].id){
                    //Si el id del artista de response1 coincide con el id del artista del track recibido de response2, muestro las canciones. Esto es para evitar poner canciones de otros artistas que contengan el nombre introducido. 
                    let song = {songPicture : trackElement.album.cover_medium, songTitle : trackElement.title_short, songAlbum : trackElement.album.title, songPreview : trackElement.preview}
                    
                    console.log("Cumpliendose el if, el foreach del array de trackData da lo siguiente:")
                    console.log(trackElement)

                    //-------------------Ahora voy a llamar a MusicXMatch
                    axios.get(`http://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist.artistName}}&page_size=10&page=1&s_track_rating=desc&apikey=9a02741f06fec2008254115a0846b094`)
                    .then(function(response3){
                        console.log("Esto da el response3")
                        console.log(response3)
                        let songsMXM = response3.data.message.body.track_list
                        songsMXM.forEach(songsMXMElement => {
                        if (songsMXMElement.track.track_name == song.songTitle){
                            console.log("Esta cancion coincide de Deezer con MusicXMatch")
                            console.log(songsMXMElement.track.track_name)
                            axios.get(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=9a02741f06fec2008254115a0846b094&track_id=${songsMXMElement.track.track_id}`)
                            .then(function(response4){
                                console.log("Esto da response4:")
                                console.log(response4)
                                song.songLyrics = response4.data.message.body.lyrics.lyrics_body; //Y aqui, metemos en nuestra lista de songs, los lyrics de cada una.
                                //Debido a la cantidad de peticiones a API mediante Axios, y por diferentes tiempos de carga, la unica forma de cargar la letra de las canciones es mediante un funcion, llamandola cuando todas las peticiones API se hayan realizado y el cuerpo de la cancion (Titulo, album, letra, y sonidos) esten guardados en songList.
                               paintInHTMLyricsSong(song);
                            })
                        }
                        else{
                            console.log("No coincide cancion")
                            song.songLyrics = 'No existen letras'
                        }
                        
                    });
                })
                artist.songList.push(song);
                //----------------------------
            } 
                
                });
                console.log("Asi queda tu array de artist:")
                console.log(artist)

                
            console.log("Esta es tu lista de 'artist', donde guardas todo. Es como tu primera API offline")
            console.log(artist)
        })

        
    .catch(function (error){
        console.log(error);
    });
})
})
    

    function paintInHTMLyricsSong(song){
                document.querySelector(".songInfo").innerHTML += `<img src="${song["songPicture"]}" alt="imagenDemo">
                                    <h3 class="title">${song["songTitle"]}</h3>
                                    <h4 class="album"><i>${song["songAlbum"]}</i></h4>
                                    <p class="lyrics">${song.songLyrics}</p>
                                    <div class="previewBottomDiv">
                                    <p>Song preview:</p>
                                    <audio controls>
                                        <source src="${song["songPreview"]}" type="audio/mpeg">
                                        Your browser does not support the audio element.
                                    </audio>
                                    </div>`                
            
    }



//----------------------------Esto es antes de utilizar DEEZER como Api principal----------------
// axios.get(
    //          `http://api.musixmatch.com/ws/1.1/track.search?q_artist=${pickedArtist}&page_size=10&page=1&s_track_rating=desc&apikey=9a02741f06fec2008254115a0846b094`
    //     )
        
    //     .then(function (response) {
    //         console.log(response);
    //         let data = response.data.message.body.track_list;
    //         data.forEach(element => {
    //             console.log("El siguiente chivato es el nombre de la cancion, y funciona:")
    //             console.log(element.track.track_name)
    //             console.log(element);
    //             document.querySelector(".songResult").innerHTML += `
                
    //              `;
    //              //Ahora, vamos a coger el track_id de esta peticion, para realizar otra peticion con el y conseguir la letra de la cancion:
    //              axios.get(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=9a02741f06fec2008254115a0846b094&track_id=${element.track.track_id}`)
    //              .then(function(response2){
    //                  console.log("Esto da la response2:");
    //                  console.log(response2);
    //                  let lyricsData = response2.data.message.body.lyrics
    //                  console.log(lyricsData)
    //                  document.querySelector(".songResult").innerHTML += `<div class="songInfo${element.track.track_name}">
    //                                                                         <h3 class="title">${element.track.track_name}</h3>
    //                                                                         <h4 class="album"><i>${element.track.album_name}</i></h4>
    //                                                                         <p class="lyrics">${lyricsData.lyrics_body}</p>
    //                                                                             <div class="previewBottomDiv">

    //                                                                             </div>
    //                                                                         </div>`

    //              })
    //              axios.get(`https://api.deezer.com/search/track?q=${pickedArtist}`)
    //              .then(function(response3){
    //                  console.log("Esto da la response3:")
    //                  console.log(response3)
    //                  let deezerArtistData = response3.data.data;
    //                  deezerArtistData.forEach(deezerElement => {
    //                      console.log(document.querySelector(`.songInfo${deezerElement.title}`));
    //                      console.log(document.querySelector(`.songInfo${element.track.track_name}`));
    //                      if (deezerElement.title==element.track.track_name){
    //                          //aqui, comparar titulo de deezer con el titulo de musicXMatch, si coincide, sacar su preview (su extracto de mp3 para el boton)
    //                          document.querySelector(`.songInfo${element.track.track_name}`).innerHTML += `<img src="${deezerElement.album.cover_medium}" alt="imagenDemo">
    //                                                                             <p>Song preview:</p>
    //                                                                             <audio controls>
    //                                                                                 <source src="${deezerElement.preview}" type="audio/mpeg">
    //                                                                                 Your browser does not support the audio element.
    //                                                                             </audio>`                                                                                    
    //                      }
    //                      //Si en la busqueda realizada, el titulo de la cancion de la Api de Deezer no coincide con el titulo de la canciond e la Api de MusicXMatch, se introduce un pequenio parrafo que lo explique.
    //                     //  else{
    //                     //      document.querySelector(".songInfo").innerHTML += '<p>Preview no disponible</p>';
    //                     //  }
    //                  });
    //              })
    //         });

    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     })
// }
// )}