import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { resetPassword, validateResetPasswordToken } from "../services/authService";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [token] = useState(() => new URLSearchParams(window.location.search).get("token")?.trim() ?? "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tokenError, setTokenError] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.body.classList.add("admin-private-page");
    return () => {
      document.body.classList.remove("admin-private-page");
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const runValidation = async () => {
      if (!token) {
        if (isMounted) {
          setTokenError("El enlace no es valido o esta incompleto.");
          setValidatingToken(false);
        }
        return;
      }

      try {
        const response = await validateResetPasswordToken(token);
        if (!isMounted) {
          return;
        }
        setEmail(response.email);
      } catch (caughtError) {
        if (!isMounted) {
          return;
        }
        setTokenError(
          caughtError instanceof Error
            ? caughtError.message
            : "El enlace ya no es valido o ha expirado."
        );
      } finally {
        if (isMounted) {
          setValidatingToken(false);
        }
      }
    };

    runValidation();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    if (!token) {
      setFormError("El enlace no es valido o esta incompleto.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setFormError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await resetPassword({ token, password });
      setSuccess(response.message);
      setTimeout(() => navigate("/login"), 1200);
    } catch (caughtError) {
      setFormError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo restablecer la contraseña."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const formDisabled = validatingToken || Boolean(tokenError) || submitting;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#07080d]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#a83d8e]/25 blur-3xl" />
        <div className="absolute -right-20 bottom-14 h-72 w-72 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f7fd8]/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-14">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
          <Link
            to="/login"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#d4af37] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            VOLVER AL LOGIN
          </Link>

          <div className="mb-7 flex items-center gap-3">
            <img src="/images/logo.png" alt="Dubai logo" className="h-14 w-auto" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#d4af37]">Seguridad</p>
              <h1 className="text-2xl font-semibold text-white">Cambia tu contraseña</h1>
            </div>
          </div>

          {validatingToken ? (
            <p className="text-sm leading-relaxed text-gray-300">Validando enlace seguro...</p>
          ) : tokenError ? (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-red-300">{tokenError}</p>
              <Link
                to="/olvide-mi-contrasena"
                className="inline-flex rounded-xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Solicitar un nuevo enlace
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-7 text-sm leading-relaxed text-gray-300">
                Define una nueva contraseña para <span className="text-white">{email}</span>. El
                enlace es valido por 2 horas.
              </p>

              <form onSubmit={onSubmit} className="space-y-4">
                <label
                  htmlFor="reset-password"
                  className="group flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-4 py-3 transition focus-within:border-[#a83d8e]"
                >
                  <Lock className="h-4 w-4 text-gray-300" />
                  <input
                    id="reset-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                    placeholder="Nueva contraseña"
                    required
                    minLength={8}
                    disabled={formDisabled}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="text-gray-300 transition hover:text-white"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    disabled={formDisabled}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </label>

                <label
                  htmlFor="reset-confirm-password"
                  className="group flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-4 py-3 transition focus-within:border-[#1f7fd8]"
                >
                  <Lock className="h-4 w-4 text-gray-300" />
                  <input
                    id="reset-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                    placeholder="Confirmar nueva contraseña"
                    required
                    minLength={8}
                    disabled={formDisabled}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="text-gray-300 transition hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmación de contraseña"
                        : "Mostrar confirmación de contraseña"
                    }
                    disabled={formDisabled}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </label>

                {formError ? <p className="text-sm text-red-300">{formError}</p> : null}
                {success ? <p className="text-sm text-emerald-300">{success}</p> : null}

                <button
                  type="submit"
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#a83d8e] via-[#9f58c9] to-[#1f7fd8] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
                  disabled={formDisabled}
                >
                  {submitting ? "Actualizando..." : "Guardar nueva contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
