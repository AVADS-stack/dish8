/**
 * Capacitor native integrations for iOS/Android.
 * Gracefully no-ops on web — safe to import everywhere.
 */
import { Capacitor } from "@capacitor/core";

export const isNative = Capacitor.isNativePlatform();

export async function initNative() {
  if (!isNative) return;

  // Add native class to body for CSS targeting
  document.body.classList.add("capacitor-app");

  try {
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    await StatusBar.setStyle({ style: Style.Dark });
    if (Capacitor.getPlatform() === "android") {
      await StatusBar.setBackgroundColor({ color: "#141414" });
    }
  } catch {}

  try {
    const { App: CapApp } = await import("@capacitor/app");
    CapApp.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else CapApp.exitApp();
    });
  } catch {}

  try {
    const { Keyboard } = await import("@capacitor/keyboard");
    Keyboard.addListener("keyboardWillShow", () => {
      document.body.classList.add("keyboard-open");
    });
    Keyboard.addListener("keyboardWillHide", () => {
      document.body.classList.remove("keyboard-open");
    });
  } catch {}
}

/** Trigger haptic feedback on native platforms */
export async function haptic(style = "Light") {
  if (!isNative) return;
  try {
    const { Haptics, ImpactStyle } = await import("@capacitor/haptics");
    await Haptics.impact({ style: ImpactStyle[style] || ImpactStyle.Light });
  } catch {}
}

/** Trigger selection haptic */
export async function hapticSelection() {
  if (!isNative) return;
  try {
    const { Haptics } = await import("@capacitor/haptics");
    await Haptics.selectionStart();
    await Haptics.selectionChanged();
    await Haptics.selectionEnd();
  } catch {}
}
