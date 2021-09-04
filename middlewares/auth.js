const jwt = require('jsonwebtoken');
const config = require('config');

let validartoken = (req, res, next)=>{
    let token = req.get('Token');

    return jwt.verify(token, config.get('configToken.SEED'),(error, user)=>{
        if (error) {
            return res.status(400).json({
                error
            })
        }
        req.usuario = user.usuario;
        next();
    })
}

module.exports = validartoken;