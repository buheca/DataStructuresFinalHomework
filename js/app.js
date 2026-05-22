let graph, selectedMovieId;

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

function renderGenreFilters() {
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

function renderMovieGrid(filter = 'All') {
  const grid = document.getElementById('movieGrid');
  const movies = MOVIES_DATA.filter(m => filter === 'All' || m.genres.includes(filter));

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

function selectMovie(id) {
  selectedMovieId = id;
  const movie = graph.getNode(id);

  document.querySelectorAll('.movie-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === id);
  });

  // Render selected movie panel
  document.getElementById('selectedMoviePanel').innerHTML = `
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

  // Run BFS immediately and show results
  const bfs = new BFSTraversal(graph, id, 3);
  const recommendations = computeRecommendations(graph, id, bfs.getVisitedMap());
  renderRecommendations(recommendations);
}

function renderRecommendations(recs) {
  const container = document.getElementById('recommendationsList');
  if (recs.length === 0) {
    container.innerHTML = `<div class="recs-empty">No recommendations found</div>`;
    return;
  }

  container.innerHTML = recs.slice(0, 8).map((r, i) => `
    <div class="rec-item" style="--i:${i}">
      <div class="rec-rank">${i + 1}</div>
      <div class="rec-info">
        <div class="rec-title">${r.movie.title}</div>
        <div class="rec-meta">${r.movie.year} · ${r.movie.director}</div>
        <div class="rec-genres">
          ${r.sharedGenres.map(g => genreTag(g, true)).join('')}
          ${r.movie.genres.filter(g => !r.sharedGenres.includes(g)).map(g => genreTag(g)).join('')}
        </div>
      </div>
      <div class="rec-score-col">
        <div class="rec-score">${r.score}</div>
        <div class="rec-depth">depth ${r.depth}</div>
        <div class="rec-rating">${r.movie.rating.toFixed(1)}</div>
      </div>
    </div>
  `).join('');
}

function init() {
  initGraph();
  renderGenreFilters();
  renderMovieGrid();
}

document.addEventListener('DOMContentLoaded', init);
