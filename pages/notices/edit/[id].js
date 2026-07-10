import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NoticeForm from '../../../components/NoticeForm';

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    async function fetchNotice() {
      try {
        const res = await fetch('/api/notices');
        if (!res.ok) throw new Error('Failed to fetch');
        const all = await res.json();
        const found = all.find((n) => n.id === Number(id));
        if (!found) {
          setError('Notice not found.');
        } else {
          setNotice(found);
        }
      } catch (err) {
        console.error(err);
        setError('Could not load the notice.');
      } finally {
        setLoading(false);
      }
    }

    fetchNotice();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Notice</h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <NoticeForm mode="edit" initialData={notice} />
        )}
      </div>
    </div>
  );
}