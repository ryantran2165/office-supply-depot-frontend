import React from "react";
import PropTypes from "prop-types";
import Image from "react-bootstrap/Image";

function SquareImage({ src, alt }) {
  return (
    <div className="square-image shadow">
      <Image fluid rounded src={src} alt={alt} />
    </div>
  );
}

SquareImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
};

export default SquareImage;
