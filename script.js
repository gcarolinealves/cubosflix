const body = document.querySelector("body");
const moviesContainer = document.querySelector(".movies");
const previousButton = document.querySelector(".btn-prev");
const nextButton = document.querySelector(".btn-next");
const searchButton = document.querySelector(".input");
const themeButton = document.querySelector(".btn-theme");

const highlightVideo = document.querySelector(".highlight__video");
const hightlightTitle = document.querySelector(".highlight__title");
const highlightRating = document.querySelector(".highlight__rating");
const highlightGenres = document.querySelector(".highlight__genres");
const highlightLaunch = document.querySelector(".highlight__launch");
const highlightDescription = document.querySelector(".highlight__description");
const highlightVideoLink = document.querySelector(".highlight__video-link");

const closeModalButton = document.querySelector(".modal__close");
const modal = document.querySelector(".modal");
const modalTitle = document.querySelector(".modal__title");
const modalImg = document.querySelector(".modal__img");
const modalDescription = document.querySelector(".modal__description");
const modalGenres = document.querySelector(".modal__genres");
const modalAverage = document.querySelector(".modal__average");
const highlightInfo = document.querySelector(".highlight__info");


let currentPage = 0;
let currentMovies = [];
let initialTheme = localStorage.getItem("theme"); /*Segundo: pegar o valor na primeira execução*/
let currentTheme = "light";

function displayDarkTheme () {
    currentTheme = "dark";

    themeButton.src = "./assets/light-mode.svg";
    previousButton.src = "./assets/seta-esquerda-branca.svg";
    nextButton.src = "./assets/seta-direita-branca.svg";

    body.style.setProperty("--background-body-input", "#242424");        
    body.style.setProperty("--input", "#FFF");
    body.style.setProperty("--color-input-subtitle-description", "#FFF");
    body.style.setProperty("--background-highlight", "#454545");
    body.style.setProperty("--color-genre-launch", "rgba(255, 255, 255, 0.7)");
    body.style.setProperty("--box-shadow", "0px 4px 8px rgba(255, 255, 255, 0.2)");
}

function displayLightTheme () {
    currentTheme = "light";

    themeButton.src = "./assets/dark-mode.svg";
    previousButton.src = "./assets/seta-esquerda-preta.svg";
    nextButton.src = "./assets/seta-direita-preta.svg";
    
    body.style.setProperty("--background-body-input", "#FFF");
    body.style.setProperty("--input", "#979797");
    body.style.setProperty("--color-input-subtitle-description", "#000");
    body.style.setProperty("--background-highlight", "#FFF");
    body.style.setProperty("--color-genre-launch", "rgba(0, 0, 0, 0.7)");
    body.style.setProperty("--box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.2)");
}

function loadMovies () {
    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false`).then(promise => {
        promise.json().then(dados => {
            currentMovies = dados.results;
            displayMovies();
        })
    })
}

function loadMovie (id) {
    modal.classList.remove("hidden");
    body.style.overflow = "hidden";

    fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${id}?language=pt-BR`).then(promise => {
        promise.json().then(dados => {
            console.log(dados);
            modalTitle.textContent = dados.title;
            modalImg.src = dados.backdrop_path;
            modalDescription.textContent = dados.overview;
            modalAverage.textContent = dados.vote_average;

            modalGenres.textContent = "";

            dados.genres.forEach(genre => {
                const modalGenre = document.createElement("span");
                modalGenre.textContent = genre.name;
                modalGenre.classList.add("modal__genre");

                modalGenres.append(modalGenre);
            })
            
        })
    })
}

function displayMovies (){
    moviesContainer.textContent = "";
    for (let i = currentPage * 5; i < (currentPage + 1) * 5; i++){
        const movie = currentMovies[i];
    
        const movieContainer = document.createElement("div");
        movieContainer.classList.add("movie");
        movieContainer.style.backgroundImage = `url("${movie.poster_path}")`;

        movieContainer.addEventListener("click", () => {
            loadMovie(movie.id);
        })
        
        const movie__info = document.createElement("span");
        movie__info.classList.add("movie__info");

        const movie__title = document.createElement("span");
        movie__title.classList.add("movie__title");
        movie__title.textContent = movie.title;

        const movie__rating = document.createElement("span");
        movie__rating.classList.add("movie__rating");
        
        const star = document.createElement("img");
        star.src = "./assets/estrela.svg";
        star.alt = "Estrela";

        
        movie__rating.append(star, movie.vote_average);
        movie__info.append(movie__title, movie__rating);
        movieContainer.append(movie__info);
        moviesContainer.append(movieContainer);

    }
}

function loadHighlight () {
    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR")
    .then(promise => {
        promise.json().then(dados => {
            highlightVideo.style.background = `linear-gradient(rgba(0, 0, 0, 0.6) 100%, rgba(0, 0, 0, 0.6) 100%), url("${dados.backdrop_path}") center / cover`;
            hightlightTitle.textContent = dados.title;
            highlightRating.textContent = dados.vote_average;
            highlightDescription.textContent = dados.overview;

            highlightLaunch.textContent = (new Date (dados.release_date)).toLocaleDateString("pt-BR", {year: "numeric", month: "long", day:"numeric"});

            for (let i = 0; i < dados.genres.length; i++){
                if (i === dados.genres.length-1){
                    highlightGenres.textContent += dados.genres[i].name;
                } else {
                    highlightGenres.textContent += dados.genres[i].name + ", ";
                }
            }            
        }) 
    })

    fetch("https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR")
    .then(promise => {
        promise.json().then(dados => {
            const highlight = dados.results[1].key;
            highlightVideoLink.href = `https://www.youtube.com/watch?v=${highlight}`;
        })
    })
}

themeButton.addEventListener("click", () => {
    if (currentTheme === "light"){
        displayDarkTheme();
    } else {
        displayLightTheme();
    }

    localStorage.setItem("theme", currentTheme); /*Primeiro: setar o valor a cada mudança*/
})

previousButton.addEventListener("click", event => {
    if (currentPage === 0){
        currentPage = 3;
    } else {
        currentPage--;
    }
    displayMovies();
})

nextButton.addEventListener("click", event => {
    if (currentPage === 3){
        currentPage = 0;
    } else {
        currentPage++;
    }
    displayMovies();
})

searchButton.addEventListener("keydown", event => {
    if (event.key !== "Enter"){
        return;
    }

    currentPage = 0;

    if (!searchButton.value){
        loadMovies();
    } else {
        fetch(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${searchButton.value}`).then(promise => {
            promise.json().then(dados => {
                currentMovies = dados.results;
                displayMovies();
            })
        })
    }

    searchButton.value="";
})

closeModalButton.addEventListener("click", () => {
    modal.classList.add("hidden");
    body.style.overflow = "auto";
})


if (initialTheme === "light"){ /*Terceiro: usar o initialTheme para saber como configurar o tema*/
    displayLightTheme();
} else {
    displayDarkTheme();
}

loadMovies();
loadHighlight();




