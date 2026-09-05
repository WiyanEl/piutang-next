interface DebtFiltersProps {
  search: string;
  status: string;
  type: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export default function DebtFilters({
  search,
  status,
  type,
  sort,
  onSearchChange,
  onStatusChange,
  onTypeChange,
  onSortChange,
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
    </div>
  );
}