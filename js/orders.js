import { Fetch } from "./fetches.js";
import { Storage } from "./getDataFromStorage.js"


const orderList = document.querySelector(".order-list")
const account = Storage.getData("account")
const role = Storage.getData("role")

const linkToRightsPage = document.querySelector(".nav-rights-roles")
const linkToUsers = document.querySelector(".nav-users")

if(role == "User" || role == "Salesman"){
    linkToRightsPage.style.display = "none"
    linkToUsers.style.display = "none"
}

if(role != "User"){
    printOrders("order")
} else if(role == "User"){
    printOrders(`order?customerId=${account}`)
}

async function printOrders(key){
    const res = await Fetch.get(key)
    orderList.innerHTML = ""
    res.forEach((item) => {
        const li = document.createElement("li")
        li.classList.add("order-elem")
        const status = document.createElement("p")
        status.classList.add("order-status")
        status.innerHTML = item.status
        const confirmBtn = document.createElement("button")
        confirmBtn.classList.add("confirm_btn")
        confirmBtn.innerHTML = "Потвердить"
        const declineBtn = document.createElement("button")
        declineBtn.classList.add("decline_btn")
        declineBtn.innerHTML = "Отклонить"

        if(item.status == "approved"){
            status.style.background = "green"
        } else if(item.status == "pending"){
            status.style.background = "yellow"
        } else {
            status.style.background = "red"
        }

        item.goods.forEach(async (elem) => {
            const div = document.createElement("div")
            div.classList.add("order-list-elem")
            const bookRes = await Fetch.get(`books/${elem.bookId}`)
            
            printOrder()
            function printOrder(){
                const listHtml = `
                <div class="list-text book-name">Название: ${bookRes.name}</div>
                <div class="basket-text book-author">Автор: ${bookRes.author}</div>
                <div class="basket-text book-genre">Жанр: ${bookRes.genre}</div>
                <div class="basket-text book-binding">Переплет: ${bookRes.binding}</div> 
                <div class="basket-text book-year">Год издания: ${bookRes.year}</div> 
                <div class="basket-text book-quantity">Количество: ${elem.qua} </div> 
                <div class="basket-text order-price">Цена: ${bookRes.price}</div> 
                `
                div.innerHTML = listHtml
                li.appendChild(div)
                li.appendChild(status)
                li.appendChild(confirmBtn)
                li.appendChild(declineBtn)
            }    
            confirmBtn.addEventListener("click", async () => {
                const q = {
                    quantity: bookRes.quantity - elem.qua
                }
                await Fetch.patch(`books/${elem.bookId}`, q)
                const body = {
                    status: "approved"
                }
                await Fetch.patch(`order/${item.id}`, body)
                printOrders()
            })
        })
        orderList.appendChild(li)
        

        declineBtn.addEventListener("click", async () => {
            const body = {
                status: "rejected"
            }
            await Fetch.patch(`order/${item.id}`, body)
            printOrders()
        })
        if(role == "User"){
            confirmBtn.style.display = "none"
            declineBtn.style.display = "none"
        }
    })

}
