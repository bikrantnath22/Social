import React, { useState } from "react";
import ImageComponents from "./ImageComponents";
import FileComponents from "./FileComponents";
import VideoCompoents from "./VideoCompoents";
import {
  FileImageFilled,
  VideoCameraFilled,
  FileTextFilled,
} from "@ant-design/icons";
const MediaForm = ({ onClose, onAddGroup, handleSendMessage }) => {
  const [activeComponent, setActiveComponent] = useState(null);

  // Handlers for each component click
  const handleFileImageClick = () => setActiveComponent("fileImage");
  const handleFileComponentsClick = () => setActiveComponent("fileComponents");
  const handleVideoComponentsClick = () =>
    setActiveComponent("videoComponents");
  return (
    <div className="flex justify-center items-center p-4  h-full">
      {/* Conditionally Render Based on Active Component */}
      {activeComponent === "fileImage" && (
        <div className="text-lg font-semibold">
          <ImageComponents
            onClose={onClose}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}
      {activeComponent === "fileComponents" && (
        <div className="text-lg font-semibold">
          <FileComponents
            onClose={onClose}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}
      {activeComponent === "videoComponents" && (
        <div className="text-lg font-semibold">
          <VideoCompoents
            onClose={onClose}
            handleSendMessage={handleSendMessage}
          />
        </div>
      )}

      {/* Default View (only shown when no active component is selected) */}
      {activeComponent === null && (
        <>
          {/* FileImageFilled Icon */}
          <button onClick={handleFileImageClick} className="text-blue-500 ">
            <div>
              <FileImageFilled className="md:text-[100px]" />
              <p>Upload Image</p>
            </div>
          </button>

          <button
            onClick={handleVideoComponentsClick}
            className="text-orange-500 "
          >
            <div>
              <VideoCameraFilled className="md:text-[100px]" />
              <p>Upload Video</p>
            </div>
          </button>

          <button onClick={handleFileComponentsClick} className="text-red-500 ">
            <div>
              <FileTextFilled className="md:text-[100px]" />
            </div>
            <p>Upload File</p>
          </button>
        </>
      )}
    </div>
  );
};

export default MediaForm;
