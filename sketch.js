let handpose;
let video;
let predictions = [];
var batPosX = 0;
var batPosY =height-50;
var batWidth = 100;
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  const options = {
    flipHorizontal: true, // boolean value for if the video should be flipped, defaults to false
    maxContinuousChecks: Infinity, // How many frames to go without running the bounding box detector. Defaults to infinity, but try a lower value if the detector is consistently producing bad predictions.
    detectionConfidence: 0.2, // Threshold for discarding a prediction. Defaults to 0.8.
    scoreThreshold: 0.9, // A threshold for removing multiple (likely duplicate) detections based on a "non-maximum suppression" algorithm. Defaults to 0.75
    iouThreshold: 0.5, // A float representing the threshold for deciding whether boxes overlap too much in non-maximum suppression. Must be between [0, 1]. Defaults to 0.3.
  }
  handpose = ml5.handpose(video,options, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  handpose.on("predict", results => {
    predictions = results;
  });

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  console.log("Model ready!");
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i += 1) {
    const prediction = predictions[i];
	const topLeft = prediction.boundingBox.topLeft;
	
	batPosX = topLeft[0]-150;
	//batPosY = topLeft[1]+125;
	let minX = 0;
	let maxX = 0;
    for (let j = 0; j < prediction.landmarks.length; j += 1) {
      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
	  minX = minX<keypoint[0]?minX:keypoint[0];
	  maxX = maxX>keypoint[0]?maxX:keypoint[0];
      ellipse(keypoint[0], keypoint[1], 10, 10);
    }
	batWidth = maxX-minX;
	console.log("Width : "+ batWidth)
	console.log((batWidth/100)*50)
	rect(batPosX,batPosY,(batWidth/100)*50,20)	
  }
}
