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

    // Marcar os botões de rádio para "inStock" e "enabled"
    document.querySelector(`input[name="inStock"][value="${data.inStock}"]`)?.click();
    document.querySelector(`input[name="enabled"][value="${data.enabled}"]`)?.click();

    // Preencher as imagens principais e destacadas
    document.getElementById('main-image').src = data.mainImage ?? '';
    const featuredImagesContainer = document.getElementById('featured-images-container');
    featuredImagesContainer.innerHTML = ''; // Limpa as imagens existentes

    if (Array.isArray(data.featuredImages) && data.featuredImages.length > 0) {
      data.featuredImages.forEach(img => {
        const imgElement = document.createElement('img');
        imgElement.src = img.image;
        imgElement.alt = 'Featured Image';
        featuredImagesContainer.appendChild(imgElement);
        // Adicionar imagens
      });
    }

    // Configurar os detalhes
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = ''; // Limpa as linhas existentes
    if(Array.isArray(data.details) && data.details.length > 0) {
      data.details.forEach(details => {
        const row = createDetailRow();
        row.querySelector('[name="details-name"]').value = details.name ?? '';
        row.querySelector('[name="details-value"]').value = details.value ?? '';
        detailsContainer.appendChild(row);
      });
    }

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

async function saveProductChanges() {
  console.log('Botão clicado');
  const form = document.getElementById('add-product-form');
  const formData = new FormData(form);
  const productId = parseInt(new URLSearchParams(window.location.search).get('id'));

  let isValid = true;

  // Limpar mensagens de erro e remover a classe de erro
  clearErrors();

  const userRole = getUserRole();
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const productIndex = products.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    showError('Erro ao salvar: Produto não encontrado!');
    return;
  }

  const originalProduct = products[productIndex];

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
    products[productIndex] = { ...originalProduct, price: updatedProduct.price, updatedAt: updatedProduct.updatedAt };
  } else {
    products[productIndex] = updatedProduct;
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

function addInitialDetailRow() {
  const container = document.getElementById('details-container');
  const newRow = createDetailRow();
  container.appendChild(newRow);
}

function addDetail() {
  const container = document.getElementById('details-container');
  const newRow = createDetailRow();
  container.appendChild(newRow);
}

function createDetailRow() {
  const newRow = document.createElement('div');
  newRow.classList.add('detail-row');

  const nameField = document.createElement('textarea');
  nameField.name = 'details-name';
  nameField.placeholder = 'Detail Name';
  nameField.classList.add('detail-textarea');

  const valueField = document.createElement('textarea');
  valueField.name = 'details-value';
  valueField.placeholder = 'Detail Value';
  valueField.classList.add('detail-textarea');

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-detail-button');
  deleteButton.onclick = () => newRow.remove();

  newRow.appendChild(nameField);
  newRow.appendChild(valueField);
  newRow.appendChild(deleteButton);

  return newRow;
}

function returnToPage() {
  returnToSourcePage();
}

function showError(message) {
  const errorCard = document.getElementById('errorCard');
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.textContent = message;
  errorCard.style.display = 'flex';
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
