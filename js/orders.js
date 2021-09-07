import { Fetch } from "./fetches.js";
import { Storage } from "./getDataFromStorage.js"


const orderList = document.querySelector(".order-list")
const orderOption = document.querySelector(".order-option")
const orderBtn = document.querySelector(".option-btn")
const account = Storage.getData("account")
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
    if(!rightsIds.includes(11)){
        orderOption.style.display = "none"
    }
}
checkRights()

orderBtn.addEventListener("click", () => {
    if(orderOption.value == "all"){
        printOrders(`order`)
    }
    if(orderOption.value == "approved"){
        printOrders(`order?status=approved`)
    }
    if(orderOption.value == "rejected"){
        printOrders(`order?status=rejected`)
    }
    if(orderOption.value == "pending"){
        printOrders(`order?status=pending`)
    }
})

if(role != "User"){
    printOrders(`order?status=pending`)
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
            confirmBtn.style.display = "none"
            declineBtn.style.display = "none"
        }
        if(item.status == "pending"){
            status.style.background = "yellow"
        }
        if(item.status == "rejected"){
            status.style.background = "red"
            confirmBtn.style.display = "none"
            declineBtn.style.display = "none"
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
                const qua = {
                    quantity: bookRes.quantity - elem.qua
                }
                Fetch.patch(`books/${elem.bookId}`, qua)
                const body = {
                    status: "approved"
                }
                Fetch.patch(`order/${item.id}`, body)
                window.location.reload()
            })
        })
        orderList.appendChild(li)
        

        declineBtn.addEventListener("click", async () => {
            const body = {
                status: "rejected"
            }
            Fetch.patch(`order/${item.id}`, body)
            window.location.reload()
        })
        if(role == "User"){
            confirmBtn.style.display = "none"
            declineBtn.style.display = "none"
        }
    })

}
