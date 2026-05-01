import { useState, useEffect } from 'react';

type ConnectionSpeed = 'slow' | 'medium' | 'fast' | 'unknown';

interface ConnectionInfo {
  speed: ConnectionSpeed;
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
}

interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  saveData?: boolean;
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export function useConnectionSpeed(): ConnectionInfo {
  const [connectionInfo, setConnectionInfo] = useState<ConnectionInfo>({
    speed: 'unknown',
  });

  useEffect(() => {
    // Check if Network Information API is available
    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!connection) {
      // Fallback: assume medium speed if API not available
      setConnectionInfo({ speed: 'medium' });
      return;
    }

    const updateConnectionInfo = () => {
      const effectiveType = connection.effectiveType;
      const downlink = connection.downlink;
      const saveData = connection.saveData;

      let speed: ConnectionSpeed = 'medium';

      // Determine speed based on effective type
      if (saveData) {
        speed = 'slow'; // User has data saver enabled
      } else if (effectiveType === 'slow-2g' || effectiveType === '2g') {
        speed = 'slow';
      } else if (effectiveType === '3g') {
        speed = 'medium';
      } else if (effectiveType === '4g' && downlink && downlink < 5) {
        speed = 'medium';
      } else if (effectiveType === '4g' || effectiveType === '5g') {
        speed = 'fast';
      }

      setConnectionInfo({
        speed,
        effectiveType,
        downlink,
        saveData,
      });
    };

    updateConnectionInfo();

    // Listen for connection changes
    connection.addEventListener('change', updateConnectionInfo);

    return () => {
      connection.removeEventListener('change', updateConnectionInfo);
    };
  }, []);

  return connectionInfo;
}

// Helper function to determine if videos should be loaded
export function shouldLoadVideos(connectionInfo: ConnectionInfo): boolean {
  // Don't load videos on slow connections or when data saver is enabled
  if (connectionInfo.speed === 'slow' || connectionInfo.saveData) {
    return false;
  }
  return true;
}

// Helper function to get video quality based on connection
export function getVideoQuality(connectionInfo: ConnectionInfo): 'low' | 'medium' | 'high' {
  if (connectionInfo.speed === 'slow' || connectionInfo.saveData) {
    return 'low';
  } else if (connectionInfo.speed === 'medium') {
    return 'medium';
  }
  return 'high';
}
