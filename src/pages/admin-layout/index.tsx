import React, { useEffect, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Layout, Menu, theme, Modal, Space, Select, Tooltip } from 'antd';
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import LogoImg from "../../assets/najot.jpg";

import {
  FileProtectOutlined,
  TagsOutlined,
  SettingOutlined,
  StockOutlined,
  NotificationOutlined,
  TagOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Header, Sider } = Layout;

interface AdminMenuItem {
  content: string;
  path: string;
  icon: React.ComponentType | string;
}

const Admin: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [selectedKeys, setSelectedKeys] = useState<string>("");
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    const index = admin.findIndex((item) => item.path === pathname);
    if (index !== -1) {
      setSelectedKeys(index.toString());
    }
  }, [pathname]);

  const ChangeLanguage = (value: string) => {
    console.log(value);
  };

  const admin: AdminMenuItem[] = [
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
      content: "Brand-Category",
      path: "/admin-layout/brands-category",
      icon: TagsOutlined,
    },
    {
      content: "Ads",
      path: "/admin-layout/ads",
      icon: NotificationOutlined,
    },
    {
      content: "Stock",
      path: "/admin-layout/stock",
      icon: StockOutlined,
    },
    {
      content: "Setting",
      path: "/admin-layout/setting",
      icon: SettingOutlined,
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const handleLogout = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    navigate('/');
    setIsModalVisible(false);
    window.localStorage.removeItem('access_token');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className="min-h-[100vh]">
        <div
          style={{
            height: '58px',
            margin: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <img
            src={LogoImg}
            alt="Logo"
            style={{
              maxWidth: '60px',
              height: '40px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginRight: collapsed ? 0 : '10px',
            }}
          />
          {!collapsed && (
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Najot</span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKeys]}
          items={admin.map((item, index) => ({
            key: index.toString(),
            icon: React.createElement(item.icon as React.ComponentType),
            label: (
              <NavLink
                to={item.path}
                className="text-white hover:text-white focus:text-white"
              >
                {item.content}
              </NavLink>
            ),
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 30,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Space wrap>
            <Select
              defaultValue="en"
              style={{ width: 120 }}
              onChange={(value) => ChangeLanguage(value)}
              options={[
                { value: 'en', label: 'en' },
                { value: 'uz', label: 'uz' },
              ]}
            />
            <Tooltip title="Logout" placement="bottom">
              <Button
                type="primary"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                style={{
                  borderRadius: borderRadiusLG,
                  display: 'flex',
                  alignItems: 'center',
                  height: '40px',
                  padding: '0 16px',
                }}
              />
            </Tooltip>
          </Space>
        </Header>
        <div className="p-3">
          <div
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </div>
      </Layout>

      <Modal
        title="Tasdiqlash"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Hisobingizdan chiqmoqchimisiz?</p>
      </Modal>
    </Layout>
  );
};

export default Admin;
