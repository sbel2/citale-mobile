"use client";

import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { IonApp, IonContent, IonHeader, IonToolbar } from "@ionic/react";

export default function IonicWrapper({ children }: { children: React.ReactNode }) {
  const [isNativeApp, setIsNativeApp] = useState<boolean | null>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem("isNativeApp");
      return storedValue ? JSON.parse(storedValue) : null;
    }
    return null;
  });

  useEffect(() => {
    if (isNativeApp === null) {
      const detected = Capacitor.isNativePlatform();
      setIsNativeApp(detected);
      localStorage.setItem("isNativeApp", JSON.stringify(detected)); // Persist value
    }
  }, [isNativeApp]);

  if (isNativeApp === null) return null; // Prevent render until detection is done

  return (
    <IonApp>
      {/* Only show toolbar on native apps */}
      {isNativeApp && (
        <IonHeader className="bg-white shadow-md">
          <IonToolbar className="h-[56px] flex items-center bg-white shadow-md">
            <div className="h-full w-full"></div>
          </IonToolbar>
        </IonHeader>
      )}

      {/* Ensure consistent safe area padding */}
      <IonContent
        className={`transition-all duration-300 ${
          isNativeApp ? "pt-[env(safe-area-inset-top,56px)]" : "pt-0"
        }`}
      >
        {children}
      </IonContent>
    </IonApp>
  );
}
