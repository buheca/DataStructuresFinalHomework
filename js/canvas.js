const NODE_COLORS = {
  default:     { fill: '#EAF2F8', stroke: '#B8D4E8', text: '#4A6070' },
  source:      { fill: '#4A7FA5', stroke: '#2C5F82', text: '#FFFFFF' },
  queued:      { fill: '#FFF3CD', stroke: '#C9A227', text: '#6B5000' },
  visited:     { fill: '#A8CCE8', stroke: '#5A9EC0', text: '#1A3A50' },
  recommended: [
    { fill: '#2C5F82', stroke: '#1A3F5C', text: '#FFFFFF' },
    { fill: '#3D6F95', stroke: '#2C5F82', text: '#FFFFFF' },
    { fill: '#4A7FA5', stroke: '#3D6F95', text: '#FFFFFF' },
    { fill: '#6A97B8', stroke: '#4A7FA5', text: '#FFFFFF' },
    { fill: '#8AB0CB', stroke: '#6A97B8', text: '#1A3A50' }
  ]
};

const EDGE_COLORS = {
  default: '#DCDCDA',
  active:  '#4A7FA5'
};

const NODE_RADIUS = 13;

class GraphCanvas {
  constructor(canvasEl, graph) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.graph = graph;

    this.nodeStates = new HashMap();
    this.activeEdges = new Set();
    this.recommendedIds = [];
    this.sourceId = null;

    this._hoveredNode = null;
    this._tooltip = { visible: false, x: 0, y: 0, text: '' };

    this._initStates();
    this._bindEvents();
    this._setupResize();
  }

  _initStates() {
    for (const movie of this.graph.getAllNodes()) {
      this.nodeStates.set(movie.id, 'default');
    }
  }

  _setupResize() {
    const ro = new ResizeObserver(() => {
      this._syncSize();
      this.draw();
    });
    ro.observe(this.canvas.parentElement);
    this._syncSize();
  }

  _syncSize() {
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth;
    this.canvas.height = parent.clientHeight;
  }

  _getXY(id) {
    const pos = this.graph.getNode(id).canvasPos;
    return {
      x: pos.x * this.canvas.width,
      y: pos.y * this.canvas.height
    };
  }

  _nodeAt(mx, my) {
    for (const movie of this.graph.getAllNodes()) {
      const { x, y } = this._getXY(movie.id);
      const dx = mx - x, dy = my - y;
      if (Math.sqrt(dx * dx + dy * dy) <= NODE_RADIUS + 4) return movie.id;
    }
    return null;
  }

  _bindEvents() {
    this.canvas.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = this._nodeAt(mx, my);
      this._hoveredNode = hit;
      if (hit) {
        const movie = this.graph.getNode(hit);
        this._tooltip = { visible: true, x: mx + 12, y: my - 8, text: movie.title };
        this.canvas.style.cursor = 'pointer';
      } else {
        this._tooltip = { visible: false };
        this.canvas.style.cursor = 'default';
      }
      this.draw();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this._hoveredNode = null;
      this._tooltip = { visible: false };
      this.canvas.style.cursor = 'default';
      this.draw();
    });

    this.canvas.addEventListener('click', e => {
      const rect = this.canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      const hit = this._nodeAt(mx, my);
      if (hit && this.onNodeClick) this.onNodeClick(hit);
    });
  }

  reset(sourceId) {
    this.sourceId = sourceId;
    this.activeEdges.clear();
    this.recommendedIds = [];
    for (const id of this.nodeStates.keys()) {
      this.nodeStates.set(id, id === sourceId ? 'source' : 'default');
    }
    this.draw();
  }

  applyStep(step) {
    this.nodeStates.set(step.node, 'visited');
    this.activeEdges.add(step.edgeKey);
    this.draw();
  }

  applyRecommendations(recommendations) {
    this.recommendedIds = recommendations.slice(0, 5).map(r => r.movie.id);
    for (let i = 0; i < this.recommendedIds.length; i++) {
      this.nodeStates.set(this.recommendedIds[i], 'recommended_' + i);
    }
    this.draw();
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this._drawEdges();
    this._drawNodes();
    if (this._tooltip.visible) this._drawTooltip();
  }

  _drawEdges() {
    const { ctx } = this;
    for (const [id1, id2] of this.graph.getAllEdges()) {
      const p1 = this._getXY(id1);
      const p2 = this._getXY(id2);
      const key = [id1, id2].sort().join('|');
      const isActive = this.activeEdges.has(key);

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = isActive ? EDGE_COLORS.active : EDGE_COLORS.default;
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.globalAlpha = isActive ? 0.8 : 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  _drawNodes() {
    for (const movie of this.graph.getAllNodes()) {
      const { x, y } = this._getXY(movie.id);
      const state = this.nodeStates.get(movie.id);
      const isHovered = this._hoveredNode === movie.id;

      let colors;
      if (state && state.startsWith('recommended_')) {
        const rank = parseInt(state.split('_')[1]);
        colors = NODE_COLORS.recommended[rank] || NODE_COLORS.recommended[4];
      } else {
        colors = NODE_COLORS[state] || NODE_COLORS.default;
      }

      const r = isHovered ? NODE_RADIUS + 3 : NODE_RADIUS;

      // Shadow on active nodes
      if (state !== 'default') {
        this.ctx.save();
        this.ctx.shadowColor = colors.stroke;
        this.ctx.shadowBlur = isHovered ? 12 : 6;
      }

      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.fillStyle = colors.fill;
      this.ctx.fill();
      this.ctx.strokeStyle = colors.stroke;
      this.ctx.lineWidth = state === 'source' || state.startsWith('recommended_') ? 2.5 : 1.5;
      this.ctx.stroke();

      if (state !== 'default') this.ctx.restore();

      // Label
      this.ctx.fillStyle = colors.text;
      this.ctx.font = `${isHovered ? 9 : 8}px -apple-system, "Helvetica Neue", sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText(movie.shortTitle, x, y + r + 3);
    }
  }

  _drawTooltip() {
    const { ctx } = this;
    const { x, y, text } = this._tooltip;
    const padding = 8;
    ctx.font = '12px -apple-system, "Helvetica Neue", sans-serif';
    const w = ctx.measureText(text).width + padding * 2;
    const h = 26;

    let tx = Math.min(x, this.canvas.width - w - 4);
    let ty = Math.max(y - h, 4);

    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.roundRect(tx, ty, w, h, 4);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, tx + padding, ty + h / 2);
  }
}
