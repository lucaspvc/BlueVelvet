// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));

// Lista inicial de produtos
const initialProducts = [
    { id: 1, image: "images/img1.jpg", name: "Guided by Voices - Bee Thousand", brand: "Matador Records", category: "CD" },
    { id: 2, image: "images/img2.jpg", name: "Pavement - Slanted and Enchanted", brand: "Domino Recording Co", category: "MP3" },
    { id: 3, image: "images/img3.jpg", name: "Neutral Milk Hotel T-Shirt", brand: "Merge Records", category: "T-Shirt" },
    { id: 4, image: "images/img4.jpg", name: "Indie Rock 101", brand: "Music Books", category: "Book" },
    { id: 5, image: "images/img5.jpg", name: "The Jesus and Mary Chain Poster", brand: "Art & Prints", category: "Poster" },
    { id: 6, image: "images/img6.jpg", name: "Album XYZ", brand: "Brand 1", category: "Vinyl" },
    { id: 7, image: "images/img7.jpg", name: "Tote Bag", brand: "Accessories", category: "Merchandise" },
    { id: 8, image: "images/img8.jpg", name: "Headphones", brand: "Tech", category: "Electronics" },
    { id: 9, image: "images/img9.jpg", name: "Guitar Picks", brand: "Music Accessories", category: "Accessories" },
    { id: 10, image: "images/img10.jpg", name: "Band Poster", brand: "Art & Prints", category: "Poster" },
];

// Carrega produtos do localStorage ou inicializa com a lista padrão
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(initialProducts));
}

let products = JSON.parse(localStorage.getItem("products"));

// Verifica autenticação
const currentUser = JSON.parse(localStorage.getItem("users"));

// Atualiza mensagem de boas-vindas
document.getElementById("welcomeMessage").textContent = `Welcome, ${currentUser.name} (${currentUser.role})`;

let currentPage = 1;
const productsPerPage = 10;

function renderProducts() {
    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = "";

    // Paginação
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = products.slice(start, end);

    paginatedProducts.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.category}</td>
            <td>
                <button onclick="viewProduct(${product.id})">View</button>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById("pageInfo").textContent = `Page ${currentPage} of ${Math.ceil(products.length / productsPerPage)}`;
}

renderProducts();

document.getElementById("nextPage").addEventListener("click", () => {
    if (currentPage * productsPerPage < products.length) {
        currentPage++;
        renderProducts();
    }
});

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});

document.getElementById("sortOptions").addEventListener("change", (event) => {
    const sortBy = event.target.value;
    products.sort((a, b) => {
        if (sortBy === "id") {
            return a[sortBy] - b[sortBy]; // Comparação numérica
        } else {
            return a[sortBy].localeCompare(b[sortBy]); // Comparação alfabética
        }
    });
    renderProducts();
});

document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    products = JSON.parse(localStorage.getItem("products")).filter(product => {
        return (
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    });
    currentPage = 1;
    renderProducts();
});

function viewProduct(id) {
    alert(`Viewing details for product ID: ${id}`);
}

function editProduct(id) {
    alert(`Editing product ID: ${id}`);
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter(product => product.id !== id);
        localStorage.setItem("products", JSON.stringify(products));
        renderProducts();
    }
}

document.getElementById("resetProducts").addEventListener("click", () => {
    if (confirm("Reset products to initial state?")) {
        localStorage.setItem("products", JSON.stringify(initialProducts));
        products = [...initialProducts];
        renderProducts();
    }
});

document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    alert("Logged out successfully!");
    window.location.href = "index.html";
});
