import { useEffect, useState } from "react";
import { RouterProvider } from "react-router";
import { useTranslation } from "react-i18next";
import TranslationManager from "./components/TranslationManager";
import { isPrerendering } from "./lib/prerender";
import { router } from "./routes";

const AGE_GATE_KEY = "dubai_age_gate_status";

type AgeGateStatus = "unknown" | "accepted" | "rejected";

function App() {
  const { t } = useTranslation();
  const [ageGateStatus, setAgeGateStatus] = useState<AgeGateStatus>(() =>
    isPrerendering() ? "accepted" : "unknown"
  );
  const pathname = window.location.pathname;
  const skipAgeGate =
    /^\/admin(\/|$)/.test(pathname) ||
    pathname === "/login" ||
    pathname === "/registro-anunciante" ||
    pathname === "/olvide-mi-contrasena" ||
    pathname === "/restablecer-contrasena";

  useEffect(() => {
    const stored = localStorage.getItem(AGE_GATE_KEY);
    if (stored === "accepted" || stored === "rejected") {
      setAgeGateStatus(stored);
    }
  }, []);

  const acceptAgeGate = () => {
    localStorage.setItem(AGE_GATE_KEY, "accepted");
    setAgeGateStatus("accepted");
  };

  const rejectAgeGate = () => {
    localStorage.setItem(AGE_GATE_KEY, "rejected");
    setAgeGateStatus("rejected");
  };

  const exitRejectedScreen = () => {
    localStorage.removeItem(AGE_GATE_KEY);
    setAgeGateStatus("unknown");
    window.location.href = "/";
  };

  if (!skipAgeGate && ageGateStatus === "rejected") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <img src="/images/logo.png" alt="Dubai logo" className="mx-auto h-28 w-auto mb-6" />
          <h1 className="text-white text-xl sm:text-2xl">
            {t("ageGate.rejectedTitle")}
          </h1>
          <button
            onClick={exitRejectedScreen}
            className="mt-6 rounded-lg border border-white/30 px-6 py-3 text-white hover:bg-white/10 transition"
          >
            {t("ageGate.exit")}
          </button>
        </div>
      </div>
    );
  }

  const showAgeGateModal = !skipAgeGate && ageGateStatus === "unknown";

  return (
    <div className="relative min-h-screen">
      <TranslationManager />

      <div className={showAgeGateModal ? "pointer-events-none blur-sm select-none" : ""}>
        <RouterProvider router={router} />
      </div>

      {showAgeGateModal ? (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0d1320] p-6 sm:p-8">
            <div className="mb-5 text-center">
              <img
                src="/images/logo.png"
                alt="Dubai logo"
                className="mx-auto h-24 sm:h-32 w-auto"
              />
              <p className="mt-3 text-sm sm:text-base text-gray-300">
                {t("ageGate.brandSubtitle")}
              </p>
            </div>
            <h1 className="text-white text-2xl sm:text-3xl mb-4">
              {t("ageGate.modalTitle")}
            </h1>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base mb-6">
              {t("ageGate.modalDescription")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={acceptAgeGate}
                className="rounded-lg bg-[#a83d8e] hover:bg-[#922f79] text-white px-4 py-3 font-medium transition"
              >
                {t("ageGate.accept")}
              </button>
              <button
                onClick={rejectAgeGate}
                className="rounded-lg border border-red-400/70 text-red-300 hover:bg-red-400/10 px-4 py-3 font-medium transition"
              >
                {t("ageGate.reject")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default App;
