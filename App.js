const allMoviesDisplay = document.getElementById("moviedisplay");
const preloadedHtml = document.getElementById("preloaded");
const sortByDateBtn = document.getElementById("sortbydate");
const sortByRatingBtn = document.getElementById("sortbyrating");
const prevBtn = document.getElementById("prevBtn");
const currBtn = document.getElementById("currBtn");
const nextBtn = document.getElementById("nextBtn");
let allMovieData = [];
let page = 1;
prevBtn.disabled = true;
prevBtn.classList.add("disabled");
currBtn.innerHTML = `current Page: ${page}`;

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
    // console.log(allMoviesData);
    preloadedHtml.style.display = "none";
    allMoviesData.map(({poster_path, title, vote_average, vote_count, overview, release_date})=>{
    const cardTemplate = 
    `
    <div class="movie-card">
            <img class="movie-image" src="https://image.tmdb.org/t/p/original/${poster_path}" alt="${title}">
            <i class="fa fa-heart-o" style="font-size:24px;color:var(--secondary-color)"></i>
            <div class="movie-info-overlay">
                <h3 class="movie-title">${title} <span class="releaseyear">(${release_date.split("-")[0]})</span></h3>
                <div class="movie-vote-average">Rating: ${vote_average}</div>
                <div class="movie-vote-count">Votes: ${vote_count}</div>
                <div class="movie-overview">
                    <h4>Overview</h4>
                    <div class="overview">${overview}</div>
                </div>
            </div>
        </div>
    `;
        // console.log(poster_path, title, vote_average, vote_count);
        allMoviesDisplay.innerHTML += cardTemplate;
    });
}

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

// Task 4: Add and Remove Movies from Favorite

// Task 5: Implement the Favorites tab

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