import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsDown, Meh, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoFeedback } from "@/hooks/useVideoFeedback";
import { toast } from "@/hooks/use-toast";

interface Props {
  videoId: string;
}

export default function TranslationFeedback({ videoId }: Props) {
  const { feedback, submitting, submitFeedback } = useVideoFeedback(videoId);
  const [details, setDetails] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleRatingSubmit = async (rating: number) => {
    setSelectedRating(rating);
    const success = await submitFeedback(rating);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive",
      });
      setSelectedRating(null);
    }
  };

  const handleDetailsSubmit = async () => {
    if (!selectedRating || submitting) return;

    const success = await submitFeedback(selectedRating, details.trim());
    
    if (success) {
      setIsCompleted(true);
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

  // Final completed state
  if (isCompleted && selectedOption) {
    const Icon = selectedOption.icon;
    return (
      <div className="max-w-md mx-auto text-center">
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
    );
  }

  // Details input state (after rating selected)
  if (hasSubmittedRating && selectedOption) {
    const Icon = selectedOption.icon;
    return (
      <div className="max-w-md mx-auto">
        <div className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon className={cn("w-6 h-6", selectedOption.color)} />
            <h3 className="text-lg font-semibold text-foreground">
              {selectedOption.label}
            </h3>
          </div>
        </div>
        <div className="space-y-4">
          <Textarea
            placeholder="We would love to hear more about your experience"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button
            onClick={handleDetailsSubmit}
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
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
          
          return (
            <Button
              key={option.value}
              variant="outline"
              onClick={() => handleRatingSubmit(option.value)}
              disabled={submitting}
              className={cn(
                "flex flex-col h-auto py-4 px-3 transition-all duration-200",
                option.hoverColor,
                submitting && "opacity-50 cursor-not-allowed"
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