export function makeButtonsMarkUpWithClass(buttonsArray, className) {
  return buttonsArray
    .map((button) => `<button class="${className}">${button}</button>`)
    .join("");
}
