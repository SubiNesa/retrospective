import './table.scss';

let tableTpl = require('../../views/templates/table.hbs');
let cardTpl = require('../../views/partials/card.hbs');

// Services
import RetroService from '../../services/retro.js';

const retroService = new RetroService();

const enterNewInput = async (e, that, group) => {
	if (e.which === 13) {
		if (e.currentTarget.value) {

			let user = JSON.parse(sessionStorage.getItem("user"));
			let sprint_id = $(e.currentTarget).data('sprint');

			let response = await retroService.addCard(
				sprint_id,
				group,
				'add',
				e.currentTarget.value,
				user.email
			);

			updateCard(that, response);
		}

		$(e.currentTarget).val('');
	}
}

const updateCard = (that, data) => {
	$(`.column-${data.group} div[data-sprint='${data.srpintId}']`)
	.append(cardTpl({text: data.text, id: data.cardId, scaleup: true}));

	that.UIkit.sticky('.sprint-title', {
		offset: 0
	});

	that.onClick();
}

const updateLikes = (ukCard, data) => {
	ukCard.find('.retro-likes').html(data.likes);
	ukCard.find('.me-like').addClass('uk-animation-shake uk-text-danger');
	setTimeout(function () {
		ukCard.find('.me-like').removeClass('uk-animation-shake uk-text-danger');
	}, 700);
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
			this.onMove();
            this.onSockets();
        } catch (error) {
            console.error(error);
        }
    }

    onLoad() {

		let that = this;

        $('.new-start-input').on('keypress', function (e) {
			enterNewInput(e, that, 'start');
		});
		  
        $('.new-stop-input').on('keypress', function (e) {
			enterNewInput(e, that, 'stop');
		});
		
        $('.new-continue-input').on('keypress', function (e) {
			enterNewInput(e, that, 'continue');
		});

		this.onClick();
	}
	
	onMove() {
		let that = this;

		setTimeout(function() {
			that.UIkit.util.on(document.body, 'stop', async function (e, sortable, el) {
				
				let uk_sortable_dom = $(el).closest('.uk-sortable');
				let sprint_id = $(el).closest('.uk-sortable').data('sprint');
				let card_id = $(el).find('.uk-card').data('id');
				let card_from_group = $(e.target).data('group');
				let card_to_group = $(el).closest('.uk-sortable').data('group');
				let moved_to_position = uk_sortable_dom.find('div.uk-margin').index($(el));

				let user = JSON.parse(sessionStorage.getItem("user"));

				await retroService.move(
					sprint_id,
					card_id,
					card_from_group,
					card_to_group,
					moved_to_position,
					user.email
				);

			});
		}, 1000);
	}
	
	onSockets() {
		let that = this;

		this.socket.on('card added', data => {
			updateCard(that, data);
		});

		this.socket.on('card moved', data => {
			const {sprintId, cardId, cardFromGroup, cardToGroup, movedToPosition} = data;

			let card_dom = $(`.column-${cardFromGroup} .uk-sortable[data-sprint='${sprintId}']`)
				.find(`.uk-card[data-id='${cardId}']`)
				.closest('.uk-margin');
			let new_card_dom = card_dom.clone();
			
			// remove from column card id
			card_dom.addClass('uk-animation-scale-up uk-animation-reverse');
			setTimeout(function() {
				card_dom.remove();
				// add to column card id
				new_card_dom.addClass('uk-animation-scale-up');
				if (movedToPosition == 0) {
					$(`.column-${cardToGroup} .uk-sortable[data-sprint='${sprintId}']`).prepend(new_card_dom);
				} else {
					$(new_card_dom).insertAfter($(`.column-${cardToGroup} .uk-sortable[data-sprint='${sprintId}']`).find(`.uk-margin:nth-child(${movedToPosition})`));
				}
				setTimeout(function() {
					new_card_dom.removeClass('uk-animation-scale-up');
					that.onClick();
				}, 300);
			}, 300);
		});

		this.socket.on('card liked', data => {
			let uk_card_dom = $(`.uk-sortable[data-sprint='${data.sprintId}']`).find(`.uk-card[data-id='${data.cardId}']`);
			updateLikes(uk_card_dom, data);
		});
	}

	onClick() {
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
					card_group,
					user.email,
					user.email
				);

				updateLikes(uk_card_dom, response);

			} catch (error) {
				console.error(error);
			}
	  	});
	}
}

export default TableComponents;