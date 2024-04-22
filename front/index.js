const tbody = document.querySelector('tbody')

const table = document.querySelector('table')

const fname = document.querySelector('.fname')
const lname = document.querySelector('.lname')
const email = document.querySelector('.email')
const password = document.querySelector('.password')

const form = document.querySelector('.addForm')

const fnameEdit = document.querySelector('.fnameEdit')
const lnameEdit = document.querySelector('.lnameEdit')
const emailEdit = document.querySelector('.emailEdit')

const formEdit = document.querySelector('.editForm')
const editSection = document.querySelector('.editSection')
const closeBtn = document.querySelector('.close')

let mainData = [];

window.addEventListener('load', () => {
    fetch('http://localhost:5000')
        .then(res => res.json())
        .then((d) => {
            mainData.push(...d)
            generateTable()
        })
})

function generateTable() {
    tbody.innerHTML = ''

    if (mainData.length > 0) {
        mainData.forEach(d => {
            addRow(d)
        })
    } else {
        tbody.insertAdjacentHTML('beforeend', 'Empty')
    }
}

function addRow(data) {
    tbody.insertAdjacentHTML('beforeend', `<tr>
            <td>${data.firstname}</td>
            <td>${data.lastname}</td>
            <td>${data.email}</td>
            <td>
              <img src="trash-can-regular.svg" class="delete" alt="delete" data-id="${data.id}">
              <img src="pen-regular.svg" alt="edit" class="edit" data-id="${data.id}">
            </td>
            
        </tr>`)
}


form.addEventListener('submit', (e) => {
    e.preventDefault()

    if (fname.value === '' || lname.value === '' || email.value === '' || password.value === '') {
        alert('The inputs are empty!')
    } else {
        const obj = {
            firstname: fname.value, lastname: lname.value, email: email.value, password: password.value
        }

        fetch('http://localhost:5000/post', {
            method: 'POST', headers: {
                "Content-Type": "application/json"
            }, body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'OK') {

                    fname.value = '';
                    lname.value = '';
                    email.value = '';
                    password.value = '';

                    mainData.push(data.data)
                    addRow(data.data)
                }
            })
    }
})

table.addEventListener('click', (e) => {

    if (e.target.className === 'delete') {
        const id = e.target.dataset.id

        fetch(`http://localhost:5000/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'Success') {
                    mainData = [...data.data]
                    generateTable()
                }
            })
    }

    if (e.target.className === 'edit') {
        const id = e.target.dataset.id;
        const data = mainData.find(d => d.id === id)

        editSection.style.display = 'flex'
        formEdit.dataset.id = id

        fnameEdit.value = data.firstname;
        lnameEdit.value = data.lastname;
        emailEdit.value = data.email;
    }
})

closeBtn.addEventListener('click', () => {
    editSection.style.display = 'none'
})

formEdit.addEventListener('submit', (e) => {
    e.preventDefault()

    const id = e.target.dataset.id;

    const obj = {
        firstname: fnameEdit.value, lastname: lnameEdit.value, email: emailEdit.value
    }

    fetch(`http://localhost:5000/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
        .then(res => res.json())
        .then(data => {

            if (data.status === 'Success') {

                editSection.style.display = 'none'
                const index = mainData.findIndex(d => d.id === data.data.id)

                mainData.splice(index, 1, data.data)
                generateTable()
            }
        })
})
