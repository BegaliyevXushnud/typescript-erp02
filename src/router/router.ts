import { FileProtectOutlined,TagsOutlined,SettingOutlined,StockOutlined,NotificationOutlined,TagOutlined,AppstoreOutlined } from '@ant-design/icons';


const admin = [
  {
    content: "Product",
    path: "/admin-layout",
    icon: FileProtectOutlined,  
  },
  {
    content: "Category",
    path: "/admin-layout/category",
    icon: AppstoreOutlined,
  },
  {
    content: "Brands",
    path: "/admin-layout/brands",
    icon: TagOutlined,
  },
  {
    content: "Brand category",
    path: "/admin-layout/brands-category",
    icon: TagsOutlined,
  },
  {
    content: "ADS",
    path: "/admin-layout/ads",
    icon: NotificationOutlined,
  },
  {
    content: "Stock",
    path: "/admin-layout/stock",
    icon: StockOutlined,
  },
  {
    content: "Settings",
    path: "/admin-layout/setting",
    icon: SettingOutlined,
  },
];

export default admin;