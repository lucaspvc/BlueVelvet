// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));

// Obtém os dados do banco de dados (produtos)
let products = JSON.parse(localStorage.getItem('products'));
const initialProducts = JSON.parse(localStorage.getItem('products'));

// Carrega produtos do localStorage ou inicializa com a lista padrão
if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(initialProducts));
}

// Verifica autenticação
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Atualiza mensagem de boas-vindas
document.getElementById("welcomeMessage").textContent = `Welcome, ${currentUser.name} (${currentUser.role})`;

let currentPage = 1;
const productsPerPage = 5;

// Função para calcular os produtos da página atual
function getProductsForCurrentPage() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = currentPage * productsPerPage;
    return products.slice(startIndex, endIndex);
}

function renderPagination(totalPages) {
    const paginationContainer = document.querySelector(".pagination");
    paginationContainer.innerHTML = ""; // Limpa apenas a parte de paginação

    // Botão "Anterior"
    const prevButton = document.createElement("button");
    prevButton.id = "prevPage";
    prevButton.className = "pagination-button";
    prevButton.textContent = "<";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
            renderPagination(totalPages);
        }
    });
    paginationContainer.appendChild(prevButton);

    // Números das páginas com ocultação dinâmica
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || // Sempre mostrar a primeira página
            i === totalPages || // Sempre mostrar a última página
            i === currentPage || // Mostrar a página atual
            i === currentPage - 1 || // Mostrar a anterior da atual
            i === currentPage + 1 // Mostrar a próxima da atual
        ) {
            const pageNumber = document.createElement("span");
            pageNumber.textContent = i;
            pageNumber.className = "page-number" + (i === currentPage ? " active" : "");
            if (i !== currentPage) {
                pageNumber.addEventListener("click", () => {
                    currentPage = i;
                    renderProducts();
                    renderPagination(totalPages);
                });
            }
            paginationContainer.appendChild(pageNumber);
        } else if (
            i === currentPage - 2 || // Exibir "..." antes das páginas intermediárias
            i === currentPage + 2
        ) {
            const dots = document.createElement("span");
            dots.textContent = "...";
            dots.className = "dots";
            paginationContainer.appendChild(dots);
        }
    }

    // Botão "Próximo"
    const nextButton = document.createElement("button");
    nextButton.id = "nextPage";
    nextButton.className = "pagination-button";
    nextButton.textContent = ">";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            renderPagination(totalPages);
        }
    });
    paginationContainer.appendChild(nextButton);
}

function filterActivatedProducts(products) {
    return products.filter(product => product.activated === true);
}

function renderProducts(filteredProducts = products) {
    // Filtra produtos ativados
    const activatedProducts = filterActivatedProducts(filteredProducts);

    const tableBody = document.getElementById("productTableBody");
    tableBody.innerHTML = "";

    // Paginação
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;
    const paginatedProducts = activatedProducts.slice(start, end);

    // Renderiza produtos paginados
    paginatedProducts.forEach(product => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.mainImage}" alt="${product.name}" width="50"></td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.category}</td>
            <td class="actions-col">
                <button onclick="viewProduct(${product.id})">View</button>
                <button onclick="editProduct(${product.id})">Edit</button>
                <button onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Total de páginas baseado nos produtos ativados
    const totalPages = Math.ceil(activatedProducts.length / productsPerPage);
    renderPagination(totalPages); // Renderiza a navegação de páginas
}

// Ordena os produtos por nome ao iniciar
products.sort((a, b) => a.name.localeCompare(b.name));
// Inicialização
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

document.getElementById("sortOptions").removeEventListener("change", sortProducts);
document.getElementById("sortOptions").addEventListener("change", sortProducts);

products = JSON.parse(localStorage.getItem("products")); // Recarrega os dados
// Ordena os produtos por nome ao iniciar
products.sort((a, b) => a.name.localeCompare(b.name));
renderProducts();


function sortProducts(event) {
    const sortBy = event.target.value;

    products.sort((a, b) => {
        const valueA = a[sortBy] || ""; // Valor padrão vazio
        const valueB = b[sortBy] || "";
    
        if (sortBy === "id") {
            return Number(valueA) - Number(valueB);
        } else {
            return String(valueA).localeCompare(String(valueB));
        }
    });
    
    renderProducts();
}

document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = JSON.parse(localStorage.getItem("products")).filter(product => {
        return (
            product.name.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    });
    currentPage = 1;
    renderProducts(filteredProducts); // Passe a lista filtrada para renderizar
});


function viewProduct(id) {
    alert(`Viewing details for product ID: ${id}`);
}

function editProduct(id) {
    alert(`Editing product ID: ${id}`);
}

function deleteProduct(id) { 
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter(product => product.id !== id); // Atualiza localmente
        localStorage.setItem("products", JSON.stringify(products)); // Atualiza no localStorage
        renderProducts();
    }
}

document.getElementById("addProduct").addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Certifique-se de obter os dados atualizados do usuário
    console.log(currentUser);
    console.log(currentUser.role);

    if (currentUser.role === "admin" || currentUser.role === "editor") {
        window.location.href = "add.html";
    } else {
        alert("Apenas usuários com o papel de Administrador ou Editor podem acessar esta página.");
    }
});


document.getElementById("logoutButton").addEventListener("click", () => {
    // Remove o usuário atualmente logado
    localStorage.removeItem("currentUser");

    // Exibe uma mensagem de sucesso
    alert("Logged out successfully!");

    // Redireciona para a página de login
    window.location.href = "login.html";
});


document.getElementById("resetProducts").addEventListener("click", () => {
    if (confirm("Reset products to initial state?")) {
        const resetProducts = JSON.parse(localStorage.getItem('resetProducts'));
        
        // Atualiza a chave 'products' com o estado inicial
        localStorage.setItem('products', JSON.stringify(resetProducts));
        
        // Atualiza a variável local
        products = resetProducts;
        
        // Log para depuração
        console.log("Products after reset:", products);
        
        // Reinicia para a primeira página (se necessário)
        currentPage = 1;
        
        // Atualiza a exibição dos produtos
        renderProducts();
    }
});