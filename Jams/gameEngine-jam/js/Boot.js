class Boot extends Phaser.Scene {

    constructor() {
        super({
            key: "boot"
        });
    }

    preload() {
        this.load.image('backdrop', 'assets/images/platformer-backdrop.png');
        this.load.image('cannon_head', 'assets/images/cannon_head.png');
        this.load.image('cannon_body', 'assets/images/cannon_body.png');
        this.load.spritesheet('chick', 'assets/images/chick.png', { frameWidth: 16, frameHeight: 18, endFrame: 3 });
        this.load.on('complete', () => {
            this.scene.start('play');
        });
    }
    
    create() {
        let loadingTextStyle = {
            fontFamily: "sans-serif",
            fontSize: "40px",
            fill: "#ffffff",
            align: "center"
          };
          let loadingString = `Loading...`;
          this.loadingText = this.add.text(100, 100, loadingString, loadingTextStyle);
    }

    update() {

    }
}