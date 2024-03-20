/**
Computer Bully
Luca Sabelli
*/
let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 300}
        }
    },
    scene: [Boot, Play]
};

let game = new Phaser.Game(config);
