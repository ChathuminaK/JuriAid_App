import { orchestratorAPI, log } from './index';

const reportsAPI = {
  /**
   * Save a report to backend (tied to logged-in user via JWT).
   * @param {object} analysisResult - the full result from /api/analyze
   * @returns {Promise<object>} { saved: true, analysis_id }
   */
  saveReport: async (analysisResult) => {
    log.info('[reportsAPI] saveReport called', { analysis_id: analysisResult.analysis_id });
    try {
      const response = await orchestratorAPI.post('/api/reports/save', analysisResult);
      log.info('[reportsAPI] saveReport success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[reportsAPI] saveReport failed:', {
        status: error.response?.status,
        detail: error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to save report';
    }
  },

  /**
   * Get all saved reports for the logged-in user.
   * @returns {Promise<array>} Array of saved reports
   */
  getReports: async () => {
    log.info('[reportsAPI] getReports called');
    try {
      const response = await orchestratorAPI.get('/api/reports');
      log.info('[reportsAPI] getReports success, count:', response.data.count);
      return response.data.reports || [];
    } catch (error) {
      log.error('[reportsAPI] getReports failed:', {
        status: error.response?.status,
        detail: error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to load reports';
    }
  },

  /**
   * Delete a saved report by analysis_id.
   * @param {string} analysisId
   * @returns {Promise<object>} { deleted: boolean, analysis_id }
   */
  deleteReport: async (analysisId) => {
    log.info('[reportsAPI] deleteReport called', { analysisId });
    try {
      const response = await orchestratorAPI.delete(`/api/reports/${analysisId}`);
      log.info('[reportsAPI] deleteReport success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[reportsAPI] deleteReport failed:', {
        analysisId,
        status: error.response?.status,
        detail: error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to delete report';
    }
  },
};

export default reportsAPI;