import React, { useEffect, useState } from 'react';
import { Button, message, Input } from 'antd';
import adsService from '../../service/ads';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AdsDrawer from '../../component/modals/adsmodal';
import GlobalPopconfirm from '../../component/popconfirm';
import TableComponent from '../../component/table';
import noimage from '../../assets/najot.jpg';
import type { PaginationProps } from 'antd/es/pagination';

interface AdItem {
    id: number;
    image?: string;
    position?: string;
}

interface Params {
    search: string;
    page: number;
    limit: number;
}

const Ads: React.FC = () => {
    const [data, setData] = useState<AdItem[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [editingAd, setEditingAd] = useState<AdItem | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [params, setParams] = useState<Params>({ search: '', page: 1, limit: 5 });
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const page = Number(params.get('page')) || 1;
        const limit = Number(params.get('limit')) || 5;
        const searchParam = params.get('search') || '';
        setParams((prev) => ({ ...prev, page, limit, search: searchParam }));
    }, [search]);

    const getData = async () => {
        try {
            const res = await adsService.getAll(params);
            setData(res?.data?.data || []);
            setTotal(res?.data?.total || 0);
        } catch (err) {
            console.error(err);
            message.error("Failed to load data");
        }
    };

    useEffect(() => {
        getData();
    }, [params]);

    const handleDelete = async (id: number) => {
        try {
            await adsService.delete(id);
            message.success("Advertisement successfully deleted");
            getData();
        } catch (error) {
            console.error(error);
            message.error("Failed to delete advertisement");
        }
    };

    const editItem = (item: AdItem) => {
        setEditingAd(item);
        setOpen(true);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setParams((prev) => ({ ...prev, search: value }));
        getData();
    };

    const handlePageChange: PaginationProps['onChange'] = (current, pageSize) => {
        setParams((prev) => ({ ...prev, page: current, limit: pageSize }));
        const current_params = new URLSearchParams(search);
        current_params.set('page', `${current}`);
        current_params.set('limit', `${pageSize}`);
        navigate(`?${current_params}`);
    };

    const handleCancel = () => {
        setOpen(false);
        setEditingAd(null);
    };

    const columns = [
        {
            title: 'T/R',
            dataIndex: 'index',
            render: (_: any, __: AdItem, index: number) => (params.page - 1) * params.limit + index + 1,
        },
        {
            title: 'Image',
            dataIndex: 'image',
            render: (_: any, item: AdItem) => (
                <img
                    src={item.image ? item.image : noimage}
                    alt="Advertisement"
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover' }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).onerror = null;
                        (e.target as HTMLImageElement).src = noimage;
                    }}
                />
            ),
        },
        {
            title: 'Position',
            dataIndex: 'position',
            render: (_: any, item: AdItem) => (
                <a onClick={() => editItem(item)}>{item.position || 'N/A'}</a>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: any, item: AdItem) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
                    <GlobalPopconfirm
                        title="Are you sure to delete this advertisement?"
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
                <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>
                    Add New Advertisement
                </Button>
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
                        pageSizeOptions: ['3', '5', '7', '10', '12'],
                    }}
                    handleChange={handlePageChange}
                />
            </div>
            <AdsDrawer open={open} handleClose={handleCancel} adItem={editingAd} refreshData={getData} />
        </div>
    );
};

export default Ads;
