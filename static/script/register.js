// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users')) || [];

// Função para verificar se o usuário atual é administrador
function isAdmin() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const currentUser = users.find(user => user.email === currentUserEmail);
    return currentUser && currentUser.role === "admin";
}

// Ao carregar a página, verifica se o usuário tem permissão para registrar novos usuários
window.onload = function () {
    if (!isAdmin()) {
        showError("Only administrators can register new users.");
        window.location.href = "login.html"; // Redireciona para a página de login
    }
};

// Manipula o formulário de registro
document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    if (role === "") {
        document.getElementById('registerErrorMessage').textContent = "Please select a role.";
        return;
    }

    // Adiciona o novo usuário ao banco de dados
    const updatedUsers = JSON.parse(localStorage.getItem('users')) || [];
    updatedUsers.push({ name, email, password, role });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.removeItem('currentUserEmail');
    window.location.href = "login.html";
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
  