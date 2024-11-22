function getSourcePage() {
  const params = new URLSearchParams(window.location.search);
  return params.get('source') || 'dashboard'; // Default para dashboard
}

function returnToSourcePage() {
  const sourcePage = getSourcePage();
  if (sourcePage === 'database') {
    window.location.href = "database.html";
  } else {
    window.location.href = "dashboard.html";
  }
}


// Função para verificar o papel do usuário
function getUserRole() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  return currentUser.role; // Retorna "salesmanager" ou outros papéis
}

// Função para carregar os dados do produto no formulário
function loadProductForEdit(productId) {
  const products = JSON.parse(localStorage.getItem('products')) || [];
  const product = products.find(p => p.id === productId);

  if (!product) {
    showError('Product not found!');
    returnToSourcePage(); // Redireciona se o produto não for encontrado
    return;
  }

  // Preencher os campos do formulário com os valores do produto
  document.getElementById('name').value = product.name || '';
  document.getElementById('short-description').value = product.shortDescription || '';
  document.getElementById('full-description').value = product.fullDescription || '';
  document.getElementById('brand').value = product.brand || '';
  document.getElementById('category').value = product.category || '';
  document.getElementById('price').value = product.price || '';
  document.getElementById('discount').value = product.discount || '';
  document.getElementById('dimensions').value = product.dimensions || '';
  document.getElementById('weight').value = product.weight || '';
  document.getElementById('cost').value = product.cost || '';

  // Verificar o valor de "inStock" e marcar o botão de rádio correspondente
  const inStockRadio = document.querySelector(`input[name="inStock"][value="${product.inStock}"]`);
  if (inStockRadio) {
    inStockRadio.checked = true;
  } else {
    inStockRadio.checked = false;
  }

  // Verificar o valor de "activated" e marcar o botão de rádio correspondente
  const activatedRadio = document.querySelector(`input[name="activated"][value="${product.activated}"]`);
  if (activatedRadio) {
    activatedRadio.checked = true;
  }
  else {
    activatedRadio.checked = false;
  }


  // Para linhas de detalhes
  const detailsContainer = document.getElementById('details-container');
  const addButtonRow = detailsContainer.querySelector('.add-detail-button')?.parentNode;
  detailsContainer.innerHTML = ''; // Limpa as linhas existentes, exceto o botão

  if (product.details && product.details.length > 0) {
    product.details.forEach(detail => {
      const row = createDetailRow();
      row.querySelector('[name="details-name"]').value = detail.name || '';
      row.querySelector('[name="details-value"]').value = detail.value || '';
      detailsContainer.appendChild(row);
    });
  }
  // Reanexa a linha do botão
  if (addButtonRow) {
    detailsContainer.appendChild(addButtonRow);
  }

  if (getUserRole() === 'salesmanager') {
    // Desabilita todos os campos exceto "price"
    document.querySelectorAll('#add-product-form input, #add-product-form select, #add-product-form textarea').forEach(input => {
      if (input.name !== 'price') {
        input.disabled = true;
      }
    });
  }
}


// Função para salvar alterações
function saveProductChanges() {
  const form = document.getElementById('add-product-form');
  const formData = new FormData(form);
  const productId = parseInt(new URLSearchParams(window.location.search).get('id'));

  const products = JSON.parse(localStorage.getItem('products')) || [];
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    showError('Error saving: Product not found!');
    return;
  }

  const userRole = getUserRole();
  if (userRole === 'salesmanager') {
    // Restrição: "salesmanager" só pode alterar o preço
    const updatedProduct = {
      ...products[productIndex],
      price: parseFloat(formData.get('price')) || null,
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;
  } else {
    const updatedProduct = {
      ...products[productIndex],
      name: formData.get('name')?.trim() || null,
      shortDescription: formData.get('shortDescription')?.trim() || null,
      fullDescription: formData.get('fullDescription')?.trim() || null,
      brand: formData.get('brand')?.trim() || null,
      category: formData.get('category')?.trim() || null,
      price: parseFloat(formData.get('price')) || null,
      discount: parseFloat(formData.get('discount')) || null,
      activated: formData.get('activated') === 'true',
      inStock: formData.get('inStock') === 'true',
      dimensions: formData.get('dimensions')?.trim() || null,
      weight: parseFloat(formData.get('weight')) || null,
      cost: parseFloat(formData.get('cost')) || null,
      updatedAt: new Date().toISOString(),
    };

    products[productIndex] = updatedProduct;

    console.log('Valores capturados:', {
      activated: formData.get('activated'),
      inStock: formData.get('inStock'),
    });
  }


  localStorage.setItem('products', JSON.stringify(products));
  returnToSourcePage();
}

// Carregar o produto automaticamente quando a página abrir
document.addEventListener('DOMContentLoaded', () => {
  const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
  if (productId) {
    loadProductForEdit(productId);
  } else {
    showError('Product ID not specified!');
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
