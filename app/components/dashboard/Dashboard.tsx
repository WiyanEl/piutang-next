'use client'

import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import Header from "./Header"
import SummaryCards from "./SummaryCards"
import DebtFilters from "./DebtFilters"
import DebtList from "./DebtList"
import DebtFormModal from "./DebtFormModal"
import GroupedDebtList from "./GroupedDebtList"
import DebtChart from "./DebtChart"

import type { Debt } from "@/app/types/debt"

export default function Dashboard() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<Debt | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<"list" | "grouped">("list");

  const filteredDebts = [...debts]
    .filter((debt) =>
      debt.counterpart_name
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "newest") {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      }

      if (sort === "oldest") {
        return (
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime()
        );
      }

      if (sort === "amount_desc") {
        return b.amount - a.amount;
      }

      if (sort === "amount_asc") {
        return a.amount - b.amount;
      }

      return 0;
    });

  const fetchDebts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (statusFilter) {
        params.set("status", statusFilter);
      }

      if (typeFilter) {
        params.set("type", typeFilter);
      }

      const queryString = params.toString();

      const response = await fetch(
        `/api/debts${queryString ? `?${queryString}` : ""}`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal mengambil data kasbon",
        );
      }

      setDebts(result.data);
    } catch (error) {
      console.error("Fetch debts error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat mengambil data",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebts();
  }, [statusFilter, typeFilter]);

  const summary = useMemo(() => {
    const totalOwedToMe = debts
      .filter(
        (debt) =>
          debt.type === "owed_to_me" &&
          debt.settled_at === null,
      )
      .reduce(
        (total, debt) => total + debt.amount,
        0,
      );

    const totalIOwe = debts
      .filter(
        (debt) =>
          debt.type === "i_owe" &&
          debt.settled_at === null,
      )
      .reduce(
        (total, debt) => total + debt.amount,
        0,
      );

    return {
      totalOwedToMe,
      totalIOwe,
    };
  }, [debts]);

  const handleSettle = async (id: string) => {
    try {
      setError("");

      const response = await fetch(`/api/debts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settled_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menandai kasbon sebagai lunas",
        );
      }

      await fetchDebts();
    } catch (error) {
      console.error("Settle debt error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menandai kasbon",
      );
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Apakah kamu yakin ingin menghapus kasbon ini?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(`/api/debts/${id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Gagal menghapus kasbon",
        );
      }

      await fetchDebts();
    } catch (error) {
      console.error("Delete debt error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menghapus kasbon",
      );
    }
  };

  return (
    <>
      <DebtFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingDebt(null);
        }}
        onSuccess={fetchDebts}
        debt={editingDebt}
      />
      <main className="min-h-screen bg-gray-50">
        <Header />

        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="mb-8 grid grid-cols-2 items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>

              <p className="mt-1 text-gray-500">
                Kelola catatan hutang dan piutang kamu.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingDebt(null);
                  setIsFormOpen(true);
                }}
                className="flex gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
              >
                <Plus size={20} /> Catat baru
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Memuat data...
            </div>
          ) : (
            <>
              <SummaryCards
                totalOwedToMe={summary.totalOwedToMe}
                totalIOwe={summary.totalIOwe}
              />

              <div className="mt-6">
                <DebtChart
                  totalOwedToMe={summary.totalOwedToMe}
                  totalIOwe={summary.totalIOwe}
                />
              </div>

              <div className="mt-8">
                <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Daftar Kasbon
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      Semua catatan hutang dan piutang kamu.
                    </p>
                  </div>

                  <DebtFilters
                    search={search}
                    status={statusFilter}
                    type={typeFilter}
                    sort={sort}
                    viewMode={viewMode}
                    onStatusChange={setStatusFilter}
                    onTypeChange={setTypeFilter}
                    onSearchChange={setSearch}
                    onSortChange={setSort}
                    onViewModeChange={setViewMode}
                  />
                </div>

                {loading ? (
                  <div className="rounded-xl bg-white p-10 text-center text-gray-500 shadow-sm">
                    Memuat data...
                  </div>
                ) : (
                  <>
                    {viewMode === "list" ? (
                      <DebtList
                        debts={filteredDebts}
                        onSettle={handleSettle}
                        onEdit={(debt) => {
                          setEditingDebt(debt);
                          setIsFormOpen(true);
                        }}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <GroupedDebtList
                        debts={filteredDebts}
                        onSettle={handleSettle}
                        onEdit={(debt) => {
                          setEditingDebt(debt);
                          setIsFormOpen(true);
                        }}
                        onDelete={handleDelete}
                      />
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}