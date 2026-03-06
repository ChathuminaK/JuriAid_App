import { orchestratorAPI, log } from './index';

export const orchestratorService = {

  // ── Health Check ──────────────────────────────────────────────────────────
  healthCheck: async () => {
    log.info('[orchestratorService] healthCheck called');
    try {
      const response = await orchestratorAPI.get('/health');
      log.info('[orchestratorService] healthCheck success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[orchestratorService] healthCheck failed:', error.message);
      throw error.response?.data?.detail || 'Health check failed';
    }
  },

  // ── Full Case Analysis Pipeline ───────────────────────────────────────────
  // POST /api/analyze  (multipart: file + prompt)
  // Returns: { analysis_id, status, case_summary, similar_cases,
  //            relevant_laws, generated_questions, metadata, created_at,
  //            processing_time_seconds }
  analyzeCase: async (file, prompt = 'Analyze this Sri Lankan divorce case') => {
    log.info('[orchestratorService] analyzeCase called', {
      fileName: file?.name,
      fileType: file?.type,
      fileSize: file?.size,
      prompt,
    });

    try {
      const formData = new FormData();
      formData.append('file', {
        uri:  file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });
      formData.append('prompt', prompt);

      log.info('[orchestratorService] analyzeCase → POST /api/analyze');

      const response = await orchestratorAPI.post('/api/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        // Give user feedback on upload progress
        onUploadProgress: (progressEvent) => {
          const pct = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          log.info(`[orchestratorService] upload progress: ${pct}%`);
        },
      });

      log.info('[orchestratorService] analyzeCase success', {
        analysis_id:              response.data.analysis_id,
        status:                   response.data.status,
        similar_cases_count:      response.data.similar_cases?.length,
        relevant_laws_count:      response.data.relevant_laws?.length,
        generated_questions_count:response.data.generated_questions?.length,
        processing_time_seconds:  response.data.processing_time_seconds,
        saved_for_reference:      response.data.metadata?.saved_for_reference,
      });

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const detail = error.response?.data?.detail;

      log.error('[orchestratorService] analyzeCase failed', {
        status,
        detail,
        message: error.message,
      });

      // Surface structured error objects (e.g. 422 invalid case type)
      if (detail && typeof detail === 'object') throw detail;
      throw detail || 'Failed to analyze case';
    }
  },

  // ── Save Case Only (No Analysis) ─────────────────────────────────────────
  // POST /api/cases/save  (multipart: file only)
  saveCase: async (file) => {
    log.info('[orchestratorService] saveCase called', {
      fileName: file?.name,
      fileType: file?.type,
    });

    try {
      const formData = new FormData();
      formData.append('file', {
        uri:  file.uri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });

      log.info('[orchestratorService] saveCase → POST /api/cases/save');

      const response = await orchestratorAPI.post('/api/cases/save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      log.info('[orchestratorService] saveCase success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[orchestratorService] saveCase failed:', {
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to save case';
    }
  },

  // ── Memory Health Check ───────────────────────────────────────────────────
  memoryHealthCheck: async () => {
    log.info('[orchestratorService] memoryHealthCheck called');
    try {
      const response = await orchestratorAPI.get('/api/memory/health');
      log.info('[orchestratorService] memoryHealthCheck success:', response.data);
      return response.data;
    } catch (error) {
      log.error('[orchestratorService] memoryHealthCheck failed:', error.message);
      throw error.response?.data?.detail || 'Memory health check failed';
    }
  },

  // ── Get Session History ───────────────────────────────────────────────────
  getSessionHistory: async (sessionId) => {
    log.info('[orchestratorService] getSessionHistory called', { sessionId });
    try {
      const response = await orchestratorAPI.get(`/api/memory/session/${sessionId}`);
      log.info('[orchestratorService] getSessionHistory success:', {
        sessionId,
        dataLength: JSON.stringify(response.data).length,
      });
      return response.data;
    } catch (error) {
      log.error('[orchestratorService] getSessionHistory failed:', {
        sessionId,
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to get session history';
    }
  },

  // ── Clear Session History ─────────────────────────────────────────────────
  clearSessionHistory: async (sessionId) => {
    log.info('[orchestratorService] clearSessionHistory called', { sessionId });
    try {
      const response = await orchestratorAPI.delete(`/api/memory/session/${sessionId}`);
      log.info('[orchestratorService] clearSessionHistory success:', { sessionId });
      return response.data;
    } catch (error) {
      log.error('[orchestratorService] clearSessionHistory failed:', {
        sessionId,
        status:  error.response?.status,
        detail:  error.response?.data?.detail,
        message: error.message,
      });
      throw error.response?.data?.detail || 'Failed to clear session history';
    }
  },
};

export default orchestratorService;