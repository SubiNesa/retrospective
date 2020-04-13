
'use strict';

var Sprint = require('../models/Sprint');
const { v4: uuidv4 } = require('uuid');

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
 *  Card of sprints
 */    
function card(sprintId, cardId) {
    
	return new Promise(function(resolve, reject) {
		Sprint.findOne({_id: sprintId}, function(err, sprint) {
			if (err) {
				return reject(err);
			}

			let card;
			let startIndex;
			let stopIndex;
			let continueIndex;

			const getCard = (group, index) => {
				return sprint[group][index];
			}

			if (sprint['start']) {
				startIndex = sprint['start'].findIndex((item) => item.id == cardId);
			}
			if (sprint['stop']) {
				stopIndex = sprint['stop'].findIndex((item) => item.id == cardId);
			}
			if (sprint['continue']) {
				continueIndex = sprint['continue'].findIndex((item) => item.id == cardId);
			}

			if (startIndex >= 0) {
				card = getCard('start', startIndex);
			}
			if (stopIndex >= 0) {
				card = getCard('stop', stopIndex);
			}
			if (continueIndex >= 0) {
				card = getCard('continue', continueIndex);
			}
			
			return resolve({
				_id: sprint._id,
				card: card
			});
		});
	});
};

/**
 *  Comment of sprints
 */    
function comment(sprintId, cardId, comment, email) {
    
	return new Promise(function(resolve, reject) {
		Sprint.findOne({_id: sprintId}, function(err, sprint) {
			if (err) {
				return reject(err);
			}

			let card;
			let startIndex;
			let stopIndex;
			let continueIndex;

			const getCard = (group, index) => {
				return {group, index, data: sprint[group][index]};
			}

			if (sprint['start']) {
				startIndex = sprint['start'].findIndex((item) => item.id == cardId);
			}
			if (sprint['stop']) {
				stopIndex = sprint['stop'].findIndex((item) => item.id == cardId);
			}
			if (sprint['continue']) {
				continueIndex = sprint['continue'].findIndex((item) => item.id == cardId);
			}

			if (startIndex >= 0) {
				card = getCard('start', startIndex);
			}
			if (stopIndex >= 0) {
				card = getCard('stop', stopIndex);
			}
			if (continueIndex >= 0) {
				card = getCard('continue', continueIndex);
			}

			sprint[card.group][card.index].comments.push({
				id: uuidv4(),
				comment: comment,
				creator: email,
				created: new Date(),
			});

			Sprint.updateOne({ _id: sprintId }, sprint, function(err) {
				if (err) {
					return reject(err);
				}

				return resolve({
					sprintId: sprint._id,
					cardId: cardId,
					group: card.group,
					comments: sprint[card.group][card.index].comments.length,
					card: sprint[card.group][card.index]
				});
			});
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
 * @param sprintId
 * @param type
 * @param text
 */    
function updateColumn(sprintId, cardId, group, type, ...data) {
	return new Promise(function(resolve, reject) {

		Sprint.findOne({ _id: sprintId }, function(err, sprint) {
			if (err) {
				return reject(err);
			}

			let res;

			switch (type) {
				case 'add': {
					let card_id = uuidv4();
					let [ text, email ] = data;
					sprint[group].push({
						id: card_id,
						text: text,
						likes: [],
						comments: [],
						states: [group],
						creator: email,
						created: new Date()
					});

					res = {
						_id: sprintId,
						msg: `${group}_${type}_added`,
						cardId: card_id
					};

					break;
				}

				case 'move': {
					let [cardFromGroup, cardToGroup, movedToPosition] = data;
					let index = sprint[cardFromGroup].findIndex((item) => item.id == cardId);
					let cards = sprint[cardFromGroup].splice(index, 1);

					cards[0].states.push(cardToGroup);
					sprint[cardToGroup].splice(movedToPosition, 0, cards[0]);

					res = {
						msg: `${group}_${type}_moved`,
						sprintId,
						cardId,
						cardFromGroup, 
						cardToGroup, 
						movedToPosition
					};

					break;
				}
					
				default:
					break;
			}

			Sprint.updateOne({ _id: sprintId }, sprint, function(err, newSprint) {
				if (err) {
					return reject(err);
				}
				return resolve(res);
			});
		});
	});
}

/**
 * Update likes
 * @param sprintId
 * @param cardId
 * @param email
 * @param group
 */    
function updateLike(sprintId, cardId, group, email) {
    
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
	card,
	one,
	save,
	comment,
	updateColumn,
	updateLike
};