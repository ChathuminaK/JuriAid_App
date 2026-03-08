import { pastCaseAPI, log } from './index';

export const pastCaseService = {

  getCaseById: async (caseId) => {
    log.info('[pastCaseService] getCaseById called', { caseId });
    try {
      const response = await pastCaseAPI.get(`/case/${caseId}`);
      log.info('[pastCaseService] getCaseById success', {
        case_id:   response.data.case_id,
        case_name: response.data.case_name,
      });
      return response.data;
    } catch (error) {
      log.error('[pastCaseService] getCaseById failed', {
        caseId,
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to fetch case details';
    }
  },

  searchSimilarCases: async (file) => {
    log.info('[pastCaseService] searchSimilarCases called', {
      fileName: file?.name,
      fileType: file?.type,
    });

    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });

      log.info('[pastCaseService] searchSimilarCases → POST /search');

      const response = await pastCaseAPI.post('/search', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      log.info('[pastCaseService] searchSimilarCases success', {
        similar_cases_count: response.data.similar_cases?.length,
      });

      return response.data;
    } catch (error) {
      log.error('[pastCaseService] searchSimilarCases failed:', {
        status: error.response?.status,
        detail: error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to search similar cases';
    }
  },

};

export default pastCaseService;