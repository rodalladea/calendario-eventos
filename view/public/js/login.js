document.getElementById('formLogin').onsubmit = function (e) {
    e.preventDefault();

    let emailTarget = document.getElementById('email').value,
        senhaTarget = document.getElementById('senha').value;

    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('POST', 'login', true);
    xmlhttp.setRequestHeader('Content-Type', 'application/json');
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            window.location.href = 'calendario';
            
        } else if (xmlhttp.readyState === 4 && xmlhttp.status === 403) {
            const data = JSON.parse(xmlhttp.responseText);
            if (data.id == 'email') {
                let email = document.getElementById('email');
                email.classList.add('is-invalid');
                email.insertAdjacentHTML('afterend', `<div class="invalid-feedback">${data.mensagem}</div>`);
            } else {
                let senha = document.getElementById('senha');
                senha.classList.add('is-invalid');
                senha.insertAdjacentHTML('afterend', `<div class="invalid-feedback">${data.mensagem}</div>`);
            }
        }
    }
    xmlhttp.send(JSON.stringify({email:`${emailTarget}`, 
                                senha:`${senhaTarget}`}));
};