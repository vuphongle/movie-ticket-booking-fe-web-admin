import React from "react";
import { FileImageOutlined } from "@ant-design/icons";

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  text?: string;
  style?: React.CSSProperties;
}

const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = "100%",
  height = 300,
  text = "No Image",
  style = {},
}) => {
  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#f5f5f5",
        border: "2px dashed #d9d9d9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#8c8c8c",
        fontSize: "14px",
        borderRadius: "6px",
        ...style,
      }}
    >
      <FileImageOutlined style={{ fontSize: "48px", marginBottom: "8px" }} />
      <span>{text}</span>
    </div>
  );
};

export default ImagePlaceholder;
