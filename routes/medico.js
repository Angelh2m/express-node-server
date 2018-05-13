 // Requires
 var express = require('express');
 // Inicializar variables
 var app = express();
 var mdAutenticacion = require('../middlewares/autenticacion');
 var Medico = require('../models/medico');

 // Rutas
 app.get('/', (req, res, next) => {
     var desde = req.query.desde || 0;
     desde = Number(desde);
     // Regresar unicamente el nombre
     Medico.find({})
         .skip(desde)
         .limit(5)
         .populate('usuario', 'nombre email')
         .populate('hospital')
         .exec((err, medicos) => {
             if (err) {
                 return res.status(500).json({
                     ok: false,
                     mensaje: 'Error cargando medico',
                     errors: err
                 });
             }

             Medico.count({}, (err, conteo) => {
                 res.status(200).json({
                     ok: true,
                     medicos: medicos,
                     total: conteo
                 });
             });

         });
 });


 app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

     var id = req.params.id; // Query params
     var body = req.body; // Body parser

     Medico.findById(id, (err, medico) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al buscar el medico',
                 errors: err
             });
         }
         if (!medico) {
             return res.status(400).json({
                 ok: false,
                 mensaje: `El medico con el ${id}no existe`,
                 errors: { message: 'No existe un medico con ese ID' }
             });
         }

         medico.nombre = body.nombre;
         medico.usuario = req.usuario._id; // Desde el middleware
         medico.hospital = body.hospital; // Desde el middleware

         medico.save((err, medicoGuardado) => {
             if (err) {
                 return res.status(400).json({
                     ok: false,
                     mensaje: 'Error al actualizar el medico',
                     errors: err
                 });
             }

             res.status(200).json({
                 ok: true,
                 mensaje: `Medico acuatizado correctamente`,
                 medico: medicoGuardado
             });

         })

     });
 });
 // Middleware JWT mdAutenticacion
 app.post('/', mdAutenticacion.verificaToken, (req, res) => {

     var body = req.body;

     var medico = new Medico({
         nombre: body.nombre,
         hospital: body.hospital,
         usuario: req.usuario._id, // Desde el middleware
     });

     medico.save((err, medicoGuardado) => {
         if (err) {
             return res.status(400).json({
                 ok: false,
                 mensaje: 'Error al cargar medico',
                 errors: err
             });
         }

         res.status(201).json({
             ok: true,
             body: medicoGuardado
         });

     });

 });

 app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
     var id = req.params.id;

     Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
         if (err) {
             return res.status(500).json({
                 ok: false,
                 mensaje: 'Error al borrar medico',
                 errors: err
             });
         }

         if (!medicoBorrado) {
             return res.status(400).json({
                 ok: false,
                 mensaje: `El medico con el ${id} no existe`,
                 errors: { message: 'No existe un medico con ese ID' }
             });
         }


         res.status(200).json({
             ok: true,
             medico: medicoBorrado
         });

     });
 });


 module.exports = app;