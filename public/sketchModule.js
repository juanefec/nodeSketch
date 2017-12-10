function socketListener(){
	socket.on('playerID', (data) => {
		sID = data;
		console.log("My ID: " + sID);
	});
	socket.on('NewPlayerID', (data) => {
		console.log("New player, ID: "+ data);
		if (data != sID){
			enemysData.push({id: data, x: -150, y: -150});
		}
	});
	socket.on('previousPlayers', (data) => {
		data.forEach( d => {		
			if(d.id != sID){
				enemysData.push({id: d.id, x: -150, y: -150});
				console.log("Adding previous player, ID: "+ d.id);
			}
		});
	});
	socket.on('player', (data) => {
			for(let i = 0; i < enemysData.length; i++){
					if (enemysData[i].id == data.id){
						enemysData[i] = data;
					}
			}
	});
	socket.on('newShot', ({x,y,tx,ty,e,id,user}) => {
		if (s.life>0){
			shots.push(new Shot(x,y,tx,ty, e, id, user));
		}
	});
	socket.on('playerDisconnected', ({id}) => {
		for(let i = 0; i < enemysData.length; i++){
			if(id == enemysData[i].id){
				enemysData.splice(i,1);
				console.log("desconectado");
				textTimer = 150;
			}
		}
	});
	socket.on('killed', (data) => {
		scores = data;
		scores.sort(( a, b) => {
			return b.kills - a.kills;
		});
	});
}
function runGame(){
	s.updateShow(username);
	multiManager();
	coliderCheck();
	leaderBoard();
	aimer();
	username = user.value;	
	socket.emit('player', {id: sID, x: s.x,	y: s.y,	life: s.life, user: username});
}
function deadScreen(){
	noStroke();
	fill(255,30,35);
	textSize(35);
	text("You are dead.", width/2-150,height/2-90);
	text(killer+" killed you.", width/2-150,height/2-45);
	text("Type p to re-join.", width/2-150,height/2-5);
	if (key=='p') {
		s.life=500;
	}
}
function aimer (){
	rectMode(CENTER);
	rect(mouseX,mouseY,4,18);
	rect(mouseX,mouseY,18,4);	
}
function leaderBoard(){
	textSize(26);
	if (textTimer > 0){
		let a = map(textTimer, 150, 0, 255, 0);
		fill(80,205,190,a);
		text("Player disconected", 450, 60);
		textTimer--;
	}
	fill(80,205,190);
	try{
		for (let i = 0; i < scores.length; i++){
			text(i+1+":",width-170,25+i*25);
			text(scores[i].kills+"/"+scores[i].deaths,width-140,25+i*25);
			text(scores[i].user ,width-95, 25+i*25);
	}
	} catch(e){
		console.log("YO",e)
	}

}
function coliderCheck(){
	for(let i = 0; i < enemysData.length; i++){
		for(let j = 0; j < shots.length; j++){
			let d = dist(shots[j].pos.x,shots[j].pos.y,enemysData[i].x,enemysData[i].y);
			if ( d < 35){
				if(shots[j].id != enemysData[i].id){
				shots.splice(j,1);
				}
			}
		}
	}
	for (let i = 0; i < shots.length; i++){
		let d = dist(shots[i].pos.x,shots[i].pos.y,s.x,s.y);
		if (d<35 && shots[i].e){
			s.life-=30;
			if (s.life < 0){
				killer = shots[i].user;
				socket.emit('killed',{id: shots[i].id, user: killer, did: sID, duser: username});
			}
			shots.splice(i,1);


		}
	}
	for(let i = 0; i < shots.length; i++){
    if (shots[i].pos.x < 0 || shots[i].pos.x > width || shots[i].pos.y < 0 || shots[i].pos.y > height){
			fill(230,155);
			if (shots[i].pos.x < 0){ellipse(0,shots[i].pos.y, 30,30);}
			if (shots[i].pos.x > width){ellipse(width,shots[i].pos.y, 30,30);}
			if (shots[i].pos.y < 0){ellipse(shots[i].pos.x,0, 30,30);}
			if (shots[i].pos.y > height){ellipse(shots[i].pos.x,height, 30,30);}
      shots.splice(i,1);
    }
  }
}
function multiManager(){
	for(let i = 0; i < enemysData.length; i++){
		if (enemysData[i].life>0){
			let r = map(enemysData[i].life, 500,0,0,50);
			fill(165,35,82);
			ellipse(enemysData[i].x, enemysData[i].y, 50, 50);
			fill(255,25,25,);
    	ellipse(enemysData[i].x, enemysData[i].y, r, r);
			if (enemysData[i].user){
	      textSize(16);
	      fill(255);
	      text(enemysData[i].user, enemysData[i].x-16, enemysData[i].y);
	    }
		}else {
			enemysData[i].x=-150;
			enemysData[i].y=-150;
		}
	}
	for (let i = 0; i < shots.length; i++){
		shots[i].showUpdate();
	}
}
