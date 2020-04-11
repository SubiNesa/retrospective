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

	addCard(sprintId, group, type, text, me) {
		try {
            return $.ajax({
                url: `http://localhost:3000/sprints/${sprintId}/group/${group}`,
				type: "PUT",
				data: {type: type, text: text, me: me}
            });
        } catch (error) {
            console.error(error);
        }
	}
	
    like(sprintId, cardId, cardGroup, email, me) {
        try {
            return $.ajax({
                url: `http://localhost:3000/sprints/${sprintId}/group/${cardGroup}/card/${cardId}/like`,
				type: "PUT",
				data: {email: email, group: cardGroup, me: me}
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default RetroService;