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

async function addProduct() {
  const form = document.getElementById('add-product-form');
  const formData = new FormData(form);

  let isValid = true;

  // Limpar mensagens de erro e remover a classe de erro
  clearErrors();

  const newProduct = {
    productName: formData.get('productName')?.trim() || null,
    shortDescription: formData.get('shortDescription')?.trim() || null,
    fullDescription: formData.get('fullDescription')?.trim() || null,
    brand: formData.get('brand')?.trim() || null,
    category: formData.get('category')?.trim() || null,
    price: parseFloat(formData.get('price')) || null,
    discount: parseFloat(formData.get('discount')) || null,
    enabled: formData.get('enable') === 'true',
    inStock: formData.get('inStock') === 'true',
    dimensions: {
      length: parseFloat(formData.get('length')) || null,
      width: parseFloat(formData.get('width')) || null,
      height: parseFloat(formData.get('height')) || null,
      weight: parseFloat(formData.get('weight')) || null,
      unit: formData.get('unit') || null,
      unitWeight: formData.get('unitWeight') || null,
    },
    details: [],
  };

  // Validar campos obrigatórios
  if (!newProduct.productName) {
    showError('productName', 'O nome é obrigatório.');
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

  if (!isValid) {
    return; // Não envia o formulário se houver erros
  }

  // Adicionar detalhes
  const detailsContainer = document.getElementById('details-container');
  const detailRows = detailsContainer.querySelectorAll('.detail-row');

  detailRows.forEach((row) => {
    const name = row.querySelector('[name="details-name"]').value.trim();
    const value = row.querySelector('[name="details-value"]').value.trim();
    if (name && value) {
      newProduct.details.push({ name, value });
    }
  });

  // Adicionar imagens principais e extras
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
      newProduct.mainImage = await convertToBase64(mainImageFile);
    } catch (error) {
      console.error('Erro ao converter a imagem principal para base64', error);
    }
  }

  const featuredImages = formData.getAll('extraImages');
  newProduct.featuredImages = [];

  if (featuredImages.length > 0) {
    try {
      for (const file of featuredImages) {
        if (file instanceof File && file.name) {
          const base64Image = await convertToBase64(file);
          newProduct.featuredImages.push({ image: base64Image });
        }
      }
    } catch (error) {
      console.error('Erro ao converter imagens extras para base64', error);
    }
  }

  // Enviar dados para o backend
  try {
    const response = await fetch('http://localhost:8080/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProduct),
    });

    if (!response.ok) {
      throw new Error(`Erro ao enviar os dados: ${response.status}`);
    }

    const result = await response.json();
    console.log('Produto adicionado com sucesso:', result);
    form.reset();
    detailsContainer.innerHTML = '';
    addInitialDetailRow();
    returnPage();
  } catch (error) {
    console.error('Erro ao adicionar produto:', error);
    alert('Erro ao adicionar produto. Confira o console para mais detalhes.');
  }
}



function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(`${fieldId}-error`);

  if (field && errorElement) {
    // Para campos de texto (input, textarea)
    if (!field.value.trim()) {
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

function returnPage() {
  returnToSourcePage();
}


