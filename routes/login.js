 // Requires
 var express = require('express');
 // Inicializar variables
 var app = express();
 var bcrypt = require('bcrypt');
 var jwt = require('jsonwebtoken');
 var SEED = require('../config/config').SEED;
 var Usuario = require('../models/usuario');

 app.post('/', (req, res) => {
     // Form body parser
     var body = req.body;

     Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

         if (err) {
             return res.status(500).json({
                 ok: false,
                 message: 'Error al buscar usuarios',
                 error: err
             });
         }

         if (!usuarioDB) {
             return res.status(400).json({
                 ok: false,
                 message: 'Credenciales no son correctas - email',
                 error: err
             });
         }

         // Validar contraseña / Regresa un true or false
         if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
             res.status(400).json({
                 ok: false,
                 message: 'Credenciales incorrectas - password',
                 errors: err
             });
         }

         usuarioDB.password = ':)';
         //  CREAR TOKEN - PAYLOAD
         var token = jwt.sign({
             usuario: usuarioDB
         }, SEED, { expiresIn: 20100 })

         res.status(200).json({
             ok: true,
             usuario: usuarioDB,
             id: usuarioDB._id,
             token: token
         });

     });


 })

 module.exports = app;