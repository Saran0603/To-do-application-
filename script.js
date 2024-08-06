document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks-container');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task-button');

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasksContainer.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            tasksContainer.appendChild(taskElement);
        });
    };

    const saveTasks = (tasks) => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const createTaskElement = (task) => {
        const taskElement = document.createElement('div');
        taskElement.className = `task ${task.completed ? 'completed' : ''}`;
        
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.checked = task.completed;
        taskCheckbox.addEventListener('change', () => {
            task.completed = taskCheckbox.checked;
            if (task.completed) {
                taskElement.classList.add('completed');
            } else {
                taskElement.classList.remove('completed');
            }
            saveTasks(getAllTasks());
        });

        const taskDescription = document.createElement('span');
        taskDescription.textContent = task.description;
        taskDescription.contentEditable = true;
        taskDescription.addEventListener('blur', () => {
            task.description = taskDescription.textContent.trim();
            saveTasks(getAllTasks());
        });

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const editButton = document.createElement('button');
        editButton.innerHTML = '✏️';
        editButton.addEventListener('click', () => {
            taskDescription.focus();
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '❌';
        deleteButton.addEventListener('click', () => {
            const tasks = getAllTasks();
            const updatedTasks = tasks.filter(t => t.id !== task.id);
            saveTasks(updatedTasks);
            tasksContainer.removeChild(taskElement);
        });

        taskActions.appendChild(editButton);
        taskActions.appendChild(deleteButton);

        taskElement.appendChild(taskCheckbox);
        taskElement.appendChild(taskDescription);
        taskElement.appendChild(taskActions);

        return taskElement;
    };

    const getAllTasks = () => {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    };

    addTaskButton.addEventListener('click', () => {
        const taskDescription = newTaskInput.value.trim();
        if (taskDescription === '') {
            alert('Task description cannot be empty.');
            return;
        }
        const newTask = {
            id: Date.now(),
            description: taskDescription,
            completed: false
        };
        const tasks = getAllTasks();
        tasks.push(newTask);
        saveTasks(tasks);
        const taskElement = createTaskElement(newTask);
        tasksContainer.appendChild(taskElement);
        newTaskInput.value = '';
    });

    loadTasks();
});
