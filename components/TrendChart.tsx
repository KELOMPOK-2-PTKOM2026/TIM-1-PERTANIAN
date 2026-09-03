"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type TrendDatum = { date: string; label: string; price: number };

export default function TrendChart({ data }: { data: TrendDatum[] }) {
  if (data.length === 0)
    return <p className="py-8 text-center text-sm text-stone-500">Tidak ada data untuk grafik.</p>;
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={24} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) =>
              v >= 1000 ? `${Math.round(v / 1000)}rb` : String(v)
            }
            width={48}
          />
          <Tooltip formatter={(v) => [`Rp${Number(v).toLocaleString("id-ID")}`, "Harga"]} />
          <Line type="monotone" dataKey="price" stroke="#337b2a" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
