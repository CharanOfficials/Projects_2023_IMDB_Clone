var favListApp = (function(){
    const favList = document.getElementsByClassName("fav_list")[0]

// Event listener
document.addEventListener("click", (e)=>{
    const target = e.target
    // remove item on fav click from the list
    if(target.id === "fav_icon"){
        const favId = target.dataset.id
        removedFromFavList(favId)
    }
    // redirect to home ppage
    else if(target.id === "home"){
        window.location.href = "./index.html"
    }
    // redirect to more details page
    else if(target.id === "index_clicked"){
        const clickedId = target.dataset.id
        sessionStorage.clear()
        sessionStorage.setItem("detailsSetter", clickedId)
        window.location.href = "./moviePage.html"
    }
})

// Remove item from fav list
function removedFromFavList(favId){
    for(let i=1; i < localStorage.length; i++){
        const favData = localStorage.getItem(i)
        const parsedFavData = JSON.parse(favData)
        if(parsedFavData.Id === favId){
            parsedFavData.isFavourite = 'false'
            localStorage.setItem(i, JSON.stringify(parsedFavData))
            favList.innerHTML = ""
            alert("Item removed successfully from List")
            getFavListItems()
        }
    }
}

// render fav list
function renderFavList(data){
    console.log(data)
    const li = document.createElement('li')
    li.innerHTML = `
    
    <div data-id = "${data.Id}" id="index_clicked" class="fav_clicked"></div>
    <div id="fav_title" class="fav_title">Title: ${data.title}</div>
    <div class="fav_sub_details">
        <p id="fav_released_date">Released Date: ${data.releasedDate}</p>
        <p id="fav_runtime">Runtime: ${data.runtime}</p>
        <p id="fav_genre">Genre: ${data.genre}</p>
        <p id="fav_director">Director: ${data.director}</p>
    </div>
    <div class="fav_div"><i id="fav_icon" data-id = "${data.Id}" class="fav_icon bi bi-heart-fill"></i></div>
    `
    favList.append(li)
}

// get fav list items
function getFavListItems(){
    for(let i=1; i < localStorage.length; i++){
        const favData = localStorage.getItem(i)
        const parsedFavData = JSON.parse(favData)
        if(parsedFavData.isFavourite === 'true'){
            renderFavList(parsedFavData)
        }
    }

}

return{
    launchFavListApplication: getFavListItems
} 
})()