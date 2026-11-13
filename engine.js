/**
 * ENGINE.JS - Liga Petarung v3.0
 * Core Engine: Combat System, Flags, Toast, Screen Effects
 * 100% Vanilla JS, Offline-First
 */

let state = {
  currentEpisode: null,
  currentLocationId: null,
  stats: {},
  inventory: [],
  unlockedLocations: [],
  selectedCraftItems: [],
  completedActions: [],
  flags: {},
  currentStance: 'traditional',
  isAudioMuted: false,
  isTypewriterActive: false,
  typewriterTimer: null
};

// ============================================================
// AUDIO MANAGER
// ============================================================
const AudioManager = {
  bgmAudio: null,
  audioCtx: null,

  init() {
    if (GAME_DATA.audio_config && GAME_DATA.audio_config.bgm) {
      this.bgmAudio = new Audio(GAME_DATA.audio_config.bgm);
      this.bgmAudio.loop = true;
    }
  },

  playBGM() {
    if (state.isAudioMuted || !this.bgmAudio) return;
    this.bgmAudio.play().catch(() => {});
  },

  playSFX(type) {
    if (state.isAudioMuted) return;
    let sfxPath = GAME_DATA.audio_config ? GAME_DATA.audio_config[type] : null;
    if (sfxPath) {
      let sfx = new Audio(sfxPath);
      sfx.play().catch(() => this.playSynthSFX(type));
    } else {
      this.playSynthSFX(type);
    }
  },

  playSynthSFX(type) {
    try {
      if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (type === 'sfx_victory') {
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
          const o = this.audioCtx.createOscillator();
          const g = this.audioCtx.createGain();
          o.connect(g); g.connect(this.audioCtx.destination);
          o.frequency.value = freq;
          const t = this.audioCtx.currentTime + i * 0.1;
          g.gain.setValueAtTime(0.15, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          o.start(t); o.stop(t + 0.3);
        });
        return;
      }
      if (type === 'sfx_defeat') {
        const notes = [392, 330, 262, 196];
        notes.forEach((freq, i) => {
          const o = this.audioCtx.createOscillator();
          const g = this.audioCtx.createGain();
          o.connect(g); g.connect(this.audioCtx.destination);
          o.frequency.value = freq;
          const t = this.audioCtx.currentTime + i * 0.15;
          g.gain.setValueAtTime(0.15, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          o.start(t); o.stop(t + 0.35);
        });
        return;
      }
      let osc = this.audioCtx.createOscillator();
      let gain = this.audioCtx.createGain();
      osc.connect(gain); gain.connect(this.audioCtx.destination);
      if (type === 'sfx_danger') {
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      } else {
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      }
      osc.start(); osc.stop(this.audioCtx.currentTime + 0.2);
    } catch (e) {}
  }
};

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
  }, duration);
}

// ============================================================
// SCREEN EFFECTS
// ============================================================
function triggerScreenShake(intensity = 'medium') {
  const container = document.getElementById('app-container');
  if (!container) return;
  const cls = `shake-${intensity}`;
  container.classList.remove('shake-light', 'shake-medium', 'shake-heavy');
  void container.offsetWidth;
  container.classList.add(cls);
  setTimeout(() => container.classList.remove(cls), 450);
}

function showFloatingDamage(amount, targetId, isHeal = false) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = `floating-damage ${isHeal ? 'heal' : 'dmg'}`;
  el.innerText = isHeal ? `+${amount}` : `-${amount}`;
  el.style.left = (rect.left + rect.width / 2 - 20) + 'px';
  el.style.top = rect.top + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function showStatFloat(statKey, delta) {
  if (delta === 0) return;
  const cfg = GAME_DATA.stats_config[statKey];
  if (!cfg) return;
  const el = document.createElement('div');
  el.className = `stat-float ${delta > 0 ? 'positive' : 'negative'}`;
  el.innerText = `${delta > 0 ? '+' : ''}${delta} ${cfg.icon}`;
  el.style.bottom = '120px';
  el.style.left = (30 + Math.random() * 60) + '%';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1500);
}

// ============================================================
// COMBAT SYSTEM
// ============================================================
const CombatSystem = {
  active: false,
  enemy: null,
  combatDef: null,
  actionIdForRollback: null,
  round: 0,
  log: [],
  playerDefending: false,

  start(enemyDef) {
    this.active = true;
    this.enemy = {
      name: enemyDef.name,
      emoji: enemyDef.emoji || '🥋',
      maxHp: enemyDef.maxHp,
      currentHp: enemyDef.maxHp,
      attack: enemyDef.attack,
      defense: enemyDef.defense || 0
    };
    this.round = 1;
    this.playerDefending = false;
    this.log = [`⚔️ Pertarungan melawan <strong>${enemyDef.name}</strong> dimulai!`];
    this.render();
    AudioManager.playSFX('sfx_action');
  },

  playerHp() { return state.stats.stat1; },
  playerMaxHp() { return GAME_DATA.stats_config.stat1.max; },
  playerQi() { return state.stats.stat2; },
  playerMaxQi() { return GAME_DATA.stats_config.stat2.max; },

  calcDamage(base, enemyDef) {
    const variance = 0.85 + Math.random() * 0.3;
    return Math.max(1, Math.round(base * variance) - (enemyDef || 0));
  },

  playerAttack(type) {
    if (!this.active) return;
    const stance = state.currentStance;
    let baseDmg = 0;
    let qiCost = 0;
    let logMsg = '';

    if (type === 'basic') {
      const primary = stance === 'traditional' ? this.playerQi() : this.playerHp();
      baseDmg = 16 + Math.floor(primary / 15);
      logMsg = stance === 'traditional'
        ? `👊 Pukulan lurus Sumbu Jagat mendarat di rahang ${this.enemy.name}`
        : `👊 Jab cepat modern menghantam wajah ${this.enemy.name}`;
    } else if (type === 'special') {
      if (stance === 'traditional') {
        qiCost = 6;
        baseDmg = 24 + Math.floor(this.playerQi() / 10);
        logMsg = `⚡ Konter presisi Sumbu Jagat! Anda membaca gerakan dan menyerang titik buta`;
      } else {
        qiCost = 8;
        baseDmg = 26 + Math.floor(this.playerHp() / 10);
        logMsg = `💥 Kombinasi cepat bertubi-tubi! ${this.enemy.name} terhuyung`;
      }
      if (this.playerQi() < qiCost) {
        this.log.push(`⚠️ Qi tidak cukup untuk teknik khusus!`);
        this.render();
        return;
      }
      state.stats.stat2 = Math.max(0, this.playerQi() - qiCost);
      renderStats();
    }

    const dmg = this.calcDamage(baseDmg, this.enemy.defense);
    this.enemy.currentHp = Math.max(0, this.enemy.currentHp - dmg);
    this.log.push(`${logMsg} — <strong>${dmg} damage!</strong>`);
    if (qiCost > 0) this.log.push(`🧘 Qi berkurang ${qiCost}`);

    triggerScreenShake(dmg > 25 ? 'heavy' : 'light');
    showFloatingDamage(dmg, 'combat-enemy-hp-fill');
    AudioManager.playSFX('sfx_action');

    if (this.enemy.currentHp <= 0) {
      this.log.push(`💥 <strong>${this.enemy.name} TUMBANG!</strong>`);
      this.render();
      setTimeout(() => this.endCombat(true), 1000);
      return;
    }
    this.enemyTurn();
  },

  playerDefend() {
    if (!this.active) return;
    this.playerDefending = true;
    const recover = 14;
    state.stats.stat2 = Math.min(this.playerMaxQi(), this.playerQi() + recover);
    this.log.push(`🛡️ Anda menarik napas dalam, mengalirkan Qi ke inti tubuh — <strong>+${recover} Qi</strong>`);
    showStatFloat('stat2', recover);
    renderStats();
    this.enemyTurn();
  },

  playerChangeStance() {
    if (!this.active) return;
    state.currentStance = state.currentStance === 'traditional' ? 'modern' : 'traditional';
    const label = state.currentStance === 'traditional' ? '🥋 Sumbu Jagat' : '🥊 Modern Kickboxing';
    this.log.push(`⚔️ Kuda-kuda beralih ke: <strong>${label}</strong>`);
    AudioManager.playSFX('sfx_action');
    this.enemyTurn();
  },

  enemyTurn() {
    if (!this.active) return;
    this.round++;

    const qiDefense = Math.floor(this.playerQi() / 20);
    let rawDmg = this.enemy.attack + Math.round(Math.random() * 4 - 2);
    let finalDmg = Math.max(1, rawDmg - qiDefense);
    if (this.playerDefending) finalDmg = Math.max(1, Math.round(finalDmg * 0.5));

    state.stats.stat1 = Math.max(0, this.playerHp() - finalDmg);
    this.log.push(`💢 ${this.enemy.name} menyerang balik — <strong>-${finalDmg} Stamina</strong>`);

    triggerScreenShake('medium');
    showFloatingDamage(finalDmg, 'combat-player-hp-fill');
    AudioManager.playSFX('sfx_danger');
    renderStats();

    if (this.playerHp() <= 0) {
      this.log.push(`💀 Anda tumbang...`);
      this.render();
      setTimeout(() => this.endCombat(false), 1000);
      return;
    }
    this.playerDefending = false;
    this.render();
  },

  endCombat(victory) {
    this.active = false;
    const result = victory ? this.combatDef.victory : this.combatDef.defeat;

    if (!victory && this.actionIdForRollback) {
      state.completedActions = state.completedActions.filter(id => id !== this.actionIdForRollback);
    }

    const splash = document.createElement('div');
    splash.className = `combat-splash ${victory ? 'victory' : 'defeat'}`;
    splash.innerHTML = victory
      ? `<div class="splash-title">⚔️ KEMENANGAN!</div><div class="splash-sub">${this.enemy.name} tumbang</div>`
      : `<div class="splash-title">💀 KEKALAHAN</div><div class="splash-sub">Anda tumbang di tangan ${this.enemy.name}</div>`;
    document.body.appendChild(splash);

    AudioManager.playSFX(victory ? 'sfx_victory' : 'sfx_defeat');

    setTimeout(() => splash.remove(), 1800);
    hideCombatHUD();

    setTimeout(() => this.applyOutcome(result), 1200);
  },

  applyOutcome(result) {
    if (!result) { renderLocation(state.currentLocationId); return; }

    if (result.stat_changes) {
      Object.keys(result.stat_changes).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const maxVal = cfg ? cfg.max : 100;
        const before = state.stats[k] || 0;
        state.stats[k] = Math.max(0, Math.min(maxVal, before + result.stat_changes[k]));
        showStatFloat(k, state.stats[k] - before);
      });
      renderStats();
    }

    if (result.unlocked_item_id && !state.inventory.includes(result.unlocked_item_id)) {
      state.inventory.push(result.unlocked_item_id);
    }
    if (result.unlocked_item_ids) {
      result.unlocked_item_ids.forEach(id => {
        if (!state.inventory.includes(id)) state.inventory.push(id);
      });
    }
    if (result.sets_flag) {
      if (typeof result.sets_flag === 'string') state.flags[result.sets_flag] = true;
      else Object.assign(state.flags, result.sets_flag);
    }

    if (result.trigger_ending_id && state.currentEpisode.endings) {
      const end = state.currentEpisode.endings[result.trigger_ending_id];
      if (end) { showEnding(end); return; }
    }

    if (state.stats.stat1 <= 0 || state.stats.stat2 <= 0 || state.stats.stat3 <= 0) {
      if (checkEndingTriggers({})) return;
    }

    if (result.next_location_id) {
      state.currentLocationId = result.next_location_id;
      renderLocation(result.next_location_id);
    } else if (result.outcome) {
      startTypewriter(result.outcome, () => renderLocation(state.currentLocationId));
    } else {
      renderLocation(state.currentLocationId);
    }

    saveGame();
  },

  render() {
    const hud = document.getElementById('combat-hud');
    if (!hud) return;
    hud.querySelector('#combat-enemy-name').innerText = `${this.enemy.emoji} ${this.enemy.name}`;
    hud.querySelector('#combat-enemy-hp-text').innerText = `${this.enemy.currentHp}/${this.enemy.maxHp}`;
    hud.querySelector('#combat-enemy-hp-fill').style.width = `${(this.enemy.currentHp / this.enemy.maxHp) * 100}%`;
    hud.querySelector('#combat-player-hp-text').innerText = `${this.playerHp()}/${this.playerMaxHp()}`;
    hud.querySelector('#combat-player-hp-fill').style.width = `${(this.playerHp() / this.playerMaxHp()) * 100}%`;
    hud.querySelector('#combat-player-qi-text').innerText = `${this.playerQi()}/${this.playerMaxQi()}`;
    hud.querySelector('#combat-round').innerText = `Ronde ${this.round}`;
    hud.querySelector('#combat-stance').innerText = state.currentStance === 'traditional' ? '🥋 Sumbu Jagat' : '🥊 Modern';

    const logEl = hud.querySelector('#combat-log');
    logEl.innerHTML = this.log.slice(-5).map(l => `<div class="combat-log-line">${l}</div>`).join('');
    logEl.scrollTop = logEl.scrollHeight;

    const actions = hud.querySelector('#combat-actions');
    actions.innerHTML = '';
    const addBtn = (label, handler, cls = '') => {
      const b = document.createElement('button');
      b.className = 'combat-btn ' + cls;
      b.innerHTML = label;
      b.onclick = handler;
      actions.appendChild(b);
    };
    addBtn('👊<br>Serangan', () => this.playerAttack('basic'));
    const spLabel = state.currentStance === 'traditional'
      ? '⚡<br>Konter<br><small>-6 Qi</small>'
      : '💥<br>Kombinasi<br><small>-8 Qi</small>';
    addBtn(spLabel, () => this.playerAttack('special'), 'special');
    addBtn('🛡️<br>Bertahan<br><small>+14 Qi</small>', () => this.playerDefend(), 'defend');
    addBtn('⚔️<br>Ganti<br>Kuda-kuda', () => this.playerChangeStance(), 'stance');
  }
};

function showCombatHUD() {
  const hud = document.getElementById('combat-hud');
  if (hud) hud.classList.add('active');
}

function hideCombatHUD() {
  const hud = document.getElementById('combat-hud');
  if (hud) hud.classList.remove('active');
}

// ============================================================
// INIT
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  AudioManager.init();
  applyThemeColors();
  renderTitleScreen();
  setupEventListeners();
});

function applyThemeColors() {
  if (GAME_DATA.theme_colors) {
    document.documentElement.style.setProperty('--bg-color', GAME_DATA.theme_colors.bg);
    document.documentElement.style.setProperty('--panel-color', GAME_DATA.theme_colors.panel);
    document.documentElement.style.setProperty('--accent-color', GAME_DATA.theme_colors.accent);
    document.documentElement.style.setProperty('--text-color', GAME_DATA.theme_colors.text);
  }
  document.getElementById('app-title').innerText = GAME_DATA.game_title || "LIGA PETARUNG";
}

function renderTitleScreen() {
  const epContainer = document.getElementById('episode-list');
  epContainer.innerHTML = '';
  if (GAME_DATA.episodes && GAME_DATA.episodes.length > 0) {
    GAME_DATA.episodes.forEach(ep => {
      let btn = document.createElement('button');
      btn.className = 'btn-main';
      btn.innerText = ep.title;
      btn.onclick = () => startEpisode(ep.id);
      epContainer.appendChild(btn);
    });
  }
  const saveBtn = document.getElementById('btn-continue');
  if (localStorage.getItem('liga_petarung_save')) {
    saveBtn.style.display = 'block';
    saveBtn.onclick = () => loadGame();
  } else {
    saveBtn.style.display = 'none';
  }
}

function startEpisode(epId) {
  const ep = GAME_DATA.episodes.find(e => e.id === epId);
  if (!ep) return;
  state.currentEpisode = ep;
  state.currentLocationId = ep.start_location_id;
  state.inventory = [];
  state.unlockedLocations = [ep.start_location_id];
  state.completedActions = [];
  state.flags = {};
  state.currentStance = 'traditional';
  state.selectedCraftItems = [];
  Object.keys(GAME_DATA.stats_config).forEach(k => {
    state.stats[k] = GAME_DATA.stats_config[k].initial;
  });
  switchScreen('game-screen');
  document.getElementById('episode-title').innerText = ep.title.split(':')[0] || "Episode";
  renderStats();
  renderLocation(state.currentLocationId);
  AudioManager.playBGM();
}

function advanceToNextEpisode(nextEpId) {
  const nextEp = GAME_DATA.episodes.find(e => e.id === nextEpId);
  if (!nextEp) {
    showToast("❌ Episode berikutnya belum tersedia.", "error");
    location.reload();
    return;
  }
  state.currentEpisode = nextEp;
  state.currentLocationId = nextEp.start_location_id;
  state.stats.stat3 = Math.min(100, (state.stats.stat3 || 20) + 25);
  state.stats.stat1 = Math.min(GAME_DATA.stats_config.stat1.max, (state.stats.stat1 || 100) + 20);
  if (!state.unlockedLocations.includes(nextEp.start_location_id)) {
    state.unlockedLocations.push(nextEp.start_location_id);
  }
  state.completedActions = [];
  state.currentStance = 'traditional';
  saveGame();
  switchScreen('game-screen');
  document.getElementById('episode-title').innerText = nextEp.title.split(':')[0] || "Episode";
  renderStats();
  renderLocation(state.currentLocationId);
  AudioManager.playBGM();
}

function renderStats() {
  const container = document.getElementById('stats-container');
  container.innerHTML = '';
  Object.keys(GAME_DATA.stats_config).forEach(key => {
    const cfg = GAME_DATA.stats_config[key];
    const val = state.stats[key] !== undefined ? state.stats[key] : cfg.initial;
    const pct = Math.max(0, Math.min(100, (val / cfg.max) * 100));
    container.innerHTML += `
      <div class="stat-box">
        <div class="stat-label">
          <span>${cfg.icon} ${cfg.name}</span>
          <span>${val}</span>
        </div>
        <div class="bar-bg"><div class="bar-fill" style="width: ${pct}%"></div></div>
      </div>
    `;
  });
}

function getNarrativeForLocation(loc) {
  if (loc.narrative_by_flags) {
    for (const flag in loc.narrative_by_flags) {
      if (state.flags[flag]) return loc.narrative_by_flags[flag];
    }
  }
  return loc.narrative;
}

function renderLocation(locId) {
  saveGame();
  const loc = state.currentEpisode.locations.find(l => l.id === locId);
  if (!loc) return;
  document.getElementById('location-name').innerText = loc.name;

  const imgBox = document.getElementById('scene-visual');
  const imgEl = document.getElementById('scene-img');
  if (loc.image) {
    imgEl.src = loc.image;
    imgBox.style.display = 'block';
    imgEl.onerror = () => { imgBox.style.display = 'none'; };
  } else {
    imgBox.style.display = 'none';
  }

  startTypewriter(getNarrativeForLocation(loc), () => {
    renderActions(loc.action_options);
  });
}

function startTypewriter(text, onComplete) {
  const box = document.getElementById('narrative-box');
  const skipBtn = document.getElementById('skip-btn');
  const actionList = document.getElementById('action-list');
  box.innerText = '';
  actionList.innerHTML = '';
  skipBtn.style.display = 'block';
  state.isTypewriterActive = true;
  let i = 0;
  clearInterval(state.typewriterTimer);
  state.typewriterTimer = setInterval(() => {
    box.innerText += text.charAt(i);
    i++;
    if (i >= text.length) completeTypewriter(text, onComplete);
  }, 18);
  skipBtn.onclick = () => completeTypewriter(text, onComplete);
}

function completeTypewriter(text, onComplete) {
  clearInterval(state.typewriterTimer);
  document.getElementById('narrative-box').innerText = text;
  document.getElementById('skip-btn').style.display = 'none';
  state.isTypewriterActive = false;
  if (onComplete) onComplete();
}

function renderActions(actions) {
  const list = document.getElementById('action-list');
  list.innerHTML = '';
  if (!actions) return;
  const allItems = getAllEpisodeItems();

  actions.forEach(act => {
    if (act.once && state.completedActions && state.completedActions.includes(act.action_id)) return;

    let btn = document.createElement('button');
    btn.className = 'btn-action';

    const missing = [];
    if (act.required_item_id && !state.inventory.includes(act.required_item_id)) {
      const item = allItems.find(i => i.id === act.required_item_id);
      missing.push(`Butuh: ${item ? item.name : act.required_item_id}`);
    }
    if (act.required_stat) {
      Object.keys(act.required_stat).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const curVal = state.stats[k] || 0;
        if (curVal < act.required_stat[k]) {
          missing.push(`${cfg ? cfg.icon + ' ' + cfg.name : k} ≥ ${act.required_stat[k]}`);
        }
      });
    }

    if (missing.length > 0) {
      btn.disabled = true;
      btn.classList.add('btn-action-disabled');
      btn.innerHTML = `${act.description}<br><small class="req-hint">🔒 ${missing.join(' • ')}</small>`;
    } else {
      if (act.combat) {
        btn.innerHTML = `⚔️ ${act.description}`;
        btn.classList.add('btn-action-combat');
      } else {
        btn.innerText = act.description;
      }
      btn.onclick = () => executeAction(act);
    }
    list.appendChild(btn);
  });
}

function executeAction(act) {
  AudioManager.playSFX('sfx_action');

  if (act.once && !state.completedActions.includes(act.action_id)) {
    state.completedActions.push(act.action_id);
  }

  if (act.sets_flag) {
    if (typeof act.sets_flag === 'string') state.flags[act.sets_flag] = true;
    else Object.assign(state.flags, act.sets_flag);
  }

  if (act.stat_changes) {
    Object.keys(act.stat_changes).forEach(k => {
      const cfg = GAME_DATA.stats_config[k];
      const maxVal = cfg ? cfg.max : 100;
      const before = state.stats[k] || 0;
      state.stats[k] = Math.max(0, Math.min(maxVal, before + act.stat_changes[k]));
      showStatFloat(k, state.stats[k] - before);
      if (act.stat_changes[k] < 0 && navigator.vibrate) {
        navigator.vibrate(150);
        AudioManager.playSFX('sfx_danger');
      }
    });
    renderStats();
  }

  if (act.unlocked_item_id && !state.inventory.includes(act.unlocked_item_id)) {
    state.inventory.push(act.unlocked_item_id);
    const item = getAllEpisodeItems().find(i => i.id === act.unlocked_item_id);
    if (item) showToast(`🎁 Didapat: <strong>${item.emoji} ${item.name}</strong>`, 'success', 2400);
  }
  if (act.unlocked_item_ids) {
    act.unlocked_item_ids.forEach(id => {
      if (!state.inventory.includes(id)) {
        state.inventory.push(id);
        const item = getAllEpisodeItems().find(i => i.id === id);
        if (item) showToast(`🎁 Didapat: <strong>${item.emoji} ${item.name}</strong>`, 'success', 2200);
      }
    });
  }

  if (act.unlock_location_id && !state.unlockedLocations.includes(act.unlock_location_id)) {
    state.unlockedLocations.push(act.unlock_location_id);
  }

  if (act.combat) {
    CombatSystem.combatDef = act.combat;
    CombatSystem.actionIdForRollback = act.action_id;
    showCombatHUD();
    CombatSystem.start(act.combat.enemy);
    return;
  }

  if (checkEndingTriggers(act)) return;

  if (act.next_location_id) {
    state.currentLocationId = act.next_location_id;
    renderLocation(act.next_location_id);
  } else if (act.outcome) {
    startTypewriter(act.outcome, () => {
      if (act.re_render_actions) renderActions(state.currentEpisode.locations.find(l => l.id === state.currentLocationId).action_options);
      else renderLocation(state.currentLocationId);
    });
  } else {
    renderLocation(state.currentLocationId);
  }
}

function checkEndingTriggers(act) {
  let triggeredEnding = null;

  if (act.trigger_ending_id && state.currentEpisode.endings) {
    triggeredEnding = state.currentEpisode.endings[act.trigger_ending_id];
  } else if (state.stats.stat1 <= 0 || state.stats.stat2 <= 0) {
    triggeredEnding = (state.currentEpisode.endings && state.currentEpisode.endings['stat_zero_ending']) || {
      title: "BAD ENDING: Keterpurukan Fisik & Cedera",
      narrative: "Stamina atau Ketenangan Batin Anda habis total. Tubuh Anda ambruk akibat dipaksa bertarung tanpa perhitungan matang, mengakhiri impian Anda di panggung petarung."
    };
  } else if (state.stats.stat3 <= 0) {
    triggeredEnding = (state.currentEpisode.endings && state.currentEpisode.endings['stat3_zero_ending']) || {
      title: "BAD ENDING: Reputasi Hancur & Nama Baik Terbuang",
      narrative: "Reputasi Anda menyentuh angka 0% akibat skandal atau tindakan tidak terpuji. Anda dikeluarkan dari liga dan nama baik Anda hancur selamanya."
    };
  }

  if (triggeredEnding) {
    showEnding(triggeredEnding);
    return true;
  }
  return false;
}

function showEnding(ending) {
  switchScreen('ending-screen');
  document.getElementById('ending-title').innerText = ending.title;
  document.getElementById('ending-desc').innerText = ending.narrative;
  const endingScreen = document.getElementById('ending-screen');
  let nextBtn = document.getElementById('btn-next-ep');

  if (ending.next_episode_id) {
    if (!nextBtn) {
      nextBtn = document.createElement('button');
      nextBtn.id = 'btn-next-ep';
      nextBtn.className = 'btn-main';
      nextBtn.style.marginTop = '12px';
      nextBtn.style.backgroundColor = '#16a34a';
      endingScreen.appendChild(nextBtn);
    }
    nextBtn.style.display = 'block';
    nextBtn.innerText = 'Lanjut ke Episode Berikutnya ➡️';
    nextBtn.onclick = () => advanceToNextEpisode(ending.next_episode_id);
  } else if (nextBtn) {
    nextBtn.style.display = 'none';
  }
  localStorage.removeItem('liga_petarung_save');
}

function setupEventListeners() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.onclick = (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.modal-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      if (tab === 'inventory') {
        document.getElementById('inventory-panel').classList.add('active');
        renderInventory();
      } else if (tab === 'crafting') {
        document.getElementById('crafting-panel').classList.add('active');
        renderCraftingPanel();
      }
    };
  });
  document.getElementById('btn-execute-craft').onclick = executeCrafting;
  document.getElementById('btn-restart').onclick = () => location.reload();
  document.getElementById('audio-toggle').onclick = () => {
    state.isAudioMuted = !state.isAudioMuted;
    document.getElementById('audio-toggle').innerText = state.isAudioMuted ? '🔇' : '🔊';
    if (!state.isAudioMuted) AudioManager.playBGM();
  };
}

function getAllEpisodeItems() {
  let allItems = [];
  if (GAME_DATA.episodes) {
    GAME_DATA.episodes.forEach(ep => {
      if (ep.items) ep.items.forEach(it => {
        if (!allItems.some(x => x.id === it.id)) allItems.push(it);
      });
    });
  }
  return allItems;
}

function renderInventory() {
  const container = document.getElementById('inventory-list');
  container.innerHTML = '';
  const allItems = getAllEpisodeItems();
  if (state.inventory.length === 0) {
    container.innerHTML = `<p style="grid-column: span 2; font-size:0.85rem; opacity:0.6; text-align:center;">Tas inventaris Anda masih kosong.</p>`;
    return;
  }
  state.inventory.forEach(itemId => {
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      container.innerHTML += `
        <div class="item-card">
          <strong>${item.emoji || '📦'} ${item.name}</strong>
          <p style="font-size:0.75rem; margin-top:4px; opacity:0.8;">${item.description}</p>
        </div>
      `;
    }
  });
}

function renderCraftingPanel() {
  const container = document.getElementById('craft-inventory-list');
  container.innerHTML = '';
  state.selectedCraftItems = [];
  const allItems = getAllEpisodeItems();
  if (state.inventory.length === 0) {
    container.innerHTML = `<p style="grid-column: span 2; font-size:0.85rem; opacity:0.6; text-align:center;">Belum ada item di tas untuk dirakit.</p>`;
    return;
  }
  state.inventory.forEach(itemId => {
    const item = allItems.find(i => i.id === itemId);
    if (item) {
      let card = document.createElement('div');
      card.className = 'item-card';
      card.innerHTML = `<strong>${item.emoji || '📦'} ${item.name}</strong>`;
      card.onclick = () => {
        if (state.selectedCraftItems.includes(itemId)) {
          state.selectedCraftItems = state.selectedCraftItems.filter(id => id !== itemId);
          card.classList.remove('selected');
        } else if (state.selectedCraftItems.length < 3) {
          state.selectedCraftItems.push(itemId);
          card.classList.add('selected');
        }
      };
      container.appendChild(card);
    }
  });
}

function executeCrafting() {
  let allRecipes = [];
  if (GAME_DATA.episodes) {
    GAME_DATA.episodes.forEach(ep => {
      if (ep.recipes) allRecipes = allRecipes.concat(ep.recipes);
    });
  }
  const match = allRecipes.find(r => {
    return r.required_item_ids.length === state.selectedCraftItems.length &&
      r.required_item_ids.every(id => state.selectedCraftItems.includes(id));
  });

  if (match) {
    AudioManager.playSFX('sfx_action');
    match.required_item_ids.forEach(id => {
      const idx = state.inventory.indexOf(id);
      if (idx > -1) state.inventory.splice(idx, 1);
    });
    showToast(`✅ <strong>BERHASIL DIRAKIT</strong><br>${match.result_item_name}<br><small>${match.description}</small>`, 'success', 3600);
    if (match.reward_stat_changes) {
      Object.keys(match.reward_stat_changes).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const maxVal = cfg ? cfg.max : 100;
        const before = state.stats[k] || 0;
        state.stats[k] = Math.min(maxVal, before + match.reward_stat_changes[k]);
        showStatFloat(k, state.stats[k] - before);
      });
      renderStats();
    }
    state.selectedCraftItems = [];
    renderCraftingPanel();
    const loc = state.currentEpisode.locations.find(l => l.id === state.currentLocationId);
    if (loc && loc.action_options) renderActions(loc.action_options);
    saveGame();
  } else {
    AudioManager.playSFX('sfx_danger');
    showToast("❌ <strong>GAGAL DIRAKIT</strong><br>Kombinasi item tidak cocok!", 'error', 3200);
  }
}

function saveGame() {
  if (CombatSystem.active) return;
  localStorage.setItem('liga_petarung_save', JSON.stringify(state));
}

function loadGame() {
  let saved = localStorage.getItem('liga_petarung_save');
  if (saved) {
    try {
      state = JSON.parse(saved);
    } catch (e) {
      showToast("⚠️ Save data corrupt, mulai baru.", "error");
      localStorage.removeItem('liga_petarung_save');
      location.reload();
      return;
    }
    if (!state.completedActions) state.completedActions = [];
    if (!state.selectedCraftItems) state.selectedCraftItems = [];
    if (!state.flags) state.flags = {};
    if (!state.currentStance) state.currentStance = 'traditional';
    switchScreen('game-screen');
    if (state.currentEpisode) {
      document.getElementById('episode-title').innerText = state.currentEpisode.title.split(':')[0] || "Episode";
    }
    renderStats();
    renderLocation(state.currentLocationId);
    AudioManager.playBGM();
  }
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}
