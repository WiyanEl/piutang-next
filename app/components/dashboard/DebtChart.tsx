"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DebtChartProps {
  totalOwedToMe: number;
  totalIOwe: number;
}

export default function DebtChart({
  totalOwedToMe,
  totalIOwe,
}: DebtChartProps) {
  const data = [
    {
      name: "Dihutang ke saya",
      amount: totalOwedToMe,
      fill: "#22c55e",
    },
    {
      name: "Saya hutang",
      amount: totalIOwe,
      fill: "#ef4444",
    },
  ];

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">
          Perbandingan Hutang & Piutang
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Total kasbon yang belum lunas.
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `Rp${Number(value).toLocaleString("id-ID")}`
              }
            />

            <Tooltip
              formatter={(value) =>
                formatRupiah(Number(value))
              }
            />

            <Bar
              dataKey="amount"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}