// Initialize todos from localStorage or create an empty array if none exists
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// DOM Elements
const elements = {
  todoList: null,
  addTodoForm: null,
  deleteAllButton: null
};

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get references to DOM elements
  elements.todoList = document.querySelector('.list');
  elements.addTodoForm = document.querySelector('.add-todo');
  elements.deleteAllButton = document.querySelector('.deleteAllTodo');
  
  // Set up event listeners
  setupEventListeners();
  
  // Display todos from localStorage
  displayTodos();
});

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  // Add new todo item
  elements.addTodoForm.addEventListener('submit', handleAddTodo);
  
  // Delete all todos
  if (elements.deleteAllButton) {
    elements.deleteAllButton.addEventListener('click', handleDeleteAllTodos);
  }
}

/**
 * Handle the add todo form submission
 * @param {Event} e - The submit event
 */
function handleAddTodo(e) {
  e.preventDefault();
  
  const inputElement = e.target.elements.inputTodo;
  const todoContent = inputElement.value.trim();
  
  if (!todoContent) return; // Don't add empty todos
  
  // Create new todo object
  const todo = {
    content: todoContent,
    done: false,
    createdAt: new Date().getTime()
  };
  
  // Add to todos array and update localStorage
  todos.push(todo);
  updateLocalStorage();
  
  // Reset the form and refresh the display
  e.target.reset();
  displayTodos();
}

/**
 * Handle deleting all todos
 */
function handleDeleteAllTodos() {
  if (todos.length === 0) return;
  
  const confirmation = confirm('Are you sure you want to delete all tasks?');
  if (confirmation) {
    todos = [];
    updateLocalStorage();
    displayTodos();
  }
}

/**
 * Update localStorage with current todos
 */
function updateLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Display all todos in the DOM
 */
function displayTodos() {
  // Clear current todo list
  elements.todoList.innerHTML = '';
  
  // Show message if no todos
  if (todos.length === 0) {
    const emptyMessage = document.createElement('div');
    emptyMessage.classList.add('empty-todos');
    emptyMessage.textContent = 'No tasks yet. Add a task to get started!';
    elements.todoList.appendChild(emptyMessage);
    return;
  }
  
  // Create DOM elements for each todo
  todos.forEach((todo, index) => {
    const todoItem = createTodoElement(todo, index);
    elements.todoList.appendChild(todoItem);
  });
}

/**
 * Create a DOM element for a todo item
 * @param {Object} todo - The todo object
 * @param {number} index - The index of the todo in the array
 * @returns {HTMLElement} - The todo DOM element
 */
function createTodoElement(todo, index) {
  // Create main container
  const todoItem = document.createElement('div');
  todoItem.classList.add('todo-item');
  if (todo.done) todoItem.classList.add('done');
  
  // Create checkbox
  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.done;
  checkbox.dataset.index = index;
  checkbox.addEventListener('change', handleToggleTodo);
  
  const span = document.createElement('span');
  span.classList.add('bubble');
  label.appendChild(checkbox);
  label.appendChild(span);
  
  // Create content area
  const content = document.createElement('div');
  content.classList.add('todo-content');
  
  const inputValue = document.createElement('input');
  inputValue.classList.add('content-list');
  inputValue.value = todo.content;
  inputValue.readOnly = true;
  inputValue.dataset.index = index;
  content.appendChild(inputValue);
  
  // Create action buttons
  const actions = document.createElement('div');
  actions.classList.add('actions');
  
  const editButton = document.createElement('button');
  editButton.classList.add('edit');
  editButton.textContent = 'Edit';
  editButton.dataset.index = index;
  editButton.addEventListener('click', handleEditTodo);
  
  const deleteButton = document.createElement('button');
  deleteButton.classList.add('delete');
  deleteButton.textContent = 'Delete';
  deleteButton.dataset.index = index;
  deleteButton.addEventListener('click', handleDeleteTodo);
  
  actions.appendChild(editButton);
  actions.appendChild(deleteButton);
  
  // Assemble the todo item
  todoItem.appendChild(label);
  todoItem.appendChild(content);
  todoItem.appendChild(actions);
  
  return todoItem;
}

/**
 * Handle toggling a todo's done status
 * @param {Event} e - The change event
 */
function handleToggleTodo(e) {
  const index = parseInt(e.target.dataset.index);
  todos[index].done = e.target.checked;
  updateLocalStorage();
  displayTodos();
}

/**
 * Handle editing a todo
 * @param {Event} e - The click event
 */
function handleEditTodo(e) {
  const index = parseInt(e.target.dataset.index);
  const inputElement = document.querySelectorAll('.content-list')[index];
  const button = e.target;
  
  if (button.textContent === 'Edit') {
    // Enter edit mode
    button.textContent = 'Save';
    inputElement.removeAttribute('readonly');
    inputElement.classList.add('editing');
    inputElement.focus();
    
    // Set up the blur event for when user clicks outside
    const blurHandler = () => {
      saveTodoEdit(inputElement, button, index);
      inputElement.removeEventListener('blur', blurHandler);
    };
    
    inputElement.addEventListener('blur', blurHandler);
    
    // Also save on Enter key
    inputElement.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        saveTodoEdit(inputElement, button, index);
        inputElement.blur();
      }
    });
  } else {
    // Save changes
    saveTodoEdit(inputElement, button, index);
  }
}

/**
 * Save an edited todo
 * @param {HTMLInputElement} inputElement - The input element
 * @param {HTMLButtonElement} button - The edit/save button
 * @param {number} index - The todo index
 */
function saveTodoEdit(inputElement, button, index) {
  inputElement.setAttribute('readonly', true);
  button.textContent = 'Edit';
  inputElement.classList.remove('editing');
  
  const newContent = inputElement.value.trim();
  if (newContent) {
    todos[index].content = newContent;
    updateLocalStorage();
    displayTodos();
  }
}

/**
 * Handle deleting a todo
 * @param {Event} e - The click event
 */
function handleDeleteTodo(e) {
  const index = parseInt(e.target.dataset.index);
  const confirmation = confirm('Are you sure you want to delete this task?');
  
  if (confirmation) {
    todos.splice(index, 1);
    updateLocalStorage();
    displayTodos();
  }
}

alert('This app uses your browser local storage');
