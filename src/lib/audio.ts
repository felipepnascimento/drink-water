let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioContext) audioContext = new AudioContextClass();
  return audioContext;
}

/**
 * Synthesized ascending "coin" style chime — no audio asset needed.
 */
export function playDrinkSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
  const startTime = ctx.currentTime;

  notes.forEach((frequency, index) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    const noteStart = startTime + index * 0.09;
    const noteEnd = noteStart + 0.22;
    gain.gain.setValueAtTime(0, noteStart);
    gain.gain.linearRampToValueAtTime(0.2, noteStart + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, noteEnd);

    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd);
  });
}

function pickChildLikeVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const ptBrVoices = voices.filter((voice) => voice.lang?.toLowerCase().replace("_", "-") === "pt-br");
  const otherPtVoices = voices.filter(
    (voice) => voice.lang?.toLowerCase().startsWith("pt") && !ptBrVoices.includes(voice),
  );
  const pool = ptBrVoices.length > 0 ? ptBrVoices : otherPtVoices.length > 0 ? otherPtVoices : voices;
  const childish = pool.find((voice) => /child|infantil|kid/i.test(voice.name));
  if (childish) return childish;
  const female = pool.find((voice) => /female|mulher|maria|luciana|joana/i.test(voice.name));
  return female ?? pool[0];
}

/**
 * Reads a message aloud tuned to sound like a cheerful children's character:
 * higher pitch and a slightly faster, playful rate.
 */
export function speakAsCharacter(text: string): void {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.pitch = 1.8;
  utterance.rate = 1.05;
  utterance.volume = 1;

  const applyVoice = () => {
    const voice = pickChildLikeVoice(window.speechSynthesis.getVoices());
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    applyVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      applyVoice();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }
}
