import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message, Upload, Select, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import BrandService from '../../../service/brand';
import CategoryService from '../../../service/category';

interface CategoryType {
  id: number;
  name: string;
}

interface BrandType {
  id: number;
  name: string;
  description?: string;
  image?: string;
  category_id?: number;
}

interface BrandModalProps {
  open: boolean;
  handleCancel: () => void;
  editingBrand: BrandType | null;
  refreshData: () => Promise<void>;
}

const getBase64 = (file: File) => 
  new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BrandModal: React.FC<BrandModalProps> = ({
  open,
  handleCancel,
  editingBrand,
  refreshData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryService.get();
        setCategories(res?.data?.data?.categories || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (open) {
      fetchCategories();
      if (editingBrand) {
        form.setFieldsValue({
          name: editingBrand.name,
          description: editingBrand.description,
          category_id: editingBrand.category_id,
        });
        setImageUrl(editingBrand.image || null);
      } else {
        form.resetFields();
        setImageUrl(null);
        setFileList([]);
      }
    }
  }, [editingBrand, form, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('category_id', values.category_id.toString());
      if (fileList[0]?.originFileObj) {
        formData.append('file', fileList[0].originFileObj);
      }

      setLoading(true);
      if (editingBrand) {
        await BrandService.update(editingBrand.id, formData);
        message.success('Brand updated successfully');
      } else {
        await BrandService.create(formData);
        message.success('Brand created successfully');
      }
      refreshData();
      handleCancel();
    } catch (error) {
      console.error('Error saving brand:', error);
      message.error('Failed to save brand');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
    if (newFileList[0]?.originFileObj) {
      const previewUrl = await getBase64(newFileList[0].originFileObj);
      setImageUrl(previewUrl as string);
    }
  };

  return (
    <Modal
      open={open}
      title={editingBrand ? 'Edit Brand' : 'Create Brand'}
      footer={null}
      onCancel={handleCancel}
    >
      <Form form={form} name="brandForm" onFinish={handleSubmit} layout="vertical">
        <Form.Item label="Brand Name" name="name" rules={[{ required: true, message: 'Please enter the brand name' }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item label="Image" name="image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleImageChange}
            beforeUpload={() => false}
          >
            {fileList.length < 1 && <UploadOutlined />}
          </Upload>
          {imageUrl && <Image src={imageUrl} alt="Uploaded" width={100} style={{ marginTop: '10px' }} />}
        </Form.Item>

        <Form.Item label="Category" name="category_id" rules={[{ required: true, message: 'Please select a category' }]}>
          <Select options={categories.map((cat) => ({ label: cat.name, value: cat.id }))} size="large" />
        </Form.Item>

        <Form.Item>
          <Button size="large" type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            {editingBrand ? 'Update' : 'Add'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BrandModal;
