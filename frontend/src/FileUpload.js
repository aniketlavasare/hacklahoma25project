import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    university: "",
    classCode: "",
    className: "",
    materialType: "",
    uploader: "",
  });

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("university", formData.university);
    data.append("classCode", formData.classCode);
    data.append("className", formData.className);
    data.append("materialType", formData.materialType);
    data.append("uploader", formData.uploader);

    try {
      const response = await axios.post("http://localhost:5000/api/upload-source", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error uploading file", error);
    }
  };

  return (
    <div>
      <h1>Upload Study Material</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="university"
          value={formData.university}
          onChange={handleChange}
          placeholder="University Name"
        />
        <input
          type="text"
          name="classCode"
          value={formData.classCode}
          onChange={handleChange}
          placeholder="Class Code"
        />
        <input
          type="text"
          name="className"
          value={formData.className}
          onChange={handleChange}
          placeholder="Class Name"
        />
        <input
          type="text"
          name="materialType"
          value={formData.materialType}
          onChange={handleChange}
          placeholder="Material Type"
        />
        <input
          type="text"
          name="uploader"
          value={formData.uploader}
          onChange={handleChange}
          placeholder="Uploader"
        />
        <input type="file" name="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default FileUpload;
