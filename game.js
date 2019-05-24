// Adrián Camacho Pérez

window.addEventListener("load",function() {
  var Q = window.Q = Quintus({ development: true, audioSupported: ["mp3", "ogg"] }) 
          .include("Sprites, Scenes, Input, Touch, UI, TMX, Anim, Audio, 2D")
          .setup({ width: 544, height: 544}) 
          .controls().touch()
          Q.enableSound();
  Q.PLAYER = 1;
  //Q.COIN = 2;
  Q.ENEMY = 4;



    /*************************** BATMAN SPRITE ***************************************/
    Q.animations('batman_anims', {
      static_left: { frames: [3, 2, 1], rate: 1/8, flip: "x", loop: false },
      static_right: { frames: [3, 2, 1], rate: 1/8, flip: false, loop: false },
      running_left: { frames: [0, 1, 2, 3, 4, 5], rate: 1/10, flip: "x" } ,
      running_right: { frames: [0, 1, 2, 3, 4, 5], rate: 1/10, flip: false },
      punch_left: { frames: [0, 1, 2, 3], rate: 1/13, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      punch_right: { frames: [0, 1, 2, 3], rate: 1/13, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      punch_crouched_left: { frames: [0, 1, 2, 3], rate: 1/13, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      punch_crouched_right: { frames: [0, 1, 2, 3], rate: 1/13, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      punch_jumping_left: { frames: [0, 1, 2, 3], rate: 1/13, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      punch_jumping_right: { frames: [0, 1, 2, 3], rate: 1/13, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
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

      gun_anim_right: { frames: [0, 1, 2, 3], rate: 1/9, flip: false, loop: false, trigger: 'punchFinishedTrigger'},
      gun_anim_left: { frames: [0, 1, 2, 3], rate: 1/9, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      bullet_right: { frames: [0, 1, 2], rate: 1/7, flip: false, loop: false },
      bullet_left: { frames: [0, 1, 2], rate: 1/7, flip: "x", loop: false },

      boomerang_right: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rate: 1/10, flip: false},
      boomerang_left: { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], rate: 1/10, flip: "x"},

      boomerang_running_right: { frames: [0, 1, 2], rate: 1/10, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      boomerang_running_left: { frames: [0, 1, 2], rate: 1/10, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      boomerang_crouched_right: { frames: [0, 1, 2], rate: 1/10, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      boomerang_crouched_left: { frames: [0, 1, 2], rate: 1/10, flip: "x", loop: false, trigger: 'punchFinishedTrigger' },
      boomerang_jumping_right: { frames: [0, 1, 2], rate: 1/10, flip: false, loop: false, trigger: 'punchFinishedTrigger' },
      boomerang_jumping_left: { frames: [0, 1, 2], rate: 1/10, flip: "x", loop: false, trigger: 'punchFinishedTrigger' }

    });

  Q.input.keyboardControls({
    X: 'X'
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
              health: 7,
              canTakeDamage: true,
              staticAnim: true,
              gravity: 1,
              type: Q.PLAYER,
              jumpSpeed: -600,
              isJumping: false,
              isCrouching: false,
              isPunching: false,
              hasCollectableGun: true,
              died: false,
              isThrowingBoomerang: false

          });
          this.add('2d, platformerControls, animation');
          Q.input.on("fire", this, "punch");
          Q.input.on("S", this, "boomerang");
          Q.input.on("X", this, "gunShoot");
          this.on("punchFinishedTrigger");
          this.on("allowToTakeDamageTrigger")
          this.on("enemy.hit", "hit");
          //this.on("bump.top","bumpTop"); 
          this.on("stage1completed","gotoStage2"); 

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
        if(!this.p.isJumping) {
          this.p.sheet = "batmanJump";
          this.p.isJumping = true;
          this.play('jump_' + this.p.direction, 1);

          //Reproducir audio de salto
          Q.audio.play("batman_jump.mp3");
        }
      },


      /**
       * Esta function se llama cuando batman se agacha. Comprueba si es posible agacharse y 
       * si es asi, ejecuta la animacion
       */
      crouch: function() {
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
          if(this.p.canTakeDamage && !this.p.isPunching) {
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

            //Reproducir audio de puñetazo
            Q.audio.play("batman_punch.mp3");
        }
      },

      boomerang: function() {
          if(this.p.canTakeDamage && !this.p.isPunching && !this.p.isThrowingBoomerang) {
            this.p.isPunching = true;
            this.p.isThrowingBoomerang = true;
            if(this.p.isCrouching) {
              //Animaciones cuando batman lanza boomerang agachado
              this.p.vx = 0;
              this.p.sheet = "batmanBoomerangCrouched";
              this.play("boomerang_crouched_" + this.p.direction, 1);
              if(this.p.direction == "left") {
                this.stage.insert(new Q.BatmanBoomerang({ x: this.p.x - 50  , y: this.p.y - 5, vx: -200, dir: this.p.direction }));
              }
              else {
                this.stage.insert(new Q.BatmanBoomerang({ x: this.p.x + 50  , y: this.p.y - 5, vx: 200, dir: this.p.direction }));
              }

            }
            else if(this.p.isJumping){
              //Animaciones cuando batman lanza boomerang saltando
              this.p.sheet = "batmanBoomerangJumping";
              this.play("boomerang_jumping_" + this.p.direction, 1);
              if(this.p.direction == "left") {
                this.stage.insert(new Q.BatmanBoomerang({ x: this.p.x - 50  , y: this.p.y - 10, vx: -200, dir: this.p.direction }));
              }
              else {
                this.stage.insert(new Q.BatmanBoomerang({ x: this.p.x + 50  , y: this.p.y - 10, vx: 200, dir: this.p.direction }));
              }

              
            }
            else {
              //Animaciones cuando batman lanza boomerang de pie
              this.p.vx = 0;
              this.p.sheet = "batmanBoomerangRunning";
              this.play("boomerang_running_" + this.p.direction, 1);
              if(this.p.direction == "left") {
                this.stage.insert(new Q.BatmanBoomerang({ x: this.p.x - 50  , y: this.p.y - 10, vx: -200, dir: this.p.direction }));
              }
              else {
                this.stage.insert(new Q.BatmanBoomerang({ x: this.p.x + 50  , y: this.p.y - 10, vx: 200, dir: this.p.direction }));
              }

            }

            //Reproducir audio de puñetazo
            Q.audio.play("batman_punch.mp3");
        }
      },

      gunShoot: function() {
        if(this.p.hasCollectableGun && !this.p.isPunching) { //Si ha recogido el colectable que le otorga la pistola...
          this.p.isPunching	= true;
          if(this.p.isCrouching) {
            this.p.sheet = "batmanPistolCrouched";
          }
          else if(this.p.isJumping) {
            this.p.sheet = "batmanPistolJumping";
          }
          else {
            this.p.sheet = "batmanPistolRunning";
          }
          this.play("gun_anim_" + this.p.direction, 1); 

          //Lanzamos la bala
          let bulletSpeed = (this.p.direction == "right") ? 300: -300;
          let bulletPosition = (this.p.direction == "right") ? 50: -50;

          this.stage.insert(new Q.BatmanBullet({ x: this.p.x + bulletPosition, y: this.p.y - 10, vx: bulletSpeed, dir: this.p.direction }));

          //Sonido de disparo
          Q.audio.play("batman_punch.mp3"); //Es el mismo que el del puñetazo porque no encontraba un sonido parecido al original

        }
      },

      /**
       * Esta función es llamada cuando es golpeado. Se calcula si ha muerto o si se ha hitteado.
       * Despues se analiza su estado y se ejecuta la animación correspondiente.
       */
      hit: function() {
        if(this.p.canTakeDamage && !this.p.isPunching) {
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
            Q.audio.stop(); //Se para toda la musica para solo oir la muerte de batman
            Q.audio.play("batman_death.mp3"); //Reproduce audio de muerte.
            Q.stageScene("gotoMainMenu",1, { label: "HAHAHA DEATH!" });
          }
          else {
            //Reproducir audio de hit
            Q.audio.play("batman_hit.mp3");
            if(this.p.isCrouching) {
              //Animacion de hit cuando está agachado
              this.p.sheet = "batmanHittedCrouched";
              this.play("hitted_crouched_" + this.p.direction, 1);
            }
            else {
              //Animacion de hit cuando está de pié y saltando
              if(!this.p.isJumping || this.p.vx != 0) {
                this.p.vy = -240; //Efecto de hit: Salta un poco
              }
              this.p.sheet = "batmanHittedRunning";
              this.play("hitted_running_" + this.p.direction, 1);
            }
          }
        }
      },

      gotoStage2: function(){
          Q.stageScene("gotoStage2",1, { label: "GOOD JOB" });
        },


      bumpTop: function(col) {
          if(col.obj.isA("TileLayer")) {
            if(col.tile == 24) { col.obj.setTile(col.tileX,col.tileY, 36); }
            else if(col.tile == 36) { col.obj.setTile(col.tileX,col.tileY, 24); }
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

  Q.Sprite.extend("BatmanBoomerang", { //actualizado y funciona
    init: function(p) {
       this._super(p, {
         vx: 40,
         sheet: 'batmanBoomerang',
         sprite: 'batman_anims',
         frame: 0,
         gravity: 0,
         damage: 1, //Quita una unidad de daño. Este atributo se puede usar para que las armas tengan distinto daño
         scale: 2,  //ajustamos el tamaño del boomerang
         actualLocation: 0, //Esta variable almacena donde se situa el boomerang al comienzo
         dir: 'right'
        });

        this.add('2d, aiBounce, animation, toca'); //podeis cambiar la animacion de "toca"
        this.p.actualLocation = this.p.x;
        this.play("boomerang_" + this.p.dir, 1);
        
     },
     
     step: function(dt){
        if(Math.abs(this.p.x - this.p.actualLocation) > 200) { //Si el boomerang ha recorrido mas de 200 unidades, entonces cambiamos la direccion
          this.p.vx *= -1;
        }
     }
    });

    Q.Sprite.extend("BatmanBullet", {
      init: function(p) {
        this._super(p, {
          x: 0,
          y: 0,
          vx: 0,
          gravity: 0,
          scale: 1.5,
          damage: 2, //De nuevo este atributo se usa para controlar el daño del arma. Cambiar a gusto
          sprite: 'batman_anims',
          sheet: 'bullet',
          dir: 'right'
        });

        this.add('2d, aiBounce, animation, toca');
        //Reproducir sprite
        this.play("bullet_" + this.p.dir);
      }
    });

    Q.Sprite.extend("BatmanGunCollectable", {
      init: function(p) {
        this._super(p, {
          x: 0,
          y: 0,
          //Esto es en caso de que queramos que Batman consiga la pistola en un punto determinado de la partida
          //Pero por facilidad consideramos que debe tenerla desde el principio.
          //TODO: Añadir una imagen como textura. Concretamente una que hay en el archivo "tiles.png" que tiene el logo de batman. IMPORTANTE
        });
        this.add('2d');
        this.on('bump.right, bump.left, bump.top, bump.bottom', this, "allowBatmanToHaveGun");
      },

      allowBatmanToHaveGun: function() {
        if(col.obj.isA("Batman")) {
          col.obj.p.hasCollectableGun = true;
          Q.audio.play("batmanCollectable.mp3");
        }
      }
    });

    Q.component('toca', {
 
      added: function() {
       this.entity.on("bump.left",this,"colObjeto");
       this.entity.on("bump.right",this,"colObjeto");
       this.entity.on("bump.bottom",this,"colObjeto"); //para ataques con Rayos
      },

      colObjeto: function(col){
        if(!col.obj.isA("Batman")) {  //no colisiona con Batman
          col.obj.trigger('enemy.hit'); // daño a la entidad
        }
        Q('Batman').first().p.isThrowingBoomerang = false;
        Q('Batman').first().p.isPunching = false;
        
        
        this.entity.destroy();  //desaparece si colisona con batman como sino
      } 
    });

  /******************************************************************************/

  
    /*Base enemy*/
    Q.component('defaultEnemy', {

        added: function() {
        this.entity.add("2d, aiBounce, animation");
    	  this.entity.on("bump.top",this,"killPlayer");
    	  this.entity.on("bump.left", this, "killPlayer");
    	  this.entity.on("bump.right", this, "killPlayer");
        this.entity.on("bump.bottom", this, "killPlayer");
    	  this.entity.on("hit.sprite",this,"die");
        },

        die: function(col) {
         if(col.obj.isA("Batman") || col.obj.isA("BatmanBoomerang") || col.obj.isA("BatmanBullet")) {
          this.entity.play('dead');
          this.entity.p.dead = true;
          this.entity.p.deadTimer = 0;
         }
      	},

      	killPlayer: function(col){
      		if(col.obj.isA("Batman") && !this.entity.p.dead) {
          		col.obj.trigger('enemy.hit');
        	}
        }
       
      });

    /*Tank explosion*/
    Q.Sprite.extend("Tank",{
      init: function(p) {
        this._super(p, { sheet: 'tank', vx: -100, rangeX: 200,
          gravity: 0, type: Q.ENEMY});
        this.p.initialX = this.p.x;
        this.add('defaultEnemy');
        this.play('walkLeft');

      },

      step: function(dt) {
        if(this.p.dead) {
          this.del('2d, aiBounce');
          this.p.deadTimer++;
          if (this.p.deadTimer > 30) { //menos tiempo porque si no puedes saltar 2 veces sobre el cadaver
            this.destroy();
          }
            return;
          }

          if(this.p.vx == 0){
            this.p.vx = -100;
          }
          if(this.p.x <= this.p.initialX - this.p.rangeX) {   
            this.p.vx = 100;
          } 
          else if(this.p.x >= this.p.initialX + this.p.rangeX) {   
            this.p.vx = -100;
            
          } 

          if(this.p.vx == 100){
            this.play('walkRight');
          }
          else if(this.p.vx == -100){
            this.play('walkLeft');
          }
          else{
            this.play('walkLeft');
          }

        },
  });


    /*Batty (murciélago)*/
    Q.Sprite.extend("Batty",{
      init: function(p) {
        this._super(p, { sheet: 'batty', vy: -140, rangeY: 90,
          gravity: 0, jumpSpeed: -230, type: Q.ENEMY});
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

/*MiniBoss */
    Q.Sprite.extend("Miniboss",{
      init: function(p) {
        this._super(p, { sheet: 'miniboss', vx: -225, vy: 30, rangeX: 200, rangeY: 90,
          gravity: 0, type: Q.ENEMY});
        this.p.initialX = this.p.x;
        this.p.initialY = this.p.y;
        this.add('defaultEnemy');
        this.play('front');

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
          //this.p.vy = 0;
          if(this.p.vx == 0){
            this.p.vx = -150;
          }
          if(this.p.x >= this.p.initialX) { 
            this.stage.insert(new Q.Fire({x: this.p.x - 20, y: this.p.y + 100})); 
            this.p.x = this.p.initialX;
            this.p.vx = -this.p.vx;
          } 
          else if(this.p.x + this.p.rangeX < this.p.initialX) { 
            this.stage.insert(new Q.Fire({x: this.p.x - 20, y: this.p.y + 100}));
            this.p.x = this.p.initialX - this.p.rangeX;
            this.p.vx = -this.p.vx;
          }

          if(this.p.vy == 0){
            this.p.vy = 30;
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


    Q.Sprite.extend("Fire", {  
       init: function(p) {
          this._super(p, {
            vx: 0,
            sprite: 'miniboss', 
            sheet: 'miniboss',
            vy:-10,
            gravity: 0.5,
            type: Q.ENEMY
            });

            this.add('2d, aiBounce, animation, toca');
            this.add('defaultEnemy');
            this.play("fire");
       }
      });


/*Flamethrower (lanzallamas)*/
    Q.Sprite.extend("Flamethrower",{
      init: function(p) {
        this._super(p, { sheet: 'miniboss', vx: 0, vy: 0, gravity: 0, cont : 0, cont2 : 0 ,type: Q.ENEMY});
        this.add('defaultEnemy');
        this.play('flyLeft');

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

        if(this.p.cont == 10) //cont2 para que descanse de usar el lanzallamas
            {
              this.stage.insert(new Q.Fire2({x: this.p.x - 70, y: this.p.y}));
              this.p.cont=0;
              
            }
            else{
              if(this.p.cont2 < 300){
                this.p.cont++;
                this.p.cont2++;
              }
              else if(this.p.cont2 > 550){
                this.p.cont2 = 0;
              }
              else {
                this.p.cont2++;
              }
            }





        },

    });


    Q.Sprite.extend("Fire2", {  
       init: function(p) {
          this._super(p, {
            vx: -70,
            sprite: 'miniboss', 
            sheet: 'miniboss',
            vy: 0,
            gravity: 0,
            rangeX: 100, 
            type: Q.ENEMY
            });

            this.add('2d, aiBounce, animation, toca');
            this.add('defaultEnemy');
            this.play("fireLeft", 1);

            this.p.initialX = this.p.x;
       },

       step: function(dt){

        if(this.p.x < this.p.initialX - this.p.rangeX) { 
            this.destroy();
          }

       }

      });


    /*Meta barra-princesa*/
    Q.Sprite.extend("Goal", {
      init: function(p,defaults) {
    	    this._super(p,Q._defaults(defaults||{},{
    	      collisionMask: Q.SPRITE_ALL,
    	    }));

    	    this.add("2d");
    	    this.on("bump.top","gotoStage2");
    	    this.on("bump.left","gotoStage2");
    	    this.on("bump.right","gotoStage2");
    	    this.on("bump.bottom","gotoStage2");
      	},
      gotoStage2: function(col){
    	if(col.obj.isA("Batman")) {
          this.destroy();
          col.obj.trigger('stage1completed');
        }
      },
    });
     /*****************************************************************Objetos Stage 2*************************************************************************************/

     /*Se aplica a las cuchillas y a la barra electrificada, si la tocas en cualquiera de sus partes batman recibe daño*/
      Q.component('defCuch', {

        added: function() {
      this.entity.add("animation,2d,aiBounce");
       this.entity.on("bump.top",this,"Bdies");
      this.entity.on("bump.left",this,"Bdies");
      this.entity.on("bump.right",this,"Bdies");
      this.entity.on("bump.bottom",this,"Bdies");
      },
        Bdies: function(col){
      if(col.obj.isA("Batman")) {
          col.obj.hit();
          this.destroy();
        }
      },
       
      });
      /*Cinta de la parte inferior que arrastra a batman*/
     Q.animations("cintainferior",{
      cintainferior: { frames: [3, 2, 1,0], rate: 1/8, flip: false, loop: true }
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
          col.obj.p.x++;
        }
      },
      step: function(dt) {} });
    /*Barra Electrificada*/
    Q.animations("barraElect",{
      barraElect: { frames: [0, 1, 2,3], rate: 1/8, flip: false, loop: true }
     });
    Q.Sprite.extend("barraElect",{
      init: function(p) {
        this._super(p, { sheet: 'barraElect',sprite:"barraElect",gravity:0});
        this.add("defCuch");
        this.play("barraElect");
      },
      die: function(){
        this.destroy();
      },
      step: function(dt) {if(!Q.buttEle){this.destroy();}} });



    /*disparos superiores*/
     Q.Sprite.extend("shot",{
      init: function(p) {
        this._super(p, { sheet: 'shot',gravity:0.3,x:252,y:114});
        this.add("2d,aiBounce");
        this.on("bump.top",this,"Bdies");
      this.on("bump.left",this,"Bdies");
      this.on("bump.right",this,"Bdies");
      this.on("bump.bottom",this,"Bdies");
      },
        Bdies: function(col){
      if(col.obj.isA("Batman")) {
          col.obj.hit();
         
        }
        this.destroy();
        this.shoot();
        
      },
      step: function(dt) {
            
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
     /*Disparos inferiores*/
    Q.Sprite.extend("hshot",{
      init: function(p) {
        this._super(p, { sheet: 'hshot',gravityY:0,x:362,y:393});
        this.add("2d,aiBounce");
        this.on("bump.top",this,"Bdies");
      this.on("bump.left",this,"Bdies");
      this.on("bump.right",this,"Bdies");
      this.on("bump.bottom",this,"Bdies");
    
      },
        Bdies: function(col){
      if(col.obj.isA("Batman")) {
          col.obj.hit();
        }
        this.destroy();
        this.shoot();
      },
      step: function(dt) {
            this.p.x=this.p.x-2;
            },
      shoot: function() {
                    var p = this.p;
                      this.stage.insert(new Q.hshot({
                        x: 362,
                        y: 359,
                    }));    
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
      cintaSup: { frames: [3, 2, 1,0], rate: 1/8, flip: false, loop: true }
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
         col.obj.p.x--;
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
      buttEle: { frames: [0, 1, 2], rate: 1/10, flip: false, loop: true },
      hit:{ frames: [2, 1, 0], rate: 1/10, flip: false, loop: true }
     });

    
    Q.Sprite.extend("meta",{
      init: function(p) {
        this._super(p, { sheet: 'meta'});
        this.add("animation,2d,aiBounce");
        this.on("bump.top",this,"win");
        this.on("bump.left",this,"win");
        this.on("bump.right",this,"win");
        this.on("bump.bottom",this,"win");

      },
      win: function(col){

      if(col.obj.isA("Batman")) {
          this.destroy();
          Q.stageScene("gotoStage3",1, { label: "GOOD JOB" });
        }
      },

      step: function(dt) {}});

     Q.Sprite.extend("buttEle",{
      init: function(p) {
        this._super(p, { sheet: 'buttEle', sprite:"buttEle",gravity:0,health: 30,cont:0});
        this.add("animation,2d,aiBounce");
        this.play("buttEle");
        this.on("bump.top",this,"Damage");
        this.on("bump.left",this,"Damage");
        this.on("bump.right",this,"Damage");
        this.on("bump.bottom",this,"Damage");

      },
      Damage: function(col){

      if(col.obj.isA("Batman")) {
         if(col.obj.p.isPunching){
          
           if(this.p.health>0){
            this.p.health--;
            this.play("hit");
            this.play("buttEle");

           }
           else{
            this.p.barr.destroy();
            this.destroy();
           }
          }
        }
      },
      elect:function(){
      this.p.barr=  this.stage.insert(new Q.barraElect({x:392,y:200}));
      },
      step: function(dt) {if(this.p.cont==0){this.elect();} this.p.cont++;} });

    
     Q.Sprite.extend("Fbutton",{
      init: function(p) {
        this._super(p, { sheet: 'Fbutton',gravity:0});
       
      },
      step: function(dt) {} });


      Q.Sprite.extend("guns",{
      init: function(p) {
        this._super(p, { sheet: 'guns',gravity:0,health: 10});
       
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
      
      var button = stage.insert(new Q.UI.Button({ x: Q.width/2 + Q.width/6, y: Q.height/2 - Q.height/20, fill: "#33088F", label: " CLICK HERE TO START " }))
      background.on("click",function() {
        Q.clearStages();
        Q.stageScene('level1');
        Q.stageScene('hud', 3, Q('Batman').first().p);
      });
      Q.audio.stop();
      Q.audio.play("darkknight_theme.mp3");
    });


   Q.loadTMX("music_joker.mp3, darkknight_theme.mp3, level3.tmx, joker.png, joker.json,level1.tmx,level2.tmx, mario_small.json, mario_small.png, tank.json, tank.png," +  
    "batty.json, batty.png, miniboss.json, miniboss.png, acc1.png,acc1.json,cuchillas.png,buttEle.json,buttEle.png, cuchillas.json,cuchillas2.png,cuchillas2.json,cuchillas3.png,cuchillas3.json,cintaSup.png,cintaSup.json,ia.png,ia.json,ia2.png,ia.json,barraElect.png,barraElect.json," +  
    "cintainferior.png, cintainferior.json, princess.png, mainTitle.png, tiles.json, tiles.png," +  
    "Batman.png, Batman.json, batman_death.mp3, batman_hit.mp3, batman_punch.mp3, batman_jump.mp3, batmanCollectable.mp3",  function() {
        Q.compileSheets("mario_small.png","mario_small.json");
        Q.compileSheets("tank.png","tank.json");
        Q.compileSheets("batty.png","batty.json");
        Q.compileSheets("miniboss.png","miniboss.json");
        Q.compileSheets("tiles.png","tiles.json");
        Q.compileSheets("Batman.png", "Batman.json")
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

        var EnemyAnimations = {
            walkLeft: { frames: [0,1,2,3], rate: 1/8, loop: true },
            walkRight: { frames: [0,1,2,3], rate: 1/8, flip: "x", loop: true },
            dead: { frames: [4,5,6,7], rate: 1/3 }
        };

        Q.animations("tank", EnemyAnimations);
        Q.animations("batty", {
          jump: { frames: [0,1], rate: 1/2, loop: true },
          dead: { frames: [2], rate: 1/8 }
        });

         Q.animations("miniboss", {
          front: { frames: [0], rate: 1/8,},
          flyLeft: { frames: [1], rate: 1/8 },
          flyRight: { frames: [1], rate: 1/8, flip: "x"},
          dead: { frames: [2,3], rate: 1/2,loop: true},
          fire:{ frames: [4], rate: 1/2, loop: false},
          fireLeft:{ frames: [5], rate: 1/2, loop: false},
          fireRight:{ frames: [5], rate: 1/2, loop: false, flip: "x"}
        });
        
        Q.stageScene("mainMenu");
    });

    Q.scene("level1",function(stage) {
      Q.stageTMX("level1.tmx",stage);
      Mario = stage.insert(new Q.Batman({x: 330,y: 1120}));
      console.log(Mario);
      stage.add("viewport").follow(Mario);
      stage.viewport.offsetX = -Q.width*30/100;
      stage.viewport.offsetY = Q.height*33/100;
      Q.audio.stop();
      Q.audio.play("darkknight_theme.mp3", {loop: true});
    });

      Q.scene("level2",function(stage) {
      Q.stageTMX("level2.tmx",stage);
      Mario = stage.insert(new Q.Batman({x: 37,y: 272}));
      stage.add("viewport");
      stage.viewport.offsetX = -Q.width*30/100;
      stage.viewport.offsetY = Q.height*33/100;

     
    });

      //Para cuando Batman muere
    Q.scene('gotoMainMenu',function(stage) {
      var box = stage.insert(new Q.UI.Container({
        x: 30, y: 30, fill: "rgba(50,16,136,0.8)"
      }));
      
      var button = box.insert(new Q.UI.Button({ x: 250, y: 260, fill: "#AD2A9D",
                                               label: "Play Batman again" }))         
      var label = box.insert(new Q.UI.Text({x:250, y: 250 - button.p.h, 
                                            label: stage.options.label }));
      button.on("click",function() {
        Q.clearStages();
        Q.stageScene('mainMenu');
      });
      box.fit(20);
    });

    Q.scene('gotoStage2',function(stage) {
      var box = stage.insert(new Q.UI.Container({
        x: 30, y: 30, fill: "rgba(41,0,29,0.8)"
      }));
      
      var button = box.insert(new Q.UI.Button({ x: 250, y: 260, fill: "#AD2A9D",
                                               label: "Click here - Stage2" }))         
      var label = box.insert(new Q.UI.Text({x:250, y: 250 - button.p.h, 
                                            label: stage.options.label }));
      button.on("click",function() {
        Q.clearStages();
        Q.stageScene('level2');
      });
      box.fit(20);
    });
    

     Q.scene('gotoStage3',function(stage) {
      var box = stage.insert(new Q.UI.Container({
        x: 30, y: 30, fill: "rgba(41,0,29,0.8)"
      }));
      
      var button = box.insert(new Q.UI.Button({ x: 250, y: 260, fill: "#AD2A9D",
                                               label: "Click here - Stage3" }))         
      var label = box.insert(new Q.UI.Text({x:250, y: 250 - button.p.h, 
                                            label: stage.options.label }));
      button.on("click",function() {
        Q.clearStages();
        Q.stageScene('level3');
      });
      box.fit(20);
    });

    /*********************STAGE 3**************************** */
    
     var dieJoker = false; // si ha muerto joker
     var lifesJoker = 5; // las vidas que posee el joker
     
     Q.animations('Joker-animations', {
       
       attack_left:{ frames: [0,1], rate: 1/3, loop: false},
       attack_right:{frames:[0,1], rate: 1/3, loop: false, flip:"x"},
       fight_right:{ frames:[2,3,4,5,6], rate: 1/3, loop: false, flip:"x"},
       fight_left: { frames:[2,3,4,5,6], rate: 1/3, loop: false},
       rayos:{ frames: [0,1,2], rate:1/3, loop: false},  //JokerRayos
       run_left:{ frames: [1,2,3,4,5,6], rate:1/8, flip: false, loop: true},//JOKERRUNNING
       run_right:{ frames: [1,2,3,4,5,6], rate:1/8, flip:"x", loop: true},//JOKERRUNNING
       die_left:{ frames:[0,1,2,3,4,5], rate:1, trigger: 'muerte', loop: false},//JokerDie
       die_right:{ frames:[0,1,2,3,4,5], rate:1, flip:"x", trigger: 'muerte', loop: false},//JokerDie
       boomerang_right:{frames:[0,1,2,3,4], rate:1/3, flip:"x"}, //JokerBoomerang
       boomerang_left:{frames:[0,1,2,3,4], rate:1/3},  //JokerBoomerang
       shot_left:{frames:[0,1,2,3], rate:1/3},//JokerBalas
       shot_right:{frames:[0,1,2,3], rate:1/3, flip:"x"}  //JokerBalas

     });
     
     Q.component('colJoker', {
 
      added: function() {
        this.entity.on("bump.left",this,"colBatman");
        this.entity.on("bump.right",this,"colBatman");
        this.entity.on("bump.bottom",this,"colBatman"); //para ataques con Rayos
        this.entity.on("bump.top",this,"colBatman"); //encima 
      },

      colBatman: function(col){
        if(col.obj.isA("Batman")) {  //colisiona con Batman
          col.obj.trigger('enemy.hit'); // daño a batman
        }
        this.entity.destroy();  //desaparece si colisona con batman como sino

        if(Q('Batman').first().p.health == 0){
          console.log("Batman Muerte"); //mejorar para que pare cuando batman pierda o muera
        }
      }

    });

     
 
     Q.Sprite.extend("JokerBalas", { 
       init: function(p) {
          this._super(p, {
            sheet: 'JokerBalas',
            sprite: 'Joker-animations',
            frame: 0,
            y:430,
            dirDer: false,
            gravity: 0,
            
            });
            this.add('2d, aiBounce, animation, colJoker');
        },
 
        step: function(dt){

           if(!this.p.dirDer){
             this.p.vx = -140;
             this.play("shot_left", 1);
           }
           if(this.p.dirDer){
             this.p.vx = 140;
             this.play("shot_right", 1);
           }
        }
 
       });
 
     Q.Sprite.extend("JokerBoomerang", { 
       init: function(p) {
          this._super(p, {
            sheet: 'JokerBoomerang',
            sprite: 'Joker-animations',
            frame: 0,
            y:430,
            gravity: 0,
            });
            this.add('2d, aiBounce, animation, colJoker');
        },

        step: function(dt){
          if(!this.p.dirDer){
            this.p.vx = -140;
            this.play("boomerang_left", 1);
          }
          if(this.p.dirDer){
            this.p.vx = 140;
            this.play("boomerang_right", 1);
          }
        }
       });
       
       
       Q.component('efectted', { 
 
       added: function() {
        this.entity.on("bump.left",this,"colIzq");
        this.entity.on("bump.right",this,"colDer");
        this.entity.on("bump.bottom",this,"defaultAttack"); //para ataques con Rayos
        this.entity.on("bump.top",this,"defaultAttack"); //si salta encima del Joker
       },
       
       defaultAttack: function(col){  //colisona encina y debajo del joker
          if(!dieJoker){
            col.obj.trigger('enemy.hit'); // daño a batman
          }
        
       },

       colIzq: function(col){  //colisona con el lado izquierdo

            if(col.obj.isA("BatmanBoomerang") || col.obj.isA("BatmanBullet")) {  //colisiona con Joker
              lifesJoker--;
              col.obj.destroy(); 
              this.entity.giraDer();
            }
            else{
                if(col.obj.isA("Batman")) {  //perdiendo vidas el joker dependiendo
                  if(Q.inputs["fire"]){  //podria ser que le baje mas vidas?
                    lifesJoker--;
                  }
                    
                  if(!dieJoker){
                    col.obj.trigger('enemy.hit'); // daño a batman
                    this.entity.giraDer(); 
                  }
                }
                else{
                  this.entity.attack();
                  this.entity.contadorAtaque = 0;
                }
            }

            if(lifesJoker <= 0){
              dieJoker = true;
              this.entity.finalJoker = 0;
              this.entity.muerte(); //Pierde osea muere
            }
        },
 
       colDer: function(col){

          if(col.obj.isA("BatmanBoomerang")|| col.obj.isA("BatmanBullet")) {  //colisiona con Joker pero aun no hay para boomerang lado derecho
            lifesJoker--;
            col.obj.destroy(); 
            this.entity.giraIzq();
          }
          else{
          
            if(col.obj.isA("Batman")) {  //perdiendo vidas el joker dependiendo
              if(Q.inputs["fire"]){  //podria ser que le baje mas vidas?
                lifesJoker--; 
              }
                
              if(!dieJoker){
                col.obj.trigger('enemy.hit'); // daño a batman
                this.entity.giraIzq(); 
              }

            }
            else{
              this.entity.attack();
              this.entity.contadorAtaque = 0;
            }
              
          }

          if(lifesJoker <= 0){
            dieJoker = true;
            this.entity.finalJoker = 0;
            this.entity.muerte(); //Pierde osea muere
          }
          
        }

     });
 
       Q.Sprite.extend("JokerRunning", { //principal
         init: function(p) {
            this._super(p, {
              vx: -140, 
              sheet: 'JokerRunning',
              sprite: 'Joker-animations',
              frame: 1,
              x:400, 
              y:476,
              gravity: 0,
              esquinaDer : false,
              esquinaIzq : false,
              direcionDer : false, //indica si esta llendo a la dercha(false) izquierda true
              });

             this.add('2d, aiBounce, animation, efectted');
             this.play("run_left"); //EMPIEZA HACIA LA IZQUIERDA
             
          },


          step: function(dt){
 
             if(!dieJoker){
 
               this.contadorAtaque++;

                 if(this.p.x >= 460) { //final de escena 460
                     if(this.contadorAtaque >= 50){
                        this.p.y = 436;
                        this.p.sheet = "JokerRunning";
                        this.p.vx = -140;
                        this.p.direcionDer = false;
                        this.esquinaDer = false;
                        this.play("run_left",1);
                     }
                 }
            
                 if(this.p.x <= 84) {  //aqui es limite 84
                     if(this.contadorAtaque >= 50){
                        this.p.y = 436;
                        this.p.sheet = "JokerRunning";
                        this.p.vx = 140;
                        this.p.direcionDer = true;
                        this.play("run_right",1);
                     }
                 }
             
           }
           else{
             this.finalJoker++;
             if(this.finalJoker >= 500){ //para que espere y salga a otra pantalla 
               this.destroy();
               Q.audio.stop();  //se para la musica cuando el joker ha muerto
               setTimeout (this.redireccionar(), 5000);
               //Q.clearStages();
               //Q.stageScene('mainMenu'); // ir a otra pantalla donde se vea el final del Joker
             }
           }
 
          },
         
         redireccionar: function(){window.location="../scenes/endLevel3.html";} ,


         giraDer: function(){
           this.p.y = 436;
           this.p.sheet = "JokerRunning";
           this.p.vx = 140;
           this.p.direcionDer = true;
           this.play("run_right",1);
           
         },
 
         giraIzq: function(){
           this.p.y = 436;
           this.p.sheet = "JokerRunning";
           this.p.vx = -140;
           this.p.direcionDer = false;
           this.play("run_left",1);
           
         },
 
         /* Posiciones de Joker */
         disparar: function(dt){ //para fuego y boomerang
           this.p.vx = 0;
           this.p.y = 413; //nueva posicion
           this.p.sheet = "JokerAttack";
           if(this.p.direcionDer)
           {
             this.play("fight_left", 1);
           }else{
           this.play("fight_right", 1);
           }

          },
 
         lanzar: function(dt){ //solo para rayos
           this.p.vx = 0;
           this.p.y = 413; //nueva posicion
           this.p.sheet = "JokerAttack";
           if(this.p.direcionDer)
           {
             this.play("attack_left", 1);
           }else{
           this.play("attack_right", 1);
           }
           
          },
 
          attack: function(dt){
             //agregar musica ya sea diferenciando de rayos a disparos
             var yee = Math.random();
             if(yee < 0.3) {
              Q.audio.play("joker_rayos.mp3", {loop: true});
               this.lanzar();
               this.stage.insert(new Q.JokerRayos());  //RAZON DE 85 
               this.stage.insert(new Q.JokerRayos({x: 265}));
               this.stage.insert(new Q.JokerRayos({x: 350}));
             }
             else{
               this.disparar();
               if(yee < 0.6){
                Q.audio.play("joker_fuego.mp3", {loop: true});
                 if(this.p.direcionDer){
                   this.stage.insert(new Q.JokerBalas({x:380, dirDer: false}));  //JokerBalas
                 }else{
                   this.stage.insert(new Q.JokerBalas({x: 154, dirDer: true}));  //JokerBalas con x : 154 y JokerBoo con 164
                 }
               }
               else{
                Q.audio.play("joker_boomerang.mp3", {loop: true});
                 if(this.p.direcionDer){
                   this.stage.insert(new Q.JokerBoomerang({x:380, dirDer: false}));  //JokerBalas
                 }else{
                   this.stage.insert(new Q.JokerBoomerang({x: 164, dirDer: true}));  //JokerBalas con x : 154 y JokerBoo con 164
                 }
               }
             }
         },
         
          muerte: function(){
            this.p.sheet = "JokerDie";
            this.p.y = 476;
            this.p.vx = 0;
            
            if(this.p.direcionDer){
            this.play("die_left", 1);
            }
            else{
              this.play("die_right", 1);
            }
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
            gravity: 0.9,
            x: 180,
            y: 0,
            ax: 0,
            ay:150,
            });
            this.add('2d, aiBounce, animation, colJoker');
            this.play("rayos", 1);
        },
        step: function(dt){
           if(this.p.y >= 403){
                this.destroy();
           }
         }
 
       });
       
 
     Q.scene("level3",function(stage) {
       Q.stageTMX("level3.tmx",stage);
       Batman = stage.insert(new Q.Batman({x: 200,y: 340}));
       stage.add("viewport").follow(Batman,{x:false, y:false});
       stage.unfollow(); 
       stage.insert(new Q.JokerRunning());
       
       //musica del nivel de joker
      Q.audio.stop();
      Q.audio.play("music_joker.mp3", {loop: true});  
     });
     /*************fin del level3*********** */
});
