'use strict';

const express = require('express');
const router = express.Router();
const sprintsService = require('../services/sprints');
const globalUsers = require('../Users');
let socketIo;

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
	try {
		let user = globalUsers.getOne('email', req.body.me);
		let sprint = await sprintsService.updateLike(
			req.params.sprintId,
			req.params.cardId,
			req.body.email,
			req.body.group
		);
		
		// sending to all clients except sender
		user.socket.broadcast.emit('card liked', {
			srpintId: req.params.sprintId,
			cardId: req.params.cardId,
			emailId: req.body.email,
			likes: sprint.likes
		});

		return res.json(sprint);
	} catch (error) {
		console.log(error);
		return res.send(error);
	}
});

module.exports = function(io) {
	socketIo = io;

	return router;
}