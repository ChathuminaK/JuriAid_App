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

};

export default lawStatKGService;