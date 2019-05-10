     /* Animaciones Batman */
    Q.animations('batman_anims', {
        static_left: { frames: [0, 1, 2, 3], rate: 1/15, flip: "x" },
        static_right: { frames: [0, 1, 2, 3], rate: 1/15, flip: false },
        running_left: { frames: [0, 1, 2, 3, 4, 5], rate: 1/15, flip: "x" } ,
        running_right: { frames: [0, 1, 2, 3, 4, 5], rate: 1/15, flip: false },
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
                sheet: "batmanRunning",
                x: 0,
                y: 0,
                scale: 2 //Aquí se ajusta el tamaño.

            });
            this.add( '2d, platformerControls, animation');
            this.play('static_right');
            //Implementar las colisiones y los disparos.
            
        } ,

        step: function(dt) {
            if(this.p.vx > 0) {
                this.p.sheet = "batmanRunning"
                this.play('running_right');
            }
            else if(this.p.vx < 0) {
                this.p.sheet = "batmanRunning"
                this.play('running_left');
            }
        }

    });
