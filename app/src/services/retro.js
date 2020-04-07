class RetroService {
    list() {
        try {
            return $.ajax({
                url: ``,
                type: "GET"
            });

        } catch (error) {
            console.error(error);
        }
    }
}

export default RetroService;