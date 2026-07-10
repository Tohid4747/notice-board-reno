import Link from 'next/link';

export default function NoticeCard({ notice, onDeleteClick }) {
  const isUrgent = notice.priority === 'URGENT';

  const formattedDate = new Date(notice.publishDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-gray-900">{notice.title}</h2>
        {isUrgent && (
          <span className="shrink-0 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase text-white">
            Urgent
          </span>
        )}
      </div>

      <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{notice.body}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium">{notice.category}</span>
        <span>•</span>
        <span>{formattedDate}</span>
      </div>

      <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
        <Link
          href={`/notices/edit/${notice.id}`}
          className="flex-1 rounded-md bg-blue-50 px-3 py-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-100"
        >
          Edit
        </Link>
        <button
          onClick={() => onDeleteClick(notice)}
          className="flex-1 rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
        >
          Delete
        </button>
      </div>
    </div>
  );
}