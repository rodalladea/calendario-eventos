const milissegundosPorDia = 1000 * 60 * 60 * 24; //para conseguir pegar o primeiro domingo e o ultimo sabado do calendario
var dateObj = new Date(); //dia de hoje

var month = dateObj.getMonth();
var day = dateObj.getDate();
var year = dateObj.getFullYear();

var months = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

var markup; //para o calendario
var antDiaSelecionado = null; //tirar a cor do background
var antEventoAlterado = null; //desabilitar os horarios do evento
var eventosMes = []; //todos os eventos do mes selecionado
var diaSelecionado; //para conseguir pegar todos os eventos do dia

var dataEvento = document.getElementById('dataEvento');
var diasCalendario = document.getElementById('diasCalendario');
var dataNovo = document.getElementById('dataNovo');
var btnAddEvt = document.getElementById('btnAddEvt');
var eventosLista = document.getElementById('eventosLista');
var formEvento = document.getElementById('formEvento');
var btnFecha = document.getElementById('btnFecha');
var selHoraInicio = document.getElementById('horaInicio');
var selHoraFim = document.getElementById('horaFim');
var descricaoText = document.getElementById('descricao');
var btnAddForm = document.getElementById('btnAddForm');
var eventoModal = document.getElementById('eventoModal');

function maisMes() { //aumenta um mes no calendario
    if (month < 11) {
        month += 1;
    } else {
        month = 0;
        year +=1;
    }
    getEventosMes(month, year);
}

function menosMes() { //diminui um mes no calendario
    if (month > 0) {
        month -= 1;
    } else {
        month = 11;
        year -= 1;
    }
    getEventosMes(month, year);
}

function gerCalendario(mes, ano) { //gera o calendario
    
    while (diasCalendario.firstChild) { //remove todos os dias do mes anterior
        diasCalendario.removeChild(diasCalendario.lastChild);
    }
    

    let primeiroDia = new Date(ano, mes, 1); //primeiro dia do mes selecionado
    let ultimoDia = new Date(ano, mes+1, 0); //ultimo dia do mes selecionado
    let primeiroDomingo = new Date(primeiroDia.getTime() - primeiroDia.getDay() * milissegundosPorDia).getDate(); //primeiro domingo no calendario
    let ultimoSabado = new Date(ultimoDia.getTime() + Math.abs(ultimoDia.getDay() - 6) * milissegundosPorDia).getDate(); //ultimo sabado no calendario

    let primeiroDiaNum = primeiroDia.getDate();
    let ultimoDiaNum = ultimoDia.getDate();

    markup = `<div>
                <h2 class="d-inline-block mr-3">${months[mes]}</h2>
                <h2 class="d-inline-block">${ano}</h2>
             </div>
             <div class="mt-3 text-center">
                <div class="d-inline-block text-center w-calendario">Dom</div>
                <div class="d-inline-block text-center w-calendario">Seg</div>
                <div class="d-inline-block text-center w-calendario">Ter</div>
                <div class="d-inline-block text-center w-calendario">Qua</div>
                <div class="d-inline-block text-center w-calendario">Qui</div>
                <div class="d-inline-block text-center w-calendario">Sex</div>
                <div class="d-inline-block text-center w-calendario">Sab</div>
             </div>
             <div class="mt-1 text-center">`; //parte dos dias (header do calendario)

    let aux = 1; //auxiliar para controlar a semana
    for (let i = (primeiroDia.getDate()-primeiroDia.getDay()); i <= (ultimoDia.getDate()+Math.abs(ultimoDia.getDay() - 6)); i++) {
        //primeiro tirar o numero do dia da semana do primeiro dia / tem que ser menor ou igual ao ultimo dia mais a quantidade de dias para o ultimo sabado
        let diaHoje = (primeiroDiaNum == dateObj.getDate()) && (mes == dateObj.getMonth()) && (ano == dateObj.getFullYear());

        if (i<=0) {
            markup = markup + `<div class="d-inline-block text-center w-calendario ${aux % 7 == 0 ? '' : 'mr-1'}">
                                    <button class="btn ${verificaData(primeiroDomingo, mes-1, ano, 'secundario')} w-100" onclick="getData(event)" id="${primeiroDomingo+'-'+(mes-1)+'-'+ano}" disabled>
                                        ${primeiroDomingo}
                                    </button>
                               </div>`;
            primeiroDomingo++;
        } else if (i <= ultimoDiaNum) {
            markup = markup + `<div class="d-inline-block text-center w-calendario ${aux % 7 == 0 ? '' : 'mr-1'}">
                                    <a href="#eventoContainer" class="btn ${diaHoje ? 'btn-outline-success' : verificaData(primeiroDiaNum, mes, ano, 'primario')} w-100" onclick="getData(event)" id="${primeiroDiaNum+'-'+mes+'-'+ano}">
                                        ${primeiroDiaNum}
                                    </a>
                               </div>`;
            primeiroDiaNum++;
        } else {
            markup = markup + `<div class="d-inline-block text-center w-calendario ${aux % 7 == 0 ? '' : 'mr-1'}">
                                    <button class="btn ${verificaData((i - ultimoDia.getDate()), mes+1, ano, 'secundario')} w-100" onclick="getData(event)" id="${(i - ultimoDia.getDate())+'-'+(mes+1)+'-'+ano}" disabled>
                                        ${i - ultimoDia.getDate()}
                                    </button>
                               </div>`;
        }

        if (aux % 7 == 0) {
            markup = markup + `</div>
                               <div class="mt-1 text-center">`;
        }

        aux++;
    }
    
    markup = markup + `</div>`;

    if (aux <= 36) {

        markup = markup + `<div class="mt-1 text-center">`;

        for (let i = 1; i <= 7; i++) {
            markup = markup + `<div class="d-inline-block text-center w-calendario ${i % 7 == 0 ? '' : 'mr-1'}">
                                    <button class="btn ${verificaData(i, mes+1, ano, 'secundario')} w-100" onclick="getData(event)" id="${i+'-'+(mes+1)+'-'+ano}" disabled>
                                        ${i}
                                    </button>
                               </div>`;
        }

        markup = markup + `</div>`;
        
    }

    diasCalendario.insertAdjacentHTML('beforeend', markup);

    if (!dataEvento.firstChild) {
        dataEvento.insertAdjacentHTML('afterbegin', `<h1>Data Nao Selecionada</h1>`);
        btnAddEvt.disabled = true;
    }

    if (document.getElementById(antDiaSelecionado)) { // sair do mes do dia selecionado e voltar para esse mes
        document.getElementById(antDiaSelecionado).classList.add('bg-calendario');
    }

}

function verificaData(dia, mes, ano, tipo) { //retorna a classe do botao do dia no calendario
    for (let i = 0; i < eventosMes.length; i++) {
        if (eventosMes[i].diaEvento == dia && eventosMes[i].mesEvento == mes && eventosMes[i].anoEvento == ano) {
            return 'btn-outline-danger';
        }
    }

    if (tipo == 'secundario') {
        return 'btn-outline-secondary';
    } else {
        return 'btn-outline-primary';
    }
}


function getData(event) { //coloca a data no outro lado da tela do dia selecionado
    dataEvento.removeChild(dataEvento.firstChild);

    let dataArray = event.target.id.split('-');

    let dia = dataArray[0];
    let mes = dataArray[1];
    let ano = dataArray[2];
    diaSelecionado = dia;

    let data = `<h1>${dia}/${parseInt(mes)+1}/${ano}</h1>`;
    btnAddEvt.disabled = false;

    dataEvento.insertAdjacentHTML('afterbegin', data);

    if (document.getElementById(antDiaSelecionado)) {
        document.getElementById(antDiaSelecionado).classList.remove('bg-calendario');
    }

    event.target.classList.add('bg-calendario');
    antDiaSelecionado = event.target.id; //vira o anterior
    dataNovo.value = event.target.id;  //vai para o form para adicionar evento

    populaListaEventos(getEventosDia(dia));

}

function populaListaEventos(arrayEventos) { //mostra todos os eventos do dia selecionado
    while(eventosLista.firstChild) {
        eventosLista.removeChild(eventosLista.lastChild);
    }

    let elementEvento = ``;

    if (arrayEventos.length == 0) {
        elementEvento = `<div class="text-center">
                            <p>Sem Eventos para hoje</p>
                        </div>`
    } else {
        for (let i = 0; i < arrayEventos.length; i++) {
            elementEvento += `<div class="row w-100 border-bottom mt-2">
                                <div class="d-flex flex-column align-items-center col-3 mb-2">
                                    <p>${arrayEventos[i].horaInicio}h00</p>
                                    <p>|</p>
                                    <p>${arrayEventos[i].horaFim}h00</p>
                                    <button class="btn btn-danger w-100 mb-1" id="${arrayEventos[i]._id}" onclick="excEvento(event)">Excluir</button>
                                    <button class="btn btn-primary w-100" data-toggle="modal" data-target="#eventoModal" id="${arrayEventos[i]._id}" onclick="atualizaEvento(event)">
                                        Atualizar
                                    </button>
                                </div>
                                <div class="col-9">
                                    <p>${arrayEventos[i].descricao}</p>
                                </div>
                            </div>`;
        }
    }

    if (document.getElementById(antDiaSelecionado)) { //desabilita as horas de cada evento se existir um dia selecionado no calendario
        desabilitaHora(arrayEventos);
    }
    eventosLista.insertAdjacentHTML('afterbegin', elementEvento);
}

function getEventosMes(mes, ano) { //pega todos os eventos do mes no banco
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'eventos?mes='+mes+'&ano='+ano, true);
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            
            eventosMes = JSON.parse(xmlhttp.responseText);
            gerCalendario(month, year);
            if (document.getElementById(antDiaSelecionado)) {
                populaListaEventos(getEventosDia(diaSelecionado));
            }
        }
    };
    xmlhttp.send();
}

function getEventosDia(dia) { //pega os eventos do dia selecionado
    let arrayEventos = [];
    for (let i = 0; i < eventosMes.length; i++) {
        if (eventosMes[i].diaEvento == dia) {
            arrayEventos.push(eventosMes[i]);
        }
    }

    return arrayEventos;
}

function desabilitaHora(eventos) { //desabilita as horas que poderao ser selecionadas de um evento ja existente
    let horas = new Array(24);
    let elements = ``;
    
    eventos.forEach((evento) => {
        let inicio = evento.horaInicio;
        let fim = evento.horaFim;      

        for (let i = 0; i < 24; i++) {
            if (i >= inicio && i <= fim) {
                horas[i] = i;
            } else if (horas[i] == null) {
                horas[i] = null;
            }
        }
    });

    
    for (let i = 0; i < 24; i++) {
        if (horas[i] == i) {
            elements += `<option value="${i}" disabled>${i}h00</option>`;
        } else {
            elements += `<option value="${i}">${i}h00</option>`;
        }
    }

    while (selHoraInicio.firstChild) {
        selHoraInicio.removeChild(selHoraInicio.lastChild);
    }
    selHoraInicio.insertAdjacentHTML('afterbegin', elements);

    while (selHoraFim.firstChild) {
        selHoraFim.removeChild(selHoraFim.lastChild);
    }
    selHoraFim.insertAdjacentHTML('afterbegin', elements);
}

function addEventoBanco() { //adiciono evento
    formEvento.onsubmit = function (e) {
        e.preventDefault();

        let idTarget = document.getElementById('_id').value,
            dataTarget = document.getElementById('dataNovo').value,
            descricaoTarget = document.getElementById('descricao').value,
            horaInicioTarget = document.getElementById('horaInicio').value,
            horaFimTarget = document.getElementById('horaFim').value;

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'evento/adicionar', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                getEventosMes(month, year);
                
            } else if (xmlhttp.readyState === 4 && xmlhttp.status === 401) {
                eventosLista.insertAdjacentHTML('afterbegin',`<div id="alert-hora" class="alert alert-danger position-absolute justify-content-center w-75 m-2 text-center" role="alert" style="z-index: 1;">
                                                    ${xmlhttp.responseText}
                                                </div>`);
            
                setTimeout(() => {
                    document.getElementById('alert-hora').classList.add('d-none');
                }, 2000);
            }
        }
        xmlhttp.send(JSON.stringify({usuarioId:`${idTarget}`, 
                                    dataEvento:`${dataTarget}`, 
                                    descricao:`${descricaoTarget}`, 
                                    horaInicio:`${horaInicioTarget}`, 
                                    horaFim:`${horaFimTarget}`}));

        btnFecha.click();
    };
}

function excEvento(event) { //excluir evento

    let eventoExcluir;

    getEventosDia(diaSelecionado).forEach((evento) => {
        if (evento._id == event.target.id) {
            eventoExcluir = evento;
        }
    });

    if (antEventoAlterado._id == eventoExcluir._id) {
        for (let i = parseInt(eventoExcluir.horaInicio); i <= parseInt(eventoExcluir.horaFim); i++) {
            selHoraInicio.childNodes[i].disabled = false;
            selHoraFim.childNodes[i].disabled = false;
            antEventoAlterado = null;
        }
    }

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'evento/remover', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            
            getEventosMes(month, year);
            
        }
    }
    xmlhttp.send(JSON.stringify({_id: `${eventoExcluir._id}`,
                                usuarioId:`${eventoExcluir.usuarioId}`, 
                                dataEvento:`${eventoExcluir.diaEvento}-${eventoExcluir.mesEvento}-${eventoExcluir.anoEvento}`, 
                                descricao:`${eventoExcluir.descricao}`, 
                                horaInicio:`${eventoExcluir.horaInicio}`, 
                                horaFim:`${eventoExcluir.horaFim}`}));
    
}

function atualizaEvento(event) { //atualiza o evento
    let eventoAtualizar;
    let id = event.target.id;

    getEventosDia(diaSelecionado).forEach((evento) => {
        if (evento._id == id) {
            eventoAtualizar = evento;
        }
    });

    if (antEventoAlterado) {
        for (let i = parseInt(antEventoAlterado.horaInicio); i <= parseInt(antEventoAlterado.horaFim); i++) {
            selHoraInicio.childNodes[i].disabled = true;
            selHoraFim.childNodes[i].disabled = true;
        }
    }

    for (let i = parseInt(eventoAtualizar.horaInicio); i <= parseInt(eventoAtualizar.horaFim); i++) {
        selHoraInicio.childNodes[i].disabled = false;
        selHoraFim.childNodes[i].disabled = false;
    }

    //todas as informacoes atuais do evento no formulario
    descricaoText.value = eventoAtualizar.descricao;
    selHoraInicio.childNodes[eventoAtualizar.horaInicio].selected = true;
    selHoraFim.childNodes[eventoAtualizar.horaFim].selected = true;
    formEvento.action = '/evento/atualizar';
    btnAddForm.innerHTML = 'Atualizar';

    formEvento.onsubmit = function (e) {
        e.preventDefault();

        let idTarget = document.getElementById('_id').value,
            dataTarget = document.getElementById('dataNovo').value,
            descricaoTarget = document.getElementById('descricao').value,
            horaInicioTarget = document.getElementById('horaInicio').value,
            horaFimTarget = document.getElementById('horaFim').value;

        let xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', 'evento/atualizar', true);
        xmlhttp.setRequestHeader('Content-Type', 'application/json');
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                getEventosMes(month, year);
                
            } else if (xmlhttp.readyState === 4 && xmlhttp.status === 401) {
                eventosLista.insertAdjacentHTML('afterbegin',`<div id="alert-hora" class="alert alert-danger position-absolute justify-content-center w-75 m-2 text-center" role="alert" style="z-index: 1;">
                                                    ${xmlhttp.responseText}
                                                </div>`);
            
                setTimeout(() => {
                    document.getElementById('alert-hora').classList.add('d-none');
                }, 2000);
            }
        }
        xmlhttp.send(JSON.stringify({_id: `${id}`,
                                    usuarioId:`${idTarget}`, 
                                    dataEvento:`${dataTarget}`, 
                                    descricao:`${descricaoTarget}`, 
                                    horaInicio:`${horaInicioTarget}`, 
                                    horaFim:`${horaFimTarget}`}));

        btnFecha.click();
    };

    antEventoAlterado = eventoAtualizar;
}

function limpaFormEvento() {
    addEventoBanco();

    descricaoText.value = '';
    selHoraInicio.childNodes[0].selected = true;
    selHoraFim.childNodes[0].selected = true;

    formEvento.action = '/evento/adicionar';
    btnAddForm.innerHTML = 'Adicionar';

    if (antEventoAlterado) {
        for (let i = parseInt(antEventoAlterado.horaInicio); i <= parseInt(antEventoAlterado.horaFim); i++) {
            selHoraInicio.childNodes[i].disabled = true;
            selHoraFim.childNodes[i].disabled = true;
        }
    }
}

getEventosMes(month, year);
populaListaEventos([]);