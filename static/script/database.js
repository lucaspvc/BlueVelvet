// Obtém os dados do banco de dados (usuários)
const users = JSON.parse(localStorage.getItem('users'));

// Verifica autenticação
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// Atualiza mensagem de boas-vindas
document.getElementById("welcomeMessage").textContent = `Welcome, ${currentUser.name} (${currentUser.role})`;

let currentPage = 0; // Página inicial
let sortCriteria = 'productName'; // Critério de ordenação padrão
const pageSize = 10; // Tamanho padrão da página

const url = 'http://localhost:8080/produtos/search?name=';

// Atualiza a URL para buscar os produtos com paginação e ordenação
function getFetchUrl() {
    return `http://localhost:8080/produtos/search?name=&sort=${sortCriteria}&size=${pageSize}&page=${currentPage}`;
}

function renderProducts() {
    const fetchUrl = getFetchUrl();

    fetch(fetchUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json();
        })
        .then(data => {
            const products = data.content;
            const tableBody = document.getElementById('productTableBody');
            tableBody.innerHTML = ""; // Limpa a tabela

            if (Array.isArray(products)) {
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
// Eventos de paginação
document.getElementById("nextPage").addEventListener("click", () => {
    currentPage++;
    renderProducts();
});

document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 0) {
        currentPage--;
        renderProducts();
    }
});

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


document.getElementById("searchInputbtn").addEventListener("click", () => {
    const searchField = document.getElementById("searchInput"); // Campo de entrada de texto
    const query = searchField.value.trim(); // Captura o valor do campo de busca, removendo espaços extras

    if (!query) {
        renderProducts(); // Se o campo estiver vazio, carrega os produtos padrão
        return;
    }

    const search = `${url}${encodeURIComponent(query)}`; // Monta a URL com o valor digitado

    fetch(search)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta da API');
            }
            return response.json(); // Converte a resposta para JSON
        })
        .then(data => {
            const products = data.content; // Ajusta para a estrutura da resposta da API
            const tableBody = document.getElementById('productTableBody');

            // Limpa a tabela antes de renderizar os novos produtos
            tableBody.innerHTML = "";

            if (Array.isArray(products)) {
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

                <strong> Dimensions:</strong>
                <ul>
                    <li>Length: ${product.dimensions.length || "N/A"}</li>
                    <li>Width: ${product.dimensions.width || "N/A"}</li>
                    <li>Height: ${product.dimensions.height || "N/A"}</li>
                    <li>Weight: ${product.dimensions.weight || "N/A"}</li>
                    <li>Unit:${product.dimensions.unit || "N/A"}</li>
                    <li>Unit Weight: ${product.dimensions.unitWeight || "N/A"}</li>
                </ul>

                <strong> Details (name:value):</strong>
                ${product.details.map(detail => `<li>${detail.name}: ${detail.value}</li>`).join('')}

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
                // Verificar se a imagem principal está presente
                if (product.mainImage) {
                    const mainImageElement = document.getElementById('main-image');
                    const mainImagePreview = document.createElement('img');
                    mainImagePreview.src = product.mainImage;
                    mainImagePreview.alt = 'Main Image Preview';
                    mainImagePreview.style.width = '100%';
                    mainImagePreview.style.height = '100%';

                    const imageDiv = document.createElement('div');
                    imageDiv.classList.add('slider-image', 'active'); // A primeira imagem é visível inicialmente
                    imageDiv.appendChild(mainImagePreview);

                    imageSlider.appendChild(imageDiv);
                } // Verificar se há imagens adicionais e adicioná-las
                if (product.featuredImages?.length) {
                    product.featuredImages.forEach((featuredImages, index) => {
                        const imageDiv = document.createElement('div');
                        imageDiv.classList.add('slider-image');
                        if (index === 0 && !document.querySelector('.slider-image.active')) {
                            imageDiv.classList.add('active'); // A primeira imagem (principal) já deve ter a classe 'active'
                        }
                
                        const img = document.createElement('img');
                        img.src = featuredImages.images; // Ajuste aqui: acessar diretamente a URL da imagem
                        img.alt = `Image ${index + 1}`;
                        img.style.width = '100%';
                        img.style.height = '100%';
                
                        imageDiv.appendChild(img);
                        imageSlider.appendChild(imageDiv);
                    });
                }
                
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

// Evento para alterar o critério de ordenação
document.getElementById("sortOptionsbtn").addEventListener("click", () => {
    const selectedOption = document.getElementById("sortOptions").value;
    sortCriteria = selectedOption; // Atualiza o critério de ordenação
    currentPage = 0; // Reinicia para a primeira página
    renderProducts(); // Recarrega os produtos
});

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

// Chama renderProducts com a ordenação por nome ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const sortByNameUrl = `${url}&sort=productName`;  // URL com o critério de ordenação por nome
    fetch(sortByNameUrl) // Chama a API com a ordenação por nome
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar produtos');
            }
            return response.json();
        })
        .then(data => {
            const products = data.content;
            const tableBody = document.getElementById('productTableBody');
            tableBody.innerHTML = ""; // Limpa a tabela

            if (Array.isArray(products)) {
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
                    tableBody.appendChild(row); // Insere a nova linha na tabela
                });
            } else {
                console.error('A resposta da API não contém um array de produtos:', products);
            }
        })
        .catch(error => console.error('Erro ao buscar produtos:', error));
});

document.getElementById("resetProducts").addEventListener("click", async () => {
    if (confirm("Deseja realmente resetar os produtos para o estado inicial?")) {
        try {
            // Apaga todos os produtos existentes
            const response = await fetch('http://localhost:8080/produtos', {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Erro ao limpar o banco de dados: ${response.status}`);
            }

            console.log('Banco de dados limpo com sucesso.');

            // Adiciona novos produtos de exemplo
            for (let i = 1; i <= 10; i++) {
                const data = {
                    "productName": `Exemplo de Produto ${i}`,
                    "shortDescription": "Descrição curta do produto.",
                    "fullDescription": "Descrição completa do produto, incluindo detalhes importantes.",
                    "brand": "Marca Exemplo",
                    "category": "Categoria Exemplo",
                    "mainImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAHCAYAAAAvZezQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYSURBVBhXY+Tn5//PgASYoDQc0ECAgQEAitYBOhOAU/4AAAAASUVORK5CYII=",
                    "featuredImages": [
                        {
                            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAHCAYAAAAvZezQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYSURBVBhXY+Tn5//PgASYoDQc0ECAgQEAitYBOhOAU/4AAAAASUVORK5CYII="
                        },
                        {
                            "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAHCAYAAAAvZezQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYSURBVBhXY+Tn5//PgASYoDQc0ECAgQEAitYBOhOAU/4AAAAASUVORK5CYII="
                        }
                    ],
                    "price": 199.99,
                    "discount": 19.99,
                    "enabled": true,
                    "inStock": true,
                    "dimensions": {
                        "length": 30.0,
                        "width": 10.0,
                        "height": 20.0,
                        "weight": 1.5,
                        "unit": "cm",
                        "unitWeight": "kg"
                    },
                    "details": [
                        {
                            "name": "Cor",
                            "value": "Vermelho"
                        },
                        {
                            "name": "Tamanho",
                            "value": "M"
                        }
                    ]
                };

                try {
                    const productResponse = await fetch('http://localhost:8080/produtos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (!productResponse.ok) {
                        throw new Error(`Erro ao adicionar produto ${i}: ${productResponse.status}`);
                    }

                    const result = await productResponse.json();
                    console.log(`Produto ${i} adicionado com sucesso:`, result);
                } catch (error) {
                    console.error(`Erro ao adicionar o produto ${i}:`, error);
                }
            }

            alert("Banco de dados resetado com sucesso.");
            renderProducts(); // Atualiza a tabela de produtos na interface
        } catch (error) {
            console.error('Erro ao resetar os produtos:', error);
            alert('Falha ao resetar os produtos.');
        }
    }
});

renderProducts();