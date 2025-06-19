const todoLists = JSON.parse(localStorage.getItem('todoLists')) || [];

renderTodolist();

function renderTodolist() {
    let todoListsHTML = "";

    if (todoLists.length === 0) {
        todoListsHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list" style="font-size: 3rem; color: #ccc; margin-bottom: 1rem;"></i>
                <p>No todos yet. Add one to get started!</p>
            </div>
        `;
    } else {
        for(let i = 0; i < todoLists.length; i++) {
            const todoObject = todoLists[i];
            const {name, dueDate} = todoObject;
            
            // Format the date to be more readable
            const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }) : 'No date';
            
            todoListsHTML += `
                <div class="todo-item" style="animation-delay: ${i * 0.1}s">
                    <div class="todo-text">
                        <div class="todo-name">${name}</div>
                        <div class="todo-date">${formattedDate}</div>
                    </div>
                    <button class="delete-btn" onclick="
                        this.parentElement.style.animation = 'fadeOut 0.3s ease-out forwards';
                        setTimeout(() => {
                            todoLists.splice(${i}, 1);
                            renderTodolist();
                        }, 300);
                    ">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                </div>
            `;
        }
    }

    document.querySelector('.js-todo-list').innerHTML = todoListsHTML;
    localStorage.setItem('todoLists', JSON.stringify(todoLists));
}

function addToDo() {
    const inputElement = document.querySelector('.js-name-input');
    const name = inputElement.value.trim();
    const dateInputElement = document.querySelector('.js-due-date-input').value;
    
    if (!name) {
        // Add shake animation to indicate error
        inputElement.style.animation = 'shake 0.5s';
        setTimeout(() => {
            inputElement.style.animation = '';
        }, 500);
        return;
    }
    
    todoLists.push({
        name,
        dueDate: dateInputElement,
    });

    inputElement.value = "";
    renderTodolist();
    
    // Add focus to input after adding
    inputElement.focus();
}

// Add keypress event for Enter key
document.querySelector('.js-name-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addToDo();
    }
});

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
    }
    @keyframes fadeOut {
        to { opacity: 0; transform: translateX(50px); }
    }
`;
document.head.appendChild(style);