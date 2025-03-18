"use client";

import React from "react";
import { IonApp, IonContent, IonHeader, IonToolbar } from "@ionic/react";

export default function IonicWrapper({ children }: { children: React.ReactNode }) {
  return (
    <IonApp>
        <IonHeader className="bg-white shadow-md">
          <IonToolbar className="h-[56px] flex items-center bg-white shadow-md">
            <div className="h-full w-full"></div>
          </IonToolbar>
        </IonHeader>

      {/* Ensure consistent safe area padding */}
      <IonContent
        className={`transition-all duration-300 pt-[env(safe-area-inset-top,56px)]`}
      >
        {children}
      </IonContent>
    </IonApp>
  );
}
