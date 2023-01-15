import { makeSectionWrapperWithClass } from "./makeSectionWrapperWithClass.js";
import { makeDisplayWithClass } from "./makeDisplayWithClass.js";
import { makeButtonsMarkUpWithClass } from "./makeButtonsMarkUpWithClass.js";
import { findElementByContext } from "./findElementByContext.js";
import { chekInputValue } from "./chekInputValue.js";
import { BASIC_BUTTONS, BASIC_OPERATIONS } from "./Settings.js";
export class Calculator {
  #calc;

  #mainDisplay;
  #subDisplay;

  #mainDsplExpression = [];
  #subDsplExpression = [];

  constructor(IDtoInsertCalc) {
    this.#calc = document.querySelector(IDtoInsertCalc);

    this.render();
    this.#mainDisplay = document.querySelector(".display");
    this.#subDisplay = document.querySelector(".previous");

    this.addListeners();

    this.resetMainDsplExpression();
    this.resetSubDsplExpression();

    this.showOnMainDisplay();
    this.showOnSubDisplay();

    //
    this.setMainDisplayExpression(["0"]);
    this.showOnMainDisplay();
  }

  render() {
    this.#calc.insertAdjacentHTML(
      "beforeend",
      makeSectionWrapperWithClass(
        "section screen",
        makeDisplayWithClass("display")
      )
    );
    this.#calc.insertAdjacentHTML(
      "beforeend",
      makeSectionWrapperWithClass(
        "section basic__numbers",
        makeButtonsMarkUpWithClass(BASIC_BUTTONS, "button basic__numb")
      )
    );

    this.#calc.insertAdjacentHTML(
      "beforeend",
      makeSectionWrapperWithClass(
        "section basic__operations",
        makeButtonsMarkUpWithClass(BASIC_OPERATIONS, "button basic__oper")
      )
    );

    findElementByContext("AC").classList.add("red");
    findElementByContext("C").classList.add("orange");
  }

  addListeners() {
    this.#calc.addEventListener("click", (event) => {
      if (
        !event.target.classList.contains("basic__numb") &&
        !event.target.classList.contains("basic__oper")
      ) {
        return;
      }

      this.onClick(event);
    });
  }

  //
  showOnMainDisplay(newExpression = this.#mainDsplExpression) {
    this.#mainDisplay.textContent = newExpression.join("");
  }

  showOnSubDisplay(newExpression = this.#subDsplExpression) {
    this.#subDisplay.textContent = newExpression.join("");
  }

  addToMainDsplExpressionNewElement(addingElement, position = "end") {
    position === "end" ? this.#mainDsplExpression.push(addingElement) : null;
    position == "start"
      ? this.#mainDsplExpression.unshift(addingElement)
      : null;
  }

  addToSubDsplExpressionNewElement(newElem) {
    this.#subDsplExpression.push(newElem);
  }

  addToMainDsplEpressionLastElementSymbol(adaingValue, position = "end") {
    const prevValue =
      this.#mainDsplExpression[this.#mainDsplExpression.length - 1];
    this.#mainDsplExpression.pop();

    position === "end"
      ? this.#mainDsplExpression.push(`${prevValue + adaingValue}`)
      : null;

    position === "start"
      ? this.#mainDsplExpression.push(`${adaingValue + prevValue}`)
      : null;
  }

  resetMainDsplExpression() {
    this.#mainDsplExpression = ["0"];
  }

  resetSubDsplExpression() {
    this.#subDsplExpression = ["0"];
  }

  getMainDsplExpressionLastElement() {
    return this.#mainDsplExpression[this.#mainDsplExpression.length - 1];
  }

  replaceMainDsplExpressionLastElement(newElement) {
    this.#mainDsplExpression.pop();
    this.#mainDsplExpression.push(`${newElement}`);
  }

  deleteFromMainExpressionElement(position = "end") {
    position === "end" ? this.#mainDsplExpression.pop() : "";

    position === "start" ? this.#mainDsplExpression.shift() : "";
  }

  deleteFromMainExpressionLastElementSymbol(position = "end") {
    let prevValue =
      this.#mainDsplExpression[this.#mainDsplExpression.length - 1];
    this.#mainDsplExpression.pop();
    position === "end"
      ? this.#mainDsplExpression.push(`${prevValue.slice(0, -1)}`)
      : "";

    position === "start"
      ? this.#mainDsplExpression.push(`${prevValue.slice(1)}`)
      : "";
  }

  setSubDisplayExpression(newExpression) {
    this.#subDsplExpression = [...newExpression];
  }

  setMainDisplayExpression(newExpression) {
    this.#mainDsplExpression = [...newExpression];
  }

  fixLastMainDsplExpressionElementEndsWithPoin() {
    if (
      this.#mainDsplExpression[this.#mainDsplExpression.length - 1].endsWith(
        "."
      )
    ) {
      this.addToMainDsplEpressionLastElementSymbol("0");
    }
  }

  calcAdvantageOpenBrackets() {
    return this.#mainDsplExpression.reduce((acc, elem) => {
      if (elem === "(") {
        acc += 1;
      }
      if (elem === ")") {
        acc -= 1;
      }
      return acc;
    }, 0);
  }

  checkForZeroDivision() {
    for (let i = 0; i < this.#mainDsplExpression.length; i++) {
      if (
        this.#mainDsplExpression[i] === "÷" &&
        Number(this.#mainDsplExpression[i + 1]) === 0
      ) {
        return true;
      }
    }
  }

  calculatResult() {
    let copyMainDispArrayForSubDisplay = [...this.#mainDsplExpression];
    let resultOperationArray = [...copyMainDispArrayForSubDisplay];
    let expressionInBrackets = [];
    let indexLastOpenBracket;
    let expressionInBracketsLength;

    while (resultOperationArray.length > 1) {
      if (resultOperationArray.includes(")")) {
        let firstCutArray = [...resultOperationArray];
        let indexFirstClosedBracket = firstCutArray.indexOf(")");

        firstCutArray.splice(indexFirstClosedBracket, firstCutArray.length);

        indexLastOpenBracket = firstCutArray.lastIndexOf("(");

        let innerBracketsExtension = [...firstCutArray];
        innerBracketsExtension.splice(0, indexLastOpenBracket + 1);
        expressionInBracketsLength = innerBracketsExtension.length;

        expressionInBrackets = [...innerBracketsExtension];
      } else {
        expressionInBrackets = [...resultOperationArray];
        indexLastOpenBracket = 0;
        expressionInBracketsLength = expressionInBrackets.length;
      }

      if (expressionInBrackets.includes("%")) {
        while (expressionInBrackets.includes("%")) {
          let index = expressionInBrackets.indexOf("%");
          let result = Number(expressionInBrackets[index - 1]) / 100;
          expressionInBrackets.splice(index - 1, 2, `${result}`);
        }
      }

      if (expressionInBrackets.includes("x")) {
        while (expressionInBrackets.includes("x")) {
          let index = expressionInBrackets.indexOf("x");
          let result =
            Number(expressionInBrackets[index - 1]) *
            Number(expressionInBrackets[index + 1]);
          expressionInBrackets.splice(index - 1, 3, `${result}`);
        }
      }

      if (expressionInBrackets.includes("÷")) {
        while (expressionInBrackets.includes("÷")) {
          let index = expressionInBrackets.indexOf("÷");
          let result =
            Number(expressionInBrackets[index - 1]) /
            Number(expressionInBrackets[index + 1]);
          expressionInBrackets.splice(index - 1, 3, `${result}`);
        }
      }

      if (expressionInBrackets.includes("+")) {
        while (expressionInBrackets.includes("+")) {
          let index = expressionInBrackets.indexOf("+");
          let result =
            Number(expressionInBrackets[index - 1]) +
            Number(expressionInBrackets[index + 1]);
          expressionInBrackets.splice(index - 1, 3, `${result}`);
        }
      }

      if (expressionInBrackets.includes("-")) {
        if (expressionInBrackets[0] === "-") {
          expressionInBrackets[1] = `${Number(expressionInBrackets[1]) * -1}`;
          expressionInBrackets.shift();
        }
        while (expressionInBrackets.includes("-")) {
          let index = expressionInBrackets.indexOf("-");
          let result =
            Number(expressionInBrackets[index - 1]) -
            Number(expressionInBrackets[index + 1]);
          expressionInBrackets.splice(index - 1, 3, `${result}`);
        }
      }

      resultOperationArray.splice(
        indexLastOpenBracket,
        expressionInBracketsLength + 2,
        ...expressionInBrackets
      );
    }

    this.setSubDisplayExpression([
      ...this.#mainDsplExpression,
      "=",
      ...resultOperationArray,
    ]);
    this.showOnSubDisplay();
    this.setMainDisplayExpression(resultOperationArray);
  }

  onClick(event) {
    const inputValue = event.target.textContent;
    const lastArrElem = this.getMainDsplExpressionLastElement();
    const isClearingBtn = chekInputValue("AC", "C", "←");
    const isOperation = chekInputValue("+", "-", "x", "÷");
    const isPercent = chekInputValue("%");
    const isBracket = chekInputValue("(", ")");
    const isOpposite = chekInputValue("±");
    const isResult = chekInputValue("=");
    const isNumPad = chekInputValue(".") || !Number.isNaN(Number(inputValue));
    const isNumberLastElem =
      !Number.isNaN(Number(lastArrElem)) || lastArrElem.endsWith(".");

    switch (true) {
      case isNumPad:
        if (lastArrElem === "%" || lastArrElem === ")") {
          this.addToMainDsplExpressionNewElement("x");
        }

        if (inputValue === ".") {
          if (isNumberLastElem && !lastArrElem.includes(".")) {
            this.addToMainDsplEpressionLastElementSymbol(inputValue);
            break;
          }

          if (!isNumberLastElem) {
            this.addToMainDsplExpressionNewElement("0.");
            break;
          }
        }

        if (inputValue === "00" || inputValue === "0") {
          if (lastArrElem === "-0" || lastArrElem === "0") {
            break;
          }
        }

        if (Number.isInteger(Number(inputValue))) {
          if (lastArrElem === "-0" || lastArrElem === "0") {
            this.replaceMainDsplExpressionLastElement(inputValue);
            break;
          }

          if (isNumberLastElem) {
            this.addToMainDsplEpressionLastElementSymbol(inputValue);
            break;
          }

          if (!isNumberLastElem) {
            this.addToMainDsplExpressionNewElement(`${Number(inputValue)}`);
            break;
          }
        }

        break;

      case isClearingBtn:
        if (inputValue === "AC") {
          this.resetMainDsplExpression();
          this.resetSubDsplExpression();
          this.showOnSubDisplay();
          break;
        }

        if (inputValue === "C") {
          this.resetMainDsplExpression();
          break;
        }

        if (inputValue === "←") {
          if (
            lastArrElem.length === 1 &&
            this.#mainDsplExpression.length === 1
          ) {
            this.resetMainDsplExpression();
            break;
          }

          if (lastArrElem.length > 1) {
            this.deleteFromMainExpressionLastElementSymbol();
            break;
          }

          if (lastArrElem.length === 1) {
            this.deleteFromMainExpressionElement();
            break;
          }

          break;
        }

        break;

      case isOperation:
        if (
          (lastArrElem === "+" ||
            lastArrElem === "x" ||
            lastArrElem === "÷" ||
            lastArrElem === "-") &&
          this.#mainDsplExpression[this.#mainDsplExpression.length - 2] !== "("
        ) {
          this.replaceMainDsplExpressionLastElement(inputValue);
          break;
        }

        this.fixLastMainDsplExpressionElementEndsWithPoin();

        if (lastArrElem === ")" || lastArrElem === "%") {
          this.addToMainDsplExpressionNewElement(inputValue);
          break;
        }

        if (isNumberLastElem || (lastArrElem === "(" && inputValue === "-")) {
          this.addToMainDsplExpressionNewElement(inputValue);
          break;
        }

        if (!isNumberLastElem) {
          break;
        }

        break;

      case isPercent:
        if (!isNumberLastElem && lastArrElem !== ")") {
          break;
        }
        this.fixLastMainDsplExpressionElementEndsWithPoin();
        this.addToMainDsplExpressionNewElement(inputValue);
        break;

      case isBracket:
        if (isNumberLastElem) {
          this.fixLastMainDsplExpressionElementEndsWithPoin();
        }

        if (inputValue === "(") {
          if (isNumberLastElem || lastArrElem === "%" || lastArrElem === ")") {
            this.addToMainDsplExpressionNewElement("x");
            this.addToMainDsplExpressionNewElement(inputValue);
            break;
          }
          this.addToMainDsplExpressionNewElement(inputValue);
          break;
        }

        if (inputValue === ")") {
          if (!this.calcAdvantageOpenBrackets()) {
            break;
          }

          if (isNumberLastElem || lastArrElem === "%" || lastArrElem === ")") {
            this.addToMainDsplExpressionNewElement(inputValue);
          }
          break;
        }

        break;

      case isOpposite:
        if (this.#mainDsplExpression.length === 1) {
          if (lastArrElem.includes("-")) {
            this.deleteFromMainExpressionLastElementSymbol("start");
            break;
          } else {
            this.addToMainDsplEpressionLastElementSymbol("-", "start");
            break;
          }
        }

        if (this.#mainDsplExpression.length === 2 && lastArrElem === "%") {
          if (this.#mainDsplExpression[0].includes("-")) {
            this.deleteFromMainExpressionLastElementSymbol("start");
            break;
          } else {
            this.addToMainDsplExpressionNewElement("-", "start");
            break;
          }
        }
        if (this.#mainDsplExpression.length === 3) {
          this.fixLastMainDsplExpressionElementEndsWithPoin();

          if (this.#mainDsplExpression[0] === "-") {
            this.deleteFromMainExpressionElement("start");
            break;
          }
        }

        if (this.#mainDsplExpression.length >= 3) {
          this.fixLastMainDsplExpressionElementEndsWithPoin();

          if (
            this.#mainDsplExpression[0] === "-" &&
            this.#mainDsplExpression[1] === "(" &&
            lastArrElem === ")"
          ) {
            this.deleteFromMainExpressionElement("start");
            this.deleteFromMainExpressionElement("start");
            this.deleteFromMainExpressionElement("end");
          } else if (isNumberLastElem) {
            this.addToMainDsplExpressionNewElement("(", "start");
            this.addToMainDsplExpressionNewElement("-", "start");
            this.addToMainDsplExpressionNewElement(")", "end");
          }
        }

        break;

      case isResult:
        this.fixLastMainDsplExpressionElementEndsWithPoin();

        if (this.calcAdvantageOpenBrackets()) {
          this.#mainDisplay.textContent = "Ошибка.Проверте скобки.";
          setTimeout(() => {
            this.showOnMainDisplay();
          }, 2000);
          return;
        }

        if (this.checkForZeroDivision()) {
          this.#mainDisplay.textContent = "Ошибка. Попытка деления на 0.";
          setTimeout(() => {
            this.showOnMainDisplay();
          }, 2000);
          return;
        }

        if (!isNumberLastElem && lastArrElem !== ")" && lastArrElem !== "%") {
          this.#mainDisplay.textContent = "Ошибка.Проверте последний символ.";
          setTimeout(() => {
            this.showOnMainDisplay();
          }, 2000);
          return;
        }

        this.calculatResult();
        break;
    }

    this.showOnMainDisplay();
  }
}
