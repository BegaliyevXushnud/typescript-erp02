import React, { useEffect, useState } from 'react';
import { Button, message, Input } from 'antd';
import category from '../../service/category';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, UnorderedListOutlined } from '@ant-design/icons';
import CategoryModal from '../../component/modals/categorymodal';
import GlobalPopconfirm from '../../component/popconfirm';
import TableComponent from '../../component/table';
import { ParamsType } from '@types';
import { TablePaginationConfig } from 'antd';
import './index.css'

interface CategoryType {
    id: number;
    name: string;
}

const Category: React.FC = () => {
    const [data, setData] = useState<CategoryType[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [editingCategory, setEditingCategory] = useState<CategoryType | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [params, setParams] = useState<ParamsType>({
        search: '',
        page: 1,
        limit: 5,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        const page = Number(urlParams.get('page')) || 1;
        const limit = Number(urlParams.get('limit')) || 5;
        const searchParam = urlParams.get('search') || '';
        setParams((prev) => ({
            ...prev,
            page: page,
            limit: limit,
            search: searchParam,
        }));
    }, [search]);

    const getData = async () => {
        try {
            const res = await category.get(params);
            setData(res?.data?.data?.categories || []);
            setTotal(res?.data?.data?.count || 0);
        } catch (err) {
            console.error(err);
            message.error("Ma'lumotlarni yuklashda xatolik yuz berdi");
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    const handleDelete = async (id: number) => {
        try {
            await category.delete(id);
            message.success("Category muvaffaqiyatli o'chirildi");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Categoryni o'chirishda xatolik yuz berdi");
        }
    };

    const editItem = (item: CategoryType) => {
        setEditingCategory(item);
        setOpen(true);
    };

    const navigateToSubCategory = (item: CategoryType) => {
        navigate(`/admin-layout/category/sub-category/${item.id}`);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        setParams((prev) => ({
            ...prev,
            search: searchValue,
        }));
        const searchParams = new URLSearchParams(search);
        searchParams.set("search", searchValue);
        navigate(`?${searchParams}`);
    };

    const handlePageChange = (pagination: TablePaginationConfig) => {
        const current = pagination.current || 1;
        const pageSize = pagination.pageSize || 5;
        setParams((prev) => ({
            ...prev,
            page: current,
            limit: pageSize,
        }));
        const currentParams = new URLSearchParams(search);
        currentParams.set('page', `${current}`);
        currentParams.set('limit', `${pageSize}`);
        navigate(`?${currentParams}`);
    };

    const handleCancel = () => {
        setOpen(false);
        setEditingCategory(null);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (_: any, __: CategoryType, index: number) => (params.page - 1) * params.limit + index + 1,
        },
        {
            title: 'Category name',
            dataIndex: 'name',
            render: (_: string, item: CategoryType) => <a onClick={() => editItem(item)}>{item.name}</a>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: string, item: CategoryType) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<UnorderedListOutlined />} onClick={() => navigateToSubCategory(item)} />
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Categoryni o'chirishni tasdiqlaysizmi?"
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
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add New Category</Button>
            </div>
            <div className="table-container">
                <TableComponent
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
            <CategoryModal
                open={open}
                handleCancel={handleCancel}
                category={editingCategory}
                refreshData={getData}
            />
        </div>
    );
};

export default Category;
