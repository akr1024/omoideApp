// This is a JavaScript file
//Save memo and return to top page
function addSaveBtnTapped(){
    
    var place = $("#place").val();
    var impression = $("#impression").val();
    var now = new Date();
    var latitude = $("#latitude").val();
    var longitude = $("#longitude").val();
    
    var saveObj = {
        "id": now.getTime(),
        "place":place,
        "impression":impression,
        "latitude": latitude,
        "longitude": longitude,
        "datetime": now.toLocaleString()
    };
    
    if(place != ''){
        //Save to local storage
        window.localStorage.setItem(now.getTime(), JSON.stringify(saveObj));
        
        alert('思い出の保存が完了しました');
        
        //clear form
        $("#place").val("");
        $("#impression").val("");
        
        $.mobile.changePage("#topPage",{transition: "slideup",reverse:true});
        updateTopPage();
    }else{
        alert("場所の入力は必須です")
    }
    
}

//Delete memo
function deleteBtnTapped(){
  var li = $(this).parents("li");
  var id = li.data("id");

  if(!confirm("この思い出を本当に削除してもよろしいですか？")){
    return;
  }
  var li =$(this).parent();
  var id = li.data("id");

  window.localStorage.removeItem(id);

  updateTopPage();

}

//get user location
function getLocationBtnTapped(){
  navigator.geolocation.getCurrentPosition(function(pos) {
    var latitude = pos.coords.latitude;
    var longitude = pos.coords.longitude;

    $("#addPage #latitude").attr("value",latitude);
    $("#addPage #longitude").attr("value",longitude);
  });
}

//move to detail page
function toDetailLinkTapped(id){
  var data = window.localStorage.getItem(id);
  var item = JSON.parse(data);

  $("#showPage h1").text(item.place);
  $("#showPage p#showDatetime").text(item.datetime);
  $("#showPage p#showImpression").html(item.impression.replace(/\n/g,"<br>"));

  $(document).on("pageshow","#showPage",function(){
    mapInit(item.latitude, item.longitude);
  });

  $.mobile.changePage("#showPage",{transition:"slide"});
}

// refresh top page
function updateTopPage() {
    $("#memoryListView").empty();

    for(var i = 0; i < window.localStorage.length; i++) {
        if($.isNumeric(window.localStorage.key(i))) {
            var data = window.localStorage.getItem(window.localStorage.key(i));
            var item = JSON.parse(data);

            var li = $("<li><a href='#' class='show'><h3></h3><p></p></a><a href='#' class='delete'>Delete</a></li>");
            li.data("id", item.id);
            li.find("h3").text(item.place);
            li.find("p").text(item.datetime);
            $("#memoryListView").prepend(li);
        }
    }
    $("#memoryListView").listview("refresh");  // Call refresh after manipulating list
}

//refresh map page
function updateMapPage(){
  var myLatlng = new google.maps.LatLng(36.302624, 136.314627);
  var mapOptions = {
      center: myLatlng,
      zoom: 4,
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      mayTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapPage_canvas"),mapOptions);

  for(var i = 0;i<window.localStorage.length; i++){
    if($.isNumeric(window.localStorage.key(i))){
      var data= window.localStorage.getItem(window.localStorage.key(i));
      var item= JSON.parse(data);

      var marker= new google.maps.Marker({
          position: new google.maps.LatLng(item.latitude, item.longitude),
          map: map
      });
      attachInfoWindow(marker,item);
    }
  }
}

//show infowindow on map
function attachInfoWindow(marker, item){
  var contentString = "<h4>" + item.place + "</h4><a rel='external' href='#' onclick='toDetailLinkTapped("+item.id+");'>詳しく見る</a>";
  google.maps.event.addListener(marker, 'click',function(){
    new google.maps.InfoWindow({
        content: contentString
    }).open(marker.getMap(),marker);
  });
}

//update map on showpage
function mapInit(latitude,longitude){
  if(latitude && longitude){
    var myLatlng = new google.maps.LatLng(latitude,longitude);
    var mapOptions = {
        center:myLatlng,
        zoom: 14,
        panControl: false,
        zoomControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        overviewMapControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById("map_canvas"),mapOptions);

    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map
    });

  }else{
    $("#map_canvas").html("なし");
    $("#map_canvas").css("background-color","#ddd");
  }
}

//add event listener
function beforeStart(){
    updateTopPage();
    $("#addSave").click(addSaveBtnTapped);
    $("#getLocation").click(getLocationBtnTapped);
    $("#memoryListView").on("click","a.show",function(){
      var li = $(this).parents("li");
      var id = li.data("id");
      toDetailLinkTapped(id);
    });
    $("#memoryListView").on("click","a.delete",deleteBtnTapped);
}

//on application ready
$(document).ready(function(){
    beforeStart();
});

//show on mapPage
$(document).on('pageshow','#mapPage',function(){
  updateMapPage();
});