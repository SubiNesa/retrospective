let loginTpl = require('../../views/templates/login.hbs');

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

				that.socket.open();
				that.socket.emit('login', data[0].value);
			}); 

        } catch (error) {
            console.error(error);
        }
	}
}

export default LoginComponents;