// Google Analytics helper functions
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

export const analytics = {
  // Track page views
  pageView: (url: string, title: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_title: title,
      });
    }
  },

  // Track custom events
  event: (eventName: string, params?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  },

  // Track user signup
  signup: (method: string) => {
    analytics.event('sign_up', { method });
  },

  // Track user login
  login: (method: string) => {
    analytics.event('login', { method });
  },

  // Track video upload
  videoUpload: (language: string, fileSize?: number) => {
    analytics.event('video_upload', {
      target_language: language,
      file_size: fileSize,
    });
  },

  // Track video download
  videoDownload: (videoId: string, language: string) => {
    analytics.event('video_download', {
      video_id: videoId,
      language,
    });
  },

  // Track CTA clicks
  ctaClick: (ctaName: string, location: string) => {
    analytics.event('cta_click', {
      cta_name: ctaName,
      location,
    });
  },

  // Track pricing plan views
  viewPricing: () => {
    analytics.event('view_pricing');
  },

  // Track feedback submission
  submitFeedback: (feedbackType: string) => {
    analytics.event('submit_feedback', {
      feedback_type: feedbackType,
    });
  },

  // Track video processing status
  videoProcessing: (status: 'started' | 'completed' | 'failed', videoId: string) => {
    analytics.event('video_processing', {
      status,
      video_id: videoId,
    });
  },
};
