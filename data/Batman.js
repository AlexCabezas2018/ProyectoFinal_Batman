var game = function() {

    /*Canvas para debug, el canvas estará en otra clase*/
    var Q = Quintus().include("Scenes, Sprites, Input, UI, Touch, TMX, 2D, Anim")
        .setup({ maximize: true })
        .controls()
        .touch();

    Q.load(["batman.png", "batman.json"], function() {
        Q.compileSheets("batman.png", "batman.json");
        Q.stageScene("level1");
        //Compilar los json con los sprites
    });

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
                sheet: "batmanStaticRight",
                x: 0,
                y: 0, 

            });
            this.add( /*2d*/ 'platformerControls, animation');
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


    //Para testing
    Q.scene("level1", function(stage) {
        var x = stage.insert(new Q.Batman({ x: 100, y: 100 }));
        console.log(x);
    })
}
