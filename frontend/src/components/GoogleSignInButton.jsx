import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../services/authService";

const GOOGLE_SCRIPT_ID = "google-identity-services";

function GoogleSignInButton() {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const renderGoogleButton = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setError("Google sign-in needs VITE_GOOGLE_CLIENT_ID in frontend/.env.");
        return;
      }
      if (!window.google?.accounts?.id || !buttonRef.current || cancelled) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          if (!response?.credential) {
            setError("Google did not return a sign-in credential. Please try again.");
            return;
          }

          setError("");
          setLoading(true);
          try {
            const data = await googleLogin(response.credential);
            localStorage.setItem("devcareer_token", data.token);
            localStorage.setItem("devcareer_user", JSON.stringify(data.user));
            navigate("/", { replace: true });
          } catch (requestError) {
            setError(requestError.message || "Google sign-in failed.");
          } finally {
            setLoading(false);
          }
        },
      });

      buttonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: Math.min(360, buttonRef.current.clientWidth || 360),
        logo_alignment: "left",
      });
    };

    let script = document.getElementById(GOOGLE_SCRIPT_ID);
    if (!script) {
      script = document.createElement("script");
      script.id = GOOGLE_SCRIPT_ID;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = renderGoogleButton;
      script.onerror = () => setError("Could not load Google sign-in. Check your internet connection.");
      document.head.appendChild(script);
    } else if (window.google?.accounts?.id) {
      renderGoogleButton();
    } else {
      script.addEventListener("load", renderGoogleButton, { once: true });
    }

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="google-signin-area">
      <div ref={buttonRef} className="google-signin-button" />
      {loading && <p className="google-signin-status">Signing in with Google...</p>}
      {error && <p className="google-signin-error" role="alert">{error}</p>}
    </div>
  );
}

export default GoogleSignInButton;
