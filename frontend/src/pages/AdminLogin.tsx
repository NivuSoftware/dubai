import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Seo from "../components/Seo";
import { ADMIN_TOKEN_KEY, login } from "../services/authService";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    document.body.classList.add("admin-private-page");
    return () => {
      document.body.classList.remove("admin-private-page");
    };
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await login({ email, password });
      localStorage.setItem(ADMIN_TOKEN_KEY, data.access_token);
      if (data.user.role === "admin") {
        navigate("/admin/panel");
      } else if (data.user.role === "advertiser") {
        navigate("/advertiser/panel");
      } else {
        setError("Rol de usuario no válido.");
      }
    } catch {
      setError("Credenciales inválidas. Verifica email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#07080d]">
      <Seo title="Iniciar sesión" path="/login" robots="noindex, nofollow" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#a83d8e]/25 blur-3xl" />
        <div className="absolute -right-20 bottom-14 h-72 w-72 rounded-full bg-[#d4af37]/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1f7fd8]/15 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-14">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/5 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-10">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-[#d4af37] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            VOLVER
          </Link>

          <div className="mb-7 flex items-center gap-3">
            <img src="/images/logo.png" alt="Dubai logo" className="h-14 w-auto" />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#d4af37]">Acceso</p>
              <h1 className="text-2xl font-semibold text-white">Iniciar sesión</h1>
            </div>
          </div>

          <p className="mb-7 text-sm leading-relaxed text-gray-300">
            Ingresa tus credenciales para continuar.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <label
              htmlFor="email"
              className="group flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-4 py-3 transition focus-within:border-[#1f7fd8]"
            >
              <Mail className="h-4 w-4 text-gray-300" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                placeholder="Correo electrónico"
                required
              />
            </label>

            <label
              htmlFor="password"
              className="group flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-4 py-3 transition focus-within:border-[#a83d8e]"
            >
              <Lock className="h-4 w-4 text-gray-300" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
                placeholder="Contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-gray-300 transition hover:text-white"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </label>

            <div className="flex justify-end">
              <Link
                to="/olvide-mi-contrasena"
                className="text-xs font-medium text-[#93c5fd] transition hover:text-white"
              >
                Olvidé mi contraseña
              </Link>
            </div>

            {error ? <p className="text-sm text-red-300">{error}</p> : null}

            <button
              type="submit"
              className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#a83d8e] via-[#9f58c9] to-[#1f7fd8] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Validando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
