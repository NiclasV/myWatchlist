/**************
**** MODEL **** 
**************/

class getMovie {
    constructor(value, page){
        this.baseUrl = "http://www.omdbapi.com/";
        this.key = "apikey=acfee4fa";
        this.value = value;
    }
    imdbId(value) {
        return fetch(this.baseUrl + "?i=" + this.value + "&plot=full" + "&" + this.key)
        .then((response) => response.json())
    }
    text(value, page) {
        return fetch(this.baseUrl + "?s=" + this.value + "&plot=full" + "&page=" + page + "&" + this.key)
        .then((response) => response.json())
    }
}


class movie {
    constructor(title, year, rated, released, runtime, genre, director, writer, actors, plot, language, country, awards, poster,
    ratings, metascore, imdbRating, imdbVotes, imdbID, type, dvd, boxOffice, production, website, trailer){
        this.title = title;
        this.year = year;
        this.rated = rated;
        this.released = released;
        this.runtime = runtime;
        this.genre = genre;
        this.director = director;
        this.writer = writer;
        this.actors = actors;
        this.plot = plot; 
        this.language = language;
        this.country = country; 
        this.awards = awards; 
        this.poster = poster;
        this.ratings = ratings;
        this.metascore = metascore;
        this.imdbRating = imdbRating;
        this.imdbVotes = imdbVotes;
        this.imdbID = imdbID;
        this.type = type;
        this.dvd = dvd;
        this.boxOffice = boxOffice;
        this.production = production;
        this.website = website;
        this.trailer = trailer;
    }
}

class list {
    constructor(id, title, description, created){
        this.id = id;
        this.title = title;
        this.description = description;
        this.created = created;
        this.movies = [];
    }
}


/**************
**** VIEW ***** 
**************/

const displayModule = {

    showSingle: function(data) {
        const divResults = document.getElementById("searchResult");

        if(data.Response === "True") {
            
            var newMovie = new movie(data.Title, data.Year, data.Rated, data.Released, data.Runtime, data.Genre, data.Director, data.Writer, 
                data.Actors, data.Plot, data.Language, data.Country, data.Awards, data.Poster, data.Ratings, data.Metascore, data.imdbRating, data.imdbVotes, data.imdbID, data.Type, data.DVD, data.BoxOffice, data.Production, data.Website )
            
            actionModule.movieToAdd(newMovie);
            
            let content = `
            <div class="jumbotron">
                <div class="poster">
                    <img src="${data.Poster}">
                </div>
                <div class="info">
                    <h3 style="display:inline-block;">${data.Title} (${data.Year}) </h3> ${this.generateBadge(data.Type)}<br>

                    <p><strong>Actors:</strong> ${data.Actors}<br>
                    <strong>Director:</strong> ${data.Director}<br>
                    <strong>Writer(s):</strong> ${data.Writer}<br>
                    </p>
                    <p class="synopsis">${data.Plot}</p>
                    ${this.generateWatchlistDropdown(data.Type)}
                </div>
            </div>`;

            divResults.innerHTML = content;

        } else {
            let content = `<h2>Sorry! ${data.Error}</h2>`;

            divResults.innerHTML = content;
        }
    },

    searchResultMulti: function(data, value, page) {
        const divResults = document.getElementById("searchResult");
        const pagination = document.getElementById("pagination");
        var content = `<div style="width:100%;"><h3>Searchresults for "${value}" (${data.totalResults} results)</h3></div>`;
        for(var movie of data.Search) {
            content += `
            <div class="card border-dark mb-3 movie-item" id="${movie.imdbID}">
                <div class="card-header"><a href="javascript:void(0)" id="${movie.imdbID}" onclick="actionModule.handleSearch(this.id)">
                   <strong> ${movie.Title} </strong> (${movie.Year})  ${this.generateBadge(movie.Type)}</a></div>
                <div class="card-body">
                    <a href="javascript:void(0)" id="${movie.imdbID}" onclick="actionModule.handleSearch(this.id)">
                    <img src="${movie.Poster}" onerror="this.src='https://www.classicposters.com/images/nopicture.gif'" class="img-fluid">
                    </a>
                </div>
            </div>
            `;
        }

        divResults.innerHTML = content;
        pagination.innerHTML = this.generatePagination(data.totalResults, value, page);
    },

    createListForm: function() {
        let divMain = document.getElementById('mainDiv');
        
        let listForm = `
        <h1>Create a new watchlist</h1>
        <div class="card text-white bg-dark mb-3 full-width pad-30">
            <form id="createListForm">
                <label for="listTitle">List name</label>
                <input type="name" class="form-control" id="listTitle" placeholder="Enter the name of your list">
                <label for="listDescription">List description</label>
                <input type="text" class="form-control" id="listDescription" placeholder="A short description of the type of movies">
                <input type="submit" class="btn btn-block btn-success" onclick="actionModule.createList(listTitle.value, listDescription.value); return false;" value="Create list!" id="createListBtn">
            </form>
        </div>
        `;
        divMain.innerHTML = listForm;
    },

    watchListsStartpage: function() {
        let divMyLists = document.getElementById("myLists");
        let watchLists = JSON.parse(localStorage.getItem("watchLists"));

        if(!watchLists) {
            watchLists = [];
        }

        let content = ``;
        

        for(let list of watchLists) {
            let moviesInList = ``; 

            for(let theMovie of list.movies) {
                moviesInList += `<l1>${theMovie.title} (${theMovie.year})</li><br><br>`;
            }
            
            content += `
            <div class="card text-white bg-dark mb-3 watchlist" id=${list.id}>
                <div class="card-header">
                    <h4 class="card-title">${list.title}</h4><span class="badge badge-secondary">${list.created}</span>
                    <h6 class="card-subtitle mb-2 text-muted">${list.description}</h6>
                </div>
                <div class="card-body">
                    ${moviesInList}
                </div>
            </div>
            `
        }
        divMyLists.innerHTML = content;
    },

    aboutPage: function() {
        let main = document.getElementById('mainDiv');

        content = `
        <h1>About</h1>
        <p>Just a small summerproject to sharpen and keeping my javascript-skillz hot.</p>
        <p>Wanted to create an application where you can create your own list of movies and add titles to them based on the open movie database api (omdbapi.com)<br>
        At this point the most basic functionality is in place, you can create lists, and add titles to them.. But the site aint to exciting so i will
        try to g
        </p>
        
        <h2>Still alot to be done</h2>
        <div class="progress">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="width: 20%"></div>
        </div><br><br>

        <h2>Todo</h2>
        <li>Overall design improvement (only bootstrapped for now)</li>
        <li>Fix pagination on searched titles</li>
        <li>Enable clicking in on created lists for more details</li>
        <li>More detailed listing of titles in the created lists</li>
        <li>Enable editing of lists (name, description)</li>
        <li>Enable deletion of lists and of titles in the lists</li>
        <li>etc etc etc.</li>
        `;

        main.innerHTML = content;
    },

    feedbackText: function(text, textColor) {
        return `<small id="emailHelp" class="form-text ${textColor}"> ${text}</small>`;
    },

    generateWatchlistDropdown: function(type) {

        let watchLists = JSON.parse(localStorage.getItem("watchLists"));
        let watchListOptions = "";

        for(let i = 0; i < watchLists.length; i++) {
            watchListOptions += `
            <option value="${watchLists[i].id}" id="${watchLists[i].id}">${watchLists[i].title}</option>
            `
        }
        
        return `
        <h5 class="text-warning">Add this ${type} to a watchList:</h5>
        <form id="addMovieForm" onsubmit="actionModule.addMovieToList(selectWatchlist.value); return false;">
            <div class="form-group form-inline" id="addMovieDropdown">
                <select class="custom-select" id="selectWatchlist">
                    ${watchListOptions}
                </select>
                <input type="submit" class="btn btn-success" value="Add to watchlist">
            </div>
        </form>
        `;
    },

    generateBadge: function(type) {
        if(type === "movie"){
            return `<span class="badge badge-success">${type}</span>`;
        } else if(type === "series") {
            return `<span class="badge badge-warning">${type}</span>`;
        } else if(type === "game") {
            return `<span class="badge badge-danger">${type}</span>`;
        }
    },

    generatePagination: function(results, value, page) {
        let totPages = Math.ceil(results / 10);
        let nextPage = page + 1;
        let prevPage = page - 1;
        let nextPageBtn = `<button class="btn btn-outline-success btn-pagination" data-page="${nextPage}" 
        data-value="${value}" onclick="actionModule.handleSearch(this.dataset.value, this.dataset.page)">Next Page</button>`;
        let prevPageBtn = `<button class="btn btn-outline-success btn-pagination" onclick="actionModule.handleSearch(value, prevPage)>Previous Page</button>`;
        
        if (page === 1) {
            return nextPageBtn;
        } else if (page === totPages) {
            return prevPageBtn; 
        } else {
            return prevPageBtn + nextPageBtn;
        }
        
    },

    
}


/**************
* CONTROLLER *
**************/

const actionModule = {
    
    handleSearch: function(value, page){
        const spinner = document.getElementsByClassName('spinner')[0];
        spinner.classList.remove('hidden') 
        if(value.startsWith("tt")) {
            this.searchId(value);
        } else {
            this.searchText(value, page);
        }
    },

    searchId: function(value){
        const spinner = document.getElementsByClassName('spinner')[0];
        var theMovie = new getMovie(value);

        theMovie.imdbId()
        .then((data) => {
            spinner.classList.add('hidden')
            displayModule.showSingle(data);
        })
        .catch((error) => {
            console.log(error);
        })
    },

    getDate: function() {
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();

        newdate = day + "/" + month + "/" + year;

        return newdate;
    },

    searchText: function(value, page) {
        const spinner = document.getElementsByClassName('spinner')[0];
        var theMovie = new getMovie(value);

        theMovie.text()
        .then((data) => {
            spinner.classList.add('hidden')
            displayModule.searchResultMulti(data, value, page);
        })
        .catch((error) => {
            console.log(error);
        })
    },

    checkRating: function(rating) {
        if(rating === "undefined") {
            return console.log("N/A");
        } else {
            return console.log("whadup")
        }
    },

    generateId: function() {
        return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(1, 1000);
    },

    createList: function(title, description) {
        
        let id = this.generateId();
        let created = this.getDate();
        var newList = new list(id, title, description, created);

        this.saveToLocalStorage(newList);
        
        if(document.getElementById('createListForm')) {
            let listForm = document.getElementById('createListForm');
            createListForm.insertAdjacentHTML("beforeend", 
            displayModule.feedbackText("Your watchlist \"" + title + "\" has been created!", "text-success"))
        } 
        
    },

    saveToLocalStorage: function(newList) {
        var watchLists = JSON.parse(localStorage.getItem("watchLists"));
        
        if(!watchLists) {
            watchLists = [];
        }

        watchLists.push(newList)
        localStorage.setItem("watchLists", JSON.stringify(watchLists))
    },

    movieToAdd: function(newMovie) {
        sessionStorage.setItem("movie", JSON.stringify(newMovie))
    },

    addMovieToList: function(id) {
        let movie = JSON.parse(sessionStorage.getItem('movie'));
        let watchLists = JSON.parse(localStorage.getItem('watchLists'))
        var index = watchLists.findIndex(function(element){return element.id === id}) 
        let listMovies = watchLists[index].movies
        
        listMovies.push(movie)

        localStorage.setItem("watchLists", JSON.stringify(watchLists))

        let dropdown = document.getElementById('addMovieDropdown');

        dropdown.insertAdjacentHTML("afterend", displayModule.feedbackText("Movie added to the watchlist \"" + watchLists[index].title + 
        "\"" , "text-success"))
    },  

    _init: function() {
        var watchLists = JSON.parse(localStorage.getItem("watchLists"));
        
        if(!watchLists) {
            this.createList("Movies to watch", "Collection of movies to watch");
        }
        displayModule.watchListsStartpage();    
    }
}

actionModule._init()