"use client";

import { useEffect, useState } from "react";

import type { Debt, DebtType } from "@/app/types/debt";

interface DebtFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  debt?: Debt | null;
}

export default function DebtFormModal({
  isOpen,
  onClose,
  onSuccess,
  debt,
}: DebtFormModalProps) {
  const isEdit = Boolean(debt);

  const [type, setType] = useState<DebtType>("owed_to_me");
  const [counterpartName, setCounterpartName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (debt) {
      setType(debt.type);
      setCounterpartName(debt.counterpart_name);
      setAmount(String(debt.amount));
      setDueDate(debt.due_date ?? "");
      setNote(debt.note ?? "");
    } else {
      setType("owed_to_me");
      setCounterpartName("");
      setAmount("");
      setDueDate(
        new Date().toISOString().split("T")[0],
      );
      setNote("");
    }

    setError("");
  }, [isOpen, debt]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!counterpartName.trim()) {
      setError("Nama orang wajib diisi");
      return;
    }

    if (!amount) {
      setError("Jumlah wajib diisi");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isInteger(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Jumlah harus berupa bilangan bulat lebih dari 0",
      );
      return;
    }

    if (note.length > 200) {
      setError("Catatan maksimal 200 karakter");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        type,
        counterpart_name: counterpartName.trim(),
        amount: numericAmount,
        due_date: dueDate || null,
        note: note?.trim() || null,
      };

      const response = await fetch(
        isEdit
          ? `/api/debts/${debt?.id}`
          : "/api/debts",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Gagal menyimpan data kasbon",
        );
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Save debt error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan data",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Kasbon" : "Catat Baru"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tipe
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    type === "owed_to_me"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="owed_to_me"
                    checked={type === "owed_to_me"}
                    onChange={() =>
                      setType("owed_to_me")
                    }
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Saya dihutang
                  </span>
                </label>

                <label
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${
                    type === "i_owe"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value="i_owe"
                    checked={type === "i_owe"}
                    onChange={() =>
                      setType("i_owe")
                    }
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Saya hutang
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="counterpart_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Nama orang
              </label>

              <input
                id="counterpart_name"
                type="text"
                value={counterpartName}
                onChange={(event) =>
                  setCounterpartName(event.target.value)
                }
                placeholder="Contoh: Wiyan"
                maxLength={100}
                required
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="amount"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Jumlah
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  Rp
                </span>

                <input
                  id="amount"
                  type="number"
                  min="1"
                  step="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  placeholder="0"
                  required
                  className="w-full rounded-lg border border-gray-200 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="due_date"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Tenggat Waktu
              </label>

              <input
                id="due_date"
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(event.target.value)
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="note"
                  className="text-sm font-medium text-gray-700"
                >
                  Catatan
                </label>

                <span className="text-xs text-gray-400">
                  {note.length}/200
                </span>
              </div>

              <textarea
                id="note"
                value={note}
                onChange={(event) =>
                  setNote(event.target.value)
                }
                maxLength={200}
                rows={3}
                placeholder="Tambahkan catatan..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan perubahan"
                  : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}