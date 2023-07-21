var searchApp = (function(){
    function renderApp(){
        // to track the change made in search (letter added/ removed)
        let prevLength = 0
        // to maintain the search results temporary
        let tempSearchData = []
        // clear session storage
        sessionStorage.clear()

        const data_title = document.getElementById("title") 
        const data_year = document.getElementById("year") 
        const data_runtime = document.getElementById("runtime")
        const data_poster = document.getElementById("poster")
        const searchText = document.getElementById("text_to_search")
        const s_list = document.getElementById("s_results")

        // listeners 
        document.addEventListener('click',(e)=>{
            const clickedEvent = e.target
            // to clear the entire search result
            if(clickedEvent.id === "clear"){
                searchText.value = ""
            }
            // to add the data in favourite list
            else if(clickedEvent.classList.length > 1){
                clickedEvent.classList.forEach(className => {
                    if(className === "favourite"){
                        getDataAgainstFavId(clickedEvent.dataset.id)
                    }
                });
            }
            // to check more data against the searched result
            else if(clickedEvent.className === "more_details"){
                const key = clickedEvent.dataset.id
                sessionStorage.setItem('detailsSetter',key);
                window.location.href = "moviePage.html"
            }
        })

        //  getting data against the clicked item to store it in the fav. list
        function getDataAgainstFavId(id){
            const apiUrl = "https://www.omdbapi.com/?i="+id+"&apikey=8e12db0b"
            fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                addToFavouriteList(data, id)
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }

        // Adding the fetched data against teh fav. id in the storage
        function addToFavouriteList(data, id){
            data = {Id: data.imdbID, "isFavourite": 'true', title: data.Title, genre: data.Genre, releasedDate: data.Released, runtime: data.Runtime, director:data.Director}
            let loc_len = localStorage.length
            if(localStorage.getItem(0) !== 'true'){
                localStorage.clear()
                localStorage.setItem(0, 'true')
                localStorage.setItem(1, JSON.stringify(data))
                alert("Added to favourite list")
                return
            }

            let i = 1;
            for(i; i < loc_len; i++){
                const tempData = localStorage.getItem(i)
                const tempDataParsed = JSON.parse(tempData)
                if(tempDataParsed.Id === id && tempDataParsed.isFavourite === "true"){
                    data.isFavourite = 'false'
                    localStorage.setItem(i, JSON.stringify(data))
                    alert("Removed from favourite list")
                    return
                }else if(tempDataParsed.Id === id && tempDataParsed.isFavourite === "false"){
                    data.isFavourite = 'true'
                    localStorage.setItem(i, JSON.stringify(data))
                    alert("Added to favourite list")
                    return
                }
            }
            localStorage.setItem(loc_len, JSON.stringify(data))
            alert("Added to favourite list")
            return
        }

        // Maintaining the search result without saving them
        setInterval(function (){
            if(searchText.value === ""){
                prevLength = 0
                tempSearchData = []
                s_list.innerHTML = ""
            }
            if(searchText.value !== ""){
                // if used adds a new letter
                const search = searchText.value
                let newLength = search.length
                if(newLength > prevLength){
                    const apiUrl = "http://www.omdbapi.com/?t="+search+"&apikey=8e12db0b"
                    fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        addDataToSearchList(data)
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            }
            // if user removes any letter from the last
            if(newLength < prevLength){
                tempSearchData.pop()
                s_list.innerHTML = ""
                refreshSearchList()
            }
            prevLength = newLength
            }
        },50)

        // rendering the updated search list
        function renderSearch(i){
            const li = document.createElement('li')
                li.innerHTML = `
                <li>
                    <img id="poster" class="result_img" width="60" height="60" src=${i.src} alt="poster">
                    <div class="data_container">
                        <div class="data_title">
                            <p class="results_title" id="title">${i.Title}</p>
                        </div>
                        <div class="data_year_runtime">
                            <p class="results_year" id="year">Year: ${i.Year}</p>
                            <p class="results_runtime" id="runtime">Runtime: ${i.Runtime}</p>
                        </div>
                    </div>
                    <div class="favourite"><i data-id = "${i.Id}" class="favourite bi bi-heart"></i></div>
                    <div data-id = "${i.Id}" class="more_details"><a href="./moviePage.html"></a></div>
                </li>
                `
                s_list.append(li)
        }

        // to update the new reselt in the search list
        function addDataToSearchList(data_received){
            let year = ""; let runtime = ""; let url = ""; let title = ""; let id = ""
            if(data_received.Response === "True"){
                if(data_received.imdbID !== "N/A"){
                    id = data_received.imdbID
                }else{
                    id = tempSearchData.length
                }
                if(data_received.Title !== "N/A"){
                    title = data_received.Title
                }
                if(data_received.Year !== "N/A"){
                    year = data_received.Year
                }
                if(data_received.Runtime !== "N/A"){
                    runtime = data_received.Runtime
                }
                if(data_received.Poster !== "N/A"){
                    url = data_received.Poster
                }else{
                    url = "./blank.png"
                }
                tempSearchData.push(
            {   
                "Id": id,
                "Title": title,
                "Year": year,
                "Runtime": runtime,
                "src": url})
                refreshSearchList()
            }
        }

        // to remove the old list and requesting to render the new updated list
        function refreshSearchList(){
            s_list.innerHTML = ""
            for(let i of tempSearchData){
                renderSearch(i)
            }
        }
    }
    return{
        launchIndexApplication: renderApp
    }
})()