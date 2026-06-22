const API = "https://script.google.com/macros/s/AKfycbxMNfGlOLzKieGlmSzeTjnbK3rQ9Yp546u1aW0t_nBUS3X3Vuy91AKy8ZOXyhePDDzjsA/exec";

let cantos = [];
let cantosExibidos = [];

// ===============================
// BOTÃO CONTINUAR
// ===============================

document.getElementById("btnContinuar").addEventListener("click", () => {

    const comunidade = document.getElementById("comunidade").value.trim();
    const celebracao = document.getElementById("celebracao").value.trim();
    const data = document.getElementById("dataCelebracao").value;
    const celebrante = document.getElementById("celebrante").value.trim();
    const equipe = document.getElementById("equipe").value.trim();

    if (comunidade === "" || celebracao === "") {
        alert("Preencha a Comunidade e a Celebração.");
        return;
    }

    document.getElementById("rComunidade").textContent = comunidade;
    document.getElementById("rCelebracao").textContent = celebracao;
    document.getElementById("rData").textContent = data;
    document.getElementById("rCelebrante").textContent = celebrante || "-";
    document.getElementById("rEquipe").textContent = equipe || "-";

    document.getElementById("dadosCelebracao").style.display = "none";
    document.getElementById("selecaoCantos").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});

// ===============================
// CARREGA CANTOS
// ===============================

async function carregarCantos() {

    try {

        const resposta = await fetch(API);

        cantos = await resposta.json();

        cantosExibidos = [...cantos];

        mostrarCantos(cantosExibidos);

    } catch (erro) {

        console.error(erro);

        document.getElementById("listaCantos").innerHTML =
            "<p>Erro ao carregar os cantos.</p>";

    }

}

carregarCantos();

// ===============================
// MOSTRAR CANTOS
// ===============================

function mostrarCantos(lista) {

    cantosExibidos = lista;

    const div = document.getElementById("listaCantos");

    div.innerHTML = "";

    lista.forEach((canto, indice) => {

        div.innerHTML += `
            <div class="canto">

                <label>

                    <input
                        type="checkbox"
                        class="selecionado"
                        data-index="${indice}">

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

// ===============================
// PESQUISA
// ===============================

document.getElementById("pesquisa").addEventListener("input", function () {

    const texto = this.value.toLowerCase();

    const filtrados = cantos.filter(canto =>

        canto.nome.toLowerCase().includes(texto) ||

        canto.momento.toLowerCase().includes(texto) ||

        canto.tempoLiturgico.toLowerCase().includes(texto)

    );

    mostrarCantos(filtrados);

});

// ===============================
// GERAR PDF
// ===============================

document.getElementById("gerarPDF").addEventListener("click", () => {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    const checks = document.querySelectorAll(".selecionado");

    let primeiraPagina = true;

    checks.forEach(check => {

        if (!check.checked) return;

        const canto = cantosExibidos[check.dataset.index];

        if (!primeiraPagina)
            pdf.addPage();

        primeiraPagina = false;

        let y = 15;

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(canto.momento.toUpperCase(), 105, y, { align: "center" });

        y += 12;

        pdf.setFontSize(22);
        pdf.text(canto.nome, 105, y, { align: "center" });

        y += 12;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(15);

        const linhas = pdf.splitTextToSize(canto.letra, 185);

        pdf.text(linhas, 12, y);

    });

    if (primeiraPagina) {

        alert("Selecione pelo menos um canto.");

        return;

    }

    pdf.save("Folha-de-Cantos.pdf");

});
