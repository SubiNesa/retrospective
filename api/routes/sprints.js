'use strict';

const express = require('express');
const router = express.Router();
const sprintsService = require('../services/sprints');

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

router.put('/:id', async function(req, res) {
	let sprint = await sprintsService.update();
	res.json(sprint);
});

module.exports = router;