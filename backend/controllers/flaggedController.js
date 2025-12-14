import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Get all flagged questions for a user
export const getFlaggedQuestions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const flaggedQuestions = await prisma.bookmark.findMany({
      where: { userId: parseInt(userId) },
      include: {
        question: {
          include: {
            options: true,
            chapter: {
              select: {
                id: true,
                title: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    res.json({
      success: true,
      data: flaggedQuestions.map(flag => ({
        id: flag.id,
        note: flag.note,
        createdAt: flag.createdAt,
        question: flag.question,
        chapter: flag.question.chapter
      }))
    });
  } catch (err) {
    console.error("Error fetching flagged questions:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Toggle flag on a question
export const toggleFlag = async (req, res) => {
  try {
    const { userId, questionId } = req.body;
    const note = req.body.note || null;

    if (!userId || !questionId) {
      return res.status(400).json({ success: false, message: "User ID and Question ID are required" });
    }

    // Check if already flagged
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_questionId: {
          userId: parseInt(userId),
          questionId: parseInt(questionId)
        }
      }
    });

    if (existing) {
      // Remove flag
      await prisma.bookmark.delete({
        where: { id: existing.id }
      });
      return res.json({ success: true, message: "Question unflagged", flagged: false });
    } else {
      // Add flag
      await prisma.bookmark.create({
        data: {
          userId: parseInt(userId),
          questionId: parseInt(questionId),
          note
        }
      });
      return res.json({ success: true, message: "Question flagged", flagged: true });
    }
  } catch (err) {
    console.error("Error toggling flag:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Update note on flagged question
export const updateFlagNote = async (req, res) => {
  try {
    const { bookmarkId } = req.params;
    const { note } = req.body;

    const updated = await prisma.bookmark.update({
      where: { id: parseInt(bookmarkId) },
      data: { note }
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove flag
export const removeFlag = async (req, res) => {
  try {
    const { bookmarkId } = req.params;

    await prisma.bookmark.delete({
      where: { id: parseInt(bookmarkId) }
    });

    res.json({ success: true, message: "Flag removed" });
  } catch (err) {
    console.error("Error removing flag:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};