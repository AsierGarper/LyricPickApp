(function showFavouritesList() {
    document.querySelector(".favSongInfo").innerHTML = "";
    let stringFavList = localStorage.getItem("favList");
    let favList = JSON.parse(stringFavList);
    favList.forEach(element => {
        let favButtonColor = ""
        if (!localStorage.getItem("favList")) {
            favButtonColor = `grey`
        } else {
            //En cambio, si el objeto YA ESTA GUARDADO en favoritos, debemos primero eliminalo de la lista de favoritos.
            let localStorageFavSongObject = localStorage.getItem("favList");
            localStorageFavSongObject = JSON.parse(localStorageFavSongObject)
            //Establecemos la posicion del array en -1, para despues, con el foreach, ir recorriendo el objeto por sus posiciones (0, 1, 2, etc).
            let position = -1;
            localStorageFavSongObject.forEach((favSong, index) => {

                //Si existe la cancion
                if (element.song == favSong.song && element.image == favSong.image) {
                    position = index; //la posicion de ese objeto pasa a ser el index con el que entra
                }
            });
            if (position == -1) {

                favButtonColor = `grey`
            } else {
                favButtonColor = `red`
            }
        }



        document.querySelector(".favSongInfo").innerHTML += `<hr>
                                    <div>
                                    <img class="songPicture" src="${element.image}" alt="imagenDemo">
                                    <h4 class="album"><i>${element.album}</i></h4>
                                    <h3 class="title">${element.song}</h3>
                                    <div class="favIcon">
                                    <i class="fas fa-heart heartIcon" style="color: ${favButtonColor};"'></i>
                                    </div>
                                    <div class="previewBottomDiv">
                                    <p>Song preview:</p>
                                    <audio controls>
                                    <source src="${element.soundPreview}" type="audio/mpeg">
                                    Your browser does not support the audio element.
                                    </audio>
                                    </div>
                                    <p class="lyrics">${element.lyrics}</p>
                                    </div>`;

    })
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
            showFavouritesList();
        })

    })

})()



//Para conseguir que la funcion showFavouritesList automaticamente segun se carga el favourites.html, debo crear una funcion anonima con la funcion showFavouritesList dentro.
//Cuando javascript encuentra un parentesis como este (), siempre intenta ejecutarlo. En este caso hemos escrito ('funcion)()