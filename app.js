var express = require('express'),
	app = express();
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
var nicknames = {};
var clients = [];
var num=0;
var clientsrecord = [];
var url = require('url');
var util = require('util');
var EventEmitter = require('events').EventEmitter;//事件模块
var myEvents = new EventEmitter();
server.listen(3000);
app.get('/',function(req,res){
	res.sendfile(__dirname +'/index.html');
});
app.get('/pushInfo',function(req,res){
	var recvied=url.parse(req.url, true).query;
	if(recvied.tag==0){
//广播
		console.log('broadcast');
		myEvents.emit('pushInfo_broadcast',{
			type:recvied.type,
			tag:recvied.tag,
			messagetitle:recvied.messaget,
			messagecontent:recvied.messagec,
			promotionlink:recvied.promotionl
		});
		
	}else if (recvied.tag==1) {
//根据Tag
		console.log('tag');
		myEvents.emit('pushInfo_tag',{
			type:recvied.type,
			tag:recvied.tag,
			messagetitle:recvied.messaget,
			messagecontent:recvied.messagec,
			promotionlink:recvied.promotionl
		});
	};
	res.json({"status":"success","msg":"已提交"});
	
		
	
	
})

io.sockets.on('connection',function(socket){
	myEvents.on('pushInfo_broadcast',function(info){
//		console.log(info);
		socket.broadcast.emit('new message', info);
	});
	myEvents.on('pushInfo_tag',function(info){
		socket.emit('type'+info.type,info);
	})
	socket.on('send message',function(data){
		// io.sockets.emit('new message',
		// 	data);
		socket.broadcast.emit('new message', {
	      username: "dy",
	      messagetitle: data.messaget,
	      messagecontent: data.messagec,
	      message: data.messaget,	
	      promotionlink: data.promotionl
	    });
	});
	socket.on('add user',function(data){
		// sava devicesId;
		nicknames[socket.id]=data;
		console.log(data);
		console.log(socket.id);
		clients[num]=socket;
		clientsrecord[num]=data;
		num++;

	});
	socket.on('private message',function(data){
		// console.log(data.pmto);
		// console.log(clients[0].id);

		clients[clientsrecord.lastIndexOf(data.pmto)].emit('private message', {
	      username: "dy",
	      messagetitle: data.messaget,
	      messagecontent: data.messagec,
	      message: data.messaget,	
	      promotionlink: data.promotionl
	  });
	});
	socket.on('type',function(data){
		console.log('i am here');
		var infotype={
				username: "dy",
				messagetitle: data.messaget,
				messagecontent: data.messagec,
				message: data.messaget,
				promotionlink: data.promotionl
			};
			socket.broadcast.emit('type'+data.type,infotype);
	
		
	});
});