// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));


document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Recupera usuários armazenados no LocalStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verifica se o e-mail e a senha correspondem a algum usuário
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        if (rememberMe) {
            // Armazena credenciais no LocalStorage caso "Lembrar-me" esteja ativado
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        } else {
            // Remove credenciais armazenadas caso "Lembrar-me" não esteja ativado
            localStorage.removeItem('rememberedEmail');
            localStorage.removeItem('rememberedPassword');
        }

        // Salva o usuário logado no LocalStorage
        localStorage.setItem('currentUser', JSON.stringify(user));

        // Redireciona para a página apropriada com base no papel do usuário
        if (["salesmanager", "shippingmanager"].includes(user.role)) {
            window.location.href = "../BlueVelvet/template/dashboard.html"; // Painel de gestão de produtos
        } else if(["admin", "editor"].includes(user.role)) {
            window.location.href = "../BlueVelvet/template/database.html";          
        }else{
            document.getElementById('errorMessage').textContent = "Only administrator, salesmanager and shippingmanager can access the dashboard.";
        }
    } else {
        // Exibe mensagem de erro caso as credenciais sejam inválidas
        document.getElementById('errorMessage').textContent = "Incorrect email or password. Please try again.";
    }
});


// Redireciona para a página de login do administrador
document.getElementById('registerLink').addEventListener('click', function () {
    window.location.href = "../BlueVelvet/template/admin-login.html";
});


function showError(message) {
    const errorCard = document.getElementById('errorCard');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorCard.style.display = 'flex';
  }
  
  function closeErrorCard() {
    const errorCard = document.getElementById('errorCard');
    errorCard.style.display = 'none';
  }

  function checkClickOutside(event) {
    const card = document.querySelector('.error-card .cardError');
    if (!card.contains(event.target)) {
      closeErrorCard();
    }
  }
  