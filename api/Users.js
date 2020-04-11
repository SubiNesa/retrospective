'use strict';

class Users {

    constructor() {
		if (!Users.instance) {
			this.users = [];
			Users.instance = this;
		}
	   
		return Users.instance;
	}
	
	getOne(findBy, value) {
		return this.users.find(user => user[findBy] == value);
	}

	setUser(email, socket) {
		this.users.push({
			email: email,
			id: socket.id,
			socket: socket
		});
	}

	delUser(findBy, value) {
		let index = this.users.findIndex(user => user[findBy] == value);
		if (index >= 0) {
			this.users.splice(index, 1);
		}
	}
}

const instance = new Users();
// its methods cannot be changed, nor can new methods or properties be added to it
Object.freeze(instance);

module.exports = instance;