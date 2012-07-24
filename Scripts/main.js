window.onload = function() {
    function cloneBit(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        //var copy = obj.constructor();
        var copy = new Bitmap();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
    
    var ship2plan = 20;
    var menuDiv = $("#menu");
    var canvas = $("#c");
    //console.log(canvas);
    var splash = $("#splash");
    var otherMenu = $("#otherMenu");
    var touchCons = $("#touchControls");
    var map = $("#map");
    var mapC = $("#mapCanv");
    var mapStage = new Stage(mapC[0]);
    var stage = new Stage(canvas[0]);
    var three = false;
    var speakingOpts = {pitch: 150};
    var curRing = 1;
    var maxRings = 9;
    
    var imgs = {
        playerShip: "Graphics/starship.svg",
        enemyShip: "Graphics/starshipdark_flipped.svg",
        speaker: "Graphics/Icons/speaker.svg",
        muted: "Graphics/Icons/speaker_muted.svg",
        pause: "Graphics/Icons/stop_hand.svg",
        play: "Graphics/Icons/right_arrow.svg",
        stars: "Graphics/space.svg"
    };
    //alert(Modernizr.svg);
    if(!Modernizr.svg || three) {
        imgs.playerShip = "Graphics/starship.png";
        imgs.enemyShip = "Graphics/starshipdark_flipped.png";
        imgs.stars = "Graphics/space.png";
    }
    
    function blank() {}
    
    /*if(screen.width<640 || screen.height<480) {
        canvas[0].width = 320;
        canvas[0].height = 240;
        /*canvas.click(function() {
            f = !f;
        });
    } else if(screen.width>=960 && screen.height>=720) {
        canvas[0].width = 960;
        canvas[0].height = 720;
    }*/
    /*if(screen.width>screen.height) {
        canvas[0].height = screen.height-10;
        canvas[0].width = screen.height-10;
    } else {
        canvas[0].width = screen.width-10;
        canvas[0].height = screen.width-10;
    }*/
    canvas[0].width = screen.width;
    canvas[0].height = screen.height;
    
    mapC[0].width = canvas[0].height-25;
    mapC[0].height = canvas[0].height-25;
    var shipW = (64/640)*canvas[0].width;
    
    var cbs = {
        playerShip: blank,
        enemyShip: blank,
        speaker: blank,
        muted: blank,
        pause: blank,
        play: blank,
        stars: function() {
            if(!Modernizr.svg || three) {
                //console.log(imgs, imgs.stars);
                canvas.css("background-image", "url("+imgs.stars+")");
            }
        }
    };
    
    function make3D() {
        for(var i in imgs) {
            var a = new Image();
            a.i = i;
            a.onload = function() {
                imgs[this.i] = threed(this);
                cbs[this.i].call();
                //window.open(imgs[this.i]);
            };
            a.src = imgs[i];
        }
        //console.log(imgs);
        //window.open(imgs.playerShip);
        /*var i = 0;
        var nxtImg = function(e) {
            i += 1;
            console.log(i);
            if(i>=imgs.length) {
                alert("Bazinga!");
                cb();
            } else {
                a = new Image();
                a.onload = nxtImg;
                a.src = imgs[i];
            }
        };
        var a = new Image();
        a.onload = nxtImg;
        a.src = imgs[i];*/
    }
    if(three) {
        $("#3dstyle").attr("rel", "stylesheet");
        make3D();
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
    
    function Planet(name, src, x, y) {
        this.name = name;
        this.src = src;
        this.x = x;
        this.y = y;
        this.r = ship2plan*shipW;
        var t = this;
        this.img = new Image();
        this.img.onload = function() {
            t.bit = new Bitmap(this);
            //t.bit.x = t.x;
            //t.bit.y = t.y;
            //console.log(t, t.r, this.width);
            t.bit.scaleX = t.r*2/this.width;
            t.bit.scaleY = t.r*2/this.height;
            //stage.addChild(t.bit);
            //stage.update();
        };
        this.img.src = this.src;
    }
    var planets = [new Planet("Zaklorg", "http://opengameart.org/sites/default/files/PlanetRed.png", 0, 0), new Planet("Vlag", "Graphics/tundra.png", 5, 3), new Planet("Shukal", "Graphics/desert.png", 9, 9)];
    var magicPlanet = new Planet("Yil-Tulzscha", "http://placekitten.com/1024/1024", 0, 0);
    //var curPlanet = planets[0];
    
    var playerBullets = [];
    var enemyBullets = [];
    window.enemies = [];
    
    function Bullet(colors,x,y,type) {
        this.colors = colors;
        this.x = x;
        this.y = y;
        //this.w = 8;
        this.w = (8/640)*canvas[0].width;
        //this.h = 12;
        this.h = (12/640)*canvas[0].width;
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
            this.spd = (-9/640)*canvas[0].width;
        } else if(this.type=="enemy") {
            //this.spd = 9;
            this.spd = (9/640)*canvas[0].width;
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
        } else if(this.type=="enemy" && this.y>canvas[0].height) {
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
        this.spd = (2/640)*canvas[0].width;
        this.width = width;
        this.height = height;
        this.bit = {x:0,y:0};
        this.bulletInt = 800;
        this.shootInt = 800;
        //this.shootInt = 500;
        this.baseHealth = 50;
        this.health = 50;
        this.maxHealth = 50;
        this.maxHealth += ((curRing-1)/(maxRings-1));
        this.health += ((curRing-1)/(maxRings-1));
        
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
    
    function PlayerShip(imgSrc,x,y,width,height, health, maxHealth) {
        this.imgSrc = imgSrc;
        this.x = x;
        this.y = y;
        //this.spd = 3;
        this.spd = (3/640)*canvas[0].width;
        this.spdOrig = (3/640)*canvas[0].width;
        this.width = width;
        this.height = height;
        this.bit = {x:0,y:0};
        this.bulletInt = 500;
        this.shootInt = 0;
        this.health = health||100;
        this.maxHealth = maxHealth||100;
        
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
        if(this.x>canvas[0].width-this.width || this.x<0) {
            this.x -= vx;
        }
        this.y += vy;
        if(this.y>canvas[0].height-this.height || this.y<0) {
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
    function pausePlay(){
        var p = Ticker.getPaused();
        Ticker.setPaused(!p);
        clearTimeout(window.enemTimeout);
        if(p) {
            window.enemTimeout = setTimeout(function() { fight([new EnemyShip(imgs.enemyShip, canvas[0].width/2-shipW/2, canvas[0].height*0.25-shipW, shipW, shipW)])}, 45000);
            $("#pauseToggle img").attr("src", imgs.pause);
        } else {
            $("#pauseToggle img").attr("src", imgs.play);
        }
    }
    
    var u,d,l,r,f = false;
    document.body.onkeydown = function(e) {
        //console.log(e.which);
        if(e.which===38 || e.which===87) {
            u = true;
        } else if(e.which===40 || e.which===83) {
            e.preventDefault();
            d = true;
        } else if(e.which===39 || e.which===68) {
            r = true;
        } else if(e.which===37 || e.which===65) {
            l = true;
        } else if(e.which===32) {
            e.preventDefault()
            f = true;
        } else if(e.which===16) {
            //$("#pauseToggle").click();
            //alert("Pause clicked")
            /**var p = Ticker.getPaused();
            Ticker.setPaused(!p);
            if(p) {
                window.enemTimeout = setTimeout(function() { fight([new EnemyShip(imgs.enemyShip, canvas[0].width/2-shipW/2, canvas[0].height*0.25-shipW, shipW, shipW)])}, 45000);
                $("#pauseToggle img").attr("src", imgs.pause);
            } else {
                clearTimeout(window.enemTimeout);
                $("#pauseToggle img").attr("src", imgs.play);
            }*/
            pausePlay()
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
        } else if(e.which===90) {
            switchRing(curRing+1);
        } else if(e.which===88) {
            switchRing(curRing-1);
        }
        //console.log(e.which);
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
    
    var bgInc = (20/640)*canvas[0].width/1.75;
    var bgIncOrig = (20/640)*canvas[0].width;
    var ratio = 21/shipW;
    //var distInc = ratio*bgInc;
    //var distTravel = 0;
    window.tick = function() {
        //console.log("tick");
        //canvas[0].style.backgroundPositionY = parseInt(canvas[0].style.backgroundPositionY||0, 10)+bgInc+"px";
        canvas[0].style.backgroundPosition = "0px "+(parseInt(canvas[0].style.backgroundPosition.split(" ")[1]||0, 10)+bgInc)+"px, 50px "+(parseInt(canvas[0].style.backgroundPosition.split(" ")[1]||0, 10)+bgInc)/2+"px, 1000px "+(parseInt(canvas[0].style.backgroundPosition.split(" ")[1]||0, 10)+bgInc)/4+"px";
        //console.log(parseInt(canvas[0].style.backgroundPosition.split(" ")[1]||0, 10)+bgInc)
        
        //console.log("0px "+(parseInt(canvas[0].style.backgroundPosition.split(" ")[1], 10)+20)+"px");
        
        window.playerShip.update(u,d,l,r,f);
        if(window.to && window.from) {
            window.from.bit.y += window.playerShip.spd;
            window.to.bit.y += window.playerShip.spd;
            /*window.from.bit.y += bgInc;
            window.to.bit.y += bgInc;*/
            //console.log(window.to.bit.y);
            if(E(window.playerShip, window.to.bit)) {
                window.curPlanet = window.to;
                //console.log(curPlanet);
                //window.to = null;
                window.from = null;
                playerBullets = [];
                stage.removeAllChildren();
                stage.update();
                Ticker.setPaused(true);
                menuScreen();
            }
            //stage.update();
        }
        for(var i=0;i<playerBullets.length;i++) {
            playerBullets[i].update();
        }
        //console.log(playerBullets);
        for(var j=0;j<enemies.length;j++) {
            enemies[j].update(window.playerShip);
            //enemies[j].shootInt += 1000/Ticker.getFPS();
            enemies[j].shootInt += 1000/30;
            
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
                soundManager.play("Explosion");
                stage.removeChild(enemies[j].bit);
                enemies.removeIt(enemies[j]);
                window.enemTimeout = setTimeout(function() { fight([new EnemyShip(imgs.enemyShip, canvas[0].width/2-shipW/2, canvas[0].height*0.25-shipW, shipW, shipW)])}, 45000);
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
        //window.playerShip.shootInt += 1000/Ticker.getFPS();
        window.playerShip.shootInt += 1000/30;
        if(window.playerShip.health<=0) {
            //alert("You died!");
            soundManager.play("Explosion");
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
    
    function hideAll() {
        menuDiv.hide();
        canvas.hide();
        splash.hide();
        otherMenu.hide();
        touchCons.hide();
        map.hide();
    }
    
    function mapScreen() {
        mapStage.mouseEnabled = true;
        mapStage.enableMouseOver(25);
        mapStage.removeAllChildren();
        hideAll();
        map.show();
        speak("Select your destination.", speakingOpts);
        var size = mapC[0].width/10;
        /*for(var y=0;y<100;y++) {
            for(var x=0;x<100;x++) {
                
            }
        }*/
        var g = new Graphics();
        g.beginFill("rgba(0, 0, 255, 0.5)");
        g.drawRect(0, 0, size, size);
        //g.drawCircle(size/2, size/2, size/2);
        var s = new Shape(g);
        s.x = window.curPlanet.x*size;
        s.y = window.curPlanet.y*size;
        //mapStage.addChild(s);
        //console.log(s);
        var img = new Image();
        img.onload = function() {
            for(var i=0;i<planets.length;i++) {
                var b = new Bitmap(this);
                b.x = planets[i].x*size;
                b.y = planets[i].y*size;
                b.planet = planets[i];
                b.scaleX = b.scaleY = size/this.width;
                b.y += (size-b.scaleY*this.height)/2;
                b.onMouseOver = function(e) {
                    //console.log(this.planet.name);
                    $("#mapDesc b").text(this.planet.name);
                }
                b.onClick = function(e) {
                    if(this.planet!=window.curPlanet) {
                        travelTo(window.curPlanet, this.planet);
                    }
                }
                mapStage.addChild(b);
            }
            mapStage.addChild(s);
            mapStage.update();
        };
        img.src = "Graphics/Icons/planet.png";
    }
    function menuScreen() {
        clearTimeout(window.enemTimeout);
        document.body.setAttribute("class", "");
        //console.log(1, window.curPlanet);
        window.curPlanet = window.curPlanet||planets[0];
        //canvas.hide();
        $("#curPlan").html(window.curPlanet.name);
        //menuDiv.hide();
        //splash.hide();
        hideAll();
        soundManager.stopAll();
        if(!('ontouchstart' in window)) {
            otherMenu.show();
        }
        /*menuDiv.fadeIn(2000, "easeInElastic", function() {
            if(!soundManager.getSoundById("Travel").muted) {
                //speak("Please select your action.", {pitch: 150});
                var responses = ["Please select your action.", "What will you do now?", "What course will you follow now?"];
                speak("Welcome to "+window.curPlanet.name+". "+responses[Math.floor(Math.random()*responses.length)], speakingOpts);
            }
            //alert("Boom");
        });*/
        menuDiv.css("opacity", "0");
        menuDiv.show();
        menuDiv.animate({opacity: 1}, {easing: "ease-in", duration: 2000, complete: function() {
            if(!soundManager.getSoundById("Travel").muted) {
                //speak("Please select your action.", {pitch: 150});
                var responses = ["Please select your action.", "What will you do now?", "What course will you follow now?"];
                speak("Welcome to "+window.curPlanet.name+". "+responses[Math.floor(Math.random()*responses.length)], speakingOpts);
            }
            //alert("Boom");
        }});
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
        var n = Math.floor(Math.random()*(window.numBattleSongs))+1;
        //console.log(n);
        soundManager.play('Battle'+n);
        
        enemies = enemies.concat(ships);
        //console.log(enemies);
    }
    function unfight() {
        document.body.ontouchstart = undefined;
        fighting = false;
        soundManager.stopAll();
        soundManager.play('Travel');
    }
    function switchRing(num) {
        if(num<=9) {
            curRing = num;
            for(var i=0;i<window.enemies.length;i++) {
                window.enemies[i].maxHealth = window.enemies[i].baseHealth+((curRing-1)/(maxRings-1)*window.enemies[i].baseHealth);
                window.enemies[i].health = window.enemies[i].maxHealth;
                //this.maxHealth += ((curRing-1)/(maxRings-1));
            }
            //playerSpeedOrig = window.playerShip.spd;
            window.playerShip.spd += ((curRing-1)/(maxRings-1)*window.playerShip.spd)/2;
            document.title = "Ring "+curRing;
        } else if(num>9){
            window.curPlanet = magicPlanet;
            Ticker.setPaused(true);
            menuScreen();
        }
    }
    
    function travelTo(from, to) {
        var sh = 128;
        stage.mouseEnabled = false;
        /*if(window.playerShip) {
            var b = cloneBit(window.playerShip.bit);
        }*/
        window.enemies = [];
        stage.removeAllChildren();
        Ticker.setPaused(false);
        var dist = Math.sqrt(Math.pow(from.x-to.x, 2)+Math.pow(from.y-to.y, 2));
        //alert(dist);
        from.bit.x = canvas[0].width/2-from.img.width*from.bit.scaleX/2;
        from.bit.y = 0;
        from.bit.width = from.img.width*from.bit.scaleX;
        from.bit.height = from.img.height*from.bit.scaleY;
        //console.log(from.bit);
        stage.addChild(from.bit);
        
        to.bit.x = from.bit.x;
        to.bit.y = -ship2plan*sh*dist+to.img.height/2;
        to.bit.width = to.img.width*to.bit.scaleX;
        to.bit.height = to.img.height*to.bit.scaleY;
        stage.addChild(to.bit);
        //console.log(to.bit);
        //to.bit.y = 5*
        stage.update();
        window.from = from;
        window.to = to;
        soundManager.stopAll();
        soundManager.play('Travel');
        hideAll();
        //otherMenu.show();
        /*touchCons.show();
        touchCons.css("display", "inline-block");*/
        if('ontouchstart' in window) {
            touchCons.show();
            touchCons.css("display", "inline-block");
            //alert(touchCons[0].style.display);
        } else {
            //otherMenu.show();
        }
        canvas.show();
        canvas.attr("class", "space");
        $("body").attr("class", "space");
        //canvas.css("background-position", "0px 0px");
        canvas[0].style.backgroundPositionX = "0px";
        canvas[0].style.backgroundPositionY = "0px";
        console.log(canvas[0].style.backgroundPosition);
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
        //window.playerShip = window.playerShip||new PlayerShip(imgs.playerShip, canvas[0].width/2-shipW/2, canvas[0].height*0.75, shipW, shipW);
        if(window.playerShip) {
            window.playerShip = new PlayerShip(imgs.playerShip, canvas[0].width/2-shipW/2, canvas[0].height*0.75, shipW, shipW, window.playerShip.health, window.playerShip.maxHealth);
        } else {
            window.playerShip = new PlayerShip(imgs.playerShip, canvas[0].width/2-shipW/2, canvas[0].height*0.75, shipW, shipW);
        }
        //console.log(window.playerShip.bit);
        /*if(b) {
            window.playerShip.bit = b;
            stage.addChild(b);
        }*/
        //stage.addChild(window.playerShip.bit);
        stage.update();
        //alert(canvas.width()/2-shipW/2);
        fight([new EnemyShip(imgs.enemyShip, canvas[0].width/2-shipW/2, canvas[0].height*0.25-shipW, shipW, shipW)]);
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
        /*splash.fadeIn(3000, "linear", function() {
            splash.fadeOut(500, "linear", callback);
        });*/
        //splash.css("display", "block");
        splash.show();
        splash.css("opacity", "0");
        splash.animate({opacity: 1}, {duration: 3000, complete: function() {
            splash.animate({opacity: 0}, {duration: 500, complete: callback});
        }});
        window.scrollTo(0, 1);
    }
    
    window.init = function() {
        hideAll();
        $("#fly").click(function() {
            //travelTo(parseInt(prompt("How far away?"), 10));
            //travelTo(planets[0], planets[1]);
            mapScreen();
        });
        var fsString = "Do you want to go fullscreen? This is recommended.";
        /*if(document.body.webkitRequestFullScreen) {
            //alert("Durr");
            if(confirm(fsString)) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else if(document.body.mozRequestFullScreen) {
            if(confirm(fsString)) {
                document.documentElement.mozRequestFullScreen();
            }
        } else {
            alert("It is recommended that you go fullscreen. In most browsers, hit F11.");
        }
        document.querySelector("#fs").onclick = function() {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }*/
        if(document.body.webkitRequestFullScreen) {
            fsFunc = function() {
                document.documentElement.webkitRequestFullScreen();
            };
        } else if(document.body.mozRequestFullScreen) {
            fsFunc = function() {
                document.documentElement.mozRequestFullScreen();
            };
        } else if(document.body.requestFullScreen) {
            fsFunc = function() {
                document.documentElement.requestFullScreen();
            };
        }
        //console.log(fsFunc);
        if(document.body.webkitRequestFullScreen || document.body.mozRequestFullScreen || document.body.requestFullScreen) {
            document.getElementById("textFS").innerHTML = fsString;
            document.getElementById("enterFS").onclick = function() {
                //document.documentElement.webkitRequestFullScreen();
                //console.log(fsFunc);
                fsFunc();
                document.getElementById("textFS").innerHTML = "You can exit fullscreen at any time by hitting F11";
                $("#enterFS, #cancelFS").css("display", "none");
                setTimeout(function() {
                    $("#fsBar").animate({top: 0-$("#fsBar").height()}, {duration: 1000, complete: function() {
                        $("#fsBar").css("display", "none");
                        $("#fsBar").css("top", "0px");
                    }})
                }, 3000);
            };
            //document.getElementById("enterFS").onclick = document.documentElement.webkitRequestFullScreen;
        } else {
            document.getElementById("textFS").innerHTML = "Please enter fullscreen mode. In most browsers, this is done by pressing F11.";
            $("#enterFS, #cancelFS").css("display", "none");
            setTimeout(function() {
                $("#fsBar").animate({top: 0-$("#fsBar").height()}, {duration: 1000, complete: function() {
                    $("#fsBar").css("display", "none");
                    $("#fsBar").css("top", "0px");
                }})
            }, 3000);
        }
        
        soundManager.url="Scripts/SoundManager2/swf/soundmanager2.swf";
        soundManager.defaultOptions.autoLoad = true;
        soundManager.defaultOptions.autoPlay = false;
        soundManager.onready(function() {
            //console.log("SoundManager ready");
            soundManager.createSound({
                id: 'Travel',
                //url: './Sound/Music/Road Trip.mp3',
                url: "http://wrathgames.com/blog/wp-content/plugins/download-monitor/download.php?id=74",
                volume: 50,
                onfinish: function() {
                    //console.log(this);
                    this.play();
                }
            });
            var battleVol = 75;
            window.numBattleSongs = 2;
            soundManager.createSound({
                id: "Battle1",
                volume: battleVol,
                //url: "./Sound/Music/Rusty Boss-man Tussle.mp3",
                url: "http://wrathgames.com/blog/resources/music/35/run_128.mp3",
                onfinish: function() {
                    //console.log(this);
                    this.play()
                }
            });
            soundManager.createSound({
                id: "Battle2",
                volume: battleVol,
                //url: "./Sound/Music/Rusty Boss-man Tussle.mp3",
                url: "http://wrathgames.com/blog/resources/music/26/dragon_king_128.mp3",
                onfinish: function() {
                    //console.log(this);
                    this.play()
                }
            });
            
            soundManager.createSound({
                id: 'Bullet',
                url: './Sound/SFX/silencer.wav'
            });
            soundManager.createSound({
                id: "Explosion",
                url: "http://wrathgames.com/blog/resources/sound/1/explosion1.mp3",
            });
            /*soundManager.createSound({
                id: 'Levelup Sound',
                url: "./Sound/Music/copycat_levelup.wav",
                autoLoad: true
            });*/
            //soundManager.play('Battle');
            splashScreen(menuScreen);
        });
        soundManager.ontimeout(function(status) {
            console.log("SM2 Error", status);
            window.soundManager = {
                play: function() {},
                stopAll: function(){},
                getSoundById: function() {
                    return {muted: false};
                }
            };
            splashScreen(menuScreen);
        });
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
                /*var p = Ticker.getPaused();
                Ticker.setPaused(!p);
                if(p) {
                    window.enemTimeout = setTimeout(function() { fight([new EnemyShip(imgs.enemyShip, canvas[0].width/2-shipW/2, canvas[0].height*0.25-shipW, shipW, shipW)])}, 45000);
                    $("#pauseToggle img").attr("src", imgs.pause);
                } else {
                    clearTimeout(window.enemTimeout);
                    $("#pauseToggle img").attr("src", imgs.play);
                }*/
                pausePlay()
            });
        //splashScreen(menuScreen);
        //menuScreen();
        //travelTo(5000);
        //splashScreen(menuScreen);
    }
    /*if(!Modernizr.svg || three) {
        console.log(imgs, imgs.stars);
        canvas.css("background-image", "url("+imgs.stars+")");
    }*/
    soundManager.debugMode = false;
    //soundManager.useHighPerformance = true;
    hideAll();
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
    if('ontouchstart' in window) {
        setInterval(updateLayout, 250);
    }
    //socketStart();
};