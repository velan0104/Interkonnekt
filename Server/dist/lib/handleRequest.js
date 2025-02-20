export const handleRequest = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
