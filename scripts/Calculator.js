import { makeSectionWrapperWithClass } from "./makeSectionWrapperWithClass.js";
import { makeDisplayWithClass } from "./makeDisplayWithClass.js";
import { makeButtonsMarkUpWithClass } from "./makeButtonsMarkUpWithClass.js";
import { findElementByContext } from "./findElementByContext.js";
import { BASIC_BUTTONS, BASIC_OPERATIONS } from "./Settings.js";

export class Calculator {
  #calc;
  #display;
  #previousDisplay;

  #arrayForDspExpression = [];
  #arrayForPreviousDspExpression = [];

  constructor(IDtoInsertCalc) {
    this.#calc = document.querySelector(IDtoInsertCalc);

    this.render();
    this.#display = document.querySelector(".display");
    this.#previousDisplay = document.querySelector(".previous");

    this.addListeners();
    this.addExpArrNewElement("0");

    this.setDisplayExpression(this.#arrayForDspExpression);
    this.setPreviousDisplayExpression(["0"]);
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
      this.addArrayForExpressionNewElement(event);
    });
  }

  setDisplayExpression(newExpression = this.#arrayForDspExpression) {
    this.#display.textContent = newExpression.join("");
  }

  setPreviousDisplayExpression(
    newExpression = this.#arrayForPreviousDspExpression
  ) {
    this.#previousDisplay.textContent = newExpression.join("");
  }

  addToPreviousDisplayExpressionNewElement(newElem) {
    this.#arrayForPreviousDspExpression.push(newElem);
  }

  updatePreviousDisplayExpression(newExpression) {
    this.#arrayForPreviousDspExpression = [...newExpression];
  }

  addExpArrNewElement(addingElement, position = "end") {
    position === "end" ? this.#arrayForDspExpression.push(addingElement) : null;
    position == "start"
      ? this.#arrayForDspExpression.unshift(addingElement)
      : null;
  }

  delExpArrElement(position = "end") {
    position === "end" ? this.#arrayForDspExpression.pop() : null;
    position === "start" ? this.#arrayForDspExpression.shift() : null;
  }

  addExpArrToLastElement(adaingValue, position = "end") {
    let prevValue =
      this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1];
    this.#arrayForDspExpression.pop();
    position === "end"
      ? this.#arrayForDspExpression.push(`${prevValue + adaingValue}`)
      : null;

    position === "start"
      ? this.#arrayForDspExpression.push(`${adaingValue + prevValue}`)
      : null;
  }

  deleteFromExpArrLastElement(position = "end") {
    let prevValue =
      this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1];
    this.#arrayForDspExpression.pop();
    position === "end"
      ? this.#arrayForDspExpression.push(`${prevValue.slice(0, -1)}`)
      : null;

    position === "start"
      ? this.#arrayForDspExpression.push(`${prevValue.slice(1)}`)
      : null;
  }

  updateExpArrLastElement(newValue) {
    this.#arrayForDspExpression[
      this.#arrayForDspExpression.length - 1
    ] = `${newValue}`;
  }

  updateExpArrLastElementIfEndsWithPoint() {
    this.#arrayForDspExpression[
      this.#arrayForDspExpression.length - 1
    ].endsWith(".")
      ? (this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1] +=
          "0")
      : null;
  }

  checkBracketsQauntity() {
    return this.#arrayForDspExpression.reduce((acc, elem) => {
      if (elem === "(") {
        acc += 1;
      }
      if (elem === ")") {
        acc -= 1;
      }
      return acc;
    }, 0);
  }

  addArrayForExpressionNewElement(event) {
    let inputValue = event.target.textContent;
    let isNumberInput = !Number.isNaN(Number(inputValue));
    let lastArrElem =
      this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1];
    let isNumberLastElem = !Number.isNaN(Number(lastArrElem));

    let isDefaultDispState = this.checkExpressionDefaultState();

    if ((inputValue === "0" || inputValue === "00") && lastArrElem === "0") {
      return;
    }

    if (inputValue === "00") {
      !isNumberLastElem ? this.addExpArrToLastElement("0", "end") : null;
    }

    if (inputValue === ".") {
      !lastArrElem.includes(".") && isNumberLastElem
        ? this.addExpArrToLastElement(".", "end")
        : null;
      lastArrElem === ")" || lastArrElem === "%"
        ? this.addExpArrNewElement("x")
        : null;
      !isNumberLastElem ? this.addExpArrNewElement("0.") : null;
    }

    if (isNumberInput) {
      lastArrElem === "%" || lastArrElem === ")"
        ? this.addExpArrNewElement("x")
        : null;

      Number.isNaN(
        Number(
          this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1]
        )
      )
        ? this.addExpArrNewElement(inputValue)
        : null;

      isDefaultDispState ? this.updateExpArrLastElement(inputValue) : null;

      isNumberLastElem && !isDefaultDispState
        ? this.addExpArrToLastElement(inputValue, "end")
        : null;
    }

    if (inputValue === "AC") {
      this.#arrayForDspExpression = ["0"];
      this.#arrayForPreviousDspExpression = ["0"];
    }

    if (inputValue === "C") {
      this.#arrayForDspExpression = ["0"];
    }

    if (inputValue === "←") {
      lastArrElem.length === 1 && this.#arrayForDspExpression.length === 1
        ? this.updateExpArrLastElement("0")
        : null;

      lastArrElem.length > 1 ? this.deleteFromExpArrLastElement() : null;

      lastArrElem.length === 1 && this.#arrayForDspExpression.length > 1
        ? this.delExpArrElement()
        : null;
    }

    if (
      inputValue === "+" ||
      inputValue === "-" ||
      inputValue === "x" ||
      inputValue === "÷"
    ) {
      this.updateExpArrLastElementIfEndsWithPoint();

      isNumberLastElem ||
      lastArrElem === ")" ||
      lastArrElem === "%" ||
      lastArrElem === "("
        ? this.addExpArrNewElement(inputValue)
        : null;

      lastArrElem === "+" || lastArrElem === "x" || lastArrElem === "÷"
        ? this.updateExpArrLastElement(inputValue)
        : null;
    }

    if (inputValue === "(") {
      this.updateExpArrLastElementIfEndsWithPoint();

      (isNumberLastElem || lastArrElem === "%" || lastArrElem === ")") &&
      !isDefaultDispState
        ? this.addExpArrNewElement("x")
        : null;

      Number.isNaN(
        Number(
          this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1]
        )
      )
        ? this.addExpArrNewElement(inputValue)
        : null;

      isDefaultDispState ? this.updateExpArrLastElement("(") : null;
    }

    if (inputValue === ")") {
      this.updateExpArrLastElementIfEndsWithPoint();
      let openedBracketsMoreClosed = this.checkBracketsQauntity();

      (isNumberLastElem || lastArrElem === "%" || lastArrElem === ")") &&
      openedBracketsMoreClosed
        ? this.addExpArrNewElement(inputValue)
        : null;
    }

    if (inputValue === "±") {
      this.updateExpArrLastElementIfEndsWithPoint();

      if (this.#arrayForDspExpression.length === 1) {
        this.addExpArrNewElement("-", "start");
      } else if (
        this.#arrayForDspExpression.length === 2 &&
        this.#arrayForDspExpression[0] === "-"
      ) {
        this.delExpArrElement("start");
      } else if (
        (!Number.isNaN(Number(lastArrElem)) ||
          lastArrElem === "%" ||
          lastArrElem === ")") &&
        (!Number.isNaN(Number(this.#arrayForDspExpression[0])) ||
          this.#arrayForDspExpression[0] === "(")
      ) {
        this.addExpArrNewElement("(", "start");
        this.addExpArrNewElement("-", "start");
        this.addExpArrNewElement(")", "end");
      } else if (
        this.#arrayForDspExpression[0] === "-" &&
        this.#arrayForDspExpression[1] === "(" &&
        lastArrElem === ")"
      ) {
        this.delExpArrElement("start");
        this.delExpArrElement("start");
        this.delExpArrElement("end");
      }
    }

    if (inputValue === "%") {
      this.updateExpArrLastElementIfEndsWithPoint();
      isNumberLastElem || lastArrElem === ")"
        ? this.addExpArrNewElement("%")
        : null;
    }

    this.setDisplayExpression();

    if (inputValue === "=") {
      this.updateExpArrLastElementIfEndsWithPoint();

      for (let i = 0; i < this.#arrayForDspExpression.length; i++) {
        if (
          this.#arrayForDspExpression[i] === "÷" &&
          (this.#arrayForDspExpression[i + 1] === "0." ||
            this.#arrayForDspExpression[i + 1] === "-0." ||
            Number(this.#arrayForDspExpression[i + 1]) === 0)
        ) {
          this.#display.textContent = "Ошибка. Попытка деления на 0.";
          setTimeout(() => {
            this.setDisplayExpression();
          }, 2000);
          return;
        }
      }

      if (this.checkBracketsQauntity()) {
        this.#display.textContent = "Ошибка.Проверте скобки.";
        setTimeout(() => {
          this.setDisplayExpression();
        }, 2000);
        return;
      }

      if (
        this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1] !==
          ")" &&
        isNaN(
          this.#arrayForDspExpression[this.#arrayForDspExpression.length - 1]
        )
      ) {
        this.#display.textContent = "Ошибка.Проверте последний символ.";
        setTimeout(() => {
          this.setDisplayExpression();
        }, 2000);
        return;
      }

      let calculatedArrayFromArrayForExpression = [
        ...this.#arrayForDspExpression,
      ];

      while (calculatedArrayFromArrayForExpression.length > 1) {
        let innerExpr = [];
        let innerLength;
        let lastOpBr;
        let calcPers = [];
        let indx;
        let result;

        if (calculatedArrayFromArrayForExpression[0] === "-") {
          calculatedArrayFromArrayForExpression.splice(0, 1, "x", "-1");
        }

        if (calculatedArrayFromArrayForExpression.includes(")")) {
          let lastClBr = calculatedArrayFromArrayForExpression.indexOf(")") + 1;
          let firstCattedArr = calculatedArrayFromArrayForExpression.slice(
            0,
            lastClBr
          );
          lastOpBr = firstCattedArr.lastIndexOf("(");
          innerExpr = firstCattedArr.slice(lastOpBr);
          innerLength = innerExpr.length;

          calcPers = [...innerExpr];
        } else {
          calcPers = [...calculatedArrayFromArrayForExpression];
        }

        while (calcPers.includes("%")) {
          indx = calcPers.indexOf("%");
          result = Number(calcPers[indx - 1]) * 0.01;
          result = result.toPrecision(8);

          if (Number.isNaN(result)) {
            break;
          }

          calcPers.splice(indx - 1, 2, `${result}`);
        }

        while (calcPers.includes("x")) {
          let indx = calcPers.indexOf("x");

          result = Number(calcPers[indx - 1]) * Number(calcPers[indx + 1]);
          if (Number.isNaN(result)) {
            break;
          }
          result = result.toPrecision(8);

          if (calcPers.length === 3 && Number.isNaN(Number(calcPers[1]))) {
            calcPers = [`${result}`];
            calculatedArrayFromArrayForExpression = calcPers;

            this.updatePreviousDisplayExpression(this.#arrayForDspExpression);
            this.addToPreviousDisplayExpressionNewElement("=");
            this.addToPreviousDisplayExpressionNewElement(
              calculatedArrayFromArrayForExpression.join("")
            );
            this.setPreviousDisplayExpression();
            this.setDisplayExpression(calculatedArrayFromArrayForExpression);
            return;
          }

          calcPers.splice(indx - 1, 3, `${result}`);
        }

        while (calcPers.includes("÷")) {
          indx = calcPers.indexOf("÷");
          result = Number(calcPers[indx - 1]) / Number(calcPers[indx + 1]);
          if (Number.isNaN(result)) {
            break;
          }
          result = result.toPrecision(8);

          if (calcPers.length === 3 && Number.isNaN(Number(calcPers[1]))) {
            calcPers = [`${result}`];
            calculatedArrayFromArrayForExpression = calcPers;

            this.updatePreviousDisplayExpression(this.#arrayForDspExpression);
            this.addToPreviousDisplayExpressionNewElement("=");
            this.addToPreviousDisplayExpressionNewElement(
              calculatedArrayFromArrayForExpression.join("")
            );

            this.setPreviousDisplayExpression();
            this.setDisplayExpression(calculatedArrayFromArrayForExpression);
            return;
          }

          calcPers.splice(indx - 1, 3, `${result}`);
        }

        while (calcPers.includes("+")) {
          indx = calcPers.indexOf("+");
          result = Number(calcPers[indx - 1]) + Number(calcPers[indx + 1]);
          if (Number.isNaN(result)) {
            break;
          }
          result = result.toPrecision(8);

          if (calcPers.length === 3 && Number.isNaN(Number(calcPers[1]))) {
            calcPers = [`${result}`];
            calculatedArrayFromArrayForExpression = calcPers;

            this.updatePreviousDisplayExpression(this.#arrayForDspExpression);
            this.addToPreviousDisplayExpressionNewElement("=");
            this.addToPreviousDisplayExpressionNewElement(
              calculatedArrayFromArrayForExpression.join("")
            );

            this.setPreviousDisplayExpression();
            this.setDisplayExpression(calculatedArrayFromArrayForExpression);
            return;
          }

          calcPers.splice(indx - 1, 3, `${result}`);
        }

        while (calcPers.includes("-")) {
          indx = calcPers.indexOf("-");
          result;

          if (calcPers.length === 2 && calcPers[0] === "-") {
            result = Number(calcPers[indx + 1]) * -1;
            result = result.toPrecision(8);
            calcPers = [`${result}`];
            calculatedArrayFromArrayForExpression = calcPers;

            this.updatePreviousDisplayExpression(this.#arrayForDspExpression);
            this.addToPreviousDisplayExpressionNewElement("=");
            this.addToPreviousDisplayExpressionNewElement(
              calculatedArrayFromArrayForExpression.join("")
            );

            this.setPreviousDisplayExpression();
            this.setDisplayExpression(calculatedArrayFromArrayForExpression);

            return;
          }

          result = Number(calcPers[indx - 1]) - Number(calcPers[indx + 1]);

          result = result.toPrecision(8);

          if (calcPers.length === 3 && Number.isNaN(Number(calcPers[1]))) {
            calcPers = [`${result}`];
            calculatedArrayFromArrayForExpression = calcPers;

            this.updatePreviousDisplayExpression(this.#arrayForDspExpression);
            this.addToPreviousDisplayExpressionNewElement("=");
            this.addToPreviousDisplayExpressionNewElement(
              calculatedArrayFromArrayForExpression.join("")
            );
            this.setPreviousDisplayExpression();
            this.setDisplayExpression(calculatedArrayFromArrayForExpression);
            return;
          }

          if (Number.isNaN(result)) {
            break;
          }

          calcPers.splice(indx - 1, 3, `${result}`);
        }

        calculatedArrayFromArrayForExpression.splice(
          lastOpBr,
          innerLength,
          calcPers[1]
        );
      }
      this.addToPreviousDisplayExpressionNewElement("=");
      this.addToPreviousDisplayExpressionNewElement(
        calculatedArrayFromArrayForExpression.join("")
      );

      this.setPreviousDisplayExpression();
      this.setDisplayExpression(calculatedArrayFromArrayForExpression);
    }
  }

  getResult(expression) {}

  checkExpressionDefaultState() {
    let def =
      (this.#arrayForDspExpression.length === 1 &&
        this.#arrayForDspExpression[0] === "0") ||
      (this.#arrayForDspExpression.length === 2 &&
        this.#arrayForDspExpression[0] === "-" &&
        this.#arrayForDspExpression[1] === "0")
        ? true
        : false;
    return def;
  }
}
