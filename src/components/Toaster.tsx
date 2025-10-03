"use client";
import { Toaster } from "react-hot-toast";

export default function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          background: 'rgba(15, 23, 42, 0.9)',
          color: '#fff',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.12)'
        },
        success: {
          iconTheme: { primary: '#14B8A6', secondary: '#fff' }
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#fff' }
        }
      }}
    />
  );
}

























