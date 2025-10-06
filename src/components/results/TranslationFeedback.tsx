import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown, Meh, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoFeedback } from "@/hooks/useVideoFeedback";
import { toast } from "@/hooks/use-toast";
import { analytics } from "@/utils/analytics";

interface Props {
  videoId: string;
  videoName: string;
}

export default function TranslationFeedback({ videoId, videoName }: Props) {
  const { feedback, submitting, submitFeedback } = useVideoFeedback(videoId);
  const [details, setDetails] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  const handleRatingSubmit = async (rating: number) => {
    setSelectedRating(rating);
    
    // Submit feedback immediately without details
    const success = await submitFeedback(rating);
    
    if (success) {
      // Fire analytics immediately
      analytics.submitFeedback('video_rating', videoId, videoName);
      
      // Show details form for optional additional feedback
      setTimeout(() => setShowDetailsForm(true), 150);
    } else {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDetailsSubmit = async () => {
    if (!selectedRating || submitting) return;

    // Update with details (details are optional now)
    const success = await submitFeedback(selectedRating, details.trim() || undefined);
    
    if (success) {
      setIsCompleted(true);
      toast({
        title: "Success",
        description: "Thank you for the additional details!",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const ratingOptions = [
    {
      value: 1,
      label: "Not good",
      icon: ThumbsDown,
      color: "text-destructive",
      hoverColor: "hover:bg-destructive/10",
    },
    {
      value: 2,
      label: "Average",
      icon: Meh,
      color: "text-muted-foreground",
      hoverColor: "hover:bg-muted/50",
    },
    {
      value: 3,
      label: "Good",
      icon: ThumbsUp,
      color: "text-green-600",
      hoverColor: "hover:bg-green-50",
    },
  ];

  const selectedOption = ratingOptions.find(option => option.value === selectedRating);
  const hasSubmittedRating = selectedRating !== null;
  const isSubmitDisabled = submitting;

  // Final completed state
  if (isCompleted && selectedOption) {
    const Icon = selectedOption.icon;
    return (
      <div className="max-w-xl mx-auto">
        <div className={cn(
          "w-full p-6 border-2 rounded-2xl text-center transition-all duration-300",
          selectedOption.value === 1 && "border-destructive/20 bg-destructive/5",
          selectedOption.value === 2 && "border-muted bg-muted/20", 
          selectedOption.value === 3 && "border-green-200 bg-green-50"
        )}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Icon className={cn("w-6 h-6", selectedOption.color)} />
          <h3 className="text-lg font-semibold text-foreground">
            {selectedOption.label}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Thank you for your feedback it means a lot
        </p>
        </div>
      </div>
    );
  }

  // Details input state (after rating selected) - Expanded Container
  if (hasSubmittedRating && selectedOption && showDetailsForm) {
    const Icon = selectedOption.icon;
    return (
      <div className="max-w-xl mx-auto">
        <div className={cn(
          "w-full p-6 border-2 rounded-2xl transition-all duration-300 animate-fade-in",
          selectedOption.value === 1 && "border-destructive/20 bg-destructive/5",
          selectedOption.value === 2 && "border-muted bg-muted/20", 
          selectedOption.value === 3 && "border-green-200 bg-green-50"
        )}>
        {/* Header with Icon and Rating Text */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <Icon className={cn("w-6 h-6", selectedOption.color)} />
          <span className="text-lg font-semibold text-foreground">
            {selectedOption.label}
          </span>
        </div>

        {/* Form Content */}
        <div className="space-y-4">
          <Textarea
            placeholder="Want to tell us more? (Optional)"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="min-h-[100px] resize-none"
            autoFocus
          />
          <Button
            onClick={handleDetailsSubmit}
            disabled={isSubmitDisabled}
            className="w-full"
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
        </div>
      </div>
    );
  }

  // Initial rating selection state
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center pb-4">
        <h3 className="text-lg font-semibold text-foreground">
          How was the translation?
        </h3>
        <p className="text-sm text-muted-foreground">
          Your feedback helps us improve
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {ratingOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedRating === option.value;
          const shouldShow = !hasSubmittedRating || isSelected;
          
          return (
            <Button
              key={option.value}
              variant="outline"
              onClick={() => handleRatingSubmit(option.value)}
              disabled={submitting}
              className={cn(
                "flex flex-col h-auto py-4 px-3 transition-all duration-300",
                option.hoverColor,
                submitting && "opacity-50 cursor-not-allowed",
                !shouldShow && "opacity-0 scale-95 pointer-events-none",
                shouldShow && "opacity-100 scale-100"
              )}
            >
              <Icon 
                className={cn(
                  "w-6 h-6 mb-2",
                  "text-muted-foreground"
                )} 
              />
              <span className="text-sm font-medium text-muted-foreground">
                {option.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}