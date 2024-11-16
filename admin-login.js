// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));

// Exibe os usuários para depuração
console.log(users);

// Recupera dados do administrador do LocalStorage (ou inicializa caso não exista)
const adminCredentials = { email: "admin@bluevelvet.com", password: "admin123" };
if (!localStorage.getItem('adminEmail')) {
    localStorage.setItem('adminEmail', adminCredentials.email);
    localStorage.setItem('adminPassword', adminCredentials.password);
}

// Ao carregar a página de registro, verifica se o usuário é administrador
window.onload = function () {
    const currentPage = window.location.pathname;
    if (currentPage.includes("register.html") && !localStorage.getItem('isAdminAuthenticated')) {
        alert("Apenas administradores podem registrar novos usuários.");
        window.location.href = "admin-login.html"; // Redireciona para a página de login de administrador
    }
};

// Manipula o login do administrador
document.getElementById('adminLoginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    // Recupera credenciais do administrador do LocalStorage
    const adminEmail = localStorage.getItem('adminEmail');
    const adminPassword = localStorage.getItem('adminPassword');

    // Recupera dados inseridos no formulário
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;

    console.log(`${email} === ${adminEmail} && ${password} === ${adminPassword}`);

    if (email === adminEmail && password === adminPassword) {
        // Autentica e redireciona para a página de registro
        localStorage.setItem('isAdminAuthenticated', true);
        localStorage.setItem('currentUserEmail', email);
        alert("Login de administrador bem-sucedido! Redirecionando...");
        window.location.href = "register.html";
    } else {
        document.getElementById('adminErrorMessage').textContent = "Credênciais incorretas. Tente novamente.";
    }
});
