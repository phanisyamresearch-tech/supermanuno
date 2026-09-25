# 🏛️ Software Architecture: Superman & DC Comics UNO (Battle for Metropolis)

This document provides a comprehensive technical overview of the architecture, design patterns, state management, and component hierarchies for the **Superman & DC Comics UNO** web application.

---

## 1. High-Level System Architecture

```mermaid
graph TB
    subgraph UI_Layer["🖥️ Presentation & UI Layer (React 19)"]
        App["App.jsx<br/>(Master Game Controller & State Container)"]
        Header["Header.jsx<br/>• Game Modes (2P / 4P)<br/>• Audio Controls<br/>• Rules Launcher"]
        Board["GameBoard.jsx<br/>• 3D Discard Pile<br/>• Draw Deck<br/>• Orbit Indicator<br/>• Action Bursts"]
        SupermanHand["PlayerHand.jsx<br/>• Fanned Cards<br/>• Playable Glowing Borders<br/>• CALL UNO Button"]
        Bots["BotPlayer.jsx<br/>• Batman (Tactician)<br/>• Wonder Woman (Warrior)<br/>• Lex Luthor (Nemesis)<br/>• Speech Bubbles"]
        Modals["Modals & Overlays<br/>• ColorPickerModal.jsx<br/>• RulesModal.jsx<br/>• GameOverModal.jsx"]
        NewsWire["ComicLog.jsx<br/>• Daily Planet News Wire"]
        ComicIcons["ComicIcons.jsx<br/>• Custom Vector Hero Crests"]
    end

    subgraph Logic_Layer["🧠 Game Logic & Rule Engine (unoEngine.js)"]
        DeckGen["Deck Generator & Shuffler<br/>• 110 Superman/DC Cards<br/>• Fisher-Yates Algorithm"]
        Validator["Play Validator (canPlayCard)<br/>• Color Matching<br/>• Value Matching<br/>• Wild Handling"]
        TurnManager["Turn & Orbit Manager<br/>• Direction Control (1 / -1)<br/>• Skip / Reverse / Stacking"]
        AIEngine["Character AI Decision Engine<br/>• Batman: Conservative / Saves Wilds<br/>• Wonder Woman: High-value Tempo<br/>• Lex Luthor: Aggressive +4 Targeter"]
        UnoRules["UNO Rules & Challenge System<br/>• Shouting Detection<br/>• Penalty Challenge (+2 cards)"]
    end

    subgraph Audio_Layer["🔊 Audio & Visual FX Layer"]
        WebAudio["soundEffects.js (Web Audio API)<br/>• Laser Sweep Oscillator<br/>• Sub-bass Punch Boom<br/>• Kryptonite Hum<br/>• Heroic Brass Fanfare"]
        Confetti["canvas-confetti<br/>• Victory Particle Emitter"]
        ComicFX["Comic Burst Engine<br/>• BAM! / POW! / Heat Vision Freezes"]
    end

    subgraph Asset_Layer["🎨 Styling & Asset Pipeline"]
        Tailwind["Tailwind CSS v4<br/>• Halftone Dot Backgrounds<br/>• Dynamic Comic Borders"]
        Typography["Google Fonts<br/>• Bangers, Bebas Neue, Comic Neue"]
    end

    %% Connections
    App --> Header
    App --> Board
    App --> SupermanHand
    App --> Bots
    App --> Modals
    App --> NewsWire
    Board --> ComicIcons
    SupermanHand --> ComicIcons
    Bots --> ComicIcons

    App <--> Logic_Layer
    App --> Audio_Layer
    UI_Layer --> Asset_Layer
```

---

## 2. Game Loop & State Flow Diagram

The state transitions follow a unidirectional data flow coordinated entirely through immutable state updates in `App.jsx`:

```mermaid
sequenceDiagram
    autonumber
    actor Player as 🦸‍♂️ Superman (Player)
    participant UI as 🖥️ React UI (App.jsx)
    participant Engine as ⚙️ Rule Engine (unoEngine.js)
    participant Audio as 🔊 Sound Effects (Web Audio API)
    actor Bot as 🦹‍♂️ Lex Luthor / Batman / WW

    Note over Player, Bot: Turn 1: Player's Turn
    Player->>UI: Selects Playable Card in Hand
    UI->>Engine: canPlayCard(selectedCard, topDiscard, activeColor)
    Engine-->>UI: Valid (True)
    alt Card is Wild / Legendary Solar Burst
        UI->>Player: Open ColorPickerModal
        Player->>UI: Selects Solar Crimson
    end
    UI->>Audio: playCard() / playLaser() / playPunch()
    UI->>UI: Update discardPile, players, activeColor, turn
    UI->>UI: Trigger Comic Action Burst ("HEAT VISION FREEZE!")

    Note over Player, Bot: Turn 2: AI Bot's Turn
    UI->>Bot: botTurnTimeout triggers (thinking delay)
    Bot->>UI: Display Speech Bubble ("Metropolis will bow to LexCorp!")
    UI->>Engine: getBotMove(botHand, topDiscard, activeColor, personality)
    Engine-->>UI: Returns chosen card or draw action
    UI->>Audio: playCard() / playKryptonite()
    UI->>UI: Update gameState & advance turn to next player

    Note over Player, Bot: Endgame Condition
    alt Hand length == 0
        UI->>UI: isGameOver = True, winner = Superman
        UI->>Audio: playVictory() (Heroic Trumpet Fanfare)
        UI->>Player: Show GameOverModal + Confetti Explosion
    end
```

---

## 3. Component Hierarchy & Responsibilities

| Component | Responsibility |
| :--- | :--- |
| **`App.jsx`** | Central container. Owns `game` state, orchestrates AI timeouts, handles color picker modals, dispatches sound effects, and runs turn transitions. |
| **`Header.jsx`** | Top bar. Houses the 3D Superman title badge, mode switcher (2P Duel vs. 4P League), sound mute toggle, and rules launcher. |
| **`GameBoard.jsx`** | Center arena. Displays 3D-angled draw deck with card counters, rotating discard stack, orbital direction ring, and comic action popups. |
| **`PlayerHand.jsx`** | Bottom shelf. Renders Superman's interactive fanned card hand, glow animations on legal cards, "CALL UNO!" button, and challenge button. |
| **`BotPlayer.jsx`** | Surrounding opponent stations (Batman, Wonder Woman, Lex Luthor). Displays 3D face-down card stacks, character crests, and dynamic dialogue bubbles. |
| **`CardView.jsx`** | Reusable card renderer. Generates front and back faces, corner values, custom SVG comic emblems, halftone patterns, and hover physics. |
| **`ColorPickerModal.jsx`** | 4-quadrant comic modal for choosing new color frequency (Solar Crimson, Metropolis Azure, Solar Gold, Kryptonite Emerald). |
| **`GameOverModal.jsx`** | Victory/Defeat screen rendering match statistics, hero dialogue, and trigger for `canvas-confetti`. |
| **`RulesModal.jsx`** | Illustrated Hero's Field Manual detailing standard UNO mechanics and custom DC action card powers. |
| **`ComicLog.jsx`** | Collapsible Daily Planet News Wire logging every move, penalty, skip, and villain shout. |

---

## 4. Game Logic & AI Decision Engine (`unoEngine.js`)

### Tactical AI Personalities
Each AI opponent evaluates the board and picks cards based on custom superhero tactical weighting:

- **🦇 Batman (The Dark Knight)**:
  - Conserves Wild and +4 cards for defensive emergencies.
  - Prioritizes attacking the player who currently has the fewest cards in hand.
- **👸 Wonder Woman (Princess of Themyscira)**:
  - Balances high-value tempo plays.
  - Matches colors aggressively to deplete standard number cards first.
- **🧪 Lex Luthor (LexCorp Mastermind)**:
  - Aggressive nemesis.
  - Prioritizes playing Kryptonite Ambush (+4) and Super Punch (+2) cards against Superman whenever possible.

---

## 5. Procedural Audio Synthesis Architecture (`soundEffects.js`)

Unlike traditional web games that load external MP3/WAV files over HTTP, this application generates **100% of its sound effects procedurally** using the browser's native **Web Audio API**:

```mermaid
graph LR
    AudioCtx[AudioContext] --> MasterGain[Master Volume / Mute Node]
    
    subgraph Generators[Procedural Oscillators]
        Laser[Laser Sweep<br/>Linear Ramp 880Hz to 120Hz]
        Punch[Punch Boom<br/>Sine 160Hz with Exponential Decay]
        Kryptonite[Kryptonite Hum<br/>Sawtooth 65Hz + Ring Modulator]
        Fanfare[Heroic Fanfare<br/>Brass Multi-Oscillator Chords G-C-E-G]
        Click[Card Flip<br/>Bandpass Filtered White Noise]
    end

    Laser --> MasterGain
    Punch --> MasterGain
    Kryptonite --> MasterGain
    Fanfare --> MasterGain
    Click --> MasterGain
    MasterGain --> Destination[Audio Destination / Speakers]
```

---

## 6. Directory Structure

```text
superman-uno/
├── media/                     # Demo video and high-res screenshot assets
│   ├── superman_uno_demo.mp4
│   ├── superman_uno_screenshot2.png
│   ├── test_duel_mode.png
│   └── test_rules_modal.png
├── public/                    # Static favicon and vector symbols
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/                # Logos and icons
│   ├── audio/                 # Web Audio API sound synthesizer
│   │   └── soundEffects.js
│   ├── components/            # UI components
│   │   ├── BotPlayer.jsx
│   │   ├── CardView.jsx
│   │   ├── ColorPickerModal.jsx
│   │   ├── ComicIcons.jsx
│   │   ├── ComicLog.jsx
│   │   ├── GameBoard.jsx
│   │   ├── GameOverModal.jsx
│   │   ├── Header.jsx
│   │   ├── PlayerHand.jsx
│   │   └── RulesModal.jsx
│   ├── logic/                 # Pure game engine & AI tactics
│   │   └── unoEngine.js
│   ├── App.jsx                # Main orchestrator component
│   ├── index.css              # Comic styles & Tailwind configuration
│   └── main.jsx               # Application entry point
├── ARCHITECTURE.md            # System architecture specification
├── README.md                  # Project overview & quickstart guide
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration with Tailwind CSS
```
