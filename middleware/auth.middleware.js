const jwt = require('jsonwebtoken')
const config = require('config')

const jwtSecret = process.env.JWTSECRET || config.get('jwtSecret')

const auth =  (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    try {
        const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

        if (!token) {
            return res.status(401).json({ message: 'Нет авторизации' })
        }

        const decoded = jwt.verify(token, jwtSecret)
        req.user = decoded
        next()

    } catch (e) {
        res.status(401).json({ message: 'Нет авторизации' })
    }
}

module.exports = auth