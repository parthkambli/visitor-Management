import {
  Camera,
  Upload,
} from "lucide-react";

import Button from "../UI/Button";

function WebcamCapture() {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-2xl h-72 flex flex-col items-center justify-center text-gray-500">

      <Camera size={50} />

      <p className="mt-4 font-medium">
        Capture Visitor Photo
      </p>

      <Button className="mt-5 flex items-center gap-2">

        <Upload size={18} />

        Upload Photo

      </Button>

    </div>
  );
}

export default WebcamCapture;