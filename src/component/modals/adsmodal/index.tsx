import React, { useState, useEffect } from 'react';
import { Drawer, Form, Input, Button, Upload, message, UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import adsService from '../../../service/ads';

interface AdData {
    position: string;
    image?: Blob;
}

interface AdsDrawerProps {
    open: boolean;
    handleClose: () => void;
    refreshData: () => void;
    adItem?: {
        id?: number;
        position?: string;
    } | null;
}

const AdsDrawer: React.FC<AdsDrawerProps> = ({ open, handleClose, refreshData, adItem }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    useEffect(() => {
        if (adItem) {
            form.setFieldsValue({ position: adItem.position });
            // Reset file list only when editing an existing ad
            setFileList([]); 
        } else {
            form.resetFields();
            setFileList([]);
        }
    }, [adItem, form]);

    const handleSubmit = async (values: { position: string }) => {
        const formData = new FormData();
        formData.append('position', values.position);
        if (fileList[0]?.originFileObj) {
            formData.append('image', fileList[0].originFileObj as Blob);
        }

        try {
            if (adItem?.id) {
                await adsService.update(adItem.id, formData);
                message.success("Advertisement updated successfully");
            } else {
                await adsService.create(formData);
                message.success("Advertisement created successfully");
            }
            refreshData();
            handleClose();
        } catch (error) {
            console.error("Error in submission:", error);
            message.error("Error saving advertisement");
        }
    };

    const handleFileChange: UploadProps['onChange'] = (info) => {
        setFileList(info.fileList.length > 0 ? info.fileList : []);
    };

    return (
        <Drawer
            title={adItem ? "Edit Advertisement" : "Add Advertisement"}
            width={720}
            onClose={handleClose}
            open={open}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={adItem ? { position: adItem.position } : {}}
            >
                <Form.Item
                    name="position"
                    label="Position"
                    rules={[{ required: true, message: 'Please input the position!' }]}
                >
                    <Input placeholder="Position" />
                </Form.Item>

                <Form.Item
                    name="image"
                    label="Image"
                    rules={[{ required: true, message: 'Please upload an image!' }]}
                >
                    <Upload
                        onChange={handleFileChange}
                        beforeUpload={() => false}
                        fileList={fileList}
                        listType="picture"
                    >
                        <Button>Click to upload</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {adItem ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Drawer>
    );
};

export default AdsDrawer;
