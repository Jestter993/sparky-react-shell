
import React from "react";
import ProjectCard from "./ProjectCard";
import { useUserVideos } from "@/hooks/useUserVideos";

export default function UploadProjectsSection() {
  const { videos, loading, error } = useUserVideos();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">Loading your videos...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">Error: {error}</div>
        </div>
      );
    }

    if (videos.length === 0) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No videos yet</p>
            <p className="text-sm text-gray-400">Upload and localize your first video to see it here</p>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {videos.map((video) => (
          <ProjectCard key={video.id} project={video} />
        ))}
      </div>
    );
  };

  return (
    <section className="w-full px-4 xl:px-[200px] mt-24 mb-10">
      <hr className="mb-10 border-[#ECEEF1]" />
      <h2 className="text-2xl font-bold mb-7 font-[Space_Grotesk,sans-serif] text-[#111]">My Videos</h2>
      {renderContent()}
    </section>
  );
}
