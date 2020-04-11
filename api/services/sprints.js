
'use strict';

var Sprint = require('../models/Sprint');

/**
 *  List of sprints
 */    
function list() {
    
	return new Promise(function(resolve, reject) {
		Sprint.aggregate([{$match: {}}, {$sort: {created: 1}} ], function(err, sprints) {
			if (err) {
				return reject(err);
			}
			
			return resolve(sprints);
		});
	});
};

/**
 * One sprint
 * @param id
 */    
function one(id) {
    
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve("done!"), 1000);
	});
};

/**
 * Save new sprint
 */    
function save() {
    
	return new Promise(function(resolve, reject) {
		setTimeout(() => resolve("done!"), 1000);
	});
};

/**
 * Update sprint
 * @param id
 */    
function updateLike(sprintId, cardId, email, group) {
    
	return new Promise(function(resolve, reject) {

		Sprint.findOne({ _id: sprintId }, function(err, sprint) {
			if (err) {
				return reject(err);
			}

			let index = sprint[group].findIndex((item) => item.id == cardId);
			
			if (sprint[group][index].likes.includes(email)) {
				let indexLike = sprint[group][index].likes.findIndex(item => item == email);
				sprint[group][index].likes.splice(indexLike, 1);

			} else {
				sprint[group][index].likes.push(email);
			}

			Sprint.updateOne({ _id: sprintId }, sprint, function(err, newSprint) {
				if (err) {
					return reject(err);
				}
				return resolve({
					_id: newSprint._id,
					msg: 'likes_updated',
					card: cardId,
					likes: sprint[group][index].likes.length
				});
			});
		});
	});
};

module.exports = {
	list,
	one,
	save,
	updateLike
};