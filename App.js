const allMoviesDisplay = document.getElementById("moviedisplay");
const preloadedHtml = document.getElementById("preloaded");
const sortByDateBtn = document.getElementById("sortbydate");
const sortByRatingBtn = document.getElementById("sortbyrating");
const prevBtn = document.getElementById("prevBtn");
const currBtn = document.getElementById("currBtn");
const nextBtn = document.getElementById("nextBtn");
const searchInput = document.getElementsByTagName("input");
const searchBtn = document.getElementById("searchBtn");
const favoriteMovieTab = document.getElementById("fav-movies");
const allMovieTab = document.getElementById("all-movies");
let allMovieData = [];
let page = 1;
prevBtn.disabled = true;
prevBtn.classList.add("disabled");
currBtn.innerHTML = `current Page: ${page}`;

// console.log(hearts);


// Task 1 : Display a list of Movies through an external API
async function fetchMovies(page) {
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${page}`);
    const data = await res.json();
    // console.log(data);
    allMovieData = data.results;
    displayMovies(data.results);
}
fetchMovies(page);

function displayMovies(allMoviesData) {
    console.log(allMoviesData);
    preloadedHtml.style.display = "none";
    allMoviesData.map(({id, poster_path, title, vote_average, vote_count, overview, release_date})=>{
        let poster_image = `https://image.tmdb.org/t/p/original/${poster_path}`;
        if(poster_path == null) {
            poster_image = 'https://media.istockphoto.com/id/1271522601/photo/pop-corn-and-on-red-armchair-cinema.jpg?s=612x612&w=0&k=20&c=XwQxmfrHb-OwV5onPUW5ApB4RaGBK7poSIzZj4q_N_g=';
        }
        const cardTemplate = 
        `<div class="movie-card">
            <img class="movie-image" src="${poster_image}" alt="${title}">
            <i class="fa fa-heart-o" id="${id}" style="font-size:24px;color:var(--secondary-color)"></i>
            <div class="movie-info-overlay" >
                <h3 class="movie-title">${title}</h3>
                <div class="movie-vote-average">Rating: <span class="rating">${vote_average}</span></div>
                <div class="movie-vote-count">Votes: <span class="vote">${vote_count}</span></div>
                <div class="movie-overview">
                    <h4>Overview</h4>
                    <div class="overview">${overview}</div>
                </div>
            </div>
        </div>`;
        // console.log(poster_path, title, vote_average, vote_count);
        allMoviesDisplay.innerHTML += cardTemplate;
    });
}
// <span class="releaseyear">(${release_date.split("-")[0]})</span>



// Task 2 : Sorting movies by their rating and by their release date
sortByDateBtn.addEventListener('click', handleSortByDateBtn);
function handleSortByDateBtn() {
    // console.log(allMovieData);
    if(sortByDateBtn.innerHTML == "Sort by date (oldest to latest)") {
        // console.log("IN oldest to latest");
        sortByDateBtn.innerHTML = "Sort by date (latest to oldest)";
        allMovieData.sort((d1, d2)=>(d1.release_date > d2.release_date) ? 1 : (d1.release_date < d2.release_date) ? -1 : 0
        );
        // console.log(sortByDateBtn.innerHTML);
    }
    else if(sortByDateBtn.innerHTML == "Sort by date (latest to oldest)"){
        // console.log("IN latest to oldest");
        sortByDateBtn.innerHTML = "Sort by date (oldest to latest)";
        allMovieData.sort((d1, d2)=>(d1.release_date < d2.release_date) ? 1 : (d1.release_date > d2.release_date) ? -1 : 0
        );
        // console.log(sortByDateBtn.innerHTML);
    }
    allMoviesDisplay.innerHTML = "";
    // console.log(allMovieData);
    displayMovies(allMovieData);
}

sortByRatingBtn.addEventListener('click', handleSortByRatingBtn);
function handleSortByRatingBtn() {
    if(sortByRatingBtn.innerHTML == "Sort by rating (least to most)") {
        sortByRatingBtn.innerHTML = "Sort by rating (most to least)";
        allMovieData.sort((r1, r2)=>(r1.vote_average > r2.vote_average) ? 1 : (r1.vote_average < r2.vote_average) ? -1 : 0
        );
    }
    else {
        sortByRatingBtn.innerHTML = "Sort by rating (least to most)";
        allMovieData.sort((r1, r2)=>(r1.vote_average < r2.vote_average) ? 1 : (r1.vote_average > r2.vote_average) ? -1 : 0
        );
    }
    allMoviesDisplay.innerHTML = "";
    // console.log(allMovieData);
    displayMovies(allMovieData);
}

// Task 3: Adding Search Functionality
searchBtn.addEventListener('click', handleSearchBtnClick);
async function handleSearchBtnClick() {
    // let searchMovie = searchInput[0].value.toLowerCase();
    let searchMovie = searchInput[0].value;
    if(searchMovie.length == 0) {
        // console.log('In');
        alert('Please enter a movie name to search!')
    }
    else {
        allMoviesDisplay.innerHTML = "";
        nextBtn.disabled = true;
        nextBtn.classList.add("disabled");
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchMovie}&api_key=f531333d637d0c44abc85b3e74db2186&language=en-US`);
        const data = await res.json();
        allMovieData = data.results;
        if(data.results.length == 0) {
            allMoviesDisplay.innerHTML = `<img class="temp" src="./images/no-data-found.png" alt="no data found" />`;
        }
        displayMovies(data.results);
        searchInput[0].value = "";
        // console.log(data.results);
    }
}

// Task 4: Add and Remove Movies from Favorite
function getFavoriteMoviesFromLS() {
    let favoriteMovies;

    if(localStorage.getItem('favorite') === null) {
        favoriteMovies = [];
    }
    else {
        favoriteMovies = JSON.parse(localStorage.getItem('favorite'));
    }

    return favoriteMovies;
}
allMoviesDisplay.addEventListener('click', (e)=>{
    if(e.target.classList.contains('fa') & e.target.classList.contains('fa-heart-o')) {
        e.target.classList.remove('fa-heart-o');
        e.target.classList.add('fa-heart');
        e.target.dataset.mark = 'added-to-fav';
        addToLocalStorage(e.target.parentElement);
    }
    else if(e.target.classList.contains('fa') & e.target.classList.contains('fa-heart')) {
        e.target.classList.remove('fa-heart');
        e.target.classList.add('fa-heart-o');
        delete e.target.dataset.mark;
        removeFromLS(e.target.id);
    }
})
function addToLocalStorage(movieCard) {
    let favMovie = {
        id: movieCard.querySelector('i').id,
        title: movieCard.querySelector('.movie-title').textContent,
        poster_path: movieCard.querySelector('img').src.slice(36),
        vote_count: movieCard.querySelector('.vote').textContent,
        vote_average: movieCard.querySelector('.rating').textContent,
        overview: movieCard.querySelector('.overview').textContent
        // release_date: movieCard.querySelector('releaseyear').textContent
    };
    let favoriteMovie = getFavoriteMoviesFromLS();
    favoriteMovie.push(favMovie);
    localStorage.setItem('favorite', JSON.stringify(favoriteMovie));
}

function removeFromLS(id) {
    let favoriteMovie = getFavoriteMoviesFromLS();
    favoriteMovie.forEach((element, index) => {
        if(element.id === id) {
            favoriteMovie.splice(index, 1);
        }
    });
    localStorage.setItem('favorite', JSON.stringify(favoriteMovie));
}
// Task 5: Implement the Favorites tab
favoriteMovieTab.addEventListener('click', handleFavoriteMovieTabBtn);
function handleFavoriteMovieTabBtn() {
    let favoriteMoviesInLS = getFavoriteMoviesFromLS();
    allMoviesDisplay.innerHTML = "";
    favoriteMovieTab.classList.add('active');
    allMovieTab.classList.remove('active');
    if(favoriteMoviesInLS.length === 0) {
        allMoviesDisplay.innerHTML = `<img class="temp" src="./images/no-data-found.png" alt="no data found" />`;
        currBtn.innerHTML = `current Page: 1`;
    }
    else {
        // console.log(favoriteMoviesInLS);
        displayMovies(favoriteMoviesInLS);
    }

}
allMovieTab.addEventListener('click', handleAllMovieTabBtn);
function handleAllMovieTabBtn() {
    allMoviesDisplay.innerHTML = "";
    favoriteMovieTab.classList.remove('active');
    allMovieTab.classList.add('active');
    nextBtn.disabled = false;
    nextBtn.classList.remove('disabled');
    fetchMovies(page);
    currBtn.innerHTML = `current Page: ${page}`;
}

// Task 6: Pagination
prevBtn.addEventListener('click', handlePrevBtnClick);
function handlePrevBtnClick() {
    page = page - 1;
    if(page > 1) {
        nextBtn.disabled = false;
        nextBtn.classList.remove("disabled");
    } 
    else {
        prevBtn.disabled = true;
        prevBtn.classList.add("disabled");
    }
    currBtn.innerHTML = `current Page: ${page}`;
    preloadedHtml.style.display = "flex";
    allMoviesDisplay.innerHTML = "";
    fetchMovies(page);
    // console.log(page);
}

nextBtn.addEventListener('click', handleNextBtnClick);
function handleNextBtnClick() {
    page = page + 1;
    if(page < 3) {
        prevBtn.disabled = false;
        prevBtn.classList.remove("disabled");
    }
    else {
        nextBtn.disabled = true;
        nextBtn.classList.add("disabled");
    }
    currBtn.innerHTML = `current Page: ${page}`;
    preloadedHtml.style.display = "flex";
    allMoviesDisplay.innerHTML = "";
    fetchMovies(page);
    // console.log(page);
}