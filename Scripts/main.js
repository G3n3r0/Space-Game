window.onload = function() {
    var menuDiv = $("#menu");
    var canvas = $("#c");
    var splash = $("#splash");
    var otherMenu = $("#otherMenu");
    var touchCons = $("#touchControls");
    var stage = new Stage(canvas[0]);
    
    var imgs = {
        playerShip: "Graphics/starship.png",
        enemyShip: "Graphics/starshipdark_flipped.png",
        speaker: "Graphics/Icons/speaker.svg",
        muted: "Graphics/Icons/speaker_muted.svg",
        pause: "Graphics/Icons/stop_hand.svg",
        play: "Graphics/Icons/right_arrow.svg"
    };
    //alert(Modernizr.svg);
    if(!Modernizr.svg) {
        imgs.playerShip = "Graphics/starship.png";
        imgs.enemyShip = "Graphics/starshipdark_flipped.png";
    }
    //var shootInt = 0;
    Array.prototype.findIndex = function(val) {
        for(var i in this) {
            if(this[i] == val) {
                return i;
            }
        }
        return false;
    };
    Array.prototype.removeIt = function(val) {
        var s = this.findIndex(val);
        if(s!==false) {
            this.splice(s,1);
        }
    };
    /*function replacementImg(src) {
        var canvgC = document.createElement("canvas");
        canvg(canvgC, src);
        return canvgC.toDataURL("image/png");
    }*/
    
    function E(a, b) {
        if(a && b) {
            return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            );
        } else {
            return false;
        }
    }
    var playerBullets = [];
    var enemyBullets = [];
    var enemies = [];
    
    function Bullet(colors,x,y,type) {
        this.colors = colors;
        this.x = x;
        this.y = y;
        //this.w = 8;
        this.w = (8/640)*canvas.width();
        //this.h = 12;
        this.h = (12/640)*canvas.width();
        this.power = 2;
        this.width = this.w;
        this.height = this.h;
        this.type = type;
        this.g = new Graphics();
        //this.g.beginFill(color);
        //this.g.drawRoundRect(0,0,8,8,4,4);
        //this.g.beginLinearGradientFill(["green", "lime", "green"], [0, 0.5, 1], 0, 0, 8, 0);
        this.g.beginLinearGradientFill(this.colors, [0, 0.5, 1], 0, 0, this.w, 0);
        this.g.drawRect(0,0,this.w,this.h);
        this.rect = new Shape(this.g);
        this.rect.x = this.x;
        this.rect.y = this.y;
        if(this.type=="friend") {
            //this.spd = -9;
            this.spd = (-9/640)*canvas.width();
        } else if(this.type=="enemy") {
            //this.spd = 9;
            this.spd = (9/640)*canvas.width();
        }
        stage.addChild(this.rect);
    }
    Bullet.prototype.update = function() {
        //this.y -= 9;
        this.y += this.spd;
        this.rect.y = this.y;
        if(this.type == "friend" && this.y<-this.h) {
            //console.log("badoom");
            playerBullets.removeIt(this);
        } else if(this.type=="enemy" && this.y>canvas.height()) {
            enemyBullets.removeIt(this);
        }
    };
    
    function EnemyShip(imgSrc,x,y,width,height) {
        this.imgSrc = imgSrc;
        this.x = x;
        //this.y = y;
        this.y = 0-height;
        this.maxY = y;
        //this.spd = 2;
        this.spd = (2/640)*canvas.width();
        this.width = width;
        this.height = height;
        this.bit = {x:0,y:0};
        this.bulletInt = 800;
        this.shootInt = 800;
        //this.shootInt = 500;
        this.health = 50;
        this.maxHealth =50;
        
        this.img = new Image();
        var t = this;
        this.img.onload = function() {
            t.bit = new Bitmap(this);
            //t.bit.regX = this.width/2;
            //t.bit.regY = this.height/2;
            //t.bit.rotation = 180;
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
    EnemyShip.prototype.update = function(p) {
        var vx = 0;
        //var vy = 0;
        //if(this.x) vy -= this.spd;
        //if(d) vy += this.spd;
        //console.log(p);
        if(this.x>p.x) vx -= this.spd;
        if(this.x<p.x) vx += this.spd;
        if(this.x==p.x) vx = 0;
        this.x += vx;
        if(this.y<this.maxY) {
            this.y += this.spd;
        }
        /*if(this.x>canvas.width()-this.width || this.x<0) {
            this.x -= vx;
        }
        this.y += vy;
        if(this.y>canvas.height()-this.height || this.y<0) {
            this.y -= vy;
        }
        this.bit.x = this.x;
        this.bit.y = this.y;
        
        if(f && shootInt>=this.bulletInt) {
            playerBullets.push(new Bullet(["green", "lime", "green"], this.x+this.width/2-4, this.y-4, "friend"));
            shootInt = 0;
        }*/
        if(this.shootInt>=this.bulletInt) {
            enemyBullets.push(new Bullet(["red", "orange", "red"], this.x+this.width/2-4, this.y+this.height, "enemy"));
            soundManager.play("Bullet");
            this.shootInt = 0;
        }
        this.bit.x = this.x;
        this.bit.y = this.y;
    };
    
    function PlayerShip(imgSrc,x,y,width,height) {
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        //this.spd = 3;
        this.spd = (3/640)*canvas.width();
        this.width = width;
        this.height = height;
        this.bit = {x:0,y:0};
        this.bulletInt = 500;
        this.shootInt = 0;
        this.health = 100;
        this.maxHealth = 100;
        
        /*this.g = new Graphics();
        //this.g.beginFill(color);
        //this.g.drawRoundRect(0,0,8,8,4,4);
        //this.g.beginLinearGradientFill(["green", "lime", "green"], [0, 0.5, 1], 0, 0, 8, 0);
        this.g.beginLinearGradientFill(this.colors, [0, 0.5, 1], 0, 0, this.w, 0);
        this.g.drawRect(0,0,this.w,this.h);
        this.rect = new Shape(this.g);
        this.rect.x = this.x;
        this.rect.y = this.y;*/
        
        this.healthBar = {
            g: new Graphics()
        }
        this.healthBar.g.beginFill("green");
        this.healthBar.g.drawRect(0,0,this.width,5);
        this.healthBar.rect = new Shape(this.healthBar.g);
        this.healthBar.rect.x = this.x;
        //alert(this.y);
        //alert(this.h);
        this.healthBar.rect.y = this.y+this.height;
        stage.addChild(this.healthBar.rect);
        //console.log(this.healthBar.rect);
        
        this.img = new Image();
        var t = this;
        this.img.onload = function() {
            t.bit.regX = 0;
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
        if(u) vy -= this.spd;
        if(d) vy += this.spd;
        if(l) vx -= this.spd;
        if(r) vx += this.spd;
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
        
        this.healthBar.g.clear();
        //this.healthBar.g = new Graphics();
        this.healthBar.g.beginFill("green");
        this.healthBar.g.drawRect(0, 0, (this.health/this.maxHealth)*this.width, 5);
        //this.healthBar.rect = new Shape(this.healthBar.g);
        //this.healthBar.rect.x = this.x;
        
        this.healthBar.rect.x = this.x;
        this.healthBar.rect.y = this.y+this.height;
        //console.log(this.healthBar);
        
        if(f && this.shootInt>=this.bulletInt) {
            soundManager.play("Bullet");
            playerBullets.push(new Bullet(["green", "lime", "green"], this.x+this.width/2-4, this.y-4, "friend"));
            this.shootInt = 0;
        }
        
        //stage.update();
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
        } else if(e.which===32) {
            f = true;
        }
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
        } else if(e.which===32) {
            f = false;
        }
    };
    canvas[0].ontouchstart = function() {
        Ticker.setPaused(!Ticker.getPaused());
        //soundManager.mute
    }
    /*canvas[0].ontouchend = function () {
        Ticker.setPaused(false);
    };*/
    $("#up").live("touchstart", function() {
        u = true;
    }).live("touchend", function() {
        u = false;
    });
    $("#down").live("touchstart", function() {
        d = true;
    }).live("touchend", function() {
        d = false;
    });
    $("#left").live("touchstart", function() {
        l = true;
    }).live("touchend", function() {
        l = false;
    });
    $("#right").live("touchstart", function() {
        r = true;
    }).live("touchend", function() {
        r = false;
    });
    $("#fire").live("touchstart", function() {
        f = true;
    }).live("touchend", function() {
        f = false;
    });
    
    var bgInc = (20/640)*canvas.width();
    var ratio = 21/shipW;
    var distInc = ratio*bgInc;
    var distTravel = 0;
    window.tick = function() {
        //canvas[0].style.backgroundPositionY = parseInt(canvas[0].style.backgroundPositionY||0, 10)+bgInc+"px";
        canvas[0].style.backgroundPosition = "0px "+(parseInt(canvas[0].style.backgroundPosition.split(" ")[1]||0, 10)+bgInc)+"px";
        //console.log("0px "+(parseInt(canvas[0].style.backgroundPosition.split(" ")[1], 10)+20)+"px");
        
        window.playerShip.update(u,d,l,r,f);
        for(var i=0;i<playerBullets.length;i++) {
            playerBullets[i].update();
        }
        //console.log(playerBullets);
        for(var j=0;j<enemies.length;j++) {
            enemies[j].update(window.playerShip);
            enemies[j].shootInt += 1000/Ticker.getFPS();
            
            for(var m=0;m<playerBullets.length;m++) {
                if(E(enemies[j], playerBullets[m])) {
                    //console.log("A hit, cap'n!");
                    enemies[j].health -= playerBullets[m].power;
                    stage.removeChild(playerBullets[m].rect);
                    playerBullets.removeIt(playerBullets[m]);
                }
            }
            if(enemies[j].health<=0) {
                //alert("enemy killed");
                stage.removeChild(enemies[j].bit);
                enemies.removeIt(enemies[j]);
                //unfight();
            }
        }
        for(var k=0;k<enemyBullets.length;k++) {
            enemyBullets[k].update();
            if(E(window.playerShip, enemyBullets[k])) {
                //console.log("A hit, cap'n!");
                window.playerShip.health -= enemyBullets[k].power;
                stage.removeChild(enemyBullets[k].rect);
                enemyBullets.removeIt(enemyBullets[k]);
            }
        }
        stage.update();
        window.playerShip.shootInt += 1000/Ticker.getFPS();
        if(window.playerShip.health<=0) {
            //alert("You died!");
            Ticker.setPaused(true);
            menuScreen();
        }
        if(enemies.length===0 && fighting) {
            unfight();
        }
        //console.log(shootInt);
        
        
    };
    
    //window.scrollTo(0,1);
    //var canvas = document.getElementById("c");
    
    if(screen.width<640 || screen.height<480) {
        canvas[0].width = 320;
        canvas[0].height = 240;
        /*canvas.click(function() {
            f = !f;
        });*/
    }
    
    function hideAll() {
        menuDiv.hide();
        canvas.hide();
        splash.hide();
        otherMenu.hide();
        touchCons.hide();
    }
    
    function menuScreen() {
        //canvas.hide();
        $("#fly").click(function() {
            travelTo(parseInt(prompt("How far away?"), 10));
        });
        //menuDiv.hide();
        //splash.hide();
        hideAll();
        //otherMenu.show();
        menuDiv.fadeIn(2000, "easeInElastic", function() {
            if(!soundManager.getSoundById("Travel").muted) {
                speak("Please select your action.", {pitch: 150});
            }
            //alert("Boom");
        });
        //menuDiv.slideDown(2000);
        $("body").addClass("menuUp");
        window.scrollTo(0,1);
        //canvg();
    }
    var fighting = false;
    function fight(ships) {
        window.scrollTo(0, 1);
        document.body.ontouchstart = function(e) {
            e.preventDefault();
            return false;
        };
        
        fighting = true;
        soundManager.stopAll();
        soundManager.play('Battle');
        
        enemies = enemies.concat(ships);
    }
    function unfight() {
        document.body.ontouchstart = undefined;
        fighting = false;
        soundManager.stopAll();
        soundManager.play('Travel');
    }
    
    function travelTo(dist) {
        soundManager.stopAll();
        soundManager.play('Travel');
        hideAll();
        //otherMenu.show();
        /*touchCons.show();
        touchCons.css("display", "inline-block");*/
        if('ontouchstart' in window) {
            touchCons.show();
            touchCons.css("display", "inline-block");
            alert(touchCons[0].style.display);
        }
        canvas.show();
        canvas.attr("class", "space");
        canvas.css("background-position", "0px 0px");
        //menuDiv.hide();
        //splash.hide();
        $("body").removeClass("menuUp");
        //setInterval(function() {
            //console.log(canvas[0]);
            //console.log(canvas[0].style.backgroundPosition);
            //canvas[0].style.backgroundPosition = new Number(canvas[0].style.backgroundPosition)-5+"px";
            //canvas.css("background-position", "0px "+parseInt(canvas[0].style.backgroundPositionY)+1+"px");
            //*canvas[0].style.backgroundPositionY = parseInt(canvas[0].style.backgroundPositionY, 10)+20+"px";
            //console.log(parseInt(canvas[0].style.backgroundPositionX, 10)+"px -100px");
            //console.log("0px "+parseInt(canvas[0].style.backgroundPositionY, 10)+"px");
        //}, 1000/30);
        //console.log(canvas.width);
        window.playerShip = new PlayerShip(imgs.playerShip, canvas.width()/2-shipW/2, canvas.height()*0.75, shipW, shipW);
        //alert(canvas.width()/2-shipW/2);
        fight(new EnemyShip(imgs.enemyShip, canvas.width()/2-shipW/2, canvas.height()*0.25-shipW, shipW, shipW));
        //window.open(replacementImg("Graphics/starshipdark_flipped.svg"));
        Ticker.setFPS(30);
        Ticker.addListener(window);
    }
    function splashScreen(callback) {
        //soundManager.play("Levelup Sound");
        /*var s = soundManager.getSoundById("Levelup Sound");
        console.log(s);
        s._onfinish = function() {
            //alert("Ramalamlama Ice Ka dingity Ding de dong.");
            splash.fadeOut(500, callback);
        };
        s.play();*/
        splash.fadeIn(3000, "linear", function() {
            splash.fadeOut(500, "linear", callback);
        });
        window.scrollTo(0, 1);
    }
    
    var shipW = (64/640)*canvas.width();
    function init() {
        soundManager.url="./Scripts/SoundManager2/swf/soundmanager2.swf";
        soundManager.onready(function() {
            soundManager.debugMode = false;
            soundManager.createSound({
                id: 'Travel',
                url: './Sound/Music/Road Trip.mp3',
                onfinish: function() {
                    //console.log(this);
                    this.play();
                }
            });
            soundManager.createSound({
                id: "Battle",
                url: "./Sound/Music/Rusty Boss-man Tussle.mp3",
                onfinish: function() {
                    //console.log(this);
                    this.play()
                }
            });
            soundManager.createSound({
                id: 'Bullet',
                url: './Sound/SFX/silencer.wav'
            });
            /*soundManager.createSound({
                id: 'Levelup Sound',
                url: "./Sound/Music/copycat_levelup.wav",
                autoLoad: true
            });*/
            $("#audioToggle").click(function() {
                //soundManager.toggleMute();
                if(soundManager.getSoundById("Travel").muted) {
                    soundManager.unmute();
                    $("#audioToggle img").attr("src", imgs.speaker);
                } else {
                    soundManager.mute();
                    $("#audioToggle img").attr("src", imgs.muted);
                }
            });
            $("#pauseToggle").click(function() {
                var p = Ticker.getPaused();
                Ticker.setPaused(!p);
                if(p) {
                    $("#pauseToggle img").attr("src", imgs.pause);
                } else {
                    $("#pauseToggle img").attr("src", imgs.play);
                }
            });
            //soundManager.play('Battle');
            splashScreen(menuScreen);
        });
        //menuScreen();
        //travelTo(5000);
        //splashScreen(menuScreen);
    }
    init();
    
    var currentWidth;
    var updateLayout = function() {
        //alert("Update time!");
        if (window.innerWidth != currentWidth) {
            currentWidth = window.innerWidth;
            var orient = (currentWidth == 320) ? "portrait" : "landscape";
            document.body.setAttribute("orient", orient);
            touchCons.attr("class", orient);
            //window.scrollTo(0, 1);
            //alert(orient);
        }
    };
    setInterval(updateLayout, 250);
};