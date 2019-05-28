var gTodos;
var gTodoSortBy;


function createTodosList() {
    var todos = loadFromStorage('todos');
    if (!todos || !todos.length) {
        //Demo Purposes
        todos = [
            createToDo('Learn JS', 1),
            createToDo('Learn CSS', 2),
            createToDo('Learn HTML', 3)
        ];
    }
    gTodos = todos;
    saveTodos();
}

function createToDo(txt, importance) {
    var date = new Date();
    var timestamp = + new Date();
    if (typeof(importance) !== 'number') importance = 3;
    return {
        id: makeId(),
        txt: txt,
        isDone: false,
        date: date.toString(),
        timestamp: timestamp,
        importance: importance,
    }
}

function doneToggle(todoIdx) {
    var todo = gTodos.find(function (todo) { return todo.id === todoIdx });
    todo.isDone = !todo.isDone;
}

function setSort(sortValue) {
    gTodoSortBy = sortValue;
}

function getTodosForDisplay() {
    if (gTodoSortBy === 'no-sort') return gTodos;
    if (gTodoSortBy === 'txt') {
        var todos = gTodos.slice();
        return todos.sort((a, b) => {
            var itemtxt1 = a.txt.toLowerCase();
            var itemtxt2 = b.txt.toLowerCase();
            for (var i = 0; i <= itemtxt1.length; i++) {
                if(!itemtxt1[i]) return -1;
                else if(!itemtxt2[i]) return 1;
                else if (itemtxt1[i].charCodeAt() < itemtxt2[i].charCodeAt()) return -1;
                else if (itemtxt1[i].charCodeAt() > itemtxt2[i].charCodeAt()) return 1;
            }
            return 0;
        });
    }
    if (gTodoSortBy === 'date') {
        var todos = gTodos.slice();
        return todos.sort((a, b) => {return a.timestamp - b.timestamp})
    }
    if (gTodoSortBy === 'importance') {
        return gTodos.sort(function (a, b) { return a.importance - b.importance })
    }
    if (gTodoSortBy === 'active' || gTodoSortBy === 'done') {
        return gTodos.filter(function (todo) {
            return (todo.isDone && gTodoSortBy === 'done') ||
                (!todo.isDone && gTodoSortBy === 'active')
        })
    }
}

function deleteTodo(todoIdx) {
    var todoID = gTodos.findIndex(function (todo) { return todo.id === todoIdx });
    gTodos.splice(todoID, 1);
    saveTodos();
}

function rearrangeListItem(elBtnValue, positionValue) {
    if (elBtnValue === 'up') {
        var todo = gTodos.splice(positionValue, 1);
        gTodos.splice(positionValue - 1, 0, todo[0]);
    }
    else if (elBtnValue === 'down') {
        var todo = gTodos.splice(positionValue, 1);
        gTodos.splice(positionValue + 1, 0, todo[0]);
    }
    saveTodos();
}

function saveTodos() {
    saveToStorage('todos', gTodos)
}

function addTodo() {
    var todo = createToDo(prompt(''), prompt('Importance?'));
    if (todo.txt) {
        gTodos.unshift(todo);
    } else {
        alert('No todo submitted.');
    }
}
