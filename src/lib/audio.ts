type FeedbackTone = 'correct' | 'incorrect';

function getIndonesianVoice() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase() === 'id-id') ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith('id')) ||
    voices.find((voice) => voice.name.toLowerCase().includes('indonesia')) ||
    null
  );
}

export function speakIndonesian(text: string) {
  if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getIndonesianVoice();
  utterance.lang = voice?.lang || 'id-ID';
  utterance.voice = voice;
  utterance.rate = 0.85;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}

export function playFeedbackTone(type: FeedbackTone, enabled = true) {
  if (!enabled || typeof window === 'undefined') return;

  const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(type === 'correct' ? 660 : 220, now);
  if (type === 'correct') {
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.12);
  } else {
    oscillator.frequency.exponentialRampToValueAtTime(160, now + 0.14);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === 'correct' ? 0.12 : 0.08, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
  oscillator.onended = () => context.close();
}
