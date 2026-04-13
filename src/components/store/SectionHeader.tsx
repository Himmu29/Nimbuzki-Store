import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
};

export default function SectionHeader({ title, subtitle, viewAllLink }: SectionHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
        {subtitle && <p className="mt-2 text-gray-500 text-lg">{subtitle}</p>}
      </div>
      
      {viewAllLink && (
        <Link 
          href={viewAllLink} 
          className="group inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
        >
          View All <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  );
}
