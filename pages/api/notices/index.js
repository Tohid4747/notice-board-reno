import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
      });
      return res.status(200).json(notices);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to fetch notices' });
    }
  }

  else if (req.method === 'POST') {
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

      const newNotice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: parsedDate,
        },
      });
      return res.status(201).json(newNotice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to create notice' });
    }
  }

  else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}