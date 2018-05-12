var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;


/* *
 *   VERIFICAR el TOKEN MIDDLEWARE
 */
exports.verificaToken = function(req, res, next) {

    var token = req.query.token; // Opcional en la url

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token icorrecto',
                errors: err
            });
        }
        // Mandar el usuario que esta haciendo la peticion
        req.usuario = decoded.usuario;

        next();
        // res.status(200).json({
        //     ok: true,
        //     decoded: decoded,
        //     usuario: req.usuario
        // });
    });
}