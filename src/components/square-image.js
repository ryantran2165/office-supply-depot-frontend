import React from "react";
import PropTypes from "prop-types";
import Image from "react-bootstrap/Image";

function SquareImage({ src }) {
  return (
    <div className="square-image">
      <Image fluid rounded className="shadow" src={src} />
    </div>
  );
}

SquareImage.propTypes = {
  src: PropTypes.string,
};

export default SquareImage;
