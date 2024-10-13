import https from "./config";

interface BrandParams {
  search?: string;
  page?: number;
  limit?: number;
}

const BrandService = {
  create: (data: FormData) => https.post("/brand/create", data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  get: (params: BrandParams) => https.get("/brand/search", { params }),
  update: (id: number, data: FormData) => https.patch(`/brand/update/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  delete: (id: number) => https.delete(`/brand/delete/${id}`)
};

export default BrandService;
