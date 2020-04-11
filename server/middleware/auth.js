const auth = async(req, res, next) => {

    if (!req.session.email) {
        return res.redirect('/login')
    }
    next()
}

module.exports = auth