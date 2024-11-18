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
        alert("Apenas administradores podem registrar novos usuários.");
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
        document.getElementById('registerErrorMessage').textContent = "Por favor, selecione uma função.";
        return;
    }

    // Adiciona o novo usuário ao banco de dados
    const updatedUsers = JSON.parse(localStorage.getItem('users')) || [];
    updatedUsers.push({ name, email, password, role });
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert("Usuário registrado com sucesso!");
    window.location.href = "login.html"; // Redireciona para a página de login
});
