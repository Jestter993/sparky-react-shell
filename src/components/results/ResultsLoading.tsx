
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import LandingNav from "@/components/Landing/LandingNav";

export default function ResultsLoading() {
  return (
    <main className="min-h-screen bg-[#F5F8FA] font-inter">
      <LandingNav />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-5 w-64" />
          </div>
        </div>

        {/* Video Players Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="h-80 border rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="w-full h-48" />
          </div>
          <div className="h-80 border rounded-lg p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="w-full h-48" />
          </div>
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-36" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </main>
  );
}
