import React from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.335384,
  lng: -121.881061,
};

function Map() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyCvNOUWjkIi8V_jKReYrhrNSSHDnVKn2K8">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        {/* Child components, such as markers, info windows, etc. */}
        <></>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);
