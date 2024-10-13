import { Button, Form, Input, Modal, message } from "antd";
import { useEffect, useState } from "react";
import subCategoryService from "../../../service/sub_category"; // Adjust your import path accordingly
import { useParams } from "react-router-dom";

interface SubCategory {
    id?: number;
    name: string;
}

interface SubCategoryModalProps {
    open: boolean;
    handleCancel: () => void;
    subCategory: SubCategory | null;
    refreshData: () => void;
}

const SubCategoryModal: React.FC<SubCategoryModalProps> = ({ open, handleCancel, subCategory, refreshData }) => {
    const { id: parent_category_id } = useParams<{ id: string }>(); // parent_category_id ni oling

    const [loading, setLoading] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (subCategory) {
            form.setFieldsValue({
                name: subCategory.name,
            });
        } else {
            form.resetFields(); // Reset fields when opening for a new sub-category
        }
    }, [subCategory, form]);

    const handleSubmit = async (values: { name: string }) => {
        setLoading(true);
        
        try {
            const payload = {
                ...values,
                parent_category_id: parent_category_id ? parseInt(parent_category_id) : undefined,
            };
            
            
            if (subCategory?.id) {
                // Update sub-category
                await subCategoryService.update(subCategory.id, payload);
                message.success("Sub-category updated successfully");
            } else {
                // Create sub-category
                await subCategoryService.create(payload);
                message.success("Sub-category created successfully");
            }
            refreshData(); // Refresh data after create/update
            handleCancel();
        } catch (error) {
            console.error(error);
            message.error("Failed to save sub-category");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal 
            open={open} 
            title={subCategory?.name ? "Edit Sub-category" : "Create Sub-category"} 
            footer={null}
            onCancel={handleCancel}
        >
            <Form
                form={form}
                name="subCategoryForm"
                style={{ width: '100%', marginTop: '20px' }}
                onFinish={handleSubmit}
                layout="vertical"
            >
                <Form.Item
                    label="Sub-category Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the sub-category name" }]}
                >
                    <Input size="large" />
                </Form.Item>

                <Form.Item>
                    <Button
                        size="large"
                        style={{ width: "100%" }}
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                    >
                        {subCategory?.name ? "Update" : "Add"}
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SubCategoryModal;
