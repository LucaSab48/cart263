class Boot extends Phaser.Scene {
    //In this constructor, I am calling the super function to call the parent class using the key word
    constructor() {
        super({
            key: "boot" //This is the key that will allow the script to call this function
        });
    }

    //In this function I am preloading all the assets that will be used in the game
    preload() {
        this.load.image('backdrop', 'assets/images/platformer-backdrop.png');
        this.load.image('cannon_head', 'assets/images/cannon_head.png');
        this.load.image('cannon_body', 'assets/images/cannon_body.png');
        this.load.image('platform', 'assets/images/platform.png');
        this.load.image('house', 'assets/images/house1.png');
        this.load.spritesheet('chick', 'assets/images/chick.png', { frameWidth: 16, frameHeight: 18, endFrame: 3 }); //Here I am calling a sprite sheet and defining its properties
        
        //This changes the scene to the play function when all the assets are loaded 
        this.load.on('complete', () => {
            this.scene.start('play');
        });
    }
    
    //In this function I am displaying a loading message for the game
    create() {
        //This variable contains the style for the text
        let loadingTextStyle = {
            fontFamily: "sans-serif",
            fontSize: "40px",
            fill: "#ffffff",
            align: "center"
          };
          //This contains the string of the text
          let loadingString = `Loading...`;
          //This loads the text into the scene to be displayed
          this.loadingText = this.add.text(100, 100, loadingString, loadingTextStyle);
    }

    update() {

    }
}