import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let usuarioAtual = null;
let eventos = [];

window.abrirModal = (id) => {
  document.getElementById(id).style.display = "flex";
};

window.fecharModal = (id) => {
  document.getElementById(id).style.display = "none";
};

async function carregarPerfil(uid) {

  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return;

  const dados = docSnap.data();

  document.getElementById("profileNameView").textContent =
    dados.nome || "";

  document.getElementById("profileEmailView").textContent =
    dados.email || "";

  document.getElementById("profileJobView").textContent =
    dados.profissao || "";

  document.getElementById("profileName").value =
    dados.nome || "";

  document.getElementById("profileEmail").value =
    dados.email || "";

  document.getElementById("profileJob").value =
    dados.profissao || "";
}

document
  .getElementById("saveProfileBtn")
  .addEventListener("click", async () => {

    if (!usuarioAtual) return;

    const nome =
      document.getElementById("profileName").value;

    const email =
      document.getElementById("profileEmail").value;

    const profissao =
      document.getElementById("profileJob").value;

    await updateDoc(
      doc(db, "usuarios", usuarioAtual.uid),
      {
        nome,
        email,
        profissao
      }
    );

    document.getElementById("profileNameView").textContent =
      nome;

    document.getElementById("profileEmailView").textContent =
      email;

    document.getElementById("profileJobView").textContent =
      profissao;

    fecharModal("profileModal");

    alert("Perfil atualizado!");
  });

document
  .getElementById("logoutBtn")
  .addEventListener("click", async () => {

    await signOut(auth);

    window.location.href = "index.html";
  });

document
  .getElementById("saveEventBtn")
  .addEventListener("click", async () => {

    if (!usuarioAtual) return;

    const titulo =
      document.getElementById("eventTitle").value;

    const cidade =
      document.getElementById("eventCity").value;

    const data =
      document.getElementById("eventDate").value;

    const hora =
      document.getElementById("eventTime").value;

    const vagas =
      Number(
        document.getElementById("eventVacancies").value
      );

    const tipo =
      document.getElementById("eventType").value;

    if (!titulo || !cidade || !data) {

      alert("Preencha os campos obrigatórios");

      return;
    }

    await addDoc(
      collection(db, "eventos"),
      {
        titulo,
        cidade,
        data,
        hora,
        vagas,
        vagasDisponiveis: vagas,
        tipo,
        criador: usuarioAtual.uid,
        criadoEm: new Date()
      }
    );

    fecharModal("eventModal");

    await carregarEventos();
  });

async function carregarEventos() {

  const q = query(
    collection(db, "eventos"),
    orderBy("criadoEm", "desc")
  );

  const snapshot = await getDocs(q);

  eventos = [];

  snapshot.forEach(doc => {

    eventos.push({
      id: doc.id,
      ...doc.data()
    });

  });

  mostrarDashboard();
}

function gerarEventos(lista) {

  if (lista.length === 0) {

    return `
      <div class="empty">
        Nenhum evento encontrado.
      </div>
    `;
  }

  return `
    <div class="events-grid">
      ${lista.map(evento => `
        <div class="event-card">

          <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop">

          <div class="event-content">

            <h3>${evento.titulo}</h3>

            <div class="event-info">
              📍 ${evento.cidade}<br>
              📅 ${evento.data}<br>
              ⏰ ${evento.hora}<br>
              👥 ${evento.vagasDisponiveis} vagas
            </div>

          </div>

        </div>
      `).join("")}
    </div>
  `;
}

function mostrarDashboard() {

  document.getElementById("pageTitle").textContent =
    "Dashboard";

  document.getElementById("content").innerHTML = `
    <h2 class="section-title">
      ✨ Eventos Recentes
    </h2>

    ${gerarEventos(eventos)}
  `;
}

window.mostrarSecao = (secao) => {

  if (secao === "dashboard") {

    mostrarDashboard();

    return;
  }

  if (secao === "meusEventos") {

    const meus = eventos.filter(
      e => e.criador === usuarioAtual.uid
    );

    document.getElementById("pageTitle").textContent =
      "Meus Eventos";

    document.getElementById("content").innerHTML =
      gerarEventos(meus);

    return;
  }
};

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    window.location.href = "index.html";

    return;
  }

  usuarioAtual = user;

  await carregarPerfil(user.uid);

  await carregarEventos();
});