import { Table } from 'antd';
import {  TablePaginationConfig } from 'antd/es/table';
import { AnyObject } from 'antd/es/_util/type';

type TablePropsType = {
  columns: any[];
  data: AnyObject[] | undefined;
  pagination: false | TablePaginationConfig | undefined;
  handleChange: (pagination: TablePaginationConfig) => void;
};

const Index = ({ columns, data, handleChange, pagination }: TablePropsType) => (
  <Table
    columns={columns}
    dataSource={data}
    pagination={pagination}
    onChange={(pagination) => handleChange(pagination)}
  />
);

export default Index;
