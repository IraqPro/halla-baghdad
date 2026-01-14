"use client";

import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

interface DeviceInfo {
  fingerprint: string;
  deviceSignature: string; // Cross-browser device identifier
  screenResolution: string;
  timezone: string;
  language: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  platform: string;
  colorDepth: number;
}

// Generate a device signature from hardware-level attributes
// These stay consistent across different browsers on the same device
function generateDeviceSignature(): string {
  const components = [
    // Screen properties (same across browsers)
    `${window.screen.width}x${window.screen.height}`,
    `${window.screen.availWidth}x${window.screen.availHeight}`,
    window.screen.colorDepth.toString(),
    window.screen.pixelDepth?.toString() || "0",
    
    // Hardware properties (same across browsers)
    navigator.hardwareConcurrency?.toString() || "0",
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory?.toString() || "0",
    
    // Platform info (same across browsers)
    navigator.platform,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    
    // Device pixel ratio (usually same)
    window.devicePixelRatio?.toString() || "1",
    
    // Max touch points (same across browsers)
    navigator.maxTouchPoints?.toString() || "0",
  ];
  
  // Create a hash-like string from components
  const signature = components.join("|");
  
  // Simple hash function to create a shorter identifier
  let hash = 0;
  for (let i = 0; i < signature.length; i++) {
    const char = signature.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Return both the raw signature and hash for server validation
  return `${Math.abs(hash).toString(36)}-${btoa(signature).slice(0, 32)}`;
}

export function useFingerprint() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        // Load FingerprintJS for browser-specific fingerprint
        const fp = await FingerprintJS.load();
        const result = await fp.get();

        // Get device-level info (consistent across browsers)
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;
        const hardwareConcurrency = navigator.hardwareConcurrency || 0;
        const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 0;
        const platform = navigator.platform;
        const colorDepth = window.screen.colorDepth;
        
        // Generate cross-browser device signature
        const deviceSignature = generateDeviceSignature();

        setDeviceInfo({
          fingerprint: result.visitorId,
          deviceSignature,
          screenResolution,
          timezone,
          language,
          hardwareConcurrency,
          deviceMemory,
          platform,
          colorDepth,
        });
      } catch (err) {
        console.error("Fingerprint error:", err);
        setError("فشل في التعرف على الجهاز");
      } finally {
        setIsLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { deviceInfo, isLoading, error };
}
