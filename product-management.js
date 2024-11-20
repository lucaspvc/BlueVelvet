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
                <button class="view-btn" data-id="${product.id}">View</button>
                <button class="edit-btn" data-id="${product.id}">Edit</button>
                <button class="delete-btn" data-id="${product.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    // Total de páginas baseado nos produtos ativados
    const totalPages = Math.ceil(activatedProducts.length / productsPerPage);
    renderPagination(totalPages); // Renderiza a navegação de páginas
}

document.getElementById('productTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) {
        const productId = parseInt(e.target.dataset.id);
        viewProduct(productId); // Chama a função de visualização
    } else if (e.target.classList.contains('edit-btn')) {
        const productId = parseInt(e.target.dataset.id);
        editProduct(productId); // Chama a função de edição
    } else if (e.target.classList.contains('delete-btn')) {
        const productId = parseInt(e.target.dataset.id);
        deleteProduct(productId); // Chama a função de exclusão
    }
});

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
    const product = products.find(product => product.id === id); 
    if (product) {
        // Preencher os detalhes do produto
        const productDetails = `
            <strong>ID:</strong> ${product.id}<br>
            <strong>Name:</strong> ${product.name}<br>
            <strong>Brand:</strong> ${product.brand}<br>
            <strong>Category:</strong> ${product.category}<br>
            <strong>Short Description:</strong> ${product.shortDescription || "No description available."}<br>
            <strong>Full Description:</strong> ${product.fullDescription}<br>
            <strong>Price:</strong> ${product.price}<br>
            <strong>Cost:</strong> ${product.cost}<br>
            <strong>Discount:</strong> ${product.discount}<br>
            <strong>In Stock:</strong> ${product.inStock}<br>
            <strong>Dimensions:</strong> ${product.dimensions}<br>
            <strong>Weight:</strong> ${product.weight}<br>
            <strong>Details:</strong> ${product.details}<br>
            <strong>Created At:</strong> ${product.createdAt}<br>
            <strong>Updated At:</strong> ${product.updatedAt}<br>
            <div class="action-buttons">
                <button id="edit-btn">Edit</button>
                <button id="delete-btn">Delete</button>
            </div>
        `;
        document.getElementById('productDetails').innerHTML = productDetails;

        // Configurar o slider de imagens
        const imageSlider = document.getElementById('imageSlider');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        imageSlider.innerHTML = ""; // Limpar o slider

        let currentIndex = 0;

        // Função para gerar as imagens dinamicamente no slider
        async function generateSliderImages(product) {
            const images = [product.mainImage, ...(Array.isArray(product.extraImages) ? product.extraImages : [])];

            if (images.length <= 1) {
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";
            } else {
                prevBtn.style.display = "inline-block";
                nextBtn.style.display = "inline-block";
            }
            
            // Cria uma div para cada imagem
            images.forEach(async (src, index) => {
                const imageDiv = document.createElement('div');
                imageDiv.classList.add('slider-image');
                if (index === 0) imageDiv.classList.add('active'); // A primeira imagem será visível inicialmente

                const img = document.createElement('img');
                img.src = src;
                img.alt = `Image ${index + 1}`;
                img.style.width = "100%";
                img.style.height = "100%";

                imageDiv.appendChild(img);
                imageSlider.appendChild(imageDiv);
            });
        }


        // Função para atualizar o slider e alternar as imagens
        async function updateSlider(index) {
            const images = document.querySelectorAll('.slider-image');
            // Esconde todas as imagens
            images.forEach((image, i) => {
                image.classList.remove('active');
            });
            // Mostra a imagem atual
            images[index].classList.add('active');
        }

        // Evento para o botão "Next"
        nextBtn.addEventListener('click', () => {
            const totalImages = product.extraImages.length + 1; // Total de imagens (main + extras)
            currentIndex = (currentIndex + 1) % totalImages; // Avança para a próxima imagem
            updateSlider(currentIndex);
        });

        // Evento para o botão "Prev"
        prevBtn.addEventListener('click', () => {
            const totalImages = product.extraImages.length + 1; // Total de imagens (main + extras)
            currentIndex = (currentIndex - 1 + totalImages) % totalImages; // Volta para a imagem anterior
            updateSlider(currentIndex);
        });

        // Inicializa o slider com as imagens do produto
        generateSliderImages(product);

        // Mostrar o modal
        const modal = document.getElementById('productModal');
        modal.style.display = "block";

        // Fechar o modal
        document.querySelector('.close').onclick = () => {
            modal.style.display = "none";
        };

        document.getElementById('edit-btn').addEventListener('click', () => {
            editProduct(product.id);
        });
        document.getElementById('delete-btn').addEventListener('click', () => {
            deleteProduct(product.id);
            modal.style.display = "none";
        });

        // Fechar ao clicar fora do modal
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };
    } else {
        alert("Product not found!");
    }
}



function editProduct(id) {
    window.location.href = `edit-product.html?id=${id}`;
}


function deleteProduct(id) {
    const popup = document.querySelector(".card");
    const overlay = document.querySelector(".overlay");
    const cancelButton = document.querySelector("[name='cancel-btn']");
    const deleteButton = document.querySelector("[name='delete-btn']");
    const exitButton = document.querySelector("[name='exit-btn']");


    // Exibe o pop-up
    popup.classList.add("active");


    // Evento para cancelar
    cancelButton.onclick = () => {
        popup.classList.remove("active");
        overlay.classList.remove("active");
    };

    exitButton.onclick = () => {
        popup.classList.remove("active");
        overlay.classList.remove("active");
    };

    // Evento para confirmar exclusão
    deleteButton.onclick = () => {
        products = products.filter(product => product.id !== id); // Atualiza localmente
        localStorage.setItem("products", JSON.stringify(products)); // Atualiza no localStorage
        renderProducts(); // Re-renderiza a tabela

        popup.classList.remove("active");
        overlay.classList.remove("active");
    };
}


document.getElementById("addProduct").addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Certifique-se de obter os dados atualizados do usuário
    console.log(currentUser);
    console.log(currentUser.role);

    if (currentUser.role === "admin" || currentUser.role === "editor") {
        window.location.href = "add.html";
    } else {
        showError("Only users with the Administrator or Editor role can access this page.");
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
        products.sort((a, b) => a.name.localeCompare(b.name));

        // Atualiza a exibição dos produtos
        renderProducts();
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
  
  