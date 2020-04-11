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
	.append(cardTpl({text: data.text, id: data.cardId, last: true}));

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

		this.onClick()
	}
	
	onSockets() {
		let that = this;

		this.socket.on('card added', data => {
			updateCard(that, data);
		});

		this.socket.on('card liked', data => {
			let uk_card_dom = $(`.uk-sortable[data-sprint='${data.srpintId}']`).find(`.uk-card[data-id='${data.cardId}']`);
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