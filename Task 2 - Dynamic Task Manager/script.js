
'use strict';

const STORAGE_KEY = 'taskflow.tasks.v1';
let tasks = [];                      
const view = { filter: 'all', search: '', sort: 'manual' };
let editingId = null, pendingDeleteId = null, dragId = null;

const $ = (id) => document.getElementById(id);
const PRIORITY_RANK = { High: 0, Medium: 1, Low: 2 };
const FILTERS = [['all','All'],['active','Active'],['completed','Completed'],['Work','Work'],['Personal','Personal'],['Study','Study']];
const ICON = {
  edit: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>',
  del: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>'
};

function saveToLocalStorage() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
  catch (e) { showToast('Could not save — browser storage is unavailable.'); }
}
function loadFromLocalStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    // Keep only well-formed task objects
    tasks = Array.isArray(data) ? data.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string') : [];
  } catch (e) { tasks = []; }
}


const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const isOverdue = (t) => !t.completed && t.due && t.due < todayISO();
const formatDate = (iso) => new Date(iso + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
function escapeHTML(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }


function showToast(msg) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = msg;
  $('toasts').appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 2600);
}
function openModal(m) { m.hidden = false; requestAnimationFrame(() => m.classList.add('show')); }
function closeModal(m) { m.classList.remove('show'); setTimeout(() => { m.hidden = true; }, 250); }


function getVisibleTasks() {
  const q = view.search.trim().toLowerCase();
  let list = tasks.filter(t => {
    const f = view.filter;
    const okFilter = f === 'all' || (f === 'active' && !t.completed) || (f === 'completed' && t.completed) || t.category === f;
    const okSearch = !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q);
    return okFilter && okSearch;
  });
  const sorters = {
    newest: (a, b) => b.createdAt - a.createdAt,
    oldest: (a, b) => a.createdAt - b.createdAt,
    due: (a, b) => (a.due || '9999').localeCompare(b.due || '9999'),
    priority: (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]
  };
  if (sorters[view.sort]) list = [...list].sort(sorters[view.sort]);
  return list;
}


function renderStats() {
  const total = tasks.length, done = tasks.filter(t => t.completed).length;
  const pct = total ? Math.round(done / total * 100) : 0;
  $('statTotal').textContent = total;
  $('statDone').textContent = done;
  $('statActive').textContent = total - done;
  $('statOverdue').textContent = tasks.filter(isOverdue).length;
  $('progressText').textContent = pct + '%';
  $('progressFill').style.width = pct + '%';
  $('progressBar').setAttribute('aria-valuenow', pct);
  $('motivation').textContent = !total ? 'Add your first task to get started.'
    : pct === 100 ? 'Everything is done. Enjoy the win!'
    : `${done} of ${total} tasks done — keep going.`;
}

function taskHTML(t) {
  const overdue = isOverdue(t);
  return `<li class="task ${t.priority} ${t.completed ? 'done' : ''}" data-id="${t.id}" draggable="${view.sort === 'manual'}">
    <input type="checkbox" class="check" ${t.completed ? 'checked' : ''} aria-label="Mark “${escapeHTML(t.title)}” as ${t.completed ? 'active' : 'complete'}">
    <div>
      <div class="t-title">${escapeHTML(t.title)}</div>
      ${t.description ? `<p class="t-desc">${escapeHTML(t.description)}</p>` : ''}
      <div class="meta">
        <span class="badge cat-${t.category}">${t.category}</span>
        <span class="badge pri-${t.priority}">${t.priority} priority</span>
        ${t.due ? `<span class="due ${overdue ? 'overdue' : ''}">${overdue ? 'Overdue · ' : 'Due '}${formatDate(t.due)}</span>` : ''}
      </div>
    </div>
    <div class="row-actions">
      <button class="icon-btn" data-action="edit" aria-label="Edit task">${ICON.edit}</button>
      <button class="icon-btn del" data-action="delete" aria-label="Delete task">${ICON.del}</button>
    </div>
  </li>`;
}

function render() {
  const list = getVisibleTasks();
  $('taskList').innerHTML = list.map(taskHTML).join('');
  const empty = $('empty');
  empty.hidden = list.length > 0;
  if (!list.length) {
    const none = tasks.length === 0;
    $('emptyTitle').textContent = none ? 'No tasks yet' : 'No matching tasks';
    $('emptyText').textContent = none ? 'Add a task above to start your list.' : 'Try a different filter or search term.';
  }
  document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', c.dataset.filter === view.filter));
  renderStats();
}

function commit(toast) { saveToLocalStorage(); render(); if (toast) showToast(toast); }

function readForm(prefix) {
  const g = (n) => $(prefix + n).value;
  return { title: g(prefix ? 'Title' : 'title').trim(), description: g(prefix ? 'Desc' : 'desc').trim(),
    category: g(prefix ? 'Category' : 'category'), due: g(prefix ? 'Due' : 'due'), priority: g(prefix ? 'Priority' : 'priority') };
}
function addTask(e) {
  e.preventDefault();
  const data = readForm('');
  if (!data.title) { $('titleError').textContent = 'Please enter a task title.'; $('title').focus(); return; }
  $('titleError').textContent = '';
  tasks.unshift({ id: newId(), ...data, completed: false, createdAt: Date.now() });
  $('taskForm').reset(); $('priority').value = 'Medium';
  commit('Task added');
}
function toggleTask(id) {
  const t = tasks.find(x => x.id === id); if (!t) return;
  t.completed = !t.completed;
  commit(t.completed ? 'Task completed' : 'Task marked active');
}
function openEdit(id) {
  const t = tasks.find(x => x.id === id); if (!t) return;
  editingId = id;
  $('eTitle').value = t.title; $('eDesc').value = t.description || ''; $('eCategory').value = t.category;
  $('eDue').value = t.due || ''; $('ePriority').value = t.priority; $('eError').textContent = '';
  openModal($('editModal')); $('eTitle').focus();
}
function saveEdit(e) {
  e.preventDefault();
  const data = readForm('e');
  if (!data.title) { $('eError').textContent = 'Please enter a task title.'; return; }
  Object.assign(tasks.find(x => x.id === editingId), data);
  closeModal($('editModal')); commit('Task updated');
}
function askDelete(id) {
  const t = tasks.find(x => x.id === id); if (!t) return;
  pendingDeleteId = id;
  $('confirmTitle').textContent = 'Delete task?';
  $('confirmText').textContent = `“${t.title}” will be removed permanently.`;
  openModal($('confirmModal'));
}
function confirmAction() {
  if (pendingDeleteId === 'completed') {
    const n = tasks.filter(t => t.completed).length;
    tasks = tasks.filter(t => !t.completed); commit(`${n} completed task${n > 1 ? 's' : ''} cleared`);
  } else {
    const el = document.querySelector(`[data-id="${pendingDeleteId}"]`);
    const id = pendingDeleteId;
    if (el) el.classList.add('removing');
    setTimeout(() => { tasks = tasks.filter(t => t.id !== id); commit('Task deleted'); }, el ? 280 : 0);
  }
  pendingDeleteId = null; closeModal($('confirmModal'));
}
function askClearCompleted() {
  const n = tasks.filter(t => t.completed).length;
  if (!n) { showToast('No completed tasks to clear'); return; }
  pendingDeleteId = 'completed';
  $('confirmTitle').textContent = 'Clear completed tasks?';
  $('confirmText').textContent = `${n} completed task${n > 1 ? 's' : ''} will be removed permanently.`;
  openModal($('confirmModal'));
}

/* ---------- Drag and drop (manual order) ---------- */
function moveTask(fromId, toId) {
  const from = tasks.findIndex(t => t.id === fromId), to = tasks.findIndex(t => t.id === toId);
  if (from < 0 || to < 0 || from === to) return;
  tasks.splice(to, 0, tasks.splice(from, 1)[0]);
  commit();
}

/* ---------- Events ---------- */
function init() {
  $('today').textContent = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  $('filters').innerHTML = FILTERS.map(([v, l]) => `<button type="button" class="chip" data-filter="${v}" aria-pressed="false">${l}</button>`).join('');
  loadFromLocalStorage();

  $('taskForm').addEventListener('submit', addTask);
  $('editForm').addEventListener('submit', saveEdit);
  $('confirmOk').addEventListener('click', confirmAction);
  $('clearDone').addEventListener('click', askClearCompleted);
  $('filters').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) { view.filter = c.dataset.filter; render(); } });
  $('search').addEventListener('input', e => { view.search = e.target.value; render(); });
  $('sort').addEventListener('change', e => { view.sort = e.target.value; render(); });

  const list = $('taskList');
  list.addEventListener('change', e => { if (e.target.classList.contains('check')) toggleTask(e.target.closest('.task').dataset.id); });
  list.addEventListener('click', e => {
    const b = e.target.closest('[data-action]'); if (!b) return;
    const id = b.closest('.task').dataset.id;
    b.dataset.action === 'edit' ? openEdit(id) : askDelete(id);
  });
  list.addEventListener('dragstart', e => { const li = e.target.closest('.task'); if (!li) return; dragId = li.dataset.id; li.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId); });
  list.addEventListener('dragover', e => { const li = e.target.closest('.task'); if (!dragId || !li) return; e.preventDefault(); list.querySelectorAll('.over').forEach(x => x.classList.remove('over')); li.classList.add('over'); });
  list.addEventListener('drop', e => { const li = e.target.closest('.task'); if (!dragId || !li) return; e.preventDefault(); moveTask(dragId, li.dataset.id); });
  list.addEventListener('dragend', () => { dragId = null; list.querySelectorAll('.dragging,.over').forEach(x => x.classList.remove('dragging', 'over')); });

  // Close modals: cancel buttons, backdrop click, Escape
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m || e.target.hasAttribute('data-close')) closeModal(m); });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal:not([hidden])').forEach(closeModal); });

  render();
}
init();
