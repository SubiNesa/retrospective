const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const port = 3000;
const colors = ['#E53935', '#D81B60', '#8E24AA', '#B388FF', '#3949AB', '#1E88E5', '#81D4FA', '#00ACC1', '#00897B', '#00BFA5', '#A5D6A7', '#43A047', '#7CB342', '#F57F17', '#FBC02D'];
let users = [];

app.use(cors());
app.use(bodyParser.json({limit: '50mb'})); // get information from html forms
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.get('/', (req, res) => res.send('Hello World!'));

io.on('connection', socket => {
	
	
	console.log('connection', socket.id);

	const connectUser = (email) => {
		let user = {
			id: socket.id,
			email: email,
			color: colors[Math.floor((Math.random() * colors.length) + 1)]
		};
		
		users.push(user);
		io.to(`${socket.id}`).emit('connected', user, users);
		socket.broadcast.emit('new user connected', users);
	}

	const reconnectUser = (user) => {
		user.id = socket.id;
		users.push(user);
		io.to(`${socket.id}`).emit('connected', user, users);
		socket.broadcast.emit('new user connected', users);
	}	

	socket.on('login', (email) => {
		if (users.length > 0) {
			let index = users.findIndex((user) => user.email == email);
			if (index >= 0) {
				io.to(`${socket.id}`).emit('user already connected');
			} else {
				connectUser(email);
			}
		} else {
			connectUser(email);
		}
	});

	socket.on('user reconnect', (user) => {
		if (users.length > 0) {
			let index = users.findIndex((theUser) => theUser.email == user.email);
			if (index >= 0) {
				io.to(`${socket.id}`).emit('user already connected');
			} else {
				reconnectUser(user);
			}
		} else {
			reconnectUser(user);
		}
	});

	socket.on('disconnect', () => {
		console.log('disconnect', socket.id);
		let index = users.findIndex((user) => user.id == socket.id);
		if (index >= 0) {
			users.splice(index, 1);
			socket.broadcast.emit('user disconnect', users);
		} 
	});
});

require('./routes')(app, io);

mongoose.connect('mongodb://127.0.0.1:27017/retro', {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
	console.log('mongodb connected');
});

server.listen(port, () => console.log(`Listening at http://localhost:${port}`));