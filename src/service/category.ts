import https from "./config";

interface CategoryParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface CategoryData {
  name: string;
  [key: string]: any; // Bu boshqa ma'lumotlar kiritilishi mumkinligini bildiradi.
}

const categoryService = {
  create: (data: CategoryData) => https.post("/category/create", data),
  get: (params: CategoryParams) => https.get("/category/search", { params }),
  update: (id: number, data: CategoryData) => https.patch(`/category/update/${id}`, data),
  delete: (id: number) => https.delete(`/category/delete/${id}`)
};

export default categoryService;
