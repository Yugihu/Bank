module.exports.onlyLogged = (req, res, next) => {
    if (req.session.account?.username) {
        return next()
    }
    res.status(401).send({ err: `access to logged users only , please log in` })
}