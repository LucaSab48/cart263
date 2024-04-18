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
        "command": ["shut up", "shut your mouth", "stop talking", "shush", "shut it"],
        "callback": shutUpResponse
    },
    {
        "command": ["how are you", "how is it going", "how's it going", "how are you feeling", "how do you feel", "how's the weather", "what's up", "what is up", "how's your day going", "how is your day going"],
        "callback": howResponse
    },
    {
        "command": ["who are you", "who made you", "what are you", "why are you like this", "what's your story", "why are you so mean", "why do you do this"],
        "callback": originStory
    }
];

let emotion; //This will contain the AI Sentiment model
let emotionScore = 0; //This will contain the prediction from the AI model
let robotHealth = 3; //This is the amount of health the robot has

//User video
let video;
let isOn = false;
let countDown = 60000;
let startTime;
let starting = false;
let savedTime;
let poseNet;
let pose;
let skeleton;
let lineColor = {
  r: 255,
  g: 255, 
  b: 255
};
let robotBully = {
  x: 300,
  y: 100,
  width: 120,
  height: 120,
  speed: 5,
  vx: 0, 
  vy: 0,
  jitter: 0.05,
  health: 400,
  img: undefined,
  img2: undefined
}



//This function preloads the JSON file and assigns it to the insultList variable
function preload() {
    insultList = loadJSON("assets/data/insults.json");
    robotBully.img = loadImage("assets/images/robotBully2.png");
    robotBully.img2 = loadImage("assets/images/robotBullyDamaged1.png");
}


//The setup function creates the canvas and activates the voice recognition
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
}


//This function switches the state of my game
function draw() {
    //This if statement switches the states
    if(state === "loading") {
        background(255)
        textAlign(CENTER);
        textSize(50);
        text("Loading models", width/2, height/2);
    }
    else if(state === "robotReady") {
        background(220, 208, 255); //Sets color of the background
        textDisplay(); //Display text function
        displayRobot(); //Display robot function
        emotionPercentage(); //Displays emotion percentage
        robotHealthDisplay(); //Displays robot health
        checkIfDefeated(); //Check if the robot has been defeated
    }
    else if(state === "running") {
        resizeCanvas(640, 480);
        poseNetGame();
        checkIfDead();
    }
    else if(state === "robotBeat") {
        resizeCanvas(640, 480);
        background(220, 208, 255); //Sets color of the background
        textDisplay(); //Display text function
        displayRobot(); //Display robot function
        displayDefeatingMessage(); //Displays instructions to beat robot
    }
    else if(state === "robotDefeated") {
        winningDisplayMessage(); //Displays winning message
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
    text("Positivity Meter: " + emotionScore + "%", 500, 600); 
}


//This function displays the health of the computer bully
function robotHealthDisplay() {
    let robotHealthDrawn = 1; //This is to set my condition for my while loop
    let x = 400; //This is the position of the first circle
    //This while loop will draw and update the health of my computer bully
    while(robotHealthDrawn <= robotHealth) {
        fill(255, 10, 50);
        ellipse(x, 650, 50);
        x = x + 100;
        robotHealthDrawn += 1;
    }
}


//This function displays the instructions to beat the robot after hurting him with positive words
function displayDefeatingMessage() {
    textAlign(CENTER);
    textSize(30);
    fill(0);
    text("Forgive the robot to defeat him", 500, 600);
    text("Say: all is forgiven", 500, 650)
}


//This function displays the winning message after defeating the robot
function winningDisplayMessage() {
    background(0);
    fill(255);
    textAlign(CENTER);
    textSize(50);
    text("You defeated the computer bully!", width/2, height/2);
    textSize(30);
    text("Press ENTER to restart", width/2, 450);
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
    if(prediction.score > 0.95) {
        let happyResponse = random(insultList.happy);
        computerVoice.speak(happyResponse); //Here i am assigning a random insult from my JSON
        speaking = happyResponse;
        robotHealth += -1; //This is removing health from the computer bully
        robotHurt(); //This calls a function to show some damage being done to the robot
        return; //This is to stop the function from going through the rest of the conditions 
    }
    else if(prediction.score < 0.05) {
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
        //This statement is checking if the user says the key phrase to end the robot
        else if(spoke === "all is forgiven" && state === "robotBeat") {
            computerVoice.speak("oh no");
            setTimeout(endGame, 1000); //Changes the state after 1000ms
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
            storyState = 1; //Resets the story state to make a new story 
            break;  
    }
}


//This function is called when the model of the AI is loaded 
function modelLoaded() {
    console.log("Model Loaded"); //Logs it onto console
    state = "robotReady"; //Changes state to start program
}


//This function checks if the robot is dead
function checkIfDefeated() {
    //Changes the state if the robots health has reached 0
    if(robotHealth === 0) {
        state = "running";
    }
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


function running(poses) {
    console.log(poses);
    if(poses.length > 0) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
    }
    isOn = true;
}


function loading() {
    push();
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(`Loading PoseNet`, width / 2, height / 2);
    pop();
}


function poseNetGame() {
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);

    if(!starting) {
        savedTime = millis()
    }
  
    if (pose) {
      let d1 = dist(pose.leftWrist.x, pose.leftWrist.y, robotBully.x, robotBully.y);
      let d2 = dist(pose.rightWrist.x, pose.rightWrist.y, robotBully.x, robotBully.y);
  
      // for (let i = 0; i < pose.keypoints.length; i++) {
      //   let x = pose.keypoints[i].position.x;
      //   let y = pose.keypoints[i].position.y;
      //   fill(255, 0, 0);
      //   ellipse(x, y, 16, 16);
      // }
  
      for (let i = 0; i < skeleton.length; i++) {
        let a = skeleton[i][0];
        let b = skeleton[i][1];
        strokeWeight(3);
        stroke(lineColor.r, lineColor.g, lineColor.b);
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
  
      if(d1 < robotBully.height) {
        lineColor.r = 0;
        lineColor.g = 255;
        lineColor.b = 0;
        damagedRobot();
      }
      else if(d2 < robotBully.height) {
        lineColor.r = 0;
        lineColor.g = 255;
        lineColor.b = 0;
        damagedRobot();
      }
      else {
        lineColor.r = 255;
        lineColor.g = 255;
        lineColor.b = 255;
        drawRobotBully();
      }
    }  
    
    if(isOn && state == "running") {
      starting = true;
      startTime = millis() - savedTime;
      enemyMovement();
      healthBar(robotBully.health, 320, 460);
      displayCountdown();
    }
}


function drawRobotBully() {
    push();
    imageMode(CENTER);
    image(robotBully.img, robotBully.x, robotBully.y, robotBully.width, robotBully.height);
    pop();
}
  
  
function damagedRobot() {
    push();
    imageMode(CENTER);
    image(robotBully.img2, robotBully.x, robotBully.y, robotBully.width, robotBully.height);
    pop();
    robotBully.health += -0.5;
}
  
  
function enemyMovement() {
    let r = random(0, 1);
    if(r < robotBully.jitter) {
      robotBully.vx = random(-robotBully.speed, robotBully.speed);
      robotBully.vy = random(-robotBully.speed, robotBully.speed);
    }
  
    robotBully.x += robotBully.vx;
    robotBully.y += robotBully.vy;
    robotBully.x = constrain(robotBully.x, 0, 640);
    robotBully.y = constrain(robotBully.y, 0, 480);
}
  
  
function healthBar(health, x, y) {
    push();
    noStroke();
    fill(0);
    rectMode(CENTER, CENTER);
    rect(x, y, 400, 30);
    fill(255, 0, 0);
    rect(x, y, health, 30);
    pop();
}
  
  
function displayCountdown() {
    push();
    translate(width, 0);
    scale(-1, 1);
    noStroke();
    fill(255, 0, 0);
    textSize(32);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(Math.round((countDown - startTime) / 1000), 580, 30);
    pop();
}


function checkIfDead() {
    if(robotBully.health <= 0) {
        state = "robotBeat"
    }
}


//This function changes the state of the game after its called 
function endGame() {
    //Ensures that the state only changes in the correct sequence
    if(state === "robotBeat") {
        state = "robotDefeated";
    }
}


//This function is called when the mouse is pressed 
function mousePressed() {
    let insultPicked = random(insultList.jokes); //Randomly picks an insult and assigns to a variable 
    computerVoice.speak(insultPicked); //Speaks random insult 
    speaking = insultPicked; //Displays random insult 
}


//This function allows the user to reset the game back after finishing
function keyPressed() {
    //This if statement checks that it's in the correct state and pressing the right key
    if(state === "robotDefeated" && keyCode === ENTER) {
        robotHealth = 3; //Resets robot health
        state = "robotReady"; //Changes the state back
    }
}

