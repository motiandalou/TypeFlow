const keyAudio = new Audio("/TypeFlow/sounds/key.mp3");
const errorAudio = new Audio("/TypeFlow/sounds/error.mp3");

export function playKeySound() {
  keyAudio.currentTime = 0;
  keyAudio.play();
}

export function playErrorSound() {
  errorAudio.currentTime = 0;
  errorAudio.play();
}
