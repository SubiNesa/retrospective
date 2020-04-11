'use strict';

const express = require('express');
const router = express.Router();
const sprintsService = require('../services/sprints');
let webSocket;

router.get('/', async function(req, res) {
	let sprints = await sprintsService.list();
	res.json(sprints);
});

router.get('/:id', async function(req, res) {
	let sprint = await sprintsService.one();
	res.json(sprint);
});

router.post('/', async function(req, res) {
	let sprint = await sprintsService.save();
	res.json(sprint);
});

router.put('/:sprintId/card/:cardId/like', async function(req, res) {
	console.log(webSocket.id);
	try {
		let sprint = await sprintsService.updateLike(
			req.params.sprintId,
			req.params.cardId,
			req.body.email,
			req.body.group
		);
		
		res.json(sprint);

		webSocket.broadcast.emit('card liked', {
			srpintId: req.params.sprintId,
			cardId: req.params.cardId,
			emailId: req.body.email,
			likes: sprint.likes
		});
	} catch (error) {
		res.json(error);
	}
});

module.exports = function(io) {

	io.on('connection', socket => {
		console.log(socket.id);
		webSocket = socket;
	});

	return router;
}