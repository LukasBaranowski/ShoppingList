//Product Class: Represents products. 
class Product {
    constructor(name, amount, info) {
        this.name = name;
        this.amount = amount;
        this.info = info;
    }
}

//UI Class: Handle UI Tasks
class UI {
    static displayProducts () {
        const storedProducts = Store.getProducts();

        storedProducts.forEach((product) => UI.addProductToList(product));
    }

    static addProductToList(product) {
        const list = document.querySelector('#product-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.amount}</td>
            <td>${product.info}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">Usuń</a></td>
        `;

        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#name').value = '';
        document.querySelector('#amount').value = '';
        document.querySelector('#info').value = '';
    } 

    static deleteProduct(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }
    //Build alert element 
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#product-form')
        container.insertBefore(div, form);
        //Vanish in 3 sec
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

}
//Store class: Handles Storage
class Store {
    static getProducts() {
        let products;
        if(localStorage.getItem('products') === null) {
            products = [];
        } else {
            products = JSON.parse(localStorage.getItem('products'));
        }
        return products;
    }
    static addProduct(product) {
        const products = Store.getProducts();
        products.push(product);
        localStorage.setItem('products', JSON.stringify(products));
    }
    static removeProduct(name) {
        const products = Store.getProducts();

        products.forEach((product, index) => {
            if(product.name === name) {
                products.splice(index, 1);
            }
        });

        localStorage.setItem('products', JSON.stringify(products));
    }

}

//Event: Display product
document.addEventListener('DOMContentLoaded', UI.displayProducts);
//Event: Add the product
document.querySelector('#product-form').addEventListener('submit', (e) => {
    //Prevent actul submit
    e.preventDefault();
    //Get form values
    const name = document.querySelector('#name').value;
    const amount = document.querySelector('#amount').value;
    const info = document.querySelector('#info').value;
    

    //Validate
   if(name ==='') {
        UI.showAlert('Podaj nazwę produktu','danger text-center');
    } else {

        //Instanciate product
        const product = new Product(name, amount, info);
        
        //Add product to UI
        UI.addProductToList(product);

        //Add product to store
        Store.addProduct(product);
        
        //Show success message
        UI.showAlert('Produkt dodany', 'success text-center')
        //Clear fields
        UI.clearFields();

    }
/* 
    //Instanciate product
    const product = new Product(name, amount, info);
    //Add product to UI
    UI.addProductToList(product);
    //Clear fields
    UI.clearFields();
*/
});
//Event: Remove the product
document.querySelector('#product-list').addEventListener('click', (e) => {
    //Remove the product from UI
    UI.deleteProduct(e.target);
    //Remove the product from Store
    Store.removeProduct(e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent);
    //Delete message
    UI.showAlert('Produkt usunięty', 'info text-center')
});