import type { Debt } from "@/app/types/debt";

import DebtItem from "./DebtItem";

interface DebtListProps {
  debts: Debt[];
  onSettle: (id: string) => void;
  onEdit: (debt: Debt) => void;
  onDelete: (id: string) => void;
}

export default function DebtList({
  debts,
  onSettle,
  onEdit,
  onDelete,
}: DebtListProps) {
  if (debts.length === 0) {
    return (
      <div className="rounded-xl bg-white p-10 text-center shadow-sm">
        <p className="text-gray-500">
          Tidak ada data kasbon.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-sm">
      {debts.map((debt) => (
        <DebtItem
          key={debt.id}
          debt={debt}
          onSettle={onSettle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}