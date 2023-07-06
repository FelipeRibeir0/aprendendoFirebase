import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth, app } from "./fbconfig.js";

const provider = new GoogleAuthProvider(app);
const loginGoogle = document.querySelector(".loginBtnGoogle");
const formEsqueceuSenha = document.getElementById('formRecupSenha');

  formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    const displayName = formCadastro['nome'].value;
    const email = formCadastro['emailCad'].value;
    const senha = formCadastro['senha'].value;
    const confirmarSenha = formCadastro['confirmarSenha'].value;
    const manterLogado = document.getElementById('manterLogado').checked;

    if (confirmarSenha == senha) {
      createUserWithEmailAndPassword(auth, email, senha)
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, { displayName })
            .then(() => {
              signInWithEmailAndPassword(auth, email, senha)
                .then(() => {
                  manterlogin(manterLogado);
                  divCadastroFinal.classList.remove('hidden');
                  divCadastro.classList.add('hidden');
                })
            })
        }).catch((error) => {

          if (error == "FirebaseError: Firebase: Error (auth/email-already-in-use).") {
            exibirPopup("error", "Oops...", "O Email já está cadastrado", "Você está tentando Logar?");
          }
          else if (error == "FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).") {
            exibirPopup("error", "Oops...", "Senha fraca", "A senha precisa de pelo menos 6 caractéres");
          }
          else if (error == "FirebaseError: Firebase: Error (auth/invalid-email).") {
            exibirPopup("error", "Oops...", "Este Email é inválido", "Escreva o Email corretamente");
          }
        });
    }
    else {
      exibirPopup("error", "Oops...", "'Confirmar senha' e 'senha' estão com senhas diferentes", "Corrija estes campos e tente se cadastrar novamente");
    }
  });


  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = formLogin['email'].value;
    const password = formLogin['password'].value;
    const manterLogado = document.getElementById('manterLogado').checked;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        manterlogin(manterLogado);
        window.location.href = "index.html";
      })
      .catch((error) => {
        if (error == "FirebaseError: Firebase: Error (auth/user-not-found).") {
          exibirPopup("error", "Oops...", "Usuário não encontrado", "Verifique se o email está correto")
        }
        else if (error == "FirebaseError: Firebase: Error (auth/wrong-password).") {
          exibirPopup("error", "Oops...", "Senha incorreta", "Tente novamente ou mude sua senha")
        }
      });
  });

  loginGoogle.addEventListener('click', (e) => {
    signInWithPopup(auth, provider)
      .then(() => {
        manterlogin(manterLogado);
        window.location.href = "index.html";

      }).catch((error) => {
        exibirPopup("error", "Oops...", error.message, "Tente novamente");
      })
  });

  formEsqueceuSenha.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("emailRecupSenha").value;

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "E-mail enviado",
          text: "Verifique seu email para redefinir sua senha",
        })
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Algo deu errado",
          text: "Verifique se o email está escrito corretamente",
          timer: 7000
        })
      });
  });

function exibirPopup(iconValue, titleMessage, txtMessage, footerMessage) {
  Swal.fire({
    icon: iconValue,
    title: titleMessage,
    text: txtMessage,
    footer: footerMessage,
    timer: 7000
  });
}

export function manterlogin(manterLogado) {
  const persistence = manterLogado ? browserLocalPersistence : browserSessionPersistence;

  setPersistence(auth, persistence).then(() => {
    console.log(persistence);
  })
}