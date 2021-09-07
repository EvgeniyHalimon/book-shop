import { Fetch } from "./fetches.js"
import getData  from "./getData.js"
import tab from "./tab.js"
import { Storage } from "./getDataFromStorage.js"

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
const linkToUsers = document.querySelector(".nav-users")

const role = Storage.getData("role")

if(role != "Admin"){
    roleBlock.style.display = "none"
    roleTab.style.display = "none"
}

async function checkRights(){
    const res = await Fetch.get(`roles?name=${role}`)
    const [{rightsIds}] = res
    if(!rightsIds.includes(1) && !rightsIds.includes(2) && !rightsIds.includes(3)){
        linkToUsers.style.display = "none"
    }
    if(!rightsIds.includes(4) && !rightsIds.includes(5)){
        roleBlock.style.display = "none"
        roleTab.style.display = "none"
        rightsBlock.style.display = "Block"
    }
}
checkRights()

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

saveBtn.addEventListener("click", async () => {
    const body = {
        name: rightsInput.value
    }
    Fetch.post("rights", body)
    const res = await Fetch.get("rights")
    const lastId = res.length + 1
    const rightsID = await Fetch.get("roles/1")
    let arr = rightsID.rightsIds.push(lastId)
    const newRight = {
        rightsIds : rightsID.rightsIds
    }
    Fetch.patch("roles/1", newRight)
    modalRight.style.display = "none" 
    getData("rights", ruleList, pagesList, print, `name`, `asc`)
})

getData("rights", ruleList, pagesList, print, `name`, `asc`)

const roleList = document.querySelector(".role-list")
const rolePage = document.querySelector(".page-list")

getData("roles", roleList, rolePage, print, `name`, `asc`)

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
