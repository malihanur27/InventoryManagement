const productForm = document.getElementById("productForm");
const productList = document.getElementById("productList");


// Load products
async function loadProducts() {

    const response = await fetch("/api/products");

    const products = await response.json();

    productList.innerHTML = "";

    products.forEach(product => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price}</td>
            <td>${product.quantity}</td>
            <td>
                <button
                    class="btn btn-warning btn-sm"
                    onclick="editProduct('${product._id}')">
                    Edit
                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteProduct('${product._id}')">
                    Delete
                </button>
            </td>
        `;

        productList.appendChild(row);
    });
}


// Add product
productForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const product = {

        name: document.getElementById("name").value,

        category: document.getElementById("category").value,

        price: Number(document.getElementById("price").value),

        quantity: Number(document.getElementById("quantity").value)
    };


    const response = await fetch("/api/products", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)
    });


    if (response.ok) {

        alert("Product added successfully!");

        productForm.reset();

        loadProducts();

    } else {

        alert("Failed to add product.");
    }

});


// Delete product
async function deleteProduct(id) {

    if (!confirm("Are you sure you want to delete this product?")) {
        return;
    }


    const response = await fetch(`/api/products/${id}`, {

        method: "DELETE"
    });


    if (response.ok) {

        alert("Product deleted successfully!");

        loadProducts();

    } else {

        alert("Failed to delete product.");
    }
}


// Edit product
async function editProduct(id) {

    const name = prompt("Enter new product name:");

    if (name === null) {
        return;
    }


    const category = prompt("Enter new category:");

    if (category === null) {
        return;
    }


    const price = prompt("Enter new price:");

    if (price === null) {
        return;
    }


    const quantity = prompt("Enter new quantity:");

    if (quantity === null) {
        return;
    }


    const updatedProduct = {

        name: name,

        category: category,

        price: Number(price),

        quantity: Number(quantity)
    };


    const response = await fetch(`/api/products/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(updatedProduct)
    });


    if (response.ok) {

        alert("Product updated successfully!");

        loadProducts();

    } else {

        alert("Failed to update product.");
    }
}


// Load products when page opens
loadProducts();