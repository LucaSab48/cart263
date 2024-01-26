/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

const NUM_ANIMAL_IMAGES = 10;
const NUM_ANIMALS = 100;
const SAUSAGE_DOG_IMAGE = "assets/images/sausage-dog.png";

let animalImages = [];
let animals= [];

let sausageDogImage;
let sausageDog;

let recognition = new p5.SpeechRec();
let bg1 = 0;
let bg2 = 255;
let bg3 = 100;

let computerVoice = new p5.Speech();
let winningMessage = ["Congratulations", "Nice job", "Look who found me", "Somebodies smart", "Took you long enough"];


function preload() {
    for (let i = 0; i < NUM_ANIMAL_IMAGES; i++){
        let animalImage = loadImage(`assets/images/animal${i}.png`);
        animalImages.push(animalImage);
    }
    
    sausageDogImage = loadImage(SAUSAGE_DOG_IMAGE);
}


/**
Description of setup
*/
function setup() {
    createCanvas(windowWidth, windowHeight);
    createAnimals();
    createSausageDog();

    recognition.continuous = true;
    recognition.onResult = handleResult;
    recognition.start();
}


function createAnimals() {
    for (let i = 0; i < NUM_ANIMALS; i++) {
        let animal = createRandomAnimals();
        animals.push(animal);
    }
}


function createRandomAnimals() {
    let x = random(0, width);
    let y = random(0, height);
    let animalImage = random(animalImages);
    let animal = new Animal(x, y, animalImage);
    return animal;
}


function createSausageDog() {
    let x = random(0, width);
    let y = random(0, height);
    sausageDog = new SausageDog(x, y, sausageDogImage);
}

/**
Description of draw()
*/
function draw() {
    background(bg1, bg2, bg3);
    updateAnimals();
    updateSausageDog();
}


function updateAnimals() {
    for (let i = 0; i < animals.length; i++) {
        animals[i].update();
    } 
}


function updateSausageDog() {
    sausageDog.update();
}


function mousePressed() {
    sausageDog.mousePressed();
    
    if (sausageDog.found) {
        let play = random(winningMessage);
        computerVoice.speak(play);
    }
}


function handleResult() {
    let spoke = recognition.resultString;
    if(recognition.resultValue) {
        console.log(spoke);
    }

    switch(spoke) {
        case 'pink':
            bg1 = 255;
            bg2 = 16;
            bg3 = 200;
        break;
        case "red":
            bg1 = 255;
            bg2 = 10;
            bg3 = 50;
        break;
        case "purple":
            bg1 = 230;
            bg2 = 200;
            bg3 = 255;
        break;
    }
}