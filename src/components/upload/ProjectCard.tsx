
import React, { useState } from "react";
import { Eye, Download, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
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

  const handleView = () => {
    navigate(`/results/${project.id}`);
  };

  const handleDownload = () => {
    if (project.localized_url) {
      const link = document.createElement('a');
      link.href = project.localized_url;
      link.download = `${project.title}_${project.language}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
    <div className="rounded-xl border border-[#E7EAF2] bg-white drop-shadow-sm p-0 w-full max-w-xs flex flex-col transition-shadow hover:shadow-xl">
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
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <div className="font-semibold text-[16px] mb-1">{project.title}</div>
        <div className="text-sm text-[#666] mb-4">{project.language} · {project.timeAgo}</div>
        <div className="flex gap-3 mt-auto">
          <button 
            className={clsx(
              "flex items-center gap-1 text-sm transition-colors",
              canView 
                ? "text-[#A3A5BF] hover:text-[#65687e] cursor-pointer" 
                : "text-gray-300 cursor-not-allowed"
            )}
            title={canView ? "View" : "Processing..."}
            onClick={canView ? handleView : undefined}
            disabled={!canView}
          >
            <Eye size={17} strokeWidth={2} />
          </button>
          <button 
            className={clsx(
              "flex items-center gap-1 text-sm transition-colors",
              canDownload 
                ? "text-[#A3A5BF] hover:text-[#65687e] cursor-pointer" 
                : "text-gray-300 cursor-not-allowed"
            )}
            title={canDownload ? "Download" : "Not available"}
            onClick={canDownload ? handleDownload : undefined}
            disabled={!canDownload}
          >
            <Download size={17} strokeWidth={2} />
          </button>
          {canDelete && (
            <button 
              className="flex items-center gap-1 text-sm transition-colors text-[#A3A5BF] hover:text-red-500 cursor-pointer"
              title="Delete video"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 size={17} strokeWidth={2} />
            </button>
          )}
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
