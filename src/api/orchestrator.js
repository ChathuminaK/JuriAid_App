import { orchestratorAPI } from './index';

export const orchestratorService = {
  // Upload case document
  uploadCase: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });

      const response = await orchestratorAPI.post('/api/upload-case', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to upload case';
    }
  },

  // Add more orchestrator endpoints as needed
};

export default orchestratorService;