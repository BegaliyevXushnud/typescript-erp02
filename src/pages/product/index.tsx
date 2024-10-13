import React, { useEffect, useState } from 'react';
import { Button, message, Input } from 'antd';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import  productService  from '../../service/product'; // Adjust the import path if necessary
import { useNavigate, useLocation } from 'react-router-dom';
import ProductModal from '../../component/modals/productmodal'; // Adjust the import path if necessary
import  GlobalPopconfirm  from '../../component/popconfirm';
import GlobalTable from '../../component/table'; // Adjust the import path if necessary
import Noimg from '../../assets/no_foto.jpg';

interface ProductData {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
}

interface Params {
    search: string;
    page: number;
    limit: number;
}

const Product: React.FC = () => {
    const [data, setData] = useState<ProductData[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [params, setParams] = useState<Params>({
        search: '',
        page: 1,
        limit: 5,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    // Fetching URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        const page = Number(urlParams.get('page')) || 1;
        const limit = Number(urlParams.get('limit')) || 5;
        const searchParam = urlParams.get("search") || "";
        setParams((prev) => ({
            ...prev,
            page: page,
            limit: limit,
            search: searchParam,
        }));
    }, [search]);

    // Fetching product data
    const getData = async () => {
        try {
            const res = await productService.get(params);
            setData(res?.data?.data?.products || []);
            setTotal(res?.data?.data?.total || 0);
        } catch (err) {
            console.error(err);
            message.error("Data fetching error!");
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    // Handle delete
    const handleDelete = async (id: string) => {
        try {
            await productService.delete(id);
            message.success("Product successfully deleted");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Error occurred while deleting the product");
        }
    };

    const editItem = (item: ProductData) => {
        setEditingProduct(item);
        setOpen(true);
    };

    const navigateToProductDetail = (item: ProductData) => {
        navigate(`/admin-layout/product/product-detail/${item.id}`, {
            state: {
                name: item.name,
                price: item.price,
            },
        });
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        setParams((prev) => ({
            ...prev,
            search: searchValue,
        }));

        const search_params = new URLSearchParams(search);
        search_params.set("search", searchValue);
        navigate(`?${search_params}`);
    };

    const handlePageChange = (pagination: { current: number; pageSize: number }) => {
        const { current, pageSize } = pagination;
        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));

        const current_params = new URLSearchParams(search);
        current_params.set('page', current.toString());
        current_params.set('limit', pageSize.toString());
        navigate(`?${current_params}`);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingProduct(null); // Reset the editingProduct state when closing
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (text: string, item: ProductData, index: number) => (params.page - 1) * params.limit + index + 1,
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            render: (text: string, item: ProductData) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
        },
        {
            title: 'Image',
            dataIndex: 'images',
            render: (images: { url: string }[]) => (
                <div>
                    {images && images.length > 0 ? (
                        images.map((image, index) => (
                            <img
                                key={index}
                                src={image.url || Noimg} // Use Noimg if image.url is not available
                                alt={`Image ${index + 1}`} 
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
                            />
                        ))
                    ) : (
                        <img
                            src={Noimg} 
                            alt="Placeholder"
                            style={{ width: '60px', height: '50px', objectFit: 'cover' }} // Placeholder
                        />
                    )}
                </div>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (text: string, item: ProductData) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<UnorderedListOutlined />} onClick={() => navigateToProductDetail(item)} />
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(item.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </GlobalPopconfirm>
                </div>
            ),
        },
    ];
    
    return (
        <div>
            <div className="header-container">
                <Input
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    value={params.search}
                    className="search-input"
                    style={{ marginBottom: '16px' }}
                />
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Product</Button>
            </div>
            <div className="table-container">
                <GlobalTable
                    columns={columns}
                    data={data}
                    pagination={{
                        current: params.page,
                        pageSize: params.limit,
                        total: total,
                        showSizeChanger: true,
                        pageSizeOptions: ["3", "5", "7", "10", "12"],
                    }}
                    handleChange={handlePageChange}
                />
            </div>
            <ProductModal
                open={open}
                handleClose={handleClose}
                product={editingProduct}
                refreshData={getData} // Fetch new data after updates
            />
        </div>
    );
};

export default Product;
