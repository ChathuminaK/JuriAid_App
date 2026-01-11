import { orchestratorAPI } from './index';

export const orchestratorService = {
  // Health check
  healthCheck: async () => {
    try {
      const response = await orchestratorAPI.get('/');
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Health check failed';
    }
  },

  // Analyze text (public endpoint - no auth required)
  analyzeText: async (text) => {
    try {
      const response = await orchestratorAPI.post('/api/analyze-text', {
        text,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to analyze text';
    }
  },

  // Upload case document (protected - requires auth)
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

  // Upload case with custom prompt (protected - requires auth)
  uploadCaseWithPrompt: async (file, prompt) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });
      formData.append('prompt', prompt);

      const response = await orchestratorAPI.post('/api/upload-case-with-prompt', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to upload case with prompt';
    }
  },

  // Agent Plan & Run - AI Analysis (protected - requires auth)
  agentPlanRun: async (file, prompt) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });
      formData.append('prompt', prompt);

      const response = await orchestratorAPI.post('/api/agent/plan-run', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw error.response?.data?.detail || 'Failed to run AI analysis';
    }
  },
};

export default orchestratorService;