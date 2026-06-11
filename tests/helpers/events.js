// React перехватывает сеттер value на инпуте (value tracker) и проглатывает
// событие change, если значение менялось через перехваченный сеттер.
// Пишем значение через нативный сеттер прототипа — тогда диспатч
// input-события доходит до onChange.
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value",
).set;

export function setNativeInputValue(input, value) {
  nativeInputValueSetter.call(input, value);
}

export function dispatchChange(input) {
  // React wires onChange to the native 'input' event, not 'change'
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

export function dispatchFocus(input) {
  input.focus();
  // страховка для headless-окружения, если нативный focus не сработал
  if (document.activeElement !== input) {
    input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
  }
}

export function dispatchBlur(input) {
  const wasFocused = document.activeElement === input;
  input.blur();
  if (wasFocused && document.activeElement === input) {
    input.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
  }
}

export function dispatchPaste(input) {
  input.dispatchEvent(new ClipboardEvent("paste", { bubbles: true }));
}
