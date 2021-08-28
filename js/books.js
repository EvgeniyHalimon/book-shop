import { Fetch } from "./fetches.js"
import tab from "./tab.js"

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

tab(bookTabList,addBookTab,listBlock,formBlock)
tab(addBookTab,bookTabList,formBlock,listBlock)

async function getAuthor() {
    const data = await Fetch.get("books")
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
        authorSelect.appendChild(option)
    } 
}
getAuthor()

async function getGenre() {
    const data = await Fetch.get("books")
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
        genreSelect.appendChild(option)
    } 
}
getGenre()

async function getBinding() {
    const data = await Fetch.get("books")
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
        bindingSelect.appendChild(option)
    } 
}
getBinding()


async function getYear() {
    const data = await Fetch.get("books")

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
        yearSelect.appendChild(option)
    } 
}
getYear()


/* async function getYear() {
    const data = await Fetch.get("books")
    let [{year}] = data
    console.log(year)
    function test(key){
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
    
}
getYear() */



bookForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const body = {
        name: bookName.value || bookName.value,
        author: author.value || authorSelect.value,
        genre: genre.value || genreSelect.value,
        binding: binding.value || bindingSelect.value,
        year: year.value || yearSelect.value
    }
    Fetch.post("books", body)
})
