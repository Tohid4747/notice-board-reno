import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const noticeId = parseInt(id, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: 'Invalid notice ID' });
  }

  if (req.method === 'PUT') {
    try {
      const { title, body, category, priority, publishDate } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }
      if (!body || !body.trim()) {
        return res.status(400).json({ error: 'Body is required' });
      }
      if (!['Exam', 'Event', 'General'].includes(category)) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      if (!['NORMAL', 'URGENT'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid priority' });
      }
      const parsedDate = new Date(publishDate);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: 'Invalid publish date' });
      }

      const updatedNotice = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: parsedDate,
        },
      });
      return res.status(200).json(updatedNotice);
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Notice not found' });
      }
      return res.status(500).json({ error: 'Failed to update notice' });
    }
  }

  else if (req.method === 'DELETE') {
    try {
      await prisma.notice.delete({
        where: { id: noticeId },
      });
      return res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Notice not found' });
      }
      return res.status(500).json({ error: 'Failed to delete notice' });
    }
  }

  else {
    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}