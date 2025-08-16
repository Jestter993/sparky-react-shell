import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export interface VideoFeedback {
  id: string;
  user_id: string;
  video_id: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

export function useVideoFeedback(videoId: string) {
  const { isAuthenticated } = useAuthStatus();
  const [feedback, setFeedback] = useState<VideoFeedback | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // For now, we'll skip fetching existing feedback since table types aren't available
  // The feedback will be managed through the edge function responses
  const fetchFeedback = async () => {
    // Placeholder for future implementation when types are updated
    console.log('Feedback fetch not implemented yet - will be available after database migration');
  };

  // Submit feedback
  const submitFeedback = async (rating: number): Promise<boolean> => {
    if (!isAuthenticated || !videoId) return false;

    try {
      setSubmitting(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No session found');
        return false;
      }

      const response = await supabase.functions.invoke('submit-feedback', {
        body: {
          video_id: videoId,
          rating: rating,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        console.error('Error submitting feedback:', response.error);
        return false;
      }

      // Update local state with successful submission
      if (response.data?.feedback) {
        setFeedback({
          id: response.data.feedback.id,
          user_id: response.data.feedback.user_id,
          video_id: response.data.feedback.video_id,
          rating: response.data.feedback.rating,
          created_at: response.data.feedback.created_at,
          updated_at: response.data.feedback.updated_at,
        });
      }
      return true;
    } catch (error) {
      console.error('Unexpected error submitting feedback:', error);
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Skip fetching for now - will be implemented when database types are updated
  useEffect(() => {
    // fetchFeedback();
  }, [videoId, isAuthenticated]);

  return {
    feedback,
    submitting,
    submitFeedback,
    refetch: fetchFeedback,
  };
}