import { Fetch } from "./fetches.js"

export default async function printSearchRes(key,list, pageList, func, keyWord, order){
    const getLength = await Fetch.get(key)
        const getFirstPage = await Fetch.get(`${key}&_page=1&_limit=5&_sort=${keyWord},year&_order=${order},desc`)
        func(getFirstPage,list)
        const pageQua = Math.ceil(getLength.length / 5)
        pageList.innerHTML = ""
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
                const getPage = await Fetch.get(`${key}&_page=${page.id}&_limit=5&_sort=${keyWord},year&_order=${order},desc`)
                func(getPage,list)
            })
            page.innerHTML = i + 1
            elem.appendChild(page)
            pageList.appendChild(elem)
        }
}