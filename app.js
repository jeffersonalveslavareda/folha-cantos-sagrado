const API = "https://script.google.com/macros/s/AKfycbxMNfGlOLzKieGlmSzeTjnbK3rQ9Yp546u1aW0t_nBUS3X3Vuy91AKy8ZOXyhePDDzjsA/exec";

let cantos = [];

async function carregarCantos() {
  try {
    const resposta = await fetch(API);
    cantos = await resposta.json();
    mostrarCantos(cantos);
  } catch (erro) {
    console.error(erro);
    document.getElementById("listaCantos").innerHTML =
      "<p>Erro ao carregar os cantos.</p>";
  }
}

carregarCantos();

function mostrarCantos(lista) {
  const div = document.getElementById("listaCantos");
  div.innerHTML = "";

  lista.forEach(canto => {
    div.innerHTML += `
      <div class="canto">
        <label>
          <input type="checkbox" class="selecionado">

          <div>
            <h3>${canto.nome}</h3>
            <p><strong>Momento:</strong> ${canto.momento}</p>
            <p><strong>Tempo:</strong> ${canto.tempoLiturgico}</p>
          </div>

        </label>
      </div>
    `;
  });
}

// Pesquisa
document.getElementById("pesquisa").addEventListener("input", function () {
  const texto = this.value.toLowerCase();

  const filtrados = cantos.filter(c =>
    c.nome.toLowerCase().includes(texto) ||
    c.momento.toLowerCase().includes(texto) ||
    c.tempoLiturgico.toLowerCase().includes(texto)
  );

  mostrarCantos(filtrados);
});

// PDF
document.getElementById("gerarPDF").addEventListener("click", () => {

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const checks = document.querySelectorAll(".selecionado");

  let primeiraPagina = true;

  checks.forEach((check, i) => {

    if (!check.checked) return;

    if (!primeiraPagina) pdf.addPage();

    primeiraPagina = false;

    const canto = cantos[i];

    let y = 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(canto.momento.toUpperCase(), 105, y, { align: "center" });

    y += 12;

    pdf.setFontSize(22);
    pdf.text(canto.nome, 105, y, { align: "center" });

    y += 12;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(16);

    const linhas = pdf.splitTextToSize(canto.letra, 185);

    pdf.text(linhas, 12, y);

  });

  if (primeiraPagina) {
    alert("Selecione pelo menos um canto.");
    return;
  }

  pdf.save("Folha-de-Cantos.pdf");

});
