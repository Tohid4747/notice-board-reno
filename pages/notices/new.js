import NoticeForm from '../../components/NoticeForm';

export default function NewNotice() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Add Notice</h1>
        <NoticeForm mode="create" />
      </div>
    </div>
  );
}