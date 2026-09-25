const fs = require('fs');

function generateSoundtrack(outputPath, durationSeconds = 25) {
  const sampleRate = 44100;
  const numChannels = 2;
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * numChannels * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * 2, 28);
  buffer.writeUInt16LE(numChannels * 2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Musical notes frequencies (Hz)
  const notes = {
    C3: 130.81, G3: 196.00, C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
    C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00
  };

  // Heroic Motif Timeline (Melody notes with start time and duration)
  const melody = [
    // Intro fanfare (0 - 4s)
    { t: 0.2, d: 0.4, f: notes.G3 },
    { t: 0.7, d: 0.8, f: notes.C4 },
    { t: 1.6, d: 0.4, f: notes.G4 },
    { t: 2.1, d: 1.2, f: notes.E4 },
    
    // Rules Inspection Motif (4 - 8s)
    { t: 4.2, d: 0.3, f: notes.C4 },
    { t: 4.6, d: 0.3, f: notes.E4 },
    { t: 5.0, d: 0.5, f: notes.G4 },
    { t: 6.2, d: 0.4, f: notes.A4 },
    { t: 6.7, d: 0.8, f: notes.G4 },

    // Duel Build-up (8 - 14s)
    { t: 8.5, d: 0.3, f: notes.C4 },
    { t: 8.9, d: 0.3, f: notes.D4 },
    { t: 9.3, d: 0.6, f: notes.E4 },
    { t: 10.5, d: 0.4, f: notes.G4 },
    { t: 11.0, d: 0.4, f: notes.A4 },
    { t: 11.5, d: 1.0, f: notes.C5 },

    // Action Clash (14 - 19s)
    { t: 14.0, d: 0.3, f: notes.C5 },
    { t: 14.4, d: 0.3, f: notes.B4 },
    { t: 14.8, d: 0.5, f: notes.C5 },
    { t: 16.0, d: 0.4, f: notes.D5 },
    { t: 16.5, d: 0.4, f: notes.C5 },
    { t: 17.0, d: 0.8, f: notes.G4 },

    // Grand Finale & UNO Fanfare (20 - 26s)
    { t: 20.2, d: 0.3, f: notes.G4 },
    { t: 20.6, d: 0.3, f: notes.C5 },
    { t: 21.0, d: 0.5, f: notes.E5 },
    { t: 21.6, d: 0.4, f: notes.D5 },
    { t: 22.1, d: 1.2, f: notes.C5 },
    { t: 23.5, d: 0.3, f: notes.G4 },
    { t: 23.9, d: 0.3, f: notes.C5 },
    { t: 24.3, d: 1.8, f: notes.E5 }
  ];

  // Helper synth oscillator
  function synth(f, t, attack = 0.05, release = 0.1) {
    if (f <= 0) return 0;
    // Multi-harmonic brass / synth tone
    const wave1 = Math.sin(2 * Math.PI * f * t);
    const wave2 = 0.5 * Math.sin(4 * Math.PI * f * t);
    const wave3 = 0.25 * Math.sin(6 * Math.PI * f * t);
    return (wave1 + wave2 + wave3) * 0.45;
  }

  let offset = 44;
  const bpm = 124;
  const beatInterval = 60 / bpm;

  for (let i = 0; i < numSamples; i++) {
    const time = i / sampleRate;

    // 1. Cinematic Rhythm Track (Kick & Snare beat)
    const beatPhase = (time % beatInterval) / beatInterval;
    const beatIndex = Math.floor(time / beatInterval);
    let drum = 0;

    // Kick on beats 0 and 2
    if (beatIndex % 2 === 0 && beatPhase < 0.2) {
      const kickFreq = Math.max(40, 150 * (1 - beatPhase * 5));
      drum += Math.sin(2 * Math.PI * kickFreq * time) * (1 - beatPhase * 5) * 0.4;
    }
    // Snare / clap on beats 1 and 3
    if (beatIndex % 2 === 1 && beatPhase < 0.25) {
      const noise = (Math.random() * 2 - 1) * (1 - beatPhase * 4);
      drum += noise * 0.25;
    }

    // Driving sub-bass arp
    const arpNotes = [notes.C3, notes.G3, notes.C3, notes.E4];
    const subNote = arpNotes[Math.floor((time * 4) % 4)];
    const bass = Math.sin(2 * Math.PI * subNote * time) * 0.2;

    // 2. Melody Lead
    let lead = 0;
    for (const note of melody) {
      if (time >= note.t && time < note.t + note.d) {
        const noteTime = time - note.t;
        const envelope = Math.sin(Math.PI * (noteTime / note.d));
        lead += synth(note.f, noteTime) * envelope * 0.6;
      }
    }

    // 3. Special SFX Sweeps
    let sfx = 0;
    // Heat Vision / Laser sweep at 15s
    if (time >= 15.0 && time < 16.0) {
      const sfxTime = time - 15.0;
      const laserFreq = 880 - sfxTime * 500;
      sfx += Math.sin(2 * Math.PI * laserFreq * sfxTime) * (1 - sfxTime) * 0.35;
    }
    // Victory fanfare sparkle at 23.5s - 26s
    if (time >= 23.5 && time < 26.2) {
      const vTime = time - 23.5;
      sfx += Math.sin(2 * Math.PI * 1046.5 * vTime) * Math.sin(vTime * 12) * 0.2;
    }

    // Mixdown
    let mixed = (drum + bass + lead + sfx) * 0.85;
    mixed = Math.max(-0.95, Math.min(0.95, mixed));

    const sample16 = Math.floor(mixed * 32767);
    buffer.writeInt16LE(sample16, offset);
    buffer.writeInt16LE(sample16, offset + 2);
    offset += 4;
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`Soundtrack generated: ${outputPath} (${durationSeconds}s)`);
}

generateSoundtrack('/config/Desktop/Session1/superman_uno_soundtrack.wav', 26);
