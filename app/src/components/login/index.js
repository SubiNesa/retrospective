let loginTpl = require('../../views/templates/login.hbs');
let config = require('../../config.json');

class LoginComponents {

	constructor (socket) {
		this.socket = socket;
	}

    async render() {
		let that = this;
        try {
			$('#retro').html(loginTpl());
			
			$("#form-user").on('submit', function(e) {  
				e.preventDefault();  
				let data = $("#form-user").serializeArray();
				console.log(data);

				let email = data[0].value.toLowerCase();

				if (config.users.includes(email)) {
					that.socket.open();
					that.socket.emit('login', email, config.admins.includes(email));
				} else {
					$("#form-user").prepend($(`<div class="uk-alert-danger uk-text-center" uk-alert>
						<p>E-mail is not valide.<br/>Please try again!</p>
						</div>`));

					setTimeout(function () {
						$('.uk-alert-danger').remove();
					}, 5000);	
				}


			}); 

        } catch (error) {
            console.error(error);
        }
	}
}

export default LoginComponents;