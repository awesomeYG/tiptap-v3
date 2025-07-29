import { MAC_SYMBOLS } from "../contants/shortcut-key";

export const isMac = () => typeof navigator !== "undefined" &&
  navigator.platform.toLowerCase().includes("mac")

export const getShortcutKeyText = (shortcutKey: string[]) => {
  return shortcutKey?.map(it => (isMac() ? (MAC_SYMBOLS[it as keyof typeof MAC_SYMBOLS] || it) : it)).join(' + ');
}