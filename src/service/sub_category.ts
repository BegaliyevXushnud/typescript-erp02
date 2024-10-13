import https from "./config";

// Define types for the data structures
interface CreateSubCategoryData {
  name: string;
  // Add other fields as necessary
}

interface UpdateSubCategoryData {
  name?: string;
  // Add other fields as necessary
}

interface SubCategoryParams {
  page?: number;
  limit?: number;
  search?: string;
}

const Sub_categoryServise = {
  create: (data: CreateSubCategoryData) => 
    https.post("/sub-category/create", data),

  get: (parent_id: string | number, params?: SubCategoryParams) => 
    https.get(`/sub-category/search/${parent_id}`, { params }),

  update: (id: string | number, data: UpdateSubCategoryData) => 
    https.patch(`/sub-category/update/${id}`, data),

  delete: (id: string | number) => 
    https.delete(`/sub-category/delete/${id}`)
};

export default Sub_categoryServise;
