
        /*Para implementar a futuro, voy a crear funciones, que llame a cada cosa. El el formulario, el usuario podra introducir, artista, y buscar todas las canciones del artista (funcion buscarArtista). Luego, si quiere buscar artista, y que contenga X palabra en su canciones, funcion buscaArtistaPalabras, etc. Cada vez que se envie informacion, en base a la que se envie, llamar a una funcion u otra.*/
        
        document.querySelector("#searchImput").addEventListener("click", function (e) {
            e.preventDefault(); //Esto es para evitar que la pagina recarge por defecto
            let pickedArtist = (document.querySelector("#artistField").value).replace(" ", "_"); //Metemos el replace, para sustituir espacios por barras bajas
            console.log(pickedArtist);
            axios.get(
                    `http://api.musixmatch.com/ws/1.1/track.search?apikey=9a02741f06fec2008254115a0846b094&s_artist_rating&page_size=10&q_artist=${pickedArtist}`
                )
                .then(function (response) {
                    console.log(response);
                    let data = response.data.message.body.track_list;
                    data.forEach(element => {
                        console.log(element);
                        console.log("El siguiente chivato es el nombre de la cancion, y funciona:")
                        console.log(element.track.track_name)
                        document.querySelector(".songResult").innerHTML += `<div class="songInfo">
                        <h3 class="title">${element.track.track_name}</h3>
                        <h4 class="album"><i>${element.track.album_name}</i></h4>
                        <p class="lyrics">Texto de prueba: blablablablablablablablabl
                        ablablablablablablabla
                        blablablablablablablablablablablablablabla</p>
                        <div class="previewBottomDiv"></div>
                <p>Song preview:</p>

                <audio controls>
                    <!-- <source src="horse.ogg" type="audio/ogg"> -->
                    <!-- <source src="horse.mp3" type="audio/mpeg"> -->
                    Your browser does not support the audio element.
                </audio>
            </div>
                    </div>
    `;
                    });

                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    )
