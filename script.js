const size = 4;
let grid = [];
let score = 0;

const gridEl = document.getElementById('grid');
const tilesEl = document.getElementById('tiles');
const scoreEl = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

function init() {
  grid = Array(size).fill().map(_ => Array(size).fill(0));
  score = 0;
  spawn();
  spawn();
  draw();
}

function spawn() {
  const empty = [];
  grid.forEach((r,i) => r.forEach((v,j)=>{ if (!v) empty.push({i,j}); }));
  if(!empty.length) return;
  const {i,j} = empty[Math.floor(Math.random()*empty.length)];
  grid[i][j] = Math.random()<.9 ? 2 : 4;
}

function draw() {
  // draw background cells
  gridEl.innerHTML = Array(size*size).fill().map(_ => '<div class="cell"></div>').join('');
  tilesEl.innerHTML = '';
  scoreEl.textContent = score;

  grid.forEach((row,i)=>{
    row.forEach((v,j)=>{
      if(!v) return;
      const tile = document.createElement('div');
      tile.className = 'tile tile-'+v;
      tile.textContent = v;
      setTilePosition(tile, i, j);
      tilesEl.appendChild(tile);
    });
  });
}

function setTilePosition(el, i, j) {
  el.style.transform = `translate(${j*90}px, ${i*90}px)`;
}

function move(direction) {
  let moved = false;
  let merged = create2d(false);
  const range = [...Array(size).keys()];

  const traverse = {
    up: range,
    down: [...range].reverse(),
    left: range,
    right: [...range].reverse()
  };

  const [di,dj] = {
    up: [-1,0], down: [1,0],
    left: [0,-1], right: [0,1]
  }[direction];

  traverseRows:
  for(let i of traverse[direction==='up'||direction==='down'?'left':'up']) {
    for(let j of traverse[direction==='left'||direction==='right'?'up':'left']) {
      let [ci,cj] = direction==='left'||direction==='right' ? [j,i] : [i,j];
      if(!grid[ci][cj]) continue;

      let ni=ci, nj=cj;
      while(true) {
        const ti = ni+di, tj = nj+dj;
        if(ti<0||ti>=size||tj<0||tj>=size) break;
        if(grid[ti][tj]===0) {
          grid[ti][tj] = grid[ni][nj];
          grid[ni][nj] = 0;
          ni = ti; nj = tj;
          moved = true;
        } else if(grid[ti][tj]===grid[ni][nj] && !merged[ti][tj]) {
          grid[ti][tj] *= 2;
          grid[ni][nj] = 0;
          score += grid[ti][tj];
          merged[ti][tj] = true;
          moved = true;
          break;
        } else break;
      }
    }
  }

  if(moved) {
    spawn();
    draw();
    if(isOver()) setTimeout(()=>alert('Game Over! Score: '+score), 20);
  }
}

function create2d(val) {
  return Array(size).fill().map(_ => Array(size).fill(val));
}

function isOver() {
  if(grid.flat().includes(0)) return false;
  for(let i=0;i<size;i++){
    for(let j=0;j<size;j++){
      if(i+1<size && grid[i][j]===grid[i+1][j]) return false;
      if(j+1<size && grid[i][j]===grid[i][j+1]) return false;
    }
  }
  return true;
}

window.addEventListener('keydown', e=>{
  const d = {
    ArrowUp:'up', ArrowDown:'down',
    ArrowLeft:'left', ArrowRight:'right'
  }[e.key];
  if(d) move(d);
});

let touchStart = null;
gridEl.addEventListener('touchstart', e=>{
  const t = e.changedTouches[0];
  touchStart = { x: t.clientX, y: t.clientY };
});
gridEl.addEventListener('touchend', e=>{
  if(!touchStart) return;
  const t = e.changedTouches[0];
  const dx = t.clientX - touchStart.x;
  const dy = t.clientY - touchStart.y;
  if(Math.abs(dx)>Math.abs(dy)) move(dx>0?'right':'left');
  else move(dy>0?'down':'up');
  touchStart = null;
});

restartBtn.addEventListener('click', init);

init();