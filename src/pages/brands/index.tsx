import { useEffect, useState, useCallback } from "react"
import { Button, message, Input } from 'antd';
import { ParamsType } from "@types";
import BrandService from '../../service/brand'
import { useNavigate,useLocation } from "react-router-dom";
import { TablePaginationConfig } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import GlobalPopconfirm from '../../component/popconfirm';
import TableComponent from '../../component/table';
import { BrandModal } from "../../component/modals";
import './index.css'
const index = () => {
  interface BrandType {
    id:number;
    name:string;
  }
  const [data, setData] = useState<BrandType[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<BrandType | null>(null);
  const [total, setTotal] = useState<number>(0)
  const [params,setParams] = useState<ParamsType>({
    search: "",
    page: 1,
    limit: 5
  })
  const navigate = useNavigate();
  const {search} = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    let page = Number(params.get("page")) || 1;
    let limit = Number(params.get("limit")) || 5;
    let search_val = params.get("search") || '';
    setParams((prev) => ({
      ...prev,
      page:page,
      limit:limit,
      search:search_val
    }));
  },[search]);

  const getData = useCallback(async () => {
    try {
        const res = await BrandService.get(params);
        setData(res?.data?.data?.brands || []);
        setTotal(res?.data?.data?.count || 0);
    } catch (err) {
        console.error(err);
    }
}, [params]);

useEffect(() => {
    getData();
}, [getData]);
  const handleDelete = async (id:number) => {
    try {
      await BrandService.delete(id);
      message.success("Brand muvaffaqiyatli o'chirildi");
      getData();
    }catch (error) {
      console.error(error);
      message.error("Brandni o'chirishda xatolik yuz berdi");
    }
  };

  const editItem = (item:BrandType) => {
    setEditingBrand(item);
    setOpen(true);
  }
  const handleSearchChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
   setParams((prev) => ({
    ...prev,
    search:searchValue,
   }));
   const searchParams = new URLSearchParams(search);
   searchParams.set("search", searchValue);
   navigate(`?${searchParams}`);
  };

  const handlePageChange = (pagination:TablePaginationConfig) => {
    const current = pagination.current || 1;
    const pageSize = pagination.pageSize || 5;
    setParams((prev) => ({
      ...prev,
      page:current,
      limit:pageSize,
    }));
    const currentParams = new URLSearchParams(search);
    currentParams.set('page', `${current}`);
    currentParams.set('limit', `${pageSize}`);
    navigate(`?${currentParams}`)
  }
  const handleCancel = () => {
    setOpen(false);
    setEditingBrand(null);
    setEditingBrand(null);
  }
  const columns = [
    {
      title: '№',
      dataIndex: 'index',
      render: (_: any, __: BrandType, index: number) => (params.page - 1) * params.limit + index + 1,
  },
  {
    title: 'Brand name',
    dataIndex:'name',
    render:(_ : string, item:BrandType) => <a onClick={() => editItem(item)}>{item.name}</a>,
  },
  {
    title: 'Image',
    dataIndex: 'image',
    render: (image: string) => (
      <img src={image} alt='Brand' style={{ width: '50px', height: '50px' }} />
    ),
  },
  
  
  
  {
    title: 'Action',
    dataIndex: 'action',
    render: (_ : string, item:BrandType) => (
      <div style={{ display: 'flex', gap: '10px' }}>
      <Button type="link" icon={<EditOutlined />} onClick={() => editItem(item)} />
      <GlobalPopconfirm
          title="Categoryni o'chirishni tasdiqlaysizmi?"
          onConfirm={() => handleDelete(item.id)}
      >
          <Button type="link" danger icon={<DeleteOutlined />} />
      </GlobalPopconfirm>
  </div>
    )
  }
  ]

  
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
    <Button className="add-btn" type="primary" onClick={() => setOpen(true)}>Add Brand</Button>
     </div>
     <div className="table-container">
    <TableComponent 
    columns={columns}
    data={data}
    pagination={{
      current:params.page,
      pageSize:params.limit,
      total:total,
      showSizeChanger:true,
      pageSizeOptions:["3", "5", "7", "10", "12"],
    }}
    handleChange={handlePageChange}
    />
     </div>
     <BrandModal
  open={open}
  handleCancel={handleCancel}
  editingBrand={editingBrand} // nomini to'g'ri keladigan nom bilan uzating
  refreshData={getData}
/>

    </div>
  )
}

export default index
