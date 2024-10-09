// GlobalPopconfirm.tsx
import React, { ReactNode } from 'react';
import { Popconfirm } from 'antd';

interface GlobalPopconfirmProps {
    title: ReactNode; // Popconfirm uchun ko'rsatiladigan matn
    onConfirm: () => void; // Tasdiqlash funksiyasi
    children: ReactNode; // Popconfirm ichidagi elementlar
}

const GlobalPopconfirm: React.FC<GlobalPopconfirmProps> = ({ title, onConfirm, children }) => {
    return (
        <Popconfirm
            title={title}
            onConfirm={onConfirm}
            okText="Yes"
            cancelText="No"
        >
            {children}
        </Popconfirm>
    );
};

export default GlobalPopconfirm;
