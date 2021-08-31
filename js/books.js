import { Fetch } from "./fetches.js"
import tab from "./tab.js"
import getData  from "./getData.js"
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

async function getAuthor(select) {
    const data = await Fetch.get("books?_sort=author&_order=asc")
    let resArr = []
    data.filter((item) => {
        let i = resArr.findIndex(x => (x.author == item.author));
        if(i <= -1){
            resArr.push(item);
        }
        return null;
    })
    for (let i = 0; i < resArr.length; i++) {
        const option = document.createElement("option")
        option.id = i + 1
        const {author} = resArr[i]
        option.innerHTML = `${author}`
        select.appendChild(option)
    } 
}
getAuthor(authorSelect)

async function getGenre(select) {
    const data = await Fetch.get("books?_sort=genre&_order=asc")
    let resArr = []
    data.filter((item) => {
        let i = resArr.findIndex(x => (x.genre == item.genre));
        if(i <= -1){
            resArr.push(item);
        }
        return null;
    })
    for (let i = 0; i < resArr.length; i++) {
        const option = document.createElement("option")
        option.id = i + 1
        const {genre} = resArr[i]
        option.innerHTML = `${genre}`
        select.appendChild(option)
    } 
}
getGenre(genreSelect)

async function getBinding(select) {
    const data = await Fetch.get("books?_sort=binding&_order=asc")
    let resArr = []
    data.filter((item) => {
        let i = resArr.findIndex(x => (x.binding == item.binding));
        if(i <= -1){
            resArr.push(item);
        }
        return null;
    })
    for (let i = 0; i < resArr.length; i++) {
        const option = document.createElement("option")
        option.id = i + 1
        const {binding} = resArr[i]
        option.innerHTML = `${binding}`
        select.appendChild(option)
    } 
}
getBinding(bindingSelect)

async function getYear(select) {
    const data = await Fetch.get("books?_sort=year&_order=desc")
    let resArr = []
    data.filter((item) => {
        let i = resArr.findIndex(x => (x.year == item.year));
        if(i <= -1){
            resArr.push(item);
        }
        return null;
    })
    
    for (let i = 0; i < resArr.length; i++) {
        const option = document.createElement("option")
        option.id = i + 1
        const {year} = resArr[i]
        option.innerHTML = `${year}`
        select.appendChild(option)
    } 
}
getYear(yearSelect)

/* async function getYear() {
    const data = await Fetch.get("books")
    let [{year}] = data
    console.log(year)
    console.log(year)
    function test(year) {
        let resArr = []
        data.filter((item) => {
            let i = resArr.findIndex(x => (x.key == item.key));
            if(i <= -1){
                resArr.push(item);
            }
            return null;
        })
        for (let i = 0; i < resArr.length; i++) {
            const option = document.createElement("option")
            option.id = i + 1
            const {key} = resArr[i]
            option.innerHTML = `${key}`
            yearSelect.appendChild(option)
        } 
    }
    test(year)
}
getYear() */

bookForm.addEventListener("submit", async () => {
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
    getData("books", bookList, pageList, printBook, `rating`, `desc`)
})

const bookList = document.querySelector(".book-list")
const pageList = document.querySelector(".page-list")

getData("books", bookList, pageList, printBook, `rating`, `desc`)

getBooks()
async function getBooks() {
    const books = await Fetch.get("books")
    printBook(books, bookList)
}

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
                getBooks()
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
                    getBooks()
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
        author: author.value,
        genre: genre.value,
        binding: binding.value,
        year: year.value,
        price: price.value,
        quantity: quantity.value,
        pageQuantity: pageQuantity.value,
    }
    await Fetch.patch(`books/${e.target.id}`, body)
    getBooks()
    saveChanges.style.display = "none"
    bookSave.style.display = "inline-block"
})

const bookSearch = document.querySelector(".book-search")
const btnSearch = document.querySelector(".btn-search")
const authorFilter = document.querySelector(".author-filter")
const authorBtn = document.querySelector(".author-btn")
const genreFilter = document.querySelector(".genre-filter")
const genreBtn = document.querySelector(".genre-btn")
const bindingFilter = document.querySelector(".binding-filter")
const bindingBtn = document.querySelector(".binding-btn")
const yearFilter = document.querySelector(".year-filter")
const yearBtn = document.querySelector(".year-btn")
const priceFilter = document.querySelector(".price-filter")
const priceBtn = document.querySelector(".price-btn")


btnSearch.addEventListener("click", async () => {
    const searchRes = await Fetch.get(`books?q=${bookSearch.value}`)
    printBook(searchRes, bookList)
})

getAuthor(authorFilter)
getBinding(bindingFilter)
getGenre(genreFilter)
getYear(yearFilter)

btnFilter(authorBtn,authorFilter)
btnFilter(genreBtn,genreFilter)
btnFilter(bindingBtn,bindingFilter)
btnFilter(yearBtn,yearFilter)


function btnFilter(btn,key) {
    btn.addEventListener("click", async () => {
        const res = await Fetch.get(`books?q=${key.value}`)
        printBook(res, bookList)
    })
}

priceBtn.addEventListener("click", async () => {
    if(priceFilter.value == 1){
        const res = await Fetch.get("books?_sort=price&_order=desc")
        getData("books", bookList, pageList, printBook, `price`, `desc`)
    }
    if(priceFilter.value == 2){
        const res = await Fetch.get("books?_sort=price&_order=asc")
        getData("books", bookList, pageList, printBook, `price`, `asc`)
    }
})


