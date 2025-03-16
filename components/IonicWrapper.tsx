"use client";

import React, { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { IonApp, IonContent, IonHeader, IonToolbar } from "@ionic/react";

export default function IonicWrapper({ children }: { children: React.ReactNode }) {
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    setIsNativeApp(Capacitor.isNativePlatform()); // Check if running in a native app
  }, []);

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

      {/* Adjust padding dynamically */}
      <IonContent className={`${isNativeApp ? "pt-[var(--safe-area-inset-top,20px)]" : "pt-0"}`}>
        {children}
      </IonContent>
    </IonApp>
  );
}
