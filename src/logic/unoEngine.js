// DC Comics / Superman UNO Game Engine

export const COLORS = {
  red: {
    id: 'red',
    name: 'Solar Crimson',
    heroName: "Superman's Cape",
    bg: 'bg-rose-600',
    border: 'border-rose-500',
    text: 'text-rose-500',
    hex: '#e11d48',
    darkHex: '#9f1239',
  },
  blue: {
    id: 'blue',
    name: 'Metropolis Azure',
    heroName: 'Man of Steel Suit',
    bg: 'bg-sky-600',
    border: 'border-sky-500',
    text: 'text-sky-400',
    hex: '#0284c7',
    darkHex: '#0369a1',
  },
  yellow: {
    id: 'yellow',
    name: 'Solar Gold',
    heroName: 'Yellow Sun Energy',
    bg: 'bg-amber-400',
    border: 'border-amber-400',
    text: 'text-amber-400',
    hex: '#facc15',
    darkHex: '#ca8a04',
  },
  green: {
    id: 'green',
    name: 'Kryptonite Emerald',
    heroName: 'Kryptonite Glow',
    bg: 'bg-emerald-500',
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    hex: '#22c55e',
    darkHex: '#15803d',
  },
  wild: {
    id: 'wild',
    name: 'Fortress Spectrum',
    heroName: 'Multiverse Wild',
    bg: 'bg-purple-600',
    border: 'border-purple-400',
    text: 'text-purple-400',
    hex: '#9333ea',
    darkHex: '#581c87',
  }
};

export const CHARACTERS = {
  superman: {
    id: 'superman',
    name: 'Superman (You)',
    alterEgo: 'Clark Kent / Kal-El',
    role: 'The Man of Tomorrow',
    badge: 'LEADER',
    avatarColor: 'from-blue-600 to-rose-600',
    borderColor: 'border-rose-500',
    quotes: [
      "Truth, justice, and a better tomorrow!",
      "Up, up, and away!",
      "Metropolis is safe under my watch.",
      "Stand down, Luthor!",
      "There is always a way."
    ],
    isBot: false,
  },
  batman: {
    id: 'batman',
    name: 'Batman',
    alterEgo: 'Bruce Wayne',
    role: 'The Dark Knight',
    badge: 'TACTICIAN',
    avatarColor: 'from-slate-800 to-zinc-900',
    borderColor: 'border-yellow-500',
    quotes: [
      "I have planned for this contingency.",
      "Justice never sleeps.",
      "Your strategy is flawed, Clark.",
      "I am vengeance. I am the night.",
      "Check your hand carefully."
    ],
    isBot: true,
  },
  wonderwoman: {
    id: 'wonderwoman',
    name: 'Wonder Woman',
    alterEgo: 'Diana Prince',
    role: 'Princess of Themyscira',
    badge: 'WARRIOR',
    avatarColor: 'from-amber-600 to-rose-700',
    borderColor: 'border-amber-400',
    quotes: [
      "By the grace of Hera, we prevail!",
      "Yield to the Lasso of Truth!",
      "A warrior never surrenders.",
      "May Athena grant us wisdom.",
      "An honorable match, Kal-El!"
    ],
    isBot: true,
  },
  lexluthor: {
    id: 'lexluthor',
    name: 'Lex Luthor',
    alterEgo: 'Alexander Luthor',
    role: 'LexCorp Mastermind',
    badge: 'NEMESIS',
    avatarColor: 'from-purple-950 to-emerald-950',
    borderColor: 'border-emerald-500',
    quotes: [
      "Metropolis belongs to LexCorp, alien!",
      "A dose of Kryptonite will slow you down!",
      "Intellect always triumphs over brute power.",
      "Your luck has run out, Superman!",
      "You cannot defeat human supremacy!"
    ],
    isBot: true,
  }
};

// Generate Full UNO Deck with Superman & DC Cards
export function createDeck() {
  const deck = [];
  const standardColors = ['red', 'blue', 'yellow', 'green'];
  let cardCounter = 1;

  standardColors.forEach((color) => {
    // 1 Zero card per color
    deck.push({
      id: `${color}_0_${cardCounter++}`,
      color,
      value: '0',
      type: 'number',
      name: `${COLORS[color].name} 0`,
      lore: 'Metropolis Ground Zero'
    });

    // 2 copies of numbers 1 to 9
    for (let num = 1; num <= 9; num++) {
      for (let copy = 1; copy <= 2; copy++) {
        deck.push({
          id: `${color}_${num}_${copy}_${cardCounter++}`,
          color,
          value: String(num),
          type: 'number',
          name: `${COLORS[color].name} ${num}`,
          lore: `Solar Power Level ${num}`
        });
      }
    }

    // 2 Skips per color (Heat Vision Blast)
    for (let copy = 1; copy <= 2; copy++) {
      deck.push({
        id: `${color}_skip_${copy}_${cardCounter++}`,
        color,
        value: 'skip',
        type: 'action',
        name: 'Heat Vision Freeze',
        action: 'skip',
        lore: 'Stun the next player with an intense heat beam!'
      });
    }

    // 2 Reverses per color (Orbital Vortex)
    for (let copy = 1; copy <= 2; copy++) {
      deck.push({
        id: `${color}_reverse_${copy}_${cardCounter++}`,
        color,
        value: 'reverse',
        type: 'action',
        name: 'Vortex Rewind',
        action: 'reverse',
        lore: 'Superman circles the globe, reversing the turn orbit!'
      });
    }

    // 2 Draw 2s per color (Kryptonian Double Punch)
    for (let copy = 1; copy <= 2; copy++) {
      deck.push({
        id: `${color}_draw2_${copy}_${cardCounter++}`,
        color,
        value: 'draw2',
        type: 'action',
        name: 'Super Punch (+2)',
        action: 'draw2',
        lore: 'BAM! Deliver a heroic strike forcing next player to draw 2!'
      });
    }
  });

  // 4 Regular Wild Cards (Fortress of Solitude)
  for (let i = 1; i <= 4; i++) {
    deck.push({
      id: `wild_${i}_${cardCounter++}`,
      color: 'wild',
      value: 'wild',
      type: 'wild',
      name: 'Fortress of Solitude',
      action: 'wild',
      lore: 'Harness the crystalline matrix to choose any solar color!'
    });
  }

  // 4 Wild Draw 4 Cards (Kryptonite Ambush)
  for (let i = 1; i <= 4; i++) {
    deck.push({
      id: `wild_draw4_${i}_${cardCounter++}`,
      color: 'wild',
      value: 'wild_draw4',
      type: 'wild',
      name: 'Kryptonite Ambush (+4)',
      action: 'wild_draw4',
      lore: 'Lex Luthor releases radioactive Kryptonite! Next player draws 4 and skips turn!'
    });
  }

  // 2 Legendary Superman Special Cards: "Solar Burst"
  for (let i = 1; i <= 2; i++) {
    deck.push({
      id: `superman_solar_burst_${i}_${cardCounter++}`,
      color: 'wild',
      value: 'solar_burst',
      type: 'special',
      name: 'Solar Burst (Super UNO)',
      action: 'solar_burst',
      lore: 'Super-charge with pure yellow sunlight! Change color AND all opponents draw 1 card!'
    });
  }

  return shuffle(deck);
}

// Fisher-Yates shuffle
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Check if a card is playable
export function canPlayCard(card, topCard, activeColor) {
  if (!card || !topCard) return false;
  
  // Wild & Special cards can always be played
  if (card.color === 'wild' || card.type === 'wild' || card.type === 'special') {
    return true;
  }

  // Match the active chosen color (which could have been set by a Wild card)
  if (card.color === activeColor) {
    return true;
  }

  // Match the card face value or action
  if (card.value === topCard.value) {
    return true;
  }

  return false;
}

// Initial Game Setup
export function initializeGame(playerCount = 4) {
  const fullDeck = createDeck();
  
  const playerRoster = playerCount === 2 
    ? [CHARACTERS.superman, CHARACTERS.lexluthor]
    : [CHARACTERS.superman, CHARACTERS.batman, CHARACTERS.wonderwoman, CHARACTERS.lexluthor];

  const players = playerRoster.map((char, index) => ({
    ...char,
    index,
    hand: fullDeck.splice(0, 7),
    hasCalledUno: false,
    unoFailedPenalty: false,
    score: 0
  }));

  // Find a valid starting top card (non-wild, non-action preferred for classic start)
  let topCardIndex = fullDeck.findIndex(c => c.type === 'number');
  if (topCardIndex === -1) topCardIndex = 0;
  const [topCard] = fullDeck.splice(topCardIndex, 1);

  return {
    players,
    drawDeck: fullDeck,
    discardPile: [topCard],
    activeColor: topCard.color === 'wild' ? 'red' : topCard.color,
    currentPlayerIndex: 0, // Superman starts!
    direction: 1, // 1 = clockwise, -1 = counter-clockwise
    isGameOver: false,
    winner: null,
    turnCount: 1,
    pendingAction: null,
    logs: [
      {
        id: Date.now(),
        type: 'system',
        text: `The Battle for Metropolis begins! First card: ${topCard.name}. Superman holds the initiative!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }
    ]
  };
}

// Get the next player index based on turn direction
export function getNextPlayerIndex(currentIndex, direction, totalPlayers, step = 1) {
  const total = totalPlayers;
  let next = (currentIndex + (direction * step)) % total;
  if (next < 0) next += total;
  return next;
}

// Bot AI Decision Maker
export function getBotMove(bot, topCard, activeColor, players, direction) {
  const playableCards = bot.hand.filter(card => canPlayCard(card, topCard, activeColor));

  if (playableCards.length === 0) {
    return { action: 'draw' };
  }

  const nextPlayerIndex = getNextPlayerIndex(bot.index, direction, players.length, 1);
  const nextPlayer = players[nextPlayerIndex];
  const nextPlayerThreat = nextPlayer.hand.length <= 2;

  // 1. If next player is near winning (threat), aggressively play attack cards (Draw4, Draw2, Skip)
  if (nextPlayerThreat) {
    const attackCard = playableCards.find(c => 
      c.value === 'wild_draw4' || c.value === 'draw2' || c.value === 'skip' || c.value === 'solar_burst'
    );
    if (attackCard) {
      return {
        action: 'play',
        card: attackCard,
        chosenColor: chooseBestColorForBot(bot.hand)
      };
    }
  }

  // 2. Play number cards first to conserve wild and special powers
  const numberCards = playableCards.filter(c => c.type === 'number');
  if (numberCards.length > 0) {
    // Prefer matching current color to keep rhythm
    const sameColorNumber = numberCards.find(c => c.color === activeColor);
    const chosen = sameColorNumber || numberCards[Math.floor(Math.random() * numberCards.length)];
    return {
      action: 'play',
      card: chosen,
      chosenColor: chosen.color
    };
  }

  // 3. Play action cards (Skip, Reverse, Draw 2)
  const actionCards = playableCards.filter(c => c.type === 'action');
  if (actionCards.length > 0) {
    const chosen = actionCards[0];
    return {
      action: 'play',
      card: chosen,
      chosenColor: chosen.color
    };
  }

  // 4. Play Wild / Special cards
  const wildCard = playableCards.find(c => c.type === 'wild' || c.type === 'special');
  if (wildCard) {
    return {
      action: 'play',
      card: wildCard,
      chosenColor: chooseBestColorForBot(bot.hand)
    };
  }

  // Fallback to first playable card
  const fallbackCard = playableCards[0];
  return {
    action: 'play',
    card: fallbackCard,
    chosenColor: fallbackCard.color === 'wild' ? chooseBestColorForBot(bot.hand) : fallbackCard.color
  };
}

// Bot color selection: picks the color it has the most cards of
export function chooseBestColorForBot(hand) {
  const counts = { red: 0, blue: 0, yellow: 0, green: 0 };
  hand.forEach(c => {
    if (counts[c.color] !== undefined) {
      counts[c.color]++;
    }
  });

  let bestColor = 'red';
  let maxCount = -1;
  Object.keys(counts).forEach(color => {
    if (counts[color] > maxCount) {
      maxCount = counts[color];
      bestColor = color;
    }
  });

  return bestColor;
}

// Calculate scores at the end of the round
export function calculateHandPoints(hand) {
  return hand.reduce((sum, card) => {
    if (card.type === 'number') return sum + parseInt(card.value, 10);
    if (card.value === 'draw2' || card.value === 'reverse' || card.value === 'skip') return sum + 20;
    if (card.value === 'wild' || card.value === 'wild_draw4') return sum + 50;
    if (card.value === 'solar_burst') return sum + 60;
    return sum + 10;
  }, 0);
}
