'use client';

export default function ListingDetails({ customFields }) {
  const hasFields = customFields && Object.entries(customFields).length > 0;

  return (
    <div className="bg-white rounded-xl p-4">
      <h2 className="font-semibold text-dark-text mb-3">Details</h2>
      <div className="space-y-2">
        {hasFields ? (
          Object.entries(customFields).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-dark-muted capitalize">{key}</span>
              <span className="font-medium text-dark-text">{String(value)}</span>
            </div>
          ))
        ) : (
          <p className="text-dark-muted text-sm">No additional details</p>
        )}
      </div>
    </div>
  );
}