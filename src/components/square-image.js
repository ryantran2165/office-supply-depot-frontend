import React from "react";
import Image from "react-bootstrap/Image";

function SquareImage({ src }) {
  return (
    <div className="square-image">
      <Image fluid rounded className="shadow" src={src} />
    </div>
  );
}

export default SquareImage;
