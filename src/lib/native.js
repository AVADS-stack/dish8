/**
 * Capacitor native integrations for iOS/Android.
 * Gracefully no-ops on web — safe to import everywhere.
 */
import { Capacitor } from "@capacitor/core";

export const isNative = Capacitor.isNativePlatform();

export async function initNative() {
  if (!isNative) return;

  try {
    // Status bar — dark content on dark background
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#141414" });
  } catch {}

  try {
    // Handle hardware back button on Android
    const { App: CapApp } = await import("@capacitor/app");
    CapApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });
  } catch {}

  try {
    // Keyboard — adjust viewport on iOS
    const { Keyboard } = await import("@capacitor/keyboard");
    Keyboard.addListener("keyboardWillShow", () => {
      document.body.classList.add("keyboard-open");
    });
    Keyboard.addListener("keyboardWillHide", () => {
      document.body.classList.remove("keyboard-open");
    });
  } catch {}
}
