'use strict';

function init() {
    gTodoSortBy = 'no-sort';
    createTodosList();
    renderTodosList();
}

function renderTodosList() {
    var todos = getTodosForDisplay();
    if (!todos.length) {
        document.querySelector('.list-item-counter').innerHTML = todos.length + ' items left';
        switch (gTodoSortBy) {
            case 'done':
                document.querySelector('.todo-list').innerHTML = 'No Done Todos.';
                return
            case 'active':
                document.querySelector('.todo-list').innerHTML = 'No Active Todos.';
                return;
            default:
                document.querySelector('.todo-list').innerHTML = 'No Todos to display.';
                return;
        }
    }
    var strHTML = todos.map(function (todo) {
        var className = (todo.isDone ? 'done' : '');
        return `<li class="${className}" onclick="onDoneToggle('${todo.id}')">
        ${todo.txt}
        <br><span class="todo-date">Date Created: ${todo.date}</span>
        <br><span class="todo-importance">Importance: ${todo.importance}</span>
        <button onclick="onDeleteTodo(event,'${todo.id}')">X</button>
        </li>`
    })
    if (gTodoSortBy === 'no-sort') {
        for (var i = 1; i < strHTML.length - 1; i++) {
            if (strHTML[i]) {
                strHTML[i] += `<button class="order-btn" id="${i}" value="up" onclick="onRearrangeListItem(this.value, this.id)"><i class="fas fa-arrow-circle-up"></i></button>
                <button class="order-btn" id="${i}" value="down" onclick="onRearrangeListItem(this.value, this.id)"><i class="fas fa-arrow-circle-down"></i></button>`
            }
        }
    }
    document.querySelector('.todo-list').innerHTML = strHTML.join('');
    document.querySelector('.list-item-counter').innerHTML = todos.length + ' items left';
}

function onDeleteTodo(ev, todoIdx) {
    ev.stopPropagation();
    if (confirm('Are you sure you want to delete this todo?')) {
        deleteTodo(todoIdx);
        saveTodos();
        renderTodosList();
    } else return;
}

function onDoneToggle(todoIdx) {
    doneToggle(todoIdx);
    saveTodos();
    renderTodosList();
}

function onAddTodo() {
    addTodo()
    saveTodos();
    renderTodosList();
}

function onSetSort(sortValue) {
    var elBtns = document.querySelectorAll('.sort-btn');
    for (var i = 0; i < elBtns.length; i++) {
        if (elBtns[i].value !== sortValue && elBtns[i].classList.contains('selected')) {
            elBtns[i].classList.remove('selected');
        }
        if (elBtns[i].value === sortValue && !elBtns[i].classList.contains('selected')){
            elBtns[i].classList.add('selected');
        }
    }
    setSort(sortValue);
    renderTodosList();
}

function onRearrangeListItem(elBtnValue, positionValue) {
    positionValue = +positionValue;
    rearrangeListItem(elBtnValue, positionValue);
    renderTodosList();
}

