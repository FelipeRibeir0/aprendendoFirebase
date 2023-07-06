import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAsSrHYDd9u-1hs3eUKSYxUNPc2pNoEzeI",
  authDomain: "projetocrud-58412.firebaseapp.com",
  projectId: "projetocrud-58412",
  storageBucket: "projetocrud-58412.appspot.com",
  messagingSenderId: "157541699133",
  appId: "1:157541699133:web:d8d7a574c479a347352454",
  measurementId: "G-SLL6TYHF2Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  const divProfile = document.getElementById("div-profile");

  if (user) {
    const user = auth.currentUser;
    const photoURL = user.photoURL;
    const profileImage = document.createElement("img");
    profileImage.alt = "Avatar do usuário";
    profileImage.id = "profile-image";
    if (photoURL) {
      profileImage.src = user.photoURL;

    } else {
      profileImage.src = 'https://firebasestorage.googleapis.com/v0/b/projetocrud-58412.appspot.com/o/photoUsers%2FdefaultAvatar.png?alt=media&token=a92d5f14-8f2f-4efc-901b-120fc7d7bf8a';
    }
    divProfile.appendChild(profileImage);
    const imgProfile = document.getElementById("profile-image");

    imgProfile.onclick = () => {
      window.location.href = "profile.html";
    }

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', () => {
      Swal.fire({
        title: 'Você deseja sair de sua conta?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
      }).then((result) => {
        if (result.isConfirmed) {
          signOut(auth).then(() => {
            window.location.href = "index.html";
          })
        }
      }).catch((error) => {
        alert('Erro ao desconectar usuário:', error);
      });
    });

  }
  else {
    divProfile.innerHTML = `
    <i class="fa fa-user" id="icon-profile"></i>
    <span id="profile">Entrar</span>
  `;
    divProfile.onclick = () => {
      window.location.href = "login.html";
    }
  }
});


export { app, auth };