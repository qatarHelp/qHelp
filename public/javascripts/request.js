$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});

var room = 0;
function add_fields() {
    room++;
    var objTo = document.getElementById('additional')
    var divtest = document.createElement("div");
    divtest.innerHTML = '<div class="col-lg-12 text-center"><div class="service-box mt-5 mx-auto"><div class="row" style="width: 800px;"><h5 class="mb-3" style="padding-left: 30px;padding-top: 5px;padding-right: 32px;">Pickup Location '+room+':</h4><input type = "text" style="width: 330px;" name = "location2" id = "location2" placeholder = "Room 1202 in CMU, Qatar Foundation"></div></div></div>';
    
    objTo.appendChild(divtest)
}

var roomtime = 0;
function add_time() {
    roomtime++;
    var objTo = document.getElementById('additionaltime')
    var divtest = document.createElement("div");
    divtest.innerHTML = '<div class="col-lg-12 text-center"><div class="service-box mt-5 mx-auto"><div class="row" style="width: 800px;"><h5 class="mb-3" style="padding-left: 30px;padding-top: 5px;padding-right: 20px;">Starting Time '+roomtime+':</h4><input type="datetime-local" style="width: 370px;"name = "stime2" id = "stime"  placeholder = "Today by 12pm"></div></div></div>';
   
    objTo.appendChild(divtest)
}