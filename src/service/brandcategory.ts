import https from "./config";

interface BrandCategory {
    id?: number;
    name: string;
    // Add other properties if needed
}

interface PaginationParams {
    search?: string;
    page: number;
    limit: number;
}

const BrandCategoryService = {
    create: (data: BrandCategory) => https.post("/brand-category/create", data),
    get: (params: PaginationParams) => https.get("/brand-category/search", { params }),
    update: (id: number, data: BrandCategory) => https.patch(`/brand-category/update/${id}`, data),
    delete: (id: number) => https.delete(`/brand-category/delete/${id}`)
};

export default BrandCategoryService;
