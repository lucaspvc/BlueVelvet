// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users')) || [];

window.onload = function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes("register.html")) {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const currentUser = users.find(user => user.email === currentUserEmail);

        if (!currentUser || currentUser.role !== "admin") {
            showError("Only administrators can access this page.");
            window.location.href = "/template/admin-login.html"; // Redireciona para a página de login de administrador
        }
    }
};

// Manipula o login do administrador
document.getElementById('adminLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Recupera dados inseridos no formulário
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    // Verifica se o usuário existe e se é administrador
    const user = users.find(u => u.email === email && u.password === password);

    if (user && user.role === "admin") {
        // Autentica e redireciona para a página de registro
        localStorage.setItem('currentUserEmail', email);
        window.location.href = "/template/register.html";
    } else {
        document.getElementById('adminErrorMessage').textContent = "Incorrect credentials or the user is not an administrator. Please try again.";
    }
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
