// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));

// Função para verificar se o usuário atual é administrador
function isAdmin() {
    const currentUserEmail = localStorage.getItem('currentUserEmail');
    const adminEmail = localStorage.getItem('adminEmail');
    return currentUserEmail === adminEmail;
}

// Ao carregar a página, verifica se o usuário é administrador
window.onload = function () {
    if (!isAdmin()) {
        alert("Apenas administradores podem registrar novos usuários.");
        //window.location.href = "index.html"; // Redireciona para a página de login
    }
};

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

    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.push({ name, email, password, role });
    localStorage.setItem('users', JSON.stringify(users));

    alert("Usuário registrado com sucesso!");
    window.location.href = "index.html"; // Redireciona para a página de login
});
