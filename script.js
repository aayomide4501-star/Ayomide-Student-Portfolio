// COS 106 - script.js
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn) menuBtn.addEventListener('click', () => navLinks.classList.toggle('show'));

// --- Academic Planner ---
let tasks = JSON.parse(localStorage.getItem('cos106_tasks') || '[]');
let filter = 'all';
function saveTasks(){ localStorage.setItem('cos106_tasks', JSON.stringify(tasks)); }
function renderTasks(){
  const list = document.getElementById('taskList'); if(!list) return;
  list.innerHTML = '';
  const shown = tasks.filter(t => filter==='all' ? true : filter==='active' ? !t.done : t.done);
  shown.forEach(t => {
    const idx = tasks.indexOf(t);
    const li = document.createElement('li'); li.className = 'task' + (t.done ? ' done' : '');
    li.innerHTML = `<span><input type="checkbox" ${t.done?'checked':''} onchange="toggleTask(${idx})"> ${t.text} ${t.date ? '('+t.date+')' : ''} ${t.priority ? '• '+t.priority : ''}</span><button class="btn small" onclick="deleteTask(${idx})">Delete</button>`;
    list.appendChild(li);
  });
  document.getElementById('taskCount').textContent = `Total: ${tasks.length} | Completed: ${tasks.filter(t=>t.done).length} | Remaining: ${tasks.filter(t=>!t.done).length}`;
  saveTasks();
}
function toggleTask(i){ tasks[i].done = !tasks[i].done; renderTasks(); }
function deleteTask(i){ tasks.splice(i,1); renderTasks(); }
const taskForm = document.getElementById('taskForm');
if (taskForm){
  taskForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = document.getElementById('taskInput').value.trim();
    const date = document.getElementById('taskDate').value;
    const priority = document.getElementById('taskPriority').value;
    if(!text) return;
    tasks.push({text, date, priority, done:false});
    taskForm.reset(); renderTasks();
  });
  document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); filter = b.dataset.filter; renderTasks();
  }));
  renderTasks();
}

// --- Contact Validation ---
const contactForm = document.getElementById('contactForm');
if (contactForm){
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const msg = document.getElementById('message').value.trim();
    let ok = true;
    const set = (id, valid, text) => { document.getElementById(id).textContent = valid ? '' : text; if(!valid) ok=false; };
    set('nameError', !!name, 'Name is required');
    set('emailError', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email e.g. you@gmail.com');
    set('phoneError', /^\+?\d{7,15}$/.test(phone), 'Phone must contain only digits (7-15 digits)');
    set('messageError', !!msg, 'Message is required');
    if(ok){ document.getElementById('successMsg').textContent = 'Thank you! Your message has been sent successfully.'; contactForm.reset(); }
    else document.getElementById('successMsg').textContent = '';
  });
}
