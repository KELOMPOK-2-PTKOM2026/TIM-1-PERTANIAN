export type HargaQuery = {
  komoditas?: string;
  pasar?: string;
  from?: string;
  to?: string;
};

export type HargaPoint = {
  date: string; // yyyy-mm-dd
  price: number; // rupiah per satuan
  commodityId: string;
  marketId: string;
  commodity: string;
  market: string;
  unit: string;
};
