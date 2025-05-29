
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LandingNav from "@/components/Landing/LandingNav";

interface Props {
  error: string;
}

export default function ResultsError({ error }: Props) {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#F5F8FA] font-inter">
      <LandingNav />
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <Card className="p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-[#0F1117] mb-2">
            {error === "Video not found" ? "Video Not Found" : "Something Went Wrong"}
          </h2>
          <p className="text-[#6B7280] mb-6">
            {error === "Video not found" 
              ? "The video you're looking for doesn't exist or has been removed."
              : error
            }
          </p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    </main>
  );
}
