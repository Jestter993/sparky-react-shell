
import React from "react";
import { Eye, Download } from "lucide-react";
import clsx from "clsx";

type Project = {
  id: string;
  title: string;
  language: string;
  timeAgo: string;
  status: "Complete" | "Pending";
  thumb: string;
};

const STATUS_COLORS = {
  Complete: "bg-[#21c87a] text-white",
  Pending: "bg-[#ffae42] text-white",
};

export default function ProjectCard({
  project,
}: {
  project: Project;
}) {
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
          <button className="flex items-center gap-1 text-[#A3A5BF] hover:text-[#65687e] text-sm transition-colors"
            title="View"
          >
            <Eye size={17} strokeWidth={2} />
          </button>
          <button className="flex items-center gap-1 text-[#A3A5BF] hover:text-[#65687e] text-sm transition-colors"
            title="Download"
          >
            <Download size={17} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
