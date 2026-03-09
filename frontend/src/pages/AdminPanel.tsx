import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { LogOut, Pencil, Plus, ShieldCheck, Trash2, X } from "lucide-react";
import {
  ADMIN_TOKEN_KEY,
  Modelo,
  ModeloPayload,
  createModelo,
  deleteModelo,
  deleteModeloImage,
  fetchAdminMe,
  listModelos,
  updateModelo,
  uploadModeloImages,
} from "../lib/auth";

interface AdminState {
  email: string;
  role: string;
  created_at: string;
}

const MAX_IMAGES_PER_MODELO = 5;

export default function AdminPanel() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem(ADMIN_TOKEN_KEY), []);
  const [data, setData] = useState<AdminState | null>(null);
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedPreviewUrls, setSelectedPreviewUrls] = useState<string[]>([]);
  const [editingModelo, setEditingModelo] = useState<Modelo | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<ModeloPayload>({
    nombre: "",
    edad: 18,
    descripcion: "",
    disponibilidad: "",
    ubicacion: "",
    categoria: "",
    precio: 0,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const urls = selectedFiles.map((file) => URL.createObjectURL(file));
    setSelectedPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  useEffect(() => {
    document.body.classList.add("admin-private-page");

    const load = async () => {
      if (!token) {
        navigate("/admin/login");
        return;
      }

      try {
        const result = await fetchAdminMe(token);
        setData(result.user);
        const modelosData = await listModelos(token);
        setModelos(modelosData);
      } catch {
        localStorage.removeItem(ADMIN_TOKEN_KEY);
        setError("Sesión inválida o expirada. Inicia sesión nuevamente.");
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
    navigate("/admin/login");
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      edad: 18,
      descripcion: "",
      disponibilidad: "",
      ubicacion: "",
      categoria: "",
      precio: 0,
    });
    setSelectedFiles([]);
    setEditingId(null);
    setEditingModelo(null);
  };

  const openCreateModal = () => {
    resetForm();
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSaving(false);
    resetForm();
  };

  const loadModelos = async () => {
    if (!token) return;
    const modelosData = await listModelos(token);
    setModelos(modelosData);
    if (editingId) {
      const refreshed = modelosData.find((item) => item.id === editingId) ?? null;
      setEditingModelo(refreshed);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token) return;

    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const existingCount = editingModelo?.images?.length ?? 0;
      if (existingCount + selectedFiles.length > MAX_IMAGES_PER_MODELO) {
        setError(`Máximo ${MAX_IMAGES_PER_MODELO} imágenes por modelo.`);
        setSaving(false);
        return;
      }

      const payload: ModeloPayload = {
        ...form,
        edad: Number(form.edad),
        precio: Number(form.precio),
      };
      const modelo = editingId
        ? await updateModelo(token, editingId, payload)
        : await createModelo(token, payload);

      if (selectedFiles.length > 0) {
        await uploadModeloImages(token, modelo.id, selectedFiles);
      }

      await loadModelos();
      resetForm();
      setIsModalOpen(false);
      setSuccess(editingId ? "Modelo actualizada correctamente" : "Modelo creada correctamente");
    } catch {
      setError("No se pudo guardar la modelo. Verifica los datos.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (modelo: Modelo) => {
    setEditingId(modelo.id);
    setEditingModelo(modelo);
    setForm({
      nombre: modelo.nombre,
      edad: modelo.edad,
      descripcion: modelo.descripcion,
      disponibilidad: modelo.disponibilidad,
      ubicacion: modelo.ubicacion,
      categoria: modelo.categoria,
      precio: modelo.precio,
    });
    setSelectedFiles([]);
    setSuccess("");
    setError("");
    setIsModalOpen(true);
  };

  const handleFilesChange = (files: File[]) => {
    const existingCount = editingModelo?.images?.length ?? 0;
    const maxAllowed = MAX_IMAGES_PER_MODELO - existingCount;
    if (maxAllowed <= 0) {
      setError(`Esta modelo ya tiene el máximo de ${MAX_IMAGES_PER_MODELO} imágenes.`);
      setSelectedFiles([]);
      return;
    }

    if (files.length > maxAllowed) {
      setError(`Solo puedes seleccionar ${maxAllowed} imagen(es) más para esta modelo.`);
      setSelectedFiles(files.slice(0, maxAllowed));
      return;
    }

    setError("");
    setSelectedFiles(files);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleDeleteExistingImage = async (imageId: number) => {
    if (!token || !editingId) return;
    try {
      await deleteModeloImage(token, editingId, imageId);
      await loadModelos();
      setSuccess("Imagen eliminada correctamente");
      setError("");
    } catch {
      setError("No se pudo eliminar la imagen.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    const confirmed = window.confirm("¿Seguro que deseas eliminar esta modelo?");
    if (!confirmed) return;

    setError("");
    setSuccess("");
    try {
      await deleteModelo(token, id);
      await loadModelos();
      if (editingId === id) {
        resetForm();
      }
      setSuccess("Modelo eliminada correctamente");
    } catch {
      setError("No se pudo eliminar la modelo.");
    }
  };

  return (
    <section className="min-h-screen bg-[#06090f]">
      <header className="sticky top-0 z-50 border-b border-[#1f7fd8]/30 bg-[#090d16]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-24 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#a83d8e] to-[#1f7fd8] text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#d4af37]">Private Area</p>
              <h1 className="text-lg font-semibold text-white">Dubai Admin Panel</h1>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37] px-4 py-2.5 text-sm text-[#d4af37] transition hover:bg-[#d4af37] hover:text-black"
            >
              <LogOut className="h-5 w-5" />
              Cerrar sesión
            </button>
          </nav>
        </div>
      </header>

      <div className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl border border-[#a83d8e]/30 bg-[#121a2a] p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg text-white">Listado de modelos</h3>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1f7fd8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a6ab4]"
              >
                <Plus className="h-4 w-4" />
                Nueva modelo
              </button>
            </div>

            {loading ? <p className="text-gray-300">Cargando datos...</p> : null}
            {error ? <p className="mb-3 text-red-400">{error}</p> : null}
            {success ? <p className="mb-3 text-emerald-400">{success}</p> : null}

            {modelos.length === 0 ? <p className="text-sm text-gray-400">No hay modelos registradas.</p> : null}

            <div className="space-y-4 md:hidden">
              {modelos.map((modelo) => (
                <article
                  key={`mobile-${modelo.id}`}
                  className="rounded-xl border border-white/10 bg-[#0d1320] p-4"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-white">{modelo.nombre}</h4>
                      <p className="text-sm text-gray-300">
                        {modelo.edad} años · {modelo.categoria}
                      </p>
                      <p className="text-sm font-semibold text-[#d4af37]">
                        ${Number(modelo.precio || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-400">{modelo.ubicacion}</p>
                    </div>
                    <span className="rounded-full border border-white/20 px-2 py-1 text-xs text-gray-300">
                      {modelo.images?.length ?? 0} fotos
                    </span>
                  </div>

                  {modelo.images?.length ? (
                    <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
                      {modelo.images.map((image) => (
                        <img
                          key={image.id}
                          src={image.url}
                          alt={modelo.nombre}
                          className="h-28 w-28 shrink-0 rounded-lg border border-white/10 object-cover"
                        />
                      ))}
                    </div>
                  ) : null}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(modelo)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1f7fd8]/70 px-3 py-2.5 text-sm font-medium text-[#7eb8f2]"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(modelo.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-400/70 px-3 py-2.5 text-sm font-medium text-red-300"
                    >
                      <Trash2 className="h-4 w-4" />
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
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Edad
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Categoría
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Ubicación
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Precio
                    </th>
                    <th className="px-4 py-3 text-left text-xs uppercase tracking-wide text-gray-400">
                      Imágenes
                    </th>
                    <th className="px-4 py-3 text-right text-xs uppercase tracking-wide text-gray-400">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-[#0d1320]">
                  {modelos.map((modelo) => (
                    <tr key={modelo.id}>
                      <td className="px-4 py-3 text-sm text-white">{modelo.nombre}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{modelo.edad}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{modelo.categoria}</td>
                      <td className="px-4 py-3 text-sm text-gray-300">{modelo.ubicacion}</td>
                      <td className="px-4 py-3 text-sm font-medium text-[#d4af37]">
                        ${Number(modelo.precio || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-300">{modelo.images?.length ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(modelo)}
                            className="inline-flex items-center gap-1 rounded-md border border-[#1f7fd8]/60 px-3 py-1.5 text-xs text-[#7eb8f2] transition hover:bg-[#1f7fd8]/15"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(modelo.id)}
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

      {isModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-start justify-center bg-black/70 px-2 py-2 sm:items-center sm:px-4 sm:py-8 backdrop-blur-sm">
          <div className="w-full max-w-sm sm:max-w-2xl rounded-xl sm:rounded-2xl border border-white/20 bg-[#0d1320] p-3 sm:p-8 max-h-[92vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl text-white">
                {editingId ? "Editar modelo" : "Crear nueva modelo"}
              </h2>
              <button
                onClick={closeModal}
                className="rounded-md border border-white/20 p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Cerrar modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
              <div className="space-y-1">
                <label htmlFor="modelo-nombre" className="text-xs font-medium text-gray-300">
                  Nombre
                </label>
                <input
                  id="modelo-nombre"
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Nombre"
                  value={form.nombre}
                  onChange={(e) => setForm((prev) => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modelo-edad" className="text-xs font-medium text-gray-300">
                  Edad
                </label>
                <input
                  id="modelo-edad"
                  type="number"
                  min={18}
                  max={99}
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Edad"
                  value={form.edad}
                  onChange={(e) => setForm((prev) => ({ ...prev, edad: Number(e.target.value) }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modelo-descripcion" className="text-xs font-medium text-gray-300">
                  Descripción
                </label>
                <textarea
                  id="modelo-descripcion"
                  className="min-h-20 sm:min-h-24 w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Descripción"
                  value={form.descripcion}
                  onChange={(e) => setForm((prev) => ({ ...prev, descripcion: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modelo-disponibilidad" className="text-xs font-medium text-gray-300">
                  Disponibilidad
                </label>
                <input
                  id="modelo-disponibilidad"
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Disponibilidad"
                  value={form.disponibilidad}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, disponibilidad: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modelo-ubicacion" className="text-xs font-medium text-gray-300">
                  Ubicación
                </label>
                <input
                  id="modelo-ubicacion"
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="Ubicación"
                  value={form.ubicacion}
                  onChange={(e) => setForm((prev) => ({ ...prev, ubicacion: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="modelo-categoria" className="text-xs font-medium text-gray-300">
                  Categoría
                </label>
                <select
                  id="modelo-categoria"
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  value={form.categoria}
                  onChange={(e) => setForm((prev) => ({ ...prev, categoria: e.target.value }))}
                  required
                >
                  <option value="" disabled>
                    Selecciona categoría
                  </option>
                  <option value="Bronce">Bronce</option>
                  <option value="Plata">Plata</option>
                  <option value="Oro">Oro</option>
                  <option value="Platino">Platino</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="modelo-precio" className="text-xs font-medium text-gray-300">
                  Precio (USD)
                </label>
                <input
                  id="modelo-precio"
                  type="number"
                  min={0}
                  step="0.01"
                  className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-white outline-none focus:border-[#1f7fd8]"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={(e) => setForm((prev) => ({ ...prev, precio: Number(e.target.value) }))}
                  required
                />
              </div>

              {(editingModelo?.images?.length ?? 0) < MAX_IMAGES_PER_MODELO ? (
                <div className="space-y-1">
                  <label htmlFor="modelo-images" className="text-xs font-medium text-gray-300">
                    Cargar imágenes
                  </label>
                  <input
                    id="modelo-images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="w-full rounded-lg border border-white/15 bg-[#121a2a] px-3 py-1.5 sm:py-2 text-sm text-gray-300 file:mr-3 file:rounded-md file:border-0 file:bg-[#1f7fd8] file:px-3 file:py-1 file:text-white"
                    onChange={(e) => handleFilesChange(Array.from(e.target.files ?? []))}
                  />
                  <p className="text-xs text-gray-400">
                    Máximo {MAX_IMAGES_PER_MODELO} imágenes por modelo.
                  </p>
                </div>
              ) : (
                <p className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                  Este perfil ya tiene {MAX_IMAGES_PER_MODELO} imágenes. Elimina una para poder
                  subir otra.
                </p>
              )}

              {editingId && editingModelo?.images?.length ? (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
                    Imágenes actuales
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {editingModelo.images.map((image) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt={`Modelo ${editingModelo.nombre}`}
                          className="h-16 w-16 sm:h-24 sm:w-24 rounded-lg border border-white/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteExistingImage(image.id)}
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                          aria-label="Eliminar imagen"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {selectedPreviewUrls.length > 0 ? (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-gray-400">
                    Nuevas imágenes
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedPreviewUrls.map((url, index) => (
                      <div key={`${url}-${index}`} className="relative">
                        <img
                          src={url}
                          alt={`Nueva imagen ${index + 1}`}
                          className="h-16 w-16 sm:h-24 sm:w-24 rounded-lg border border-white/10 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeSelectedFile(index)}
                          className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                          aria-label="Quitar imagen seleccionada"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#1f7fd8] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1a6ab4] disabled:opacity-60"
                >
                  {saving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
