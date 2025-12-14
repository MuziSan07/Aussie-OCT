import React from "react";

const InputField = ({ label, type = "text", name, value, onChange, placeholder, error }) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      {label && <label style={{ display: "block", marginBottom: "5px" }}>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "8px",
          border: error ? "1px solid red" : "1px solid #ccc",
          borderRadius: "4px",
        }}
      />
      {error && <p style={{ color: "red", marginTop: "3px" }}>{error}</p>}
    </div>
  );
};

export default InputField;
