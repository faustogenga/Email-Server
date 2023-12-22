const express = require('express');
const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.post('/send-email', (req, res) => {
    console.log(req.body);
    const { userEmail, orderId } = req.body;
    console.log('user:', userEmail);
    console.log('orderItems:', orderId);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "grupo3dweb@gmail.com",
            pass: "moiokfdbhyurvdyy",
        },
        secure: false,
        requireTLS: true, // Force TLS
        tls: {
          rejectUnauthorized: false // Ignore unauthorized certificates
        }
    });

    var mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'FutStore CR',
            link: 'https://mailgen.js/'
        }
    });

    const response = {
        body: {
            name: `Pedido Confirmado # ${orderId}`,
            intro: `Gracias ${userEmail} por realizar tu pedido con nosotros!!!`,
            action: {
                instructions: 'Sigue el estado de tu pedido en nuestra pagina',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: 'Ir a nuestra pagina',
                    link: 'http://localhost:3000'
                }
            },
            outro: 'Futstore - productos de calidad'
        }
    };

    const email = mailGenerator.generate(response);

    const mailOptions = {
        from: 'grupo3dweb@gmail.com',
        to: userEmail || "faustogengaalfaro@gmail.com",
        subject: `Pedido Confirmado # ${orderId}`,
        html: email,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send(error);
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send({
                status: "Email Enviado",
                info: info.response,
                message: info.messageId,
                link: nodemailer.getTestMessageUrl(info),
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
