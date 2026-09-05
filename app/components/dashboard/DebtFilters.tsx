interface DebtFiltersProps {
  search: string;
  status: string;
  type: string;
  sort: string;
  viewMode: "list" | "grouped";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onViewModeChange: (value: "list" | "grouped") => void;
}

export default function DebtFilters({
  search,
  status,
  type,
  sort,
  viewMode,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
  onViewModeChange,
}: DebtFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <input
          type="text"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Cari nama orang..."
          className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
        />
      </div>

      <select
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value)
        }
        className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
      >
        <option value="">Semua status</option>
        <option value="unsettled">Belum lunas</option>
        <option value="settled">Lunas</option>
      </select>

      <select
        value={type}
        onChange={(event) =>
          onTypeChange(event.target.value)
        }
        className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
      >
        <option value="">Semua tipe</option>
        <option value="owed_to_me">Dihutang ke saya</option>
        <option value="i_owe">Saya hutang</option>
      </select>

      <select
        value={sort}
        onChange={(event) =>
          onSortChange(event.target.value)
        }
        className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="amount_desc">Jumlah terbesar</option>
        <option value="amount_asc">Jumlah terkecil</option>
      </select>

      <div className="flex rounded-lg border border-gray-200 bg-white p-1">
        <button
          type="button"
          onClick={() => onViewModeChange("list")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            viewMode === "list"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Transaksi
        </button>

        <button
          type="button"
          onClick={() => onViewModeChange("grouped")}
          className={`rounded-md px-3 py-2 text-sm font-medium transition ${
            viewMode === "grouped"
              ? "bg-gray-100 text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Per orang
        </button>
      </div>
    </div>
  );
}