import React, { useEffect, useState, useCallback } from 'react';
import { Button, message, Input } from 'antd';
import brandCategoryService from '../../service/brandcategory';
import { useNavigate, useLocation } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BrandCategoryDrawer from '../../component/modals/brandcategory';
import GlobalPopconfirm from '../../component/popconfirm'
import TableComponent from '../../component/table';
import { PaginationProps } from 'antd';

interface BrandCategory {
    id: number;
    name: string;
    [key: string]: any;
}

interface PaginationParams {
    search: string;
    page: number;
    limit: number;
}

const BrandCategory: React.FC = () => {
    const [data, setData] = useState<BrandCategory[]>([]);
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const [currentCategory, setCurrentCategory] = useState<BrandCategory | null>(null);
    const [totalCategories, setTotalCategories] = useState<number>(0);
    const [paginationParams, setPaginationParams] = useState<PaginationParams>({
        search: '',
        page: 1,
        limit: 5,
    });

    const navigate = useNavigate();
    const { search } = useLocation();

    // Get pagination parameters from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(search);
        const page = Number(urlParams.get('page')) || 1;
        const limit = Number(urlParams.get('limit')) || 5;
        const searchParam = urlParams.get("search") || "";
        setPaginationParams({ page, limit, search: searchParam });
    }, [search]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await brandCategoryService.get(paginationParams);
            setData(res?.data?.data?.brandCategories || []);
            setTotalCategories(res?.data?.data?.count || 0);
        } catch (error) {
            console.error(error);
            message.error("Error fetching categories. Please try again later.");
        }
    }, [paginationParams]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleDeleteCategory = async (id: number) => {
        try {
            await brandCategoryService.delete(id);
            message.success("Brand Category successfully deleted.");
            fetchCategories();
        } catch (error) {
            console.error(error);
            message.error("Error deleting Brand Category. Please try again.");
        }
    };

    const handleEditCategory = (item: BrandCategory) => {
        setCurrentCategory(item);
        setOpenDrawer(true);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchValue = event.target.value;
        setPaginationParams((prev) => ({ ...prev, search: newSearchValue }));
        const searchParams = new URLSearchParams(search);
        searchParams.set("search", newSearchValue);
        navigate(`?${searchParams}`);
    };

    const handlePageChange = (pagination: PaginationProps) => {
        const { current, pageSize } = pagination;
        setPaginationParams((prev) => ({ ...prev, page: current || 1, limit: pageSize || 5 }));
        const currentParams = new URLSearchParams(search);
        currentParams.set('page', `${current}`);
        currentParams.set('limit', `${pageSize}`);
        navigate(`?${currentParams}`);
    };

    const handleCloseDrawer = () => {
        setOpenDrawer(false);
        setCurrentCategory(null);
    };

    const columns = [
        {
            title: '№',
            dataIndex: 'index',
            render: (_: string, __: BrandCategory, index: number) =>
                (paginationParams.page - 1) * paginationParams.limit + index + 1,
        },
        {
            title: 'Brand Category',
            dataIndex: 'name',
            render: (text: string, item: BrandCategory) => (
                <a onClick={() => handleEditCategory(item)}>{text}</a>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_: string, item: BrandCategory) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button type="link" icon={<EditOutlined />} onClick={() => handleEditCategory(item)} />
                    <GlobalPopconfirm
                        title="Are you sure you want to delete this brand?"
                        onConfirm={() => handleDeleteCategory(item.id)}
                    >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                    </GlobalPopconfirm>
                </div>
            ),
        },
    ];

    return (
      <div className='flex flex-col gap-3'>
          <div className="header-container" style={{ display: 'flex', alignItems: 'center', gap: '1126px' }}>
              <Input
                  placeholder="Search..."
                  onChange={handleSearchChange}
                  value={paginationParams.search}
                  className="search-input"
                  style={{ flex: 1 }} // Inputni kengaytirish
              />
              <Button className="add-btn" type="primary" onClick={() => setOpenDrawer(true)}>
                  Add New Category
              </Button>
          </div>
          <div className="table-container">
              <TableComponent
                  columns={columns}
                  data={data}
                  pagination={{
                      current: paginationParams.page,
                      pageSize: paginationParams.limit,
                      total: totalCategories,
                      showSizeChanger: true,
                      pageSizeOptions: ["3", "5", "7", "10", "12"],
                  }}
                  handleChange={handlePageChange}
              />
          </div>
          <BrandCategoryDrawer
              open={openDrawer}
              handleClose={handleCloseDrawer}
              brandCategory={currentCategory}
              refreshData={fetchCategories}
          />
      </div>
  );
  
};

export default BrandCategory;
