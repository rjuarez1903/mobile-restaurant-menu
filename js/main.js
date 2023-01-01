import { menuArray } from "./menu.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

let orderedProducts = []
document.addEventListener('click', closeModal)

function renderMenu() {
    let menuHtml = ''
    const productsContainer = document.querySelector('.products-container')
    menuArray.forEach(menuOption => {
        menuHtml += `
                    <article>
                        <img src="${menuOption.img}" alt="${menuOption.name}">
                        <div class="article-description">
                            <h3>${menuOption.name}</h3>
                            <p>${menuOption.ingredients}</p>
                            <p>$${menuOption.price}</p>
                        </div>
                        <i class="fa-solid fa-plus plus-icon" data-id="${menuOption.id}" data-name="${menuOption.name}" data-price="${menuOption.price}"></i>
                    </article>
        `
    })
    productsContainer.innerHTML = menuHtml
    document.querySelectorAll('.plus-icon').forEach(button => button.addEventListener('click', addProduct))
}

function addProduct(e) {
    const orderSection      = document.querySelector('.order-section')
    orderedProducts.length == 0 ? orderSection.classList.toggle('hidden') : console.log('Section is being displayed.')
    orderedProducts.push({
        id: e.target.dataset.id,
        name: e.target.dataset.name,
        price: Number(e.target.dataset.price), 
        uuid: uuidv4()
    })
    renderOrderedProducts(e)
}

function removeProduct(e) {
    for (let orderedProduct of orderedProducts) {
        if (orderedProduct.uuid == e.target.dataset.orderUuid) {
            orderedProducts.splice(orderedProducts.indexOf(orderedProduct), 1)
            break
        }
    }
    renderOrderedProducts()
}

function renderOrderedProducts(e) {
    const orderContainer = document.querySelector('.order-container') 
    const orderSection   = document.querySelector('.order-section')
    let orderedProductsHtml = ''
    orderedProducts.forEach(orderedProduct => {
        orderedProductsHtml += `   
                                <div class="ordered-product">
                                    <div class="product-name">
                                        <h3>${orderedProduct.name}</h3>
                                        <button class="btn-remove" data-order-uuid="${orderedProduct.uuid}">remove</button>
                                    </div> 
                                    <p>$${orderedProduct.price}</p>
                                </div>
    `
    })

    const totalPriceContainer     = document.querySelector('.total-price-container') 
    const totalPrice              = orderedProducts.reduce((acc, product) => acc + product.price, 0)
    orderContainer.innerHTML      = orderedProductsHtml
    totalPriceContainer.innerHTML = `
                                    <h3>Total price:</h3>
                                    <p>$${totalPrice}</p>
    `
    document.querySelectorAll('.btn-remove').forEach(button => button.addEventListener('click', removeProduct))
    orderedProducts.length < 1 ? orderSection.classList.toggle('hidden') : console.log('Section is being displayed.')
}

function completeOrder() {
    const form    = document.querySelector('form')
    const overlay = document.querySelector('.overlay')
    form.classList.toggle('hidden')
    overlay.classList.add('overlay-on')
    const btnPay  = document.querySelector('.btn-pay')
    btnPay.addEventListener('click', completePayment)

}

function closeModal(e) {
    const form    = document.querySelector('form')
    const overlay = document.querySelector('.overlay')
    const btnCompleteOrder = document.querySelector('.btn-complete-order')
    if (!e.target.closest('form') && !form.classList.contains('hidden')) {
        form.classList.toggle('hidden')
        overlay.classList.toggle('overlay-on')
    } else if (e.target == btnCompleteOrder) {
        completeOrder()
    }
}

function completePayment(e) {
    e.preventDefault()
    const form           = document.querySelector('form')
    const overlay        = document.querySelector('.overlay')
    const succeedMessage = document.querySelector('.succeed-message')
    const name           = document.getElementById('name')
    const orderSection   = document.querySelector('.order-section')
    form.classList.toggle('hidden')
    overlay.classList.toggle('overlay-on')
    succeedMessage.innerHTML = `<h3>Thanks, ${name.value}! Your order is on your way!</h3>`
    succeedMessage.classList.toggle('hidden')
    orderSection.classList.toggle('hidden')
}

renderMenu()