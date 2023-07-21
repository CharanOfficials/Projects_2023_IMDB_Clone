var movieDetailsApp = (function(){
    function renderApp(){ 
        // event listeners
        document.addEventListener('click',(e)=>{
            // to clear the session storage to remove the data if page gets directly accessed
            if(e.target.id === "home"){
                sessionStorage.clear()
                window.location.href = "./index.html"
            }
        })
        // If no data passed or saved then display none
        if(sessionStorage.getItem("detailsSetter")===null){
            document.getElementsByClassName("movie_container")[0].style.display = "none"
        }else{  
            // Show data if ID received from home page
            id = sessionStorage.getItem('detailsSetter')
            const apiUrl = "https://www.omdbapi.com/?i="+id+"&apikey=8e12db0b"
            fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                addMoviesDetails(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

        // show details against the id received
        function addMoviesDetails(data){
            console.log(data)
            document.getElementsByClassName("data_title")[0].innerHTML = data.Title
            document.getElementsByClassName("released_date")[0].innerHTML = "Released Date: "+data.Released
            document.getElementsByClassName("runtime")[0].innerHTML = "Country: "+data.Country
            document.getElementsByClassName("genre")[0].innerHTML = "Genre: "+data.Genre
            document.getElementsByClassName("plot_data")[0].innerHTML = data.Plot
            document.getElementsByClassName("poster_data")[0].src = data.Poster
        }
    }
    return{
        launchIndexApplication : renderApp
    }
})()