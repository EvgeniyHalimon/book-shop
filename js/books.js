import { Fetch } from "./fetches.js"
import tab from "./tab.js"
import getData  from "./getData.js"
import printSearchRes from "./printSearhResult.js"
import { Storage } from "./getDataFromStorage.js"

const account = Storage.getData("account")
const role = Storage.getData("role")

const linkToRightsPage = document.querySelector(".nav-rights-roles")
const linkToUsers = document.querySelector(".nav-users")

const formBlock = document.querySelector(".form-block")
const listBlock = document.querySelector(".list-block")
const addBookTab = document.querySelector(".add-book-tab")
const bookTabList = document.querySelector(".book-list-tab")
const bookForm = document.querySelector(".book-form")
const bookName = document.querySelector(".book-name")
const author = document.querySelector(".author")
const authorSelect = document.querySelector(".author-select")
const genre = document.querySelector(".genre")
const genreSelect = document.querySelector(".genre-select")
const binding = document.querySelector(".binding")
const bindingSelect = document.querySelector(".binding-select")
const year = document.querySelector(".year")
const yearSelect = document.querySelector(".year-select")
const price = document.querySelector(".price")
const quantity = document.querySelector(".quantity")
const pageQuantity = document.querySelector(".page-quantity")
const bookSave = document.querySelector(".book-save")
const saveChanges = document.querySelector(".save-changes")
saveChanges.style.display = "none"
const deleteBlock = document.querySelector(".delete-block")
deleteBlock.style.display = "none"

tab(bookTabList,addBookTab,listBlock,formBlock)
tab(addBookTab,bookTabList,formBlock,listBlock)

async function checkRights(){
    const res = await Fetch.get(`roles?name=${role}`)
    const [{rightsIds}] = res
    if(!rightsIds.includes(1) && !rightsIds.includes(2) && !rightsIds.includes(3)){
        linkToUsers.style.display = "none"
    }
    if(!rightsIds.includes(4) && !rightsIds.includes(5) && !rightsIds.includes(6)){
        linkToRightsPage.style.display = "none"
    }
    if(!rightsIds.includes(7)){
        formBlock.style.display = "none"
        listBlock.style.display = "block"
        addBookTab.style.display = "none"
        bookTabList.style.background = "tomato"
    }
    if(rightsIds.includes(7)){
        formBlock.style.display = "block"
        addBookTab.style.display = "inline-block"
        addBookTab.style.background = "tomato"
        bookTabList.style.background = "gray"
    }
}
checkRights()

async function getSelect(select,key,order) {
    const data = await Fetch.get(`books?_sort=${key}&_order=${order}`)
    let resArr = []
    data.filter((item) => {
        let i = resArr.findIndex(x => (x[key] == item[key]))
        if(i <= -1){
            resArr.push(item)
        }
        return null
    })
    resArr.forEach((item) => {
        const option = document.createElement("option")
        option.id = `${item.id}+`
        option.innerHTML = item[key]
        select.appendChild(option)
    })
}

getSelect(authorSelect, "author", "asc")
getSelect(genreSelect, "genre", "asc")
getSelect(bindingSelect, "binding", "asc")
getSelect(yearSelect, "year", "desc")

bookForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const body = {
        name: bookName.value,
        author: author.value || authorSelect.value,
        genre: genre.value || genreSelect.value,
        binding: binding.value || bindingSelect.value,
        year: +year.value || +yearSelect.value,
        price: +price.value,
        quantity: +quantity.value,
        pageQuantity: +pageQuantity.value,
        rating: 0
    }
    Fetch.post("books", body)
    printSearchRes("books?", bookList, pageList, printBook, `rating`, `desc`)
    window.location.reload()
})

const bookList = document.querySelector(".book-list")
const pageList = document.querySelector(".page-list")

printSearchRes("books?", bookList, pageList, printBook, `rating`, `desc`)

async function printBook(arr,list) {
    list.innerHTML = ""
    arr.forEach((item) => {
        const elem = document.createElement("li")
        elem.classList.add("book-list-elem")
        elem.id = `${item.id}`
        printElem()
        function printElem() {
            const listHtml = `
                <img class="book-img" src="../img/cover1__w600_134_514.jpg" alt="book-img"></img>
                <p class="list-text">
                    Рейтинг: <span class="book-rating">${+item.rating} </span>
                    <input class="chk" type="checkbox" id="${item.id}-">
                    <label class="label" for="${item.id}-"></label>
                </p>
                <p class="list-text book-name">Название: ${item.name}</p>
                <p class="list-text book-author">Автор: ${item.author}</p>
                <p class="list-text book-genre">Жанр: ${item.genre}</p>
                <p class="list-text book-binding">Переплет: ${item.binding}</p> 
                <p class="list-text book-year">Год издания: ${item.year}</p> 
                <p class="list-text book-price">Цена: ${item.price}</p> 
                <p class="list-text book-quantity">Количество на складе: ${item.quantity}</p> 
                <p class="list-text book-page-quantity">Страниц: ${item.pageQuantity}</p> 
                <span class="btn-span">
                    <button class="btn-edit-book">Редактировать</button>
                    <button class="btn-delete-book">Удалить</button>
                </span>
                <span class="buy-span">
                    <button class="btn-plus">+</button><input class="buy-quantity" type="text"><button class="btn-minus">-</button>
                    <button class="btn-buy" id="${item.id}">Купить</button>
                </span>
            `
            elem.innerHTML = listHtml
            return addListener(elem)
        }

        async function addListener(element){
            const btnEdit = element.querySelector(".btn-edit-book")
            const btnDelete = element.querySelector(".btn-delete-book")
            const chk = element.querySelector(".chk")
            const btnPlus = element.querySelector(".btn-plus")
            const qua = element.querySelector(".buy-quantity")
            const btnMinus = element.querySelector(".btn-minus")
            const btnBuy = element.querySelector(".btn-buy")
            const label = element.querySelector(".label")
            const bookQua = element.querySelector(".book-quantity")
            const buySpan = element.querySelector(".buy-span")
            
            if(item.quantity == 0){
                bookQua.innerHTML = " Товара нет на складе"
                bookQua.style.color = "red"
            }

            btnEdit.addEventListener("click", () => {
                saveChanges.style.display = "flex"
                saveChanges.id = item.id
                bookSave.style.display = "none"
                bookName.value = item.name 
                author.value = item.author
                genre.value = item.genre
                binding.value = item.binding
                year.value = item.year
                price.value = item.price
                quantity.value = item.quantity
                pageQuantity.value = item.pageQuantity
                formBlock.style.display = "block"
                listBlock.style.display = "none"
            })

            btnDelete.addEventListener("click", () => {
                deleteBlock.style.display = "block"
                const yesBtn = document.querySelector(".yes-btn")
                const noBtn = document.querySelector(".no-btn")

                yesBtn.addEventListener("click", async () => {
                    await Fetch.delete(`books/${item.id}`)
                    const page = document.querySelector(".page-active")
                    console.log(page.id)
                    const res = await Fetch.get(`books?_page=${page.id}&_limit=5&_sort=rating&_order=desc`)
                    printBook(res, bookList) 
                })

                noBtn.addEventListener("click", (event) => {
                    event.preventDefault()
                    formBlock.style.display = "none"
                    deleteBlock.style.display = "none"
                    window.onclick = function (event) {
                        if(event.target == deleteBlock){
                            deleteBlock.style.display = "none"
                        }
                    }
                })
            })

            async function checkRights(){
                const res = await Fetch.get(`roles?name=${role}`)
                const [{rightsIds}] = res
                if(!rightsIds.includes(8)){
                    btnEdit.style.display = "none"
                }
                if(!rightsIds.includes(9)){
                    btnDelete.style.display = "none"
                }
                if(!rightsIds.includes(12)){
                    buySpan.style.display = "none"
                }
            }
            checkRights()

            btnPlus.addEventListener("click", () => {
                if(qua.value < item.quantity){
                    qua.value++
                }
                if(qua.value == item.quantity){
                    qua.value = item.quantity
                    qua.style.color = "red"
                } 
            })
            
            btnMinus.addEventListener("click", () => {
                if(qua.value <= item.quantity){
                    qua.value--
                    qua.style.color = "black"
                }
                if(qua.value <= 0){
                    qua.value = ""
                } 
            })

            const getLike = await Fetch.get(`rating?userId=${account}&bookId=${item.id}`)
            const respLike = await getLike
            if(respLike.length === 1){
                chk.checked = true
                chk.disabled = true
            } 

            label.addEventListener("click", async () => {
                if(respLike.length === 0){
                    const bodyLikes = {
                        userId: account,
                        bookId: item.id,
                        qua: 1
                    }
                    await Fetch.post("rating", bodyLikes)
                    const body = {
                        rating: item.rating + 1
                    }
                    await Fetch.patch(`books/${item.id}`, body)
                    const page = document.querySelector(".page-active")
                    console.log(page.id)
                    const res = await Fetch.get(`books?_page=${page.id}&_limit=5&_sort=rating&_order=desc`)
                    printBook(res, bookList)
                }
            })

            btnBuy.addEventListener("click", async () => {
                const basket = await Fetch.get("basket")
                const find = basket.find((i) => {
                    return i.bookId == item.id
                })
                if(find){
                    let sum = find.bookQuantity + +qua.value
                    const body = {
                        amountPrice: +item.price * +sum,
                        bookQuantity: +sum
                    }
                    await Fetch.patch(`basket/${find.id}`, body) 
                } else{
                    const body = {
                        amountPrice: +item.price * +qua.value,
                        bookId: +item.id,
                        bookQuantity: +qua.value,
                        customerId: account
                    }
                    await Fetch.post("basket", body)
                }
            })
        }
        list.appendChild(elem)
    })
}

saveChanges.addEventListener("click", async (e) => {
    const body = {
        name: bookName.value,
        author: author.value || authorFilter.value,
        genre: genre.value || genreSelect.value,
        binding: binding.value || bindingSelect.value,
        year: +year.value || +yearSelect.value,
        price: +price.value,
        quantity: +quantity.value,
        pageQuantity: +pageQuantity.value,
    }
    await Fetch.patch(`books/${e.target.id}`, body)
    getData("books", bookList, pageList, printBook, `rating`, `desc`)
    saveChanges.style.display = "none"
    bookSave.style.display = "inline-block"
    window.location.reload()
})

const bookSearch = document.querySelector(".book-search")
const btnSearch = document.querySelector(".btn-search")

const authorFilter = document.querySelector(".author-filter")
const yearFilterLess = document.querySelector(".year-filter-less")
const yearFilterGreat = document.querySelector(".year-filter-great")
const filterBtn = document.querySelector(".year-btn")

yearFilterLess.value = 2021
yearFilterGreat.value = 2021

const priceFilter = document.querySelector(".price-filter")
const priceBtn = document.querySelector(".price-btn")

const filterInput = document.querySelectorAll(".filter-input")

filterBtn.addEventListener("click", async () => {
    let url = "books?"
    for (const elem of filterInput) {
        if(elem.value){
            url = url + `${elem.name}=${elem.value}&`
        }
    }
    printSearchRes(url, bookList, pageList, printBook, `rating`, `desc`)
})

btnSearch.addEventListener("click", async () => {
    printSearchRes(`books?q=${bookSearch.value}`, bookList, pageList, printBook, `rating`, `desc`)
})

priceBtn.addEventListener("click", () => {
    if(priceFilter.value == 1){
        printSearchRes("books?", bookList, pageList, printBook, `price`, `desc`)
    }
    if(priceFilter.value == 2){
        printSearchRes("books?", bookList, pageList, printBook, `price`, `asc`)
    }
})

