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

    let script = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);

    const handleLoad = () => {
      if (window.google?.accounts?.id) {
        setIsReady(true);
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.src = GOOGLE_SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    script.addEventListener("load", handleLoad);

    return () => {
      script.removeEventListener("load", handleLoad);
    };
  }, [clientId]);

  return {
    clientId,
    isReady,
    isSupported: Boolean(clientId),
  };
};