(function() {
  const container = document.getElementById('malla-container');

  let completed = new Set(JSON.parse(localStorage.getItem('completedCourses') || '[]'));

  const courseDivMap = new Map();  // nombre + índice -> div
  const courseDataMap = new Map(); // nombre + índice -> { requisitos }

  function buildMalla() {
    let idCounter = 0;

    malla.forEach(sem => {
      const semDiv = document.createElement('div');
      semDiv.className = 'semestre';

      const header = document.createElement('h2');
      header.textContent = sem.semestre;
      semDiv.appendChild(header);

      sem.ramos.forEach(r => {
        const div = document.createElement('div');
        div.className = 'ramo';
        div.textContent = r.nombre;

        const id = `${r.nombre}__${idCounter++}`;
        div.dataset.courseId = id;

        semDiv.appendChild(div);

        courseDivMap.set(id, div);
        courseDataMap.set(id, r);

        div.addEventListener('click', () => toggleCourse(id));
      });

      container.appendChild(semDiv);
    });
  }

  function isUnlocked(courseId) {
    const { requisitos } = courseDataMap.get(courseId);
    return requisitos.every(req =>
      [...completed].some(c => c.startsWith(req + '__'))
    );
  }

  function updateUI() {
    courseDivMap.forEach((div, id) => {
      div.classList.remove('blocked', 'unlocked', 'completed');

      if (completed.has(id)) {
        div.classList.add('completed');
      } else if (isUnlocked(id)) {
        div.classList.add('unlocked');
      } else {
        div.classList.add('blocked');
      }
    });
  }

  function toggleCourse(id) {
    if (!isUnlocked(id) && !completed.has(id)) return;
    if (completed.has(id)) {
      completed.delete(id);
    } else {
      completed.add(id);
    }

    localStorage.setItem('completedCourses', JSON.stringify([...completed]));
    updateUI();
  }

  buildMalla();
  updateUI();
})();
