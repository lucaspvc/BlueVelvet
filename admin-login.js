// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users')) || [];

// Exibe os usuários para depuração
console.log(users);


window.onload = function () {
    const currentPage = window.location.pathname;

    if (currentPage.includes("register.html")) {
        const currentUserEmail = localStorage.getItem('currentUserEmail');
        const currentUser = users.find(user => user.email === currentUserEmail);

        if (!currentUser || currentUser.role !== "admin") {
            alert("Apenas administradores podem acessar esta página.");
            window.location.href = "admin-login.html"; // Redireciona para a página de login de administrador
        }
    }
};

// Manipula o login do administrador
document.getElementById('adminLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Recupera dados inseridos no formulário
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    console.log(`Tentativa de login: ${email}, ${password}`);

    // Verifica se o usuário existe e se é administrador
    const user = users.find(u => u.email === email && u.password === password);

    if (user && user.role === "admin") {
        // Autentica e redireciona para a página de registro
        localStorage.setItem('currentUserEmail', email);
        alert("Login de administrador bem-sucedido! Redirecionando...");
        window.location.href = "register.html";
    } else {
        document.getElementById('adminErrorMessage').textContent = "Credenciais incorretas ou o usuário não é administrador. Tente novamente.";
    }
});


