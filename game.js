// Adrián Camacho Pérez

window.addEventListener("load",function() {
  var Q = window.Q = Quintus({ development: true, audioSupported: ["mp3", "ogg"] }) 
          .include("Sprites, Scenes, Input, Touch, UI, TMX, Anim, Audio, 2D")
          .setup({ width: 544, height: 544}) 
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
      punch_left: { frames: [0, 1, 2, 3], rate: 1/13, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      punch_right: { frames: [0, 1, 2, 3], rate: 1/13, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      punch_crouched_left: { frames: [0, 1, 2, 3], rate: 1/15, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      punch_crouched_right: { frames: [0, 1, 2, 3], rate: 1/15, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      punch_jumping_left: { frames: [0, 1, 2, 3], rate: 1/10, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      punch_jumping_right: { frames: [0, 1, 2, 3], rate: 1/10, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      crouch_left: { frames: [0], rate: 1/15, flip: "x" },
      crouch_right: { frames: [0], rate: 1/15, flip: false },
      jump_left: { frames: [0, 1, 2, 3, 4], rate: 1/15, flip: "x", loop: false },
      jump_right: { frames: [0, 1, 2, 3, 4], rate: 1/15, flip: false, loop: false },
      die_right: { frames: [0, 1, 2, 3, 4, 5], rate: 1/7, loop: false },
      die_left: { frames: [0, 1, 2, 3, 4, 5], rate: 1/7, loop: false, flip: "x" },

      hitted_crouched_right: { frames: [0, 1, 0, 1, 0, 1, 0, 1], rate: 1/9, flip: false, loop: false, trigger: 'allowToTakeDamageTrigger' },
      hitted_crouched_left: { frames: [0, 1, 0, 1, 0, 1, 0, 1], rate: 1/9, flip: "x", loop: false, trigger: 'allowToTakeDamageTrigger' },
      hitted_running_right: { frames: [0, 1, 0, 1, 0, 1, 0, 1], rate: 1/9, flip: false, loop: false, trigger: 'allowToTakeDamageTrigger' },
      hitted_running_left: { frames: [0, 1, 0, 1, 0, 1, 0, 1], rate: 1/9, flip: "x", loop: false, trigger: 'allowToTakeDamageTrigger' },


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
              health: 8,
              canTakeDamage: true,
              staticAnim: true,
              gravity: 1,
              type: Q.PLAYER,
              jumpSpeed: -600,
              isJumping: false,
              isCrouching: false,
              isPunching: false,
              died: false

          });
          this.add('2d, platformerControls, animation');
          Q.input.on("fire", this, "punch");
          this.on("punchFinishedTrigger");
          this.on("allowToTakeDamageTrigger")
          this.on("bump.right, bump.left", "hit"); //TODO, esto no debería ser así, solo debería interactuar de esta forma con los enemigos

          //Implementar las colisiones y los disparos.
      } ,

      /**
       * Esta funcion es llamada en cada frame del juego. Comprueba su estado 
       * y ejecuta las animaciones básicas. 
       */
      step: function(dt) {
          /* Movimientos en aire */
          if(!this.p.isJumping && Q.inputs["up"] && this.p.canTakeDamage) {
            if(this.p.vy == 0) this.p.isJumping = false;
            else this.jump();
          }
          else {
            if(this.p.vy == 0) this.p.isJumping = false;
          }
          
          if(!this.p.died && Q.inputs["down"] && this.p.canTakeDamage){
            if(!Q.inputs["left"] && !Q.inputs["right"]) this.crouch();
            else this.p.isCrouching = false;
          }
          else this.p.isCrouching = false;

          /* Movimientos en tierra */
          if(!this.p.died && this.p.isPunching && !this.p.isJumping || !this.p.canTakeDamage) this.p.vx = 0; //Esto hace la animacion de golpeo más acorde con la animación original.


          /* Movimientos básicos (quedarse estátco) */
          if(!this.p.died && !this.p.isJumping && !this.p.isCrouching && !this.p.isPunching 
                                    && this.p.vy == 0 && this.p.canTakeDamage) {
            if(this.p.vx == 0 && this.p.staticAnim) {
              this.p.sheet = "batmanStatic";
              this.play("static_" + this.p.direction);
              this.p.staticAnim = false;
            }

          }

          /* Movimientos básicos (Movimiento de correr) */
          if(!this.p.died && this.p.vx != 0 && !this.p.isPunching && !this.p.isJumping && this.p.canTakeDamage){
            this.p.sheet = "batmanRunning";
            this.p.staticAnim = true;
            this.play('running_' + this.p.direction);
          }
      },

      /**
       * Esta funcion es llamada cuando batman salta. Ejecuta la animacion.
       */
      jump: function() {
        this.p.staticAnim = true;
        console.log("jumping");

        if(!this.p.isJumping) {
          this.p.sheet = "batmanJump";
          this.p.isJumping = true;
          this.play('jump_' + this.p.direction, 1);
        }
      },


      /**
       * Es function se llama cuando batman se agacha. Comprueba si es posible agacharse y 
       * si es asi, ejecuta la animacion
       */
      crouch: function() {
        console.log("crouched")
        if(!this.p.isJumping && this.p.vy == 0 && !this.p.isPunching && this.p.canTakeDamage){
          this.p.sheet = "crouch";
          this.play("crouch_" + this.p.direction);
          this.p.staticAnim = true;
          this.p.isCrouching = true; //Desactivamos el componente para que no pueda moverse mientras está agachado
        }
      },
      

      /**
       * Esta funcion se llama cuando es presionada la tecla de golpear. Comprueba es que estado está y ejecuta la animacion
       * correspondiente
       **/
      punch: function() {
        console.log("punching")

          if(this.p.canTakeDamage) {
            this.p.isPunching = true;
            if(this.p.isCrouching) {
              //Animaciones cuando batman da puñetazos agachado
              this.p.vx = 0;
              this.p.sheet = "batmanPunchCrouched";
              this.play("punch_crouched_" + this.p.direction, 1);

            }
            else if(this.p.isJumping){
              //Animaciones cuando batman da puñetazos saltando
              this.p.sheet = "batmanPunchJumping";
              this.play("punch_jumping_" + this.p.direction, 1);
            }
            else {
              //Animaciones cuando batman da puñetazos de pie
              this.p.vx = 0;
              this.p.sheet = "batmanPunch";
              this.play("punch_" + this.p.direction, 1);
            }
        }
      },


      /**
       * Esta función es llamada cuando es golpeado. Se calcula si ha muerto o si se ha hitteado.
       * Despues se analiza su estado y se ejecuta la animación correspondiente.
       */
      hit: function() {
        console.log(this);
        if(this.p.canTakeDamage) {
          this.p.health--;
          this.p.canTakeDamage = false; //Para que no quite mucha vida de golpe, dejamos que termine la animacion para permitir recibir más daño
          if(this.p.health == 0) {
            this.stage.unfollow(); //Ya que vamos a retocar la posicion y eso puede afectar a la camara.
            this.p.died = true;
            this.p.y -= 43; //Retocamos la posición porque el sprite es muy largo y no aparecería en el lugar adecuado.
            this.p.sheet = "batmanDie";
            this.p.vx = 0;
            this.play('die_' + this.p.direction);
            this.del('2d'); //Eliminamos ese componente para que batman no responda a controles ni a fisicas.1
          }
          else {
            if(this.p.isCrouching) {
              //Animacion de hit cuando está agachado
              this.p.sheet = "batmanHittedCrouched";
              this.play("hitted_crouched_" + this.p.direction, 1);
            }
            else {
              //Animacion de hit cuando está de pié y saltando
              if(!this.p.isJumping) {
                this.p.vy = -240;
              }

              this.p.sheet = "batmanHittedRunning";
              this.play("hitted_running_" + this.p.direction, 1);
            }
          }
        }
      },

      /**
       * Esta funcion es llamada cuando ha terminado de golpear. Se actualiza el estado.
       */
      punchFinishedTrigger: function() {
        this.p.isPunching = false;
        this.p.staticAnim = true;
      },

      /* Esta funcion es llamada cuando ha terminado la animacion de recibir daño */
      allowToTakeDamageTrigger: function() {
        this.p.canTakeDamage = true;
        this.p.staticAnim = true;
      }
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

      Q.component('defCuch', {

        added: function() {
      this.entity.add("animation,2d,aiBounce");
        this.entity.on("bump.top",this,"MarioWins");
      this.entity.on("bump.left",this,"MarioWins");
      this.entity.on("bump.right",this,"MarioWins");
      this.entity.on("bump.bottom",this,"MarioWins");
        },

        MarioWins: function(col){
      if(col.obj.isA("Batman")) {
        Q.stageScene("mainMenu");
    }
      }
       
      });

     Q.animations("cintainferior",{
      cintainferior: { frames: [0, 1, 2,3], rate: 1/8, flip: false, loop: true }
     });
    Q.Sprite.extend("cintainferior",{
      init: function(p) {
        this._super(p, { sheet: "cintainferior",sprite:"cintainferior",gravity:0});
        this.add("animation,2d,aiBounce");
        this.on("bump.top",this,"MarioWins");
        this.play("cintainferior");
      },
        MarioWins: function(col){
      if(col.obj.isA("Batman")) {
          col.obj.p.x--;
        }
      },
      step: function(dt) {} });
    
    Q.animations("barraElect",{
      barraElect: { frames: [0, 1, 2,3], rate: 1/8, flip: false, loop: true }
     });
    Q.Sprite.extend("barraElect",{
      init: function(p) {
        this._super(p, { sheet: 'barraElect',sprite:"barraElect",gravity:0});
        this.add("defCuch");
        this.play("barraElect");
      },
      step: function(dt) {} });

     Q.Sprite.extend("shot",{
      init: function(p) {
        this._super(p, { sheet: 'shot',gravity:0.5,x:252,y:114, cont:0});
        this.add("2d,aiBounce");
        this.on("bump.top",this,"MarioWins");
      this.on("bump.left",this,"MarioWins");
      this.on("bump.right",this,"MarioWins");
      this.on("bump.bottom",this,"MarioWins");
      },
        MarioWins: function(col){
      if(col.obj.isA("Batman")) {
          Q.stageScene("mainMenu");
        }
        this.destroy();
        
      },
      step: function(dt) {
            if( this.p.cont===40)
            {
              this.shoot();
              this.p.cont=0;
            }
            else{
              this.p.cont++;
            }
              },
      shoot: function() {
                    var p = this.p;
                    if(p.x <=185)
                    {
                      this.stage.insert(new Q.shot({
                        x: 287,
                        y: 114,
                    }));
                    }
                    else{
                      this.stage.insert(new Q.shot({
                        x: p.x -34,
                        y: 114,
                    }));
                    }
                    
                } });
    
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

    Q.animations("cintaSup",{
      cintaSup: { frames: [0, 1, 2,3], rate: 1/8, flip: false, loop: true }
     });
    Q.Sprite.extend("cintaSup",{
      init: function(p) {
        this._super(p, { sheet: "cintaSup",sprite:"cintaSup",gravity:0});
        this.add("animation,2d,aiBounce");
        this.on("bump.top",this,"MarioWins");
        this.play("cintaSup");
      },
      MarioWins: function(col){
      if(col.obj.isA("Batman")) {
         col.obj.p.x++;
        }
      },
      step: function(dt) {} });

    Q.Sprite.extend("cuchillas",{
      init: function(p) {
          this._super(p, { sheet: 'cuchillas', sprite:"cuchillas",gravity:0});
        this.add("defCuch");
        this.play("cuchillas");
      },
      step: function(dt) {} });

     Q.animations("cuchillas2",{
      cuchillas2: { frames: [0, 1, 2,3], rate: 1/10, flip: false, loop: true }
     });
    Q.Sprite.extend("cuchillas2",{
      init: function(p) {
        this._super(p, { sheet: 'cuchillas2', sprite:"cuchillas2",gravity:0});
        this.add("defCuch");
        this.play("cuchillas2");
      },
      step: function(dt) {} });

     Q.animations("cuchillas3",{
      cuchillas3: { frames: [0, 1, 2,3], rate: 1/10, flip: false, loop: true }
     });
    Q.Sprite.extend("cuchillas3",{
      init: function(p) {
        this._super(p, { sheet: 'cuchillas3', sprite:"cuchillas3", gravity:0});
        this.add("defCuch");
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
    Q.animations("buttEle",{
      buttEle: { frames: [0, 1, 2], rate: 1/10, flip: false, loop: true }
     });
     Q.Sprite.extend("buttEle",{
      init: function(p) {
        this._super(p, { sheet: 'buttEle', sprite:"buttEle",gravity:0});
        this.add("animation,2d,aiBounce");
        this.play("buttEle");
      },

      step: function(dt) {} });
    
     Q.Sprite.extend("Fbutton",{
      init: function(p) {
        this._super(p, { sheet: 'Fbutton',gravity:0});
        this.add("2d,aiBounce");
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
      
      var button = stage.insert(new Q.UI.Button({ x: Q.width/2 + Q.width/6, y: Q.height/2 - Q.height/7, fill: "#33088F", label: "1 ENTER", color: "#33088F" }))
      Q.input.on("confirm",function() {
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


   Q.loadTMX("music_joker.mp3, level3.tmx, joker.png, joker.json,level1.tmx,level2.tmx, mario_small.json, mario_small.png, goomba.json, goomba.png," +  
    "bloopa.json, bloopa.png,acc1.png,acc1.json,cuchillas.png,buttEle.json,buttEle.png, cuchillas.json,cuchillas2.png,cuchillas2.json,cuchillas3.png,cuchillas3.json,cintaSup.png,cintaSup.json,ia.png,ia.json,ia2.png,ia.json,barraElect.png,barraElect.json," +  
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
         Q.compileSheets("buttEle.png","buttEle.json");
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
      Q.stageTMX("level1.tmx",stage);
      Mario = stage.insert(new Q.Batman({x: 30,y: 420}));
      console.log(Mario);
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
      Mario = stage.insert(new Q.Batman({x: 100,y: 100}));
      stage.add("viewport");
      stage.viewport.offsetX = -Q.width*30/100;
      stage.viewport.offsetY = Q.height*33/100;
     
    });

    Q.scene('endGame',function(stage) {
      var box = stage.insert(new Q.UI.Container({
        x: 30, y: 30, fill: "rgba(0,0,0,0.5)"
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
    // si ha muerto joker
    var dieJoker = false;
    //var chocaBatman = false;
    //var Truenos = false;
    var efec =  false;

  Q.animations('Joker-animations', {
    
    truen_L:{ frames: [0,1], rate: 1, loop: false},
    truen_R:{frames:[0,1], rate: 10, loop: false, flip:"x"},
    fight_R:{ frames:[2,3,4,5,6], rate: 1/3, flip:"x"},
    fight_L: { frames:[2,3,4,5,6], rate: 1/3},
    rayos:{ frames: [0,1,2], rate:1/2.5, loop: false},
    run_L:{ frames: [1,2,3,4,5,6], rate:1/3},//JOKERRUNNING
    run_R:{ frames: [1,2,3,4,5,6], rate:1/3, flip:"x"},//JOKERRUNNING
    die_L:{ frames:[0,1,2,3,4,5], rate:1, trigger: 'muerte', loop: false},//JokerDie
    die_R:{ frames:[0,1,2,3,4,5], rate:1, flip:"x", trigger: 'muerte'},//JokerDie
    stand_R:{ frames: [0], rate: 1/3, flip:"x"},
    stand_L:{ frames: [0], rate: 1/3},
    boomerang_R:{frames:[0,1,2,3,4], rate:1/3, flip:"x"},
    boomerang_L:{frames:[0,1,2,3,4], rate:1/3},
    shot_L:{frames:[0,1,2,3], rate:1/8, loop: true},
    shot_R:{frames:[0,1,2,3], rate:1/8, flip:"x", loop: true}
  });

  //componente

  Q.component('defecto', {

    added: function() {
    //this.entity.on("bump.top",this,"Joker");
    this.entity.on("bump.left",this,"JokerRun");
    this.entity.on("bump.right",this,"JokerRun");
    },

    JokerRun: function(col){
      if(col.obj.isA("Batman")) {  //perdiendo vidas el joker
        if(Q.inputs["fire"]){  
          Q.state.dec("lives", 1);
          if(Q.state.get("lives") < 0){
            //this.entity.del("2d");
            this.entity.muerte(); //Pierde osea muere
            dieJoker = true;
          }
        }
        else{
          //si colisiona con batman que retroceda
          //por ahora esta si llega a la esquina derecha
          this.entity.retrocede();
        }
        
      }
      else{
        //si no esta peleando debe morir batman
        // se para y empieza a disparar o rayoS
          this.entity.disparar();
          this.entity.truen();
          //this.entity.retrocede();
          /*if(this.efec){
          this.entity.stand();
          }*/
          //this.entity.truen();
          //this.jokerAtaca();
          //this.chocaBatman = true; //creo q este no hace falta
      }
    }
   
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

  /*Q.Sprite.extend("JokerBoomerang", { 
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
    */
    //en este***abajo
    
    Q.Sprite.extend("JokerRunning", { 
      init: function(p) {
         this._super(p, {
           vx: -100, 
           sheet: 'JokerRunning',
           sprite: 'Joker-animations',
           //frame: 0,
           x:400, 
           y:476,
           gravity: 0,
           lifesJoker : 5,
           auxleft: 0, 
           auxRight: 0,
           truenos: false,
           efectos: false,
           d : 1,//HACIA LA IZQUIERDA
           });
           this.add('2d, aiBounce, animation, defecto');
           this.play("run_L");
           //this.on("ataqueFinal");
           //this.add("defecto");
          //this.play("run_L"); //EMPIEZA HACIA LA IZQUIERDA
          this.on("bump.left",this,"turnRight");
          this.on("bump.right",this,"turnLeft");
           //this.play("stand_L");
       },
       step: function(dt){

        /*if(efec && !this.p.truenos){
          this.play("stand_L");
        }*/
          if(!dieJoker){
            if(this.p.auxRight != 0){
              if(this.p.x > this.p.auxRight) {
                  this.p.vx = 100;
                  this.play("run_L");
              }
          }
          if(this.p.auxLeft != 0) {
              if(this.p.x < this.p.auxLeft) {
                  this.p.vx = -100;
                  this.play("run_R");
              }
          }
        }
        else{
          time += dt;
          if(time >= 2) {
                this.destroy();
                Q.clearStages();
                Q.stageScene('mainMenu'); // ir a otra pantalla
          }
        }

       },
      
      retrocede: function(){
        if(this.p.x >= 400 && !dieJoker){  //llega al extremo de la esquina
          //this.p.x += 30;
          this.play("stand_L", 1);
        }
        
      },

      stand: function(){
        this.p.vx = 0;
        if(efec){  //si hubo efectos
          efec = false;
        this.play("stand_R", 1);
        }
      },

      disparar: function(dt){
        time+=dt;
        this.p.vx = 0;
        this.p.y = 413; //nueva posicion
        this.p.sheet = "JokerA";
        this.play("truen_L", 1);
        this.p.truenos = true;
       },

       truen: function(dt){
        this.p.vx = 0;
        if(this.p.truenos){
          this.p.truenos = false;
          this.stage.insert(new Q.JokerRayos());
          this.stage.insert(new Q.JokerRayos({x: 270}));
          //this.efec = true;
          /*var time = 0;
          time += dt;
          if(time > 1){
          this.p.efectos = true;
          }*/
          //this.p.efectos = true;
        }
        else{
          //no hacemos nada
          //t.destroy();
        }
        //this.play("rayos", 1);
      },

       muerte: function(){
         //se sube la posicion pero ya esta modificado
        this.p.sheet = "JokerDie";
        this.p.y = 476;
        this.p.vx = 0;
        this.play("die_L", 1);
       },

       turnRight: function() {//cambiar de direccion sprites
        this.play("run_R");
      },
      
      turnLeft: function() {
        this.play("run_L");
      },


      });  

    

  Q.Sprite.extend("JokerRayos", {  
    init: function(p) {
       this._super(p, {
         vx: 0, 
         sheet: 'JokerRayos',
         sprite: 'Joker-animations',
         vy:-10,
         frame: 0,
         //rangeY:90,
         gravity: 0.9,
         x: 150,
         y: 0,
         ax: 0,
         ay:150,
         });
         //this.p.initialY = this.p.y;
         this.add('2d, aiBounce, animation');
         this.play("rayos", 1);
     },
     step: function(dt){
       var t = 0;
       
        //this.p.y += 10;
        if(this.p.y >= 403){  //pero es 398
             this.destroy();
        }

      }

    });

  /*Q.Sprite.extend("Joker", {
    init: function(p) {
       this._super(p, {
         sheet: 'JokerA',
         sprite: 'Joker-animations',
         });
         this.add('2d, aiBounce, animation');
         this.play("manda_L");
     },
     
     step: function(dt){
      time += dt;
      if(time >= 10) {
        //presentamos al joker de pie
        this.destroy();
      }
     },

    });
    */
  /*Mejorar las dimensiones de sheet*/
    

  Q.scene("level3",function(stage) {
    Q.state.reset({score: 0, lives: 3});
    Q.stageTMX("level3.tmx",stage);
    Batman = stage.insert(new Q.Batman({x: 200,y: 340}));
    stage.add("viewport").follow(Batman,{x:false, y:false});
   // stage.centerOn(250,400);
    stage.unfollow(); 
    //stage.insert(new Q.Joker({x:400, y:446}));
    stage.insert(new Q.JokerRunning());
    //stage.insert(new Q.JokerRayos({x:130, y:10}));
    
    //para probar los rayos
    
    //stage.insert(new Q.JokerRayos({x:130, y:10}));
    //stage.insert(new Q.JokerRayos({x:200, y:10}));
    //stage.insert(new Q.JokerBoomerang());
    //stage.insert(new Q.JokerBalas());
    //musica del nivel de joker
   //Q.audio.play("music_joker.mp3", {loop: true});
  });
  /*************fin del level3*********** */
});
