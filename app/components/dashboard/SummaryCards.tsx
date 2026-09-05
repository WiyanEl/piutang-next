interface SummaryCardsProps {
  totalOwedToMe: number;
  totalIOwe: number;
}

export default function SummaryCards({
  totalOwedToMe,
  totalIOwe,
}: SummaryCardsProps) {
  const net = totalOwedToMe - totalIOwe;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Total dihutang ke saya
        </p>

        <p className="mt-2 text-2xl font-bold text-gray-900">
          {formatRupiah(totalOwedToMe)}
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Total saya hutang
        </p>

        <p className="mt-2 text-2xl font-bold text-gray-900">
          {formatRupiah(totalIOwe)}
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">
          Net
        </p>

        <p
          className={`mt-2 text-2xl font-bold ${
            net >= 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {formatRupiah(net)}
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Total dihutang ke saya - total saya hutang
        </p>
      </div>
    </section>
  );
}