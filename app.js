const API = "https://script.google.com/macros/s/SEU_CODIGO_AQUI/exec";

fetch(API)
  .then(response => response.json())
  .then(data => {

    const container = document.createElement("div");
    container.className = "container-cantos";

    data.forEach(canto => {

      const card = document.createElement("div");
      card.className = "card-canto";

      card.innerHTML = `
        <h3>🎵 ${canto.nome}</h3>
        <p>📖 <strong>Momento:</strong> ${canto.momento}</p>
        <p>⛪ <strong>Tempo Litúrgico:</strong> ${canto.tempoLiturgico}</p>
      `;

      container.appendChild(card);
    });

    document.body.appendChild(container);
  })
  .catch(error => {
    console.error(error);
  });
