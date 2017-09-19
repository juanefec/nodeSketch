var socket;

var s; //variable for player object

var sID; //store for our client id given us by the socket.io server

var enemysData = []; //array for storing enemy data

var shots = []; //array for storing shoting data

var v = 6; //velocity of the player

var username = ""; //it will if typed the username of the player

var killer = "";//stores de user that killed you

var scores = [];//array for player scores

var textTimer;

function setup(){    //setup function from p5.js
	createCanvas(1300,600);
	socket = io.connect('http://192.168.1.5:3000');
	socketListener();
	username = sID;
	s = new Snake();
	noCursor();
}

function draw (){
	reciver();
	noStroke();    //draw loop p5.js
	background(72);
	if (s.life > 0){
  	runGame();
	}else{
		deadScreen();
	}
}
function reciver(){

	textSize(32);
	text("hola" , 250, 0);

}
function mousePressed(){  // *TRIGGERD* when mouse pressed
	if(s.life>0){
		shots.push(new Shot(s.x,s.y,mouseX,mouseY,false,sID,username));
		socket.emit('newShot', {id: sID, x: s.x, y: s.y, tx: mouseX, ty: mouseY,  e: true, user: username} );

	}

}
function keyPressed() {   // *TRIGGERD* with keys

  if (keyCode === UP_ARROW){
    s.dir(0,-v);
  }
  if (keyCode === DOWN_ARROW){
    s.dir(0,v);
  }
  if (keyCode === RIGHT_ARROW){
    s.dir(v,0);
  }
  if (keyCode === LEFT_ARROW){
    s.dir(-v,0);
  }

}
function keyReleased() {
var a;
  if (keyCode === UP_ARROW){
		a = false;
    s.sm(a);
  }
  if (keyCode === DOWN_ARROW){
		a = false;
    s.sm(a);
  }
  if (keyCode === RIGHT_ARROW){
		a = true;
    s.sm(a);
  }
  if (keyCode === LEFT_ARROW){
		a = true;
    s.sm(a);
  }

}
