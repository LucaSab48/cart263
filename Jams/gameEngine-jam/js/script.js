/**
Chicken Coop Game
Luca Sabelli
*/
//This script is initializing the two other scripts to make the game
//This variable is the configuration
let config = {
    type: Phaser.AUTO,
    width: 800, //Here I am defining the width of the game window
    height: 600, //Defining the height
    //This is setting up the physics of our game
    physics: {
        default: "arcade", //Usual preset
        arcade: {
            gravity: {y: 350}, //This is assigning a gravity coefficient to my game 
            debug: false //This is ensuring no errors in syntax with development features that are not in use 
        }
    },
    //Here I am calling the other two functions to start the game
    scene: [Boot, Play]
};

//Creating the game
let game = new Phaser.Game(config);
