// Classe pour créer des tâches
class Task {
    constructor(text, priority)
    {
        this.id = Task.getId();
        this.text = text;
        this.priority = priority;
        // Etat de la tâche (false = non effectuée)
        this.state = false;
    }

    /**
     * Permet de récupérer l'id du dernier élément dans le local storage afin
     * de garder une unicité
     */
    static getId()
    {
        if(this.compteur === undefined)
        {
            // On vérifie si l'item tasks existe dans le local storage
            if(localStorage.getItem('tasks') === null || JSON.parse(localStorage.getItem('tasks')).length === 0)
            {
                this.compteur = 0;
            }
            else
            {
                let tasks = JSON.parse(localStorage.getItem('tasks'));
                this.compteur = tasks[tasks.length - 1].id;
            }
        }
    	return ++this.compteur;
    }
}

/**
 * Fonctions en rapport avec l'affichage des tâches sur la page
 */

 // Affichage des tâches
function displayTasks() {
    let tasks = getTasksStorage();

    tasks.forEach(task => addTask(task));
}

// Ajout d'une tâche
function addTask(task) {
    let tasksList = document.querySelector('#tasks-list');
    
    let taskElement = document.createElement('tr');

    // On vérifie si la tâche est effectuée
    if(task.state === true)
    {
        taskElement.classList.add('task-validated-row');
    }
    
    // Ajout du code HTML dans l'élement avec un template strings 
    taskElement.innerHTML = `
        <td class="text-center"><a href="#"><i class="fas fa-check ${task.state === false ? 'action-validate' : 'action-validate-done'}"></i></a></td>
        <td ${task.state === false ? '' : 'class="task-validated"'}>${task.text}<span class="id d-none">${task.id}</span></td>
        <td>${task.priority === 'Haute' ? '<span class="badge badge-fullwidth high-priority">Haute</span>' : task.priority === 'Moyenne' ? '<span class="badge badge-fullwidth average-priority">Moyenne</span>' : '<span class="badge badge-fullwidth low-priority">Basse</span>'}</td>
        <td class="text-center"><a href="#"><i class="fas fa-trash-alt action-delete"></i></a></td>
    `;

    tasksList.appendChild(taskElement);
}

// Suppression d'une tâche
function removeTask(element) {
    // On supprime l'élément <tr> du tableau
    element.parentElement.parentElement.parentElement.remove();
}

// Validation d'une tâche
function validateTask(element) {
    element.classList.remove('action-validate');
    element.classList.add('action-validate-done');
    element.parentElement.parentElement.parentElement.children[1].classList.add('task-validated');
    element.parentElement.parentElement.parentElement.classList.add('task-validated-row');
}

// Invalidation d'une tâche
function unvalidateTask(element) {
    element.classList.add('action-validate');
    element.classList.remove('action-validate-done');
    element.parentElement.parentElement.parentElement.children[1].classList.remove('task-validated');
    element.parentElement.parentElement.parentElement.classList.remove('task-validated-row');
}

// Affichage d'un message de succès ou d'erreur
function showAlert(message, type) {
    if(type == 'success' || 'error')
    {
        let alert = document.createElement('div');
        alert.classList = `alert ${type === 'success' ? 'alert-success' : 'alert-danger'}`;
        alert.appendChild(document.createTextNode(message));
        document.querySelector('#tasks-form').insertAdjacentElement('beforebegin', alert);

        setTimeout(() => alert.remove(), 3000);
    }
}

/**
 * Fonctions en rapport avec le stockage des tâches dans le local
 */

 // Récupération des tâches présentes dans le local storage
function getTasksStorage() {
    let tasks;

    if(localStorage.getItem('tasks') === null)
    {
        tasks = [];
    }
    else
    {
        tasks = JSON.parse(localStorage.getItem('tasks'));
    }
		
    return tasks;
}

 // Ajout d'une tâche dans le local storage
function addTaskStorage(task) {
    let tasks = getTasksStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

 // Suppresssion d'une tâche dans le local storage
function removeTaskStorage(id) {
    let tasks = getTasksStorage();

    tasks.forEach((task, index) => {
        if(task.id == id)
        {
            tasks.splice(index, 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });
}

 // Validation d'une tâche dans le local storage
function validateTaskStorage(id) {
    let tasks = getTasksStorage();

    tasks.forEach((task, index) => {
        if(task.id == id)
        {
            task.state = true;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });
}

 // Invalidation d'une tâche dans le local storage
function unvalidateTaskStorage(id) {
    let tasks = getTasksStorage();

    tasks.forEach((task, index) => {
        if(task.id == id)
        {
            task.state = false;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    });
}

// Evénement pour l'affichage des tâches au chargement de la page
document.addEventListener('DOMContentLoaded', displayTasks);

// Evénement pour l'ajout d'une tâche
document.querySelector('#tasks-form').addEventListener('submit', event => {
    // Annulation de l'action par défaut
    event.preventDefault();
    
    let taskText = document.getElementById('task-text').value;
    let taskPriority = document.getElementById('task-priority').value;

    if(taskText === '' || taskPriority === '') {
        showAlert('Un ou plusieurs champs sont vides', 'error');
    } 
    else 
    {
        // Instanciation d'un objet Task
        let task = new Task(taskText, taskPriority);

        // Ajout de la tâche sur la page
        addTask(task);

        // Ajout de la tâche dans le local storage
        addTaskStorage(task);

        showAlert('La tâche a été ajoutée', 'success');

        // Nettoyage du champ de description de la tâche
        document.getElementById('task-text').value = '';
    }
});

// Evénement concernant la liste des tâches
document.querySelector('#tasks-list').addEventListener('click', event => {
    event.preventDefault();

    // Action pour la suppression d'une tâche
    if(event.target.classList.contains('action-delete'))
    {
        // Suppression de la tâche sur la page
        removeTask(event.target);

        // Suppression de la tâche dans le local storage
        removeTaskStorage(event.target.parentElement.parentElement.parentElement.querySelector('.id').textContent);
    } 
    // Action pour la validation d'une tâche
    else if(event.target.classList.contains('action-validate'))
    {
        // Validation de la tâche sur la page
        validateTask(event.target);

        // Validation de la tâche dans le local storage
        validateTaskStorage(event.target.parentElement.parentElement.parentElement.querySelector('.id').textContent);
    }
    // Action pour l'invalidation d'une tâche
    else if(event.target.classList.contains('action-validate-done'))
    {
        // Invalidation de la tâche sur la page
        unvalidateTask(event.target);

        // Invalidation de la tâche dans le local storage
        unvalidateTaskStorage(event.target.parentElement.parentElement.parentElement.querySelector('.id').textContent);
    }
});