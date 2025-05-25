
import React from "react";
import ProjectCard from "./ProjectCard";

// --- Fix: Declare the Project type here for type annotation ---
type Project = {
  id: string;
  title: string;
  language: string;
  timeAgo: string;
  status: "Complete" | "Pending";
  thumb: string;
};

// Annotate PROJECTS as Project[] and ensure status is typed as string literals.
const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Product Demo",
    language: "Spanish",
    timeAgo: "2 days ago",
    status: "Complete",
    thumb: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg", // sample
  },
  {
    id: "2",
    title: "Marketing Campaign",
    language: "French",
    timeAgo: "Just now",
    status: "Pending",
    thumb: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "3",
    title: "Tutorial Series",
    language: "Japanese",
    timeAgo: "1 week ago",
    status: "Complete",
    thumb: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "4",
    title: "Customer Testimonial",
    language: "German",
    timeAgo: "3 days ago",
    status: "Complete",
    thumb: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=400&q=80",
  },
];

export default function UploadProjectsSection() {
  return (
    <section className="w-full max-w-7xl mx-auto mt-24 px-4 mb-10">
      <hr className="mb-10 border-[#ECEEF1]" />
      <h2 className="text-2xl font-bold mb-7 font-[Space_Grotesk,sans-serif] text-[#111]">My Projects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
