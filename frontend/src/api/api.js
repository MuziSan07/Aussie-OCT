export const API_URL = "http://localhost:5000/api";

// Auth
export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// Chapters
export const fetchChapters = async () => {
  const res = await fetch(`${API_URL}/chapters`);
  return res.json();
};

export const createChapter = async (data) => {
  const res = await fetch(`${API_URL}/chapters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateChapter = async (id, data) => {
  const res = await fetch(`${API_URL}/chapters/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteChapter = async (id) => {
  const res = await fetch(`${API_URL}/chapters/${id}`, { method: "DELETE" });
  return res.json();
};
