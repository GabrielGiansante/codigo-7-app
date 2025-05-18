document.getElementById("botaoContinuar").addEventListener("click", async () => {
  const numero = document.getElementById("numeroTelefone").value;

  if (!numero) {
    alert("Por favor, digite um número de telefone.");
    return;
  }

  try {
    const resposta = await fetch("http://localhost:3001/enviar-codigo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ numero }),
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      alert("Código enviado com sucesso!");
    } else {
      alert(`Erro: ${resultado.erro}`);
    }
  } catch (erro) {
    console.error("Erro ao enviar código:", erro);
    alert("Erro ao enviar o código. Tente novamente.");
  }
});
