const headerMain = document.querySelector('.header__main');
const editor = document.querySelector('.editor');
const addTaskBtn = document.querySelector('.main__add-task-btn');
const openDeleteModalBtn = document.querySelector('.main__open-delete-modal-btn');
const buttons = document.querySelector('.main__btns');
const taskList = document.querySelector('.main__task-list');
const taskContainer = document.querySelector('.main__task-container');
let taskListState = false;

class Task {
    constructor(number, text, checkboxState, markColor, idBold, isCursive) {
        this.number = number;
        this.text = text;
        this.checkboxState = checkboxState;
        this.markColor = markColor;
        this.isBold = idBold;
        this.isCursive = isCursive;
    }
}

let tasksObjArr = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
console.log(tasksObjArr)

function getStoredTasks() {
    if (tasksObjArr.length !== 0) {
        taskContainer.classList.remove('justify-content-center');
        taskList.classList.remove('main__task-list_empty');
        taskList.textContent = '';

        openDeleteModalBtn.classList.remove('hidden');
        buttons.classList.remove('justify-content-end');
        buttons.classList.add('justify-content-between');

        taskListState = true;
    }
    for(let i = 0; i < tasksObjArr.length; i++) {
        const task = document.createElement('div');
        task.classList.add('task', `${tasksObjArr[i].markColor}`, 'd-flex', 'justify-content-center', 'align-items-center');
        taskList.append(task);
    
        const taskNum = document.createElement('div');
        taskNum.classList.add('task__task-number');
        taskNum.textContent = `${tasksObjArr[i].number}.`;
        task.append(taskNum);
    
        const taskInput = document.createElement('input');
        taskInput.classList.add('task__task-input');
        taskInput.value = tasksObjArr[i].text;
        task.append(taskInput);
    
        taskInput.addEventListener('input', () => {
            updateTaskInput(tasksObjArr[i].number, taskInput.value);
        });
    
        const taskСheckbox = document.createElement('div');
        let taskCheckboxState = tasksObjArr[i].checkboxState;
        taskСheckbox.classList.add('task__task-checkbox');
        taskСheckbox.innerHTML = `
        <svg class="hidden" width="40.416748" height="30.416672" viewBox="0 0 40.4167 30.4167" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <defs/>
            <path id="polygon" d="M37.5 0L12.91 24.58L2.91 14.58L0 17.6L12.91 30.41L40.41 2.91L37.5 0Z" fill="#43A047" fill-opacity="1.000000" fill-rule="nonzero"/>
        </svg>
        `;
        if(taskCheckboxState === true) {
            taskСheckbox.firstElementChild.classList.remove('hidden');
        }
        task.append(taskСheckbox);
    
        taskСheckbox.addEventListener('click', () => {
            if(taskCheckboxState === false) {
                taskСheckbox.firstElementChild.classList.remove('hidden');
                taskCheckboxState = true;
            } else {
                taskСheckbox.firstElementChild.classList.add('hidden');
                taskCheckboxState = false;
            }
            updateTaskCheckboxState(tasksObjArr[i].number, taskCheckboxState);
        });

        const editBtn = document.createElement('div');
        editBtn.classList.add('task__edit-btn');
        editBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30px" height="30px">
                <path class="task__edit-svg" fill="#363636" d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"/>
            </svg>
        `;
        task.append(editBtn);
    
        function updateEditorState() {
            const tasks = document.querySelectorAll('.task');
            for(elem of tasks) {
                if(elem.classList.contains('task_selected')) {
                    headerMain.classList.add('header__main_disabled');
                    editor.classList.remove('editor_disabled');
                    break;
                } else {
                    headerMain.classList.remove('header__main_disabled');
                    editor.classList.add('editor_disabled');
                }
            }
        }

        editBtn.addEventListener('click', () => {
            let selectedTasks = document.querySelectorAll('.task_selected').length;
            if(task.classList.contains('task_selected')) {
                task.classList.remove('task_selected');
                selectedTasks = selectedTasks - 1;
                updateEditorState();
            } else {
                task.classList.add('task_selected');
                selectedTasks = selectedTasks + 1;
                updateEditorState();
            }
            const selectedTasksOnDisplay = document.querySelector('.editor__selected-tasks');
            selectedTasksOnDisplay.textContent = `Выбрано: ${selectedTasks}`;

            updateBoldBtn();
            updateCursiveBtn();
        });
        
    }
}

getStoredTasks()

function updateTaskInput(taskId, taskInput) {
    const task = tasksObjArr.find(t => t.number === taskId);
    if (task) {
        task.text = taskInput;
    }
    localStorage.setItem('tasks', JSON.stringify(tasksObjArr));
}

function updateTaskCheckboxState(taskId, taskCheckboxState) {
    const task = tasksObjArr.find(t => t.number === taskId);
    if (task) {
        task.checkboxState = taskCheckboxState;
    }
    localStorage.setItem('tasks', JSON.stringify(tasksObjArr));
}

addTaskBtn.addEventListener("click", () => {
    if(taskListState === false) {
        taskContainer.classList.remove('justify-content-center');
        taskList.classList.remove('main__task-list_empty');
        taskList.textContent = '';

        openDeleteModalBtn.classList.remove('hidden');
        buttons.classList.remove('justify-content-end');
        buttons.classList.add('justify-content-between');

        taskListState = true;
    }

    const task = document.createElement('div');
    task.classList.add('task', 'd-flex', 'justify-content-center', 'align-items-center');
    taskList.append(task);

    const taskId = tasksObjArr.length+1;

    const taskNum = document.createElement('div');
    taskNum.classList.add('task__task-number');
    taskNum.textContent = `${taskId}.`
    task.append(taskNum);

    const taskInput = document.createElement('input');
    taskInput.classList.add('task__task-input');
    task.append(taskInput);

    taskInput.addEventListener('input', () => {
        updateTaskInput(taskId, taskInput.value);
        
    });

    const taskСheckbox = document.createElement('div');
    let taskCheckboxState = false;
    taskСheckbox.classList.add('task__task-checkbox');
    taskСheckbox.innerHTML = `
    <svg class="hidden" width="40.416748" height="30.416672" viewBox="0 0 40.4167 30.4167" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs/>
        <path id="polygon" d="M37.5 0L12.91 24.58L2.91 14.58L0 17.6L12.91 30.41L40.41 2.91L37.5 0Z" fill="#43A047" fill-opacity="1.000000" fill-rule="nonzero"/>
    </svg>
    `;
    task.append(taskСheckbox);

    taskСheckbox.addEventListener('click', () => {
        if(taskCheckboxState === false) {
            taskСheckbox.firstElementChild.classList.remove('hidden');
            taskCheckboxState = true;
        } else {
            taskСheckbox.firstElementChild.classList.add('hidden');
            taskCheckboxState = false;
        }
        updateTaskCheckboxState(taskId, taskCheckboxState);
    });

    const editBtn = document.createElement('div');
    editBtn.classList.add('task__edit-btn');
    editBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30px" height="30px">
            <path class="task__edit-svg" fill="#363636" d="M 43.125 2 C 41.878906 2 40.636719 2.488281 39.6875 3.4375 L 38.875 4.25 L 45.75 11.125 C 45.746094 11.128906 46.5625 10.3125 46.5625 10.3125 C 48.464844 8.410156 48.460938 5.335938 46.5625 3.4375 C 45.609375 2.488281 44.371094 2 43.125 2 Z M 37.34375 6.03125 C 37.117188 6.0625 36.90625 6.175781 36.75 6.34375 L 4.3125 38.8125 C 4.183594 38.929688 4.085938 39.082031 4.03125 39.25 L 2.03125 46.75 C 1.941406 47.09375 2.042969 47.457031 2.292969 47.707031 C 2.542969 47.957031 2.90625 48.058594 3.25 47.96875 L 10.75 45.96875 C 10.917969 45.914063 11.070313 45.816406 11.1875 45.6875 L 43.65625 13.25 C 44.054688 12.863281 44.058594 12.226563 43.671875 11.828125 C 43.285156 11.429688 42.648438 11.425781 42.25 11.8125 L 9.96875 44.09375 L 5.90625 40.03125 L 38.1875 7.75 C 38.488281 7.460938 38.578125 7.011719 38.410156 6.628906 C 38.242188 6.246094 37.855469 6.007813 37.4375 6.03125 C 37.40625 6.03125 37.375 6.03125 37.34375 6.03125 Z"/>
        </svg>
    `;
    task.append(editBtn);

    function updateEditorState() {
        const tasks = document.querySelectorAll('.task');
        for(elem of tasks) {
            if(elem.classList.contains('task_selected')) {
                headerMain.classList.add('header__main_disabled');
                editor.classList.remove('editor_disabled');
                break;
            } else {
                headerMain.classList.remove('header__main_disabled');
                editor.classList.add('editor_disabled');
            }
        }
    }

    editBtn.addEventListener('click', () => {
        let selectedTasks = document.querySelectorAll('.task_selected').length;
        if(task.classList.contains('task_selected')) {
            task.classList.remove('task_selected');
            selectedTasks = selectedTasks - 1;
            updateEditorState();
        } else {
            task.classList.add('task_selected');
            selectedTasks = selectedTasks + 1;
            updateEditorState();
        }
        const selectedTasksOnDisplay = document.querySelector('.editor__selected-tasks');
        selectedTasksOnDisplay.textContent = `Выбрано: ${selectedTasks}`;
        updateCursiveBtn();
        updateBoldBtn();
    });

    let taskObj = new Task(taskId, taskInput.value, taskCheckboxState, 'default', false, false);
    tasksObjArr.push(taskObj);

    localStorage.setItem('tasks', JSON.stringify(tasksObjArr));
});

const deleteAllConfirmBtn = document.querySelector('#delete-all-confirm-btn');

deleteAllConfirmBtn.addEventListener('click', () => {
    tasksObjArr = [];
    localStorage.clear('tasks');
    taskListState = false;
    taskContainer.classList.add('justify-content-center');
    taskList.classList.add('main__task-list_empty');
    openDeleteModalBtn.classList.add('hidden');
    buttons.classList.add('justify-content-end');
    buttons.classList.remove('justify-content-between');
    taskList.textContent = 'Список пуст';
    closeEditor();
})

function closeEditor() {
    headerMain.classList.remove('header__main_disabled');
    editor.classList.add('editor_disabled');
    const tasks = document.querySelectorAll('.task');
    for(elem of tasks) {
        if(elem.classList.contains('task_selected')) {
            elem.classList.remove('task_selected')
        }
    }
};

const closeEditorBtn = document.querySelector('.editor__close-btn');
closeEditorBtn.addEventListener('click', closeEditor)

const editorMarkColors = document.querySelectorAll('.modal-mark-color__color');
const editorCheckMarks = document.querySelectorAll('#check-mark');
let taskMarkColor = null;

function updateSelectedMarkColors() {
    for (let i = 0; i < editorMarkColors.length; i++) {
        if(editorMarkColors[i].classList.contains('modal-mark-color__color_selected')) {
            editorMarkColors[i].classList.remove('modal-mark-color__color_selected');
            editorCheckMarks[i].classList.add('hidden');
        }
        editorMarkColors[i].addEventListener('click', () => {
            for (let i = 0; i < editorMarkColors.length; i++) {
                if(editorMarkColors[i].classList.contains('modal-mark-color__color_selected')) {
                    editorMarkColors[i].classList.remove('modal-mark-color__color_selected');
                    editorCheckMarks[i].classList.add('hidden');
                }
            }
            taskMarkColor = `mark-color-${i + 1}`;
            editorMarkColors[i].classList.add('modal-mark-color__color_selected');
            editorCheckMarks[i].classList.remove('hidden');
        });
    }
}

updateSelectedMarkColors()

const saveMarkColorBtn = document.querySelector('.modal-mark-color__save-btn');

function updateTaskMarkColor(taskId, taskMarkColor) {
    const task = tasksObjArr.find(t => t.number === taskId);
    if (task) {
        task.markColor = taskMarkColor;
    }
    localStorage.setItem('tasks', JSON.stringify(tasksObjArr));
}

saveMarkColorBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task');
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].classList.contains('task_selected')) {
            const taskId = i+1;
            tasks[i].classList.remove(`${tasksObjArr[i].markColor}`);
            tasks[i].classList.add(`${taskMarkColor}`);
            updateTaskMarkColor(taskId, taskMarkColor);
            updateSelectedMarkColors();
        }
    }
    closeEditor()
});

const closeMarkColorsModalBtn1 = document.querySelector('.modal-mark-color__close-btn-1');
closeMarkColorsModalBtn1.addEventListener('click', () => {
    updateSelectedMarkColors()
});

const closeMarkColorsModalBtn2 = document.querySelector('.modal-mark-color__close-btn-2');
closeMarkColorsModalBtn2.addEventListener('click', () => {
    updateSelectedMarkColors()
});

function updateTaskNumbers() {
    for(let i = 0; i < tasksObjArr.length; i++) {
        const taskId = i+1;
        tasksObjArr[i].number = taskId;
        const taskNumbers = document.querySelectorAll('.task__task-number');
        taskNumbers[i].textContent = `${taskId}.`;
    }

    localStorage.setItem('tasks', JSON.stringify(tasksObjArr));
}

const editorDeleteTaskBtn = document.querySelector('.editor__delete-task-btn');
editorDeleteTaskBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task');
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].classList.contains('task_selected')) {
            tasks[i].remove();
            tasksObjArr.splice(tasksObjArr[i], 1);
        }
    } 
    if(tasksObjArr.length === 0) {
        taskListState = false;
        taskContainer.classList.add('justify-content-center');
        taskList.classList.add('main__task-list_empty');
        openDeleteModalBtn.classList.add('hidden');
        buttons.classList.add('justify-content-end');
        buttons.classList.remove('justify-content-between');
        taskList.textContent = 'Список пуст';
    }
    updateTaskNumbers();
    closeEditor();
});

const editorBoldBtn = document.querySelector('.editor__bold-btn');
editorBoldBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task');
    const inputs = document.querySelectorAll('.task__task-input');
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].classList.contains('task_selected')) {
            if(inputs[i].classList.contains('task__task-input_is-bold')) {
                inputs[i].classList.remove('task__task-input_is-bold');
                editorBoldBtn.classList.remove('editor__bold-btn_active');
            } else {
                inputs[i].classList.add('task__task-input_is-bold');
                editorBoldBtn.classList.add('editor__bold-btn_active');
            }
            tasksObjArr[i].isBold === false ? tasksObjArr[i].isBold = true : tasksObjArr[i].isBold = false;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasksObjArr));
});

function updateIsBold() {
    const inputs = document.querySelectorAll('.task__task-input')
    for(let i = 0; i < inputs.length; i++) {
        if(tasksObjArr[i].isBold === true) {
            inputs[i].classList.add('task__task-input_is-bold');
        } else { 
            inputs[i].classList.remove('task__task-input_is-bold');
        }
    }
}

updateIsBold()

function updateBoldBtn() {
    const selectedTasks = document.querySelectorAll('.task_selected');
    if (selectedTasks.length === 1) {
        const firstSelectedTask = selectedTasks[0]; 
        if (firstSelectedTask.querySelector('.task__task-input_is-bold')) { 
            editorBoldBtn.classList.add('editor__bold-btn_active'); 
        } else {
            editorBoldBtn.classList.remove('editor__bold-btn_active'); 
        }
    } else {
        for(let i = 0; i < selectedTasks.length - 1; i++) {
            if(selectedTasks[i].querySelector('.task__task-input').classList.contains('task__task-input_is-bold') && selectedTasks[i+1].querySelector('.task__task-input').classList.contains('task__task-input_is-bold')) {
                editorBoldBtn.classList.add('editor__bold-btn_active');
            } else if(!selectedTasks[i].querySelector('.task__task-input').classList.contains('task__task-input_is-bold') && !selectedTasks[i+1].querySelector('.task__task-input').classList.contains('task__task-input_is-bold')) {
                editorBoldBtn.classList.remove('editor__bold-btn_active'); 
            } else {
                editorBoldBtn.classList.remove('editor__bold-btn_active'); 
                break;
            }
        }
    }
}

const editorCursiveBtn = document.querySelector('.editor__cursive-btn');
editorCursiveBtn.addEventListener('click', () => {
    const tasks = document.querySelectorAll('.task');
    const inputs = document.querySelectorAll('.task__task-input');
    for(let i = 0; i < tasks.length; i++) {
        if(tasks[i].classList.contains('task_selected')) {
            if(inputs[i].classList.contains('task__task-input_is-cursive')) {
                inputs[i].classList.remove('task__task-input_is-cursive');
                editorCursiveBtn.classList.remove('editor__cursive-btn_active');
            } else {
                inputs[i].classList.add('task__task-input_is-cursive');
                editorCursiveBtn.classList.add('editor__cursive-btn_active');
            }
            tasksObjArr[i].isCursive === false ? tasksObjArr[i].isCursive = true : tasksObjArr[i].isCursive = false;
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasksObjArr));
});

function updateIsCursive() {
    const inputs = document.querySelectorAll('.task__task-input');
    for(let i = 0; i < inputs.length; i++) {
        if(tasksObjArr[i].isCursive === true) {
            inputs[i].classList.add('task__task-input_is-cursive');
        } else { 
            inputs[i].classList.remove('task__task-input_is-cursive');
        }
    }
}

updateIsCursive();

function updateCursiveBtn() {
    const selectedTasks = document.querySelectorAll('.task_selected');
    if (selectedTasks.length === 1) {
        const firstSelectedTask = selectedTasks[0]; 
        if (firstSelectedTask.querySelector('.task__task-input_is-cursive')) { 
            editorCursiveBtn.classList.add('editor__cursive-btn_active'); 
        } else {
            editorCursiveBtn.classList.remove('editor__cursive-btn_active'); 
        }
    } else {
        for(let i = 0; i < selectedTasks.length - 1; i++) {
            if(selectedTasks[i].querySelector('.task__task-input').classList.contains('task__task-input_is-cursive') && selectedTasks[i+1].querySelector('.task__task-input').classList.contains('task__task-input_is-cursive')) {
                editorCursiveBtn.classList.add('editor__cursive-btn_active');
            } else if(!selectedTasks[i].querySelector('.task__task-input').classList.contains('task__task-input_is-cursive') && !selectedTasks[i+1].querySelector('.task__task-input').classList.contains('task__task-input_is-cursive')) {
                editorCursiveBtn.classList.remove('editor__cursive-btn_active'); 
            } else {
                editorCursiveBtn.classList.remove('editor__cursive-btn_active'); 
                break;
            }
        }
    }
}

// фикс с aria-hidden у модальных окон
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener('hide.bs.modal', function (event) {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    });
});
