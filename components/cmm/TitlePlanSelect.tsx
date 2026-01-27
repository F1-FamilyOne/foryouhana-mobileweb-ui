import { InfoIcon } from 'lucide-react';

export default function TitlePlanSelect({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-center gap-1 pb-2">
      <h2 className="font-hana-light text-xs">{title}</h2>
      {description && (
        <div className="group relative inline-flex items-center">
          <InfoIcon className="h-4 w-4 text-hana-gray-400" />
          <div className="-translate-x-1/2 pointer-events-none absolute bottom-full left-1/2 mb-2 whitespace-nowrap rounded bg-black px-2 py-1 text-white text-xs opacity-0 transition group-hover:opacity-100">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}
