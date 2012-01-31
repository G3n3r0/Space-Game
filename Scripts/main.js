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
        this.spd = 3;
        this.width = width;
        this.height = height;
        this.bit = {x:0,y:0};
        
        this.img = new Image();
        var t = this;
        this.img.onload = function() {
            t.bit = new Bitmap(this);
            t.bit.x = t.x;
            t.bit.y = t.y;
            t.bit.scaleX = t.width/this.width;
            t.bit.scaleY = t.height/this.height;
            //console.log(t.bit);
            stage.addChild(t.bit);
            stage.update();
        };
        this.img.src = this.imgSrc;
    }
    PlayerShip.prototype.update = function(u,d,l,r,f) {
        var vx = 0;
        var vy = 0;
        if(u) vy = -this.spd;
        if(d) vy = this.spd;
        if(l) vx = -this.spd;
        if(r) vx = this.spd;
        this.x += vx;
        if(this.x>canvas.width()-this.width || this.x<0) {
            this.x -= vx;
        }
        this.y += vy;
        if(this.y>canvas.height()-this.height || this.y<0) {
            this.y -= vy;
        }
        this.bit.x = this.x;
        this.bit.y = this.y;
        stage.update();
    };
    
    var u,d,l,r,f = false;
    document.onkeydown = function(e) {
        //console.log(e.which);
        if(e.which===38 || e.which===87) {
            u = true;
        } else if(e.which===40 || e.which===83) {
            d = true;
        } else if(e.which===39 || e.which===68) {
            r = true;
        } else if(e.which===37 || e.which===65) {
            l = true;
        }/* else if(e.which===16) {
            window.player.spd = 9;
        }*/
    };
    document.onkeyup = function(e) {
        if(e.which===38 || e.which===87) {
            u = false;
        } else if(e.which===40 || e.which===83) {
            d = false;
        } else if(e.which===39 || e.which===68) {
            r = false;
        } else if(e.which===37 || e.which===65) {
            l = false;
        }/* else if(e.which===16) {
            window.player.spd = 3;
        }*/
    };
    
    window.tick = function() {
        window.playerShip.update(u,d,l,r,f);
    };
    
    window.scrollTo(0,1);
    //var canvas = document.getElementById("c");
    var menuDiv = $("#menu");
    var canvas = $("#c");
    var stage = new Stage(canvas[0]);
    
    function menuScreen() {
        canvas.hide();
        $("#fly").click(function() {
            travelTo(parseInt(prompt("How far away?"), 10));
        });
        menuDiv.hide();
        menuDiv.fadeIn(2000, "easeInElastic", function() {
            speak("Please select your action.", {pitch: 150});
            //alert("Boom");
        });
        //menuDiv.slideDown(2000);
        $("body").addClass("menuUp");
    }
    
    function travelTo(dist) {
        canvas.show();
        canvas.attr("class", "space");
        canvas.css("background-position", "0px 0px");
        menuDiv.hide();
        $("body").removeClass("menuUp");
        setInterval(function() {
            //console.log(canvas[0]);
            //console.log(canvas[0].style.backgroundPosition);
            //canvas[0].style.backgroundPosition = new Number(canvas[0].style.backgroundPosition)-5+"px";
            //canvas.css("background-position", "0px "+parseInt(canvas[0].style.backgroundPositionY)+1+"px");
            canvas[0].style.backgroundPositionY = parseInt(canvas[0].style.backgroundPositionY, 10)+5+"px";
            //console.log(parseInt(canvas[0].style.backgroundPositionX, 10)+"px -100px");
            //console.log("0px "+parseInt(canvas[0].style.backgroundPositionY, 10)+"px");
        }, 1000/30);
        //console.log(canvas.width);
        window.playerShip = new PlayerShip("Graphics/starship.svg", canvas.width()/2-32, canvas.height()*0.75, 64, 64);
        Ticker.setFPS(30);
        Ticker.addListener(window);
    }
    
    function init() {
        menuScreen();
        //travelTo(5000);
    }
    init();
};