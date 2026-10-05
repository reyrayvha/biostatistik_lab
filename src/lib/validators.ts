import { isSupabaseConfigured, supabase } from "@/src/lib/supabaseClient";

export interface ValidationError {
  field: string;
  message: string;
}

const normalizeIdentityText = (value: string) => (value ?? "").trim().replace(/\s+/g, " ").toLowerCase();

export const validateNama = (nama: string): string | undefined => {
  const trimmed = (nama ?? "").trim().replace(/\s+/g, " ");

  if (!trimmed) return "Nama tidak boleh kosong";
  if (trimmed.length < 3) return "Nama harus 3-100 karakter";
  if (trimmed.length > 100) return "Nama harus 3-100 karakter";

  const namePattern = /^[\p{L}\p{M}]+(?:[ .'-]+[\p{L}\p{M}]+)*$/u;
  if (!namePattern.test(trimmed)) {
    return "Nama mengandung karakter tidak valid";
  }

  return undefined;
};

export const validateNim = (nim: string): string | undefined => {
  const trimmed = nim?.trim() ?? "";

  if (!trimmed) return "NIM tidak boleh kosong";
  if (!/^\d{10}$/.test(trimmed)) return "NIM harus 10 digit angka";

  return undefined;
};

export const validateAngkatan = (angkatan: string): string | undefined => {
  const trimmed = angkatan?.trim() ?? "";

  if (!trimmed) return "Angkatan tidak boleh kosong";

  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed)) return "Format angkatan harus YYYY";

  const currentYear = new Date().getFullYear();
  if (parsed < 2000 || parsed > currentYear + 4) {
    return "Angkatan tidak valid";
  }

  return undefined;
};

export const validateIdentity = (
  nama: string,
  nim: string,
  angkatan: string,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const namaError = validateNama(nama);
  if (namaError) errors.push({ field: "nama", message: namaError });

  const nimError = validateNim(nim);
  if (nimError) errors.push({ field: "nim", message: nimError });

  const angkatanError = validateAngkatan(angkatan);
  if (angkatanError) errors.push({ field: "angkatan", message: angkatanError });

  return errors;
};

export const isIdentityFormValid = (
  nama: string,
  nim: string,
  angkatan: string,
): boolean => {
  return validateIdentity(nama, nim, angkatan).length === 0;
};

export const checkDuplicateIdentity = async (
  nama: string,
  nim: string,
  angkatan: string,
  ignoreNim?: string,
): Promise<string | null> => {
  const trimmedNama = (nama ?? "").trim();
  const trimmedNim = (nim ?? "").trim();
  const trimmedAngkatan = (angkatan ?? "").trim();

  if (!trimmedNama || !trimmedNim || !trimmedAngkatan) return null;
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from("students")
    .select("id, name, nim, cohort")
    .eq("nim", trimmedNim)
    .limit(20);

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    const { data: allStudents, error: allError } = await supabase
      .from("students")
      .select("id, name, nim, cohort")
      .limit(200);

    if (allError) {
      throw allError;
    }

    const duplicateExactMatch = allStudents?.some((student) => {
      const matchesName = normalizeIdentityText(student.name) === normalizeIdentityText(trimmedNama);
      const matchesAngkatan = (student.cohort ?? "").trim() === trimmedAngkatan;
      const matchesNim = (student.nim ?? "").trim() === trimmedNim;
      return !student.nim || matchesNim || (matchesName && matchesAngkatan && student.nim !== ignoreNim);
    });

    if (duplicateExactMatch) {
      return "Data diri Anda sudah terdaftar di papan skor. Gunakan identitas yang berbeda.";
    }

    return null;
  }

  const hasSameNimConflict = data.some((student) => (student.nim ?? "").trim() === trimmedNim && (student.nim ?? "").trim() !== (ignoreNim ?? ""));
  if (hasSameNimConflict) {
    return "NIM sudah terdaftar di papan skor. Silakan gunakan data yang sesuai.";
  }

  const hasExactMatch = data.some((student) => {
    const matchesName = normalizeIdentityText(student.name) === normalizeIdentityText(trimmedNama);
    const matchesAngkatan = (student.cohort ?? "").trim() === trimmedAngkatan;
    return matchesName && matchesAngkatan && (student.nim ?? "").trim() !== (ignoreNim ?? "");
  });

  if (hasExactMatch) {
    return "Data diri Anda sudah terdaftar di papan skor. Gunakan identitas yang berbeda.";
  }

  return null;
};
