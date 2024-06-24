const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta para servir el formulario
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/recuperar_contrasena.html'); // Cambia esto al nombre de tu archivo HTML
});

// Ruta para manejar el envío de correo
app.post('/send-email', async (req, res) => {
    const { email } = req.body;

    // Configuración del transportador de correo
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Usa el servicio de tu preferencia
        auth: {
            user: 'tuemail@gmail.com', // Reemplaza con tu email
            pass: 'tucontraseña' // Reemplaza con tu contraseña
        }
    });

    const mailOptions = {
        from: 'tuemail@gmail.com', // Reemplaza con tu email
        to: email,
        subject: 'Recuperar Contraseña',
        text: 'Haz clic en el siguiente enlace para cambiar tu contraseña: http://localhost:3000/reset-password?email=' + email
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).send('Correo enviado correctamente');
    } catch (error) {
        res.status(500).send('Error al enviar el correo');
    }
});

// Servidor escuchando
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
