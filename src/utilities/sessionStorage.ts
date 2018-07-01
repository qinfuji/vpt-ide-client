export function getItem(key: string): string | null {
  let result = null;
  try {
    result = window.sessionStorage.getItem(key);
  } catch (e) {}
  return result;
}

export function setItem(key: string, data: string): void {
  try {
    window.sessionStorage.setItem(key, data);
  } catch (e) {
    /* Eat the exception */
  }
}

export function removeItem(key: string): void {
  try {
    window.sessionStorage.removeItem(key);
  } catch (e) {}
}
