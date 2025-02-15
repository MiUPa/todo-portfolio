document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value;
    const priority = document.getElementById('prioritySelect').value;

    if (taskText) {
        createTaskElement(taskText, priority);
        taskInput.value = ''; // 入力フィールドをクリア
    }
});

document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('addTaskButton').click();
    }
});

// タスク要素を作成する関数
function createTaskElement(taskText, priority) {
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
    textSpan.textContent = taskText;
    li.className = priority;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
        saveTasks();
    });

    const editButton = document.createElement('button');
    editButton.textContent = '編集';
    editButton.className = 'task-button';
    editButton.addEventListener('click', function() {
        const newTaskText = prompt('タスクを編集:', taskText);
        if (newTaskText) {
            textSpan.textContent = newTaskText;
            saveTasks();
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '削除';
    deleteButton.className = 'task-button';
    deleteButton.addEventListener('click', function() {
        li.remove();
        saveTasks();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    document.getElementById('taskList').appendChild(li);
}

// フィルタリング機能
document.getElementById('filterAll').addEventListener('click', function() {
    filterTasks('all');
});

document.getElementById('filterCompleted').addEventListener('click', function() {
    filterTasks('completed');
});

document.getElementById('filterPending').addEventListener('click', function() {
    filterTasks('pending');
});

function filterTasks(filter) {
    const tasks = document.querySelectorAll('#taskList li');
    tasks.forEach(task => {
        const isCompleted = task.classList.contains('completed');
        if (filter === 'all') {
            task.style.display = '';
        } else if (filter === 'completed' && isCompleted) {
            task.style.display = '';
        } else if (filter === 'pending' && !isCompleted) {
            task.style.display = '';
        } else {
            task.style.display = 'none';
        }
    });
}

// ローカルストレージの利用
window.onload = function() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.text;
        if (task.completed) {
            li.classList.add('completed');
        }
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                li.classList.add('completed');
            } else {
                li.classList.remove('completed');
            }
            saveTasks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '削除';
        deleteButton.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });

        li.prepend(checkbox);
        li.appendChild(deleteButton);
        document.getElementById('taskList').appendChild(li);
    });
};

function saveTasks() {
    const tasks = [];
    const taskItems = document.querySelectorAll('#taskList li');
    taskItems.forEach(task => {
        tasks.push({
            text: task.childNodes[1].textContent,
            completed: task.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
