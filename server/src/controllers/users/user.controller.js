const controlUser = {
    getUser: async (req, res) => {
        res.status(200).json({
            message: "get user is ok"
        })
    }
}

module.exports = controlUser