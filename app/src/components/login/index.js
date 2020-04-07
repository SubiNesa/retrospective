let loginTpl = require('../../views/templates/login.hbs');

class LoginComponents {

    async render() {
        try {
			$('#results').html(loginTpl());
			
			$("#form-user").on('submit', function(e) {  
				e.preventDefault();  
				let data = $("#form-user").serializeArray()
				sessionStorage.setItem("user", data[0].value);
			}); 

        } catch (error) {
            console.error(error);
        }
	}
}

export default LoginComponents;