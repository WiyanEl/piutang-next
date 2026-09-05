"use client";

import type { Debt } from "@/app/types/debt";

interface DebtItemProps {
  debt: Debt;
  onSettle: (id: string) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export default function DebtItem({
  debt,
  onSettle,
  onEdit,
  onDelete,
}: DebtItemProps) {
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRelativeDate = (date: string) => {
    const createdDate = new Date(date);
    const now = new Date();

    const diffInSeconds =
      Math.floor(
        (now.getTime() - createdDate.getTime()) / 1000,
      );

    const days = Math.floor(
      diffInSeconds / (60 * 60 * 24),
    );

    if (days === 0) {
      const hours = Math.floor(
        diffInSeconds / (60 * 60),
      );

      if (hours === 0) {
        const minutes = Math.floor(
          diffInSeconds / 60,
        );

        if (minutes === 0) {
          return "Baru saja";
        }

        return `${minutes} menit lalu`;
      }

      return `${hours} jam lalu`;
    }

    if (days === 1) {
      return "1 hari lalu";
    }

    return `${days} hari lalu`;
  };

  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-gray-900">
            {debt.counterpart_name}
          </h3>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              debt.type === "owed_to_me"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {debt.type === "owed_to_me"
              ? "Dihutang ke saya"
              : "Saya hutang"}
          </span>

          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              debt.settled_at
                ? "bg-gray-100 text-gray-600"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {debt.settled_at
              ? "Lunas"
              : "Belum lunas"}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-lg font-bold text-gray-900">
            {formatRupiah(debt.amount)}
          </p>

          <span className="text-sm text-gray-400">
            • {formatRelativeDate(debt.created_at)}
          </span>
        </div>

        {debt.note && (
          <p className="mt-1 truncate text-sm text-gray-500">
            {debt.note}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {!debt.settled_at && (
          <button
            type="button"
            onClick={() => onSettle(debt.id)}
            className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            Tandai lunas
          </button>
        )}

        <button
          type="button"
          onClick={() => onEdit(debt)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(debt.id)}
          className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Hapus
        </button>
      </div>
    </div>
  );
}