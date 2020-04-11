class RetroService {
    list() {
        try {
            return $.ajax({
                url: `http://localhost:3000/sprints`,
                type: "GET"
            });

        } catch (error) {
            console.error(error);
        }
	}
	
    like(sprintId, cardId, email, cardGroup, me) {
        try {
            return $.ajax({
                url: `http://localhost:3000/sprints/${sprintId}/card/${cardId}/like`,
				type: "PUT",
				data: {email: email, group: cardGroup, me: me}
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default RetroService;