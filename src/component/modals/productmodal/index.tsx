import { Button, Form, Input, Drawer, message, Upload, Select } from "antd";
import { useEffect, useState } from "react";
import productService from "../../../service/product";
import categoryService from "../../../service/category";
import brandService from "../../../service/brand";
import brandCategoryService from "../../../service/brandcategory";
import { UploadOutlined } from '@ant-design/icons';

interface ProductDrawerProps {
    open: boolean;
    handleClose: () => void;
    product: ProductData | null;
    refreshData: () => void;
}

interface ProductData {
    id?: string;
    name: string;
    price: number;
    category_id: string;
    brand_id: string;
    brandcategory_id: string;
    image?: string;
}

const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

const ProductDrawer: React.FC<ProductDrawerProps> = ({ open, handleClose, product, refreshData }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
    const [brandCategories, setBrandCategories] = useState<{ id: string; name: string }[]>([]);
    const [fileList, setFileList] = useState<any[]>([]);

    // Fetch data on component mount and when the drawer is opened
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await categoryService.getAll();
                console.log("Categories fetched:", res.data.data); // Log the fetched categories
                setCategories(res.data.data);
            } catch (error) {
                console.error(error);
                message.error("Failed to fetch categories");
            }
        };

        const fetchBrands = async () => {
            try {
                const res = await brandService.getAll();
                console.log("Brands fetched:", res.data.data); // Log the fetched brands
                setBrands(res.data.data);
            } catch (error) {
                console.error(error);
                message.error("Failed to fetch brands");
            }
        };

        fetchCategories();
        fetchBrands();
    }, []);

    // Fetch brand categories when the selected brand changes
    const fetchBrandCategories = async (brandId: string) => {
        try {
            const res = await brandCategoryService.getByBrandId(brandId);
            console.log("Brand categories fetched for brandId:", brandId, res.data.data); // Log fetched brand categories
            setBrandCategories(res.data.data);
            form.setFieldsValue({ brandcategory_id: undefined }); // Reset brand category if brand changes
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch brand categories");
        }
    };

    // Set form fields if editing a product
    useEffect(() => {
        if (product) {
            form.setFieldsValue(product);
            setImageUrl(product.image || null);
            setFileList(product.image ? [{
                uid: '1',
                name: 'image.png',
                status: 'done',
                url: product.image,
            }] : []);
            // Fetch brand categories if product has a brand ID
            if (product.brand_id) {
                fetchBrandCategories(product.brand_id);
            }
        } else {
            form.resetFields();
            setImageUrl(null);
            setFileList([]);
            setBrandCategories([]); // Reset brand categories when no product
        }
    }, [product, form]);

    const handleFinish = async (values: ProductData) => {
        setLoading(true);
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price.toString());
        formData.append('category_id', values.category_id);
        formData.append('brand_id', values.brand_id);
        formData.append('brandcategory_id', values.brandcategory_id);

        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            if (product) {
                await productService.update(product.id || '', formData);
                message.success("Product updated successfully");
            } else {
                await productService.create(formData);
                message.success("Product created successfully");
            }
            refreshData();
            handleClose();
        } catch (error) {
            console.error(error);
            message.error("Error while saving product");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadChange = async ({ fileList }: { fileList: any[] }) => {
        if (fileList.length > 0) {
            const file = fileList[0].originFileObj as File;
            const base64 = await getBase64(file);
            setImageFile(file);
            setImageUrl(base64);
            setFileList(fileList);
        } else {
            setImageFile(null);
            setImageUrl(null);
            setFileList([]);
        }
    };

    return (
        <Drawer
            title={product ? "Edit Product" : "Add Product"}
            placement="right"
            onClose={handleClose}
            visible={open}
            width={720}
        >
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item label="Product Name" name="name" rules={[{ required: true, message: "Please enter product name" }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true, message: "Please enter product price" }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="Category" name="category_id" rules={[{ required: true, message: "Please select a category" }]}>
                    <Select onChange={fetchBrandCategories}>
                        {categories.map(category => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Brand" name="brand_id" rules={[{ required: true, message: "Please select a brand" }]}>
                    <Select onChange={fetchBrandCategories}>
                        {brands.map(brand => (
                            <Select.Option key={brand.id} value={brand.id}>
                                {brand.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Brand Category" name="brandcategory_id" rules={[{ required: true, message: "Please select a brand category" }]}>
                    <Select>
                        {brandCategories.map(brandCategory => (
                            <Select.Option key={brandCategory.id} value={brandCategory.id}>
                                {brandCategory.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Upload Image">
                    <Upload
                        listType="picture"
                        beforeUpload={() => false} // Prevent automatic upload
                        fileList={fileList}
                        onChange={handleUploadChange}
                    >
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
                    {imageUrl && <img src={imageUrl} alt="Product" style={{ width: '100px', marginTop: '10px' }} />}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default ProductDrawer;
