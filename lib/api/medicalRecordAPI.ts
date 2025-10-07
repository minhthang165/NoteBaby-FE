import axiosClient from './axiosClient';


interface MedicalRecord {
  data: MedicalRecord;
  _id: string;
  recordType: 'illness' | 'vaccination';
  name: string;
  recordDate: string;
  location?: string;
  notes?: string;
  childId: any; 
}


interface GetAllRecordsParams {
  childId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const medicalRecordsAPI = {
 
  getAll: (params?: GetAllRecordsParams): Promise<{ data: MedicalRecord[], total: number }> => {
    return axiosClient.get('/medical-records', { params }).then(res => res.data.data);
  },


  getById: (id: string): Promise<MedicalRecord> => {
    return axiosClient.get(`/medical-records/${id}`).then(res => res.data.data);
  },


  create: (data: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    return axiosClient.post('/medical-records', data).then(res => res.data.data);
  },


  update: (id: string, data: Partial<MedicalRecord>): Promise<MedicalRecord> => {
    return axiosClient.patch(`/medical-records/${id}`, data).then(res => res.data.data);
  },

  
  remove: (id: string): Promise<MedicalRecord> => {
    return axiosClient.delete(`/medical-records/${id}`).then(res => res.data.data);
  },
};