
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Download, Share2, Trash2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import VideoPlayer from "./VideoPlayer";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface VideoResult {
  id: string;
  original_filename: string;
  original_url: string | null;
  localized_url: string | null;
  target_language: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

interface Props {
  videoResult: VideoResult;
  onRefresh: () => void;
}

export default function ResultsContent({ videoResult, onRefresh }: Props) {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const getStatusBadge = () => {
    switch (videoResult.status) {
      case "completed":
        return <Badge className="bg-green-500 text-white">Completed</Badge>;
      case "error":
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500 text-white">Processing</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{videoResult.status}</Badge>;
    }
  };

  const handleDownload = async () => {
    if (!videoResult.localized_url) {
      toast.error("Localized video not available for download");
      return;
    }

    try {
      const response = await fetch(videoResult.localized_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = `localized_${videoResult.original_filename}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Download started");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download video");
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/results/${videoResult.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Share error:", error);
      toast.error("Failed to copy link");
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      
      const { error } = await supabase
        .from("video_processing_results")
        .delete()
        .eq("id", videoResult.id);

      if (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete video");
        return;
      }

      toast.success("Video deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Unexpected delete error:", error);
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  if (videoResult.status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <Card className="p-8 max-w-md text-center">
          <div className="mb-4">{getStatusBadge()}</div>
          <h2 className="text-xl font-semibold text-[#0F1117] mb-2">
            Processing Failed
          </h2>
          <p className="text-[#6B7280] mb-4">
            {videoResult.error_message || "An error occurred during processing"}
          </p>
          <div className="flex gap-3 justify-center">
            <Button 
              variant="outline" 
              onClick={onRefresh}
              className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button 
              onClick={() => navigate("/")}
              className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F1117]">
              Video Results
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-[#6B7280]">
            {videoResult.original_filename} → {videoResult.target_language}
          </p>
        </div>
      </div>

      {/* Video Players */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-[#0F1117] text-center mb-4">
            Original Video
          </h2>
          <VideoPlayer
            videoUrl={videoResult.original_url}
            isOriginal={true}
          />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-[#0F1117] text-center mb-4">
            Localized Video
          </h2>
          <VideoPlayer
            videoUrl={videoResult.localized_url}
            isOriginal={false}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          onClick={handleDownload}
          disabled={!videoResult.localized_url}
          className="bg-[#F97316] hover:bg-[#F97316]/90 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Localized
        </Button>
        
        <Button
          variant="outline"
          onClick={handleShare}
          className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate("/upload")}
          className="border-[#0F1117] text-[#0F1117] hover:bg-[#0F1117]/10"
        >
          Back to Upload
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setDeleteModalOpen(true)}
          className="border-red-500 text-red-500 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Video
        </Button>
      </div>

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDelete}
        loading={deleting}
        filename={videoResult.original_filename}
      />
    </div>
  );
}
