
const simulatedUsers = [
        { name: "Admin", email: "admin@bluevelvet.com", password: "admin123", role: "admin" },
        { name: "John Doe", email: "john@bluevelvet.com", password: "john1234", role: "salesmanager" },
        { name: "Jane Smith", email: "jane@bluevelvet.com", password: "jane1234", role: "editor" },
];


localStorage.setItem('users', JSON.stringify(simulatedUsers));
console.log("bd iniciado-usuários!");
