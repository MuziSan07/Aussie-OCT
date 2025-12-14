// chapterController.js
import prisma from "../prismaClient.js";


/**
 * List all chapters with question count and image
 */
export const getChapters = async (req, res) => {
  try {
    const chapters = await prisma.chapter.findMany({
      include: { questions: true },
      orderBy: { createdAt: "desc" }, // optional: newest first
    });

    const response = chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      subtitle: ch.subtitle,
      status: ch.status,
      image: ch.image || null, // include image
      createdAt: ch.createdAt,
      updatedAt: ch.updatedAt,
      questionCount: ch.questions.length,
    }));

    res.json(response);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get complete data about a chapter and its questions (with options)
 */
export const getChapterById = async (req, res) => {
  const { id } = req.params;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
      include: { questions: { include: { options: true } } },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    res.json(chapter);
  } catch (error) {
    console.error("Error fetching chapter by ID:", error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Start quiz for a range of questions
 * Body: { start: number, end: number }
 */
export const startQuiz = async (req, res) => {
  const { id } = req.params;
  const { start = 1, end } = req.body;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
      include: {
        questions: { include: { options: true }, orderBy: { id: "asc" } },
      },
    });

    if (!chapter) return res.status(404).json({ error: "Chapter not found" });

    const questionsForQuiz = chapter.questions.slice(start - 1, end);

    res.json({
      chapterId: chapter.id,
      title: chapter.title,
      quizQuestions: questionsForQuiz,
      totalQuestions: questionsForQuiz.length,
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update chapter status
export const updateChapter = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.chapter.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existing) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    // req.body is now available because multer is used
    const title = req.body.title || existing.title;
    const subtitle = req.body.subtitle || existing.subtitle;
    const description = req.body.description || existing.description;

    const updateData = {
      title,
      subtitle,
      description,
      status: existing.status, // status always stays same
    };

    // If a new image is uploaded
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await prisma.chapter.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    res.json(updated);
  } catch (error) {
    console.log("Error updating chapter:", error);
    res.status(500).json({ message: "Update failed" });
  }
};


// Create Chapter
export const createChapter = async (req, res) => {
  try {
    const { title, subtitle } = req.body; // remove 'status' from destructuring

    if (!title || !subtitle) {
      return res.status(400).json({ message: "Title and subtitle are required" });
    }

    const newChapter = await prisma.chapter.create({
      data: {
        title,
        subtitle,
        status: true, // always true
        image: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });

    res.status(201).json(newChapter);
  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete Chapter
export const deleteChapter = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedChapter = await prisma.chapter.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Chapter deleted successfully", chapter: deletedChapter });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    res.status(500).json({ error: error.message });
  }
};
