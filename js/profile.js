import {
    updateProfile,
    updateEmail,
    updatePassword,
    deleteUser,
    reauthenticateWithCredential,
    EmailAuthProvider,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "./fbconfig.js";

const divDados = document.getElementById("dados");

onAuthStateChanged(auth, (user) => {
    if (user) {
        divDados.innerHTML = `
    <p id="dadosNome"> Nome: ${user.displayName}</p>
    <p id="dadosEmail"> Email: ${user.email}</p>
    `;
    }
    else {
        exibirPopup("error", "Ops!", "Parece que você não está logado", "Para acessar esta tela você precisa estar autenticado", 3500)
        setTimeout(() => { window.location.href = 'login.html' }, 3800);
    }
    let dadosNome = document.getElementById("dadosNome");
    let dadosEmail = document.getElementById("dadosEmail");
})

const deleteAccountButton = document.getElementById('deleteAccount');
deleteAccountButton.addEventListener('click', () => {
    Swal.fire({
        title: 'Você deseja excluir sua conta?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    }).then((result) => {
        if (result.isConfirmed) {
            const user = auth.currentUser;
            deleteUser(user)
                .then(() => {
                    exibirPopup("success", "Sucesso!", "Usuário excluido com sucesso", "", 2000)
                    setTimeout(() => { window.location.href = 'index.html' }, 3000);
                })
                .catch(() => {
                    exibirPopup("error", "Ops", "Algo deu errado", "Tente excluir novamente", 6000)
                });
        }
    });
});

//Dropdown
let alterarDropdown = document.querySelector(".drpbtn");
const dropmenu = document.querySelector(".drpmenu")
let setaDropdown = document.querySelector(".fa-chevron-down");

alterarDropdown.addEventListener("mouseover",() => {
    setaDropdown.style.display = "none";
});

alterarDropdown.addEventListener("mouseout",() => {
    setaDropdown.style.display = "inline-block";
});

dropmenu.addEventListener("mouseover",() => {
    setaDropdown.style.display = "none";
});

dropmenu.addEventListener("mouseout",() => {
    setaDropdown.style.display = "inline-block";
});

// Botões do Dropdown
const btnNomeForm = document.getElementById("showNomeForm");
const btnEmailForm = document.getElementById("showEmailForm");
const btnSenhaForm = document.getElementById("showSenhaForm");

// Sections dos Forms
const divNomeForm = document.getElementById("nomeForm");
const divEmailForm = document.getElementById("emailForm");
const divSenhaForm = document.getElementById("senhaForm");

//Forms
const nomeForm = document.getElementById("mudarNome");
const emailForm = document.getElementById("mudarEmail");
const senhaForm = document.getElementById("mudarSenha");

btnNomeForm.addEventListener('click', () => {
    divDados.style.display = 'none';
    divEmailForm.classList.add('hidden');
    divSenhaForm.classList.add('hidden');
    divNomeForm.classList.remove('hidden');

})

btnEmailForm.addEventListener('click', () => {
    divDados.style.display = 'none';
    divNomeForm.classList.add('hidden');
    divSenhaForm.classList.add('hidden');
    divEmailForm.classList.remove('hidden');
})

btnSenhaForm.addEventListener('click', () => {
    divDados.style.display = 'none';
    divNomeForm.classList.add('hidden');
    divEmailForm.classList.add('hidden');
    divSenhaForm.classList.remove('hidden');
})

// Submit dos Forms

nomeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let novoNome = document.getElementById("name").value;
    const user = auth.currentUser;

    updateProfile(user, { displayName: novoNome })
        .then(() => {
            dadosNome.textContent = "Nome: " + novoNome;
            exibirPopup("success", "Sucesso!", "Nome alterado com sucesso", "", 3000)
            divNomeForm.classList.add('hidden');
            divDados.style.display = 'flex';
        })
        .catch((error) => {
            exibirPopup("error", "Algo deu errado", error.message, "", 5000);
        });
})

emailForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let novoEmail = document.getElementById("email").value;
    let senha = document.getElementById("senha").value;

    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, senha);

    reauthenticateWithCredential(user, credential)
        .then(() => {
            updateEmail(user, novoEmail)
                .then(() => {
                    dadosEmail.textContent = "Email: " + novoEmail;
                    exibirPopup("success", "Sucesso!", "Email alterado com sucesso", "", 3000)
                    divEmailForm.classList.add('hidden');
                    divDados.style.display = 'flex';
                })
                .catch((error) => {
                    exibirPopup("error", "Ops!", error.message, "", 5000)
                });
        })
        .catch((error) => {
            exibirPopup("error", "Ops!", error.message, "", 5000)
        });
})

senhaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let senhaAntiga = document.getElementById("senhaAntiga").value;
    let senhaNova = document.getElementById("senhaNova").value;
    let senhaNovaConfirmar = document.getElementById("confirmarSenha").value;

    if (senhaNova === senhaNovaConfirmar) {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, senhaAntiga);

        reauthenticateWithCredential(user, credential)
            .then(() => {
                updatePassword(user, senhaNova)
                    .then(() => {
                        exibirPopup("success", "Sucesso!", "Senha alterada com sucesso", "", 3000)
                        divSenhaForm.classList.add('hidden');
                        divDados.style.display = 'flex';
                    })
                    .catch((error) => {
                        exibirPopup("error", "Algo deu errado", error.message, "", 5000);
                    });
            })
            .catch((error) => {
                exibirPopup("error", "Algo deu errado", error.message, "", 5000);
            });
    }
    else {
        exibirPopup("error", "Algo deu errado", "Preencha corretamente os campos Nova Senha e Confirmar Nova Senha", "", 5000);
    }
})

const fecharForm = document.getElementById("returnButton");

fecharForm.addEventListener("click",()=> {
    divNomeForm.classList.add('hidden');
    divEmailForm.classList.add('hidden');
    divSenhaForm.classList.add('hidden');
    divDados.style.display = 'flex';
})

function exibirPopup(iconValue, tittleValue, textValue, footerValue, timerValue) {
    Swal.fire({
        icon: iconValue,
        title: tittleValue,
        text: textValue,
        footer: footerValue,
        timer: timerValue
    });
}