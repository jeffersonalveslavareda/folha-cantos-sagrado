const API = "https://script.google.com/macros/s/AKfycbykpjcvRXV4zqUgAh7joIgrq-9gIL9yxpF7A5it0n43yXtBoGxie_nOdSEqN3RLHgdSgA/exec";

fetch(API)
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
