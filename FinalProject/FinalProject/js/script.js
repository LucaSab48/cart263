/**
Computer Bully
Luca Sabelli

A computer that will repeat what you say in an annoying way
with a few more surprises
*/

"use strict";

//This is the object that contains all the properties for the robot head
let robotHead = {
    x: 500,
    y: 300,
    width: 500,
    height: 400,
    fill: {
        r: 148,
        g: 148,
        b: 148
    } 
};

//Object that contains characteristics of the robot mouth
//Fill property added so I can change it later
let robotMouth = {
    x: 500,
    y: 400,
    width: 350,
    height: 100,
    fill: {
        r: 255,
        g: 255,
        b: 191,
    },
};

//Object for robot eyes 
let robotEyes = {
    x: 400,
    y: 200,
    size: 100,
    fill: 255
};

//Object for robot pupils
let robotPupils = {
    x: 400, 
    y: 200, 
    size: 20, 
    fill: 0
};

//Object for robot antenna
//Width, height and size are there because there is a rectangle and a circle
let robotAntenna = {
    x: 500, 
    y: 75, 
    width: 20, 
    height: 50, 
    size: 30, 
    fill: 180, 
};

//Global variables that change 
let state = "loading"; //This changes the state of the program
let insultList; //This will hold the JSON file
let speaking = 'speak to me'; //This contains the string that the text displays
let storyState = 1; //This is to continue the robots origin story

//Constants that will remain the same
const recognition = new p5.SpeechRec(); //Contains the speech recognizer 
const computerVoice = new p5.Speech(); //Contains voice synthesizer 
//This constant contains a variety of commands that will initialize a function called a callback
const commands = [
    {
        "command": ["shut up", "shut your mouth", "stop talking", "shush", "shut it", "stop"],
        "callback": shutUpResponse
    },
    {
        "command": ["how are you", "how is it going", "how's it going", "how are you feeling", "how do you feel", "how's the weather", "what's up", "what is up", "how's your day going", "how is your day going"],
        "callback": howResponse
    },
    {
        "command": ["who are you", "who made you", "what are you", "why are you like this", "what's your story", "why are you so mean", "why do you do this", "then what", "what happened", "then what happened", "what happened after that", "next", "really", "continue"],
        "callback": originStory
    }
];

const pixelDistance = 10; //This constant measures the distance between each pixel in the intro screen
let titleImage = undefined; //This is the reference image for the pixels in the title screen
let pixels = []; //This is the array that contains all the pixels in the intro
let emotion; //This will contain the AI Sentiment model
let emotionScore = 0; //This will contain the prediction from the AI model
let robotHealth = 3; //This is the amount of health the robot has

//User video
let video;
let isOn = false; //This variable shows when the running pose model is fully loaded and allows the program to keep track of time elapsed
let countDown = 45000; //This variable contains the total amount of time for the countdown timer
let startTime; //Contains the entire time passed 
let starting = false; //Allows program to know when to save a specific time for the countdown
let savedTime; //Contains saved time
let poseNet; //Contains the poseNet model
let pose; //Contains array of keypoints from model
let skeleton; //Contains another array that has the skeleton points from the model
let meter = 0; //Has the value for the corruption meter used later in the forgive game
let farEnough = true; //Lets program know if user is far enough from the screen
let backAlpha = 100; //Contains the opacity for the move back screen 

//Color for skeleton in both games
let lineColor = {
  r: 255,
  g: 255, 
  b: 255
};

//Robot bully object that will be used in both poseNet games
let robotBully = {
  x: 300,
  y: 100,
  width: 120,
  height: 120,
  speed: 5, 
  vx: 0, 
  vy: 0,
  jitter: 0.08, //How often the machine head changes directions
  health: 400, //Used for the health bar in the kill game
  damage: 0.5, //Used for the damage amount in the kill game
  img: undefined,
  img2: undefined
};

//Object of the button to start the forgive game
let forgiveButton = {
    x: 300, 
    y: 500,
    size: 150,  
    width: 100, 
    height: 100,
    alpha: 255, //Contains opacity of the button
    img: undefined
};

//Same object as before but for the kill game
let killButton = {
    x: 700, 
    y: 500,
    size: 150,  
    width: 100, 
    height: 100,
    alpha: 255, 
    img: undefined
};

let introImage = undefined; //Contains the reference image for the title screen
let instructionGame1 = undefined; //Contains the image for the kill game instructions
let instructionGame2 = undefined; //Image for the forgive game instructions
let forgiveGoodEndingImage = undefined; //Image for the forgive good ending
let killGoodEndingImage = undefined; //Image for the kill good ending
let killBadEndingImage = undefined; //Image for the kill bad ending
let startTransition1 = false; //Starts the fade to black transition in title card
let transitionAlpha1 = 0; //Opacity of black rectangle to fade
let fadeInTransitionAlpha = 255; //Opacity of black rectangle to fade in mission state
let startFadeOut1 = false; //Starts the fade out in the mission state


//This function preloads the JSON file and assigns it to the insultList variable and loads all images used in the game
function preload() {
    insultList = loadJSON("assets/data/insults.json");
    robotBully.img = loadImage("assets/images/robotBully2.png");
    robotBully.img2 = loadImage("assets/images/robotBullyDamaged1.png");
    forgiveButton.img = loadImage("assets/images/forgiveSymbol1.png");
    killButton.img = loadImage("assets/images/deathSymbol1.png");
    titleImage = loadImage("assets/images/TitleCard2.png");
    introImage = loadImage("assets/images/introCutScene1.png");
    forgiveGoodEndingImage = loadImage("assets/images/forgiveGoodEnding1.png");
    killGoodEndingImage = loadImage("assets/images/killGoodEnding1.png");
    killBadEndingImage = loadImage("assets/images/killBadEnding1.png");
    instructionGame1 = loadImage("assets/images/killGameInstruction.png");
    instructionGame2 = loadImage("assets/images/forgiveGameInstruction.png");
}


//The setup function creates the canvas, activates the voice recognition, and starts the video used for poseNet
//It also assigns all the ml5 models used and displays our title sequence 
function setup() {
    createCanvas(1000, 700);

    recognition.continuous = true; //This will ensure that the voice recognizer will continue listening 
    recognition.onResult = handleResult; //This calls for the voice recognizer to run the handleResult function when it has a result 
    recognition.start(); //Starts the voice recognition
    console.log(computerVoice.listVoices()); //Logs all the voice options in the console 
    computerVoice.setVoice("Google UK English Male"); //Sets the voice for the speech synthesizer
    computerVoice.onStart = robotSpoke; //When voice starts, calls robotSpoke function
    computerVoice.onEnd = robotDone; //When voice ends, calls robotDone function
    
    emotion = ml5.sentiment('movieReviews', modelLoaded); //Here I am assigning the AI model to my variable

    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, loading);
    poseNet.on('pose', running);

    particleDisplay();
}


//This function switches the state of my game
function draw() {
    //This if statement switches the states
    if(state === "loading") {
        //Basic loading screen while letting models load
        background(255)
        textAlign(CENTER);
        textSize(50);
        text("Loading models", width/2, height/2);
    }
    //Displays the title card 
    else if(state === "title") {
        titleDisplay();
    }
    //Displays the mission image 
    else if(state === "mission") {
        missionDisplay();
    }
    //Starts phase 1 of the robot game
    else if(state === "robotReady") {
        background(220, 208, 255); //Sets color of the background
        textDisplay(); //Display text function
        displayRobot(); //Display robot function
    }
    //Starts phase 2 of the robot game
    else if(state === "weak") {
        background(220, 208, 255); 
        textDisplay();
        displayRobot(); 
        emotionPercentage(); //Displays emotion percentage
        robotHealthDisplay(); //Displays robot health
        checkIfDefeated(); //Check if the robot has been defeated
    }
    //Changes to the decision screen
    else if(state === "decision") {
        background(220, 208, 255);
        buttonSelection(); //Displays the buttons to select 
    }
    //Shows the instructions for the kill game
    else if(state === "killSlide") {
        killInstruction();
    }
    //Shows the instructions for the forgive game
    else if(state === "forgiveSlide") {
        forgiveInstruction();
    }
    //Starts the kill game if selected
    else if(state === "running") {
        resizeCanvas(640, 480); //Resizes canvas so the poseNet game will work
        background(255); //Gets rid of any leftover images from the previous states
        poseNetGame(); //Starts the poseNet kill game
        checkIfDead(); //Checks if the bully has died
        checkTime(); //Checks if time has ran up
    }
    //Contains functions necessary for the forgive game
    else if(state === "running2") {
        resizeCanvas(640, 480); 
        background(255);
        poseNetGame2(); //Starts the poseNet forgive game
        checkIfCorrupted(); //Checks if the corruption meter is full
        checkTime(); //Checks if the time has ran up
    }
    //Ending if user beats robot in kill game
    else if(state === "robotBeat") {
        resizeCanvas(1000, 700); //Resizes it back to its normal size
        displayGoodKillEnding(); //Displays the end card for this outcome
    }
    //Ending if user beats robot in forgive ending
    else if(state === "robotBeat2") {  
        resizeCanvas(1000, 700);
        displayGoodForgiveEnding(); //Displays the end card for this outcome
    }
    //Ending if robot beats user in the kill ending 
    else if(state === "robotWins") {
        resizeCanvas(1000, 700);
        displayBadKillEnding(); //Displays the end card for this outcome
    }
    //Ending if robot beats user in the forgive ending
    else if(state === "robotWins2") {
        resizeCanvas(1000, 700);
        displayBadForgiveEnding(); //Displays the end card for this outcome
    }
    //Last end screen after all the other endings
    else if(state === "robotDefeated") {
        resizeCanvas(1000, 700);
        winningDisplayMessage(); //Displays winning message
    }
    //Lets a small transition happen to have an ending effect (turn screen to white)
    else if(state === "Endend") {
        background(255);
        push();
        rectMode(CENTER, CENTER);
        fill(255);
        rect(0, 0, width, height);
        pop();
    }

}


//Contains all the necessary things for the title screen to work
function titleDisplay() {
    computerVoice.stop(); //Stops the computer bully from talking
    background(50); //Sets background behind pixels
    push();
    textAlign(CENTER);
    textSize(30);
    fill(255);
    text("Press ENTER to start", 500, 600);
    pop();

    //Allows the pixels to all display on the title screen and move around as well
    pixels.forEach( (pixel) => {
        pixel.update(); //Calls the function from the particle script
        pixel.display();
    });

    push();
    fill(0, transitionAlpha1); //Allows the slow fade transition using the alpha property 
    rectMode(CENTER, CENTER);
    rect(500, 350, width, height);
    pop();

    //This if statement starts the fade in transition
    if(startTransition1) {
        transitionAlpha1 += 15; //Slow fade
    }

    //Changes the state of the game after the fade is complete
    if(transitionAlpha1 >= 255) {
        state = "mission";
    }
}


//This function allows all the particles from the particle script to be pushed into the pixels array 
function particleDisplay() {
    //Checks the fill for each pixel of the refernce image, puts it into the proper x and y position, and push each particle made into the pixel array
    for(let i = 0; i < 1000; i += pixelDistance) {
        for(let j = 0; j < 700; j += pixelDistance) {
            let titleFill = titleImage.get(i, j);
            pixels.push(new Particle(i + 5, j + 5, titleFill));
        }
    }
}


//This function displays the image for the mission statement of the game
function missionDisplay() {
    computerVoice.stop(); //Stops computer bully from talking
    push();
    image(introImage, 0, 0);
    rectMode(CENTER, CENTER);
    fill(0, fadeInTransitionAlpha); //Allows fade in transition using alpha property 
    rect(500, 350, width, height);
    pop();
    
    //Changes the alpha to allow 
    if(fadeInTransitionAlpha >= 0) {
        fadeInTransitionAlpha += -15;
    }
}


//This function displays the text on the bottom
function textDisplay() {
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text(speaking, 500, 550); //Displays the changing variable speaking
}



//This function displays the positivity meter for the game
function emotionPercentage() {
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text("Positivity Meter: " + emotionScore + "%", 500, 600); //Displays the rounded score out of 100 of the positivity of the users messages
}


//This function displays the health of the computer bully
function robotHealthDisplay() {
    let robotHealthDrawn = 1; //This is to set my condition for my while loop
    let x = 400; //This is the position of the first circle
    //This while loop will draw and update the health of my computer bully
    
    //Displays the hit point system for the robot's phase 2 only if its the right phase
    if(state === "weak") {
        while(robotHealthDrawn <= robotHealth) {
            fill(255, 10, 50);
            ellipse(x, 650, 50);
            x = x + 100;
            robotHealthDrawn += 1;
        }
    }
}


//Displays the instructions for the forgive game 
function forgiveInstruction() {
    computerVoice.stop();
    push();
    image(instructionGame2, 0, 0);
    textAlign(CENTER);
    textSize(35);
    fill(0);
    text("Press ENTER when ready", 500, 650)
    pop();
}


//Displays the instructions for the kill game
function killInstruction() {
    computerVoice.stop();
    push();
    image(instructionGame1, 0, 0);
    textAlign(CENTER);
    textSize(35);
    fill(0);
    text("Press ENTER when ready", 500, 650)
    pop();
}


//This function displays the winning message after defeating the robot
function winningDisplayMessage() {
    background(0);
    noStroke();
    fill(255);
    textAlign(CENTER);
    textSize(50);
    text("Thank you for playing", width/2, height/2);
    textSize(30);
    text("Press ENTER to end it", width/2, 450);
    computerVoice.stop(); //This stops the computer bully from talking
}


//This function displays the robot head in the function
function displayRobot() {
    let x1 = map(mouseX, 0, width, 385, 415); //Maps the mouseX to the x position of the left pupil
    let x2 = map(mouseX, 0, width, 585, 615); //Maps the mouseX to the x position of the right pupil
    let y1 = map(mouseY, 0, height, 175, 225); //Maps the mouseY to the y position of both pupils
    
    
    noStroke();
    rectMode(CENTER);
    fill(robotHead.fill.r, robotHead.fill.g, robotHead.fill.b);
    rect(robotHead.x, robotHead.y, robotHead.width, robotHead.height); //Creates robot head
    rect(robotAntenna.x, robotAntenna.y, robotAntenna.width, robotAntenna.height); //Creates robot antenna 
    fill(robotMouth.fill.r, robotMouth.fill.g, robotMouth.fill.b); //Allows fill to change 
    rect(robotMouth.x, robotMouth.y, robotMouth.width, robotMouth.height); //Creates robots mouth
    fill(robotEyes.fill);
    ellipse(robotEyes.x, robotEyes.y, robotEyes.size); //Creates left eye
    ellipse(robotEyes.x + 200, robotEyes.y, robotEyes.size); //Creates right eye
    fill(robotPupils.fill);
    ellipse(x1, y1, robotPupils.size); //Creates left pupil
    ellipse(x2, y1, robotPupils.size); //Creates right pupil
    fill(robotHead.fill.r, robotHead.fill.g, robotHead.fill.b);
    ellipse(robotAntenna.x, robotAntenna.y - 35, robotAntenna.size); //Creates circle on top of antenna
}


//This function changes the color of the robot mouth to a more neon yellow to indicate the robot is speaking
function robotSpoke() {
    robotMouth.fill.r = 255;
    robotMouth.fill.g = 255;
    robotMouth.fill.b = 30;
}


//This function changes the color back to light yellow when the speech synthesizer is done
function robotDone() {
    robotMouth.fill.r = 255;
    robotMouth.fill.g = 255;
    robotMouth.fill.b = 191;  
}


//This function is called when the voice recognition has a result
//It also interprets all the recognized speech and changes it accordingly 
function handleResult() {
    let spoke = recognition.resultString.toLowerCase(); //This variable contains the lower-case string of the recognized speech
    let interruption = Math.round(random(0,5)); //This variable is randomly assigned a value to determine if the robot will not repeat what the user says
    let prediction = emotion.predict(spoke); //This variable is assigned the prediction value of the AI Sentiment model
    emotionScore = Math.round(prediction.score * 100); //This variable is an adjusted percentage display of the AI prediction
    
    console.log(prediction.score); //This logs the prediction score in the console

    //This if statement is the main component of my game, it has the conditions for the percentage needed to damage or help the robot
    if(prediction.score > 0.95 && state === "weak") {
        let happyResponse = random(insultList.happy);
        computerVoice.speak(happyResponse); //Here i am assigning a random insult from my JSON
        speaking = happyResponse;
        robotHealth += -1; //This is removing health from the computer bully
        robotHurt(); //This calls a function to show some damage being done to the robot
        return; //This is to stop the function from going through the rest of the conditions 
    }
    else if(prediction.score < 0.05 && state === "weak") {
        let sadResponse = random(insultList.sad); //Here i am assigning a random insult from my JSON 
        computerVoice.speak(sadResponse);
        speaking = sadResponse;
        //This if statement is to give health back to the robot, but not more than 3
        if(robotHealth < 3) {
            robotHealth += 1;
        }
        return;
    }

    //This for loop checks if any command is spoken and then assigns the proper callback function
    for(let command of commands) {
        for(let i = 0; i < command.command.length; i++) {
            if(spoke === command.command[i]){
                command.callback();
                return; //This stops the loop from continuing if a recognized command is picked up
            }
        }
    }
    //This if statement only runs if the result value of the voice recognition has a proper result
    if(recognition.resultValue) { 
        //This if statement checks if the voice recognition string starts with "i'm"
        if(spoke.startsWith("i'm ")) {
            let newSentence = spoke.slice(spoke.indexOf("i'm ") + 3); //Removes the i'm in the sentence 
            computerVoice.speak("hello" + newSentence + ", i am your computer bully"); //Makes voice synthesizer speak the new sentence in the form of the classic dad joke
            speaking = "hello" + newSentence + ", i am your computer bully"; //Changes the text displayed to the new sentence of the dad joke 
        }
        //This if statement checks if the user's speech starts with "i am" and does the same thing as the last if statement 
        else if(spoke.startsWith("i am ")) {
            let newSentence2 = spoke.slice(spoke.indexOf("i am ") + 4); ///Slices the string a little more than the last
            computerVoice.speak("hello" + newSentence2 + ", i am your computer bully");
            speaking = "hello" + newSentence2 + ", i am your computer bully";
        }
        //This if loop checks if the string starts with "you are"
        else if(spoke.startsWith("you are ")) {
            let comeback = spoke.slice(spoke.indexOf(" ") + 4); //Slices the string to after the are
            computerVoice.speak("yo mama " + comeback); //Makes speech synthesizer speak a yo mama comeback to the users insult
            speaking = "yo mama " + comeback; //Changes the text displayed the yo mama comeback
        }
        //This if statement checks if the string starts with "your", "you're" or "you" and does the same thing as the last
        else if(spoke.startsWith("your ") || spoke.startsWith("you're ") || spoke.startsWith("you ")) {
            let comeback = spoke.slice(spoke.indexOf(" ") + 1); //This time the slice method only cuts the first word
            computerVoice.speak("yo mama " + comeback);
            speaking = "yo mama " + comeback;
        }
        //This if statement checks if the string starts wit "why"
        else if(spoke.startsWith("why ")) {
            let chosenInsult = random(insultList.jokes); //Assigns a random string from the JSON file to a variable
            computerVoice.speak("because " + chosenInsult); //Makes voice synthesizer speak chosen insult 
            speaking = "because " + chosenInsult; //Displays spoken insult 
        }
        //This if loop only initiates if the randomly assigned interruption value is 4
        else if(interruption == 4 && state === "robotReady") {
            let chosenQuip = random(insultList.quips); //Randomly assigns a string from the JSON file to the chosenQuip variable 
            computerVoice.speak(chosenQuip); //Speaks chosen quip
            speaking = chosenQuip; //Displays chosen quip 
        }
        //This else statement repeats whatever the user says, excluding the conditions above, with a random annoying ending 
        else {
            let chosenEnding = random(insultList.ending); //Assigns random ending to the variable 
            console.log(interruption);
            computerVoice.speak(spoke + ", " + chosenEnding); //Speaks string with chosen ending 
            speaking = spoke + ", " + chosenEnding; //Displays the spoken string with chosen ending
        }
        console.log(spoke);
    }
}


//This function is the callback function for one of the commands
function shutUpResponse() {
    let chosenResponse = random(insultList.response); //Randomly chooses a response to shut up and assigns it to the variable
    computerVoice.speak(chosenResponse); //Speaks randomly chosen response 
    speaking = chosenResponse; //Displays response 
}


//Function that is assigned to the command callback 
function howResponse() {
    let chosenFeeling = random(insultList.feelings); //Randomly picks a feeling for the robot and assigns the variable 
    computerVoice.speak(chosenFeeling); //Speaks the randomly assigned feeling
    speaking = chosenFeeling; //Displays that feeling
}


//Function also assigned to the command callback
function originStory() {
    //Switch case statement that handles the origin story of the robot 
    switch (storyState) {
        case 1:
            let line1 = random(insultList.beginning); //Picks the beginning of the story randomly
            computerVoice.speak(line1); //Speaks the beginning of the story
            speaking = line1; //Displays beginning
            storyState = 2; //Changes the state of the story so that the next time the user asks it'll be the middle
            break; //Breaks the switch case statement when the case is over
        case 2:
            let line2 = random(insultList.middle); //Picks the middle of the story randomly 
            computerVoice.speak(line2); //Does the same as before but the middle 
            speaking = line2; 
            storyState = 3; //Changes the state of the story to be the end of the story next time the user asks 
            break;
        case 3:
            let line3 = random(insultList.end); //Randomly picks an ending to the story 
            computerVoice.speak(line3);
            speaking = line3;
            state = "weak"; //Resets the story state to make a new story 
            break;  
    }
}


//This function is called when the model of the AI is loaded 
function modelLoaded() {
    console.log("Model Loaded"); //Logs it onto console
}


//This function checks if the robot is dead
function checkIfDefeated() {
    //Changes the state if the robots health has reached 0
    if(robotHealth === 0 && state === "weak") {
        setTimeout(switchState1, 3000); //Switches states after 3 seconds so the robot can finish his sentence
    }
}

//Switches states for timeout function above
function switchState1() {
    state = "decision";
}


//This function changes the color of the robot if hes been hurt
function robotHurt() {
    robotHead.fill.r = 250;
    robotHead.fill.g = 40;
    robotHead.fill.b = 0;
    setTimeout(revertBack, 700); //This is a timer function to reset the color after 700ms
}


//This function is to revert the color back 
function revertBack() {
    robotHead.fill.r = 148;
    robotHead.fill.g = 148;
    robotHead.fill.b = 148;
}


//This function displays the buttons when the decision phase of the game starts and allows the opacity to change when the user hovers over the buttons
function buttonSelection() {
    let d1 = dist(mouseX, mouseY, forgiveButton.x, forgiveButton.y); //Contains distance between users mouse and the forgive button
    let d2 = dist(mouseX, mouseY, killButton.x, killButton.y); //Contains distance between users mouse and the kill button

    //Checks if mouse is over button and changes opacity 
    if(d1 < forgiveButton.size / 2 && state === "decision") {
        forgiveButton.alpha = 100;
    }
    else if(d2 < killButton.size / 2 && state === "decision") {
        killButton.alpha = 100;
    }
    //Returns the opacity to normal when mouse is off
    else {
        forgiveButton.alpha = 255;
        killButton.alpha = 255;
    }
    
    //Displays the buttons
    push();
    fill(255, 0, 0, forgiveButton.alpha);
    ellipse(forgiveButton.x, forgiveButton.y, forgiveButton.size);
    fill(255, 0, 0, killButton.alpha);
    ellipse(killButton.x, killButton.y, killButton.size);
    pop();

    //Displays the images on the buttons
    push();
    imageMode(CENTER);
    image(forgiveButton.img, forgiveButton.x, forgiveButton.y, forgiveButton.width, forgiveButton.height);
    image(killButton.img, killButton.x, killButton.y, killButton.width, killButton.height);
    pop(); 
    
    //Displays the text
    push();
    fill(0);
    textAlign(CENTER);
    textSize(50);
    text("THE COMPUTER BULLY IS TRYING", width/2, 200);
    text("TO ENTER THE REAL WORLD", width/2, 250);
    textSize(30);
    text("Pick between killing or forgiving it", width/2, 310);
    pop();

    computerVoice.stop();
}


//Function that starts after the model has been loaded
function running(poses) {
    //Starts when there is a pose to detect and assigns the pose array to the pose variable and the skeleton array to the skeleton variable
    if(poses.length > 0) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
    }
    //Turns true when poseNet is loaded
    isOn = true;
}


//Changes state when poseNet is loaded
function loading() {
    console.log(`Loading PoseNet`);
    state = "title";
}


//Function that contains the entire kill game
function poseNetGame() {
    computerVoice.stop(); //Stops computer bully from talking
    translate(width, 0); //Moves position of video to flip video
    scale(-1, 1); //Mirrors video
    image(video, 0, 0, width, height); //Displays video

    //Saves the time in the savedTime variable as soon as the game starts 
    if(!starting) {
        savedTime = millis();
    }
    
    //Ensures to only start if statement when poses are detected
    if (pose) {
      let d1 = dist(pose.leftWrist.x, pose.leftWrist.y, robotBully.x, robotBully.y); //Contains distance from left wrist to robot bully
      let d2 = dist(pose.rightWrist.x, pose.rightWrist.y, robotBully.x, robotBully.y); //Contains distance from right wrist to robot bully
      let d3 = dist(pose.rightEye.x, pose.rightEye.y, pose.leftEye.x, pose.leftEye.y); //Contains distance from left eye to right eye

      //This if statement detects if the user is far enough by detecting how close the eyes are together
      //It does this to tell the user he needs to move back for a proper playing experience 
      if(d3 > 40) { 
        push();
        noStroke();
        translate(width, 0);
        scale(-1, 1); //Flips text cause image is flipped
        fill(180, backAlpha);
        rectMode(CENTER, CENTER);
        rect(320, 240, width, height); //Displays rectangle over image to grey it out 
        fill(0, backAlpha);
        textAlign(CENTER);
        textSize(50);
        text("Back Up", width/2, height/2);
        pop();
        farEnough = false;
      }
      //Changes opacity to 0 when user is far enough
      else {
        backAlpha = 0;
        farEnough = true;
      }
      
      //This for loop connects all the necessary lines to draw the skeleton 
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0]; //All the x positions of the skeleton keypoints
        let b = skeleton[i][1]; //All the y positions of the skeleton keypoints
        strokeWeight(3);
        stroke(lineColor.r, lineColor.g, lineColor.b);
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
      
      //Changes color of skeleton to green when the user is touching the robot with his hands and changes the image 
      if(d1 < robotBully.height && farEnough) {
        lineColor.r = 0;
        lineColor.g = 255;
        lineColor.b = 0;
        damagedRobot(); //Calls the damage function3
      }
      else if(d2 < robotBully.height && farEnough) {
        lineColor.r = 0;
        lineColor.g = 255;
        lineColor.b = 0;
        damagedRobot();
      }
      //If hand isnt touching robot, displays normal image of robot and color of skeleton
      else if(farEnough) {
        lineColor.r = 255;
        lineColor.g = 255;
        lineColor.b = 255;
        drawRobotBully();
      }
    }  
    
    //Displays all the graphics used in the kill game (health bar, robot bully, countdown) and inputs the enemies movement only when user is far enough 
    if(isOn && state == "running" && farEnough) {
      starting = true; //Stops time for continuously recording 
      startTime = millis() - savedTime; //Starts time exactly when the game is on
      enemyMovement();
      healthBar(robotBully.health, 320, 460);
      displayCountdown();
    }
}


//Function that contains the entire forgive game
function poseNetGame2() {
    computerVoice.stop(); 
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
  
    meter = constrain(meter, 0, 400); //Constrains the growth of the corruption meter to the proper dimensions so it wont go out of bounds

    //Same thing as before for the countdown
    if(!starting) {
        savedTime = millis();
    }
    
    //Only starts when detecting users body 
    if (pose) {
      let d1 = dist(pose.leftShoulder.x, pose.leftShoulder.y, robotBully.x, robotBully.y); //Contains distance from left shoulder to robot bully
      let d2 = dist(pose.rightShoulder.x, pose.rightShoulder.y, robotBully.x, robotBully.y); //Contains distance from right shoulder to robot bully
      let d3 = dist(pose.rightKnee.x, pose.rightKnee.y, robotBully.x, robotBully.y); //Contains distance from right knee to robot bully
      let d4 = dist(pose.leftKnee.x, pose.leftKnee.y, robotBully.x, robotBully.y); //Contains distance from left knee to robot bully
      let d5 = dist(pose.nose.x, pose.nose.y, robotBully.x, robotBully.y); //Contains distance from nose to robot bully
      let d6 = dist(pose.rightHip.x, pose.rightHip.y, robotBully.x, robotBully.y); //Contains distance from right hip to robot bully
      let d7 = dist(pose.leftHip.x, pose.leftHip.y, robotBully.x, robotBully.y); //Contains distance from left hip to robot bully
      let d8 = dist(pose.rightEye.x, pose.rightEye.y, pose.leftEye.x, pose.leftEye.y); //Contains distance from left eye to right eye

      //Same thing as before for the proper distance to play game
      if(d8 > 40) {
        backAlpha = 100;
        push();
        noStroke();
        translate(width, 0);
        scale(-1, 1);
        fill(180, backAlpha);
        rectMode(CENTER, CENTER);
        rect(320, 240, width, height);
        fill(0, backAlpha);
        textAlign(CENTER);
        textSize(50);
        text("Back Up", width/2, height/2);
        pop();
        farEnough = false;
      }
      else {
        backAlpha = 0;
        farEnough = true;
      }
  
      //Same thing as before for skeleton display
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        strokeWeight(3);
        stroke(lineColor.r, lineColor.g, lineColor.b);
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }

      //Only detects if the user is far enough
      if(farEnough) {
        //Checks if robot bully is touching user, if it is, increases corruption meter and turns skeleton red 
        if(d1 < robotBully.height) {
            lineColor.r = 255;
            lineColor.g = 0;
            lineColor.b = 0;
            meter += robotBully.damage;
        }
        else if(d2 < robotBully.height) {
            lineColor.r = 255;
            lineColor.g = 0;
            lineColor.b = 0;
            meter += robotBully.damage;
        }
        else if(d3 < robotBully.height) {
            lineColor.r = 255;
            lineColor.g = 0;
            lineColor.b = 0;
            meter += robotBully.damage;
        }
        else if(d4 < robotBully.height) {
            lineColor.r = 255;
            lineColor.g = 0;
            lineColor.b = 0;
            meter += robotBully.damage;
        }
        else if(d5 < robotBully.height) {
            lineColor.r = 255;
            lineColor.g = 0;
            lineColor.b = 0;
            meter += robotBully.damage;
        }
        else if(d6 < robotBully.height) {
            lineColor.r = 255;
            lineColor.g = 0;
            lineColor.b = 0;
            meter += robotBully.damage;
        }
        else if(d7 < robotBully.height) {
            lineColor.r = 255;
            lineColor.g = 0;
            lineColor.b = 0;
            meter += robotBully.damage;
        }
        //Returns skeleton to normal color 
        else {
            lineColor.r = 255;
            lineColor.g = 255;
            lineColor.b = 255;
        }
      } 
    }  
    
    //Displays all graphics similar to before, but this time it displays the robot bully since the image is not changing and displays corruption meter
    if(isOn && state == "running2" && farEnough) {
        starting = true;
        startTime = millis() - savedTime;
        drawRobotBully();
        enemyMovement();
        corruptionMeter(meter, 320, 460);
        displayCountdown();
      }
}


//Displays the image of robot bully and centers the origin 
function drawRobotBully() {
    push();
    imageMode(CENTER);
    image(robotBully.img, robotBully.x, robotBully.y, robotBully.width, robotBully.height);
    pop();
}
 

//Displays the damaged image of the robot bully and reduces health bar
function damagedRobot() {
    push();
    imageMode(CENTER);
    image(robotBully.img2, robotBully.x, robotBully.y, robotBully.width, robotBully.height);
    pop();
    robotBully.health += -0.5; //Lowers health variable and shrinks width of health bar
}


//Function that contains the movement of the robot head
function enemyMovement() {
    let r = random(0, 1); //Selects random number constantly to give the robot a sporadic motion
    //Gives robot random speed to switch directions and make movement more unpredictable 
    if(r < robotBully.jitter) {
      robotBully.vx = random(-robotBully.speed, robotBully.speed);
      robotBully.vy = random(-robotBully.speed, robotBully.speed);
    }

    //Moves x and y positions of robot to give it motion
    robotBully.x += robotBully.vx; 
    robotBully.y += robotBully.vy;

    //Constrains the motion to stay in the bounds of the canvas
    robotBully.x = constrain(robotBully.x, 60, 580);
    robotBully.y = constrain(robotBully.y, 60, 420);
}
  

//Displays health bar 
function healthBar(health, x, y) {
    push();
    noStroke();
    fill(255);
    rectMode(CENTER, CENTER);
    rect(x, y, 400, 30);
    fill(255, 0, 0);
    rect(x, y, health, 30); //Width changes with damage done to the robot
    pop();
}


//Displays the corruption meter for the kill game
function corruptionMeter(health, x, y) {
    push();
    noStroke();
    fill(255);
    rectMode(CENTER, CENTER);
    rect(x, y, 400, 30);
    fill(255, 0, 0);
    rect(x, y, health, 30);
    pop();
}
  

//Displays the countdown clock in the top right corner of both games
function displayCountdown() {
    push();
    translate(width, 0);
    scale(-1, 1);
    noStroke();
    fill(255, 0, 0);
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(Math.round((countDown - startTime) / 1000), 580, 30); //rounds the result of this small equation to display normal seconds 
    pop();
}


//Used to switch states when robot dies in kill game
function checkIfDead() {
    //Checks the health remaining of the robot and if 0 then switches to the good ending 
    if(robotBully.health <= 0) {
        state = "robotBeat";
    }
}


//Switches state to bad ending if user becomes corrupted in forgive game
function checkIfCorrupted() {
    //When users meter reaches 400 it switches the state
    if(meter >= 400) {
        state = "robotWins2";
    }
}


//Checks time to see if it has reached 0, depending on which game, switches states to a potential ending
function checkTime() {
    //Only switches states if countdown reaches 0
    if(Math.round((countDown - startTime) / 1000) <= 0) {
        //If it hits 0 during the kill game, the robot wins and the bad ending displays
        if(state === "running") {
            state = "robotWins";
        }
        //If it hits 0 during the kill game, the user wins and the good ending displays
        else if(state === "running2"){
            state = "robotBeat2";
        }
    }
}


//Displays the image for the forgive game good ending 
function displayGoodForgiveEnding() {
    push();
    image(forgiveGoodEndingImage, 0, 0);
    pop();
    computerVoice.speak("thank you"); //Lets computer say a heartful thank you 
    setTimeout(endGame, 3000); //Changes the state of the game to the final screen after 3 seconds
}


//Displays the image for the kill game good ending 
function displayGoodKillEnding() {
    push();
    image(killGoodEndingImage, 0, 0);
    pop();
    computerVoice.speak("you killed me you fool"); //Computer has his last words
    setTimeout(endGame, 3000);
}


//Displays the robots head over the users head to simulate them becoming the bully
function displayBadForgiveEnding() {
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);

    robotBully.x = pose.nose.x; //Sets robots x position to th nose x position
    robotBully.y = pose.nose.y; //Sets robots y position to th nose y position
    drawRobotBully(); //Redraws the robot head

    computerVoice.speak("you have now become me"); //Computer affirms the transformation  
    setTimeout(endGame, 3000);
}


//Displays the bad end screen for the kill game
function displayBadKillEnding() {
    push();
    image(killBadEndingImage, 0, 0);
    pop();
    computerVoice.speak("i am finally free, now to bully the rest of the world"); //Lets the computer scream his victory chant 
    setTimeout(endGame, 5000);
}


//This function changes the state of the game after its called 
function endGame() {
    //Ensures that the state only changes in the correct sequence
    computerVoice.stop(); //Stops the computer from talking 
    //Changes the state of the game end screens when called 
    if(state === "robotBeat" || state === "robotBeat2" || state === "robotWins" || state === "robotWins2") {
        state = "robotDefeated";
    }
}


//This function is called when the mouse is pressed 
function mousePressed() {
    let insultPicked = random(insultList.jokes); //Randomly picks an insult and assigns to a variable 
    let d1 = dist(mouseX, mouseY, forgiveButton.x, forgiveButton.y); //Contains the distance from the mouse to the forgive button
    let d2 = dist(mouseX, mouseY, killButton.x, killButton.y); //Contains the distance from the mouse to the kill button

    //Lets robot insult user when clicked during phase 1 and 2 of the robot game
    if(state === "robotReady" || state === "weak") {
        computerVoice.speak(insultPicked); //Speaks random insult 
        speaking = insultPicked; //Displays random insult
    }

    //Changes the state of the game when the user clicks either the forgive or the kill button
    if(d1 < forgiveButton.size / 2 && state === "decision") {
        state = "forgiveSlide";
    }
    else if(d2 < killButton.size / 2 && state === "decision") {
        state = "killSlide";
    }
}


//This function allows the user to reset the game back after finishing
function keyPressed() {
    //This if statement checks that it's in the correct state and pressing the right key
    if(state === "robotDefeated" && keyCode === ENTER) {
        state = "Endend"; //Switches state to the end end
    }
    //Starts the fade out transition when the user clicks enter during the title screen
    else if(state === "title" && keyCode === ENTER) {
        startTransition1 = true;
    }
    //Changes state when user clicks enter during mission state
    else if(state === "mission" && keyCode === ENTER) {
        state = "robotReady"; //Changes the state
    }
    //Changes state when user clicks enter during forgive instruction state
    else if(state === "forgiveSlide" && keyCode === ENTER) {
        state = "running2";
    }
    //Changes state when user clicks enter during kill instruction state
    else if(state === "killSlide" && keyCode === ENTER) {
        state = "running";
    }


}

