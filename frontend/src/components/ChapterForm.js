import React, { useState, useEffect } from "react";

const ChapterForm = ({ chapter, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    subtitle: "",
    description: "",
    status: true,
  });

  useEffect(() => {
    if (chapter) setFormData(chapter);
  }, [chapter]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        type="text"
        name="image"
        placeholder="Image URL"
        value={formData.image}
        onChange={handleChange}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <input
        type="text"
        name="subtitle"
        placeholder="Subtitle"
        value={formData.subtitle}
        onChange={handleChange}
        style={{ display: "block", marginBottom: "10px", width: "100%" }}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        style={{ display: "block", marginBottom: "10px", width: "100%", height: "60px" }}
      />
      <label>
        Status:
        <input
          type="checkbox"
          name="status"
          checked={formData.status}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <div style={{ marginTop: "10px" }}>
        <button type="submit" style={{ marginRight: "10px" }}>Save</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
};

export default ChapterForm;
