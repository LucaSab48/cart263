/**
Title of Project
Author Name

This is a template. You must fill in the title,
author, and this description to match your project!
*/

"use strict";

let video;
let poseNet;
let pose;
let skeleton;
let lineColor = {
  r: 255,
  g: 255, 
  b: 255
};
let circle1 = {
  x: 300,
  y: 100,
  width: 100,
  height: 100,
  isTouching: false,
  img: undefined
}


function preload() {
  circle1.img = loadImage("assets/images/robotBully1.png");
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
  image(video, 0, 0);
  drawCircle1();

  if (pose) {
    let d = dist(pose.leftWrist.x, pose.leftWrist.y, circle1.x, circle1.y);
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(255, 0, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(lineColor.r, lineColor.g, lineColor.b);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }

    if(d < circle1.height) {
      lineColor.r = 0;
      lineColor.g = 255;
      lineColor.b = 0;
    }
    else {
      lineColor.r = 255;
      lineColor.g = 255;
      lineColor.b = 255;
    }
  }
}


function drawCircle1() {
  image(circle1.img, circle1.x, circle1.y, circle1.width, circle1.height);
}


