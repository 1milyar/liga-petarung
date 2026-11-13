/**
 * ENGINE.JS - Liga Petarung v4.0
 * Telegraphed Combat, Dialogue System, Narrative Bridge, Category Crafting
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
        [523, 659, 784, 1047].forEach((freq, i) => {
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
        [392, 330, 262, 196].forEach((freq, i) => {
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
  const c = document.getElementById('app-container');
  if (!c) return;
  const cls = `shake-${intensity}`;
  c.classList.remove('shake-light', 'shake-medium', 'shake-heavy');
  void c.offsetWidth;
  c.classList.add(cls);
  setTimeout(() => c.classList.remove(cls), 450);
}

function showFloatingDamage(amount, targetId, isHeal = false) {
  const target = document.getElementById(targetId);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = `floating-damage ${isHeal ? 'heal' : 'dmg'}`;
  el.innerText = isHeal ? `+${amount}` : `-${Math.abs(amount)}`;
  el.style.left = (rect.left + rect.width / 2 - 20) + 'px';
  el.style.top = rect.top + 'px';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1200);
}

function showStatFloat(statKey, delta) {
  if (!delta) return;
  const cfg = GAME_DATA.stats_config[statKey];
  if (!cfg) return;
  const el = document.createElement('div');
  el.className = `stat-float ${delta > 0 ? 'positive' : 'negative'}`;
  el.innerText = `${delta > 0 ? '+' : ''}${delta} ${cfg.icon}`;
  el.style.bottom = '140px';
  el.style.left = (20 + Math.random() * 60) + '%';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

// ============================================================
// TRANSITION SCREEN
// ============================================================
function showTransition(text, callback) {
  const el = document.getElementById('transition-screen');
  const textEl = el.querySelector('.transition-text');
  const hint = el.querySelector('.transition-hint');
  textEl.innerText = text;
  hint.style.opacity = '0';
  el.classList.add('active');

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    el.classList.remove('active');
    el.removeEventListener('click', dismiss);
    document.removeEventListener('keydown', keyHandler);
    if (callback) callback();
  };
  const keyHandler = (e) => { if (e.key === 'Enter' || e.key === ' ') dismiss(); };

  setTimeout(() => { hint.style.opacity = '1'; }, 700);
  setTimeout(() => {
    el.addEventListener('click', dismiss);
    document.addEventListener('keydown', keyHandler);
  }, 400);
}

// ============================================================
// COMBAT SYSTEM - Telegraphed Narrative Rounds
// ============================================================
const CombatSystem = {
  active: false,
  def: null,
  roundIdx: 0,
  debuffs: [],

  start(def) {
    this.active = true;
    this.def = def;
    this.roundIdx = 0;
    this.debuffs = [];
    document.getElementById('combat-hud').classList.add('active');
    AudioManager.playSFX('sfx_action');
    this.showIntro();
  },

  showIntro() {
    const hud = document.getElementById('combat-hud');
    hud.querySelector('#combat-enemy-name').innerText = `${this.def.enemy_emoji || '🥋'} ${this.def.enemy_name}`;
    hud.querySelector('#combat-round-indicator').innerText = `PERTARUNGAN`;
    hud.querySelector('#combat-narration').innerHTML = `<p>${this.def.intro}</p>`;
    hud.querySelector('#combat-debuffs').innerHTML = '';
    this.updatePlayerHp();

    const optionsEl = hud.querySelector('#combat-options');
    optionsEl.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'combat-btn combat-btn-wide';
    btn.innerHTML = '⚔️ Mulai Ronde 1';
    btn.onclick = () => this.renderRound();
    optionsEl.appendChild(btn);
  },

  updatePlayerHp() {
    const hud = document.getElementById('combat-hud');
    const hp = state.stats.stat1 || 0;
    const maxHp = GAME_DATA.stats_config.stat1.max;
    const pct = Math.max(0, (hp / maxHp) * 100);
    hud.querySelector('#combat-player-hp-fill').style.width = pct + '%';
    hud.querySelector('#combat-player-hp-text').innerText = `${hp}/${maxHp}`;
    const qi = state.stats.stat2 || 0;
    const maxQi = GAME_DATA.stats_config.stat2.max;
    hud.querySelector('#combat-player-qi-fill').style.width = ((qi / maxQi) * 100) + '%';
    hud.querySelector('#combat-player-qi-text').innerText = `${qi}/${maxQi}`;
  },

  renderRound() {
    const round = this.def.rounds[this.roundIdx];
    if (!round) { this.endCombat(true); return; }

    const hud = document.getElementById('combat-hud');
    hud.querySelector('#combat-round-indicator').innerText = `RONDE ${round.round} / ${this.def.rounds.length}`;
    hud.querySelector('#combat-narration').innerHTML = `<p class="telegraph-text">${round.telegraph}</p>`;

    const debuffEl = hud.querySelector('#combat-debuffs');
    if (this.debuffs.length > 0) {
      debuffEl.innerHTML = this.debuffs.map(d =>
        `<span class="debuff-badge">⚠️ ${d.name}</span>`
      ).join('');
    } else {
      debuffEl.innerHTML = '';
    }

    this.updatePlayerHp();

    const optionsEl = hud.querySelector('#combat-options');
    optionsEl.innerHTML = '';

    round.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'combat-option';

      const missing = [];
      if (opt.required_stat) {
        Object.keys(opt.required_stat).forEach(k => {
          if ((state.stats[k] || 0) < opt.required_stat[k]) {
            const cfg = GAME_DATA.stats_config[k];
            missing.push(`${cfg.icon} ${cfg.name} ≥ ${opt.required_stat[k]}`);
          }
        });
      }

      if (missing.length > 0) {
        btn.disabled = true;
        btn.innerHTML = `${opt.label}<br><small class="req-hint">🔒 ${missing.join(' • ')}</small>`;
      } else {
        btn.innerText = opt.label;
        btn.onclick = () => this.chooseOption(opt);
      }
      optionsEl.appendChild(btn);
    });
  },

  chooseOption(opt) {
    AudioManager.playSFX(opt.vibrate ? 'sfx_danger' : 'sfx_action');
    if (opt.vibrate && navigator.vibrate) navigator.vibrate(200);

    if (opt.stat_changes) {
      Object.keys(opt.stat_changes).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const max = cfg ? cfg.max : 100;
        const before = state.stats[k] || 0;
        state.stats[k] = Math.max(0, Math.min(max, before + opt.stat_changes[k]));
        showStatFloat(k, state.stats[k] - before);
      });
      renderStats();
      this.updatePlayerHp();
    }

    if (opt.debuff && !this.debuffs.find(d => d.name === opt.debuff.name)) {
      this.debuffs.push(opt.debuff);
    }

    const dmg = opt.stat_changes && opt.stat_changes.stat1;
    if (dmg && dmg <= -20) triggerScreenShake('heavy');
    else if (dmg && dmg <= -10) triggerScreenShake('medium');
    else if (dmg && dmg < 0) triggerScreenShake('light');

    if (dmg && dmg < 0) showFloatingDamage(dmg, 'combat-player-hp-fill');

    this.showOutcome(opt);
  },

  showOutcome(opt) {
    const hud = document.getElementById('combat-hud');
    hud.querySelector('#combat-narration').innerHTML = `<p class="outcome-text">${opt.outcome}</p>`;
    const optionsEl = hud.querySelector('#combat-options');
    optionsEl.innerHTML = '';

    // Immediate defeat check
    if (state.stats.stat1 <= 0 || state.stats.stat2 <= 0 || state.stats.stat3 <= 0) {
      const btn = document.createElement('button');
      btn.className = 'combat-btn combat-btn-wide combat-btn-danger';
      btn.innerText = '💀 Tubuh Tak Mampu Lagi...';
      btn.onclick = () => this.endCombat(false);
      optionsEl.appendChild(btn);
      return;
    }

    this.roundIdx++;

    if (this.roundIdx >= this.def.rounds.length) {
      const btn = document.createElement('button');
      btn.className = 'combat-btn combat-btn-wide combat-btn-success';
      btn.innerText = '🏆 Selesaikan Pertarungan';
      btn.onclick = () => this.endCombat(true);
      optionsEl.appendChild(btn);
    } else {
      const btn = document.createElement('button');
      btn.className = 'combat-btn combat-btn-wide';
      btn.innerText = '→ Ronde Berikutnya';
      btn.onclick = () => this.renderRound();
      optionsEl.appendChild(btn);
    }
  },

  endCombat(victory) {
    const outcome = victory ? this.def.victory : this.def.defeat;

    if (!victory && this.def._actionId) {
      state.completedActions = state.completedActions.filter(id => id !== this.def._actionId);
    }

    const splash = document.createElement('div');
    splash.className = `combat-splash ${victory ? 'victory' : 'defeat'}`;
    splash.innerHTML = `
      <div class="splash-title">${victory ? '⚔️ KEMENANGAN' : '💀 KEKALAHAN'}</div>
      <div class="splash-sub">${victory ? this.def.enemy_name + ' tumbang' : 'Anda tumbang di tangan ' + this.def.enemy_name}</div>
    `;
    document.body.appendChild(splash);
    AudioManager.playSFX(victory ? 'sfx_victory' : 'sfx_defeat');

    setTimeout(() => {
      splash.remove();
      document.getElementById('combat-hud').classList.remove('active');
      this.active = false;
      this.applyOutcome(outcome);
    }, 1700);
  },

  applyOutcome(outcome) {
    if (!outcome) { renderLocation(state.currentLocationId); return; }

    if (outcome.stat_changes) {
      Object.keys(outcome.stat_changes).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const max = cfg ? cfg.max : 100;
        const before = state.stats[k] || 0;
        state.stats[k] = Math.max(0, Math.min(max, before + outcome.stat_changes[k]));
        showStatFloat(k, state.stats[k] - before);
      });
      renderStats();
    }

    if (outcome.unlocked_item_id && !state.inventory.includes(outcome.unlocked_item_id)) {
      state.inventory.push(outcome.unlocked_item_id);
      const item = getAllEpisodeItems().find(i => i.id === outcome.unlocked_item_id);
      if (item) showToast(`🎁 Didapat: <strong>${item.emoji} ${item.name}</strong>`, 'success');
    }
    if (outcome.unlocked_item_ids) {
      outcome.unlocked_item_ids.forEach(id => {
        if (!state.inventory.includes(id)) {
          state.inventory.push(id);
          const item = getAllEpisodeItems().find(i => i.id === id);
          if (item) showToast(`🎁 Didapat: <strong>${item.emoji} ${item.name}</strong>`, 'success');
        }
      });
    }
    if (outcome.sets_flag) {
      if (typeof outcome.sets_flag === 'string') state.flags[outcome.sets_flag] = true;
      else Object.assign(state.flags, outcome.sets_flag);
    }

    if (outcome.trigger_ending_id && state.currentEpisode.endings) {
      const ending = state.currentEpisode.endings[outcome.trigger_ending_id];
      if (ending) { showEnding(ending); return; }
    }

    if (state.stats.stat1 <= 0 || state.stats.stat2 <= 0 || state.stats.stat3 <= 0) {
      if (checkEndingTriggers({})) return;
    }

    if (outcome.next_location_id) {
      goToLocation(outcome.next_location_id, outcome.transition_text);
    } else if (outcome.outcome) {
      startTypewriter(outcome.outcome, () => renderLocation(state.currentLocationId));
    } else {
      renderLocation(state.currentLocationId);
    }
    saveGame();
  }
};

// ============================================================
// DIALOGUE SYSTEM - Adaptive Dialogue with Traps
// ============================================================
const DialogueSystem = {
  active: false,
  def: null,
  onComplete: null,

  start(def, onComplete) {
    this.active = true;
    this.def = def;
    this.onComplete = onComplete;
    document.getElementById('dialogue-overlay').classList.add('active');
    this.render();
  },

  render() {
    const ov = document.getElementById('dialogue-overlay');
    ov.querySelector('#dialogue-npc').innerText = this.def.npc;
    ov.querySelector('#dialogue-personality').innerText = `Kepribadian: ${this.def.npc_personality}`;

    const exprEl = ov.querySelector('#dialogue-expressions');
    exprEl.innerHTML = this.def.micro_expressions.map(e =>
      `<div class="micro-expr">👁️ ${e}</div>`
    ).join('');

    ov.querySelector('#dialogue-narrative').innerText = this.def.narrative;

    const optsEl = ov.querySelector('#dialogue-options');
    optsEl.innerHTML = '';

    this.def.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'dialogue-option';

      const missing = [];
      if (opt.required_stat) {
        Object.keys(opt.required_stat).forEach(k => {
          if ((state.stats[k] || 0) < opt.required_stat[k]) {
            const cfg = GAME_DATA.stats_config[k];
            missing.push(`${cfg.icon} ${cfg.name} ≥ ${opt.required_stat[k]}`);
          }
        });
      }

      if (missing.length > 0) {
        btn.disabled = true;
        btn.innerHTML = `${opt.description}<br><small class="req-hint">🔒 ${missing.join(' • ')}</small>`;
      } else {
        btn.innerText = opt.description;
        btn.onclick = () => this.chooseOption(opt);
      }
      optsEl.appendChild(btn);
    });
  },

  chooseOption(opt) {
    AudioManager.playSFX(opt.is_trap ? 'sfx_danger' : 'sfx_action');

    if (opt.stat_changes) {
      Object.keys(opt.stat_changes).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const max = cfg ? cfg.max : 100;
        const before = state.stats[k] || 0;
        state.stats[k] = Math.max(0, Math.min(max, before + opt.stat_changes[k]));
        showStatFloat(k, state.stats[k] - before);
      });
      renderStats();
    }

    if (opt.unlocked_item_id && !state.inventory.includes(opt.unlocked_item_id)) {
      state.inventory.push(opt.unlocked_item_id);
      const item = getAllEpisodeItems().find(i => i.id === opt.unlocked_item_id);
      if (item) showToast(`🎁 Didapat: <strong>${item.emoji} ${item.name}</strong>`, 'success');
    }

    if (opt.sets_flag) {
      if (typeof opt.sets_flag === 'string') state.flags[opt.sets_flag] = true;
      else Object.assign(state.flags, opt.sets_flag);
    }

    const ov = document.getElementById('dialogue-overlay');
    ov.querySelector('#dialogue-narrative').innerHTML = `<p class="dialogue-outcome">${opt.outcome}</p>`;
    ov.querySelector('#dialogue-options').innerHTML = '';

    const cont = document.createElement('button');
    cont.className = 'dialogue-option dialogue-continue';
    cont.innerText = '→ Lanjutkan';
    cont.onclick = () => this.close();
    ov.querySelector('#dialogue-options').appendChild(cont);
  },

  close() {
    this.active = false;
    document.getElementById('dialogue-overlay').classList.remove('active');
    if (this.onComplete) this.onComplete();
    saveGame();
  }
};

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

// ============================================================
// EPISODE LOCKING
// ============================================================
function getUnlockedEpisodes() {
  try {
    return JSON.parse(localStorage.getItem('liga_petarung_unlocked_episodes') || '[]');
  } catch (e) { return []; }
}

function isEpisodeUnlocked(epId) {
  if (!GAME_DATA.episodes || GAME_DATA.episodes.length === 0) return false;
  if (epId === GAME_DATA.episodes[0].id) return true;
  return getUnlockedEpisodes().includes(epId);
}

function unlockEpisode(epId) {
  const unlocked = getUnlockedEpisodes();
  if (!unlocked.includes(epId)) {
    unlocked.push(epId);
    localStorage.setItem('liga_petarung_unlocked_episodes', JSON.stringify(unlocked));
  }
}

function renderTitleScreen() {
  const epContainer = document.getElementById('episode-list');
  epContainer.innerHTML = '';

  GAME_DATA.episodes.forEach((ep, idx) => {
    const unlocked = isEpisodeUnlocked(ep.id);
    const btn = document.createElement('button');
    btn.className = 'btn-main episode-btn';
    if (unlocked) {
      btn.innerHTML = `${ep.title}<br><small class="ep-synopsis">${ep.synopsis || ''}</small>`;
      btn.onclick = () => startEpisode(ep.id);
    } else {
      btn.disabled = true;
      btn.classList.add('episode-locked');
      const prevEp = GAME_DATA.episodes[idx - 1];
      btn.innerHTML = `🔒 ${ep.title}<br><small class="ep-synopsis">Selesaikan "${prevEp ? prevEp.title.split(':')[0] : 'episode sebelumnya'}" untuk membuka</small>`;
    }
    epContainer.appendChild(btn);
  });

  const saveBtn = document.getElementById('btn-continue');
  const saved = localStorage.getItem('liga_petarung_save');
  if (saved) {
    try {
      const s = JSON.parse(saved);
      if (s.currentEpisode) {
        saveBtn.style.display = 'block';
        saveBtn.innerHTML = `Lanjutkan: ${s.currentEpisode.title.split(':')[0]}`;
        saveBtn.onclick = () => loadGame();
      } else {
        saveBtn.style.display = 'none';
      }
    } catch (e) {
      saveBtn.style.display = 'none';
    }
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

  unlockEpisode(nextEpId);

  state.currentEpisode = nextEp;
  state.currentLocationId = nextEp.start_location_id;
  state.stats.stat3 = Math.min(100, (state.stats.stat3 || 20) + 25);
  state.stats.stat1 = Math.min(GAME_DATA.stats_config.stat1.max, (state.stats.stat1 || 100) + 20);
  if (!state.unlockedLocations.includes(nextEp.start_location_id)) {
    state.unlockedLocations.push(nextEp.start_location_id);
  }
  state.completedActions = [];
  saveGame();
  switchScreen('game-screen');
  document.getElementById('episode-title').innerText = nextEp.title.split(':')[0] || "Episode";
  renderStats();
  renderLocation(state.currentLocationId);
  AudioManager.playBGM();
}

// ============================================================
// RENDERING
// ============================================================
function renderStats() {
  const container = document.getElementById('stats-container');
  container.innerHTML = '';
  Object.keys(GAME_DATA.stats_config).forEach(key => {
    const cfg = GAME_DATA.stats_config[key];
    const val = state.stats[key] !== undefined ? state.stats[key] : cfg.initial;
    const pct = Math.max(0, Math.min(100, (val / cfg.max) * 100));
    container.innerHTML += `
      <div class="stat-box">
        <div class="stat-label"><span>${cfg.icon} ${cfg.name}</span><span>${val}</span></div>
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

  state.currentLocationId = locId;
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
    renderActions(loc.action_options, loc);
  });
}

function goToLocation(locId, transitionText) {
  state.currentLocationId = locId;
  if (transitionText) {
    showTransition(transitionText, () => renderLocation(locId));
  } else {
    renderLocation(locId);
  }
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
  }, 16);
  skipBtn.onclick = () => completeTypewriter(text, onComplete);
}

function completeTypewriter(text, onComplete) {
  clearInterval(state.typewriterTimer);
  document.getElementById('narrative-box').innerText = text;
  document.getElementById('skip-btn').style.display = 'none';
  state.isTypewriterActive = false;
  if (onComplete) onComplete();
}

// ============================================================
// ACTION RENDERING - Grouped by Category
// ============================================================
function renderActions(actions, location) {
  const list = document.getElementById('action-list');
  list.innerHTML = '';
  if (!actions && !location) return;

  const allItems = getAllEpisodeItems();
  const groups = {
    hub: { label: '🏠 Area Persiapan', actions: [] },
    exploration: { label: '🔍 Area Eksplorasi', actions: [] },
    arena: { label: '⚔️ Arena Pertarungan', actions: [] },
    other: { label: '📋 Aksi Lainnya', actions: [] }
  };

  if (actions) {
    actions.forEach(act => {
      if (act.once && state.completedActions.includes(act.action_id)) return;
      const cat = act.category || 'other';
      if (groups[cat]) groups[cat].actions.push(act);
      else groups.other.actions.push(act);
    });
  }

  // Auto-rest di hub
  if (location && location.rest_available && location.category === 'hub') {
    const restActionId = `auto_rest_${location.id}`;
    if (!state.completedActions.includes(restActionId)) {
      groups.hub.actions.push({
        action_id: restActionId,
        description: '😴 Duduk bersila, atur napas dan pulihkan tubuh',
        category: 'hub',
        once: true,
        outcome: 'Kau menutup mata, menarik napas panjang, dan merasakan aliran Qi kembali mengisi tubuh yang lelah. Sendi-sendi yang tadinya kaku mulai melunak.',
        stat_changes: { stat1: 15, stat2: 5 }
      });
    }
  }

  Object.keys(groups).forEach(cat => {
    const g = groups[cat];
    if (g.actions.length === 0) return;

    const header = document.createElement('div');
    header.className = `action-group-header group-${cat}`;
    header.innerText = g.label;
    list.appendChild(header);

    g.actions.forEach(act => {
      list.appendChild(createActionButton(act, allItems));
    });
  });
}

function createActionButton(act, allItems) {
  const btn = document.createElement('button');
  btn.className = 'btn-action';

  const missing = [];
  if (act.required_item_id && !state.inventory.includes(act.required_item_id)) {
    const item = allItems.find(i => i.id === act.required_item_id);
    missing.push(`Butuh: ${item ? item.name : act.required_item_id}`);
  }
  if (act.required_stat) {
    Object.keys(act.required_stat).forEach(k => {
      if ((state.stats[k] || 0) < act.required_stat[k]) {
        const cfg = GAME_DATA.stats_config[k];
        missing.push(`${cfg.icon} ${cfg.name} ≥ ${act.required_stat[k]}`);
      }
    });
  }

  if (missing.length > 0) {
    btn.disabled = true;
    btn.classList.add('btn-action-disabled');
    btn.innerHTML = `${act.description}<br><small class="req-hint">🔒 ${missing.join(' • ')}</small>`;
  } else {
    if (act.combat) { btn.innerHTML = `⚔️ ${act.description}`; btn.classList.add('btn-action-combat'); }
    else if (act.dialogue) { btn.innerHTML = `💬 ${act.description}`; btn.classList.add('btn-action-dialogue'); }
    else { btn.innerText = act.description; }
    btn.onclick = () => executeAction(act);
  }
  return btn;
}

// ============================================================
// ACTION EXECUTION
// ============================================================
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
      const max = cfg ? cfg.max : 100;
      const before = state.stats[k] || 0;
      state.stats[k] = Math.max(0, Math.min(max, before + act.stat_changes[k]));
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
    if (item) showToast(`🎁 Didapat: <strong>${item.emoji} ${item.name}</strong>`, 'success');
  }
  if (act.unlocked_item_ids) {
    act.unlocked_item_ids.forEach(id => {
      if (!state.inventory.includes(id)) {
        state.inventory.push(id);
        const item = getAllEpisodeItems().find(i => i.id === id);
        if (item) showToast(`🎁 Didapat: <strong>${item.emoji} ${item.name}</strong>`, 'success');
      }
    });
  }

  if (act.unlock_location_id && !state.unlockedLocations.includes(act.unlock_location_id)) {
    state.unlockedLocations.push(act.unlock_location_id);
  }

  if (checkEndingTriggers(act)) return;

  // Combat
  if (act.combat) {
    act.combat._actionId = act.action_id;
    CombatSystem.start(act.combat);
    return;
  }

  // Dialogue
  if (act.dialogue) {
    DialogueSystem.start(act.dialogue, () => {
      if (act.next_location_id) {
        goToLocation(act.next_location_id, act.transition_text);
      } else if (act.outcome) {
        startTypewriter(act.outcome, () => renderLocation(state.currentLocationId));
      } else {
        renderLocation(state.currentLocationId);
      }
    });
    return;
  }

  // Navigation with transition
  if (act.next_location_id) {
    goToLocation(act.next_location_id, act.transition_text);
    return;
  }

  // Regular outcome
  if (act.outcome) {
    startTypewriter(act.outcome, () => renderLocation(state.currentLocationId));
  } else {
    renderLocation(state.currentLocationId);
  }
}

// ============================================================
// ENDINGS
// ============================================================
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
      title: "BAD ENDING: Reputasi Hancur",
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

// ============================================================
// MODALS, INVENTORY, CRAFTING
// ============================================================
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
      } else {
        document.getElementById('main-content').style.display = 'flex';
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
  let all = [];
  if (GAME_DATA.episodes) {
    GAME_DATA.episodes.forEach(ep => {
      if (ep.items) ep.items.forEach(it => {
        if (!all.some(x => x.id === it.id)) all.push(it);
      });
    });
  }
  return all;
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
      const catLabel = item.category ? `[${item.category.toUpperCase()}]` : '';
      container.innerHTML += `
        <div class="item-card">
          <strong>${item.emoji || '📦'} ${item.name}</strong>
          ${catLabel ? `<div class="item-category">${catLabel}</div>` : ''}
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
      const card = document.createElement('div');
      card.className = 'item-card';
      const catLabel = item.category ? `[${item.category.toUpperCase()}]` : '';
      card.innerHTML = `<strong>${item.emoji || '📦'} ${item.name}</strong>${catLabel ? `<div class="item-category">${catLabel}</div>` : ''}`;
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
  GAME_DATA.episodes.forEach(ep => {
    if (ep.recipes) allRecipes = allRecipes.concat(ep.recipes);
  });

  const selected = state.selectedCraftItems.map(id => getAllEpisodeItems().find(i => i.id === id)).filter(Boolean);
  const categoryCount = {};
  selected.forEach(item => {
    if (item.category) categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });

  const match = allRecipes.find(r => {
    if (r.specific_item_ids) {
      return r.specific_item_ids.length === state.selectedCraftItems.length &&
        r.specific_item_ids.every(id => state.selectedCraftItems.includes(id));
    }
    if (r.required_categories) {
      const req = r.required_categories;
      const reqKeys = Object.keys(req);
      const selKeys = Object.keys(categoryCount);
      if (reqKeys.length !== selKeys.length) return false;
      return reqKeys.every(k => req[k] === categoryCount[k]);
    }
    if (r.required_item_ids) {
      return r.required_item_ids.length === state.selectedCraftItems.length &&
        r.required_item_ids.every(id => state.selectedCraftItems.includes(id));
    }
    return false;
  });

  if (match) {
    AudioManager.playSFX('sfx_action');
    match.required_item_ids && match.required_item_ids.forEach(id => {
      const i = state.inventory.indexOf(id);
      if (i > -1) state.inventory.splice(i, 1);
    });
    // For category-based: consume all selected items
    if (!match.required_item_ids) {
      state.selectedCraftItems.forEach(id => {
        const i = state.inventory.indexOf(id);
        if (i > -1) state.inventory.splice(i, 1);
      });
    }
    showToast(`✅ <strong>${match.result_item_name}</strong><br><small>${match.description}</small>`, 'success', 3800);
    if (match.reward_stat_changes) {
      Object.keys(match.reward_stat_changes).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const max = cfg ? cfg.max : 100;
        const before = state.stats[k] || 0;
        state.stats[k] = Math.min(max, before + match.reward_stat_changes[k]);
        showStatFloat(k, state.stats[k] - before);
      });
      renderStats();
    }
    state.selectedCraftItems = [];
    renderCraftingPanel();
    const loc = state.currentEpisode.locations.find(l => l.id === state.currentLocationId);
    if (loc) renderActions(loc.action_options, loc);
    saveGame();
  } else {
    AudioManager.playSFX('sfx_danger');
    showToast("❌ <strong>GAGAL DIRAKIT</strong><br>Kombinasi tidak cocok. Perhatikan kategori item.", 'error', 3200);
  }
}

// ============================================================
// SAVE / LOAD
// ============================================================
function saveGame() {
  if (CombatSystem.active || DialogueSystem.active) return;
  localStorage.setItem('liga_petarung_save', JSON.stringify(state));
}

function loadGame() {
  const saved = localStorage.getItem('liga_petarung_save');
  if (!saved) return;
  try {
    state = JSON.parse(saved);
  } catch (e) {
    showToast("⚠️ Save corrupt, mulai baru.", "error");
    localStorage.removeItem('liga_petarung_save');
    location.reload();
    return;
  }
  if (!state.completedActions) state.completedActions = [];
  if (!state.selectedCraftItems) state.selectedCraftItems = [];
  if (!state.flags) state.flags = {};
  if (!state.unlockedLocations) state.unlockedLocations = [];
  switchScreen('game-screen');
  if (state.currentEpisode) {
    document.getElementById('episode-title').innerText = state.currentEpisode.title.split(':')[0] || "Episode";
  }
  renderStats();
  renderLocation(state.currentLocationId);
  AudioManager.playBGM();
}

function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');
}
