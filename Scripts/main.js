window.onload = function() {
    function E(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
    window.scrollTo(0,1);
    //var canvas = document.getElementById("c");
    var menuDiv = $("#menu");
    var canvas = $("#c");
    var stage = new Stage(canvas[0]);
    
    function menuScreen() {
        canvas.hide();
        menuDiv.show();
        $("body").addClass("menuUp")
    }
    
    function travelTo(dist) {
        canvas.show();
        canvas.attr("class", "space");
        menuDiv.hide();
        $("body").removeClass("menuUp");
    }
    
    function init() {
        menuScreen();
        travelTo(5000);
    }
    init();
};