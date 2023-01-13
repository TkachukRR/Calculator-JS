export function findElementByContext(context) {
  const allElements = document.getElementsByTagName("*");
  const findedElem = Array.from(allElements).find(
    (elem) => elem.textContent === context
  );
  return findedElem;
}
