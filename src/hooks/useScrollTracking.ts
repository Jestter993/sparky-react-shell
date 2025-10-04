import { useEffect, useRef } from 'react';
import { analytics } from '@/utils/analytics';

const SECTIONS = [
  { name: 'hero', order: 1 },
  { name: 'demo', order: 2 },
  { name: 'features', order: 3 },
  { name: 'how_it_works', order: 4 },
  { name: 'who_its_for', order: 5 },
  { name: 'testimonials', order: 6 },
  { name: 'final_cta', order: 7 },
] as const;

export const useScrollTracking = () => {
  const trackedSections = useRef(new Set<string>());

  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const sectionName = entry.target.getAttribute('data-section');
            
            if (sectionName && !trackedSections.current.has(sectionName)) {
              trackedSections.current.add(sectionName);
              
              const sectionData = SECTIONS.find(s => s.name === sectionName);
              if (sectionData) {
                const scrollPercentage = Math.round((sectionData.order / SECTIONS.length) * 100);
                analytics.scrollDepth(sectionName, sectionData.order, scrollPercentage);
              }
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);
};
