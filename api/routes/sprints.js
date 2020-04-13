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

router.put('/:sprintId/group/:group', async function(req, res) {
	try {
		let user = globalUsers.getOne('email', req.body.me);
		let sprint = await sprintsService.updateColumn(
			req.params.sprintId,
			null,
			req.params.group,
			req.body.type,
			req.body.text,
			req.body.me
		);
		
		// sending to all clients except sender
		user.socket.broadcast.emit('card added', {
			srpintId: req.params.sprintId,
			group: req.params.group,
			text: req.body.text,
			cardId: sprint.cardId
		});

		return res.json({
			srpintId: req.params.sprintId,
			group: req.params.group,
			text: req.body.text,
			cardId: sprint.cardId
		});
	} catch (error) {
		console.log(error);
		return res.send(error);
	}
});

router.put('/:sprintId/group/:group/card/:cardId/like', async function(req, res) {
	try {
		let user = globalUsers.getOne('email', req.body.me);
		let sprint = await sprintsService.updateLike(
			req.params.sprintId,
			req.params.cardId,
			req.params.group,
			req.body.email
		);
		
		// sending to all clients except sender
		user.socket.broadcast.emit('card liked', {
			sprintId: req.params.sprintId,
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

router.put('/:sprintId/group/:group/card/:cardId/move', async function(req, res) {
	try {

		let user = globalUsers.getOne('email', req.body.me);
		let response = await sprintsService.updateColumn(
			req.params.sprintId,
			req.params.cardId,
			req.params.group,
			'move',
			req.body.cardFromGroup, 
			req.body.cardToGroup,
			req.body.movedToPosition
		);
		
		// sending to all clients except sender
		user.socket.broadcast.emit('card moved', response);
		
		return res.json(response);
	} catch (error) {
		console.log(error);
		return res.send(error);
	}
});

module.exports = function(io) {
	socketIo = io;

	return router;
}