const usersRouter = require('express').Router();
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { PAGE_URL } = require('../config.js');

usersRouter.post('/', async (request, response) => {
    const { name, email, phone, password } = request.body;

    if (!name || !email || !phone || !password) {
        return response.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
        name,
        email,
        phone,
        passwordHash,
    })
    const savedUser = await newUser.save()
    const token = jwt.sign({ id: savedUser.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: savedUser.email, // list of receivers
        subject: "Verificacion de usuario", // Subject line
        html: `<a href="${PAGE_URL}verify/${savedUser.id}/${token}">Verificar correo</a>`, // html body
    });

    return response.status(201).json('Usuario creado, por favor verifica tu correo')

});

usersRouter.patch('/:id/:token', async (request, response) => {
    try {
        const token = request.params.token;
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const id = decodedToken.id;
        await User.findByIdAndUpdate(id, { verified : true });
        return response.sendStatus(200);
    } catch (error) {
        //Encontrar usuario
        const id = request.params.id;
        const { email } = await User.findById(id);
        
        console.log(email);
        
        // Firmar el nuevo token
        
        const token = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: process.env.EMAIL_USER, // sender address
        to: email, // list of receivers
        subject: "Verificacion de usuario", // Subject line
        html: `<a href="${PAGE_URL}verify/${id}/${token}">Verificar correo</a>`, // html body
    });

        return response.status(400).json({ error: 'El link ha expirado, se ha enviado un nuevo link'});
    }


});
module.exports = usersRouter;