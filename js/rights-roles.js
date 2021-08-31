import { Fetch } from "./fetches.js"
import getData  from "./getData.js"
import tab from "./tab.js"

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

tab(roleTab,rightsTab,roleBlock,rightsBlock)
tab(rightsTab,roleTab,rightsBlock,roleBlock)

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
    getData("rights", ruleList, pagesList, print, `name`, `asc`)
})

getData("rights", ruleList, pagesList, print, `name`, `asc`)

getRights()
async function getRights() {
    const rights = await Fetch.get("rights")
    print(rights, ruleList)
}


const roleList = document.querySelector(".role-list")
const rolePage = document.querySelector(".page-list")

getData("roles", roleList, rolePage, print, `name`, `asc`)

getRoles()
async function getRoles() {
    const roles = await Fetch.get("roles")
    print(roles, roleList)
}

function print(arr,list) {
    list.innerHTML = ""
    for (let i = 0; i < arr.length; i++) {
        const elem = document.createElement("li")
        const { name } = arr[i]
        elem.innerHTML = `${name}`
        list.appendChild(elem)
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
    getData("roles", roleList, rolePage, print, `name`, `asc`)
})
