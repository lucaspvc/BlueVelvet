// Função para carregar os dados do produto no formulário
function loadProductForEdit(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
  
    if (!product) {
      alert('Produto não encontrado!');
      window.location.href = "product-management.html"; // Redireciona se o produto não for encontrado
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
    document.getElementById('activated').value = product.activated ? 'true' : 'false';
    document.getElementById('in-stock').value = product.inStock ? 'true' : 'false';
  
    // Preencher imagens (opcional, conforme a aplicação)
    // Para linhas de detalhes
    const detailsContainer = document.getElementById('details-container');
    detailsContainer.innerHTML = ''; // Limpa as linhas
    if (product.details && product.details.length > 0) {
      product.details.forEach(detail => {
        const row = createDetailRow();
        row.querySelector('[name="details-name"]').value = detail.name || '';
        row.querySelector('[name="details-value"]').value = detail.value || '';
        detailsContainer.appendChild(row);
      });
    }
  }
  
  // Função para salvar alterações
  function saveProductChanges() {
    const form = document.getElementById('edit-product-form');
    const formData = new FormData(form);
    const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
  
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === productId);
  
    if (productIndex === -1) {
      alert('Erro ao salvar: Produto não encontrado!');
      return;
    }
  
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
    localStorage.setItem('products', JSON.stringify(products));
  
    alert('Alterações salvas com sucesso!');
    returnDashboard();
  }
  
  // Carregar o produto automaticamente quando a página abrir
  document.addEventListener('DOMContentLoaded', () => {
    const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
    if (productId) {
      loadProductForEdit(productId);
    } else {
      alert('ID do produto não especificado!');
      returnDashboard();
    }
  });
  

  function returnDashboard(){
    window.location.href = "product-management.html";
  }
  