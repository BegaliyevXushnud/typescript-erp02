import React, { useState, useEffect } from 'react';
import { Button, message, Table, Input } from 'antd';
import  sub_category  from '../../service/sub_category'; // Adjust your import path accordingly
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'; 
import SubCategoryModal from '../../component/modals/sub_categorymodal'; // Adjust the import path as necessary
import  GlobalPopconfirm  from '../../component/popconfirm'; 

// Define types for data item and API response
interface SubCategoryItem {
    id: number;
    name: string;
}

interface SubCategoryResponse {
    data: {
        subcategories: SubCategoryItem[];
        total: number;
    };
}

const SubCategory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<SubCategoryItem[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [update, setUpdate] = useState<SubCategoryItem | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(10);
    const [totalItems, setTotalItems] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>(''); 
    
    const navigate = useNavigate();
    const { search } = useLocation();

    const getQueryParams = () => {
        const params = new URLSearchParams(search);
        const page = params.get('page') ? parseInt(params.get('page') as string, 10) : 1;
        const limit = params.get('limit') ? parseInt(params.get('limit') as string, 10) : 10;
        return { page, limit };
    };
    

    const getData = async (page = 1, limit = 10, search = '') => {
        try {
            const res = await sub_category.get<SubCategoryResponse>(id!); 
            setData(res?.data?.data?.subcategories || []);
            setTotalItems(res?.data?.data?.total || 0);
        } catch (err) {
            console.error(err);
            message.error("Data fetching error occurred");
        }
    };
    
    useEffect(() => {
        const access_token = localStorage.getItem('access_token');
        if (!access_token) {
            console.error("Access token topilmadi! Bosh sahifaga yo'naltirilmoqda...");
            navigate("/");
        } else {
            const { page, limit } = getQueryParams();
            setCurrentPage(page);
            setPageSize(limit);
            getData(page, limit, searchTerm);
        }
    }, [navigate, search, searchTerm]);

    const handleDelete = async (id: number) => {
        try {
            await sub_category.delete(id);
            message.success("Sub-category muvaffaqiyatli o'chirildi");
            getData(currentPage, pageSize, searchTerm);
        } catch (error) {
            console.error(error);
            message.error("Sub-categoryni o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item: SubCategoryItem) => {
        setUpdate(item);
        setOpen(true);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
        const current_params = new URLSearchParams(search);
        current_params.set('search', e.target.value);
        navigate(`?${current_params}`);
        getData(1, pageSize, e.target.value);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (_: any, __: SubCategoryItem, index: number) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Sub-category name',
            dataIndex: 'name',
            render: (text: string, item: SubCategoryItem) => <a onClick={() => editItem(item)}>{text}</a>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, item: SubCategoryItem) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Sub-categoryni o'chirishni tasdiqlaysizmi?"
                        onConfirm={() => handleDelete(item.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </GlobalPopconfirm>
                </div>
            ),
        },
    ];

    const handleCancel = () => {
        setOpen(false);
        setUpdate(null);
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
        const current_params = new URLSearchParams(search);
        current_params.set('page', `${page}`);
        current_params.set('limit', `${pageSize}`);
        navigate(`?${current_params}`);
        getData(page, pageSize, searchTerm);
    };

    const refreshData = () => {
        getData(currentPage, pageSize, searchTerm);
    };

    return (
        <div>
            <div className="header-container">
                <Input
                    placeholder="Search..."
                    onChange={handleSearchChange}
                    style={{ marginBottom: '16px', width: '300px' }} 
                />
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Sub-category</Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: totalItems,
                    onChange: handlePageChange,
                    showSizeChanger: true,
                    pageSizeOptions: [2, 5, 7, 10],
                }}
                rowKey={(item: SubCategoryItem) => item.id.toString()}
            />
            
            <SubCategoryModal
                open={open}
                handleCancel={handleCancel}
                subCategory={update}
                refreshData={refreshData}
            />
        </div>
    );
};

export default SubCategory;
