// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));

// Verifica autenticação
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Atualiza mensagem de boas-vindas
document.getElementById("welcomeMessage").textContent = `Welcome, ${currentUser.name} (${currentUser.role})`;

const url = 'http://localhost:8080/produtos';

function renderProducts() {
    // Função para buscar os dados
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            console.log(data); // Verifique o que está sendo retornado

            // Acesse o array de produtos dentro de 'content'
            const products = data.content; // Ajuste conforme necessário

            if (Array.isArray(products)) {
                const tableBody = document.getElementById('productTableBody');

                // Limpa a tabela antes de renderizar os produtos
                tableBody.innerHTML = "";

                products.forEach(product => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${product.idProduct}</td>
                        <td><img src="${product.mainImage}" alt="${product.name}" width="50"></td>
                        <td>${product.productName}</td>
                        <td>${product.brand}</td>
                        <td>${product.category}</td>
                        <td class="actions-col">
                            <button class="view-btn" data-id="${product.idProduct}">View</button>
                            <button class="edit-btn" data-id="${product.idProduct}">Edit</button>
                            <button class="delete-btn" data-id="${product.idProduct}">Delete</button>
                        </td>
                        <td>${product.enabled}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error('A resposta da API não contém um array de produtos:', products);
            }
        })
        .catch(error => console.error('Houve um problema com a requisição Fetch:', error));
}



function filterActivatedProducts(products) {
    return products.filter(product => product.enabled === true);
}

document.getElementById('productTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('view-btn')) {
        const productId = parseInt(e.target.dataset.id);
        viewProduct(productId);
    } else if (e.target.classList.contains('edit-btn')) {
        const productId = parseInt(e.target.dataset.id);
        editProduct(productId);
    } else if (e.target.classList.contains('delete-btn')) {
        const productId = parseInt(e.target.dataset.id);
        deleteProduct(productId);
    }
});


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
products.sort((a, b) => a.name.localeCompare(b.name));

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
}

document.getElementById("searchInput").addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = JSON.parse(localStorage.getItem("products")).filter(product => {
        return (
            product.name.toLowerCase().includes(query) ||
            product.shortDescription.toLowerCase().includes(query) ||
            product.fullDescription.toLowerCase().includes(query) ||
            product.brand.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );
    });
    currentPage = 1;
});


function viewProduct(idProduct) {
    // Restringir acesso apenas para administradores
    if (currentUser.role !== 'admin') {
        showError("Access denied! Only administrators can view product details.");
        return; // Impede a execução da função
    }
    fetch(`http://localhost:8080/produtos/${idProduct}`)
        .then(response => response.json())
        .then(product => {
            const tableBody = document.getElementById('productTableBody');

            // Preenche o conteúdo do modal com os detalhes do produto
            const productDetails = `
                <strong>ID:</strong> ${product.idProduct}<br>
                <strong>Name:</strong> ${product.productName}<br>
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

            // Exibe o modal
            document.getElementById('productModal').style.display = 'block';
            // Configurar o slider de imagens
            const imageSlider = document.getElementById('imageSlider');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            imageSlider.innerHTML = ""; // Limpar o slider

            let currentIndex = 0;

            // Função para gerar as imagens dinamicamente no slider
            async function generateSliderImages(product) {
                const images = [product.mainImage, ...(Array.isArray(product.featuredImages) ? product.featuredImages : [])];

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
                images.forEach((image, i) => {
                    image.classList.remove('active');
                });
                images[index].classList.add('active');
            }

            // Evento para o botão "Next"
            nextBtn.addEventListener('click', () => {
                const totalImages = product.featuredImages.length + 1; // Total de imagens (main + extras)
                currentIndex = (currentIndex + 1) % totalImages; // Avança para a próxima imagem
                updateSlider(currentIndex);
            });

            // Evento para o botão "Prev"
            prevBtn.addEventListener('click', () => {
                const totalImages = product.featuredImages.length + 1; // Total de imagens (main + extras)
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
                editProduct(product.idProduct);
            });
            document.getElementById('delete-btn').addEventListener('click', () => {
                deleteProduct(product.idProduct);
                modal.style.display = "none";
            });

            // Fechar ao clicar fora do modal
            window.onclick = (event) => {
                if (event.target === modal) {
                    modal.style.display = "none";
                    renderProducts();
                }
            };
        })
        .catch(error => console.error('Erro ao buscar detalhes do produto:', error));
}



function editProduct(idProduct) {
    window.location.href = `/template/edit-product.html?id=${idProduct}&source=database`;
}


async function deleteProduct(idProduct) {
    // Restringir acesso apenas para administradores
    if (currentUser.role !== 'admin' && currentUser.role !== 'editor') {
        showError("Access denied! Only administrators or editors can delete product.");
        return;
    }

    const popup = document.querySelector(".card");
    const overlay = document.querySelector(".overlay");
    const cancelButton = document.querySelector("[name='cancel-btn']");
    const deleteButton = document.querySelector("[name='delete-btn']");
    const exitButton = document.querySelector("[name='exit-btn']");

    popup.classList.add("active");

    cancelButton.onclick = () => {
        popup.classList.remove("active");
        overlay.classList.remove("active");
    };

    exitButton.onclick = () => {
        popup.classList.remove("active");
        overlay.classList.remove("active");
    };

    deleteButton.onclick = async () => {
        try {
            const response = await fetch(`http://localhost:8080/produtos/${idProduct}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete product");

            popup.classList.remove("active");
            overlay.classList.remove("active");

            // Atualiza a tabela sem duplicar
            renderProducts();
        } catch (error) {
            showError(`Error deleting product: ${error.message}`);
        }
    };
}



document.getElementById("addProduct").addEventListener("click", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser.role === "admin" || currentUser.role === "editor") {
        window.location.href = `/template/add.html?source=database`;
    } else {
        showError("Only users with the Administrator or Editor role can access this page.");
    }
});


document.getElementById("logoutButton").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/template/login.html";
});


document.getElementById("resetProducts").addEventListener("click", () => {
    if (confirm("Reset products to initial state?")) {
        const resetProducts = JSON.parse(localStorage.getItem('resetProducts'));
        localStorage.setItem('products', JSON.stringify(resetProducts));
        products = resetProducts;
        currentPage = 1;
        products.sort((a, b) => a.name.localeCompare(b.name));
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

renderProducts();