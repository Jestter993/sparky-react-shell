
import React, { useState } from "react";
import { Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import DeleteConfirmModal from "../results/DeleteConfirmModal";

type Project = {
  id: string;
  title: string;
  language: string;
  timeAgo: string;
  status: "Complete" | "Pending" | "Error";
  thumb: string;
  original_url?: string | null;
  localized_url?: string | null;
};

const STATUS_COLORS = {
  Complete: "bg-[#21c87a] text-white",
  Pending: "bg-[#ffae42] text-white",
  Error: "bg-[#ef4444] text-white",
};

export default function ProjectCard({
  project,
  onDelete,
}: {
  project: Project;
  onDelete?: (id: string) => void;
}) {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleCardClick = () => {
    if (canView) {
      navigate(`/results/${project.id}`);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (project.localized_url) {
      const link = document.createElement('a');
      link.href = project.localized_url;
      link.download = `${project.title}_${project.language}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setDeleteLoading(true);
    try {
      await onDelete(project.id);
      setShowDeleteModal(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  const canView = project.status === "Complete" || project.status === "Error";
  const canDownload = project.status === "Complete" && project.localized_url;
  const canDelete = onDelete !== undefined;

  return (
    <div 
      className={clsx(
        "rounded-xl border border-[#E7EAF2] bg-white drop-shadow-sm p-0 w-full max-w-xs flex flex-col transition-all duration-200",
        canView ? "cursor-pointer hover:shadow-xl hover:scale-[1.02]" : "hover:shadow-lg"
      )}
      onClick={handleCardClick}
      role={canView ? "button" : undefined}
      tabIndex={canView ? 0 : undefined}
      aria-label={canView ? `View ${project.title}` : undefined}
      onKeyDown={(e) => {
        if (canView && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      <div className="relative">
        <img
          src={project.thumb}
          alt={`Thumbnail for ${project.title}`}
          className="w-full h-[120px] object-cover rounded-t-xl"
        />
        <span
          className={clsx(
            "absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold",
            STATUS_COLORS[project.status]
          )}
        >
          {project.status}
        </span>
        
        {/* Delete button positioned in top-left corner */}
        {canDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 h-8 w-8 bg-black/20 hover:bg-black/40 text-white hover:text-white"
            onClick={handleDeleteClick}
            title="Delete video"
          >
            <Trash2 size={14} strokeWidth={2} />
          </Button>
        )}
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <div className="font-semibold text-[16px] mb-1">{project.title}</div>
        <div className="text-sm text-[#666] mb-4">{project.language} · {project.timeAgo}</div>
        
        {/* Download button - prominent secondary button */}
        <div className="mt-auto">
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={handleDownload}
            disabled={!canDownload}
            title={canDownload ? "Download video" : "Video not available for download"}
          >
            <Download size={16} strokeWidth={2} />
            Download
          </Button>
        </div>
      </div>
      
      <DeleteConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDelete}
        loading={deleteLoading}
        filename={project.title}
      />
    </div>
  );
}
