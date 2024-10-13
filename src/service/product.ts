import https from "./config";

interface ProductData {
  // Define the structure of your product data here.
  name: string; // Example property
  price: number; // Example property
  // Add other product properties as needed
}

interface SearchParams {
  // Define the structure of your search parameters here.
  query?: string; // Example property
  categoryId?: string; // Example property
  // Add other search parameters as needed
}

const Product = {
  create: (data: ProductData) => https.post("/products/create", data),
  
  // Add `params` parameter for the search function
  get: (params: SearchParams) => https.get("/products/search", { params }), // Attach URL parameters

  update: (id: string, data: ProductData) => https.patch(`/products/update/${id}`, data),
  
  delete: (id: string) => https.delete(`/products/delete/${id}`),
};

export default Product;
