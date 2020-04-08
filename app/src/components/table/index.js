import './table.scss';

let tableTpl = require('../../views/templates/table.hbs');
let columnStartTpl = require('../../views/templates/columns/start.hbs');
let columnStopTpl = require('../../views/templates/columns/stop.hbs');
let columnContinueTpl = require('../../views/templates/columns/continue.hbs');

// Services
import RetroService from '../../services/retro.js';

const retroService = new RetroService();


const starts = [];
const stops = [];
const continues = [];

class TableComponents {

	constructor (socket, UIkit) {
		this.socket = socket;
		this.UIkit = UIkit;
	}

    async render() {
        try {
			let sprints = await retroService.list();
			

            $('#retro').html(tableTpl({ sprints: sprints }));
            $('.column-start').html(columnStartTpl({}));
            $('.column-stop').html(columnStopTpl({}));
			$('.column-continue').html(columnContinueTpl({}));
			
			this.UIkit.sticky('.sprint-title', {
				offset: 0
			});

            this.loadDetail();
        } catch (error) {
            console.error(error);
        }
    }

    loadDetail() {
		let that = this;
		console.log($('.new-start-input'));
        $('.new-start-input').on('keypress', function (e) {
			if(e.which === 13){
				starts.push({
					name: e.currentTarget.value
				});
				$('.column-start').html(columnStartTpl({ starts }));
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
				$('.column-stop').html(columnStopTpl({ stops }));
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
				$('.column-continue').html(columnContinueTpl({ continues }));
				that.UIkit.sticky('.sprint-title', {
					offset: 0
				});
			}
	  	});
    }
}

export default TableComponents;