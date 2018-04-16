// This is a JavaScript file
//Save memo and return to top page
function addSaveBtnTapped(){
    
    var place = $("#place").val();
    var impression = $("#impression").val();
    var now = new Date();
    
    var saveObj = {
        "id": now.getTime(),
        "place":place,
        "impression":impression,
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
    }else{
        alert("場所の入力は必須です")
    }
    
}

//add event listener
function beforeStart(){
    $("#addSave").click(addSaveBtnTapped);
}

//on application ready
$(document).ready(function(){
    beforeStart();
});