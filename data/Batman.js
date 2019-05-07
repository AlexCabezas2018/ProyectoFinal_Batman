var game = function() {

    /*Canvas para debug, el canvas estará en otra clase*/
    var Q = Quintus().include("Scenes, Sprites, Input, UI, Touch, TMX, 2D, Anim")
        .setup({ maximize: true })
        .controls()
        .touch();

    Q.load(["Batman.json", "Batman.png"], function() {
        Q.compileSheets("Batman.png", "Batman.json");
        //Compilar los json con los sprites
    });

    /* Animaciones Batman */
    Q.animations('batman_anims', {
        /*Me falta saber las animaciones básicas de Batman*/
        static_left: {},
        static_right: {},
        running_left: {},
        running_right: {},
        jump_left: {},
        jump_right: {},
        crouch_left: {},
        crouch_right: {},
        die: {},
        hitted_crouched: {},
        hitted_running: {},
        punch_crouched_left: {},
        punch_crouched_right: {},
        punch_jumping_left: {},
        punch_jumping_right: {},
        punch_left: {},
        punch_right: {},
        bounce_left: {},
        bounce_right: {}
    });


    Q.Sprite.extend("Batman", {
        init: function(p) {
            this._super({
                /*Coordendas, propiedades básicas*/



            });
            this.add('2d, plataformerControls, animation');
            this.play('static_right');
            //Implementar las colisiones y los disparos.

            //Comportamientos...
        }
        //Más funciones, como el step....

    });
}
