import { Fetch } from "./fetches.js"

const roleTab = document.querySelector(".role-tab")
const rightsTab = document.querySelector(".rights-tab")
const createRuleBtn = document.querySelector(".rule-btn")
const ruleList = document.querySelector(".rule-list")
const rightsInput = document.querySelector(".rights")
const modalRight = document.querySelector(".modal-right")
const saveBtn = document.querySelector(".close")
const pagesList = document.querySelector(".pages")
const rightsBlock = document.querySelector(".rights-block")
const roleBlock = document.querySelector(".role-block")

rightsTab.addEventListener("click", () => {
    roleTab.style.background = "gray"
    rightsTab.style.background = "tomato"
    roleBlock.style.display = "none"
    rightsBlock.style.display = "block"
})

roleTab.addEventListener("click", () => {
    rightsTab.style.background = "gray"
    roleTab.style.background = "tomato"
    rightsBlock.style.display = "none"
    roleBlock.style.display = "block"
})

createRuleBtn.addEventListener("click", async () => {
    modalRight.style.display = "block"
    window.onclick = function (event) {
        if(event.target == modalRight){
            modalRight.style.display = "none"
        }
    }
})

saveBtn.addEventListener("click", () => {
    const body = {
        name: rightsInput.value
    }
    Fetch.post("rights", body)
    modalRight.style.display = "none" 
})

getRights()
async function getRights() {
    const getLength = await Fetch.get("rights")
    const getFirstPage = await Fetch.get("rights?_page=1&_limit=5")
    printRights(getFirstPage,ruleList)
    const pageQua = Math.ceil(getLength.length / 5)
    pagesList.innerHTML = ""
    for (let i = 0; i < pageQua; i++) {
        const elem = document.createElement("li")
        const page = document.createElement("button")
        page.classList.add("pages-elem")
        page.id = i + 1
        if(page.id == 1){
            page.classList.add("page-active")
        }
        page.addEventListener("click", async (e) => {
            const pageActive = document.querySelector(".page-active")
            e.currentTarget.classList.add("page-active")
            pageActive.classList.remove("page-active")
            const getPage = await Fetch.get(`rights?_page=${page.id}&_limit=5`)
            printRights(getPage,ruleList)
        })
        page.innerHTML = i + 1
        elem.appendChild(page)
        pagesList.appendChild(elem)
    }
}

async function printRights(arr,list) {
    list.innerHTML = ""
    for (let i = 0; i < arr.length; i++) {
        const elem = document.createElement("li")
        const { name } = arr[i]
        elem.innerHTML = `${name}`
        list.appendChild(elem)
    }
}

const roleList = document.querySelector(".role-list")
const rolePage = document.querySelector(".page-list")

getRoles()
async function getRoles() {
    const getLength = await Fetch.get("roles")
    const getFirstPage = await Fetch.get("roles?_page=1&_limit=5")
    printRights(getFirstPage,roleList)
    const pageQua = Math.ceil(getLength.length / 5)
    rolePage.innerHTML = ""
    for (let i = 0; i < pageQua; i++) {
        const elem = document.createElement("li")
        const page = document.createElement("button")
        page.classList.add("pages-elem")
        page.id = i + 1
        if(page.id == 1){
            page.classList.add("page-active")
        }
        page.addEventListener("click", async (e) => {
            const pageActive = document.querySelector(".page-active")
            e.currentTarget.classList.add("page-active")
            pageActive.classList.remove("page-active")
            const getPage = await Fetch.get(`roles?_page=${page.id}&_limit=5`)
            printRights(getPage,roleList)
        })
        page.innerHTML = i + 1
        elem.appendChild(page)
        rolePage.appendChild(elem)
    }
}

const modalRole = document.querySelector(".modal-role")
const list = document.querySelector(".list")
const roleBtn = document.querySelector(".role-btn")
const roleName = document.querySelector(".role-name")
const saveRole = document.querySelector(".save")

let arr = []

roleBtn.addEventListener("click", async () => {
    modalRole.style.display = "block"
    const getRights = await Fetch.get("rights")
    list.innerHTML = ""
    for (let i = 0; i < getRights.length; i++) {
        const elem = document.createElement("li")
        const input = document.createElement("input")
        const span = document.createElement("span")
        input.type = "checkbox"
        const {name,id} = getRights[i]
        input.id = `${id}`
        span.innerHTML = `${name}`
        input.addEventListener("click", () => {
            arr.push(+input.id)
        })
        elem.appendChild(input)
        elem.appendChild(span)
        list.appendChild(elem)
    }
    window.onclick = function (event) {
        if(event.target == modalRole){
            modalRole.style.display = "none"
        }
    }
})

saveRole.addEventListener("click", () => {
    const body = {
        name: roleName.value,
        rightsIds: arr
    }
    Fetch.post("roles", body)
    modalRole.style.display = "none" 
})