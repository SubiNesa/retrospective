import 'babel-polyfill';
import $ from 'jquery';
import io from "socket.io-client";

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

// loads the Icon plugin
UIkit.use(Icons);

import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';

import './index.scss';

const socket = io('http://localhost:3000',{
	autoConnect: false
});


// Templates
let navTpl = require('./views/templates/nav.hbs');
let spinnerTpl = require('./views/templates/spinner.hbs');

// Components
import LoginComponents from './components/login/index.js';
import TableComponents from './components/table/index.js';

const loginComponents = new LoginComponents(socket);
const tableComponents = new TableComponents(socket, UIkit);

const shackUser = () => {
	$('.shake-user').on('click', function(e) {
		e.preventDefault();
		socket.emit('shake user', $(e.target).closest('li').data('user'));
	});
}

const load = (users = []) => {
	document.title = 'Retrospective';
	
	let data = sessionStorage.getItem("user");

	if (!data) {
		loginComponents.render();
	} else {
		let user = JSON.parse(data);

		if (users.length == 0) {	
			socket.open();
			socket.emit('user reconnect', user);

		} else {
			$('.navbar').html(navTpl({users}));
			$('#retro').html(spinnerTpl());
			tableComponents.render();
		}

		shackUser();
	}
};

$(document).ready(() => {
	load();
	
	socket.on('connected', (user, users) => {
		sessionStorage.setItem("user", JSON.stringify(user));
		load(users);
	});

	socket.on('user already connected', () => {
		socket.disconnect();
		loginComponents.render();
	});

	socket.on('new user connected', (users) => {
		console.log('new user connected', users);
		$('.navbar').html(navTpl({users}));
		shackUser();
	});

	socket.on('user shaked', () => {
		$('body').addClass('uk-animation-shake');
		setTimeout(function() {
			$('body').removeClass('uk-animation-shake');
		}, 800);
	});

	socket.on('user disconnect', (users) => {
		$('.navbar').html(navTpl({users}));
		shackUser();
	});
});