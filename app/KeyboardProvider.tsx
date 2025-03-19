"use client"; // Ensures it runs in the browser

import { useEffect } from "react";
import { Keyboard } from "@capacitor/keyboard";

export default function KeyboardProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      Keyboard.setAccessoryBarVisible({ isVisible: false });
      Keyboard.setScroll({ isDisabled: true });

      Keyboard.addListener("keyboardWillShow", () => {
        document.body.classList.add("keyboard-open");
      });

      Keyboard.addListener("keyboardWillHide", () => {
        document.body.classList.remove("keyboard-open");
      });

      return () => {
        Keyboard.removeAllListeners();
      };
    }
  }, []);

  return <>{children}</>;
}
