/*Para implementar a futuro, voy a crear funciones, que llame a cada cosa. El el formulario, el usuario podra introducir, artista, y buscar todas las canciones del artista (funcion buscarArtista). Luego, si quiere buscar artista, y que contenga X palabra en su canciones, funcion buscaArtistaPalabras, etc. Cada vez que se envie informacion, en base a la que se envie, llamar a una funcion u otra.*/

document.querySelector("#searchImput").addEventListener("click", function (e) {
    e.preventDefault(); //Esto es para evitar que la pagina recarge por defecto
    let pickedArtist = (document.querySelector("#artistField").value).replace(" ", "_"); //Metemos el replace, para sustituir espacios por barras bajas
    // console.log(pickedArtist);
    document.querySelector(".artistSection").innerHTML = "";
    document.querySelector(".songInfo").innerHTML = "";

    axios.get(`https://api.deezer.com/search/artist?q=${pickedArtist}`)
        .then(function (response1) {
            // console.log(response1)
            let artistData = response1.data.data
            let artist = {
                artistName: artistData[0].name,
                artistPicture: artistData[0].picture_big,
                artistNbAlbum: artistData[0].nb_album,
                artistNbFan: artistData[0].nb_fan,
                songList: []
            }
            //De momento, he decido mostrar unicamente el primer resultado (posicion [0] en el array de artistData), a futuro dejare selecionar entre los distintos artistas encontrados con el nombre de artista introducido.)

            //  
            document.querySelector(".artistSection").innerHTML += `<h1 class="artistTitle"><u><strong>${artist.artistName}</u></strong></h1>
                <img class="artistPicture" src="${artist.artistPicture}" alt="">
                <p>Artist's albums: ${artist.artistNbAlbum}</p>
                <p>Artist's fans: ${artist.artistNbFan}</p>`
            //Una vez conseguimos el artista principal que busca el usuario (artistData[0].name), realizamos una nueva llamada a la api, pidiendo su top canciones:
            axios.get(`https://api.deezer.com/search/track?q=${artistData[0].name}`)
                .then(function (response2) {
                    // console.log(response2);
                    let trackData = response2.data.data
                    trackData.forEach(trackElement => {
                        if (trackElement.artist.id == artistData[0].id) {
                            //Si el id del artista de response1 coincide con el id del artista del track recibido de response2, muestro las canciones. Esto es para evitar poner canciones de otros artistas que contengan el nombre introducido. 
                            let song = {
                                songPicture: trackElement.album.cover_medium,
                                songTitle: trackElement.title_short,
                                songAlbum: trackElement.album.title,
                                songPreview: trackElement.preview
                            }

                            // console.log("Cumpliendose el if, el foreach del array de trackData da lo siguiente:")
                            // console.log(trackElement)

                            //-------------------Ahora voy a llamar a MusicXMatch------------------------------------------------------------------------
                            axios.get(`http://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist.artistName}}&page_size=10&page=1&s_track_rating=desc&apikey=9a02741f06fec2008254115a0846b094`)
                                .then(function (response3) {
                                    // console.log("Esto da el response3")
                                    // console.log(response3)
                                    let songsMXM = response3.data.message.body.track_list
                                    songsMXM.forEach(songsMXMElement => {
                                        if (songsMXMElement.track.track_name == song.songTitle) {
                                            // console.log("Esta cancion coincide de Deezer con MusicXMatch")
                                            // console.log(songsMXMElement.track.track_name)
                                            axios.get(`http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=9a02741f06fec2008254115a0846b094&track_id=${songsMXMElement.track.track_id}`)
                                                .then(function (response4) {
                                                    // console.log("Esto da response4:")
                                                    // console.log(response4)
                                                    song.songLyrics = response4.data.message.body.lyrics.lyrics_body.replaceAll(/\n/ig, "<br>")
                                                    song.songLyrics = song.songLyrics.replace("******* This Lyrics is NOT for Commercial use *******<br>(1409621817784)", "") //Y aqui, metemos en nuestra lista de songs, los lyrics de cada una. Hay que hacer un pequenio replace, ya que la api trae \n para los saltos de linea, y necesitamos <br> cuando lo escriba en HTML.
                                                    //Debido a la cantidad de peticiones a API mediante Axios, y por diferentes tiempos de carga, la unica forma de cargar la letra de las canciones es mediante un funcion, llamandola cuando todas las peticiones API se hayan realizado y el cuerpo de la cancion (Titulo, album, letra, y sonidos) esten guardados en songList.
                                                    paintInHTMLyricsSong(song);

                                                    //Ahora que tenemos nuestros div SongList creado, con todas las canciones de la busqueda cargadas, vamos a darle funcionalidad al boton de favoritos. 
                                                    document.querySelectorAll(".heartIcon").forEach(function (favButton) {
                                                        favButton.addEventListener("click", function () {
                                                            let songInfoClassPosition = this.parentNode.parentNode;
                                                            console.log("Aqui esta el node")
                                                            console.log(this.parentNode.parentNode)
                                                            let imagenCancion = songInfoClassPosition.querySelector("img").src;
                                                            let tituloCancion = songInfoClassPosition.querySelector("h3").innerHTML;
                                                            let tituloAlbumCancion = songInfoClassPosition.querySelector("h4").innerHTML;
                                                            let letraCancion = songInfoClassPosition.querySelector("p").innerHTML;
                                                            let sonidoCancion = songInfoClassPosition.querySelector("source").src;
                                                            console.log(songInfoClassPosition.querySelector("source").src);
                                                            console.log(songInfoClassPosition.querySelector("p").innerHTML);
                                                            //Aqui recogemos los datos en el objeto favSongObject
                                                            let favSongObject = {
                                                                image: imagenCancion,
                                                                song: tituloCancion,
                                                                album: tituloAlbumCancion,
                                                                lyrics: letraCancion,
                                                                soundPreview: sonidoCancion
                                                            }
                                                            if (!localStorage.getItem("favList")) {
                                                                //Si el objeto elegido (la cancion elegida) no esta guardada en favoritos, se aniade a la lista de favoritos.
                                                                favSongObject = JSON.stringify([favSongObject]);
                                                                localStorage.setItem("favList", favSongObject)
                                                            } else {
                                                                //En cambio, si el objeto YA ESTA GUARDADO en favoritos, debemos primero eliminalo de la lista de favoritos.
                                                                let localStorageFavSongObject = localStorage.getItem("favList");
                                                                localStorageFavSongObject = JSON.parse(localStorageFavSongObject)
                                                                //Establecemos la posicion del array en -1, para despues, con el foreach, ir recorriendo el objeto por sus posiciones (0, 1, 2, etc).
                                                                let position = -1;
                                                                localStorageFavSongObject.forEach((element, index) => {
                                                                    //Si existe la cancion
                                                                    if (element.song == favSongObject.song && element.image == favSongObject.image) {
                                                                        position = index; //la posicion de ese objeto pasa a ser el index con el que entra
                                                                    }
                                                                });
                                                                if (position == -1) {
                                                                    //No ha encontrado la cancion, asi que la aniade
                                                                    localStorageFavSongObject.push(favSongObject)
                                                                    localStorageFavSongObject = JSON.stringify(localStorageFavSongObject);
                                                                    localStorage.setItem("favList", localStorageFavSongObject)
                                                                } else {
                                                                    //He encontrado la cancion, la elimino
                                                                    //Utilizamos la funcion 'splice', que funciona de la siguiente forma (array.splice(index, howmany, item1, ....., itemX)), para 
                                                                    localStorageFavSongObject.splice(position, 1)
                                                                    localStorageFavSongObject = JSON.stringify(localStorageFavSongObject);
                                                                    localStorage.setItem("favList", localStorageFavSongObject)
                                                                }
                                                            }
                                                            if (this.style.color == "grey") {
                                                                this.style.color = "red"
                                                                //Aqui, meter todo lo referente a guardar datos a favoritos
                                                            } else if (this.style.color == "red") {
                                                                this.style.color = "grey"
                                                                //Aqui, meter todo lo referente a guardar datos a favoritos

                                                            }
                                                        })
                                                    })

                                                })
                                        } else {
                                            // console.log("No coincide cancion")
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


                .catch(function (error) {
                    console.log(error);
                });
        })
})


function paintInHTMLyricsSong(song) {
    let favButtonColor = ""
    if (!localStorage.getItem("favList")) {
        favButtonColor = `grey`
    } else {
        //En cambio, si el objeto YA ESTA GUARDADO en favoritos, debemos primero eliminalo de la lista de favoritos.
        let localStorageFavSongObject = localStorage.getItem("favList");
        localStorageFavSongObject = JSON.parse(localStorageFavSongObject)
        //Establecemos la posicion del array en -1, para despues, con el foreach, ir recorriendo el objeto por sus posiciones (0, 1, 2, etc).
        let position = -1;
        localStorageFavSongObject.forEach((element, index) => {

            //Si existe la cancion
            if (element.song == song.songTitle && element.image == song.songPicture) {

                position = index; //la posicion de ese objeto pasa a ser el index con el que entra
            }
        });
        if (position == -1) {

            favButtonColor = `grey`
        } else {
            favButtonColor = `red`
        }
    }

    document.querySelector(".songInfo").innerHTML += `<hr>
                                    <div>
                                    <img class="songPicture" src="${song["songPicture"]}" alt="imagenDemo">
                                    <h3 class="title">${song["songTitle"]}</h3>
                                    <h4 class="album"><i>${song["songAlbum"]}</i></h4>
                                    <p class="lyrics">${song.songLyrics}</p>
                                    <div class="favIcon">
                                    <i class="fas fa-heart heartIcon" style="color: ${favButtonColor};"'></i>
                                    </div>
                                    <div class="previewBottomDiv">
                                    <p>Song preview:</p>
                                    <audio controls>
                                        <source src="${song["songPreview"]}" type="audio/mpeg">
                                        Your browser does not support the audio element.
                                    </audio>
                                    </div>
                                    </div>`;

}



//----------------------------Javascript para implementar funcionalidad a elementos HTML--------------------------------------------------------

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}


//-------------------------------Boton Favoritos------------------------------Hay que crear dos funciones, usando como comprobador, el estado del color del corazon. Si esta rojo y se clicka, fucion aniadir a favoritos, que anada a la lista de favoritos todo. Lo mismo cuando este en gris, funcion quitar de favoritos.

function favouritesFunction() {
    // document.querySelector(".heartIcon").addEventListener("click", function(){
    if (document.querySelector(".heartIcon").style.color == "grey") {
        document.querySelector(".heartIcon").style.color = "red"
        //Aqui, meter todo lo referente a guardar datos a favoritos
    } else if (document.querySelector(".heartIcon").style.color == "red") {
        document.querySelector(".heartIcon").style.color = "grey"
        //Aqui, meter todo lo referente a guardar datos a favoritos

    }
    // })
}