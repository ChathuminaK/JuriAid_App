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

};

export default pastCaseService;