import { useEffect, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

const getGoogleClientId = () => import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const useGoogleIdentity = () => {
  const [isReady, setIsReady] = useState(false);
  const clientId = getGoogleClientId();

  useEffect(() => {
    if (!clientId) {
      setIsReady(false);
      return;
    }

    if (window.google?.accounts?.id) {
      setIsReady(true);
      return;
    }

    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);

    if (existingScript) {
      const handleLoad = () => setIsReady(true);
      existingScript.addEventListener("load", handleLoad);
      return () => existingScript.removeEventListener("load", handleLoad);
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsReady(true);
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [clientId]);

  return {
    clientId,
    isReady,
    isSupported: Boolean(clientId),
  };
};
