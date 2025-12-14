import prisma from "../prismaClient.js";

/**
 * GET /stimulation-test
 * Get random questions from all chapters
 * Query param: ?limit=number (optional, default 30)
 */
export const getRandomQuestions = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;

    // Fetch all active questions
    const questions = await prisma.question.findMany({
      where: { status: true },
      include: { options: true },
    });

    if (questions.length === 0) {
      return res.status(404).json({ error: "No questions found" });
    }

    // Shuffle questions randomly
    const shuffled = questions.sort(() => 0.5 - Math.random());

    // Take only up to the requested limit
    const selectedQuestions = shuffled.slice(0, limit);

    res.json({
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
