const API = "https://script.google.com/macros/s/AKfycbykpjcvRXV4zqUgAh7joIgrq-9gIL9yxpF7A5it0n43yXtBoGxie_nOdSEqN3RLHgdSgA/exec";

fetch(API)
  .then(response => response.json())
  .then(data => {

    const lista = document.createElement("ul");

    data.forEach(canto => {
      const item = document.createElement("li");

      item.innerHTML = `
<strong>${canto.nome}</strong><br>
Momento: ${canto.momento}<br>
Tempo Litúrgico: ${canto.tempoLiturgico}
`;

      lista.appendChild(item);
    });

    document.body.appendChild(lista);

  })
  .catch(error => {
    console.error(error);
  });
