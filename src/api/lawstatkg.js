import { lawStatKGAPI, log } from './index';

export const lawStatKGService = {

  getCaseLawById: async (caseId) => {
    log.info('[lawStatKGService] getCaseLawById called', { caseId });
    try {
      const response = await lawStatKGAPI.get(`/case-law/${caseId}`);
      log.info('[lawStatKGService] getCaseLawById success', {
        case_id:   response.data.case_id,
        case_name: response.data.case_name,
      });
      return response.data;
    } catch (error) {
      log.error('[lawStatKGService] getCaseLawById failed', {
        caseId,
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to fetch law details';
    }
  },

  retrieveCaseLaw: async (file, topK = 5) => {
    log.info('[lawStatKGService] retrieveCaseLaw called', {
      fileName: file?.name,
      topK,
    });

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });
      formData.append('top_k', String(topK));

      log.info('[lawStatKGService] retrieveCaseLaw → POST /case-law/retrieve');

      const response = await lawStatKGAPI.post('/case-law/retrieve', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      log.info('[lawStatKGService] retrieveCaseLaw success', {
        results_count: response.data.results_count,
        detected_topics: response.data.detected_topics,
      });

      return response.data;
    } catch (error) {
      log.error('[lawStatKGService] retrieveCaseLaw failed:', {
        status: error.response?.status,
        detail: error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to retrieve case laws';
    }
  },

};

export default lawStatKGService;