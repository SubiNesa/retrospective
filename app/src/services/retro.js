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

	card(sprintId, cardId) {
        try {
            return $.ajax({
                url: `http://localhost:3000/sprints/${sprintId}/card/${cardId}`,
                type: "GET"
            });

        } catch (error) {
            console.error(error);
        }
	}

	createSprint(title, details, me) {
        try {
            return $.ajax({
                url: `http://localhost:3000/sprints`,
				type: "POST",
				data: {title, details, me}
            });

        } catch (error) {
            console.error(error);
        }
	}

	closeSprint(sprintId, me) {
        try {
            return $.ajax({
                url: `http://localhost:3000/sprints/${sprintId}/close`,
				type: "PUT",
				data: {me}
            });

        } catch (error) {
            console.error(error);
        }
	}

	addComment(sprintId, cardId, comment, me) {
		try {
            return $.ajax({
                url: `http://localhost:3000/sprints/${sprintId}/card/${cardId}/comment`,
				type: "PUT",
				data: {comment, me}
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
            console.log('hello');
            console.error(error);
        }
	}

	
	
    move(sprintId, cardId, cardFromGroup, cardToGroup, movedToPosition, me) {
        try {
            return $.ajax({
                url: `http://localhost:3000/sprints/${sprintId}/group/${cardFromGroup}/card/${cardId}/move`,
				type: "PUT",
				data: {cardFromGroup, cardToGroup, movedToPosition, me}
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default RetroService;