import https from "./config";

interface StockData {
  product_id: string;
  category_id: string;
  brand_id: string;
  quantity: number;
}

const stockService = {
  create: (data: StockData) => https.post("/stock/create", data),
  getAll: () => https.get("/stock"),
  getByBrand: (id: string) => https.get(`/stock/brand/${id}`),
  getById: (id: string) => https.get(`/stock/${id}`),
  update: (id: string, data: StockData) => https.patch(`/stock/update/${id}`, data),
  delete: (id: string) => https.delete(`/stock/delete/${id}`)
};

export default stockService;
