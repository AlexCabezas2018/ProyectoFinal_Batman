// Adrián Camacho Pérez

window.addEventListener("load",function() {
  var Q = window.Q = Quintus({ development: true, audioSupported: ["mp3", "ogg"] }) 
          .include("Sprites, Scenes, Input, Touch, UI, TMX, Anim, Audio, 2D")
          .setup({ width: 480, height: 372}) 
          .controls().touch()
          Q.enableSound();
  Q.PLAYER = 1;
  Q.COIN = 2;
  Q.ENEMY = 4;
  var time = 0;



    /*************************** BATMAN SPRITE ***************************************/
    Q.animations('batman_anims', {
      static_left: { frames: [3, 2, 1], rate: 1/8, flip: "x", loop: false },
      static_right: { frames: [3, 2, 1], rate: 1/8, flip: false, loop: false },
      running_left: { frames: [0, 1, 2, 3, 4, 5], rate: 1/10, flip: "x" } ,
      running_right: { frames: [0, 1, 2, 3, 4, 5], rate: 1/10, flip: false },

      jump_left: { frames: [0, 1, 2, 3, 4], rate: 1/15, flip: "x" },
      jump_right: { frames: [0, 1, 2, 3, 4], rate: 1/15, flip: false },
      crouch_left: { frames: [0], rate: 1/15, flip: "x" },
      crouch_right: { frames: [0], rate: 1/15, flip: false },
      die: { frames: [0, 1, 2, 3, 4, 5], rate: 1/15 },
      hitted_crouched_right: { frames: [0, 1], rate: 1/15, flip: false },
      hitted_crounched_left: { frames: [0, 1], rate: 1/15, flip: "x" },
      hitted_running_right: { frames: [0, 1, 2, 3, 4], rate: 1/15, flip: false },
      hitted_running_left: { frames: [0, 1, 2, 3, 4], rate: 1/15, flip: "x" },
      punch_crouched_left: { frames: [0, 1, 2, 3], rate: 1/15, flip: "x" },
      punch_crouched_right: { frames: [0, 1, 2, 3], rate: 1/15, flip: false },
      punch_jumping_left: { frames: [0, 1, 2, 3], rate: 1/15, flip: "x" },
      punch_jumping_right: { frames: [0, 1, 2, 3], rate: 1/15, flip: false },
      punch_left: { frames: [0, 1, 2, 3], rate: 1/15, flip: "x" },
      punch_right: { frames: [0, 1, 2, 3], rate: 1/15, flip: false },
      bounce_left: { frames: [0, 1, 2], rate: 1/15, flip: false },
      bounce_right: { frames: [0, 1, 2], rate: 1/15, flip: "x" }

      //TO DO: Faltan las animaciones relacionadas con el boomerang, etc
  });

  Q.Sprite.extend("Batman", {
      init: function(p) {
          this._super(p, {
              /*Coordendas, propiedades básicas*/
              sprite: "batman_anims",
              sheet: "batmanStatic",
              x: 0,
              y: 0,
              scale: 2, //Aquí se ajusta el tamaño.
              staticAnim: true,
              gravity: 1,
              type: Q.PLAYER,
              isJumping: false,
              isCrouching: false,
              prevDir: "right"
          });
          this.add('2d, platformerControls, animation');
          //Implementar las colisiones y los disparos.
      } ,

      step: function(dt) {
          /* Movimientos en aire */ 
          if(Q.inputs["up"] && !this.p.isCrouching && !this.p.isJumping){
            this.p.gravity = 0.2;
            this.p.staticAnim = true;
            this.p.isJumping = true;
          }

          if(!Q.inputs["up"]) {
            this.p.gravity = 1;
            this.p.isJumping = false;
          }

          /* Movimientos en tierra */

          if(Q.inputs["down"] && !this.p.isJumping){
            this.p.sheet = "crouch";
            this.play("crouch_" + this.p.direction);
            this.p.staticAnim = true;
            this.p.isCrouching = true;
            if(this.has('platformerControls')){ //Desactivamos el componente para que no pueda moverse mientras está agachado
              this.del('platformerControls');
              this.p.vx = 0;
              this.p.prevDir = this.p.direction;
            }
          }
          else {
            this.p.isCrouching = false;
            if(!this.has('platformerControls')) { //Para que se mueva
              this.add('platformerControls');
              this.p.direction = this.p.prevDir;
            }          
          }

          /* Movimientos básicos (correr) */
          if(!this.p.isJumping && !this.p.isCrouching){
            if(this.p.vx == 0 && this.p.staticAnim) {
              this.p.sheet = "batmanStatic";
              this.play("static_" + this.p.direction);
              this.p.staticAnim = false;
            }
            else if(this.p.vx > 0) {
                this.p.sheet = "batmanRunning"
                this.play('running_right');
                this.p.anim = true;
                this.p.staticAnim = true;
            }
            else if(this.p.vx < 0) {
                this.p.sheet = "batmanRunning"
                this.play('running_left');
                this.p.staticAnim = true;
            }
        }
      },

  });



  /******************************************************************************/

    /* Mario */
    Q.Sprite.extend("Player",{
        init: function(p){
      	    this._super(p, {
            sheet: "mario",
            sprite: "mario",
            jumpSpeed: -400,
            x: 150,
            y: 500,
            die: false,
            type: Q.PLAYER,
            collisionMask: Q.SPRITE_DEFAULT | Q.COIN,
            win: false,
            score: 0
            
          });
        this.add('2d, platformerControls, animation'); 
        this.on("bump.top","bumpTop"); 
        this.on("enemy.hit","enemyHit");
        this.on("win","marioWin"); 
        },

        bumpTop: function(col) {
          if(col.obj.isA("TileLayer")) {
            if(col.tile == 24) { col.obj.setTile(col.tileX,col.tileY, 36); }
            else if(col.tile == 36) { col.obj.setTile(col.tileX,col.tileY, 24); }
          }
        },

        marioDies: function () {
        	Q.stageScene("endGame",1, { label: "You lose!!" }); 
          this.destroy();
        },

        marioWin: function(){
        	this.p.win = true;
        	Q.stageScene("endGame",1, { label: "You Win!!" });
        },

        marioDiesAnim: function(){
      	  this.p.collisionMask = Q.SPRITE_NONE; //atraviesa el suelo
          this.p.vy = 450;
          this.p.vx = 0;
        },

        marioWinsAnim: function(){
          this.p.collisionMask = Q.SPRITE_NONE; 
          this.play('jump_right');
          this.p.vx = 15;
          this.p.vy = -35; //avanza en diagonal a darle un beso
        },

        enemyHit: function() {
        	if(!this.p.win){
        		this.play("die");
          	this.p.die = true;
        	}
        },

        step: function(dt) {
          var stop = false;

          if(this.p.die || this.p.win)
          	stop = true;

          if(!stop) { 
            this.p.gravity = 1;

              if(this.p.vx < 0) {
                if(this.p.landed > 0){this.play("run_left");} 
                else {this.play("jump_left");}
                this.p.direction = "left";
              } 
              else if(this.p.vx > 0) {
                if(this.p.landed > 0) {this.play("run_right");} 
                else {this.play("jump_right");}
                this.p.direction = "right";
              } 
              else {
                this.play("stand_" + this.p.direction);
              }
                 
            
          }

          if(this.p.y > 700) {
            this.stage.unfollow(); 
          }

          if(this.p.y > 950) {
          	this.marioDies();
          }

          if(this.p.win){
            this.marioWinsAnim();
          }

          if(this.p.die){
          	this.marioDiesAnim();
          }
        }
      });


    /*Base enemy*/
    Q.component('defaultEnemy', {

        added: function() {
        this.entity.add("2d, aiBounce, animation");
    	  this.entity.on("bump.top",this,"die");
    	  this.entity.on("bump.left", this, "killPlayer");
    	  this.entity.on("bump.right", this, "killPlayer");
    	  this.entity.on("hit.sprite",this,"killPlayer");
        },

        die: function(col) {
         if(col.obj.isA("Player")) {
          this.entity.play('dead');
          this.entity.p.dead = true;
          col.obj.p.vy = -300;
          this.entity.p.deadTimer = 0;
         }
      	},

      	killPlayer: function(col){
      		if(col.obj.isA("Player") && !this.entity.p.dead) {
          		col.obj.trigger('enemy.hit');
        	}
        }
       
      });

    /*Goomba*/
    Q.Sprite.extend("Goomba",{
        init: function(p) {
          this._super(p, { sheet: 'goomba'});
          this.add('defaultEnemy');
          this.play('walk');
        },

        step: function(dt) {
          if(this.p.dead) {
            this.del('2d, aiBounce');
            this.p.deadTimer++;
            if (this.p.deadTimer > 20) {          
              this.destroy();
            }
            return;
          }
          var p = this.p;

          p.vx += p.ax * dt;
          p.vy += p.ay * dt;

          p.x += p.vx * dt;
          p.y += p.vy * dt;

          this.play('walk');
        }

    });


    /*Bloopa*/
    Q.Sprite.extend("Bloopa",{
      init: function(p) {
        this._super(p, { sheet: 'bloopa', vy: -140, rangeY: 90,
          gravity: 0, jumpSpeed: -230});
        this.p.initialY = this.p.y;
        this.add('defaultEnemy');
        this.play('jump');

      },

      step: function(dt) {
        if(this.p.dead) {
          this.del('2d, aiBounce');
          this.p.deadTimer++;
          if (this.p.deadTimer > 6) { //menos tiempo porque si no puedes saltar 2 veces sobre el cadaver
            this.destroy();
          }
            return;
          }
          this.p.vx = 0;
          if(this.p.vy == 0){
            this.p.vy = -150;
          }
          if(this.p.y >= this.p.initialY) {   
            this.p.y = this.p.initialY;
            this.p.vy = -this.p.vy;
          } 
          else if(this.p.y + this.p.rangeY < this.p.initialY) { 
            this.p.y = this.p.initialY - this.p.rangeY;
            this.p.vy = -this.p.vy;
          }
        }
    });


    /*Meta barra-princesa*/
    Q.Sprite.extend("Goal", {
      init: function(p,defaults) {
    	    this._super(p,Q._defaults(defaults||{},{
    	      collisionMask: Q.SPRITE_ALL,
    	      win: false
    	    }));

    	    this.add("2d");
    	    this.on("bump.top",this,"MarioWins");
    	    this.on("bump.left","MarioWins");
    	    this.on("bump.right","MarioWins");
    	    this.on("bump.bottom","MarioWins");
      	},
      MarioWins: function(col){
    	if(col.obj.isA("Player") && !this.p.win) {
          col.obj.trigger('win');
          this.p.win = true;
          this.p.collisionMask = Q.SPRITE_NONE;
        }
      },
    });
     /*****************************************************************Objetos Stage 2*************************************************************************************/
     Q.animations("cintainferior",{
      cintainferior: { frames: [0, 1, 2,3], rate: 1/8, flip: false, loop: true }
     });
    Q.Sprite.extend("cintainferior",{
      init: function(p) {
        this._super(p, { sheet: "cintainferior",sprite:"cintainferior"});
        this.add("animation");
        this.play("cintainferior");
      },
      step: function(dt) {} });

     Q.animations("cintaSup",{
      cintaSup: { frames: [0, 1, 2,3], rate: 1/8, flip: false, loop: true }
     });
    Q.Sprite.extend("cintaSup",{
      init: function(p) {
        this._super(p, { sheet: "cintaSup",sprite:"cintaSup"});
        this.add("animation");
        this.play("cintaSup");
      },
      step: function(dt) {} });
    
    Q.animations("barraElect",{
      barraElect: { frames: [0, 1, 2,3], rate: 1/8, flip: false, loop: true }
     });
    Q.Sprite.extend("barraElect",{
      init: function(p) {
        this._super(p, { sheet: 'barraElect',sprite:"barraElect"});
        this.add("animation");
        this.play("barraElect");
      },
      step: function(dt) {} });
    
    Q.animations("ia",{
      ia: { frames: [0, 1, 2,3], rate: 1/20, flip: false, loop: true }
     });
  Q.Sprite.extend("ia",{
      init: function(p) {
        this._super(p, { sheet: 'ia', sprite:"ia"});
        this.add("animation");
        this.play("ia");
      },
      step: function(dt) {} });
   Q.animations("ia2",{
      ia2: { frames: [0, 1, 2,3], rate: 1/15, flip: false, loop: true }
     });
    Q.Sprite.extend("ia2",{
      init: function(p) {
         this._super(p, { sheet: 'ia2', sprite:"ia2"});
        this.add("animation");
        this.play("ia2");
      },
      step: function(dt) {} });

    Q.animations("cuchillas",{
      cuchillas: { frames: [0, 1, 2,3], rate: 1/10, flip: false, loop: true }
     });
    Q.Sprite.extend("cuchillas",{
      init: function(p) {
          this._super(p, { sheet: 'cuchillas', sprite:"cuchillas"});
        this.add("animation");
        this.play("cuchillas");
      },
      step: function(dt) {} });

     Q.animations("cuchillas2",{
      cuchillas2: { frames: [0, 1, 2,3], rate: 1/10, flip: false, loop: true }
     });
    Q.Sprite.extend("cuchillas2",{
      init: function(p) {
        this._super(p, { sheet: 'cuchillas2', sprite:"cuchillas2"});
        this.add("animation");
        this.play("cuchillas2");
      },
      step: function(dt) {} });

     Q.animations("cuchillas3",{
      cuchillas3: { frames: [0, 1, 2,3], rate: 1/10, flip: false, loop: true }
     });
    Q.Sprite.extend("cuchillas3",{
      init: function(p) {
        this._super(p, { sheet: 'cuchillas3', sprite:"cuchillas3"});
        this.add("animation");
        this.play("cuchillas3");
      },
      step: function(dt) {} });

     Q.animations("acc1",{
      acc1: { frames: [0, 1, 2,3], rate: 1/10, flip: false, loop: true }
     });
    Q.Sprite.extend("acc1",{
      init: function(p) {
        this._super(p, { sheet: 'acc1', sprite:"acc1"});
        this.add("animation");
        this.play("acc1");
      },

      step: function(dt) {} });


    /*******************************************************************************************************************************************************************/


    /*Collision floor*/
    Q.Sprite.extend("Tile", {
      init: function(p,defaults) {
    	    this._super(p,Q._defaults(defaults||{},{
    	      type: Q.SPRITE_ALL,
    	      collisionMask: Q.SPRITE_ALL
    	    }));

    	    this.add("2d");
      	}
    });


    /*Coins*/
    Q.Sprite.extend("Collectable", {
      init: function(p) {
        this._super(p,{
          sheet: 'coin',
          type: Q.COIN,
          collisionMask: Q.PLAYER,
          vx: 0,
          vy: 0,
          gravity: 0,
          picked: false,
          sensor: true
        });
        this.add("animation");
        this.add('tween');
    	  this.play("shiny");
        this.on("sensor");
      },

      sensor: function(colObj) {
        if (this.p.amount && this.p.picked == false) {
          colObj.p.score += this.p.amount;
          Q.stageScene('hud', 3, colObj.p);
        }
        
        this.p.picked = true;
      },
    
      step: function(dt){
        if(this.p.picked == true){
          this.p.y = this.p.y-20;
        }
        if(this.p.y < 0) {
          this.destroy();
        }
      }

    });

    Q.scene('hud',function(stage) {
      var container = stage.insert(new Q.UI.Container({
        x: 50, y: 0
      }));

      var label = container.insert(new Q.UI.Text({x:20, y: 20,
        label: " ", color: "white" }));
      container.fit(20);
    });


    Q.scene('mainMenu',function(stage) {
      var background = stage.insert(new Q.UI.Button({
          asset: 'mainTitle.png',
          x: Q.width/2,
          y: Q.height/2
      }));
      
      var button = stage.insert(new Q.UI.Button({ x: Q.width/2 + Q.width/6, y: Q.height/2 - Q.height/7, fill: "#33088F", label: "Stage 1", color: "#33088F" }))
      background.on("click",function() {
        Q.clearStages();
        Q.stageScene('level1');
        Q.stageScene('hud', 3, Q('Batman').first().p);
      });

      var button2 = stage.insert(new Q.UI.Button({ x: 30, y: 30, fill: "#33088F", label: "Stage 2", color: "#33088F" }))
      button2.on("click",function() { 
        Q.clearStages();
        Q.stageScene('level2');
        Q.stageScene('hud', 3, Q('Batman').first().p);
      });

      var button = stage.insert(new Q.UI.Button({ x: Q.width/2 + Q.width/6, y: Q.height/2 + Q.height/7, fill: "#33088F", label: "Stage 3", color: "#33088F" }))
      background.on("click",function() {
        Q.clearStages();
        Q.stageScene('level3');
        Q.stageScene('hud', 3, Q('Batman').first().p);
      });
    });


   Q.loadTMX("music_joker.mp3, level3.tmx, joker.png, joker.json,level.tmx,level2.tmx, mario_small.json, mario_small.png, goomba.json, goomba.png," +  
    "bloopa.json, bloopa.png,acc1.png,acc1.json,cuchillas.png, cuchillas.json,cuchillas2.png,cuchillas2.json,cuchillas3.png,cuchillas3.json,cintaSup.png,cintaSup.json,ia.png,ia.json,ia2.png,ia.json,barraElect.png,barraElect.json," +  
    "cintainferior.png, cintainferior.json, princess.png, mainTitle.png, tiles.json, tiles.png," +  
    "coin.json, coin.png, batman.png, batman.json", function() {
        Q.compileSheets("mario_small.png","mario_small.json");
        Q.compileSheets("goomba.png","goomba.json");
        Q.compileSheets("bloopa.png","bloopa.json");
        Q.compileSheets("tiles.png","tiles.json");
        Q.compileSheets("batman.png", "batman.json")
        Q.compileSheets("coin.png","coin.json");
         Q.compileSheets("cintainferior.png","cintainferior.json");
        Q.compileSheets("cintaSup.png","cintaSup.json");
        Q.compileSheets("barraElect.png","barraElect.json");
        Q.compileSheets("ia.png","ia.json");
        Q.compileSheets("ia2.png","ia2.json");
         Q.compileSheets("cuchillas.png","cuchillas.json");
        Q.compileSheets("cuchillas2.png","cuchillas2.json");
        Q.compileSheets("cuchillas3.png","cuchillas3.json");
        Q.compileSheets("acc1.png","acc1.json");
        Q.sheet("Joker","joker.png");
        Q.compileSheets("joker.png","joker.json");
        /* no animations
        Q.sheet("mario_small","mario_small.png", { tilew: 32, tileh: 32 });
        Q.sheet("goomba","goomba.png", { tilew: 32, tileh: 32 });
        Q.sheet("bloopa","bloopa.png", { tilew: 32, tileh: 32 });
        Q.sheet("princess","princess.png", { tilew: 32, tileh: 32 });
        */

        Q.animations("mario", {
          run_right: { frames: [1,2], rate: 1/5, flip: false, loop: true },
          run_left: { frames:  [1,2], rate: 1/5, flip: "x", loop: true },
          stand_right: { frames:[0], rate: 1/5, flip: false },
          stand_left: { frames: [0], rate: 1/5, flip: "x" }, 
          jump_right: { frames: [4], rate: 1/5, flip: false },
          jump_left: { frames:  [4], rate: 1/5, flip: "x" },
          die: { frames:  [12], rate: 1/5, flip: false, loop: true }
          });

        Q.animations("coin", {
          shiny: { frames: [0,1,2], rate: 1/5, flip: 'x', loop: true }
          });


        var EnemyAnimations = {
            walk: { frames: [0,1], rate: 1/3, loop: true },
            dead: { frames: [2], rate: 1/10 }
        };

        Q.animations("goomba", EnemyAnimations);
        Q.animations("bloopa", {
          jump: { frames: [0,1], rate: 1/2, loop: true },
          dead: { frames: [2], rate: 1/8 }
        });
        
        Q.stageScene("mainMenu");
    });

    Q.scene("level1",function(stage) {
      Q.stageTMX("level.tmx",stage);
      Mario = stage.insert(new Q.Batman({x: 30,y: 30}));
      stage.add("viewport").follow(Mario);
      stage.viewport.offsetX = -Q.width*30/100;
      stage.viewport.offsetY = Q.height*33/100;
      
      //stage.insert(new Q.Goomba({ x: 300, y: 380 }));
      //stage.insert(new Q.Bloopa({ x: 350, y: 525 }));
      //stage.insert(new Q.Bloopa({ x: 370, y: 525 }));
      //stage.insert(new Q.Bloopa({ x: 320, y: 525 }));
  
     // stage.insert(new Q.Princess({ x: 80, y: 500 }));
    //stage.centerOn(150, 380);
    });

     Q.scene("level2",function(stage) {
      Q.stageTMX("level2.tmx",stage);
      Mario = stage.insert(new Q.Batman({x: 30,y: 30}));
      stage.add("viewport");
      stage.viewport.offsetX = -Q.width*30/100;
      stage.viewport.offsetY = Q.height*33/100;
     
    });

    Q.scene('endGame',function(stage) {
      var box = stage.insert(new Q.UI.Container({
        x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
      }));
      
      var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                               label: "Play Again" }))         
      var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                            label: stage.options.label }));
      button.on("click",function() {
        Q.clearStages();
        Q.stageScene('mainMenu');
      });
      box.fit(20);
    });

    /*********************STAGE 3**************************** */

    Q.animations('Joker-animations', {
      thunder_R:{frames:[0,1], rate: 1/3, flip:"x"},
      thunder_L:{frames:[0,1], rate: 1/3},
      fight_R:{ frames:[2,3,4,5,6], rate: 1/3, flip:"x"},
      fight_L: { frames: [2,3,4,5,6], rate: 1/3},
      rayos:{ frames: [0,1,2], rate:1/3, loop:true},
      run_L:{ frames: [1,2,3,4,5,6], rate:1/3},//JOKERRUNNING
      run_R:{ frames: [1,2,3,4,5,6], rate:1/3, flip:"x"},//JOKERRUNNING
      die_L:{ frames:[0,1,2,3,4,5], rate:1},//JokerDie
      die_R:{ frames:[0,1,2,3,4,5], rate:1, flip:"x"},//JokerDie
      stand_R:{ frames: [2], rate: 1/3, flip:"x"},
      stand_L:{ frames: [2], rate: 1/3},
      boomerang_R:{frames:[0,1,2,3,4], rate:1/3, flip:"x"},
      boomerang_L:{frames:[0,1,2,3,4], rate:1/3},
      shot_L:{frames:[0,1,2,3], rate:1/8, loop: true},
      shot_R:{frames:[0,1,2,3], rate:1/8, flip:"x", loop: true}
    });

    Q.Sprite.extend("JokerBalas", { 
      init: function(p) {
         this._super(p, {
           vx: -10,
           sheet: 'JokerBalas',
           sprite: 'Joker-animations',
           frame: 0,
           x:250, 
           y:490,
           gravity: 0,
           });
           this.p.initialY = this.p.y;
           this.add('2d, aiBounce, animation');
           this.play("shot_L");
       },

       step: function(dt){}
      });

    Q.Sprite.extend("JokerBoomerang", { 
      init: function(p) {
         this._super(p, {
           vx: -10, 
           sheet: 'JokerBoomerang',
           sprite: 'Joker-animations',
           frame: 0,
           x:250, 
           y:490,
           gravity: 0,
           });
           this.add('2d, aiBounce, animation');
           this.play("boomerang_L");
       },
       step: function(dt){}
      });
     
      Q.Sprite.extend("JokerRunning", { 
        init: function(p) {
           this._super(p, {
             vx: 100, 
             sheet: 'JokerRunning',
             sprite: 'Joker-animations',
             frame: 0,
             x:400, 
             y:550,
             gravity: 0,
             });
             this.add('2d, aiBounce, animation');
             this.play("run_L");
         },
         step: function(dt){}
        });  

    Q.Sprite.extend("JokerRayos", {  
      init: function(p) {
         this._super(p, {
           vx: 0, 
           sheet: 'JokerRayos',
           sprite: 'Joker-animations',
           vy:-10,
           rangeY:90,
           gravity: 0,
           //ax: 0,
           ay:150,
           });
           this.p.initialY = this.p.y;
           this.add('2d, aiBounce, animation');
           this.play("rayos");
       },
       step: function(dt){
         if(this.p.y >= 465){
           this.destroy();
         }
      }
      });

    Q.Sprite.extend("Joker", {
      init: function(p) {
         this._super(p, {
           sheet: 'Joker',
           sprite: 'Joker-animations',
           x:0, 
           y:0,
           });
           this.add('2d, aiBounce, animation');
           this.play("stand_L");
       },
       
       step: function(dt){
        time += dt;
        if(time >= 0.05) {
          this.destroy();
        }
       },

      });
    /*Mejorar las dimensiones de sheet*/

    Q.scene("level3",function(stage) {
      Q.stageTMX("level3.tmx",stage);
      Batman = stage.insert(new Q.Batman({x: 80,y: 30}));
      stage.add("viewport").follow(Batman,{x:false, y:false});
      stage.centerOn(250,400);
      stage.unfollow(); 
      stage.insert(new Q.Joker({x:400, y:550}));
      stage.insert(new Q.JokerRunning());
      //para probar los rayos
      //stage.insert(new Q.JokerRayos({x:270, y:10}));
      //stage.insert(new Q.JokerRayos({x:130, y:10}));
      //stage.insert(new Q.JokerRayos({x:200, y:10}));
      //stage.insert(new Q.JokerBoomerang());
      //stage.insert(new Q.JokerBalas());
      //musica del nivel de joker
     Q.audio.play("music_joker.mp3", {loop: true});
    });
    /*************fin del level3*********** */
});
