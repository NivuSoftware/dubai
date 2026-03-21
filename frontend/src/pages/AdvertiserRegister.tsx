import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import Layout from "../components/Layout";
import Seo from "../components/Seo";
import { registerAdvertiser } from "../services/authService";

export default function AdvertiserRegister() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!acceptedTerms) {
      setError("Debes leer y aceptar los términos y condiciones.");
      return;
    }

    setLoading(true);
    try {
      await registerAdvertiser({ email, password });
      setSuccess("Cuenta creada correctamente. Ya puedes iniciar sesión.");
      setTimeout(() => navigate("/login"), 900);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "No se pudo registrar la cuenta. Verifica los datos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Seo title="Registro de anunciante" path="/registro-anunciante" robots="noindex, nofollow" />
      <section className="min-h-screen bg-[#06090f] px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-lg rounded-2xl border border-[#1f7fd8]/30 bg-[#121a2a] p-6 sm:p-8">
          <p className="inline-flex rounded-full border border-[#d4af37]/50 bg-[#d4af37]/10 px-3 py-1 text-xs font-semibold tracking-wide text-[#f7d97b]">
            OPORTUNIDAD EXCLUSIVA
          </p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">
            ¿Deseas publicar tu anuncio?
          </h1>
          <p className="mt-2 text-base text-gray-200">
            Solo regístrate, verifica tu perfil y publica. Empieza hoy y haz crecer tu visibilidad.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-300 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-[#0d1320] px-3 py-2 text-center">1. Regístrate</div>
            <div className="rounded-lg border border-white/10 bg-[#0d1320] px-3 py-2 text-center">2. Verifica</div>
            <div className="rounded-lg border border-white/10 bg-[#0d1320] px-3 py-2 text-center">3. Publica</div>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="register-email" className="mb-1 block text-sm text-gray-300">
                Correo electrónico
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-white/15 bg-[#0d1320] px-3 py-2.5 text-white outline-none focus:border-[#1f7fd8]"
              />
            </div>

            <div>
              <label htmlFor="register-password" className="mb-1 block text-sm text-gray-300">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-white/15 bg-[#0d1320] px-3 py-2.5 pr-11 text-white outline-none focus:border-[#1f7fd8]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition hover:text-white"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="register-confirm-password" className="mb-1 block text-sm text-gray-300">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border border-white/15 bg-[#0d1320] px-3 py-2.5 pr-11 text-white outline-none focus:border-[#1f7fd8]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 transition hover:text-white"
                  aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="register-terms"
                className="flex items-start gap-3 rounded-lg border border-white/10 bg-[#0d1320] px-3 py-3 text-sm text-gray-300"
              >
                <input
                  id="register-terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  required
                  className="mt-0.5 h-4 w-4 rounded border border-white/20 bg-[#06090f] accent-[#1f7fd8]"
                />
                <span>
                  He leido y acepto los{" "}
                  <a
                    href="/archives/TERMINOSYCONDICIONES.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#93c5fd] underline underline-offset-4 hover:text-white"
                  >
                    terminos y condiciones
                  </a>
                </span>
              </label>
            </div>

            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            {success ? <p className="text-sm text-emerald-400">{success}</p> : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1f7fd8] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a6ab4] disabled:opacity-60"
            >
              {loading ? "Creando cuenta..." : "Quiero publicar mi anuncio"}
            </button>
          </form>

          <p className="mt-5 text-sm text-gray-300">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-[#93c5fd] hover:text-white">
              Inicia sesión
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
