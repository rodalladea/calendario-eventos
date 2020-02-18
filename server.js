const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

const Usuarios = require('./model/Usuario');

app.use(express.static(path.join(__dirname, 'view/public')));
app.use(express.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.get('/usuarios', (req, res) => {
    Usuarios.find({}, {}, 0, 'usuario').then(result => {
        res.send(result);
    });
})

app.post('/cadastro/enviado', (req, res) => {
    let usuario = new Usuarios(req.body);
    usuario.save();

    res.redirect('/');
    res.end();
});

app.listen(process.env.PORT || 8080);
