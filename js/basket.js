import { Fetch } from "./fetches.js"
import { Storage } from "./getDataFromStorage.js"

const account = Storage.getData("account")
const basketList = document.querySelector(".basket-list")
const btnConfirn = document.querySelector(".confirm-btn")
const amountQua = document.querySelector(".amount-qua")
const amountPrice = document.querySelector(".amount-price")
const role = Storage.getData("role")

const linkToRightsPage = document.querySelector(".nav-rights-roles")
const linkToUsers = document.querySelector(".nav-users")

async function checkRights(){
    const res = await Fetch.get(`roles?name=${role}`)
    const [{rightsIds}] = res
    if(!rightsIds.includes(1) && !rightsIds.includes(2) && !rightsIds.includes(3)){
        linkToUsers.style.display = "none"
    }
    if(!rightsIds.includes(4) && !rightsIds.includes(5) && !rightsIds.includes(6)){
        linkToRightsPage.style.display = "none"
    }
}
checkRights()

getGoods()
async function getGoods() {
    basketList.innerHTML = ""
    const res = await Fetch.get("basket")
    const basketArr = res.filter((item) => {
        return item.customerId == account
    })
    
    basketArr.forEach(async (item) => {
        const book = await Fetch.get(`books/${item.bookId}`)
        const elem = document.createElement("li")
        elem.id = item.bookId
        elem.classList.add("basket-list-elem")
        printBasket()
        function printBasket() {
            const listHtml = `
                    <img class="book-img-small" src="../img/cover1__w600_134_514.jpg" alt="book-img-small"></img>
                    <div class="list-text book-name">Название: ${book.name}</div>
                    <div class="basket-text book-author">Автор: ${book.author}</div>
                    <div class="basket-text book-genre">Жанр: ${book.genre}</div>
                    <div class="basket-text book-binding">Переплет: ${book.binding}</div> 
                    <div class="basket-text book-year">Год издания: ${book.year}</div> 
                    <div class="basket-text book-quantity">Количество : ${item.bookQuantity}</div> 
                    <div class="basket-text book-price">Цена: ${item.amountPrice}</div> 
                    <span class="delete-span">
                        <button class="btn-delete-book" id="${book.id}">Удалить</button>
                    </span>
                    <span class="confirm-span">
                        <button class="btn-plus">+</button><input class="book-quantity-input" type="text" value="${item.bookQuantity}"><button class="btn-minus">-</button>
                    </span>
                `
                elem.innerHTML = listHtml
                return addListener(elem)
        }
        
        basketList.appendChild(elem)
        function addListener(element){
            const btnDelete = element.querySelector(".btn-delete-book")
            const btnPlus = element.querySelector(".btn-plus")
            const qua = element.querySelector(".book-quantity-input")
            const btnMinus = element.querySelector(".btn-minus")
            
            btnDelete.addEventListener("click", async () => {
                await Fetch.delete(`basket/${item.id}`)
                getGoods()
                getQuantity()
            })

            btnPlus.addEventListener("click", async () => {
                const res = await Fetch.get(`books/${book.id}`)
                if(qua.value < res.quantity){
                    qua.value++
                }
                if(qua.value == res.quantity){
                    qua.value = res.quantity
                    qua.style.color = "red"
                }
                const body = {
                    amountPrice: +book.price * +qua.value,  
                    bookQuantity: +qua.value
                }
                await Fetch.patch(`basket/${item.id}`, body)
                getQuantity()
            })
            
            btnMinus.addEventListener("click", async () => {
                qua.value--
                qua.style.color = "black"
                const body = {
                    amountPrice: +item.amountPrice - +book.price, 
                    bookQuantity: +qua.value
                }
                await Fetch.patch(`basket/${item.id}`, body)
                if(qua.value == 0){
                    await Fetch.delete(`basket/${item.id}`)
                    getGoods()
                }
                getQuantity()
            })
        }
    })
    
}

btnConfirn.addEventListener("click", async () => {
    const res = await Fetch.get("basket")
    console.log(res)
    const basketArr = res.filter((item) => {
        return item.customerId == account
    })
    console.log(basketArr)
    let goodsArr = []
    basketArr.forEach(async (item) => {
        goodsArr.push({bookId: item.bookId, qua: item.bookQuantity})
        await Fetch.delete(`basket/${item.id}`)
    })
    const body = {
        goods: goodsArr,
        customerId: account,
        status: "pending"
    }
    await Fetch.post("order", body)
    /* window.location.reload() */
})

async function getQuantity() {
    const test = await Fetch.get("basket")
    const basketArr = test.filter((item) => {
        return item.customerId == account
    })
    let accum = 0
    let total = 0
    basketArr.forEach((item) => {
        accum += item.bookQuantity
        total += item.amountPrice
    })
    amountPrice.innerHTML = `Сумма : ${total}`
    amountQua.innerHTML = `Всего книг: ${accum}`
}
getQuantity()