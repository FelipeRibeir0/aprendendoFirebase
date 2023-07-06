const showCadastro = document.getElementById("showCadastro");
const showLogin = document.getElementById("showLogin");
const btnEsqueceuSenha = document.getElementById("esqueceuSenha");
const btnBackLogin = document.getElementById("backLogin");
const btnLoginExit = document.getElementById("exitButton");
const btnCadastrar = document.getElementById("signUp");

const divCadastro = document.getElementById("cadastroTela");
const divLogin = document.getElementById("loginTela");
const divRecupSenha = document.getElementById("recupSenhaTela");

btnLoginExit.addEventListener("click", () => {
  window.location.href = "index.html";
})

showCadastro.addEventListener("click", () => {
  divLogin.classList.add('hidden');
  divCadastro.classList.remove('hidden');
})

showLogin.addEventListener("click", () => {
  divLogin.classList.remove('hidden');
  divCadastro.classList.add('hidden');
})

btnEsqueceuSenha.addEventListener("click", () => {
  divRecupSenha.classList.remove('hidden');
  divLogin.classList.add('hidden');
})

btnBackLogin.addEventListener("click", () => {
  divLogin.classList.remove('hidden');
  divRecupSenha.classList.add('hidden');
})