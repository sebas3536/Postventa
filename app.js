let cases = [];

// LOGIN
function login(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch("data/users.json")
  .then(r=>r.json())
  .then(users=>{
    const user = users.find(u => u.email===email && u.password===password);

    if(user){
      localStorage.setItem("user", JSON.stringify(user));

      if(user.role === "admin"){
        window.location = "dashboard.html";
      } else {
        window.location = "user.html";
      }

    } else {
      alert("Credenciales incorrectas");
    }
  });
}

function emailInput(id){
  return document.getElementById(id).value;
}

// INIT
function initDashboard(){
  const user = JSON.parse(localStorage.getItem("user"));
  if(!user) return window.location="index.html";

  fetch("data/cases.json")
  .then(r=>r.json())
  .then(data=>{
    cases = data.filter(c=>c.userId===user.id);
    render();
  });
}

// CREATE
function createCase(){
  const user = JSON.parse(localStorage.getItem("user"));
  const desc = document.getElementById("description").value;

  cases.push({
    id:Date.now(),
    userId:user.id,
    type:"Reclamo",
    description:desc,
    status:"Pendiente"
  });

  render();
}

// CHANGE STATUS
function changeStatus(id, status){
  const c = cases.find(x=>x.id===id);
  c.status = status;
  render();
}

// RENDER
function render(){
  renderCases();
  renderKPIs();
}

function renderCases(){
  const div = document.getElementById("cases");

  div.innerHTML = cases.map(c=>`
    <div class="case">
      <strong>${c.type}</strong>
      <p>${c.description}</p>
      <span class="status ${getClass(c.status)}">${c.status}</span>

      <div class="actions">
        <button onclick="changeStatus(${c.id},'Pendiente')">⏳</button>
        <button onclick="changeStatus(${c.id},'En proceso')">⚙️</button>
        <button onclick="changeStatus(${c.id},'Resuelto')">✅</button>
      </div>
    </div>
  `).join("");
}

function getClass(status){
  if(status==="Pendiente") return "pendiente";
  if(status==="En proceso") return "proceso";
  return "resuelto";
}

// KPIs
function renderKPIs(){
  document.getElementById("total").innerText = cases.length;
  document.getElementById("pendientes").innerText = cases.filter(c=>c.status==="Pendiente").length;
  document.getElementById("proceso").innerText = cases.filter(c=>c.status==="En proceso").length;
  document.getElementById("resueltos").innerText = cases.filter(c=>c.status==="Resuelto").length;
}

// LOGOUT
function logout(){
  localStorage.clear();
  window.location="index.html";
}

// Vista usuario
function initUserView(){
  const user = JSON.parse(localStorage.getItem("user"));
  if(!user) return window.location="index.html";

  fetch("data/cases.json")
  .then(r=>r.json())
  .then(data=>{
    cases = data.filter(c=>c.userId===user.id);
    renderUserCases();
  });
}

// Render usuario (SIN botones admin)
function renderUserCases(){
  const div = document.getElementById("cases");

  if(cases.length === 0){
    div.innerHTML = `
      <div class="text-center text-muted py-4">
        No tienes solicitudes aún
      </div>
    `;
    return;
  }

  div.innerHTML = cases.map(c=>`
    <div class="case d-flex justify-content-between align-items-center">
      
      <div>
        <strong>${c.type}</strong>
        <p class="mb-1 text-muted">${c.description}</p>
      </div>

      <span class="status ${getClass(c.status)}">
        ${c.status}
      </span>

    </div>
  `).join("");
}