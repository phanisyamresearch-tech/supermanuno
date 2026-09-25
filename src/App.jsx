import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header';
import GameBoard from './components/GameBoard';
import PlayerHand from './components/PlayerHand';
import BotPlayer from './components/BotPlayer';
import ColorPickerModal from './components/ColorPickerModal';
import GameOverModal from './components/GameOverModal';
import RulesModal from './components/RulesModal';
import ComicLog from './components/ComicLog';
import { 
  initializeGame, 
  canPlayCard, 
  getBotMove, 
  getNextPlayerIndex, 
  shuffle 
} from './logic/unoEngine';
import { sounds } from './audio/soundEffects';

export default function App() {
  const [playerCount, setPlayerCount] = useState(4);
  const [game, setGame] = useState(() => initializeGame(4));
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [pendingWildCard, setPendingWildCard] = useState(null);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [actionBurst, setActionBurst] = useState(null);
  const [botSpeeches, setBotSpeeches] = useState({});
  const [hasDrawnThisTurn, setHasDrawnThisTurn] = useState(false);
  const [botThinking, setBotThinking] = useState(false);

  const burstTimeoutRef = useRef(null);
  const botTurnTimeoutRef = useRef(null);

  // Trigger Comic Action Burst
  const triggerBurst = useCallback((text) => {
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    setActionBurst(text);
    burstTimeoutRef.current = setTimeout(() => {
      setActionBurst(null);
    }, 1800);
  }, []);

  // Helper to append a game log
  const addLog = useCallback((text, type = 'normal') => {
    setGame(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          id: Date.now() + Math.random(),
          type,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      ]
    }));
  }, []);

  // Sound Mute Toggle
  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  // Restart or change mode
  const startNewGame = useCallback((count = playerCount) => {
    if (botTurnTimeoutRef.current) clearTimeout(botTurnTimeoutRef.current);
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    const newGame = initializeGame(count);
    setGame(newGame);
    setHasDrawnThisTurn(false);
    setIsColorPickerOpen(false);
    setPendingWildCard(null);
    setBotThinking(false);
    setBotSpeeches({});
    triggerBurst("BATTLE FOR METROPOLIS BEGINS!");
    sounds.playVictory();
  }, [playerCount, triggerBurst]);

  const handleChangeMode = (count) => {
    setPlayerCount(count);
    startNewGame(count);
  };

  // Expose demo controller for video capture & interactive showcasing
  useEffect(() => {
    window.__unoDemo = {
      setMode: (count) => handleChangeMode(count),
      openRules: () => setIsRulesOpen(true),
      closeRules: () => setIsRulesOpen(false),
      triggerBurst: (text) => triggerBurst(text),
      setSpeech: (botId, text) => setBotSpeeches(prev => ({ ...prev, [botId]: text })),
      triggerWin: () => {
        setGame(prev => ({
          ...prev,
          isGameOver: true,
          winner: prev.players[0]
        }));
        sounds.playVictory();
      },
      setSupermanHand: (cards) => {
        setGame(prev => {
          const players = [...prev.players];
          players[0] = { ...players[0], hand: cards };
          return { ...prev, players };
        });
      }
    };
  }, [startNewGame, triggerBurst]);

  // Call UNO for Superman
  const handleCallUno = () => {
    sounds.playUno();
    setGame(prev => {
      const players = [...prev.players];
      players[0] = { ...players[0], hasCalledUno: true };
      return { ...players, players };
    });
    triggerBurst("UP, UP & AWAY! UNO CALLED!");
    addLog("Superman shouted: 'UP, UP AND AWAY! UNO!'", "hero");
  };

  // Challenge Bot who failed to call UNO
  const handleChallengeUno = () => {
    setGame(prev => {
      const players = [...prev.players];
      let penalizedBot = null;

      players.forEach((p, idx) => {
        if (idx !== 0 && p.hand.length === 1 && !p.hasCalledUno) {
          penalizedBot = p;
          // Draw 2 penalty cards
          const drawCards = prev.drawDeck.slice(0, 2);
          const remainingDeck = prev.drawDeck.slice(2);
          p.hand = [...p.hand, ...drawCards];
          p.unoFailedPenalty = true;
          prev.drawDeck = remainingDeck;
        }
      });

      if (penalizedBot) {
        sounds.playPunch();
        triggerBurst("CAUGHT! +2 PENALTY!");
        addLog(`Superman caught ${penalizedBot.name} failing to call UNO! +2 Penalty cards given!`, "hero");
      }

      return { ...prev, players };
    });
  };

  // Check if any bot has 1 card and forgot to call UNO
  const canChallengeUno = game.players.some((p, idx) => idx !== 0 && p.hand.length === 1 && !p.hasCalledUno);

  // Reshuffle discard pile into draw deck if draw deck is low
  const ensureDrawDeck = (currentDrawDeck, currentDiscardPile) => {
    if (currentDrawDeck.length >= 4) {
      return { drawDeck: currentDrawDeck, discardPile: currentDiscardPile };
    }
    // Keep the top card of discard pile
    const topCard = currentDiscardPile[currentDiscardPile.length - 1];
    const cardsToShuffle = currentDiscardPile.slice(0, -1);
    const reshuffled = shuffle(cardsToShuffle);
    return {
      drawDeck: [...currentDrawDeck, ...reshuffled],
      discardPile: [topCard]
    };
  };

  // Execute playing a card (Human or Bot)
  const executePlayCard = (playerIndex, card, chosenColor) => {
    setGame(prev => {
      let { players, drawDeck, discardPile, direction, currentPlayerIndex, turnCount } = prev;
      const player = players[playerIndex];

      // Remove card from player hand
      const cardIndex = player.hand.findIndex(c => c.id === card.id);
      const newHand = [...player.hand];
      if (cardIndex !== -1) {
        newHand.splice(cardIndex, 1);
      }

      // Updated player
      const updatedPlayer = {
        ...player,
        hand: newHand,
        // Reset UNO call if player now has more than 1 card, or keep if called
        hasCalledUno: newHand.length === 1 ? player.hasCalledUno : false
      };

      const updatedPlayers = [...players];
      updatedPlayers[playerIndex] = updatedPlayer;

      // Add to discard pile
      const updatedDiscardPile = [...discardPile, card];
      let newActiveColor = chosenColor || card.color;

      // Check Win Condition!
      if (newHand.length === 0) {
        sounds.playVictory();
        return {
          ...prev,
          players: updatedPlayers,
          discardPile: updatedDiscardPile,
          activeColor: newActiveColor,
          isGameOver: true,
          winner: updatedPlayer
        };
      }

      // Check for Sound & Action Effects
      let step = 1;
      let nextPlayerIndex = getNextPlayerIndex(currentPlayerIndex, direction, players.length, 1);

      if (card.value === 'skip') {
        sounds.playLaser();
        triggerBurst("HEAT VISION FREEZE!");
        const skippedPlayer = players[nextPlayerIndex];
        addLog(`${player.name} unleashed Heat Vision! ${skippedPlayer.name} is stunned and skipped!`, playerIndex === 0 ? 'hero' : 'normal');
        step = 2; // Skip next player
      } else if (card.value === 'reverse') {
        sounds.playReverse();
        triggerBurst("VORTEX REWIND!");
        direction = direction * -1;
        addLog(`${player.name} circled the globe with Vortex Rewind! Play order is reversed!`, playerIndex === 0 ? 'hero' : 'normal');
        
        // In 2-player game, reverse acts as a skip
        if (players.length === 2) {
          step = 2;
        } else {
          step = 1;
        }
      } else if (card.value === 'draw2') {
        sounds.playPunch();
        triggerBurst("BAM! SUPER PUNCH +2!");
        const targetPlayerIndex = nextPlayerIndex;
        const targetPlayer = updatedPlayers[targetPlayerIndex];

        // Draw 2 cards for target
        const deckCheck = ensureDrawDeck(drawDeck, updatedDiscardPile);
        drawDeck = deckCheck.drawDeck;
        const drawnCards = drawDeck.splice(0, 2);

        targetPlayer.hand = [...targetPlayer.hand, ...drawnCards];
        addLog(`${player.name} struck ${targetPlayer.name} with Super Punch! +2 Cards drawn & skipped!`, playerIndex === 0 ? 'hero' : 'normal');
        step = 2; // Target loses turn
      } else if (card.value === 'wild') {
        sounds.playCard();
        triggerBurst("FORTRESS SPECTRUM!");
        addLog(`${player.name} activated Fortress of Solitude! New color: ${newActiveColor.toUpperCase()}`, playerIndex === 0 ? 'hero' : 'normal');
        step = 1;
      } else if (card.value === 'wild_draw4') {
        sounds.playKryptonite();
        triggerBurst("KRYPTONITE AMBUSH +4!");
        const targetPlayerIndex = nextPlayerIndex;
        const targetPlayer = updatedPlayers[targetPlayerIndex];

        // Target draws 4 cards
        const deckCheck = ensureDrawDeck(drawDeck, updatedDiscardPile);
        drawDeck = deckCheck.drawDeck;
        const drawnCards = drawDeck.splice(0, 4);

        targetPlayer.hand = [...targetPlayer.hand, ...drawnCards];
        addLog(`${player.name} unleashed Kryptonite Ambush! ${targetPlayer.name} draws 4 cards and is skipped! Color: ${newActiveColor.toUpperCase()}`, 'villain');
        step = 2; // Target loses turn
      } else if (card.value === 'solar_burst') {
        sounds.playSolarBurst();
        triggerBurst("LEGENDARY SOLAR BURST!");
        
        // All opponents draw 1 card!
        const deckCheck = ensureDrawDeck(drawDeck, updatedDiscardPile);
        drawDeck = deckCheck.drawDeck;

        updatedPlayers.forEach((p, idx) => {
          if (idx !== playerIndex && drawDeck.length > 0) {
            p.hand = [...p.hand, drawDeck.shift()];
          }
        });

        addLog(`${player.name} ignited SOLAR BURST! All opponents draw 1 card! New color: ${newActiveColor.toUpperCase()}`, 'hero');
        step = 1;
      } else {
        // Normal number card
        sounds.playCard();
        addLog(`${player.name} played ${card.name}.`, playerIndex === 0 ? 'hero' : 'normal');
        step = 1;
      }

      const nextTurnPlayer = getNextPlayerIndex(currentPlayerIndex, direction, players.length, step);

      return {
        ...prev,
        players: updatedPlayers,
        drawDeck,
        discardPile: updatedDiscardPile,
        activeColor: newActiveColor,
        direction,
        currentPlayerIndex: nextTurnPlayer,
        turnCount: turnCount + 1
      };
    });

    setHasDrawnThisTurn(false);
  };

  // Human plays card
  const handleHumanPlayCard = (card) => {
    if (game.currentPlayerIndex !== 0 || game.isGameOver) return;

    const topCard = game.discardPile[game.discardPile.length - 1];
    if (!canPlayCard(card, topCard, game.activeColor)) return;

    // Check if card is wild or special (needs color selection)
    if (card.color === 'wild' || card.type === 'wild' || card.type === 'special') {
      setPendingWildCard(card);
      setIsColorPickerOpen(true);
      return;
    }

    executePlayCard(0, card, card.color);
  };

  // Human selected color in modal
  const handleSelectColor = (chosenColor) => {
    setIsColorPickerOpen(false);
    if (pendingWildCard) {
      executePlayCard(0, pendingWildCard, chosenColor);
      setPendingWildCard(null);
    }
  };

  // Human draws a card
  const handleHumanDrawCard = () => {
    if (game.currentPlayerIndex !== 0 || game.isGameOver || hasDrawnThisTurn) return;

    sounds.playDraw();
    setGame(prev => {
      const { drawDeck, discardPile, players } = prev;
      const deckCheck = ensureDrawDeck(drawDeck, discardPile);
      const newDeck = [...deckCheck.drawDeck];
      const drawnCard = newDeck.shift();

      const updatedPlayers = [...players];
      updatedPlayers[0] = {
        ...updatedPlayers[0],
        hand: [...updatedPlayers[0].hand, drawnCard],
        hasCalledUno: false // reset uno call if had 1
      };

      return {
        ...prev,
        drawDeck: newDeck,
        players: updatedPlayers
      };
    });

    setHasDrawnThisTurn(true);
    addLog("Superman drew a card from the Metropolis deck.", "hero");
  };

  // Human passes turn after drawing
  const handleHumanPassTurn = () => {
    if (game.currentPlayerIndex !== 0 || game.isGameOver || !hasDrawnThisTurn) return;

    sounds.playClick();
    setGame(prev => {
      const nextIndex = getNextPlayerIndex(prev.currentPlayerIndex, prev.direction, prev.players.length, 1);
      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        turnCount: prev.turnCount + 1
      };
    });

    setHasDrawnThisTurn(false);
    addLog("Superman passed the turn.", "hero");
  };

  // Bot Turn Automation Effect
  useEffect(() => {
    if (game.isGameOver) return;
    const isBotTurn = game.currentPlayerIndex !== 0;

    if (isBotTurn) {
      setBotThinking(true);
      const currentBot = game.players[game.currentPlayerIndex];
      const topCard = game.discardPile[game.discardPile.length - 1];

      // Random bot speech quote occasionally
      if (Math.random() < 0.45 && currentBot.quotes) {
        const randomQuote = currentBot.quotes[Math.floor(Math.random() * currentBot.quotes.length)];
        setBotSpeeches(prev => ({ ...prev, [currentBot.id]: randomQuote }));
      }

      botTurnTimeoutRef.current = setTimeout(() => {
        const move = getBotMove(currentBot, topCard, game.activeColor, game.players, game.direction);

        if (move.action === 'draw') {
          // Bot draws a card
          sounds.playDraw();
          setGame(prev => {
            const { drawDeck, discardPile, players, currentPlayerIndex, direction, turnCount } = prev;
            const deckCheck = ensureDrawDeck(drawDeck, discardPile);
            const newDeck = [...deckCheck.drawDeck];
            const drawnCard = newDeck.shift();

            const updatedPlayers = [...players];
            const updatedBot = {
              ...currentBot,
              hand: [...currentBot.hand, drawnCard],
              hasCalledUno: false
            };
            updatedPlayers[currentPlayerIndex] = updatedBot;

            // Check if drawn card can be played immediately
            const canPlayDrawn = canPlayCard(drawnCard, topCard, prev.activeColor);
            if (canPlayDrawn && Math.random() < 0.8) {
              // Bot plays drawn card
              setTimeout(() => {
                executePlayCard(currentPlayerIndex, drawnCard, drawnCard.color === 'wild' ? 'red' : drawnCard.color);
              }, 400);

              return {
                ...prev,
                drawDeck: newDeck,
                players: updatedPlayers
              };
            }

            // Otherwise bot passes turn to next player
            const nextIndex = getNextPlayerIndex(currentPlayerIndex, direction, players.length, 1);
            return {
              ...prev,
              drawDeck: newDeck,
              players: updatedPlayers,
              currentPlayerIndex: nextIndex,
              turnCount: turnCount + 1
            };
          });

          addLog(`${currentBot.name} drew a card.`, "normal");
          setBotThinking(false);
        } else if (move.action === 'play') {
          // Bot calls UNO if playing leaves them with 1 card (90% success)
          if (currentBot.hand.length === 2) {
            const willCallUno = Math.random() < 0.92;
            if (willCallUno) {
              currentBot.hasCalledUno = true;
              sounds.playUno();
              triggerBurst(`${currentBot.name.toUpperCase()} SHOUTS UNO!`);
              addLog(`${currentBot.name} called UNO!`, "villain");
            } else {
              currentBot.hasCalledUno = false;
              addLog(`${currentBot.name} forgot to call UNO! Catch them now!`, "villain");
            }
          }

          executePlayCard(game.currentPlayerIndex, move.card, move.chosenColor);
          setBotThinking(false);
        }
      }, 1200); // 1.2s delay for natural game flow
    } else {
      setBotThinking(false);
    }

    return () => {
      if (botTurnTimeoutRef.current) clearTimeout(botTurnTimeoutRef.current);
    };
  }, [game.currentPlayerIndex, game.isGameOver, game.activeColor]);

  // Layout bots based on player count (2 vs 4)
  const is2Player = playerCount === 2;
  const topBot = is2Player ? game.players[1] : game.players[2]; // Lex Luthor in 2P, Wonder Woman in 4P
  const leftBot = is2Player ? null : game.players[1]; // Batman in 4P
  const rightBot = is2Player ? null : game.players[3]; // Lex Luthor in 4P

  const topCard = game.discardPile[game.discardPile.length - 1];
  const isSupermanTurn = game.currentPlayerIndex === 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-x-hidden relative">
      {/* Header */}
      <Header
        playerCount={playerCount}
        onChangeMode={handleChangeMode}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        onOpenRules={() => setIsRulesOpen(true)}
        onRestart={() => startNewGame()}
      />

      {/* Main Arena */}
      <main className="flex-1 flex flex-col items-center justify-between p-2 md:p-4 max-w-7xl mx-auto w-full relative z-10">
        {/* Top Arena: Opponent (Top Bot) */}
        <div className="w-full flex justify-center py-1">
          {topBot && (
            <BotPlayer
              bot={topBot}
              isTurn={game.currentPlayerIndex === topBot.index}
              position="top"
              speech={botSpeeches[topBot.id]}
            />
          )}
        </div>

        {/* Middle Arena: Left Bot, Game Board, Right Bot */}
        <div className="w-full flex flex-col md:flex-row items-center justify-around gap-4 my-2">
          {/* Left Opponent (Batman in 4P) */}
          <div className="w-48 flex justify-center order-2 md:order-1">
            {leftBot && (
              <BotPlayer
                bot={leftBot}
                isTurn={game.currentPlayerIndex === leftBot.index}
                position="left"
                speech={botSpeeches[leftBot.id]}
              />
            )}
          </div>

          {/* Center Table GameBoard */}
          <div className="order-1 md:order-2 flex-1 flex justify-center">
            <GameBoard
              topCard={topCard}
              activeColor={game.activeColor}
              drawDeckCount={game.drawDeck.length}
              direction={game.direction}
              isMyTurn={isSupermanTurn}
              onDrawCard={handleHumanDrawCard}
              actionBurst={actionBurst}
              disabled={botThinking}
              canPass={hasDrawnThisTurn}
              onPassTurn={handleHumanPassTurn}
            />
          </div>

          {/* Right Opponent (Lex Luthor in 4P) */}
          <div className="w-48 flex justify-center order-3">
            {rightBot && (
              <BotPlayer
                bot={rightBot}
                isTurn={game.currentPlayerIndex === rightBot.index}
                position="right"
                speech={botSpeeches[rightBot.id]}
              />
            )}
          </div>
        </div>

        {/* Bottom Arena: Superman Hand */}
        <div className="w-full mt-auto">
          <PlayerHand
            player={game.players[0]}
            topCard={topCard}
            activeColor={game.activeColor}
            isMyTurn={isSupermanTurn}
            onPlayCard={handleHumanPlayCard}
            onCallUno={handleCallUno}
            hasCalledUno={game.players[0]?.hasCalledUno}
            canChallengeUno={canChallengeUno}
            onChallengeUno={handleChallengeUno}
            disabled={botThinking || game.isGameOver}
          />
        </div>
      </main>

      {/* Daily Planet Live Comic Chronicle / Log */}
      <ComicLog
        logs={game.logs}
        isOpen={isLogOpen}
        onToggle={() => setIsLogOpen(!isLogOpen)}
      />

      {/* Wild Color Selection Dialog */}
      {isColorPickerOpen && (
        <ColorPickerModal onSelectColor={handleSelectColor} />
      )}

      {/* Game Over Victory / Defeat Screen */}
      {game.isGameOver && (
        <GameOverModal
          winner={game.winner}
          players={game.players}
          turnCount={game.turnCount}
          onRestart={() => startNewGame()}
        />
      )}

      {/* Rules Guide Modal */}
      {isRulesOpen && (
        <RulesModal onClose={() => setIsRulesOpen(false)} />
      )}
    </div>
  );
}
