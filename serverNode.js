var express = require('express');
var app = express();
var server =  app.listen(3000);
console.log("server is live..");
app.use(express.static('public'));

var socket = require('socket.io');
var io = socket(server);
//array for sockets
var ids = [];


io.sockets.on('connection', function(socket){
	//add the id on ids array
	ids.push({id: socket.id, user: "n", kills: 0, deaths: 0});
	//who has connected the server
	console.log("Player connected "+ socket.id);
	//total clients connected
	console.log("Total connections: "+ids.length);
	//send id to client
	socket.emit('playerID', socket.id );
	//send the ids array with the clients previously connected at server
	socket.emit('previousPlayers', ids);
	//sends to all clients that a new player has connected
	socket.broadcast.emit('NewPlayerID', socket.id);
	//listens to players event 'player' that sends its cordenates
	socket.on('player', function(data){
		for(var i=0;i<ids.length;i++){
			if (socket.id == ids[i].id){
				ids[i].user = data.user;
			}
		}			//sends to all clients the cordenates of that player
		socket.broadcast.emit('player', data );
		socket.broadcast.emit('killed',ids);
		socket.emit('killed',ids);
	});
	//listens to the event 'newShot' when a player shoots
	socket.on('newShot', function(data){
		//sends to all clients that a shot has been fired by that player
		socket.broadcast.emit('newShot', data);
	});
	socket.on('killed', function(data){
		for(var i = 0; i < ids.length; i++){
				if (socket.id == ids[i].id){
					ids[i].deaths++;
				}
				if(ids[i].id == data.id){
					ids[i].kills++;
				}
		}
		socket.emit('killed',ids);
		socket.broadcast.emit('killed',ids);
	});
	//listens the disconection of a client
	socket.on('disconnect', function(){
		//who has left the server
		console.log("Player disconected: "+socket.id);
		//goes through the ids array
		for(var i = 0; i<ids.length; i++){
			//checks who is the one that left the server
			if(ids[i].id == socket.id){
				socket.broadcast.emit('playerDisconnected', ids[i]);
				//delet my socket ids[] array
				ids.splice(i,1);
			}
		}
		console.log("Total connections: "+ ids.length);
	});
});
