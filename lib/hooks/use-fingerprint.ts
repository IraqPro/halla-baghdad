"use client";

import { useState, useEffect } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

interface DeviceInfo {
  fingerprint: string;
  screenResolution: string;
  timezone: string;
  language: string;
}

export function useFingerprint() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        // Load FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();

        // Get additional device info
        const screenResolution = `${window.screen.width}x${window.screen.height}`;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const language = navigator.language;

        setDeviceInfo({
          fingerprint: result.visitorId,
          screenResolution,
          timezone,
          language,
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
