window.onload = function() {
    function E(a, b) {
        return !(
            ((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))
        );
    }
    
    function PlayerShip(imgSrc,x,y,width,height) {
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        
        this.img = new Image();
        var t = this;
        this.img.onload = function() {
            t.bit = new Bitmap(this);
            t.bit.x = t.x;
            t.bit.y = t.y;
            t.bit.scaleX = t.width/this.width;
            t.bit.scaleY = t.height/this.height;
            console.log(t.bit);
            stage.addChild(t.bit);
            stage.update();
        };
        this.img.src = this.imgSrc;
    }
    
    window.scrollTo(0,1);
    //var canvas = document.getElementById("c");
    var menuDiv = $("#menu");
    var canvas = $("#c");
    var stage = new Stage(canvas[0]);
    
    function menuScreen() {
        speak("Please select your action.");
        canvas.hide();
        menuDiv.show();
        $("body").addClass("menuUp");
    }
    
    function travelTo(dist) {
        canvas.show();
        canvas.attr("class", "space");
        canvas.css("background-position", "0px 0px");
        menuDiv.hide();
        $("body").removeClass("menuUp");
        setInterval(function() {
            console.log(canvas[0]);
            //console.log(canvas[0].style.backgroundPosition);
            //canvas[0].style.backgroundPosition = new Number(canvas[0].style.backgroundPosition)-5+"px";
            //canvas.css("background-position", "0px "+parseInt(canvas[0].style.backgroundPositionY)+1+"px");
            canvas[0].style.backgroundPositionY = parseInt(canvas[0].style.backgroundPositionY)+5+"px";
            //console.log(parseInt(canvas[0].style.backgroundPositionX, 10)+"px -100px");
            //console.log("0px "+parseInt(canvas[0].style.backgroundPositionY, 10)+"px");
        }, 1000/30);
        //console.log(canvas.width);
        new PlayerShip("Graphics/starship.svg", canvas.width()/2-32, canvas.height()*0.75, 64, 64);
    }
    
    function init() {
        menuScreen();
        //travelTo(5000);
    }
    init();
};