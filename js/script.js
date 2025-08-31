
let coins = 100;
let favSet = new Set();
let copyCount = 0;

const heartCountEl = document.getElementById('heartcount');
const coinCountEl  = document.getElementById('coincount');
const copycountEl = document.getElementById('copycount');
const historyList  = document.getElementById('historyList');
const clearBtn = document.getElementById('clearbtn');


function formatTime() {
  const d = new Date();
  return d.toLocaleString('en-GB', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

function addHistory(service) {
  const row = document.createElement('div');
  row.className = "flex justify-between items-center bg-[#FAFAFA] p-3 rounded-2xl";
  row.innerHTML = `
    <div>
      <h3 class="font-medium">${service.name}</h3>
      <p class="text-sm text-gray-600">${service.number}</p>
    </div>
    <div class="text-sm text-gray-600">${formatTime()}</div>
  `;
  historyList.prepend(row);
}


async function copyTextToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try { await navigator.clipboard.writeText(text); return true; } catch(e) {}
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly','');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch(e){ return false; }
}


document.addEventListener('click', async (e) => {
  const card = e.target.closest('div.card');


  if (e.target === clearbtn) {
    historyList.innerHTML = '';
    return;
  }
  if (!card) return;

  const svc = JSON.parse(card.getAttribute('data-service'));
  const cards = Array.from(document.querySelectorAll('div.card'));
  const idx = cards.indexOf(card);

  if (e.target.closest('.heart-btn')) {
    const icon = card.querySelector('.heart-icon');
    if (favSet.has(idx)) {
      favSet.delete(idx);
      icon.src = 'assets/heart.png'; 
    } else {
      favSet.add(idx);
      icon.src = 'assets/heart-3510.png'; 
    }
    favCountEl.textContent = favSet.size;
    return;
  }

  if (e.target.closest('.copy-btn')) {
    const ok = await copyTextToClipboard(svc.number);
    if (ok) {
      copyCount += 1;
      copyCountEl.textContent = copyCount;
      alert(`Copied hotline number: ${svc.number}`);
    } else {
      alert('Copy failed. Try selecting and copying manually.');
    }
    return;
  }

  if (e.target.closest('.call-btn')) {
    if (coins < 20) {
      alert('Not enough coins to place a call. You need at least 20 coins.');
      return;
    }
    alert(`Calling ${svc.name} at ${svc.number}...`);
    coins -= 20;
    coinCountEl.textContent = coins;
    addHistory(svc);
    return;
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.copy-btn, .call-btn, .heart-btn')) {
    e.preventDefault();
    e.target.click();
  }
});

