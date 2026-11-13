/**
 * ENGINE.JS - Core Engine Modular Game Interaktif
 * Liga Petarung: Dari Padepokan ke Puncak Dunia
 * v2.0 - Audit & Refactor: once actions, requirements, toast, craft consumption
 */

let state = {
  currentEpisode: null,
  currentLocationId: null,
  stats: {},
  inventory: [],
  unlockedLocations: [],
  selectedCraftItems: [],
  completedActions: [],      // NEW: track once-per-action
  isAudioMuted: false,
  isTypewriterActive: false,
  typewriterTimer: null
};

// --- Audio Manager dengan Fallback Offline ---
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
    this.bgmAudio.play().catch(() => { /* handled by user gesture */ });
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
      let osc = this.audioCtx.createOscillator();
      let gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === 'sfx_danger') {
        osc.frequency.setValueAtTime(150, this.audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      } else {
        osc.frequency.setValueAtTime(600, this.audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
      }

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.2);
    } catch (e) { /* Web Audio tidak didukung */ }
  }
};

// --- Toast Notification System (auto-created DOM) ---
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

  // Trigger animation frame
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 350);
  }, duration);
}

// --- Init Game ---
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
  state.completedActions = [];   // reset pada new game
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

  state.stats.stat3 = (state.stats.stat3 || 20) + 25;
  state.stats.stat1 = Math.min(
    GAME_DATA.stats_config.stat1.max,
    (state.stats.stat1 || 100) + 20
  );

  if (!state.unlockedLocations.includes(nextEp.start_location_id)) {
    state.unlockedLocations.push(nextEp.start_location_id);
  }

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
        <div class="bar-bg">
          <div class="bar-fill" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  });
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

  startTypewriter(loc.narrative, () => {
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
    if (i >= text.length) {
      completeTypewriter(text, onComplete);
    }
  }, 20);

  skipBtn.onclick = () => {
    completeTypewriter(text, onComplete);
  };
}

function completeTypewriter(text, onComplete) {
  clearInterval(state.typewriterTimer);
  document.getElementById('narrative-box').innerText = text;
  document.getElementById('skip-btn').style.display = 'none';
  state.isTypewriterActive = false;
  if (onComplete) onComplete();
}

// --- Action Rendering (with `once` + requirements) ---
function renderActions(actions) {
  const list = document.getElementById('action-list');
  list.innerHTML = '';

  if (!actions) return;

  const allItems = getAllEpisodeItems();

  actions.forEach(act => {
    // 1) Sembunyikan aksi yang sudah pernah diambil (once)
    if (act.once && state.completedActions && state.completedActions.includes(act.action_id)) {
      return;
    }

    let btn = document.createElement('button');
    btn.className = 'btn-action';

    // 2) Cek syarat item & stat
    const missingReqs = [];

    if (act.required_item_id && !state.inventory.includes(act.required_item_id)) {
      const item = allItems.find(i => i.id === act.required_item_id);
      missingReqs.push(`Butuh: ${item ? item.name : act.required_item_id}`);
    }

    if (act.required_stat) {
      Object.keys(act.required_stat).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const curVal = state.stats[k] || 0;
        if (curVal < act.required_stat[k]) {
          missingReqs.push(`${cfg ? cfg.name : k} ≥ ${act.required_stat[k]}`);
        }
      });
    }

    if (missingReqs.length > 0) {
      btn.disabled = true;
      btn.classList.add('btn-action-disabled');
      btn.innerHTML = `${act.description}<br><small class="req-hint">🔒 ${missingReqs.join(' • ')}</small>`;
    } else {
      btn.innerText = act.description;
      btn.onclick = () => executeAction(act);
    }

    list.appendChild(btn);
  });
}

function executeAction(act) {
  AudioManager.playSFX('sfx_action');

  // Track once-actions
  if (act.once && !state.completedActions.includes(act.action_id)) {
    state.completedActions.push(act.action_id);
  }

  // Update Status
  if (act.stat_changes) {
    Object.keys(act.stat_changes).forEach(k => {
      const cfg = GAME_DATA.stats_config[k];
      const maxVal = cfg ? cfg.max : 100;
      state.stats[k] = Math.max(0, Math.min(maxVal, (state.stats[k] || 0) + act.stat_changes[k]));
      if (act.stat_changes[k] < 0 && navigator.vibrate) {
        navigator.vibrate(200);
        AudioManager.playSFX('sfx_danger');
      }
    });
    renderStats();
  }

  // Tambah item tunggal
  if (act.unlocked_item_id && !state.inventory.includes(act.unlocked_item_id)) {
    state.inventory.push(act.unlocked_item_id);
  }

  // Tambah banyak item (support baru)
  if (act.unlocked_item_ids && Array.isArray(act.unlocked_item_ids)) {
    act.unlocked_item_ids.forEach(id => {
      if (!state.inventory.includes(id)) state.inventory.push(id);
    });
  }

  if (act.unlock_location_id && !state.unlockedLocations.includes(act.unlock_location_id)) {
    state.unlockedLocations.push(act.unlock_location_id);
  }

  if (checkEndingTriggers(act)) return;

  if (act.next_location_id) {
    state.currentLocationId = act.next_location_id;
    renderLocation(act.next_location_id);
  } else if (act.outcome) {
    startTypewriter(act.outcome, () => {
      renderLocation(state.currentLocationId);
    });
  }
}

// --- Ending Triggers (dengan fallback default) ---
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
      narrative: "Reputasi Anda menyentuh angka 0% akibat skandal, kecurangan, atau tindakan tidak terpuji. Anda dikeluarkan dari liga dan nama baik Anda hancur selamanya."
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

// --- Modals & Inventory ---
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
  };
}

function getAllEpisodeItems() {
  let allItems = [];
  if (GAME_DATA.episodes) {
    GAME_DATA.episodes.forEach(ep => {
      if (ep.items) {
        ep.items.forEach(it => {
          if (!allItems.some(x => x.id === it.id)) allItems.push(it);
        });
      }
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

// --- Crafting (dengan konsumsi material & toast) ---
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

    // KONSUMSI MATERIAL — anti infinite-craft exploit
    match.required_item_ids.forEach(id => {
      const idx = state.inventory.indexOf(id);
      if (idx > -1) state.inventory.splice(idx, 1);
    });

    showToast(`✅ <strong>BERHASIL DIRAKIT</strong><br>${match.result_item_name}<br><small>${match.description}</small>`, 'success', 3600);

    if (match.reward_stat_changes) {
      Object.keys(match.reward_stat_changes).forEach(k => {
        const cfg = GAME_DATA.stats_config[k];
        const maxVal = cfg ? cfg.max : 100;
        state.stats[k] = Math.min(maxVal, (state.stats[k] || 0) + match.reward_stat_changes[k]);
      });
      renderStats();
    }

    state.selectedCraftItems = [];
    renderCraftingPanel();

    // Re-render actions agar tombol requirement update dengan stat baru
    const loc = state.currentEpisode.locations.find(l => l.id === state.currentLocationId);
    if (loc && loc.action_options) renderActions(loc.action_options);

    saveGame();
  } else {
    AudioManager.playSFX('sfx_danger');
    showToast("❌ <strong>GAGAL DIRAKIT</strong><br>Kombinasi item tidak cocok atau tidak menghasilkan reaksi apapun!", 'error', 3200);
  }
}

// --- Save / Load ---
function saveGame() {
  localStorage.setItem('liga_petarung_save', JSON.stringify(state));
}

function loadGame() {
  let saved = localStorage.getItem('liga_petarung_save');
  if (saved) {
    state = JSON.parse(saved);
    // Backward-compat: save lama belum punya field ini
    if (!state.completedActions) state.completedActions = [];
    if (!state.selectedCraftItems) state.selectedCraftItems = [];

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