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

  getAmendments: async () => {
    log.info('[lawStatKGService] getAmendments called');
    try {
      const response = await lawStatKGAPI.get('/amendments');
      log.info('[lawStatKGService] getAmendments success', { count: response.data?.count });
      return response.data;
    } catch (error) {
      log.error('[lawStatKGService] getAmendments failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to fetch amendments';
    }
  },

  searchLaws: async ({ query, jurisdiction = null, as_of_date = null, bm25_candidates = 80, alpha = 0.65, beta = 0.35, min_match_ratio = 0.5, min_semantic_cosine = 0.20 }) => {
    log.info('[lawStatKGService] searchLaws called', { query });
    try {
      const response = await lawStatKGAPI.post('/Lawsearch', {
        query,
        jurisdiction,
        as_of_date,
        bm25_candidates,
        alpha,
        beta,
        min_match_ratio,
        min_semantic_cosine,
      });
      log.info('[lawStatKGService] searchLaws success', { count: response.data?.length });
      return response.data;
    } catch (error) {
      log.error('[lawStatKGService] searchLaws failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to search laws';
    }
  },

};

export default lawStatKGService;