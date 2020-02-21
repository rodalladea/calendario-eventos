const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();

const Usuarios = require('./model/Usuario');
const Eventos = require('./model/Evento');

const TOKEN = 'bnisesnduw34r45nifug';

app.use(express.static(path.join(__dirname, 'view/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.get('/calendario', verifyJWT, (req, res) => {
    //Usuarios.findById(req.userId, 'usuario').then((usuarios) => {
        res.render('calendario', { _id: req.userId });
    //});
});


app.get('/usuarios', (req, res) => {
    Usuarios.find({}, {}, 0, 'usuario').then(result => {
        res.send(result);
    });
})

app.get('/eventos', (req, res) => {
    Usuarios.find({ "mesEvento": req.query.mes, "anoEvento": req.query.ano }, {}, 0, 'evento').then(result => {
        res.send(result);
    });
})

app.post('/cadastro/enviado', (req, res) => {
    let usuario = new Usuarios(req.body);
    usuario.save();

    res.redirect('/');
    res.end();
});

app.post('/login', (req, res) => {
    let email = req.body.email;
    let senha = req.body.senha;

    Usuarios.find({"email": email}, {}, 0, 'usuario').then((usuario) => {
        if (usuario.length) {

            if(usuario[0].senha === senha) {
                
                const id = usuario[0]._id;

                let token = jwt.sign({ id }, TOKEN);

                res.cookie('token', token);
                res.redirect('/calendario');

            } else {
                res.status(403);
                console.log('Erro de Autenticação!');
            }
        } else {
            res.status(403);
            console.log('Email invalido');
        }

        res.end();
    });
});

app.post('/evento/adicionar', (req, res) => {
    salvaEvento(req.body, res);
});

app.post('/evento/remover', (req, res) => {
    let evento = new Eventos(req.body);
    evento.delete();
    res.end();
});

app.post('/evento/atualizar', (req, res) => {
    salvaEvento(req.body, res);
});

function verifyJWT(req, res, next) {
    var token = req.cookies.token;

    if(!token) {
        console.log('Você precisa estar logado para acessar este conteúdo');
        res.status(401);
        res.end();
    } else {

        jwt.verify(token, TOKEN, function(err, decoded) {
            if(err) {
                console.log('Token inválido');
                res.status(500);
                res.end();
            } else {
                res.status(200);
                req.userId = decoded.id;
                next();
            }
        });
    }
}

function salvaEvento(dado, res) {
    let evento = new Eventos(dado);
    let aux = 0;
    Eventos.find({}, {}, 0, 'evento').then(evt => {
        if (evt.length == 0) {
            evento.save();
            res.end();
        }

        evt.forEach(e => {
            
            if(evento._id != e._id) {
                if (evento.diaEvento == e.diaEvento && evento.mesEvento == e.mesEvento && evento.anoEvento == e.anoEvento) {
                    if ((parseInt(evento.horaInicio) >= parseInt(e.horaInicio) && parseInt(evento.horaFim) <= parseInt(e.horaFim)) || 
                        (parseInt(evento.horaInicio) <= parseInt(e.horaInicio) && parseInt(evento.horaFim) >= parseInt(e.horaFim)) ||
                        (parseInt(evento.horaFim) <= parseInt(e.horaFim) && parseInt(evento.horaFim) >= parseInt(e.horaInicio)) ||
                        (parseInt(evento.horaInicio) >= parseInt(e.horaInicio) && parseInt(evento.horaInicio) <= parseInt(e.horaFim)) ||
                        (evento.horaFim <= evento.horaInicio)) {
                        aux++;
                    }
                }
            }
            
        });

        if (aux != 0) {
            res.status(409);
            res.end();
        } else {
            evento.save();
            res.end();
        }
    });
}

app.listen(process.env.PORT || 8080);
