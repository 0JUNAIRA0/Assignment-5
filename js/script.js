'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const heartCountEl = document.getElementById('heartcount');
  const coinCountEl = document.getElementById('coincount');
  const copyCountEl = document.getElementById('copycount');
  const historyListEl = document.getElementById('historyList');
  const clearBtn = document.getElementById('clearbtn');

  // LocalStorage state
  let hearts = parseInt(localStorage.getItem('es_hearts')) || 0;
  let coins = parseInt(localStorage.getItem('es_coins')) || 100;
  let copies = parseInt(localStorage.getItem('es_copies')) || 0;
  let callHistory = JSON.parse(localStorage.getItem('es_callHistory')) || [];
  const CALL_COST = 20;

  // Save state (without heart icon state)
  function saveState() {
    localStorage.setItem('es_hearts', hearts);
    localStorage.setItem('es_coins', coins);
    localStorage.setItem('es_copies', copies);
    localStorage.setItem('es_callHistory', JSON.stringify(callHistory));
  }

  function updateCountsUI() {
    heartCountEl.textContent = hearts;
    coinCountEl.textContent = coins;
    copyCountEl.textContent = copies;
  }

  function formatTime(date = new Date()) {
    return date.toLocaleString();
  }

  function renderHistory() {
    historyListEl.innerHTML = '';

    if (!callHistory || callHistory.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'text-gray-400 text-sm';
      empty.textContent = 'No call history yet.';
      historyListEl.appendChild(empty);
      return;
    }

    callHistory.forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'flex justify-between items-center bg-gray-50 p-3 rounded-lg';

      const left = document.createElement('div');
      left.className = 'flex flex-col';

      const nameEl = document.createElement('div');
      nameEl.className = 'font-semibold';
      nameEl.textContent = entry.name;

      const numEl = document.createElement('div');
      numEl.className = 'text-sm text-gray-500';
      numEl.textContent = entry.number;

      left.appendChild(nameEl);
      left.appendChild(numEl);

      const right = document.createElement('div');
      right.className = 'text-xs text-gray-400 text-right';
      right.textContent = entry.time;

      row.appendChild(left);
      row.appendChild(right);

      historyListEl.appendChild(row);
    });
  }

  
  updateCountsUI();
  renderHistory();


  document.querySelectorAll('.heartbtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const img = btn.querySelector('img');
      if (!img) return;

      const isActive = img.dataset.active === "true";

      if (!isActive) {
        img.src = "assets/heart.png"; 
        img.dataset.active = "true";
        hearts = hearts + 1;
      } else {
        img.src = "assets/heart-outline.png"; 
        img.dataset.active = "false";
        hearts = Math.max(0, hearts - 1);
      }

      updateCountsUI();
      // 
    });
  });

  
  async function copyText(text) {
    if (!text) return false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      return true;
    } catch (e) {
      return false;
    }
  }

  document.querySelectorAll('.copybtn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const card = btn.closest('.Card');
      if (!card) return;
      const numberEl = card.querySelector('h1.text-3xl');
      const number = numberEl ? numberEl.textContent.trim() : '';

      const ok = await copyText(number);

      if (ok) {
        copies = copies + 1;
        updateCountsUI();
        saveState();
        alert(`Copied ${number} to clipboard`);
      } else {
        alert('Unable to copy to clipboard.');
      }
    });
  });

 
  document.querySelectorAll('.callbtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.Card');
      if (!card) return;
      const titleEl = card.querySelector('h1.text-xl');
      const numberEl = card.querySelector('h1.text-3xl');
      const serviceName = titleEl ? titleEl.textContent.trim() : 'Service';
      const number = numberEl ? numberEl.textContent.trim() : '';

      if (coins < CALL_COST) {
        alert(`Not enough coins to call ${serviceName}. You have ${coins} coins. Each call costs ${CALL_COST} coins.`);
        return;
      }

      alert(`Calling ${serviceName} at ${number}...`);

      coins = coins - CALL_COST;
      if (coins < 0) coins = 0;
      updateCountsUI();

      const entry = {
        name: serviceName,
        number: number,
        time: formatTime(new Date())
      };

      callHistory.unshift(entry);

      saveState();
      renderHistory();
    });
  });

  
  clearBtn.addEventListener('click', () => {
    if (!confirm('Are you sure you want to clear the call history?')) return;
    callHistory = [];
    saveState();
    renderHistory();
  });

  
  window.__es_debug = {
    getState: () => ({ hearts, coins, copies, callHistory }),
    reset: () => {
      hearts = 0; coins = 100; copies = 0; callHistory = [];
      saveState(); updateCountsUI(); renderHistory();
    }
  };
});