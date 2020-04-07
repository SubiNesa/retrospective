import 'babel-polyfill';
import $ from 'jquery';

import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

// loads the Icon plugin
UIkit.use(Icons);

import 'uikit/dist/css/uikit.min.css';
import 'uikit/dist/js/uikit.min.js';

import './index.scss';

// Templates
let navTpl = require('./views/templates/nav.hbs');

// Components
import LoginComponents from './components/login/index.js';
import TableComponents from './components/table/index.js';

const loginComponents = new LoginComponents();
const tableComponents = new TableComponents(UIkit);

const load = () => {
	document.title = 'Retrospective';
	
	let user = sessionStorage.getItem("user");
	console.log(user);
	if (!user) {
		loginComponents.render();
	} else {
		$('.navbar').html(navTpl({user}));
		tableComponents.render();
	}
};

$(document).ready(() => {
    load();
});