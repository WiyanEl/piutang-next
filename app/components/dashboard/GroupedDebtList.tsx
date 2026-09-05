"use client";

import { useState } from "react";
import type { Debt } from "@/app/types/debt";
import DebtItem from "./DebtItem";

interface GroupedDebtListProps {
  debts: Debt[];
  onSettle: (id: string) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export default function GroupedDebtList({
  debts,
  onSettle,
  onEdit,
  onDelete,
}: GroupedDebtListProps) {
  const [expandedName, setExpandedName] = useState<string | null>(null);

  const groupedDebts = debts.reduce(
    (groups, debt) => {
      const name = debt.counterpart_name;

      if (!groups[name]) {
        groups[name] = [];
      }

      groups[name].push(debt);

      return groups;
    },
    {} as Record<string, Debt[]>,
  );

  const groups = Object.entries(groupedDebts);

  if (groups.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">
          Tidak ada data kasbon.
        </p>
      </div>
    );
  }

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-3">
      {groups.map(([name, groupDebts]) => {
        const owedToMe = groupDebts
          .filter((debt) => debt.type === "owed_to_me")
          .reduce(
            (total, debt) => total + debt.amount,
            0,
          );

        const iOwe = groupDebts
          .filter((debt) => debt.type === "i_owe")
          .reduce(
            (total, debt) => total + debt.amount,
            0,
          );

        const net = owedToMe - iOwe;
        const isExpanded = expandedName === name;

        return (
          <div
            key={name}
            className="overflow-hidden rounded-xl bg-white shadow-sm"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedName(
                  isExpanded ? null : name,
                )
              }
              className="w-full p-5 text-left transition hover:bg-gray-50"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900">
                    {name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {groupDebts.length}{" "}
                    {groupDebts.length === 1
                      ? "entry"
                      : "entry"}
                  </p>
                </div>

                <span className="text-gray-400">
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-gray-400">
                    Dihutang ke saya
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    {formatRupiah(owedToMe)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Saya hutang
                  </p>

                  <p className="mt-1 font-semibold text-red-600">
                    {formatRupiah(iOwe)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400">
                    Net
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      net >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatRupiah(net)}
                  </p>
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-gray-100">
                {groupDebts.map((debt) => (
                  <div
                    key={debt.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <DebtItem
                      debt={debt}
                      onSettle={onSettle}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}