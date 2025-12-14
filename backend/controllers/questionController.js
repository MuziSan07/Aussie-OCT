// backend/controllers/questionController.js
import { PrismaClient } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

// Helper: Generate full audio URL
const getAudioUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// CREATE Question + Options + Optional Audio
export const createQuestion = async (req, res) => {
  try {
    const { question, chapterId, options, feedback, testType = "FREE", status = true } = req.body;

    if (!question || !chapterId) {
      return res.status(400).json({ message: "Question and chapterId are required" });
    }

    let parsedOptions = [];
    try {
      parsedOptions = typeof options === "string" ? JSON.parse(options) : options;
      if (!Array.isArray(parsedOptions) || parsedOptions.length === 0) {
        return res.status(400).json({ message: "At least one option is required" });
      }
    } catch {
      return res.status(400).json({ message: "Invalid options format" });
    }

    const audioPath = req.file ? req.file.filename : null;
    const audioUrl = audioPath ? getAudioUrl(req, audioPath) : null;

    const newQuestion = await prisma.question.create({
      data: {
        question,
        chapterId: parseInt(chapterId),
        feedback: feedback || null,
        audio: audioUrl,
        testType,
        status: status === "true" || status === true,
        options: {
          create: parsedOptions.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect === true,
          })),
        },
      },
      include: {
        options: true,
        chapter: { select: { id: true, title: true } },
      },
    });

    res.status(201).json(newQuestion);
  } catch (err) {
    console.error("Create question error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// GET ALL Questions (with options + chapter)
export const getQuestions = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      where: { status: true },
      include: {
        options: true,
        chapter: { select: { id: true, title: true } },
      },
      orderBy: { id: "desc" },
    });
    res.json(questions);
  } catch (err) {
    console.error("Get questions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ONE Question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Question ID is required" });
    }

    const question = await prisma.question.findUnique({
      where: { id: parseInt(id) },
      include: {
        options: true,
        chapter: { select: { id: true, title: true } },
      },
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    console.error("Get question by ID error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET Question Count (for range selector)
export const getQuestionCount = async (req, res) => {
  try {
    const { chapterId } = req.query;

    const where = chapterId
      ? { chapterId: parseInt(chapterId), status: true }
      : { status: true };

    const count = await prisma.question.count({ where });

    res.json({ count });
  } catch (err) {
    console.error("Count error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Question
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, chapterId, options, feedback, testType, status } = req.body;

    const updateData = {
      question,
      chapterId: chapterId ? parseInt(chapterId) : undefined,
      feedback: feedback || null,
      testType: testType || "FREE",
      status: status === "true" || status === true,
    };

    if (req.file) {
      updateData.audio = getAudioUrl(req, req.file.filename);
    }

    if (options) {
      let parsedOptions = typeof options === "string" ? JSON.parse(options) : options;
      await prisma.option.deleteMany({ where: { questionId: parseInt(id) } });
      updateData.options = {
        create: parsedOptions.map((opt) => ({
          text: opt.text,
          isCorrect: opt.isCorrect === true,
        })),
      };
    }

    const updated = await prisma.question.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        options: true,
        chapter: { select: { id: true, title: true } },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Update question error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE Question (cascade via schema)
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.question.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Question deleted" });
  } catch (err) {
    console.error("Delete question error:", err);
    res.status(500).json({ message: "Server error" });
  }
};