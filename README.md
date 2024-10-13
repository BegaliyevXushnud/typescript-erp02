import { useEffect, useState } from "react"
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