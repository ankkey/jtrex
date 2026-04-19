// ============================================================
// CHROME DINO GAME - ENHANCED VERSION
// Pixel art drawn via Canvas API (no external images needed)
// ============================================================

(function() {
  'use strict';

  // ── CANVAS SETUP ──────────────────────────────────────────
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = Math.min(window.innerWidth, 900);
    canvas.height = 300;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ── CONSTANTS ─────────────────────────────────────────────
  const GROUND_Y = 220;
  const GRAVITY = 0.6;
  const JUMP_FORCE = -13;
  const BASE_SPEED = 5;
  const COLOR = {
    dino: '#535353',
    ground: '#535353',
    sky: '#f7f7f7',
    text: '#535353',
    cactus: '#535353',
    ptero: '#535353',
    ufo: '#535353',
    bullet: '#ff4444',
    shield: 'rgba(100,180,255,0.35)',
    shieldBorder: '#64b4ff',
    pteroFriend: '#4a90d9',
    slime: '#5cb85c',
    box: '#8B4513',
    star: '#ffd700',
  };

  const DEATH_MSGS = [
    'địt mẹ mày đồ ngu 😂',
    'AHAHA không qua được à?',
    'ngu vcl luôn á 💀',
    '"Dậy múa đi, sao không múa nữa" 🕺',
    'Phải gì ạ? Phải gì ạ? Phải gìiii? Phải chịuuuuu !!!!!',
    'Broooo... thôi về ngủ đi 😭',
    'Game over rồi bạn ơi, cứng quá mà 💪',
  ];
  let lastDeathMsgIdx = -1;

  // ── SPRITE PIXEL ART DATA ─────────────────────────────────
  // Dino body (14x13 pixel grid)
  const DINO_PIXELS = [
    [0,0,0,0,0,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,0,1,1,1,1,1,0],
    [0,0,0,0,0,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0],
    [0,1,1,0,0,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,0,0,0,0,0,0,0],
  ];

  // Ptero (pterodactyl) 14x8
  const PTERO_PIXELS = [
    [0,0,0,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,1,1,0,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [0,1,1,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,0,0,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  ];

  // Small cactus 10x20
  const CACTUS_S = [
    [0,0,1,0,0],
    [0,0,1,0,0],
    [1,0,1,0,1],
    [1,1,1,1,1],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
    [0,0,1,0,0],
  ];

  // Big cactus 8x16
  const CACTUS_B = [
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [1,0,1,1,0,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
    [0,0,1,1,0,0],
  ];

  // ── PIXEL DRAW HELPER ────────────────────────────────────
  function drawPixels(pixels, x, y, scale, color) {
    ctx.fillStyle = color;
    for (let row = 0; row < pixels.length; row++) {
      for (let col = 0; col < pixels[row].length; col++) {
        if (pixels[row][col]) {
          ctx.fillRect(x + col * scale, y + row * scale, scale, scale);
        }
      }
    }
  }

  // ── GAME STATE ───────────────────────────────────────────
  let state = {};

  function initState() {
    state = {
      running: false,
      over: false,
      started: false,
      score: 0,
      hiScore: parseInt(localStorage.getItem('dinoHi') || '0'),
      speed: BASE_SPEED,
      frame: 0,

      // Dino
      dino: {
        x: 80,
        y: GROUND_Y - 52,
        vy: 0,
        onGround: true,
        jumpsLeft: 2,
        animFrame: 0,
        dead: false,
        immortal: false,
        immortalTimer: 0,
        shield: false,
        shieldTimer: 0,
      },

      // Obstacles
      obstacles: [],
      clouds: [],
      groundDots: [],

      // Powerup companions
      pteroFriend: null,   // unlocked at 100
      ufo: null,           // unlocked at 250
      gun: null,           // unlocked at 1000
      gunCooldown: 0,
      bullets: [],
      ufoBullets: [],
      ufoCooldown: 0,

      // Pickups / effects
      pickups: [],
      effects: [],
      slimeEffect: false,
      slimeTimer: 0,
      boxHitCooldown: 0,

      deathMsg: '',
      showDeathMsgTimer: 0,

      // Spawn timers
      obstacleTimer: 0,
      cloudTimer: 0,

      nightMode: false,
      nightTimer: 0,
    };

    // Initial ground dots
    for (let i = 0; i < 80; i++) {
      state.groundDots.push({
        x: Math.random() * canvas.width * 2,
        size: Math.random() > 0.7 ? 2 : 1,
      });
    }
  }

  // ── INPUT ─────────────────────────────────────────────────
  const keys = {};
  document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['Space', 'ArrowUp'].includes(e.code)) {
      e.preventDefault();
      handleJump();
    }
    if (e.code === 'ArrowDown') crouch(true);
    if (e.code === 'KeyX') tryShoot();
  });
  document.addEventListener('keyup', e => {
    keys[e.code] = false;
    if (e.code === 'ArrowDown') crouch(false);
  });
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    if (t.clientX > canvas.width / 2) handleJump();
    else tryShoot();
  });
  canvas.addEventListener('touchend', e => e.preventDefault());

  function handleJump() {
    if (!state.started || state.over) {
      if (state.over) initState();
      state.started = true;
      state.running = true;
      return;
    }
    const d = state.dino;
    if (d.jumpsLeft > 0) {
      d.vy = JUMP_FORCE * (d.jumpsLeft === 2 ? 1 : 0.8);
      d.onGround = false;
      d.jumpsLeft--;
    }
  }

  function crouch(on) {
    // visual only for now
    state.dino.crouching = on;
  }

  function tryShoot() {
    if (!state.running || state.over) return;
    if (state.gun && state.gunCooldown <= 0) {
      state.bullets.push({ x: state.dino.x + 50, y: state.dino.y + 10, vx: 15 });
      state.gunCooldown = 300; // 5s at 60fps
      showEffect('💥 FIRE!', state.dino.x, state.dino.y - 20, '#ff4444');
    }
  }

  // ── MAIN LOOP ─────────────────────────────────────────────
  let lastTime = 0;
  function loop(ts) {
    const dt = Math.min(ts - lastTime, 50);
    lastTime = ts;
    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // ── UPDATE ────────────────────────────────────────────────
  function update(dt) {
    state.frame++;
    if (!state.running || state.over) return;

    const sc = state.score;
    const spd = state.speed;

    // Score
    state.score += spd * 0.05;
    const scoreInt = Math.floor(state.score);

    // Speed milestone every 100 pts
    if (scoreInt > 0 && scoreInt % 100 === 0 && Math.floor(state.score - spd * 0.05) < scoreInt) {
      state.speed = BASE_SPEED + Math.floor(scoreInt / 100) * 0.5;
    }

    // Unlock companions
    if (scoreInt >= 100 && !state.pteroFriend) {
      state.pteroFriend = { x: state.dino.x - 80, y: state.dino.y - 40, frame: 0 };
      showEffect('🦅 Pterodactyl đồng minh!', canvas.width / 2 - 120, 80, COLOR.pteroFriend);
    }
    if (scoreInt >= 250 && !state.ufo) {
      state.ufo = { x: state.dino.x + 120, y: state.dino.y - 50, frame: 0 };
      showEffect('🛸 UFO xuất hiện!', canvas.width / 2 - 80, 80, '#9b59b6');
    }
    if (scoreInt >= 1000 && !state.gun) {
      state.gun = true;
      showEffect('🔫 SÚNG ĐÃ MỞ KHÓA! [X]', canvas.width / 2 - 140, 80, '#e74c3c');
    }

    // Night mode toggle every 700pts
    state.nightTimer++;
    if (state.nightTimer > 700) {
      state.nightMode = !state.nightMode;
      state.nightTimer = 0;
    }

    // ── DINO PHYSICS ──
    const dino = state.dino;
    dino.vy += GRAVITY;
    dino.y += dino.vy;
    if (dino.y >= GROUND_Y - 52) {
      dino.y = GROUND_Y - 52;
      dino.vy = 0;
      dino.onGround = true;
      dino.jumpsLeft = 2;
    }
    dino.animFrame = Math.floor(state.frame / 6) % 2;

    // Immortal timer
    if (dino.immortal) {
      dino.immortalTimer--;
      if (dino.immortalTimer <= 0) dino.immortal = false;
    }

    // Shield timer
    if (dino.shield) {
      dino.shieldTimer--;
      if (dino.shieldTimer <= 0) dino.shield = false;
    }

    // Slime effect
    if (state.slimeEffect) {
      state.slimeTimer--;
      if (state.slimeTimer <= 0) {
        state.slimeEffect = false;
        state.speed = BASE_SPEED + Math.floor(scoreInt / 100) * 0.5;
      }
    }

    // Gun cooldown
    if (state.gunCooldown > 0) state.gunCooldown--;
    if (state.ufoCooldown > 0) state.ufoCooldown--;
    if (state.boxHitCooldown > 0) state.boxHitCooldown--;

    // ── SPAWN OBSTACLES ──
    state.obstacleTimer--;
    if (state.obstacleTimer <= 0) {
      spawnObstacle(scoreInt);
      state.obstacleTimer = Math.max(60, 120 - scoreInt * 0.05) + Math.random() * 40;
    }

    // ── SPAWN PICKUPS ──
    if (Math.random() < 0.002) spawnPickup();

    // ── CLOUDS ──
    state.cloudTimer--;
    if (state.cloudTimer <= 0) {
      state.clouds.push({ x: canvas.width + 50, y: 40 + Math.random() * 60, w: 50 + Math.random() * 50 });
      state.cloudTimer = 80 + Math.random() * 60;
    }
    state.clouds.forEach(c => c.x -= spd * 0.3);
    state.clouds = state.clouds.filter(c => c.x > -100);

    // ── GROUND DOTS ──
    state.groundDots.forEach(d => d.x -= spd);
    state.groundDots = state.groundDots.filter(d => d.x > -10);
    while (state.groundDots.length < 80) {
      state.groundDots.push({ x: canvas.width + Math.random() * 200, size: Math.random() > 0.7 ? 2 : 1 });
    }

    // ── UPDATE OBSTACLES ──
    state.obstacles.forEach(o => o.x -= spd);
    state.obstacles = state.obstacles.filter(o => o.x > -120);

    // ── UFO AUTO-SHOOT ──
    if (state.ufo && state.ufoCooldown <= 0) {
      const nearestObs = state.obstacles.find(o => o.x > state.ufo.x && o.x < state.ufo.x + 300);
      if (nearestObs) {
        state.ufoBullets.push({ x: state.ufo.x + 20, y: state.ufo.y + 10, vx: 12, target: nearestObs });
        state.ufoCooldown = 120; // 2s
        showEffect('⚡', state.ufo.x + 25, state.ufo.y - 10, '#f39c12');
      }
    }

    // ── UFO POSITION ──
    if (state.ufo) {
      const targetX = state.dino.x + 130;
      const targetY = state.dino.y - 55;
      state.ufo.x += (targetX - state.ufo.x) * 0.05;
      state.ufo.y += (targetY - state.ufo.y) * 0.05;
      state.ufo.frame++;
    }

    // ── PTERO FRIEND POSITION ──
    if (state.pteroFriend) {
      const pf = state.pteroFriend;
      const targetX = state.dino.x - 80;
      const targetY = state.dino.y - 35;
      pf.x += (targetX - pf.x) * 0.07;
      pf.y += (targetY - pf.y) * 0.07;
      pf.frame++;

      // Attack enemy pteros
      state.obstacles.forEach(o => {
        if (o.type === 'ptero' && o.x < pf.x + 200 && o.x > pf.x - 20) {
          o.x = -200; // destroy it
          showEffect('💥 Tiêu diệt!', o.x, o.y, COLOR.pteroFriend);
        }
      });
    }

    // ── UPDATE BULLETS ──
    state.bullets.forEach(b => b.x += b.vx);
    state.bullets = state.bullets.filter(b => b.x < canvas.width + 50);

    // Bullet-obstacle collision
    state.bullets.forEach(b => {
      state.obstacles.forEach(o => {
        if (!o.destroyed && b.x > o.x && b.x < o.x + (o.w || 20) && b.y > o.y && b.y < o.y + (o.h || 40)) {
          o.destroyed = true;
          b.x = -999;
          showEffect('💥 BOOM!', o.x, o.y - 10, '#ff4444');
          state.score += 5;
        }
      });
    });
    state.obstacles = state.obstacles.filter(o => !o.destroyed);

    // UFO bullets
    state.ufoBullets.forEach(b => b.x += b.vx);
    state.ufoBullets = state.ufoBullets.filter(b => b.x < canvas.width + 50);

    // UFO bullet hits obstacles
    state.ufoBullets.forEach(b => {
      state.obstacles.forEach(o => {
        if (!o.destroyed && b.x > o.x && b.x < o.x + (o.w || 20)) {
          o.destroyed = true;
          b.x = -999;
          showEffect('⚡ UFO SHOT!', o.x, o.y - 10, '#9b59b6');
        }
      });
    });
    state.obstacles = state.obstacles.filter(o => !o.destroyed);

    // ── PICKUPS ──
    state.pickups.forEach(p => p.x -= spd * 0.8);
    state.pickups = state.pickups.filter(p => p.x > -50);

    // Pickup collision
    state.pickups.forEach((p, i) => {
      if (rectOverlap(dino, { x: p.x - 15, y: p.y - 15, w: 30, h: 30 })) {
        applyPickup(p.type);
        state.pickups.splice(i, 1);
      }
    });

    // ── EFFECTS CLEANUP ──
    state.effects = state.effects.filter(e => { e.life--; e.y -= 0.5; return e.life > 0; });

    // ── COLLISION DETECTION ──
    if (!dino.immortal) {
      for (const o of state.obstacles) {
        const hit = rectOverlap(dino, o);
        if (hit) {
          if (o.type === 'box' && state.boxHitCooldown <= 0) {
            // Box: slow down, deduct score
            state.slimeEffect = true;
            state.slimeTimer = 180;
            const prevSpeed = state.speed;
            state.speed = Math.max(BASE_SPEED, state.speed * 0.8);
            state.score = Math.max(0, state.score - 10);
            state.boxHitCooldown = 60;
            o.destroyed = true;
            showEffect('📦 CHẬM LẠI!', dino.x, dino.y - 30, COLOR.box);
          } else if (o.type === 'slime') {
            state.slimeEffect = true;
            state.slimeTimer = 300; // 5s
            const prev = state.speed;
            state.speed = prev * 0.8;
            o.destroyed = true;
            showEffect('🟢 SLIME -20% tốc độ 5s!', dino.x, dino.y - 30, COLOR.slime);
          } else if (o.type !== 'box' && o.type !== 'slime') {
            if (dino.shield) {
              dino.shield = false;
              o.destroyed = true;
              showEffect('🛡 KHIÊN HẤP THỤ!', dino.x, dino.y - 30, COLOR.shieldBorder);
            } else {
              gameover();
              return;
            }
          }
        }
      }
      state.obstacles = state.obstacles.filter(o => !o.destroyed);
    }
  }

  function spawnObstacle(score) {
    const types = ['cactus_s', 'cactus_b'];
    if (score >= 30) types.push('ptero');
    if (score >= 500) types.push('box', 'box');
    if (score >= 600) types.push('slime');

    const type = types[Math.floor(Math.random() * types.length)];
    const x = canvas.width + 50;

    if (type === 'cactus_s') {
      const count = Math.floor(Math.random() * 3) + 1;
      state.obstacles.push({ type, x, y: GROUND_Y - 40, w: count * 18, h: 40, count });
    } else if (type === 'cactus_b') {
      state.obstacles.push({ type, x, y: GROUND_Y - 55, w: 30, h: 55 });
    } else if (type === 'ptero') {
      const heights = [GROUND_Y - 80, GROUND_Y - 55, GROUND_Y - 30];
      const hy = heights[Math.floor(Math.random() * heights.length)];
      state.obstacles.push({ type, x, y: hy, w: 42, h: 25 });
    } else if (type === 'box') {
      state.obstacles.push({ type, x, y: GROUND_Y - 32, w: 32, h: 32 });
    } else if (type === 'slime') {
      state.obstacles.push({ type, x, y: GROUND_Y - 22, w: 28, h: 22, phase: Math.random() * Math.PI * 2 });
    }
  }

  function spawnPickup() {
    const types = ['immortal', 'shield'];
    const type = types[Math.floor(Math.random() * types.length)];
    state.pickups.push({ type, x: canvas.width + 30, y: GROUND_Y - 60 - Math.random() * 40 });
  }

  function applyPickup(type) {
    if (type === 'immortal') {
      state.dino.immortal = true;
      state.dino.immortalTimer = 300; // 5s
      showEffect('⭐ BẤT TỬ 5s!', state.dino.x, state.dino.y - 40, COLOR.star);
    } else if (type === 'shield') {
      state.dino.shield = true;
      state.dino.shieldTimer = 600;
      showEffect('🛡 KHIÊN!', state.dino.x, state.dino.y - 40, COLOR.shieldBorder);
    }
  }

  function gameover() {
    state.over = true;
    state.running = false;
    if (state.score > state.hiScore) {
      state.hiScore = Math.floor(state.score);
      localStorage.setItem('dinoHi', state.hiScore);
    }

    // Pick non-repeating death message
    let idx;
    do { idx = Math.floor(Math.random() * DEATH_MSGS.length); } while (idx === lastDeathMsgIdx);
    lastDeathMsgIdx = idx;
    state.deathMsg = DEATH_MSGS[idx];
  }

  function rectOverlap(a, b) {
    const margin = 8;
    return (
      a.x + margin < b.x + (b.w || 20) - margin &&
      a.x + 40 - margin > b.x + margin &&
      a.y + margin < b.y + (b.h || 20) - margin &&
      a.y + 48 - margin > b.y + margin
    );
  }

  function showEffect(text, x, y, color) {
    state.effects.push({ text, x, y, color, life: 90 });
  }

  // ── DRAW ──────────────────────────────────────────────────
  function draw() {
    const nm = state.nightMode;
    const bg = nm ? '#1a1a2e' : '#f7f7f7';
    const fg = nm ? '#e0e0e0' : COLOR.dino;
    const groundColor = nm ? '#555' : COLOR.ground;

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars in night mode
    if (nm) drawStars();

    // Clouds
    drawClouds(fg, nm);

    // Ground
    ctx.fillStyle = groundColor;
    ctx.fillRect(0, GROUND_Y, canvas.width, 2);

    // Ground dots
    ctx.fillStyle = groundColor;
    state.groundDots.forEach(d => {
      ctx.fillRect(d.x, GROUND_Y + 4 + Math.random() * 2, d.size, d.size);
    });

    // Obstacles
    state.obstacles.forEach(o => drawObstacle(o, fg));

    // Pickups
    drawPickups();

    // UFO bullets
    ctx.fillStyle = '#9b59b6';
    state.ufoBullets.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Player bullets
    ctx.fillStyle = COLOR.bullet;
    state.bullets.forEach(b => {
      ctx.fillRect(b.x - 6, b.y - 2, 12, 4);
    });

    // UFO
    if (state.ufo) drawUFO(state.ufo, fg);

    // Pterodactyl friend
    if (state.pteroFriend) drawPteroFriend(state.pteroFriend);

    // Dino
    drawDino(fg);

    // Effects (floating text)
    state.effects.forEach(e => {
      ctx.globalAlpha = e.life / 90;
      ctx.fillStyle = e.color;
      ctx.font = 'bold 13px monospace';
      ctx.fillText(e.text, e.x, e.y);
      ctx.globalAlpha = 1;
    });

    // HUD
    drawHUD(nm);

    // Screen overlays
    if (!state.started) drawStartScreen(nm);
    if (state.over) drawGameOver(nm);
  }

  function drawStars() {
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137 + state.frame * 0.2) % canvas.width;
      const sy = (i * 97) % (GROUND_Y - 20);
      ctx.fillRect(sx, sy, 1, 1);
    }
  }

  function drawClouds(fg, nm) {
    ctx.fillStyle = nm ? 'rgba(255,255,255,0.15)' : 'rgba(200,200,200,0.6)';
    state.clouds.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, c.w / 2, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x - c.w / 4, c.y + 5, c.w / 4, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x + c.w / 4, c.y + 6, c.w / 3.5, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawDino(fg) {
    const d = state.dino;
    const x = d.x;
    const y = d.y;
    const scale = 4;

    // Immortal glow
    if (d.immortal && Math.floor(state.frame / 4) % 2 === 0) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = COLOR.star;
    }

    // Shield glow
    if (d.shield) {
      ctx.beginPath();
      ctx.arc(x + 28, y + 26, 34, 0, Math.PI * 2);
      ctx.fillStyle = COLOR.shield;
      ctx.fill();
      ctx.strokeStyle = COLOR.shieldBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw dino body
    drawPixels(DINO_PIXELS, x, y, scale, fg);

    // Eye (white pixel)
    ctx.fillStyle = '#f7f7f7';
    ctx.fillRect(x + 5 * scale, y + 2 * scale, scale, scale);

    // Legs animation
    const lf = d.animFrame;
    ctx.fillStyle = fg;
    if (d.onGround) {
      // Leg 1
      ctx.fillRect(x + 3 * scale, y + 10 * scale, scale, 3 * scale);
      // Leg 2
      ctx.fillRect(x + 5 * scale, y + 10 * scale, scale, 3 * scale);
      if (lf === 0) {
        ctx.fillRect(x + 3 * scale, y + 12 * scale, scale * 2, scale);
      } else {
        ctx.fillRect(x + 5 * scale, y + 12 * scale, scale * 2, scale);
      }
    } else {
      ctx.fillRect(x + 3 * scale, y + 10 * scale, scale, 3 * scale);
      ctx.fillRect(x + 5 * scale, y + 10 * scale, scale, 3 * scale);
    }

    // Gun on back (if unlocked)
    if (state.gun) {
      ctx.fillStyle = '#222';
      ctx.fillRect(x + 7 * scale, y + 5 * scale, 12, 5);
      ctx.fillRect(x + 18, y + 4 * scale, 5, 3);
      if (state.gunCooldown > 0) {
        const pct = state.gunCooldown / 300;
        ctx.fillStyle = `rgba(255,${Math.floor(pct * 100)},0,0.7)`;
        ctx.fillRect(x + 7 * scale, y + 5 * scale, 12 * (1 - pct), 5);
      }
    }

    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
  }

  function drawObstacle(o, fg) {
    const { type, x, y } = o;

    if (type === 'cactus_s') {
      for (let i = 0; i < (o.count || 1); i++) {
        drawPixels(CACTUS_S, x + i * 18, y, 4, fg);
      }
    } else if (type === 'cactus_b') {
      drawPixels(CACTUS_B, x, y, 5, fg);
    } else if (type === 'ptero') {
      const pf = Math.floor(state.frame / 8) % 2;
      const p = pf === 0 ? PTERO_PIXELS : PTERO_PIXELS.map((r, ri) =>
        ri === 2 ? [0,0,1,1,1,1,1,1,1,1,1,1,1,0] : r
      );
      drawPixels(p, x, y, 3, fg);
    } else if (type === 'box') {
      // Wooden box
      ctx.fillStyle = COLOR.box;
      ctx.fillRect(x, y, 32, 32);
      ctx.strokeStyle = '#5a2d0c';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 2, y + 2, 28, 28);
      ctx.beginPath();
      ctx.moveTo(x + 16, y + 2);
      ctx.lineTo(x + 16, y + 30);
      ctx.moveTo(x + 2, y + 16);
      ctx.lineTo(x + 30, y + 16);
      ctx.strokeStyle = '#5a2d0c';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // X mark
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('📦', x + 2, y + 26);
    } else if (type === 'slime') {
      const bounce = Math.sin(state.frame * 0.15 + o.phase) * 3;
      // Slime body
      ctx.fillStyle = COLOR.slime;
      ctx.beginPath();
      ctx.ellipse(x + 14, y + 11 + bounce, 14, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      // Eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x + 9, y + 9 + bounce, 3, 0, Math.PI * 2);
      ctx.arc(x + 19, y + 9 + bounce, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.arc(x + 10, y + 9 + bounce, 1.5, 0, Math.PI * 2);
      ctx.arc(x + 20, y + 9 + bounce, 1.5, 0, Math.PI * 2);
      ctx.fill();
      // Drip
      ctx.fillStyle = 'rgba(92,184,92,0.5)';
      ctx.beginPath();
      ctx.arc(x + 14, y + 20 + bounce, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPickups() {
    state.pickups.forEach(p => {
      const bob = Math.sin(state.frame * 0.1) * 4;
      if (p.type === 'immortal') {
        ctx.font = '22px sans-serif';
        ctx.fillText('⭐', p.x - 11, p.y + bob);
      } else if (p.type === 'shield') {
        ctx.font = '22px sans-serif';
        ctx.fillText('🛡', p.x - 11, p.y + bob);
      }
    });
  }

  function drawUFO(ufo, fg) {
    const { x, y } = ufo;
    const bob = Math.sin(state.frame * 0.07) * 4;
    const cy = y + bob;

    // Glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#9b59b6';

    // Body
    ctx.fillStyle = '#9b59b6';
    ctx.beginPath();
    ctx.ellipse(x + 22, cy + 14, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dome
    ctx.fillStyle = 'rgba(180,130,255,0.7)';
    ctx.beginPath();
    ctx.ellipse(x + 22, cy + 9, 14, 10, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // Lights
    const lc = ['#ff0', '#f0f', '#0ff'];
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = lc[(i + Math.floor(state.frame / 10)) % 3];
      ctx.beginPath();
      ctx.arc(x + 10 + i * 12, cy + 18, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;

    // Cooldown bar under UFO
    if (state.ufoCooldown > 0) {
      const pct = state.ufoCooldown / 120;
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(x, cy + 25, 44, 4);
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(x, cy + 25, 44 * (1 - pct), 4);
    }
  }

  function drawPteroFriend(pf) {
    const { x, y } = pf;
    const pix = Math.floor(pf.frame / 8) % 2 === 0
      ? PTERO_PIXELS
      : PTERO_PIXELS.map((r, ri) => ri === 2 ? [0,0,1,1,1,1,1,1,1,1,1,1,1,0] : r);
    drawPixels(pix, x, y, 3, COLOR.pteroFriend);

    // Blue tint to distinguish
    ctx.fillStyle = 'rgba(74,144,217,0.2)';
    ctx.fillRect(x, y, 42, 24);
  }

  function drawHUD(nm) {
    const textColor = nm ? '#e0e0e0' : '#535353';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 14px "Courier New", monospace';

    // Score
    const sc = Math.floor(state.score).toString().padStart(5, '0');
    ctx.fillText(`HI ${state.hiScore.toString().padStart(5,'0')}  ${sc}`, canvas.width - 200, 30);

    // Speed/milestone info
    ctx.font = '11px "Courier New", monospace';
    ctx.fillStyle = textColor;

    // Active effects bar
    let barItems = [];
    if (state.dino.immortal) barItems.push(`⭐${Math.ceil(state.dino.immortalTimer / 60)}s`);
    if (state.dino.shield) barItems.push(`🛡`);
    if (state.slimeEffect) barItems.push(`🐢 SLOW ${Math.ceil(state.slimeTimer / 60)}s`);
    if (state.gun && state.gunCooldown > 0) barItems.push(`🔫 ${Math.ceil(state.gunCooldown / 60)}s`);
    if (barItems.length > 0) {
      ctx.font = '12px sans-serif';
      ctx.fillText(barItems.join('  '), 10, 25);
    }

    // Companion unlock hints
    ctx.font = '10px "Courier New", monospace';
    ctx.fillStyle = nm ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)';
    if (Math.floor(state.score) < 100) ctx.fillText(`🦅 ${100 - Math.floor(state.score)} pts`, 10, canvas.height - 10);
    if (state.gun) ctx.fillText('[X] Bắn  [↑/Space] Nhảy', canvas.width / 2 - 90, canvas.height - 10);
  }

  function drawStartScreen(nm) {
    const textColor = nm ? '#e0e0e0' : '#535353';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Nhấn SPACE / ↑ để bắt đầu', canvas.width / 2, canvas.height / 2 + 60);
    ctx.font = '12px "Courier New", monospace';
    ctx.fillStyle = nm ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)';
    ctx.fillText('[X] để bắn súng khi mở khóa · [↓] cúi', canvas.width / 2, canvas.height / 2 + 85);
    ctx.textAlign = 'left';
  }

  function drawGameOver(nm) {
    const textColor = nm ? '#e0e0e0' : '#535353';
    ctx.fillStyle = textColor;
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('G A M E  O V E R', canvas.width / 2, canvas.height / 2 - 20);

    // Death message
    ctx.fillStyle = '#e74c3c';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText(state.deathMsg, canvas.width / 2, canvas.height / 2 + 15);

    ctx.fillStyle = textColor;
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText('Nhấn SPACE để chơi lại', canvas.width / 2, canvas.height / 2 + 45);
    ctx.textAlign = 'left';
  }

  // ── BOOT ─────────────────────────────────────────────────
  initState();
  requestAnimationFrame(loop);

  window.dinoGame = { state, initState };
})();
