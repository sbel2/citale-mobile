"use client";

import React from "react";
import { IonApp, IonContent, IonHeader, IonToolbar } from "@ionic/react";

interface IonicWrapperProps {
  children: React.ReactNode;
  disableScroll?: boolean;
}

export default function IonicWrapper({ children, disableScroll = false }: IonicWrapperProps) {
  return (
    <IonApp>
      {/* Header respects iOS status bar (safe area inset top) */}
      <IonHeader
        className="bg-white shadow-md"
        style={{
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <IonToolbar className="h-[56px] flex items-center bg-white shadow-md">
          <div className="h-full w-full"></div>
        </IonToolbar>
      </IonHeader>

      {/* Content respects header and bottom safe area */}
      <IonContent
        className="transition-all duration-300"
        style={{
          paddingTop: "calc(env(safe-area-inset-top) + 56px)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        scrollY={!disableScroll}
        forceOverscroll={!disableScroll}
      >
        {children}
      </IonContent>
    </IonApp>
  );
}
