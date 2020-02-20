const Mongo = require('./Mongo');

module.exports = class Evento extends Mongo {
    constructor(data) {
        super(data);

        let dataArray = data.dataEvento.split('-');

        this._id = data._id;
        this.usuarioId = data.usuarioId;
        this.diaEvento = dataArray[0];
        this.mesEvento = dataArray[1];
        this.anoEvento = dataArray[2];
        this.descricao = data.descricao;
        this.horaInicio = data.horaInicio;
        this.horaFim = data.horaFim;
        this.collection = 'evento';
    }
}