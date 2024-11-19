// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));

// Lida com o login do formulário
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
        if (["admin", "salesmanager", "shippingmanager"].includes(user.role)) {
            alert(`Login successful! Welcome, ${user.name} (${user.role}).`);
            window.location.href = "product-management.html"; // Painel de gestão de produtos
        } else {
            alert(`Login successful! Welcome, ${user.name} (${user.role}).`);
            window.location.href = "user-dashboard.html"; // Página para outros usuários
        }
    } else {
        // Exibe mensagem de erro caso as credenciais sejam inválidas
        document.getElementById('errorMessage').textContent = "E-mail ou palavra-passe incorrectos. Por favor, tente novamente.";
    }
});


// Redireciona para a página de login do administrador
document.getElementById('registerLink').addEventListener('click', function () {
    window.location.href = "admin-login.html";
});
