# Game Engine Jam Project

This program is a expansion of two pre-existing examples of Phaser 3 code demonstrating physics properties and some event handlers. I adapted the code to fit my game play loop as well as added a bunch of features. The original code has a cannon that would fire 1 chick at a time without any closed boundaries, so I decided to add world colliders to it and allow it to bounce around the screen. I also made it so that the user can shoot as many chicks as he desires, instead of the original which would only allow 1. I also added platforms that use static physics to allow more interactivity between the chicks and the screen. The idea was from the firstgame demo in the phaser 3 examples as well. I added a house sprite atop the main obstacles (platforms) that is the goal of the game. When a chick hits the house the score count in the top left corner will increase as well. I also made it so the user can control the strength of the cannon using the up and down arrow. It increases the velocity of the chick and the length of the geometry line that follows the cannon. While I had a lot of intentions with this project at first, specifically making a distance measuring game similar to toss the turtle, I did not have enough time to integrate everything I wanted so I compromised my vision. I wanted to do a whole intro screen and more finalized game loop, yet I did not have the time and I honestly struggled using Phaser 3. It felt like a whole different language and I was simply doing trial and error until I made something that worked. That is the reason my code is close to the Phaser 3 examples, because I needed it to as a guide to build off. I tried my best to make it more unique and demonstrate my understanding of a handful of mechanics in phaser 3, however, I still used the sprites from the original examples. I struggled with trying to use my own sprites and png's, for some reason I couldn't manage to make them work. I originally intended for the cannon to shoot a bunch of different cat sprites, unfortunately it did not work.

Sources:
Phaser 3 Examples:  https://labs.phaser.io/edit.html?src=src\physics\arcade\velocity%20from%20angle.js 
                    https://labs.phaser.io/edit.html?src=src\games\firstgame\part9.js

Cannon head png: source from phaser 3 game: https://github.com/phaserjs/examples/blob/master/public/assets/tests/timer/cannon_head.png
Cannon body png: source from phaser 3 game: https://github.com/phaserjs/examples/blob/master/public/assets/tests/timer/cannon_body.png
Chick sprite: source from phaser 3 game: https://github.com/phaserjs/examples/blob/master/public/assets/sprites/chick.png
Platform png: source from phaser 3 game: https://github.com/phaserjs/examples/blob/master/public/src/games/firstgame/assets/platform.png
Background png: source from phaser 3 game: https://github.com/phaserjs/examples/blob/master/public/assets/pics/platformer-backdrop.png
House png: source from https://pngfre.com/house-png/house-2/ 




