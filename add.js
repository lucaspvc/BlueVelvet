function addProduct() {
  const form = document.getElementById('add-product-form');
  const formData = new FormData(form);
  
  // Recuperar os produtos existentes do localStorage
  const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
  
  // Calcular o próximo ID
  const lastId = existingProducts.length > 0 ? Math.max(...existingProducts.map(p => p.id)) : 0;
  const newId = lastId + 1;

  let isValid = true;

  // Limpar mensagens de erro e remover a classe de erro
  clearErrors();

  const newProduct = {
    id: newId, 
    name: formData.get('name')?.trim() || null,
    shortDescription: formData.get('shortDescription')?.trim() || null,
    fullDescription: formData.get('fullDescription')?.trim() || null,
    brand: formData.get('brand')?.trim() || null,
    category: formData.get('category')?.trim() || null,
    mainImage: formData.get('mainImage') instanceof File && formData.get('mainImage').name ? formData.get('mainImage').name : null,
    extraImages: formData.get('extraImages') instanceof File && formData.get('extraImages').name ? formData.get('extraImages').name : null,
    price: parseFloat(formData.get('price')) || null,
    discount: parseFloat(formData.get('discount')) || null,
    activated: formData.get('activated') === 'true',
    inStock: formData.get('inStock') === 'true',
    dimensions: formData.get('dimensions')?.trim() || null,
    weight: parseFloat(formData.get('weight')) || null,
    cost: parseFloat(formData.get('cost')) || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Validar campos obrigatórios
  if (!newProduct.name) {
    showError('name', 'O nome é obrigatório.');
    isValid = false;
  }
  if (!newProduct.brand) {
    showError('brand', 'A marca é obrigatória.');
    isValid = false;
  }
  if (!newProduct.category) {
    showError('category', 'A categoria é obrigatória.');
    isValid = false;
  }
  if (!newProduct.mainImage) {
    // Atribui uma imagem padrão se o campo principal estiver vazio
    newProduct.mainImage = 'images/logo.png';  
  }

  if (!isValid) {
    return; // Não envia o formulário se houver erros
  }

  // Verificar unicidade do nome
  const isNameUnique = !existingProducts.some(product => {
    return product.name && newProduct.name &&
          product.name.trim().toLowerCase() === newProduct.name.trim().toLowerCase();
  });

  if (!isNameUnique) {
    alert('Já existe um produto com esse nome.');
    showError('name', 'O nome do produto já existe. Por favor, escolha outro nome.');
    return;
  }


  // Adicionar o novo produto
  existingProducts.push(newProduct);
  localStorage.setItem('products', JSON.stringify(existingProducts));

  console.log('Produto Adicionado:', newProduct);
  alert('Produto adicionado com sucesso!');
  form.reset();

  // Limpar as linhas de detalhes e adicionar a primeira linha vazia novamente
  const detailsContainer = document.getElementById('details-container');
  detailsContainer.innerHTML = ''; 
  addInitialDetailRow(); 

  returnDashboard()
}


function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  if (field && errorElement) {
    // Para campos de texto (input, textarea)
      if (!field.value.trim()) {
        alert('showerroe');
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
      } else {
        field.classList.remove('error');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }
}



function clearErrors() {
  const errorElements = document.querySelectorAll('.error-message');
  const inputFields = document.querySelectorAll('.error');

  errorElements.forEach(el => el.style.display = 'none');
  inputFields.forEach(field => field.classList.remove('error'));
}


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
  deleteButton.textContent = 'Remover';
  deleteButton.onclick = () => newRow.remove();

  newRow.appendChild(nameField);
  newRow.appendChild(valueField);
  newRow.appendChild(deleteButton);

  return newRow;
}

function returnDashboard(){
  window.location.href = "product-management.html";
}
