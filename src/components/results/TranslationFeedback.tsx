import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown, Meh, ThumbsUp, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoFeedback } from "@/hooks/useVideoFeedback";
import { toast } from "@/hooks/use-toast";

interface Props {
  videoId: string;
}

export default function TranslationFeedback({ videoId }: Props) {
  const { feedback, submitting, submitFeedback } = useVideoFeedback(videoId);
  const [details, setDetails] = useState("");
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  const handleRatingSubmit = async (rating: number) => {
    const success = await submitFeedback(rating);
    if (success) {
      toast({
        title: "Thank you!",
        description: "Your feedback has been saved.",
      });
      // Show the details form after rating is submitted
      setShowDetailsForm(true);
    } else {
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDetailsSubmit = async () => {
    if (!feedback?.rating || !details.trim()) return;

    setSavingDetails(true);
    const success = await submitFeedback(feedback.rating, details.trim());
    
    if (success) {
      toast({
        title: "Details saved!",
        description: "Thank you for the additional feedback.",
      });
      setShowDetailsForm(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to save details. Please try again.",
        variant: "destructive",
      });
    }
    setSavingDetails(false);
  };

  const hasRating = feedback !== null;
  const hasDetails = feedback?.details && feedback.details.length > 0;

  const ratingOptions = [
    {
      value: 1,
      label: "Bad",
      icon: ThumbsDown,
      description: "Not good",
      color: "text-destructive",
      hoverColor: "hover:bg-destructive/10",
      activeColor: "bg-destructive/20 border-destructive",
    },
    {
      value: 2,
      label: "Average",
      icon: Meh,
      description: "Okay",
      color: "text-muted-foreground",
      hoverColor: "hover:bg-muted/50",
      activeColor: "bg-muted border-muted-foreground",
    },
    {
      value: 3,
      label: "Good",
      icon: ThumbsUp,
      description: "Great!",
      color: "text-green-600",
      hoverColor: "hover:bg-green-50",
      activeColor: "bg-green-100 border-green-600",
    },
  ];

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
      <div>
        <div className="grid grid-cols-3 gap-3">
          {ratingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = feedback?.rating === option.value;
            const hasSubmitted = feedback !== null;
            
            return (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => handleRatingSubmit(option.value)}
                disabled={submitting || hasSubmitted}
                className={cn(
                  "flex flex-col h-auto py-4 px-3 transition-all duration-200",
                  !hasSubmitted && option.hoverColor,
                  isSelected && option.activeColor,
                  (submitting || hasSubmitted) && "opacity-50 cursor-not-allowed"
                )}
              >
                <Icon 
                  className={cn(
                    "w-6 h-6 mb-2",
                    isSelected ? option.color : "text-muted-foreground"
                  )} 
                />
                <span className={cn(
                  "text-sm font-medium",
                  isSelected ? option.color : "text-muted-foreground"
                )}>
                  {option.label}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </span>
              </Button>
            );
          })}
        </div>
        {/* Details Form - Show after rating is submitted */}
        {hasRating && (showDetailsForm || hasDetails) && (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <h4 className="text-sm font-medium text-foreground">
                Want to add more details? (Optional)
              </h4>
              <p className="text-xs text-muted-foreground">
                Help us understand your experience better
              </p>
            </div>
            
            {!hasDetails && showDetailsForm && (
              <div className="space-y-3">
                <Textarea
                  placeholder="Tell us more about your experience with this translation..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="min-h-[80px] resize-none"
                  maxLength={500}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {details.length}/500 characters
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDetailsForm(false)}
                    className="flex-1"
                  >
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleDetailsSubmit}
                    disabled={!details.trim() || savingDetails}
                    className="flex-1"
                  >
                    {savingDetails ? (
                      "Saving..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Save Details
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
            
            {hasDetails && (
              <div className="bg-muted/30 rounded-lg p-3 border">
                <p className="text-sm text-muted-foreground mb-1">Your additional feedback:</p>
                <p className="text-sm text-foreground">{feedback?.details}</p>
              </div>
            )}
          </div>
        )}
        
        {hasRating && !showDetailsForm && !hasDetails && (
          <div className="mt-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetailsForm(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              Add more details
            </Button>
          </div>
        )}

        {hasRating && !hasDetails && !showDetailsForm && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Thank you for your feedback!
          </p>
        )}
      </div>
    </div>
  );
}