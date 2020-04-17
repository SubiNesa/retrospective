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

router.get('/:id/card/:cardId', async function(req, res) {
	try {
		let card = await sprintsService.card(
			req.params.id,
			req.params.cardId
		);
		return res.json(card);
	} catch (error) {
		console.log(error);
		return res.status(403).send(error);
	}
});

router.post('/', async function(req, res) {
	try {
		let user = globalUsers.getOne('email', req.body.me);
		let sprint = await sprintsService.save(
			req.body.title,
			req.body.details,
			req.body.me
		);

		user.socket.broadcast.emit('sprint updated');
		return res.json(sprint);
	} catch (error) {
		console.log(error);
		return res.status(403).send(error);
	}
});

router.put('/:id/close', async function(req, res) {
	try {
		let user = globalUsers.getOne('email', req.body.me);
		let response = await sprintsService.close(
			req.params.id,
			req.body.me
		);

		user.socket.broadcast.emit('sprint updated');
		return res.json(response);
	} catch (error) {
		console.log(error);
		return res.status(403).send(error);
	}
});

router.put('/:id/card/:cardId/comment', async function(req, res) {
	try {
		let response = await sprintsService.comment(
			req.params.id,
			req.params.cardId,
			req.body.comment,
			req.body.me
		);

		socketIo.emit('comment added', response);

		return res.json(response);
	} catch (error) {
		console.log(error);
		return res.send(error);
	}
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
		return res.status(403).send(error);
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

		console.log(sprint);
		
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
		return res.status(403).send(error);
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
		return res.status(403).send(error);
	}
});

module.exports = function(io) {
	socketIo = io;

	return router;
}