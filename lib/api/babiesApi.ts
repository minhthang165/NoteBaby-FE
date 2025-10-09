import axiosClient from './axiosClient';


interface Baby {
  id(id: any): unknown;
  _id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  parentId: string; 
}

export const babiesAPI = {
  
  getAll: (params?: { 
    searchPhase?: string;
    page?: number;
    limit?: number;
    parentId?: string;
  }): Promise<{
    data: any; total: number; babies: Baby[] 
}> => {
    return axiosClient.get('/babies', { params }).then(res => res.data.data);
  },

  getById: (id: string): Promise<Baby> => {
    return axiosClient.get(`/babies/${id}`).then(res => res.data.data);
  },

  create: (data: Partial<Baby>): Promise<Baby> => {
    return axiosClient.post('/babies', data).then(res => res.data.data);
  },
  update: (id: string, data: Partial<Baby>): Promise<Baby> => {
    return axiosClient.patch(`/babies/${id}`, data).then(res => res.data.data);
  },
  delete: (id: string): Promise<any> => {
    return axiosClient.delete(`/babies/${id}`).then(res => res.data);
  }
};