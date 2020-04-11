import './table.scss';

let tableTpl = require('../../views/templates/table.hbs');

// Services
import RetroService from '../../services/retro.js';

const retroService = new RetroService();


const starts = [];
const stops = [];
const continues = [];

const updateLikes = (ukCard, data) => {
	ukCard.find('.retro-likes').html(data.likes);
	ukCard.find('.me-like').addClass('uk-animation-shake');
	setTimeout(function () {
		ukCard.find('.me-like').removeClass('uk-animation-shake');
	}, 1000);
}

class TableComponents {

	constructor (socket, UIkit) {
		this.socket = socket;
		this.UIkit = UIkit;
	}

    async render() {
        try {
			let sprints = await retroService.list();
			
            $('#retro').html(tableTpl({ sprints: sprints }));

			this.UIkit.sticky('.sprint-title', {
				offset: 0
			});

            this.onLoad();
            this.onSockets();
        } catch (error) {
            console.error(error);
        }
    }

    onLoad() {

		let that = this;

        $('.new-start-input').on('keypress', function (e) {
			if(e.which === 13){
				starts.push({
					name: e.currentTarget.value
				});
				// $('.column-start').html(columnStartTpl({ starts }));
				that.UIkit.sticky('.sprint-title', {
					offset: 0
				});
			}
		});
		  
        $('.new-stop-input').on('keypress', function (e) {
			if(e.which === 13){
				stops.push({
					name: e.currentTarget.value
				});
				// $('.column-stop').html(columnStopTpl({ stops }));
				that.UIkit.sticky('.sprint-title', {
					offset: 0
				});
			}
		});
		
        $('.new-continue-input').on('keypress', function (e) {
			if(e.which === 13){
				continues.push({
					name: e.currentTarget.value
				});
				// $('.column-continue').html(columnContinueTpl({ continues }));
				that.UIkit.sticky('.sprint-title', {
					offset: 0
				});
			}
		});
		
        $('.me-like').on('click', async function (e) {
			e.preventDefault();

			try {
				let uk_sortable_dom = $(this).closest('.uk-sortable');
				let sprint_id = uk_sortable_dom.data('sprint');
				let card_group = uk_sortable_dom.data('group');
				let uk_card_dom = $(this).closest('.uk-card')
				let card_id = uk_card_dom.data('id');

				let user = JSON.parse(sessionStorage.getItem("user"));

				let response = await retroService.like(
					sprint_id,
					card_id,
					user.email,
					card_group
				);

				updateLikes(uk_card_dom, response);

			} catch (error) {
				console.error(error);
			}
	  	});
	}
	
	onSockets() {
		this.socket.on('card liked', (data) => {
			let uk_card_dom = $(`.uk-sortable[data-sprint='${data.srpintId}']`).find(`.uk-card[data-id='${data.cardId}']`);
			updateLikes(uk_card_dom, data);
		});
	}
}

export default TableComponents;