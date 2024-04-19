/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

let isOn = false;
let countDown = 60000;
let startTime;
let video;
let poseNet;
let pose;
let skeleton;
let meter = 0;
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
  jitter: 0.1,
  damage: 0.5,
  img: undefined,
  img2: undefined
}


function preload() {
  robotBully.img = loadImage("assets/images/robotBully2.png");
  robotBully.img2 = loadImage("assets/images/robotBullyDamaged1.png");
}


function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, loading);
  poseNet.on('pose', running);
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


function draw() {
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  meter = constrain(meter, 0, 400);

  if (pose) {
    let d1 = dist(pose.leftShoulder.x, pose.leftShoulder.y, robotBully.x, robotBully.y);
    let d2 = dist(pose.rightShoulder.x, pose.rightShoulder.y, robotBully.x, robotBully.y);
    let d3 = dist(pose.rightKnee.x, pose.rightKnee.y, robotBully.x, robotBully.y);
    let d4 = dist(pose.leftKnee.x, pose.leftKnee.y, robotBully.x, robotBully.y);
    let d5 = dist(pose.nose.x, pose.nose.y, robotBully.x, robotBully.y);
    let d6 = dist(pose.rightHip.x, pose.rightHip.y, robotBully.x, robotBully.y);
    let d7 = dist(pose.leftHip.x, pose.leftHip.y, robotBully.x, robotBully.y);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(255, 0, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(3);
      stroke(lineColor.r, lineColor.g, lineColor.b);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }

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
    else {
      lineColor.r = 255;
      lineColor.g = 255;
      lineColor.b = 255;
    }
  }  
  
  if(isOn) {
    drawRobotBully();
    enemyMovement();
    corruptionMeter(meter, 320, 460);
    displayCountdown();
  }
}


function drawRobotBully() {
  push();
  imageMode(CENTER);
  image(robotBully.img, robotBully.x, robotBully.y, robotBully.width, robotBully.height);
  pop();
}


function enemyMovement() {
  let r = random(0, 1);
  if(r < robotBully.jitter) {
    robotBully.vx = random(-robotBully.speed, robotBully.speed);
    robotBully.vy = random(-robotBully.speed, robotBully.speed);
  }

  robotBully.x += robotBully.vx;
  robotBully.y += robotBully.vy;
  robotBully.x = constrain(robotBully.x, 60, 580);
  robotBully.y = constrain(robotBully.y, 60, 420);
}


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


function displayCountdown() {
  startTime = millis();
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


