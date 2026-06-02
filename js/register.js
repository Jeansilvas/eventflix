import { auth } from "./firebase.js"; 

import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const db = getFirestore();

const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const idade = document.getElementById("idade").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {

    const credencial =
      await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );

    await setDoc(
      doc(db, "usuarios", credencial.user.uid),
      {
        nome,
        idade,
        email,
        criadoEm: new Date()
      }
    );

    alert("Cadastro realizado com sucesso!");

    window.location.href = "index.html";

  } catch (erro) {

    alert(erro.message);

    console.error(erro);

  }

});