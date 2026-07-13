// script.js
// Reactive In-Memory Data Storage
let products = [
    { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, stock: 45, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=60" },
    { id: 2, name: "Minimalist Leather Watch", category: "Apparel", price: 149.00, stock: 4, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=60" },
    { id: 3, name: "Ergonomic Office Chair", category: "Home & Kitchen", price: 299.99, stock: 0, image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=150&auto=format&fit=crop&q=60" }
];

let filteredProducts = [...products];
let currentSort = { column: null, direction: 'asc' };
let base64ImageString = "";

// App Lifecycle Init
document.addEventListener("DOMContentLoaded", () => {
    updateMetricsSummary();
    handleSearchFilter(); 
});

// Helper function to resolve product status dynamically based on current stock number
function getProductStatusString(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return 'Low Stock';
    return 'In Stock';
}

// Render runtime calculations
function renderTable() {
    const tbody = document.getElementById('product-table-body');
    const emptyState = document.getElementById('empty-state');
    tbody.innerHTML = '';

    if (filteredProducts.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        filteredProducts.forEach(product => {
            const statusText = getProductStatusString(product.stock);
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50/70 transition';
            row.innerHTML = `
                <td class="p-4">
                    <img src="${product.image || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=150'}" class="w-10 h-10 object-cover rounded-md border bg-gray-50">
                </td>
                <td class="p-4 font-medium text-gray-900">${escapeHtml(product.name)}</td>
                <td class="p-4 text-gray-500">${product.category}</td>
                <td class="p-4 font-mono text-gray-700">$${product.price.toFixed(2)}</td>
                <td class="p-4 text-gray-600">${product.stock}</td>
                <td class="p-4">${getStatusBadgeHtml(statusText)}</td>
                <td class="p-4 text-right space-x-2 whitespace-nowrap">
                    <button onclick="editProduct(${product.id})" class="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button onclick="deleteProduct(${product.id})" class="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 p-2 rounded-lg transition" title="Delete"><i class="fa-solid fa-trash-can"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
}

function getStatusBadgeHtml(status) {
    if (status === 'In Stock') return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500"></span>In Stock</span>`;
    if (status === 'Low Stock') return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800"><span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-500"></span>Low Stock</span>`;
    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800"><span class="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500"></span>Out of Stock</span>`;
}

function updateMetricsSummary() {
    const total = products.length;
    const low = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const out = products.filter(p => p.stock === 0).length;

    document.getElementById('stat-total').innerText = total;
    document.getElementById('stat-low-stock').innerText = low;
    document.getElementById('stat-out').innerText = out;
}

// Search & Category Filter pipeline
function handleSearchFilter() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
    const categoryQuery = document.getElementById('filter-category').value;

    filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery);
        const matchesCategory = categoryQuery === "" || product.category === categoryQuery;
        return matchesSearch && matchesCategory;
    });

    // Re-apply sorting setup if a column is selected
    if (currentSort.column) {
        sortDataArray(filteredProducts, currentSort.column, currentSort.direction);
    }

    renderTable();
}

// Fixed Sorting Engine
function handleSort(column) {
    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }

    // Update UI element states
    ['name', 'category', 'price', 'stock', 'status'].forEach(col => {
        const icon = document.getElementById(`sort-icon-${col}`);
        if(icon) icon.className = 'fa-solid fa-sort ml-1 text-gray-400';
    });

    const activeIcon = document.getElementById(`sort-icon-${column}`);
    if (activeIcon) {
        activeIcon.className = currentSort.direction === 'asc' ? 'fa-solid fa-sort-up ml-1 text-indigo-600' : 'fa-solid fa-sort-down ml-1 text-indigo-600';
    }

    sortDataArray(filteredProducts, column, currentSort.direction);
    renderTable();
}

function sortDataArray(array, column, direction) {
    array.sort((a, b) => {
        let valA = column === 'status' ? getProductStatusString(a.stock) : a[column];
        let valB = column === 'status' ? getProductStatusString(b.stock) : b[column];

        if (typeof valA === 'string') {
            return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        } else {
            return direction === 'asc' ? valA - valB : valB - valA;
        }
    });
}

// Modal Handlers
function openModal(title = "Add New Product") {
    document.getElementById('modal-title').innerText = title;
    const modal = document.getElementById('product-modal');
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.querySelector('.transform').classList.remove('scale-95');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.add('opacity-0');
    modal.querySelector('.transform').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('product-form').reset();
        document.getElementById('product-id').value = '';
        base64ImageString = "";
        document.getElementById('image-view').classList.add('hidden');
        document.getElementById('image-placeholder').classList.remove('hidden');
        clearValidationErrors();
    }, 200);
}

function previewImage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        base64ImageString = e.target.result;
        const view = document.getElementById('image-view');
        view.src = base64ImageString;
        view.classList.remove('hidden');
        document.getElementById('image-placeholder').classList.add('hidden');
    };
    reader.readAsDataURL(file);
}

// Validation Strategy
function validateForm(data) {
    let isValid = true;
    clearValidationErrors();

    if (!data.name.trim()) {
        showError('prod-name', 'Product name is required');
        isValid = false;
    }
    if (!data.category) {
        showError('prod-category', 'Please select a category');
        isValid = false;
    }
    if (isNaN(data.price) || data.price <= 0) {
        showError('prod-price', 'Price must be a positive number');
        isValid = false;
    }
    if (data.stockRaw === '' || isNaN(data.stock) || data.stock < 0) {
        showError('prod-stock', 'Stock value cannot be negative');
        isValid = false;
    }

    return isValid;
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    input.classList.add('border-rose-500', 'focus:ring-rose-500/20', 'focus:border-rose-500');
    const errEl = input.parentElement.querySelector('.error-msg');
    if (errEl) {
        errEl.innerText = message;
        errEl.classList.remove('hidden');
    }
}

function clearValidationErrors() {
    ['prod-name', 'prod-category', 'prod-price', 'prod-stock'].forEach(id => {
        const input = document.getElementById(id);
        input.classList.remove('border-rose-500', 'focus:ring-rose-500/20', 'focus:border-rose-500');
        const errEl = input.parentElement.querySelector('.error-msg');
        if (errEl) errEl.classList.add('hidden');
    });
}

// Save Operations
function saveProduct(event) {
    event.preventDefault();

    const idField = document.getElementById('product-id').value;
    const name = document.getElementById('prod-name').value;
    const category = document.getElementById('prod-category').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const stockRaw = document.getElementById('prod-stock').value;
    const stock = parseInt(stockRaw, 10);

    const formData = { name, category, price, stock, stockRaw };

    if (!validateForm(formData)) return;

    if (idField) {
        const targetId = parseInt(idField, 10);
        const idx = products.findIndex(p => p.id === targetId);
        if (idx !== -1) {
            products[idx] = {
                ...products[idx],
                name, category, price, stock,
                image: base64ImageString || products[idx].image
            };
            showToast("Product updated successfully", "fa-circle-check");
        }
    } else {
        const newProduct = {
            id: Date.now(),
            name, category, price, stock,
            image: base64ImageString || ""
        };
        products.push(newProduct);
        showToast("Product added successfully", "fa-circle-check");
    }

    closeModal();
    updateMetricsSummary();
    handleSearchFilter(); 
}

function editProduct(id) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('product-id').value = prod.id;
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-category').value = prod.category;
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-stock').value = prod.stock;

    if (prod.image) {
        const view = document.getElementById('image-view');
        view.src = prod.image;
        view.classList.remove('hidden');
        document.getElementById('image-placeholder').classList.add('hidden');
    }

    openModal("Edit Product Details");
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to permanently delete this product item?")) {
        products = products.filter(p => p.id !== id);
        showToast("Product successfully purged", "fa-trash");
        updateMetricsSummary();
        handleSearchFilter();
    }
}

function showToast(message, iconClass) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    document.getElementById('toast-message').innerText = message;
    
    icon.className = `fa-solid ${iconClass} text-emerald-400`;
    if (iconClass.includes('trash')) icon.className = `fa-solid ${iconClass} text-rose-400`;

    toast.classList.remove('translate-y-10', 'opacity-0');
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
    }, 3000);
}

function escapeHtml(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}