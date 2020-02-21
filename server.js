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
    Usuarios.findById(req.userId, 'usuario').then((usuarios) => {
        res.render('calendario', { usuario: usuarios[0] });
    });
});


app.get('/usuarios', verifyJWT, (req, res) => {
    Usuarios.find({}, {}, 0, 'usuario').then(result => {
        res.send(result);
    });
})

app.get('/eventos', verifyJWT, (req, res) => {
    Usuarios.find({ "usuarioId": req.userId, "mesEvento": req.query.mes, "anoEvento": req.query.ano }, { "diaEvento": 1, "horaInicio": 1 }, 0, 'evento').then(result => {
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

                let token = jwt.sign({ id }, TOKEN, {
                    expiresIn: '30m'
                });

                res.cookie('token', token);
                res.end();

            } else {
                res.status(403);
                res.send('{"mensagem": "Senha invalida", "id": "senha"}');
            }
        } else {
            res.status(403);
            res.send('{"mensagem": "Email invalido", "id": "email"}');
        }

    });
});

app.post('/sair', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

app.post('/evento/adicionar', verifyJWT, (req, res) => {
    salvaEvento(req.body, res);
});

app.post('/evento/remover', verifyJWT, (req, res) => {
    let evento = new Eventos(req.body);
    evento.delete();
    res.end();
});

app.post('/evento/atualizar', verifyJWT, (req, res) => {
    salvaEvento(req.body, res);
});

function verifyJWT(req, res, next) {
    var token = req.cookies.token;

    if(!token) {
        res.status(401);
        res.end();
    } else {

        jwt.verify(token, TOKEN, function(err, decoded) {
            if(err) {
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
    let horaInicio = 0;
    let conflito = 0;
    Eventos.find({}, {}, 0, 'evento').then(evt => {
        

        if (parseInt(evento.horaFim) <= parseInt(evento.horaInicio)) {
            horaInicio++;
        }
         
        if (evento.usuarioId == evt.usuarioId) {
            evt.forEach(e => {
                if(evento._id != e._id) {
                    if (evento.diaEvento == e.diaEvento && evento.mesEvento == e.mesEvento && evento.anoEvento == e.anoEvento) {
                        if (verificaHorario(evento, e)) {
                            conflito++;
                        }
                    }
                }
                
            });
        }

        if (conflito != 0) {
            res.status(401);
            res.send('Eventos em conflito');
        } else if (horaInicio != 0) {
            res.status(401);
            res.send('Hora inicial nao pode ser maior ou igual a hora final');
        } else {
            evento.save();
            res.end();
        }
    });
}

function verificaHorario(evento, e) {
    if ((parseInt(evento.horaInicio) >= parseInt(e.horaInicio) && parseInt(evento.horaFim) <= parseInt(e.horaFim)) || 
        (parseInt(evento.horaInicio) <= parseInt(e.horaInicio) && parseInt(evento.horaFim) >= parseInt(e.horaFim)) ||
        (parseInt(evento.horaFim) <= parseInt(e.horaFim) && parseInt(evento.horaFim) >= parseInt(e.horaInicio)) ||
        (parseInt(evento.horaInicio) >= parseInt(e.horaInicio) && parseInt(evento.horaInicio) <= parseInt(e.horaFim))) {
            return true;
    } else {
        return false;
    }
}

app.listen(process.env.PORT || 8080);
