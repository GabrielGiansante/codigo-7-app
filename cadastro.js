// Função para gerar um código de 6 dígitos aleatório
function gerarCodigo() {
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      codigo += Math.floor(Math.random() * 10);  // Gera um dígito aleatório de 0 a 9
    }
    return codigo;
  }
  
  // Função para ser chamada quando o usuário clicar em "Continuar"
  function continuar() {
    const numeroTelefone = document.querySelector("input[type='tel']").value;
  
    if (numeroTelefone === '') {
      alert("Por favor, insira um número de telefone.");
      return;
    }
  
    // Gerar o código e simular envio (no console por enquanto)
    const codigo = gerarCodigo();
    alert(`Código de confirmação enviado para ${numeroTelefone}: ${codigo}`);
  
    // Armazenar o código no localStorage
    localStorage.setItem('codigoConfirmacao', codigo);
    console.log("Código armazenado no localStorage:", codigo);  // Verifique se o código está sendo armazenado
    
    // Redirecionar para a página de confirmação
    window.location.href = "codigo.html";  // Redireciona para a página onde o usuário vai digitar o código
  }
 
