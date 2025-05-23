const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
window.addEventListener('load', () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  savedTasks.forEach(task => addTask(task.text, task.completed));
});

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  taskList.querySelectorAll('li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText !== '') {
    addTask(taskText, false);
    input.value = '';
    saveTasks();
  }
});

function addTask(taskText, completed = false) {
  const li = document.createElement('li');

  // Create checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  checkbox.classList.add('task-checkbox');

  // Create span for text
  const span = document.createElement('span');
  span.textContent = taskText;

  // Add 'completed' class if already completed
  if (completed) {
    li.classList.add('completed');
  }

  // Checkbox change handler
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      li.classList.add('completed', 'vanishing');
      li.addEventListener('animationend', () => {
        li.classList.remove('vanishing'); // Clean up animation class
        saveTasks(); // Save after animation ends
      }, { once: true });
    } else {
      li.classList.remove('completed');
      saveTasks();
    }
  });

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      li.remove();
      saveTasks();
    });
  };

  // Append elements
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}
document.getElementById('show-completed').addEventListener('click', () => {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const completedTasks = savedTasks.filter(task => task.completed);

  if (completedTasks.length === 0) {
    alert('No completed tasks found.');
    return;
  }

  const completedList = completedTasks.map(task => `✅ ${task.text}`).join('\n');
  alert('Completed Tasks:\n\n' + completedList);
});
const dailySuggestions = [
  "Drink 2L of water",
  "Read for 30 minutes",
  "Take a 10-minute walk",
  "Plan tomorrow's tasks",
  "Write a journal entry"
];

document.getElementById('daily-suggestions').addEventListener('click', () => {
  const suggestion = prompt(
    "Choose a task to add:\n" +
    dailySuggestions.map((task, i) => `${i + 1}. ${task}`).join('\n') +
    "\n\nEnter task number:"
  );

  const index = parseInt(suggestion) - 1;
  if (index >= 0 && index < dailySuggestions.length) {
    addTask(dailySuggestions[index], false);
    saveTasks();
  } else {
    alert("Invalid selection.");
  }
});
document.getElementById('add-custom-task-btn').addEventListener('click', () => {
  const input = document.getElementById('custom-task-bar-input');
  const task = input.value.trim();
  if (task) {
    addTask(task, false);
    saveTasks();
    input.value = ''; // Clear the input
  }
});
