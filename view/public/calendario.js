const milissegundosPorDia = 1000 * 60 * 60 * 24;
var dateObj = new Date();

var month = dateObj.getMonth();
var day = dateObj.getDate();
var year = dateObj.getFullYear();

var months = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

var markup;
var antEvent = null;
var eventosMes = [];
var diaSelecionado;

var dataEvento = document.getElementById('dataEvento');
var diasCalendario = document.getElementById('diasCalendario');
var dataNovo = document.getElementById('dataNovo');
var btnAddEvt = document.getElementById('btnAddEvt');
var eventosLista = document.getElementById('eventosLista');
var formEvento = document.getElementById('formEvento');
var btnFecha = document.getElementById('btnFecha');

function maisMes() {
    if (month < 11) {
        month += 1;
    } else {
        month = 0;
        year +=1;
    }
    getEventosMes(month, year);
}

function menosMes() {
    if (month > 0) {
        month -= 1;
    } else {
        month = 11;
        year -= 1;
    }
    getEventosMes(month, year);
}

function gerCalendario(mes, ano) {
    
    while (diasCalendario.firstChild) {
        diasCalendario.removeChild(diasCalendario.lastChild);
    }
    

    let primeiroDia = new Date(ano, mes, 1);
    let ultimoDia = new Date(ano, mes+1, 0);
    let primeiroDomingo = new Date(primeiroDia.getTime() - primeiroDia.getDay() * milissegundosPorDia).getDate();
    let ultimoSabado = new Date(ultimoDia.getTime() + Math.abs(ultimoDia.getDay() - 6) * milissegundosPorDia).getDate();

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
             <div class="mt-1 text-center">`;

    let aux = 1;
    for (let i = (primeiroDia.getDate()-primeiroDia.getDay()); i <= (ultimoDia.getDate()+Math.abs(ultimoDia.getDay() - 6)); i++) {
        let diaHoje = (primeiroDiaNum === dateObj.getDate()) && (mes === dateObj.getMonth()) && (ano === dateObj.getFullYear());

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
            let dia = ultimoSabado === ultimoDia.getDate() ? i : ultimoSabado + i;
            markup = markup + `<div class="d-inline-block text-center w-calendario ${i % 7 == 0 ? '' : 'mr-1'}">
                                    <button class="btn ${verificaData(dia, mes+1, ano, 'secundario')} w-100" onclick="getData(event)" id="${dia+'-'+(mes+1)+'-'+ano}" disabled>
                                        ${dia}
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

    if (document.getElementById(antEvent)) {
        document.getElementById(antEvent).classList.add('bg-calendario');
    }

}

function verificaData(dia, mes, ano, tipo) {
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


function getData(event) {
    dataEvento.removeChild(dataEvento.firstChild);

    let dataArray = event.target.id.split('-');

    let dia = dataArray[0];
    let mes = dataArray[1];
    let ano = dataArray[2];
    diaSelecionado = dia;

    let data = `<h1>${dia}/${parseInt(mes)+1}/${ano}</h1>`;
    btnAddEvt.disabled = false;

    dataEvento.insertAdjacentHTML('afterbegin', data);

    if (document.getElementById(antEvent)) {
        document.getElementById(antEvent).classList.remove('bg-calendario');
    }

    event.target.classList.add('bg-calendario');
    antEvent = event.target.id;
    dataNovo.value = event.target.id;

    populaListaEventos(getEventosDia(dia));

}

function populaListaEventos(arrayEventos) {
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
            elementEvento += `<div class="row w-100 border-bottom mt-2" id="${arrayEventos[i]._id}">
                                <div class="d-flex flex-column align-items-center col-2 mb-2">
                                    <p>${arrayEventos[i].horaInicio}h00</p>
                                    <p>|</p>
                                    <p>${arrayEventos[i].horaFim}h00</p>
                                    <a href="">Excluir</a>
                                    <a href="" data-toggle="modal" data-target="#eventoModal">Atualizar</a>
                                </div>
                                <div class="col-10">
                                    <p>${arrayEventos[i].descricao}</p>
                                </div>
                            </div>`;
        }
    }

    eventosLista.insertAdjacentHTML('afterbegin', elementEvento);
}

function getEventosMes(mes, ano) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'eventos?mes='+mes+'&ano='+ano, true);
    xmlhttp.onreadystatechange = function () {
        if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            eventosMes = JSON.parse(xmlhttp.responseText);
            gerCalendario(month, year);
            if (document.getElementById(antEvent)) {
                populaListaEventos(getEventosDia(diaSelecionado));
            }
        }
    };
    xmlhttp.send();
}

function getEventosDia(dia) {
    let arrayEventos = [];
    for (let i = 0; i < eventosMes.length; i++) {
        if (eventosMes[i].diaEvento == dia) {
            arrayEventos.push(eventosMes[i]);
        }
    }

    console.log(arrayEventos);

    return arrayEventos;
}

function addEventoBanco() {
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
                //const data = JSON.parse(xmlhttp.responseText);
                
                console.log('confirmado');
                
            }
        }
        xmlhttp.send(JSON.stringify({usuarioId:`${idTarget}`, 
                                    dataEvento:`${dataTarget}`, 
                                    descricao:`${descricaoTarget}`, 
                                    horaInicio:`${horaInicioTarget}`, 
                                    horaFim:`${horaFimTarget}`}));

        btnFecha.click();
        getEventosMes(month, year);
        
    };
}

getEventosMes(month, year);
populaListaEventos([]);
addEventoBanco();