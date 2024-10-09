import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FileProtectOutlined,
  AppstoreOutlined,
  TagOutlined,
  TagsOutlined,
  NotificationOutlined,
  StockOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import Logov from '../../assets/najot.jpg';
import { Outlet,useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const Admin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate(); // navigate hooki

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} className="min-h-[100vh]">
        <div style={{ height: '48px', margin: '16px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <img
            src={Logov}
            alt="Logo"
            style={{
              maxWidth: collapsed ? '62px' : '70px',
              height: 'auto',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          {!collapsed && (
            <span style={{ marginLeft: '12px', fontSize: '18px', fontWeight: 'bold', color: 'white' }}>Najot</span>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          onClick={({ key }) => {
            // Menyu elementi bosilganda yo'naltirish
            if (key === '2') navigate('/admin-layout/category');
            if (key === '1') navigate('/admin-layout/product');
            // Boshqa yo'llarni shu yerda qo'shing
          }}
          items={[
            {
              key: '1',
              icon: <FileProtectOutlined />,
              label: 'Product',
            },
            {
              key: '2',
              icon: <AppstoreOutlined />,
              label: 'Category',
            },
            {
              key: '3',
              icon: <TagOutlined/>,
              label: 'Brands',
            },
            {
              key: '4',
              icon: <TagsOutlined/>,
              label: 'Brands Category',
            },
            {
              key: '5',
              icon: <NotificationOutlined/>,
              label: 'ADS',
            },
            {
              key: '6',
              icon: <StockOutlined/>,
              label: 'Stock',
            },
            {
              key: '7',
              icon: <SettingOutlined  />,
              label: 'Setting',
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
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
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Admin;
