let graph, graphCanvas, bfsTraversal, currentStepIndex, autoTimer, selectedMovieId;
let allRecommendations = [];

const GENRE_COLORS = {
  'Sci-Fi':    { bg: '#E1F3FE', text: '#1F6C9F' },
  'Action':    { bg: '#E1F3FE', text: '#1F6C9F' },
  'Crime':     { bg: '#FDEBEC', text: '#9F2F2D' },
  'Thriller':  { bg: '#FDEBEC', text: '#9F2F2D' },
  'Horror':    { bg: '#F3EAFE', text: '#5D2D8F' },
  'Drama':     { bg: '#FBF3DB', text: '#956400' },
  'Romance':   { bg: '#FBF3DB', text: '#956400' },
  'Music':     { bg: '#FBF3DB', text: '#956400' },
  'Animation': { bg: '#EDF3EC', text: '#346538' },
  'Adventure': { bg: '#EDF3EC', text: '#346538' },
  'Fantasy':   { bg: '#EDF3EC', text: '#346538' },
  'Comedy':    { bg: '#EDF3EC', text: '#346538' },
  'Mystery':   { bg: '#F3EAFE', text: '#5D2D8F' },
  'War':       { bg: '#F0F0EE', text: '#444444' },
};

function genreTag(genre, highlight = false) {
  const c = GENRE_COLORS[genre] || { bg: '#F0F0EE', text: '#555' };
  const border = highlight ? `outline: 2px solid ${c.text}33;` : '';
  return `<span class="genre-tag" style="background:${c.bg};color:${c.text};${border}">${genre}</span>`;
}

function ratingBar(rating) {
  const pct = ((rating - 5) / 5) * 100;
  return `
    <div class="rating-bar-wrap">
      <span class="rating-value">${rating.toFixed(1)}</span>
      <div class="rating-bar">
        <div class="rating-bar-fill" style="width:${pct}%"></div>
      </div>
      <span class="rating-label">/ 10</span>
    </div>`;
}

function initGraph() {
  graph = new Graph();
  for (const movie of MOVIES_DATA) graph.addNode(movie.id, movie);
  for (const [a, b] of GRAPH_EDGES) graph.addEdge(a, b);
}

function renderMovieGrid(filter = 'All') {
  const grid = document.getElementById('movieGrid');
  const movies = MOVIES_DATA.filter(m =>
    filter === 'All' || m.genres.includes(filter)
  );

  grid.innerHTML = movies.map(m => `
    <div class="movie-card ${selectedMovieId === m.id ? 'selected' : ''}"
         data-id="${m.id}"
         style="--i:${MOVIES_DATA.indexOf(m)}">
      <div class="movie-card-inner">
        <div class="movie-card-rating">${m.rating.toFixed(1)}</div>
        <div class="movie-card-title">${m.title}</div>
        <div class="movie-card-meta">${m.year} · ${m.director.split(' ').pop()}</div>
        <div class="movie-card-genres">${m.genres.slice(0, 2).map(g => genreTag(g)).join('')}</div>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => selectMovie(card.dataset.id));
  });
}

function renderGenreFilters() {
  const genres = ['All', ...new Set(MOVIES_DATA.flatMap(m => m.genres))].sort();
  genres.splice(genres.indexOf('All'), 1);
  const ordered = ['All', 'Sci-Fi', 'Crime', 'Drama', 'Thriller', 'Action', 'Animation', 'Horror', 'Romance', 'Comedy', 'War'];
  const filters = document.getElementById('genreFilters');
  filters.innerHTML = ordered.map(g => `
    <button class="genre-filter ${g === 'All' ? 'active' : ''}" data-genre="${g}">${g}</button>
  `).join('');

  filters.querySelectorAll('.genre-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      filters.querySelectorAll('.genre-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMovieGrid(btn.dataset.genre);
    });
  });
}

function selectMovie(id) {
  selectedMovieId = id;
  stopAuto();

  const movie = graph.getNode(id);

  // Update movie grid selection highlight
  document.querySelectorAll('.movie-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === id);
  });

  // Render selected movie panel
  const panel = document.getElementById('selectedMoviePanel');
  panel.innerHTML = `
    <div class="selected-movie-card">
      <div class="selected-movie-header">
        <div>
          <h2 class="selected-title">${movie.title}</h2>
          <div class="selected-meta">${movie.year} &nbsp;·&nbsp; ${movie.director}</div>
        </div>
        ${ratingBar(movie.rating)}
      </div>
      <p class="selected-desc">${movie.description}</p>
      <div class="selected-genres">${movie.genres.map(g => genreTag(g)).join('')}</div>
    </div>
  `;

  // Enable controls
  document.getElementById('btnStep').disabled = false;
  document.getElementById('btnAuto').disabled = false;

  // Run BFS
  bfsTraversal = new BFSTraversal(graph, id, 3);
  currentStepIndex = 0;
  graphCanvas.reset(id);

  const visitedMap = bfsTraversal.getVisitedMap();
  allRecommendations = computeRecommendations(graph, id, visitedMap);

  updateBFSControls();
  renderRecommendations([]);

  // Scroll to graph section on mobile
  document.getElementById('graphSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderRecommendations(recs) {
  const container = document.getElementById('recommendationsList');
  if (recs.length === 0) {
    container.innerHTML = `<div class="recs-empty">Run BFS to discover recommendations</div>`;
    return;
  }

  container.innerHTML = recs.slice(0, 8).map((r, i) => `
    <div class="rec-item" style="--i:${i}">
      <div class="rec-rank">${i + 1}</div>
      <div class="rec-info">
        <div class="rec-title">${r.movie.title}</div>
        <div class="rec-meta">${r.movie.year} · ${r.movie.director}</div>
        <div class="rec-genres">${r.sharedGenres.map(g => genreTag(g, true)).join('')}${
          r.movie.genres.filter(g => !r.sharedGenres.includes(g)).map(g => genreTag(g)).join('')
        }</div>
      </div>
      <div class="rec-score-col">
        <div class="rec-score">${r.score}</div>
        <div class="rec-depth">depth ${r.depth}</div>
        <div class="rec-rating">${r.movie.rating.toFixed(1)}</div>
      </div>
    </div>
  `).join('');
}

function stepBFS() {
  if (!bfsTraversal) return;
  const steps = bfsTraversal.getSteps();
  if (currentStepIndex >= steps.length) {
    finalizeBFS();
    return;
  }
  graphCanvas.applyStep(steps[currentStepIndex]);
  currentStepIndex++;
  updateBFSControls();

  if (currentStepIndex >= steps.length) finalizeBFS();
}

function finalizeBFS() {
  graphCanvas.applyRecommendations(allRecommendations);
  renderRecommendations(allRecommendations);
  updateBFSControls();
}

function startAuto() {
  if (autoTimer) return;
  const speed = parseInt(document.getElementById('speedRange').value);
  document.getElementById('btnAuto').textContent = 'Pause';
  document.getElementById('btnAuto').classList.add('active');
  autoTimer = setInterval(() => {
    const steps = bfsTraversal ? bfsTraversal.getSteps() : [];
    if (currentStepIndex >= steps.length) {
      finalizeBFS();
      stopAuto();
    } else {
      stepBFS();
    }
  }, speed);
}

function stopAuto() {
  clearInterval(autoTimer);
  autoTimer = null;
  const btn = document.getElementById('btnAuto');
  if (btn) {
    btn.textContent = 'Auto Play';
    btn.classList.remove('active');
  }
}

function resetBFS() {
  stopAuto();
  if (!selectedMovieId) return;
  currentStepIndex = 0;
  graphCanvas.reset(selectedMovieId);
  renderRecommendations([]);
  updateBFSControls();
}

function updateBFSControls() {
  if (!bfsTraversal) return;
  const steps = bfsTraversal.getSteps();
  const counter = document.getElementById('stepCounter');
  const btnStep = document.getElementById('btnStep');
  const done = currentStepIndex >= steps.length;

  counter.textContent = done
    ? `Complete (${steps.length} steps)`
    : `Step ${currentStepIndex} / ${steps.length}`;

  btnStep.disabled = done;
  btnStep.textContent = done ? 'Done' : 'Step Forward';
}

function updateGraphStats() {
  document.getElementById('statNodes').textContent = graph.getNodeCount();
  document.getElementById('statEdges').textContent = graph.getEdgeCount();
}

function init() {
  initGraph();

  const canvasEl = document.getElementById('graphCanvas');
  graphCanvas = new GraphCanvas(canvasEl, graph);
  graphCanvas.onNodeClick = id => selectMovie(id);
  graphCanvas.draw();

  renderGenreFilters();
  renderMovieGrid();
  updateGraphStats();

  const btnStep = document.getElementById('btnStep');
  const btnAuto = document.getElementById('btnAuto');
  btnStep.addEventListener('click', stepBFS);
  btnAuto.addEventListener('click', () => {
    if (autoTimer) stopAuto();
    else startAuto();
  });
  document.getElementById('btnReset').addEventListener('click', resetBFS);
  document.getElementById('speedRange').addEventListener('input', () => {
    if (autoTimer) { stopAuto(); startAuto(); }
  });
}

document.addEventListener('DOMContentLoaded', init);
