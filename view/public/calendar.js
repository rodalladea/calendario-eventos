const milissegundosPorDia = 1000 * 60 * 60 * 24;
var dateObj = new Date();

var month = dateObj.getMonth();
var day = dateObj.getDate();
var year = dateObj.getFullYear();
var diaAgora = dateObj.getDay();

var months = ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

var markup;

function maisMes() {
    if (month < 11) {
        month += 1;
    } else {
        month = 0;
        year +=1;
    }
    gerCalendario(month, year);
}

function menosMes() {
    if (month > 0) {
        month -= 1;
    } else {
        month = 11;
        year -= 1;
    }
    gerCalendario(month, year);
}

function gerCalendario(mes, ano) {
    let parent = document.getElementById('diasCalendario');

    while (parent.firstChild) {
        parent.removeChild(parent.lastChild);
    }

    let primeiroDia = new Date(ano, mes, 1);
    let ultimoDia = new Date(ano, mes+1, 0);
    let primeiroDomingo = new Date(primeiroDia.getTime() - primeiroDia.getDay() * milissegundosPorDia).getDate();
    let ultimoSabado = new Date(ultimoDia.getTime() + Math.abs(ultimoDia.getDay() - 6) * milissegundosPorDia).getDate();

    let primeiroDiaNum = primeiroDia.getDate();
    let ultimoDiaNum = ultimoDia.getDate();

    markup = `<div class="calen">
                <h2 class="d-inline-block mr-3">${months[mes]}</h2>
                <h2 class="d-inline-block">${ano}</h2>
             </div>
             <div class="mt-3 calen text-center">
                <div class="d-inline-block text-center" style="width: 45px;">Dom</div>
                <div class="d-inline-block text-center" style="width: 45px;">Seg</div>
                <div class="d-inline-block text-center" style="width: 45px;">Ter</div>
                <div class="d-inline-block text-center" style="width: 45px;">Qua</div>
                <div class="d-inline-block text-center" style="width: 45px;">Qui</div>
                <div class="d-inline-block text-center" style="width: 45px;">Sex</div>
                <div class="d-inline-block text-center" style="width: 45px;">Sab</div>
             </div>
             <div class="mt-1 calen text-center">`;

    let aux = 1;
    for (let i = (primeiroDia.getDate()-primeiroDia.getDay()); i <= (ultimoDia.getDate()+Math.abs(ultimoDia.getDay() - 6)); i++) {

        if (i<=0) {
            markup = markup + `<div class="d-inline-block text-center" style="width: 50px;"> ${primeiroDomingo} </div>`;
            primeiroDomingo++;
        } else if (i <= ultimoDiaNum) {
            markup = markup + `<div class="d-inline-block text-center" style="width: 50px;"> ${primeiroDiaNum} </div>`;
            primeiroDiaNum++;
        } else {
            markup = markup + `<div class="d-inline-block text-center" style="width: 50px;"> ${i - ultimoDia.getDate()} </div>`;
        }

        if (aux % 7 == 0) {
            markup = markup + `</div>
                               <div class="mt-1 calen text-center">`;
        }

        aux++;
    }
    
    markup = markup + `</div>`;

    if (aux <= 36) {

        markup = markup + `<div class="mt-1 calen text-center">`;
        console.log(ultimoSabado);
        console.log(ultimoDia);

        for (let i = 1; i <= 7; i++) {
            markup = markup + `<div class="d-inline-block text-center" style="width: 50px;"> ${ultimoSabado === ultimoDia.getDate() ? i : ultimoSabado + i} </div>`;
        }

        markup = markup + `</div>`;
        
    }

    parent.insertAdjacentHTML('beforeend', markup);

}

gerCalendario(month, year);