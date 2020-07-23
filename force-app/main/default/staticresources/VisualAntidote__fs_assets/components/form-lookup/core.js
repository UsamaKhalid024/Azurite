function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function doSearch(){
    var searchTxt=$('.ff-type-search').val();
    var objectSelected=$('.object-list').val();
    doSearchAF(searchTxt,objectSelected);
}
function searchComplete(){
    console.log("Search result is processed");
}

$(document).ready(function(){
    $('select.select-elem').select2();
});