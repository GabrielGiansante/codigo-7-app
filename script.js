function irParaCadastro() {
  window.location.href = "cadastro.html"; // Redireciona para a página de cadastro
}

document.getElementById("botaoContinuar").addEventListener("click", function () {
  const numero = document.getElementById("numeroTelefone").value;

  fetch('http://localhost:3001/enviar-codigo', {  // Certifique-se de que o backend está configurado corretamente
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numero })
  })
  .then(response => response.json())
  .then(data => {
      if (data.sucesso) {
          alert("Código enviado com sucesso!");
      } else {
          alert("Erro: " + data.erro);
      }
  })
  .catch(() => alert("Erro na comunicação com o servidor."));
});
