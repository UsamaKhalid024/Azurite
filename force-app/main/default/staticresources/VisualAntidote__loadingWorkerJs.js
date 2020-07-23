 
//wait for the start 'loadingGIF' message
//e is the event and e.data contains the JSON object
self.onmessage = function(e) {
 var showLoading=e.data.value;
 
 
     
    self.postMessage({'showLoading': showLoading+'updated'});
     
}