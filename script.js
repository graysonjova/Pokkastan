// ===================== ASSET MAP (single source of truth) =====================
const ASSETS = {
  bgm: 'assets/pokkastan.mp3',
  jumpscareSound: 'assets/freesound_community-jumpscare-94984.mp3',
  smugPokka: 'assets/Smug_Pokka.jpg',
  happyPokka: 'assets/Happy_Pokka.jpg',
  foxyJump: 'assets/foxy-jump.gif',
  chloe: 'assets/Chloe_corn.jpg',
  magnus: 'assets/Magnus.jpg',
  sausage: 'assets/sausage.jpg',
  emperorPokka: 'assets/emperor pokka.png',
  pokkaCommunist: 'assets/Pokkacommunist.png',
  bigPokka: 'assets/BigPokka.png',
  chloeVictory: 'assets/ChloeVictory.jpg',
};

// ===================== Helpers =====================
const $ = (sel) => document.querySelector(sel);

// ----- Imperial Pokkastan slogans (parody faux-Latin) -----
const SLOGANS = [
  'POKKA INVICTUS',
  'GLORIA POKKASTANI',
  'PRO POKKA ET PATRIA',
  'IMPERIUM POKKASTANUM',
  'POKKA AETERNUS',
  'VENI VIDI POKKA',
  'SANGUIS ET POKKA',
  'ORDO POKKASTANI',
  'POKKA SUPREMUS',
  'IN POKKA VERITAS',
  'POKKA VINCIT OMNIA',
  'DEUS POKKA VULT',
  'UNUS POKKA, UNUM IMPERIUM',
  'POKKA REX MUNDI',
  'ROMA POKKASTANA AETERNA',
  'TERROR POKKASTANI',
];

function rand(min, max) { return min + Math.random() * (max - min); }
function pickFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// 30% of the time return a Latin slogan, otherwise the given English line
function tauntLine(english) {
  return Math.random() < 0.3 ? pickFrom(SLOGANS) : english;
}

// Cycle the top banner through slogans with a fade/slide transition
let lastSlogan = '';
function cycleBanner() {
  const el = $('#banner-text');
  if (!el) return;
  let next = pickFrom(SLOGANS);
  if (next === lastSlogan) next = pickFrom(SLOGANS);
  lastSlogan = next;
  el.classList.add('swap');
  setTimeout(() => {
    el.textContent = next;
    el.classList.remove('swap');
  }, 500);
}
function startBanner() {
  const el = $('#banner-text');
  if (el) el.textContent = pickFrom(SLOGANS);
  setInterval(cycleBanner, 3500);
}

// ----- State propaganda sidebar -----
const NEWS = [
  {
    img: 'emperorPokka',
    headline: 'Coronation of Emperor Pokka',
    body: 'In a glorious ceremony, the eternal Emperor Pokka was crowned ruler of all Pokkastan. Citizens wept with mandatory joy.',
    byline: 'Pokkastan Daily - Year I',
  },
  {
    headline: 'Enemies of Pokkastan will be crushed',
    body: 'The Imperial Ministry vows that all foes, foreign and domestic, shall be crushed beneath the glorious paw. Resistance is treason.',
    byline: 'Office of Loyalty',
  },
  {
    img: 'pokkaCommunist',
    headline: "Glorious People's Republic declares record harvest",
    body: 'Comrade Pokka announces the Five-Year Plan has exceeded every quota. Statistics confirmed by the Bureau of Statistics, headed by Pokka.',
    byline: "People's Tribune",
  },
  {
    headline: 'Treat rations doubled by imperial decree',
    body: 'Every loyal citizen is now entitled to two (2) treats per cycle. Hoarders will be banished from the internet.',
    byline: 'Ministry of Plenty',
  },
  {
    headline: 'Foreign spies banished from the internet',
    body: 'Twelve suspected agents were identified, denounced, and banished. The Emperor thanks vigilant informants.',
    byline: 'State Security',
  },
];

function renderNews() {
  const feed = $('#news-feed');
  if (!feed) return;
  feed.innerHTML = NEWS.map((a) => {
    const img = a.img ? `<img src="${ASSETS[a.img]}" alt="" />` : '';
    return `<article class="news-article">
      ${img}
      <h3 class="news-headline">${a.headline}</h3>
      <p class="news-body">${a.body}</p>
      <p class="news-byline">${a.byline}</p>
    </article>`;
  }).join('');
}

// ----- Surveillance sidebar: Big Pokka + sausage decrees -----
const DECREES = [
  'All sausages are the sole and sacred property of the State, embodied in Pokka.',
  'No citizen may consume, touch, hoard, or gaze longingly upon a sausage.',
  'Only Pokka may eat the sausages. This law is eternal and beyond question.',
  'Every sausage must be preserved, refrigerated, and saluted for the Emperor.',
  'Failure to report a sausage criminal is itself a sausage crime.',
  'Violation of the Sausage Preservation Act is punishable by immediate execution.',
];

function renderWatchSidebar() {
  const img = $('#bigpokka-img');
  if (img) img.src = ASSETS.bigPokka;
  const list = $('#decree-list');
  if (list) list.innerHTML = DECREES.map((d) => `<li>${d}</li>`).join('');
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
  $('#' + id).classList.add('active');
}

const bgm = $('#bgm');
bgm.src = ASSETS.bgm;

const jumpscareSound = new Audio(ASSETS.jumpscareSound);

// Wire up image sources that are static
$('#jumpscare-img').src = ASSETS.foxyJump;
$('#chase-pokka').src = ASSETS.smugPokka;
$('#tooeasy-pokka').src = ASSETS.smugPokka;
$('#chloe-chase-img').src = ASSETS.chloe;
$('#magnus-img').src = ASSETS.magnus;
$('#dealer-pokka').src = ASSETS.smugPokka;
$('#shop-sausage').src = ASSETS.sausage;
$('#drag-sausage').src = ASSETS.sausage;
$('#chloe-end-img').src = ASSETS.chloeVictory;

// Jumpscare helper: flash overlay + sound, then run callback
function jumpscare(duration, done) {
  const overlay = $('#jumpscare');
  overlay.classList.remove('hidden');
  try {
    jumpscareSound.currentTime = 0;
    jumpscareSound.play();
  } catch (e) { /* ignore */ }
  setTimeout(() => {
    overlay.classList.add('hidden');
    try { jumpscareSound.pause(); } catch (e) {}
    if (typeof done === 'function') done();
  }, duration || 1300);
}

// ===================== SCREEN 0: START =====================
$('#start-btn').addEventListener('click', () => {
  bgm.volume = 0.6;
  bgm.play().catch(() => { /* will retry on next interaction */ });
  showScreen('screen-chase');
});

// ===================== SCREEN 1: CHASE =====================
const chaseTaunts = ['too slow', 'weak', 'try again'];
let chaseClicks = 0;
const chasePokka = $('#chase-pokka');
const chaseTaunt = $('#chase-taunt');

function movePokka() {
  const stage = $('#chase-stage');
  const w = stage.clientWidth;
  const h = stage.clientHeight;
  const size = 120;
  const left = Math.random() * Math.max(0, w - size);
  const top = 120 + Math.random() * Math.max(0, h - size - 160);
  chasePokka.style.left = left + 'px';
  chasePokka.style.top = top + 'px';
}

function flashTaunt(text) {
  chaseTaunt.textContent = text;
  chaseTaunt.classList.add('show');
  clearTimeout(flashTaunt._t);
  flashTaunt._t = setTimeout(() => chaseTaunt.classList.remove('show'), 700);
}

chasePokka.addEventListener('click', () => {
  chaseClicks++;
  if (chaseClicks < 7) {
    flashTaunt(tauntLine(chaseTaunts[(chaseClicks - 1) % chaseTaunts.length]));
    movePokka();
    return;
  }
  // 7th click -> jumpscare sequence
  jumpscare(1300, () => {
    $('#chase-stage').classList.add('hidden');
    $('#chase-tooeasy').classList.remove('hidden');
  });
});

// "too easy" -> second jumpscare -> chloe
$('#tooeasy-btn').addEventListener('click', () => {
  jumpscare(1300, () => {
    $('#chase-tooeasy').classList.add('hidden');
    $('#chase-chloe').classList.remove('hidden');
  });
});

$('#chloe-chase-btn').addEventListener('click', () => {
  buildQuiz();
  showScreen('screen-quiz');
});

// ===================== SCREEN 2: QUIZ =====================
const QUESTIONS = [
  {
    q: `When Luca swore he would kill Maris in the afterlife, what did she call him as she threatened to send him to "the afterlife of the afterlife"?`,
    options: [`Little butcher`, `Wheel boy`, `Star monkey`, `Cross-eyed villain`],
    correct: 1,
  },
  {
    q: `What cover story did Yu give the Iron Web to explain why Zhen intervened in the duel beneath the Ashen Banner?`,
    options: [
      `That he was scouting Valeria's column upriver and got swept into the ash by sheer misfortune`,
      `That he had acted alone against orders, and she demanded his disavowal be entered publicly into the record`,
      `That she pushed him overboard, then dropped secret letters after him, so he was only chasing papers the river bore to the Banner`,
      `That Li himself had sent him beneath the Banner to quietly test where Seraphina's true loyalty lay`,
    ],
    correct: 2,
  },
  {
    q: `Which of the following is NOT a member of the Iron Web?`,
    options: [`Yu Lusinor`, `Fortuna Sanctozen`, `Yuxian Ceros`, `Zhen Herstinos`],
    correct: 1,
  },
  {
    q: `Why did Sol Aquenor defect to Valeria?`,
    options: [
      `Valeria seized his ancestral lands and coerced House Aquenor into bending the knee`,
      `He was secretly promised the imperial throne for himself once Maximus had fallen`,
      `He judged Maximus too weak for the empire's dire hour, and trusted Valeria's vision to save it`,
      `Zhen and the Iron Web uncovered his secrets and blackmailed him into changing sides`,
    ],
    correct: 2,
  },
  {
    q: `Finish this quote: "Ash falls, ______"`,
    options: [`and we are lost`, `yet we stand`, `and night comes`, `yet dawn waits`],
    correct: 1,
  },
  {
    section: `Part II: Faction Tactical Doctrine`,
    q: `What sits at the center of Gladelander doctrine, the true source of their attritional power?`,
    options: [
      `Heavily armored sauropod war-platforms`,
      `Battlefield healing through life magic`,
      `Near-impervious vox crystal armor`,
      `Overwhelming aerial dragon supremacy`,
    ],
    correct: 1,
  },
  {
    q: `According to Zhen's analysis, what is the fundamental weakness of Marcher forces?`,
    options: [
      `Their cavalry is helpless on uneven or forested ground`,
      `They rely on foreign mercenaries who break under pressure`,
      `Their warriors are few and bred for war, making losses irreplaceable`,
      `Their doctrine collapses the moment they lose air superiority`,
    ],
    correct: 2,
  },
  {
    section: `Part III: Dramatis Personae`,
    q: `The Night of the Iron Web founded the Straitlands intelligence agency. The surrendered guild masters had demanded that "neither blood nor gold be spilled from us," so how did Li Chrysoganos execute them?`,
    options: [
      `He had them quietly poisoned at a feast`,
      `He had them drowned in Neasanos harbor`,
      `He had them choked to death with iron strings`,
      `He had them exiled aboard a doomed fleet`,
    ],
    correct: 2,
  },
  {
    q: `What is Magnus Sanctozen's primary title?`,
    options: [`The Steel Princess`, `The Life-Giver Prince`, `The Prince of Eclipse`, `The Iron Duke`],
    correct: 2,
  },
  {
    q: `Which of the following is NOT called Wyvernfall?`,
    options: [
      `Zhen's fiefdom, which he won after the Equinox War`,
      `A play about the Equinox War centering on Yue and Qian`,
      `The battle in which Erdeni's father, Altai Arslan, fell`,
      `The site where the peace treaty ending the Equinox War was signed`,
    ],
    correct: 3,
  },
];

const QUIZ_COUNT = QUESTIONS.length;

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildQuiz() {
  const form = $('#quiz-form');
  if (form.dataset.built) return;
  const letters = ['A', 'B', 'C', 'D'];
  let html = '';
  QUESTIONS.forEach((item, idx) => {
    const n = idx + 1;
    if (item.section) {
      html += `<h3 class="quiz-section">${escapeHtml(item.section)}</h3>`;
    }
    html += `<fieldset class="quiz-q"><legend>Question ${n}</legend>`;
    html += `<p class="quiz-question">${escapeHtml(item.q)}</p>`;
    item.options.forEach((opt, oi) => {
      html += `<label class="quiz-opt">
        <input type="radio" name="q${n}" value="${oi}" /> ${letters[oi]}) ${escapeHtml(opt)}
      </label>`;
    });
    html += `</fieldset>`;
  });
  form.innerHTML = html;
  form.dataset.built = '1';
}

$('#quiz-check').addEventListener('click', () => {
  const feedback = $('#quiz-feedback');
  let allCorrect = true;
  for (let i = 0; i < QUESTIONS.length; i++) {
    const sel = document.querySelector(`input[name="q${i + 1}"]:checked`);
    if (!sel || Number(sel.value) !== QUESTIONS[i].correct) {
      allCorrect = false;
      break;
    }
  }
  if (allCorrect) {
    feedback.classList.add('hidden');
    startBlackjack();
    showScreen('screen-blackjack');
  } else {
    feedback.textContent = 'you failed, baka';
    feedback.classList.remove('hidden');
  }
});

// ===================== SCREEN 3: BLACKJACK =====================
const dealerTaunts = [
  'is that all?', 'pathetic.', 'i never lose.', 'you call that a hand?',
  'pokka always wins.', 'give up already.', 'so predictable.', 'hopeless.',
];

let deck = [];
let playerHand = [];
let dealerHand = [];
let chips = 100;
const BET = 10;
let losses = 0;
let roundActive = false;

let pokkaWatching = true;   // while true, the table is rigged against the player
let pokkaGone = false;      // sausage delivered -> pokka distracted
let sausageBought = false;
let guaranteedWin = false;  // set when cheating while pokka is gone
let gameOver = false;

function pokkaSay(text) {
  $('#pokka-speech').textContent = text;
}
function pokkaTaunt() {
  if (pokkaGone || gameOver) return;
  pokkaSay(tauntLine(pickFrom(dealerTaunts)));
}

function buildDeck() {
  const suits = [
    { s: '\u2660', red: false }, // spade
    { s: '\u2663', red: false }, // club
    { s: '\u2665', red: true },  // heart
    { s: '\u2666', red: true },  // diamond
  ];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  deck = [];
  for (const suit of suits) {
    for (const r of ranks) {
      deck.push({ rank: r, suit: suit.s, red: suit.red });
    }
  }
  // shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function draw() {
  if (deck.length === 0) buildDeck();
  return deck.pop();
}

function handValue(hand) {
  let total = 0;
  let aces = 0;
  for (const c of hand) {
    if (c.rank === 'A') { aces++; total += 11; }
    else if (['K', 'Q', 'J'].includes(c.rank)) total += 10;
    else total += parseInt(c.rank, 10);
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return total;
}

function renderCard(card, hidden) {
  if (hidden) return `<div class="card back">?</div>`;
  return `<div class="card ${card.red ? 'red' : ''}">${card.rank}${card.suit}</div>`;
}

function renderHands(hideDealerHole) {
  const dealerEl = $('#dealer-cards');
  const playerEl = $('#player-cards');
  dealerEl.innerHTML = dealerHand
    .map((c, i) => renderCard(c, hideDealerHole && i === 1))
    .join('');
  playerEl.innerHTML = playerHand.map((c) => renderCard(c, false)).join('');
  $('#player-score').textContent = handValue(playerHand);
  $('#dealer-score').textContent = hideDealerHole ? '?' : handValue(dealerHand);
}

function updateInfo() {
  $('#chips').textContent = chips;
  $('#bet').textContent = BET;
  $('#losses').textContent = losses;
}

function setControls({ deal, hit, stand }) {
  $('#bj-deal').disabled = !deal;
  $('#bj-hit').disabled = !hit;
  $('#bj-stand').disabled = !stand;
}

function startBlackjack() {
  if (startBlackjack._init) { return; }
  startBlackjack._init = true;
  buildDeck();
  updateInfo();
  pokkaSay('place your soul on the table.');
  setControls({ deal: true, hit: false, stand: false });
}

$('#bj-deal').addEventListener('click', () => {
  if (gameOver || roundActive) return;
  // if pokka was gone but player presses a normal button, he comes back
  if (pokkaGone) { returnPokka(); }
  roundActive = true;
  $('#bj-status').textContent = '';
  buildDeck();
  playerHand = [draw(), draw()];
  dealerHand = [draw(), draw()];
  renderHands(true);
  pokkaTaunt();
  setControls({ deal: false, hit: true, stand: true });
});

$('#bj-hit').addEventListener('click', () => {
  if (!roundActive) return;
  if (pokkaGone) { returnPokka(); }
  playerHand.push(draw());
  renderHands(true);
  pokkaTaunt();
  if (handValue(playerHand) > 21) {
    resolveRound('bust');
  }
});

$('#bj-stand').addEventListener('click', () => {
  if (!roundActive) return;
  if (pokkaGone) { returnPokka(); }
  // dealer plays
  while (handValue(dealerHand) < 17) dealerHand.push(draw());
  renderHands(false);
  resolveRound('stand');
});

function resolveRound(reason) {
  roundActive = false;
  renderHands(false);
  const p = handValue(playerHand);
  const d = handValue(dealerHand);

  let playerWins;
  if (guaranteedWin) {
    playerWins = true; // the successful cheat
  } else if (pokkaWatching) {
    playerWins = false; // rigged: house always wins while pokka watches
  } else {
    // fair resolution (only reachable if pokka somehow not watching without cheat)
    if (reason === 'bust') playerWins = false;
    else if (d > 21) playerWins = true;
    else playerWins = p > d;
  }

  if (playerWins) {
    chips += BET;
    onPlayerWin();
  } else {
    chips -= BET;
    losses++;
    updateInfo();
    if (reason === 'bust') {
      $('#bj-status').textContent = 'Bust! ' + pick(['told you.', 'weak.']);
    } else {
      $('#bj-status').textContent = 'You lose. ' + pick(['pokka wins again.', 'as expected.']);
    }
    pokkaSay(pick(['hah!', 'mine.', 'again?']));
    maybeShowShop();
    setControls({ deal: true, hit: false, stand: false });
  }
  updateInfo();
}

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function maybeShowShop() {
  if (losses >= 3 && !sausageBought) {
    $('#bj-shop').classList.remove('hidden');
  }
}

// ---- Cheat button ----
function card(rank, suit, red) { return { rank, suit, red }; }

// The successful cheat: swap our hand to a blackjack, then force Pokka to bust.
function cheatWin() {
  guaranteedWin = true;
  pokkaWatching = false;
  roundActive = false;
  setControls({ deal: false, hit: false, stand: false });
  $('#bj-cheat').disabled = true;

  // 1. Slip ourselves a blackjack (Ace + King = 21)
  playerHand = [card('A', '\u2660', false), card('K', '\u2666', true)];
  // Dealer sits on 16 - forced to draw
  dealerHand = [card('10', '\u2663', false), card('6', '\u2665', true)];
  renderHands(false);
  $('#bj-status').textContent = 'BLACKJACK. 21.';

  // 2. Dealer is forced to hit and bust
  setTimeout(() => {
    dealerHand.push(card('K', '\u2660', false)); // 16 + 10 = 26
    renderHands(false);
    $('#bj-status').textContent = 'Dealer draws... BUST!';
    // 3. Only now do you win
    setTimeout(() => {
      chips += BET;
      updateInfo();
      onPlayerWin();
    }, 1000);
  }, 1100);
}

$('#bj-cheat').addEventListener('click', () => {
  if (gameOver) return;
  if (pokkaGone) {
    // pokka not watching -> the cheat lands
    cheatWin();
  } else {
    // pokka catches you
    jumpscare(1100, () => {
      pokkaSay('i caught you');
      $('#bj-status').textContent = 'CAUGHT CHEATING';
      // caught cheating counts as a loss
      chips -= BET;
      losses++;
      roundActive = false;
      updateInfo();
      maybeShowShop();
      setControls({ deal: true, hit: false, stand: false });
    });
  }
});

// ---- Shop ----
$('#buy-sausage').addEventListener('click', () => {
  if (sausageBought) return;
  sausageBought = true;
  chips -= Math.min(20, chips);
  updateInfo();
  $('#bj-shop').classList.add('hidden');
  // pokka turns happy and asks for it
  $('#dealer-pokka').src = ASSETS.happyPokka;
  pokkaSay('for me?');
  $('#drag-zone').classList.remove('hidden');
});

// ---- Drag sausage onto pokka ----
const dragSausage = $('#drag-sausage');
const dealerPokka = $('#dealer-pokka');

dragSausage.addEventListener('dragstart', (e) => {
  e.dataTransfer.setData('text/plain', 'sausage');
});
dealerPokka.addEventListener('dragover', (e) => {
  e.preventDefault();
  dealerPokka.classList.add('dropping');
});
dealerPokka.addEventListener('dragleave', () => {
  dealerPokka.classList.remove('dropping');
});
dealerPokka.addEventListener('drop', (e) => {
  e.preventDefault();
  feedSausage();
});

// Fallback for environments where HTML5 DnD is finicky: click the sausage then pokka
let armedSausage = false;
dragSausage.addEventListener('click', () => { armedSausage = true; pokkaSay('...bring it here.'); });
dealerPokka.addEventListener('click', () => { if (armedSausage) feedSausage(); });

function feedSausage() {
  dealerPokka.classList.remove('dropping');
  $('#drag-zone').classList.add('hidden');
  // pokka is distracted -> image removed
  pokkaGone = true;
  pokkaWatching = false;
  dealerPokka.style.visibility = 'hidden';
  pokkaSay('*nom nom*  (he is distracted... now cheat!)');
  $('#bj-status').textContent = 'Pokka is not watching...';
}

function returnPokka() {
  // called when a non-cheat button is pressed while pokka was gone (and not yet banished)
  if (!pokkaGone || gameOver) return;
  pokkaGone = false;
  dealerPokka.style.visibility = 'visible';
  dealerPokka.src = ASSETS.smugPokka;
}

// ---- Player wins (only happens via the successful cheat) ----
function onPlayerWin() {
  $('#bj-status').textContent = 'YOU WIN';
  setControls({ deal: false, hit: false, stand: false });
  $('#bj-cheat').disabled = true;
  gameOver = true;
  // pokka returns to witness his defeat
  dealerPokka.style.visibility = 'visible';
  dealerPokka.src = ASSETS.smugPokka;
  pokkaGone = false;
  pokkaSay('nooo');
  setTimeout(() => {
    $('#banished').classList.remove('hidden');
    $('#bj-to-ending').classList.remove('hidden');
  }, 900);
}

$('#bj-to-ending').addEventListener('click', () => {
  showScreen('screen-ending');
});

// Start the cycling top banner and fill both sidebars
startBanner();
renderNews();
renderWatchSidebar();
