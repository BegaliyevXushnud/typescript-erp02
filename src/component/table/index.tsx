
import { Table, TablePaginationConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface TableComponentProps<T> {
    columns: ColumnsType<T>;
    data: T[];
    pagination: TablePaginationConfig;
    handleChange: (pagination: TablePaginationConfig) => void;
}

const Index = <T extends object>({ columns, data, pagination, handleChange }: TableComponentProps<T>) => (
    <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={(pagination) => handleChange(pagination)}
        bordered
        rowKey={(record) => (record as any).id || (record as any).key} // rowKey to'g'ri ishlashini ta'minlash uchun
    />
);

export default Index;
