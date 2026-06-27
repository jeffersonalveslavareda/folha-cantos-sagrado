const API = "https://script.google.com/macros/s/AKfycbwEjYFmelZB130H2Owip1G5K6MaG5yn7gPqBGG9HMsIfWFgQmUMqT9SVOCI7z9LIQ7C3w/exec";

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
// CARREGAR CANTOS
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
// MOSTRAR CANTOS AGRUPADOS
// ===============================

function mostrarCantos(lista){

    cantosExibidos = lista;

    const div = document.getElementById("listaCantos");

    div.innerHTML = "";

    const grupos = {};

    lista.forEach(canto => {

        if(!grupos[canto.momento]){
            grupos[canto.momento] = [];
        }

        grupos[canto.momento].push(canto);

    });

    Object.keys(grupos).forEach(momento => {

        const idGrupo = momento.replace(/[^a-zA-Z0-9]/g,"");

        div.innerHTML += `
            <div class="grupoMomento">

                <h2>${momento}</h2>

                <div id="${idGrupo}"></div>

            </div>
        `;

        const grupo = document.getElementById(idGrupo);

        grupos[momento].forEach(canto => {

            const indice = cantosExibidos.indexOf(canto);

            grupo.innerHTML += `
                <div class="canto">

                    <label>

                        <input
                            type="checkbox"
                            class="selecionado"
                            data-index="${indice}">

                        <div>

                            <h3>${canto.nome}</h3>

                            <p><strong>Tempo:</strong> ${canto.tempoLiturgico}</p>

                        </div>

                    </label>

                </div>
            `;

        });

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

const comunidade = document.getElementById("comunidade").value;
const celebracao = document.getElementById("celebracao").value;
const data = document.getElementById("dataCelebracao").value;
const celebrante = document.getElementById("celebrante").value;
const equipe = document.getElementById("equipe").value;

    const logo = new Image();

logo.src =
"https://jeffersonalveslavareda.github.io/folha-cantos-sagrado/logo.png";

pdf.addImage(
    logo,
    "PNG",
    52,
    10,
    105,
    130
);
    
// TÍTULO
pdf.setFont("helvetica", "bold");
pdf.setFontSize(18);
pdf.text("FOLHA DE CANTOS", 105, 135, { align: "center" });

pdf.setFont("helvetica", "normal");
pdf.setFontSize(14);

pdf.text(`Comunidade: ${comunidade}`, 20, 180);
pdf.text(`Celebração: ${celebracao}`, 20, 195);
pdf.text(`Data: ${data}`, 20, 210);
pdf.text(`Celebrante: ${celebrante}`, 20, 225);

const equipeLinhas = pdf.splitTextToSize(`Equipe: ${equipe}`, 170);
pdf.text(equipeLinhas, 20, 240);

const checks = document.querySelectorAll(".selecionado");

let selecionados = 0;

checks.forEach(check => {

    if (!check.checked) return;

    selecionados++;

    const canto = cantosExibidos[check.dataset.index];

    pdf.addPage();

    let y = 15;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(canto.momento.toUpperCase(), 105, y, { align: "center" });

    y += 12;

    pdf.setFontSize(22);
    pdf.text(canto.nome, 105, y, { align: "center" });

    y += 15;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(20);

   const linhas = pdf.splitTextToSize(canto.letra, 185);

pdf.text(linhas, 10, y, {
    lineHeightFactor: 1.8
});

// ===============================
// RODAPÉ COM LINK DO YOUTUBE
// ===============================
if (canto.youtube && canto.youtube.trim() !== "") {

    pdf.setDrawColor(180);
    pdf.line(10, 285, 200, 285);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);

    pdf.setTextColor(0, 0, 0);
    pdf.text("YouTube:", 10, 290);

    pdf.setTextColor(0, 0, 255);

    pdf.textWithLink(
        canto.youtube,
        25,
        290,
        {
            url: canto.youtube
        }
    );

    pdf.setTextColor(0, 0, 0);
}

});

if (selecionados === 0) {

    alert("Selecione pelo menos um canto.");
    return;

}

const nomeArquivo =
    `Missa-${celebracao}-${data}.pdf`
        .replaceAll(" ", "_");

pdf.save(nomeArquivo);

});
