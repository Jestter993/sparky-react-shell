import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsDown, Meh, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVideoFeedback } from "@/hooks/useVideoFeedback";
import { toast } from "@/hooks/use-toast";

interface Props {
  videoId: string;
}

export default function TranslationFeedback({ videoId }: Props) {
  const { feedback, submitting, submitFeedback } = useVideoFeedback(videoId);

  const handleRatingSubmit = async (rating: number) => {
    const success = await submitFeedback(rating);
    if (success) {
      toast({
        title: "Thank you!",
        description: "Your feedback has been saved.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

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
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          How was the translation?
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Your feedback helps us improve
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {ratingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = feedback?.rating === option.value;
            
            return (
              <Button
                key={option.value}
                variant="outline"
                onClick={() => handleRatingSubmit(option.value)}
                disabled={submitting}
                className={cn(
                  "flex flex-col h-auto py-4 px-3 transition-all duration-200",
                  option.hoverColor,
                  isSelected && option.activeColor,
                  submitting && "opacity-50 cursor-not-allowed"
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
        
        {feedback && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            You rated this translation as{" "}
            <span className="font-medium">
              {ratingOptions.find(opt => opt.value === feedback.rating)?.label}
            </span>
            . You can change your rating anytime.
          </p>
        )}
      </CardContent>
    </Card>
  );
}