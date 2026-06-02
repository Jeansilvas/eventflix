import { auth } from "./firebase.js"; // Se a porra da pasta que esta o arquivo estiver na raiz se usa a merda do ./ ao inves de só /

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const form = document.getElementById("loginForm"); //pega as informações do formulario login da pagina

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("email").value;   //pega o email e senha digitados pelo fdp
  const senha = document.getElementById("senha").value;

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      senha
    );                                     //faz a verificação

    window.location.href = "home.html";  // direviona para o feed

  } catch (erro) {

    alert("Email ou senha inválidos");

    console.error(erro);

  }

});