class Play extends Phaser.Scene {
    //In this constructor, I am calling the super function to call the parent class using the key word
    constructor() {
        super({
            key: "play"
        });
        //These are global variables that I will use for the cannon
        this.speed = 500; //Tracks velocity of chicks exiting cannon
        this.long = 120; //Tracks the length of the geometry line following cannon
    }

    //These are more global variables that I will use following
    platforms; //Contains all the created static group platforms
    score = 0; //Keeps track of score 
    chickGroup; //Group of all the chicks that exit the cannon when fired
    scoreText; //String of score text
    cursors; //Contains user input
    gameOver = false; //Checks if game is over

    
    //In the create function, I will have the majority of the game contained in here
    create() {
        //Instead of making a animator function and calling it, I used the anims.create to do it all in one line
        this.anims.create({ key: 'fly', frames: this.anims.generateFrameNumbers('chick', [ 0, 1, 2, 3 ]), frameRate: 5, repeat: -1 });
        
        //Here I am adding the background image and scaling it to fit the entire screen
        this.add.image(400, 300, 'backdrop').setScale(2.5);
        
        //This line is assigning chick group to the physics group to ensure they have colliders
        this.chickGroup = this.physics.add.group();
        
        //Here I am adding the cannon head and cannon body image to the scene
        let cannonHead = this.add.image(130, 450, 'cannon_head').setDepth(1); //The depth is at 1 so that the geometry line appears behind the cannon
        let cannon = this.add.image(130, 500, 'cannon_body').setDepth(1); //It also just looks better

        //This section here is creating the geometry line that will follow my cannon head
        let graphics = this.add.graphics({ lineStyle: { width: 10, color: 0xffdd00, alpha: 0.5 } }); //This is stylizing the line
        let line = new Phaser.Geom.Line(); //Here we are assigning the line variable to a new geometry line

        //Here I am declaring an angle variable so the cannon head can follow the users pointer
        let angle = 0;

        //This part over here is creating the platforms in my game
        this.platforms = this.physics.add.staticGroup(); //This makes the static group for the platforms
        this.platforms.create(600, 400, 'platform'); //This creates the platform in my desired location, as well as adding it to the scene
        this.platforms.create(50, 250, 'platform'); //Same thing as before but new location
        this.platforms.create(750, 220, 'platform'); //Same thing as before but new location

        //This part here is creating the house sprite for my game, as well as giving it a collider and scaling it
        this.house = this.physics.add.sprite(750, 100,'house').setScale(0.2);

        //This line adds the score text to the scene and stylizes it
        this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

        //This function is in charge of making the cannon head rotate with the direction of the mouse, it is called when the mouse (pointer) is moving 
        this.input.on('pointermove', (pointer) => {
            //This if statement stops the cannon head from following the mouse once the game is over
            if(this.gameOver === false) {   
                angle = Phaser.Math.Angle.BetweenPoints(cannon, pointer); //Calculates the angle between the cannon and the users pointer
                cannonHead.rotation = angle; //Rotates cannon head depending on angle
                Phaser.Geom.Line.SetToAngle(line, cannon.x, cannon.y - 50, angle, this.long); //Allows geom line to follow the cannon head as well as containing the long variable to change the length 
                graphics.clear().strokeLineShape(line); //Clears the previous line and redraws it to the new proper position
            }
        });

        //This function allows the cannon to fire the chicks when the user releases his click 
        this.input.on('pointerup', () => {
            //This if statement allows the game to stop the user from firing more chicks after the game is over
            if(this.gameOver === false) {
                let chick = this.makeChick(cannon.x, cannon.y - 50); //Assigns chick variable and calls the makeChick function
                chick.play('fly'); //Starts the animation of the chick using key word
                this.physics.velocityFromRotation(angle, this.speed, chick.body.velocity); //Assigns the direction of the chick as well as containing the speed  variable to change the exiting velocity
                chick.body.setCollideWorldBounds(true); //Allows chick to bounce around the map instead of falling endlessly
                chick.body.setBounce(1, 1); //Sets the amount of bounce the chick has
                this.physics.add.collider(chick, this.platforms); //Allows the chick to bounce off the platforms as well by creating a collider with it
            }
        });

        //This part is assigning the cursors variable with the input of keyboard cursor keys (up down left right)
        this.cursors = this.input.keyboard.createCursorKeys();

        //This line sets the bounds of my scene to ensure that no object falls through
        this.physics.world.setBounds(0, 0, 800, 600);

        //This line allows the house to collide with a platform
        this.physics.add.collider(this.house, this.platforms);

        //This part checks if the chick overlaps with the house then calls the goneHome function to make the bodies disappear and add it to the score
        //I had to use the chickGroup.getChildren() function because it wasn't working with chickGroup only, so i called the created chicks instead of the group itself
        this.physics.add.overlap(this.chickGroup.getChildren(), this.house, this.goneHome, null, this);
    }

    
    //This function is charged with making the chicks that fly out of the cannon
    //I made this function so that the user can create as many chicks as they want
    makeChick(x, y) {
        //Here I am assigning chick to a physics sprite with interchangeable x and y position as well as a keyword to call it
        let chick = this.physics.add.sprite(x, y, 'chick')
                        .setScale(2) //Scaling the image
                        .setCollideWorldBounds(true) //Allowing it to bounce around
                        .setBounce(1, 1); //Allowing it to bounce
        
        //Adding the chick to the group
        this.chickGroup.add(chick);

        //Returning the chick object 
        return chick;
    }


    //In the update function, I am allowing the user to input keys to control the cannon velocity and geom line length 
    update() {
        //This function checks if the game is over, and if so, returns to function to stop the user from inputting keys post win
        if(this.gameOver) {
            return;
        }

        //This if statement allows the user to increase the velocity of the cannon and length of the line
        if(this.cursors.up.isDown) {
            //Here I am ensuring that the user doesn't go wild when increasing
            if(this.speed < 1000 && this.long < 300) {
                this.speed += 10;
                this.long += 5;
            }
        }
        //This if statement allows the user to decrease the velocity of the cannon and length of the line
        else if(this.cursors.down.isDown) {
            //Here I am making sure the line still remains visible and the velocity isn't too slow
            if(this.speed > 360 && this.long > 50) {
                this.speed += -10;
                this.long += -5;
            }
        }

        //This if statement checks if the user has scored 30 points, then sets gameOver to true and calls the endGame function
        if(this.score >= 30) {
            this.gameOver = true;
            this.endGame();
        }
    }


    //This function removes the chick bodies when it comes into contact with the house
    //It is called in the overlap function in create()
    goneHome(chick, house) {
        chick.destroy(); //Destroys chick sprite from scene

        this.score += 1; //Increases score each time 
        this.scoreText.setText(`Score: ` + this.score); //Changes score text to illustrate increasing score

        //Checks if score has reached 30 then changes gameOver to true and calls the endGame function
        //Might seem redundant but I was having issues when I only had this statement here
        if(this.score >= 30) {
            this.gameOver = true;
            this.endGame();
        }
    }    
    
    
    //This function displays the victory message when the user achieves the predetermined goal, in this case, reaching 30 chicks in the house
    endGame() {
        //Creating the style for the text
        let loadingTextStyle = {
            fontFamily: "sans-serif",
            fontSize: "100px",
            fill: "#ffffff",
            align: "center"
        };
        //Assigning the string of the text to a variable 
        let loadingString = `You Won!`;
        //Loading the text into the scene
        this.loadingText = this.add.text(200, 250, loadingString, loadingTextStyle);
    }
}