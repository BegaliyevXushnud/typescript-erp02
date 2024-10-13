import https from './config';
import { AxiosResponse } from 'axios';

interface AdData {
    id?: number;
    position?: string;
    image?: string;
}

const adsService = {
    create: (data: FormData): Promise<AxiosResponse<AdData>> => https.post('/ads/create', data),
    getAll: (params: object): Promise<AxiosResponse<{ data: AdData[]; total: number }>> => https.get('/ads', { params }),
    getById: (id: number): Promise<AxiosResponse<AdData>> => https.get(`/ads/${id}`),
    update: (id: number, data: FormData): Promise<AxiosResponse<AdData>> => https.put(`/ads/update/${id}`, data),
    delete: (id: number): Promise<AxiosResponse<void>> => https.delete(`/ads/delete/${id}`),
};

export default adsService;
