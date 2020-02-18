const Mongo = require('./Mongo');

module.exports = class Usuario extends Mongo {
    constructor(data) {
        super(data);
        this._id = data._id;
        this.nome = data.nome;
        this.email = data.email;
        this.senha = data.senha;
        this.collection = 'usuario';
    }
}