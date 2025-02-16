document.getElementById('addTaskButton').addEventListener('click', function() {
    const taskInput = document.getElementById('taskInput');
    const prioritySelect = document.getElementById('prioritySelect');
    
    if (taskInput.value.trim() !== '') {
        createTaskElement(taskInput.value, prioritySelect.value);
        taskInput.value = '';
    }
});

document.getElementById('taskInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        document.getElementById('addTaskButton').click();
    }
});

// ページ読み込み時にタスクを復元
window.addEventListener('load', function() {
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        createTaskElement(task.text, task.priority, task.completed);
    });
});

// タスク要素を作成する関数
function createTaskElement(taskText, priority, completed = false) {
    const li = document.createElement('li');
    const textSpan = document.createElement('span');
    textSpan.textContent = taskText;
    li.className = priority;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    if (completed) {
        li.classList.add('completed');
    }
    
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
    
    saveTasks(); // 新しいタスクが追加されたときに保存
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

// タスクを保存する関数
function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed'),
            priority: li.className.replace('completed', '').trim()
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
