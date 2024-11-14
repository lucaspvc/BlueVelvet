// Simula dados de administrador (podem ser armazenados no LocalStorage)
const adminCredentials = {
    email: "admin@bluevelvet.com",
    password: "admin1234"
};

if (!localStorage.getItem('adminEmail')) {
    localStorage.setItem('adminEmail', adminCredentials.email);
    localStorage.setItem('adminPassword', adminCredentials.password);
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const storedEmail = localStorage.getItem('adminEmail');
    const storedPassword = localStorage.getItem('adminPassword');

    if (email === storedEmail && password === storedPassword) {
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
            localStorage.setItem('rememberedPassword', password);
        }
        alert("Login successful! Welcome, admin.");
        // Redireciona para a página de gerenciamento
    } else {
        document.getElementById('errorMessage').textContent = "E-mail ou palavra-passe incorrectos. Por favor, tente novamente.";
    }
});

document.getElementById('registerLink').addEventListener('click', function () {
    window.location.href = "register.html";
});
