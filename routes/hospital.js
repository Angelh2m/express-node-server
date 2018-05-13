 // Requires
 var express = require('express');
 // Inicializar variables
 var app = express();
 var mdAutenticacion = require('../middlewares/autenticacion');
 var Hospital = require('../models/hospital');

 // Rutas
 app.get('/', (req, res, next) => {
     var desde = req.query.desde || 0;
     desde = Number(desde);
     // Regresar unicamente el nombre
     Hospital.find({})
         .skip(desde)
         .limit(5)
         .populate('usuario', 'nombre email')
         .exec((err, hospitales) => {
             if (err) {
                 return res.status(500).json({
                     ok: false,
                     mensaje: 'Error cargando hospital',
                     errors: err
                 });
             }

             Hospital.count({}, (err, conteo) => {

                 res.status(200).json({
                     ok: true,
                     hospitales: hospitales,
                     total: conteo
                 });
             })
         });
 });


 app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

     var id = req.params.id; // Query params
     var body = req.body; // Body parser

     Hospital.findById(id, (err, hospital) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al buscar el hospital',
                 errors: err
             });
         }
         if (!hospital) {
             return res.status(400).json({
                 ok: false,
                 mensaje: `El hospital con el ${id}no existe`,
                 errors: { message: 'No existe un hospital con ese ID' }
             });
         }

         hospital.nombre = body.nombre;
         hospital.usuario = req.usuario._id; // Desde el middleware

         hospital.save((err, hospitalGuardado) => {
             if (err) {
                 return res.status(400).json({
                     ok: false,
                     mensaje: 'Error al actualizar el hospital',
                     errors: err
                 });
             }

             res.status(200).json({
                 ok: true,
                 mensaje: `Hospital acuatizado correctamente`,
                 hospital: hospitalGuardado
             });

         })

     });
 });
 // Middleware JWT mdAutenticacion
 app.post('/', mdAutenticacion.verificaToken, (req, res) => {

     var body = req.body;

     var hospital = new Hospital({
         nombre: body.nombre,
         usuario: req.usuario._id, // Desde el middleware
     });

     hospital.save((err, hospitalGuardado) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'Error al cargar hospital',
                 errors: err
             });
         }

         res.status(201).json({
             ok: true,
             body: hospitalGuardado
         });

     });

 });

 app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
     var id = req.params.id;

     Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al borrar hospital',
                 errors: err
             });
         }

         if (!hospitalBorrado) {
             return res.status(400).json({
                 ok: false,
                 mensaje: `El hospital con el ${id} no existe`,
                 errors: { message: 'No existe un hospital con ese ID' }
             });
         }


         res.status(200).json({
             ok: true,
             hospital: hospitalBorrado
         });

     });
 });


 module.exports = app;