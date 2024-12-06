function getSourcePage() {
  const params = new URLSearchParams(window.location.search);
  return params.get('source') || 'dashboard'; // Default para dashboard
}

function returnToSourcePage() {
  const sourcePage = getSourcePage();
  if (sourcePage === 'database') {
    window.location.href = "/template/database.html";
  } else {
    window.location.href = "/template/dashboard.html";
  }
}

// Função para verificar o papel do usuário
function getUserRole() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser.role;
}

async function loadProductForEdit(productId) {
  try {
    const response = await fetch(`http://localhost:8080/produtos/${productId}`);
    if (!response.ok) {
      throw new Error('Product not found!');
    }
    const data = await response.json();

    // Preencher os campos do formulário com os valores do produto
    document.getElementById('name').value = data.productName ?? '';
    document.getElementById('short-description').value = data.shortDescription ?? '';
    document.getElementById('full-description').value = data.fullDescription ?? '';
    document.getElementById('brand').value = data.brand ?? '';
    document.getElementById('category').value = data.category ?? '';
    document.getElementById('price').value = data.price ?? '';
    document.getElementById('discount').value = data.discount ?? '';

    // Preencher as dimensões
    const dimensions = data.dimensions || {};
    document.getElementById('dimensions-length').value = dimensions.length ?? '';
    document.getElementById('dimensions-width').value = dimensions.width ?? '';
    document.getElementById('dimensions-height').value = dimensions.height ?? '';
    document.getElementById('weight').value = dimensions.weight ?? '';
    document.getElementById('dimensions-unit').value = dimensions.unit ?? '';
    document.getElementById('dimensions-unit-weight').value = dimensions.unitWeight ?? '';

    // Preencher imagens
    if (data.mainImage) {
      const mainImageElement = document.getElementById('main-image');
      const mainImagePreview = document.createElement('img');
      mainImagePreview.src = data.mainImage;
      mainImagePreview.alt = 'Main Image Preview';
      mainImagePreview.style.maxWidth = '100px';
      mainImagePreview.style.maxHeight = '100px';
      mainImageElement.insertAdjacentElement('afterend', mainImagePreview);
    }

    if (data.featuredImages?.length) {
      const extraImagesContainer = document.getElementById('extra-images');
      data.featuredImages.forEach((featuredImage) => {
        const imagePreview = document.createElement('img');
        imagePreview.src = featuredImage.images;
        imagePreview.alt = 'Extra Image Preview';
        imagePreview.style.maxWidth = '100px';
        imagePreview.style.maxHeight = '100px';
        extraImagesContainer.insertAdjacentElement('afterend', imagePreview);
      });
    }

    // Marcar os botões de rádio para "inStock" e "enabled"
    document.querySelector(`input[name="inStock"][value="${data.inStock}"]`)?.click();
    document.querySelector(`input[name="enabled"][value="${data.enabled}"]`)?.click();

    // Preencher os detalhes
    const detailsContainer = document.getElementById('details-container');

    // Construir o HTML para os detalhes, incluindo tanto os nomes quanto os valores
    const detailsHTML = data.details.map(detail => {
      return `
        <div class="detail-row" id="idRow-${detail.id}">
          <label for="details-name">Details</label>
          <input type="text" name="details-name" value="${detail.name}" />
          <input type="text" name="details-value" value="${detail.value}" />
          <button type="button" class="delete-detail-button" onclick="deleteRow(${detail.id})">Delete</button>
        </div>
      `;
    }).join('');

    // Atualizar o conteúdo de detailsContainer com o HTML gerado
    detailsContainer.innerHTML = detailsHTML;


    // Desabilitar campos para "salesmanager"
    if (getUserRole() === 'salesmanager') {
      document.querySelectorAll('#add-product-form input, #add-product-form select, #add-product-form textarea')
        .forEach(input => {
          if (input.name !== 'price') {
            input.disabled = true;
          }
        });
    }
  } catch (error) {
    showError(`Error loading product: ${error.message}`);
    returnToSourcePage();
  }
}

function deleteRow(id) {
  // Remove a linha do DOM
  const row = document.getElementById(`idRow-${id}`);
  if (row) row.remove();

  // Atualiza os detalhes no JSON local
  const updatedDetails = data.details.filter(detail => detail.id !== id);

  // Envia os detalhes atualizados ao backend
  fetch(`http://localhost:8080/produtos/${id}`, {
    method: 'PUT', // ou 'PATCH', dependendo do suporte do backend
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ details: updatedDetails })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Failed to update product after deleting detail with ID ${id}`);
    }
    console.log(`Detail with ID ${id} deleted and product updated successfully.`);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}


async function saveProductChanges() {
  console.log('Botão clicado');
  const form = document.getElementById('add-product-form');
  const formData = new FormData(form);
  const productId = parseInt(new URLSearchParams(window.location.search).get('id'));

  let isValid = true;

  // Limpar mensagens de erro e remover a classe de erro
  clearErrors();

  const userRole = getUserRole();

  // Verificar se o productId está presente e é um número válido
  if (isNaN(productId)) {
    showError('Erro: ID do produto inválido.');
    return;
  }

  // Fazer uma requisição para buscar o produto pelo ID no backend
  let originalProduct;
  try {
    const response = await fetch(`http://localhost:8080/produtos/${productId}`);
    if (!response.ok) {
      throw new Error(`Erro ao buscar o produto: ${response.status}`);
    }
    originalProduct = await response.json();
  } catch (error) {
    console.error('Erro ao buscar o produto:', error);
    showError(`Erro ao buscar o produto: ${error.message}`);
    return;
  }

  // Criar um objeto atualizado
  const updatedProduct = {
    ...originalProduct,
    productName: formData.get('name')?.trim() || null,
    shortDescription: formData.get('shortDescription')?.trim() || null,
    fullDescription: formData.get('fullDescription')?.trim() || null,
    brand: formData.get('brand')?.trim() || null,
    category: formData.get('category')?.trim() || null,
    price: parseFloat(formData.get('price')) || null,
    discount: parseFloat(formData.get('discount')) || null,
    enabled: formData.get('enabled') === 'true',
    inStock: formData.get('inStock') === 'true',
    dimensions: {
      length: parseFloat(formData.get('dimensions-length')) || null,
      width: parseFloat(formData.get('dimensions-width')) || null,
      height: parseFloat(formData.get('dimensions-height')) || null,
      weight: parseFloat(formData.get('weight')) || null,
      unit: formData.get('dimensions-unit') || null,
      unitWeight: formData.get('dimensions-unit-weight') || null,
    },
    details: [],
    updatedAt: new Date().toISOString(),
  };

  // Validar campos obrigatórios
  if (!updatedProduct.productName) {
    showError('name', 'O nome é obrigatório.');
    isValid = false;
  }
  if (!updatedProduct.brand) {
    showError('brand', 'A marca é obrigatória.');
    isValid = false;
  }
  if (!updatedProduct.category) {
    showError('category', 'A categoria é obrigatória.');
    isValid = false;
  }

  if (!isValid) {
    return; // Não continua se houver erros
  }

  // Adicionar detalhes
  const detailsContainer = document.getElementById('details-container');
  const detailRows = detailsContainer.querySelectorAll('.detail-row');

  detailRows.forEach((row) => {
    const name = row.querySelector('[name="details-name"]').value.trim();
    const value = row.querySelector('[name="details-value"]').value.trim();
    if (name && value) {
      updatedProduct.details.push({ name, value });
    }
  });

  // Atualizar imagem principal
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const mainImageFile = formData.get('mainImage');
  if (mainImageFile instanceof File && mainImageFile.name) {
    try {
      updatedProduct.mainImage = await convertToBase64(mainImageFile);
    } catch (error) {
      console.error('Erro ao converter a imagem principal para base64', error);
    }
  }

  // Atualizar imagens extras
  const featuredImages = formData.getAll('extraImages');
  updatedProduct.featuredImages = [];

  if (featuredImages.length > 0) {
    try {
      for (const file of featuredImages) {
        if (file instanceof File && file.name) {
          const base64Image = await convertToBase64(file);
          updatedProduct.featuredImages.push({ image: base64Image });
        }
      }
    } catch (error) {
      console.error('Erro ao converter imagens extras para base64', error);
    }
  }

  // Atualizar o produto localmente ou enviar para o backend
  if (userRole === 'salesmanager') {
    // "Salesmanager" pode alterar apenas o preço
    updatedProduct.price = parseFloat(formData.get('price')) || originalProduct.price;
  }

  try {
    const response = await fetch(`http://localhost:8080/produtos/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProduct),
    });

    if (!response.ok) {
      throw new Error(`Erro ao atualizar os dados: ${response.status}`);
    }

    const result = await response.json();
    returnToSourcePage();
  } catch (error) {
    console.error('Erro ao atualizar o produto:', error);
    showError(`Erro ao atualizar o produto: ${error.message}`);
  }
}

// Carregar o produto automaticamente quando a página abrir
document.addEventListener('DOMContentLoaded', () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const productId = new URLSearchParams(window.location.search).get('id');

    if (!productId || isNaN(productId)) {
      showError('Invalid or missing Product ID!');
      returnToSourcePage();
      return;
    }

    loadProductForEdit(productId); // Garantir que o ID seja um número inteiro
  } catch (error) {
    showError(`Error initializing page: ${error.message}`);
    returnToSourcePage();
  }
});

function addDetail() {
  const detailsContainer = document.getElementById('details-container');
  const newRow = createDetailRow();
  detailsContainer.appendChild(newRow);
}


function createDetailRow() {
  const newRow = document.createElement('div');
  newRow.classList.add('detail-row');

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'details-name';
  nameInput.placeholder = 'Detail Name';
  nameInput.classList.add('detail-input');

  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.name = 'details-value';
  valueInput.placeholder = 'Detail Value';
  valueInput.classList.add('detail-input');

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-detail-button');
  deleteButton.onclick = () => newRow.remove();

  newRow.appendChild(nameInput);
  newRow.appendChild(valueInput);
  newRow.appendChild(deleteButton);

  return newRow;
}


function returnToPage() {
  returnToSourcePage();
}

function showError(message) {
  const errorCard = document.getElementById('errorCard');
  const errorMessage = document.getElementById('errorMessage');

  if (!errorCard || !errorMessage) {
    console.error('Os elementos errorCard ou errorMessage não foram encontrados no DOM.');
    return; // Evita falhas se os elementos não existirem
  }

  errorMessage.textContent = message; // Define a mensagem de erro
  errorCard.style.display = 'flex'; // Torna o cartão de erro visível
}


function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  const inputFields = document.querySelectorAll('.error');

  errorElements.forEach(el => el.style.display = 'none');
  inputFields.forEach(field => field.classList.remove('error'));
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
