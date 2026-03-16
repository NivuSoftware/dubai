import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { BadgeCheck, CheckCircle2, Clock3, LogOut, Pencil, Plus, Trash2, X, XCircle } from "lucide-react";
import {
  ADMIN_TOKEN_KEY,
  fetchAdvertiserMe,
  requestAdvertiserVerification,
} from "../services/authService";
import {
  Anuncio,
  createAdvertiserAnuncioDraft,
  deleteAdvertiserAnuncio,
  deleteAdvertiserAnuncioImage,
  finalizeAdvertiserAnuncio,
  listAdvertiserAnuncios,
  reactivateAdvertiserAnuncio,
  updateAdvertiserAnuncio,
  uploadAdvertiserAnuncioImages,
} from "../services/anunciosService";

interface AdvertiserState {
  email: string;
  role: string;
  is_verified: boolean;
  is_verification_requested: boolean;
  is_verification_rejected: boolean;
  created_at: string;
}

interface VerificationFormState {
  full_name: string;
  document_number: string;
  birth_date: string;
  document_image: File | null;
  portrait_image: File | null;
}

type AnuncioPlan = "executive" | "nena" | "dama" | "princesa";

interface PaymentStepState {
  plan: AnuncioPlan;
  payment_receipt_image: File | null;
}

type PaymentFlowMode = "create" | "reactivate";

interface AnuncioFormState {
  titulo: string;
  descripcion: string;
  precio: number;
  ubicacion: string;
  contact_country_code: string;
  contact_number: string;
}

const MAX_IMAGES_PER_ANUNCIO = 5;
const DRAFT_STORAGE_PREFIX = "advertiser_anuncio_draft_form";

function normalizePhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.replace(/^0+/, "");
}

function isAdult(birthDate: string): boolean {
  const dob = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }

  return age >= 18;
}

function planLabel(plan: AnuncioPlan): string {
  if (plan === "executive") return "Plan Ejecutivo (Diario) $20";
  if (plan === "nena") return "Plan Nena (Semanal) $120";
  if (plan === "dama") return "Plan Dama (Mensual) $560";
  return "Plan Princesa (Trimestral) $1740";
}

function planLabelFromValue(plan: string): string {
  if (plan === "executive" || plan === "nena" || plan === "dama" || plan === "princesa") {
    return planLabel(plan);
  }
  if (plan === "monthly") return "Mensual (legado)";
  if (plan === "quarterly") return "Trimestral (legado)";
  if (plan === "semiannual") return "Semestral (legado)";
  return plan;
}

function normalizeSelectablePlan(plan: string): AnuncioPlan {
  if (plan === "executive" || plan === "nena" || plan === "dama" || plan === "princesa") {
    return plan;
  }
  return "executive";
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es-EC", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function statusLabel(value: string): string {
  const normalized = value?.toUpperCase();
  if (normalized === "PENDING" || normalized === "PENDIENTE") return "Pendiente";
  if (normalized === "APPROVED" || normalized === "ACTIVO") return "Activo";
  if (normalized === "REJECTED" || normalized === "INACTIVO") return "Inactivo";
  if (normalized === "PAGADO") return "Pagado";
  return value;
}

function pagoTextClass(value: string): string {
  const normalized = value?.toUpperCase();
  if (normalized === "PAGADO" || normalized === "APPROVED") return "text-emerald-300";
  return "text-yellow-300";
}

function estadoTextClass(value: string): string {
  const normalized = value?.toUpperCase();
  if (normalized === "ACTIVO" || normalized === "APPROVED") return "text-emerald-300";
  return "text-[#93c5fd]";
}

function canReactivateAnuncio(anuncio: Anuncio): boolean {
  return (
    !anuncio.is_draft &&
    anuncio.estado?.toUpperCase() === "INACTIVO" &&
    anuncio.pago?.toUpperCase() === "PENDIENTE"
  );
}

function getDraftStorageKey(anuncioId: number): string {
  return `${DRAFT_STORAGE_PREFIX}_${anuncioId}`;
}

export default function AdvertiserPanel() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem(ADMIN_TOKEN_KEY), []);

  const [data, setData] = useState<AdvertiserState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAnuncioModal, setShowAnuncioModal] = useState(false);
  const [anuncioSaving, setAnuncioSaving] = useState(false);
  const [anuncioEditing, setAnuncioEditing] = useState<Anuncio | null>(null);
  const [anuncioFiles, setAnuncioFiles] = useState<File[]>([]);
  const [anuncioPreviewUrls, setAnuncioPreviewUrls] = useState<string[]>([]);
  const [paymentStep, setPaymentStep] = useState<PaymentStepState>({
    plan: "executive",
    payment_receipt_image: null,
  });
  const [paymentFlowMode, setPaymentFlowMode] = useState<PaymentFlowMode>("create");
  const [anuncioToReactivate, setAnuncioToReactivate] = useState<Anuncio | null>(null);
  const [anuncioForm, setAnuncioForm] = useState<AnuncioFormState>({
    titulo: "",
    descripcion: "",
    precio: 0,
    ubicacion: "",
    contact_country_code: "+593",
    contact_number: "",
  });

  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [requestingVerification, setRequestingVerification] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [verificationForm, setVerificationForm] = useState<VerificationFormState>({
    full_name: "",
    document_number: "",
    birth_date: "",
    document_image: null,
    portrait_image: null,
  });
  const [showAnuncioCreatedModal, setShowAnuncioCreatedModal] = useState(false);

  const persistDraftForm = (anuncioId: number, form: AnuncioFormState) => {
    localStorage.setItem(getDraftStorageKey(anuncioId), JSON.stringify(form));
  };

  const restoreDraftForm = (anuncioId: number): AnuncioFormState | null => {
    const raw = localStorage.getItem(getDraftStorageKey(anuncioId));
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AnuncioFormState;
    } catch {
      return null;
    }
  };

  const clearDraftForm = (anuncioId: number) => {
    localStorage.removeItem(getDraftStorageKey(anuncioId));
  };

  useEffect(() => {
    const urls = anuncioFiles.map((file) => URL.createObjectURL(file));
    setAnuncioPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [anuncioFiles]);

  useEffect(() => {
    document.body.classList.add("admin-private-page");

    const load = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const result = await fetchAdvertiserMe(token);
        setData(result.user);
        setShowVerificationModal(!result.user.is_verified);

        const anunciosData = await listAdvertiserAnuncios(token);
        setAnuncios(anunciosData);
      } catch {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setError("Sesión inválida o expirada. Inicia sesión nuevamente.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      document.body.classList.remove("admin-private-page");
    };
  }, [navigate, token]);

  const logout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    navigate("/login");
  };

  const loadAnuncios = async () => {
    if (!token) return;
    const anunciosData = await listAdvertiserAnuncios(token);
    setAnuncios(anunciosData);
    if (anuncioEditing) {
      const refreshed = anunciosData.find((item) => item.id === anuncioEditing.id) ?? null;
      setAnuncioEditing(refreshed);
    }
  };

  const handleRequestVerification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !data || data.is_verified || data.is_verification_requested) return;
    setVerificationError("");

    if (
      !verificationForm.full_name.trim() ||
      !verificationForm.document_number.trim() ||
      !verificationForm.birth_date ||
      !verificationForm.document_image ||
      !verificationForm.portrait_image
    ) {
      setVerificationError("Completa todos los campos y sube las dos fotos requeridas.");
      return;
    }

    if (!isAdult(verificationForm.birth_date)) {
      setVerificationError("TIENES QUE SER MAYOR DE EDAD");
      return;
    }

    setRequestingVerification(true);
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("full_name", verificationForm.full_name.trim());
      payload.append("document_number", verificationForm.document_number.trim());
      payload.append("birth_date", verificationForm.birth_date);
      payload.append("document_image", verificationForm.document_image);
      payload.append("portrait_image", verificationForm.portrait_image);

      const response = await requestAdvertiserVerification(token, payload);
      setData((prev) =>
        prev
          ? {
              ...prev,
              is_verification_requested: response.is_verification_requested,
              is_verification_rejected: false,
            }
          : prev
      );
      setSuccess(response.message);
      setShowVerificationModal(false);
    } catch {
      setVerificationError("No se pudo enviar la solicitud de verificación.");
    } finally {
      setRequestingVerification(false);
    }
  };

  const resetAnuncioFlow = () => {
    setPaymentStep({ plan: "executive", payment_receipt_image: null });
    setPaymentFlowMode("create");
    setAnuncioToReactivate(null);
    setAnuncioForm({
      titulo: "",
      descripcion: "",
      precio: 0,
      ubicacion: "",
      contact_country_code: "+593",
      contact_number: "",
    });
    setAnuncioFiles([]);
    setShowPaymentModal(false);
    setShowAnuncioModal(false);
    setAnuncioEditing(null);
    setAnuncioSaving(false);
  };

  const closeAnuncioModal = () => {
    if (anuncioEditing?.is_draft) {
      persistDraftForm(anuncioEditing.id, anuncioForm);
      setSuccess("Borrador guardado. Puedes continuarlo después.");
    }

    setShowAnuncioModal(false);
    setAnuncioFiles([]);
    setAnuncioEditing(null);
    setAnuncioSaving(false);
    setAnuncioForm({
      titulo: "",
      descripcion: "",
      precio: 0,
      ubicacion: "",
      contact_country_code: "+593",
      contact_number: "",
    });
  };

  const openCreateAnuncio = () => {
    if (!data?.is_verified) {
      setError("Solo los anunciantes verificados pueden crear anuncios.");
      return;
    }
    setError("");
    setSuccess("");
    setPaymentFlowMode("create");
    setAnuncioToReactivate(null);
    setPaymentStep({ plan: "executive", payment_receipt_image: null });
    setAnuncioForm({
      titulo: "",
      descripcion: "",
      precio: 0,
      ubicacion: "",
      contact_country_code: "+593",
      contact_number: "",
    });
    setAnuncioFiles([]);
    setAnuncioEditing(null);
    setShowPaymentModal(true);
  };

  const openReactivateAnuncio = (anuncio: Anuncio) => {
    if (!data?.is_verified) {
      setError("Solo los anunciantes verificados pueden activar anuncios.");
      return;
    }
    setError("");
    setSuccess("");
    setPaymentFlowMode("reactivate");
    setAnuncioToReactivate(anuncio);
    setPaymentStep({
      plan: normalizeSelectablePlan(anuncio.plan),
      payment_receipt_image: null,
    });
    setShowPaymentModal(true);
  };

  const openEditAnuncio = (anuncio: Anuncio) => {
    const restoredDraft = anuncio.is_draft ? restoreDraftForm(anuncio.id) : null;
    setAnuncioEditing(anuncio);
    setAnuncioForm(
      restoredDraft ?? {
        titulo: anuncio.titulo,
        descripcion: anuncio.descripcion,
        precio: Number(anuncio.precio),
        ubicacion: anuncio.ubicacion,
        contact_country_code: anuncio.contact_country_code || "+593",
        contact_number: anuncio.contact_number || "",
      }
    );
    setAnuncioFiles([]);
    setError("");
    setSuccess("");
    setShowAnuncioModal(true);
  };

  const handlePaymentStepSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;
    if (!paymentStep.payment_receipt_image) {
      setError("Debes cargar la foto de la transferencia.");
      return;
    }

    if (paymentFlowMode === "reactivate") {
      if (!anuncioToReactivate) {
        setError("No se encontró el anuncio a activar.");
        return;
      }

      setAnuncioSaving(true);
      setError("");
      try {
        await reactivateAdvertiserAnuncio(token, anuncioToReactivate.id, {
          plan: paymentStep.plan,
          payment_receipt_image: paymentStep.payment_receipt_image,
        });
        await loadAnuncios();
        setShowPaymentModal(false);
        setPaymentFlowMode("create");
        setAnuncioToReactivate(null);
        setPaymentStep({ plan: "executive", payment_receipt_image: null });
        setSuccess("Solicitud enviada. Tu anuncio quedó en pendiente para aprobación.");
      } catch {
        setError("No se pudo activar el anuncio.");
      } finally {
        setAnuncioSaving(false);
      }
      return;
    }

    setError("");
    setAnuncioSaving(true);
    try {
      const draft = await createAdvertiserAnuncioDraft(token, {
        plan: paymentStep.plan,
        payment_receipt_image: paymentStep.payment_receipt_image,
      });
      persistDraftForm(draft.id, anuncioForm);
      await loadAnuncios();
      setAnuncioEditing(draft);
      setShowPaymentModal(false);
      setShowAnuncioModal(true);
    } catch {
      setError("No se pudo guardar el borrador del anuncio.");
    } finally {
      setAnuncioSaving(false);
    }
  };

  const handleAnuncioFilesChange = (files: File[]) => {
    const existingCount = anuncioEditing?.images?.length ?? 0;
    const maxAllowed = MAX_IMAGES_PER_ANUNCIO - existingCount;

    if (maxAllowed <= 0) {
      setError(`Este anuncio ya tiene el máximo de ${MAX_IMAGES_PER_ANUNCIO} imágenes.`);
      setAnuncioFiles([]);
      return;
    }

    if (files.length > maxAllowed) {
      setError(`Solo puedes seleccionar ${maxAllowed} imagen(es) más para este anuncio.`);
      setAnuncioFiles(files.slice(0, maxAllowed));
      return;
    }

    setError("");
    setAnuncioFiles(files);
  };

  const handleSubmitAnuncio = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setAnuncioSaving(true);
    setError("");
    setSuccess("");

    try {
      if (anuncioEditing) {
        await updateAdvertiserAnuncio(token, anuncioEditing.id, {
          titulo: anuncioForm.titulo,
          descripcion: anuncioForm.descripcion,
          precio: Number(anuncioForm.precio),
          ubicacion: anuncioForm.ubicacion,
          contact_country_code: anuncioForm.contact_country_code,
          contact_number: anuncioForm.contact_number,
        });

        if (anuncioFiles.length > 0) {
          await uploadAdvertiserAnuncioImages(token, anuncioEditing.id, anuncioFiles);
        }

        if (anuncioEditing.is_draft) {
          await finalizeAdvertiserAnuncio(token, anuncioEditing.id);
          clearDraftForm(anuncioEditing.id);
        }

        await loadAnuncios();
        setShowAnuncioModal(false);
        setAnuncioFiles([]);
        setAnuncioEditing(null);
        setSuccess(
          anuncioEditing.is_draft
            ? "Anuncio enviado correctamente a revisión."
            : "Anuncio actualizado correctamente"
        );
        if (anuncioEditing.is_draft) {
          setShowAnuncioCreatedModal(true);
        }
      }
    } catch {
      setError("No se pudo guardar el anuncio.");
    } finally {
      setAnuncioSaving(false);
    }
  };

  const handleDeleteAnuncio = async (anuncioId: number) => {
    if (!token) return;
    const confirmed = window.confirm("¿Seguro que deseas eliminar este anuncio?");
    if (!confirmed) return;

    setError("");
    setSuccess("");
    try {
      await deleteAdvertiserAnuncio(token, anuncioId);
      clearDraftForm(anuncioId);
      await loadAnuncios();
      if (anuncioEditing?.id === anuncioId) {
        setAnuncioEditing(null);
      }
      setSuccess("Anuncio eliminado correctamente");
    } catch {
      setError("No se pudo eliminar el anuncio.");
    }
  };

  useEffect(() => {
    if (!anuncioEditing?.is_draft || !showAnuncioModal) return;
    persistDraftForm(anuncioEditing.id, anuncioForm);
  }, [anuncioEditing, anuncioForm, showAnuncioModal]);

  const handleDeleteAnuncioImage = async (imageId: number) => {
    if (!token || !anuncioEditing) return;
    try {
      await deleteAdvertiserAnuncioImage(token, anuncioEditing.id, imageId);
      await loadAnuncios();
      setSuccess("Imagen del anuncio eliminada correctamente");
      setError("");
    } catch {
      setError("No se pudo eliminar la imagen del anuncio.");
    }
  };

  return (
    <section className="min-h-screen bg-[#06090f]">
      <header className="sticky top-0 z-50 border-b border-[#1f7fd8]/30 bg-[#090d16]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#a83d8e] to-[#1f7fd8] text-white">
              <BadgeCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#d4af37]">Private Area</p>
              <h1 className="text-lg font-semibold text-white">Panel de Anunciante</h1>
            </div>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37] px-4 py-2.5 text-sm text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
          >
            <LogOut className="h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-4">
            <p className="inline-flex items-center gap-2 text-sm text-gray-400">
              <span>Usuario: {data?.email}</span>
              {data?.is_verified ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/15 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                  <BadgeCheck className="h-4 w-4 text-emerald-300" />
                  Verificado
                </span>
              ) : data?.is_verification_requested ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/60 bg-[#d4af37]/15 px-3 py-1.5 text-sm font-semibold text-[#f7d97b]">
                  <Clock3 className="h-4 w-4" />
                  En revisión
                </span>
              ) : data?.is_verification_rejected ? (
                <span className="inline-flex items-center gap-2 rounded-full border border-red-400/60 bg-red-400/15 px-3 py-1.5 text-sm font-semibold text-red-300">
                  <XCircle className="h-4 w-4" />
                  Rechazado
                </span>
              ) : null}
            </p>
          </div>

          {loading ? <p className="mb-4 text-gray-300">Cargando datos...</p> : null}
          {error ? <p className="mb-3 text-red-400">{error}</p> : null}
          {success ? <p className="mb-3 text-emerald-400">{success}</p> : null}

          <div className="rounded-2xl border border-[#1f7fd8]/30 bg-[#121a2a] p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg text-white">Mis anuncios</h3>
              <button
                onClick={openCreateAnuncio}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1f7fd8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a6ab4]"
              >
                <Plus className="h-4 w-4" />
                Crear anuncio
              </button>
            </div>

            {anuncios.length === 0 ? (
              <p className="text-sm text-gray-400">Aún no has creado solicitudes de anuncio.</p>
            ) : null}

            <div className="space-y-3 md:hidden">
              {anuncios.map((anuncio) => (
                <article
                  key={anuncio.id}
                  className="rounded-xl border border-white/10 bg-[#0d1320] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {anuncio.titulo?.trim() || "Anuncio en proceso"}
                      </h4>
                      <p className="text-xs text-gray-400">{planLabelFromValue(anuncio.plan)}</p>
                      <p className="text-xs text-gray-400">Hasta: {formatDateTime(anuncio.fecha_hasta)}</p>
                    </div>
                    <span className={`rounded-full border border-[#1f7fd8]/40 px-2 py-1 text-[11px] ${estadoTextClass(anuncio.estado)}`}>
                      {statusLabel(anuncio.estado)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <p className="text-gray-400">
                      Pago: <span className={pagoTextClass(anuncio.pago)}>{statusLabel(anuncio.pago)}</span>
                    </p>
                    <p className="text-gray-400">
                      Precio: <span className="text-[#d4af37]">${Number(anuncio.precio).toFixed(2)}</span>
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {anuncio.is_draft ? (
                      <button
                        onClick={() => openEditAnuncio(anuncio)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d4af37]/60 px-3 py-2 text-xs text-[#f7d97b]"
                      >
                        Continuar
                      </button>
                    ) : canReactivateAnuncio(anuncio) ? (
                      <button
                        onClick={() => openReactivateAnuncio(anuncio)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-emerald-400/60 px-3 py-2 text-xs text-emerald-300"
                      >
                        Activarlo
                      </button>
                    ) : null}
                    {!anuncio.is_draft ? (
                      <button
                        onClick={() => openEditAnuncio(anuncio)}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-[#1f7fd8]/60 px-3 py-2 text-xs text-[#7eb8f2]"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                      </button>
                    ) : null}
                    <button
                      onClick={() => handleDeleteAnuncio(anuncio.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-md border border-red-400/60 px-3 py-2 text-xs text-red-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto rounded-xl border border-white/10 md:block">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-[#0f1728]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Título</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Plan</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Pago</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Estado</th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">Fecha hasta</th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-gray-400">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#0d1320]">
                  {anuncios.map((anuncio) => (
                    <tr key={anuncio.id}>
                      <td className="px-4 py-3 text-sm text-white">
                        {anuncio.titulo?.trim() || "Anuncio en proceso"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{planLabelFromValue(anuncio.plan)}</td>
                      <td className={`px-4 py-3 text-sm ${pagoTextClass(anuncio.pago)}`}>{statusLabel(anuncio.pago)}</td>
                      <td className={`px-4 py-3 text-sm ${estadoTextClass(anuncio.estado)}`}>{statusLabel(anuncio.estado)}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{formatDateTime(anuncio.fecha_hasta)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {anuncio.is_draft ? (
                            <button
                              onClick={() => openEditAnuncio(anuncio)}
                              className="inline-flex items-center gap-1 rounded-md border border-[#d4af37]/60 px-3 py-1.5 text-xs text-[#f7d97b] transition hover:bg-[#d4af37]/15"
                            >
                              Continuar
                            </button>
                          ) : canReactivateAnuncio(anuncio) ? (
                            <button
                              onClick={() => openReactivateAnuncio(anuncio)}
                              className="inline-flex items-center gap-1 rounded-md border border-emerald-400/60 px-3 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-500/15"
                            >
                              Activarlo
                            </button>
                          ) : null}
                          {!anuncio.is_draft ? (
                            <button
                              onClick={() => openEditAnuncio(anuncio)}
                              className="inline-flex items-center gap-1 rounded-md border border-[#1f7fd8]/60 px-3 py-1.5 text-xs text-[#7eb8f2] transition hover:bg-[#1f7fd8]/15"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Editar
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleDeleteAnuncio(anuncio.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-400/60 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-400/15"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal ? (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#1f7fd8]/40 bg-[#0d1320] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                {paymentFlowMode === "reactivate"
                  ? "Activar anuncio: selecciona plan"
                  : "Seleccione su plan de anuncio"}
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="rounded-md border border-white/20 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePaymentStepSubmit} className="space-y-3">
              <p className="text-sm font-medium text-[#93c5fd]">1. Selecciona tu plan</p>
              <label className="mb-1 block text-xs text-gray-300">Plan de anuncio</label>
              <select
                value={paymentStep.plan}
                onChange={(e) =>
                  setPaymentStep((prev) => ({ ...prev, plan: e.target.value as AnuncioPlan }))
                }
                className="w-full rounded-lg border-2 border-[#1f7fd8]/70 bg-[#16233a] px-4 py-3 text-base font-semibold text-white shadow-[0_0_0_1px_rgba(31,127,216,0.18)] outline-none transition focus:border-[#4ea3ff] focus:bg-[#1a2944] focus:shadow-[0_0_0_4px_rgba(31,127,216,0.18)]"
              >
                <option value="executive">Plan Ejecutivo (Diario) $20</option>
                <option value="nena">Plan Nena (Semanal) $120</option>
                <option value="dama">Plan Dama (Mensual) $560</option>
                <option value="princesa">Plan Princesa (Trimestral) $1740</option>
              </select>

              <p className="pt-1 text-sm font-medium text-[#93c5fd]">
                2. Realiza la transferencia bancaria
              </p>
              <div className="rounded-lg border border-[#1f7fd8]/40 bg-[linear-gradient(180deg,rgba(31,127,216,0.16),rgba(18,26,42,0.96))] p-4 text-sm text-gray-200 shadow-[0_0_24px_rgba(31,127,216,0.12)]">
                <p className="mb-3 font-semibold text-white">Pago por QR</p>
                <img
                  src="/images/qr.jpeg"
                  alt="Código QR para transferencia"
                  className="mx-auto max-h-64 w-auto rounded-lg border border-white/10 object-contain"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-[#a83d8e]/50 bg-[linear-gradient(180deg,rgba(168,61,142,0.2),rgba(18,26,42,0.96))] p-3 text-sm text-gray-200 shadow-[0_0_24px_rgba(168,61,142,0.12)]">
                  <p className="font-semibold text-white">Banco del Guayaquil</p>
                  <p>Tipo: Cuenta de ahorros</p>
                  <p>Cuenta: 21417526</p>
                  <p>Ci: 1719906578</p>
                </div>
                <div className="rounded-lg border border-emerald-500/50 bg-[linear-gradient(180deg,rgba(16,185,129,0.18),rgba(18,26,42,0.96))] p-3 text-sm text-gray-200 shadow-[0_0_24px_rgba(16,185,129,0.12)]">
                  <p className="font-semibold text-white">Banco Produbanco</p>
                  <p>Tipo: Cuenta Ahorros</p>
                  <p>Cuenta: 12008169115</p>
                  <p>Ci: 1719906578</p>
                </div>
              </div>

              <div>
                <p className="mb-2 pt-1 text-sm font-medium text-[#93c5fd]">3. Crea tu anuncio</p>
                <label className="mb-1 block text-xs text-gray-300">Cargue la foto de la transferencia</label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    setPaymentStep((prev) => ({
                      ...prev,
                      payment_receipt_image: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#1f7fd8] file:px-3 file:py-1 file:text-white"
                />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={anuncioSaving}
                  className="rounded-lg bg-[#1f7fd8] px-4 py-2 text-sm text-white transition hover:bg-[#1a6ab4] disabled:opacity-60"
                >
                  {anuncioSaving
                    ? "Enviando..."
                    : paymentFlowMode === "reactivate"
                      ? "Enviar solicitud de activación"
                      : "Enviar y continuar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showAnuncioModal ? (
        <div className="fixed inset-0 z-[86] flex items-start justify-center bg-black/70 px-2 py-2 backdrop-blur-sm sm:items-center sm:px-4 sm:py-8">
          <div className="max-h-[92vh] w-full max-w-sm overflow-y-auto rounded-xl border border-white/20 bg-[#0d1320] p-3 sm:max-w-2xl sm:rounded-2xl sm:p-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg text-white sm:text-xl">
                {anuncioEditing?.is_draft ? "Completa los datos del anuncio" : "Editar anuncio"}
              </h2>
              <button
                onClick={closeAnuncioModal}
                className="rounded-md border border-white/20 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!anuncioEditing ? (
              <p className="mb-3 text-sm text-[#93c5fd]">
                Plan seleccionado: <span className="font-semibold">{planLabel(paymentStep.plan)}</span>
              </p>
            ) : null}

            <form onSubmit={handleSubmitAnuncio} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-300">Titulo</label>
                <input
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Título"
                  value={anuncioForm.titulo}
                  onChange={(e) => setAnuncioForm((prev) => ({ ...prev, titulo: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Descripcion</label>
                <textarea
                  className="min-h-24 w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Descripción"
                  value={anuncioForm.descripcion}
                  onChange={(e) =>
                    setAnuncioForm((prev) => ({ ...prev, descripcion: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Precio</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Precio (USD)"
                  value={anuncioForm.precio}
                  onChange={(e) => setAnuncioForm((prev) => ({ ...prev, precio: Number(e.target.value) }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Ubicacion</label>
                <input
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Ubicación"
                  value={anuncioForm.ubicacion}
                  onChange={(e) => setAnuncioForm((prev) => ({ ...prev, ubicacion: e.target.value }))}
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Código de país</label>
                <input
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="+593"
                  value={anuncioForm.contact_country_code}
                  onChange={(e) =>
                    setAnuncioForm((prev) => ({ ...prev, contact_country_code: e.target.value }))
                  }
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Número de contacto</label>
                <input
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="99567846"
                  value={anuncioForm.contact_number}
                  onChange={(e) =>
                    setAnuncioForm((prev) => ({
                      ...prev,
                      contact_number: normalizePhoneNumber(e.target.value),
                    }))
                  }
                  required
                />
              </div>

              {(anuncioEditing?.images?.length ?? 0) < MAX_IMAGES_PER_ANUNCIO ? (
                <div>
                  <label className="mb-1 block text-xs text-gray-300">Imagenes del anuncio (maximo 5)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#1f7fd8] file:px-3 file:py-1 file:text-white"
                    onChange={(e) => handleAnuncioFilesChange(Array.from(e.target.files ?? []))}
                  />
                </div>
              ) : null}

              {anuncioEditing ? (
                <a
                  href={anuncioEditing.imagen_comprobante_pago_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block text-sm text-[#7eb8f2] underline"
                >
                  Ver comprobante de pago
                </a>
              ) : null}

              {anuncioEditing?.images?.length ? (
                <div className="flex flex-wrap gap-2">
                  {anuncioEditing.images.map((image) => (
                    <div key={image.id} className="relative">
                      <img
                        src={image.url}
                        alt={`Imagen anuncio ${anuncioEditing.titulo}`}
                        className="h-20 w-20 rounded-lg border border-white/10 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteAnuncioImage(image.id)}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                        aria-label="Eliminar imagen"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              {anuncioPreviewUrls.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {anuncioPreviewUrls.map((url, index) => (
                    <div key={`${url}-${index}`} className="relative">
                      <img
                        src={url}
                        alt={`Nueva imagen anuncio ${index + 1}`}
                        className="h-20 w-20 rounded-lg border border-white/10 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setAnuncioFiles((prev) => prev.filter((_, idx) => idx !== index))}
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                        aria-label="Quitar imagen seleccionada"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeAnuncioModal}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={anuncioSaving}
                  className="rounded-lg bg-[#1f7fd8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a6ab4] disabled:opacity-60"
                >
                  {anuncioSaving
                    ? "Guardando..."
                    : anuncioEditing?.is_draft
                      ? "Enviar anuncio"
                      : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showVerificationModal ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[#d4af37]/40 bg-[#0d1320] p-6">
            <h2 className="text-xl font-semibold text-white">Solicita verificación</h2>
            <p className="mt-3 text-sm text-gray-300">
              Completa este formulario para revisar tu identidad y validar tu cuenta de anunciante.
            </p>

            <form onSubmit={handleRequestVerification} className="mt-5 space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-300">Nombre completo</label>
                <input
                  type="text"
                  placeholder="Ingresa tu nombre completo"
                  value={verificationForm.full_name}
                  onChange={(e) => setVerificationForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Número de cédula o pasaporte</label>
                <input
                  type="text"
                  placeholder="Ej: 1723456789 o pasaporte"
                  value={verificationForm.document_number}
                  onChange={(e) =>
                    setVerificationForm((prev) => ({ ...prev, document_number: e.target.value }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={verificationForm.birth_date}
                  onChange={(e) => setVerificationForm((prev) => ({ ...prev, birth_date: e.target.value }))}
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Foto del documento de identidad</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setVerificationForm((prev) => ({
                      ...prev,
                      document_image: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#1f7fd8] file:px-3 file:py-1 file:text-white"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-gray-300">Foto de la persona (tamaño carnet)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setVerificationForm((prev) => ({
                      ...prev,
                      portrait_image: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-2 text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#1f7fd8] file:px-3 file:py-1 file:text-white"
                  required
                />
              </div>

              {verificationError ? <p className="text-sm font-semibold text-red-400">{verificationError}</p> : null}

              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button
                  type="submit"
                  disabled={requestingVerification || Boolean(data?.is_verification_requested)}
                  className="rounded-lg bg-[#1f7fd8] px-4 py-2 text-sm text-white transition hover:bg-[#1a6ab4] disabled:opacity-60"
                >
                  {data?.is_verification_requested
                    ? "Solicitud enviada"
                    : requestingVerification
                      ? "Enviando..."
                      : "Enviar solicitud"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowVerificationModal(false)}
                  className="rounded-lg border border-[#d4af37]/60 px-4 py-2 text-sm text-[#f7d97b] transition hover:bg-[#d4af37]/15"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showAnuncioCreatedModal ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#1f7fd8]/40 bg-[#0d1320] p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckCircle2 className="h-9 w-9 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Anuncio creado</h3>
            <p className="mt-3 text-sm text-gray-300">
              Anuncio creado, tu anuncio se activara dentro de la 24h aprox o antes
            </p>
            <button
              type="button"
              onClick={() => setShowAnuncioCreatedModal(false)}
              className="mt-5 rounded-lg bg-[#1f7fd8] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#1a6ab4]"
            >
              Entendido
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
