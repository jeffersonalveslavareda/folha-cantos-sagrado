const API = "https://script.google.com/macros/s/AKfycbxMNfGlOLzKieGlmSzeTjnbK3rQ9Yp546u1aW0t_nBUS3X3Vuy91AKy8ZOXyhePDDzjsA/exec";

let cantos = [];

fetch(API)
  .then(res => res.json())
  .then(dados => {
    cantos = dados;
    mostrarCantos(cantos);
  });

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

document.getElementById("pesquisa").addEventListener("input", function () {

  const texto = this.value.toLowerCase();

  const filtrados = cantos.filter(c =>
    c.nome.toLowerCase().includes(texto)
  );

  mostrarCantos(filtrados);

});

document.getElementById("gerarPDF").addEventListener("click", () => {

  const { jsPDF } = window.jspdf;

  const pdf = new jsPDF();

  const checks = document.querySelectorAll(".selecionado");

  let y = 20;

  checks.forEach((check, i) => {

    if (check.checked) {

      const canto = cantos[i];

      pdf.setFontSize(18);
      pdf.text(canto.momento, 15, y);

      y += 10;

      pdf.setFontSize(16);
      pdf.text(canto.nome, 15, y);

      y += 10;

      pdf.setFontSize(11);

      const linhas = pdf.splitTextToSize(canto.letra, 180);

      pdf.text(linhas, 15, y);

      pdf.addPage();

      y = 20;

    }

  });

  pdf.save("Folha-de-Cantos.pdf");

});
