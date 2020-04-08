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
}

export default RetroService;