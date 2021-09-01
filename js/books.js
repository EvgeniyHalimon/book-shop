import { Fetch } from "./fetches.js"
import tab from "./tab.js"
import getData  from "./getData.js"
import printSearchRes from "./printSearhResult.js"
import { Storage } from "./getDataFromStorage.js"

const account = Storage.getData("account")

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

tab(bookTabList,addBookTab,listBlock,formBlock)
tab(addBookTab,bookTabList,formBlock,listBlock)

async function getSelect(select,key,order) {
    const data = await Fetch.get(`books?_sort=${key}&_order=${order}`)
    let resArr = []
    data.filter((item) => {
        let i = resArr.findIndex(x => (x[key] == item[key]));
        
        if(i <= -1){
            resArr.push(item);
        }
        return null;
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
                    <button class="btn-plus">+</button><input class="buy-quantity" type="number"><button class="btn-minus">-</button>
                    <button class="btn-buy">Купить</button>
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
            const btnQua = element.querySelector(".buy-quantity")
            const btnMinus = element.querySelector(".btn-minus")
            const btnBuy = element.querySelector(".btn-buy")
            const label = element.querySelector(".label")

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

            btnDelete.addEventListener("click", async () => {
                await Fetch.delete(`books/${item.id}`)
                /* getData("books", bookList, pageList, printBook, `rating`, `desc`) */
                const page = document.querySelector(".page-active")
                console.log(page.id)
                const res = await Fetch.get(`books?_page=${page.id}&_limit=5&_sort=rating&_order=desc`)
                printBook(res, bookList) 
            })

            btnPlus.addEventListener("click", () => {
                btnQua.value++
            })
            
            btnMinus.addEventListener("click", () => {
                btnQua.value--
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
                    /* getData("books", bookList, pageList, printBook, `rating`, `desc`) */
                    const page = document.querySelector(".page-active")
                    console.log(page.id)
                    const res = await Fetch.get(`books?_page=${page.id}&_limit=5&_sort=rating&_order=desc`)
                    printBook(res, bookList)
                }
            })
            btnBuy.addEventListener("click", () => {
                console.log("+")
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
const genreFilter = document.querySelector(".genre-filter")
const bindingFilter = document.querySelector(".binding-filter")
const yearFilterLess = document.querySelector(".year-filter-less")
const yearFilterGreat = document.querySelector(".year-filter-great")
const yearBtn = document.querySelector(".year-btn")

yearFilterLess.value = 2021
yearFilterGreat.value = 2021

const priceFilter = document.querySelector(".price-filter")
const priceBtn = document.querySelector(".price-btn")

function search(key1, key2, key3, key4, key5) {
    yearBtn.addEventListener("click", async () => {
        let str1 = `author=${key1.value}&`
        let str2 = `binding=${key2.value}&`
        let str3 = `genre=${key3.value}&`
        let str4 = `year_gte=${Number(key4.value)}&`
        let str5 = `year_lte=${Number(key5.value)}`
        if(key1.value == ""){
            str1 = ""
        }
        if(key2.value == ""){
            str2 = ""
        }
        if(key3.value == ""){
            str3 = ""
        }
        if(key4.value == ""){
            str4 = ""
        }
        if(key5.value == ""){
            str5 = ""
        }  
        if(key1.value == "" && key2.value == "" && key3.value == "" && key4.value == "" && key5.value == ""){
            printSearchRes("books?", bookList, pageList, printBook, `rating`, `desc`)
        }
        const searchRes = await Fetch.get(`books?${str1}${str2}${str3}${str4}`)
        console.log(searchRes)
        printSearchRes(`books?${str1}${str2}${str3}${str4}${str5}`, bookList, pageList, printBook, `rating`, `desc`)
    })
}
search(authorFilter, bindingFilter, genreFilter, yearFilterLess, yearFilterGreat)

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


