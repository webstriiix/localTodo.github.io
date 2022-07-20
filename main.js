alert('This is use your browser local storage')

// to get local storage item "todos" or if false make an empty array
let todos = JSON.parse(localStorage.getItem('todos')) || []

// run program when window get load
window.addEventListener('load', () => {
    // get todo form
    const addTodo = document.querySelector('.add-todo')
    const deleteAllTodo = document.querySelector('.deleteAllTodo')
    
    // push todo form to local storage
    addTodo.addEventListener('submit', e => {
        // non activate auto reloud submit
        e.preventDefault()

        // save content element, validation, and date to object todo
        const todo = {
            content: e.target.elements.inputTodo.value,
            done: false,
            createdAdd: new Date().getTime()
        }  
    
    // push object todo to local storage item todos
    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos))
    
    // reseting input text
    e.target.reset()


    // display local storage to html
    DisplayTodo()

    })
})

function DisplayTodo() {

    // select class todo-list and make it empty
    const todoList = document.querySelector('.list')
    todoList.innerHTML = ''

    todos.forEach(todo => {
        // make a class todo-item
        const todoItem = document.createElement('div')
        todoItem.classList.add('todo-item')

        // make a todo list element
        const span = document.createElement('span')
        const label = document.createElement('label')
        const input = document.createElement('input')
        const edit = document.createElement('button')
        const content = document.createElement('div')
        const actions = document.createElement('div')
        const inputValue = document.createElement('input')
        const deleteButton = document.createElement('button')

        // make a checklist input
        input.type = 'checkbox'
        input.checked = todo.done
        span.classList.add('bubble')

        // add class and id to content element 
        actions.classList.add('actions')
        content.classList.add('todo-content')
        edit.classList.add('edit')
        deleteButton.classList.add('delete')
        inputValue.classList.add('content-list')
        inputValue.setAttribute('id','content_list')

        // make a todo content input element
        inputValue.value = todo.content
        inputValue.readOnly = true
        edit.innerHTML = 'edit'
        deleteButton.innerHTML = 'delete'

        // appending element to input
        label.appendChild(input)
        label.appendChild(span)
        actions.appendChild(edit)
        todoItem.appendChild(label)
        todoItem.appendChild(content)
        todoItem.appendChild(actions)
        content.appendChild(inputValue)
        actions.appendChild(deleteButton)
        todoList.appendChild(todoItem)

        if(todo.done) todoItem.classList.add('done')

        input.addEventListener('click', e => {
            todo.done = e.target.checked
            localStorage.setItem('todos', JSON.stringify(todos))

            if(todo.done)todoItem.classList.add('done')
            if(!todo.done) todoItem.classList.remove('done')
        })

        edit.addEventListener('click', e => {
            const input = document.querySelector('.content-list')
            edit.innerText = 'Save'
            input.removeAttribute('readonly')
            input.focus()
            input.classList.add('red')
            input.addEventListener('blur', e => {
                input.setAttribute('readonly', true)
                edit.innerText = 'Edit'
                todo.content = e.target.value
                localStorage.setItem('todos', JSON.stringify(todos))
                input.classList.remove('red')
                DisplayTodo()
            })
        })

        deleteButton.addEventListener('click', e => {
            let ask = confirm('Are u sure to delete this task?')
            if (ask) {
                todos = todos.filter(t => t != todo)
                localStorage.setItem('todos', JSON.stringify(todos))
                DisplayTodo()
            }
        })



    });
}

DisplayTodo()