import { Fetch } from "./fetches.js"
import getData  from "./getData.js"

const createBtn = document.querySelector(".create-user")
const usersList = document.querySelector(".users-list")
const pageList = document.querySelector(".page-list")
const modalUser = document.querySelector(".modal-user")
const form = document.querySelector(".modal_content-user")
const userName = document.querySelector(".name")
const userSurname = document.querySelector(".surname")
const userEmail = document.querySelector(".email")
const userPassword = document.querySelector(".password")
const genPass = document.querySelector(".genPass")
const genEmail = document.querySelector(".genEmail")
const select = document.querySelector(".rank")
const saveBtn = document.querySelector(".save")

getData("users", usersList, pageList, printUser)

getList()
async function getList() {
    const res = await Fetch.get("users")
    printUser(res,usersList)
}

async function printUser(arr,list) {
    list.innerHTML = ""
    arr.forEach((item) => {
        const elem = document.createElement("li")
        elem.classList.add("list-elem")
        elem.id = `${item.id}`
        printElem()
        function printElem() {
            const listHtml = `
                <p class="list-text name">${item.name}</p>
                <p class="list-text surname">${item.surname}</p>
                <p class="list-text email">${item.email}</p>
                <p class="list-text roleName">${item.roleName}</p> 
                <span class="btn-span">
                <button class="btn-edit">Редактировать</button>
                <button class="btn-delete">Удалить</button>
                </span>
            `
            elem.innerHTML = listHtml
            return addListener(elem)
        }
        function addListener(element){
            const btnEdit = element.querySelector(".btn-edit")
            const btnDelete = element.querySelector(".btn-delete")
            const name = element.querySelector(".name")
            const surname = element.querySelector(".surname")
            const email = element.querySelector(".email")
            const roleName = element.querySelector(".roleName")
            const btnSpan = element.querySelector(".btn-span")
            btnEdit.addEventListener("click", async () => {
                btnEdit.style.display = "none"
                const btnSave = document.createElement("button")
                btnSave.innerHTML = "Сохранить"
                const nameInput = document.createElement("input")
                const surnameInput = document.createElement("input")
                const emailInput = document.createElement("input")
                const select = document.createElement("select")
                nameInput.classList.add("edit-input")
                nameInput.value = name.innerHTML
                surnameInput.classList.add("edit-input")
                surnameInput.value = surname.innerHTML
                emailInput.classList.add("edit-input")
                emailInput.value = email.innerHTML
                select.classList.add("edit-input")
                const roles = await Fetch.get("roles")
                for (let i = 0; i < roles.length; i++) {
                    const option = document.createElement("option")
                    option.id = i + 1
                    const {name} = roles[i]
                    option.innerHTML = `${name}`
                    select.appendChild(option)
                }
                name.innerHTML = ""
                surname.innerHTML = ""
                email.innerHTML = ""
                roleName.innerHTML = ""
                name.appendChild(nameInput)
                surname.appendChild(surnameInput)
                email.appendChild(emailInput)
                roleName.appendChild(select)
                btnSpan.prepend(btnSave)
                btnSave.addEventListener("click", async () => {
                    const body = {
                        name: nameInput.value,
                        surname: surnameInput.value,
                        email: emailInput.value,
                        roleName: select.value
                    }
                    await Fetch.patch(`users/${item.id}`, body)
                    getList()
                })
            })
            btnDelete.addEventListener("click", async () => {
                await Fetch.delete(`users/${item.id}`)
                getList()
            })
        }
        list.appendChild(elem)
    })
}

createBtn.addEventListener("click", async () => {
    modalUser.style.display = "block"
    genPass.addEventListener("click", (e) => {
        e.preventDefault()
        const pass = Math.floor(Math.random()*(9999-1000+1)+1000)
        userPassword.value = pass
    })
    genEmail.addEventListener("click", async (e) => {
        e.preventDefault()
        let condition = true
        do {
            const pass = Math.floor(Math.random() * 3) + 1
            const email = `user${pass}@mail.com`
            const res = await Fetch.get(`users?email=${email}`)
            if(res.length == 0){
                condition = false
                userEmail.value = email
            } 
        } while (condition);
    })
    window.onclick = function (event) {
        if(event.target == modalUser){
            modalUser.style.display = "none"
        }
    }
    const roles = await Fetch.get("roles")
    for (let i = 0; i < roles.length; i++) {
        const option = document.createElement("option")
        option.id = i + 1
        const {name} = roles[i]
        option.innerHTML = `${name}`
        select.appendChild(option)
    }        
})

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    const body = {
        name: userName.value,
        surname: userSurname.value,
        email: userEmail.value,
        password: userPassword.value,
        roleName: select.value
    }
    Fetch.post("users", body)
    getData("users", usersList, pageList, printUser)
    getList()
    modalUser.style.display = "none" 
})



