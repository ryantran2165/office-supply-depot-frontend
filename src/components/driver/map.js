import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  useLoadScript,
  GoogleMap,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};
const center = {
  lat: 37.335241,
  lng: -121.881074,
};

function Map({ origin, destination, waypoints, newRequest, requestHandled }) {
  const [response, setResponse] = useState(null);
  const [found, setFound] = useState(true);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCvNOUWjkIi8V_jKReYrhrNSSHDnVKn2K8",
  });

  function directionsCallback(response) {
    requestHandled();

    if (response === null) {
      return;
    }

    if (response.status === "OK") {
      setResponse(response);
      setFound(true);
    } else {
      setResponse(null);
      setFound(false);
    }
  }

  if (isLoaded) {
    return (
      <React.Fragment>
        {!found && <h3 className="text-center mb-3">Unable to find route</h3>}
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
          {newRequest && (
            <DirectionsService
              options={{
                origin: origin,
                destination: destination,
                waypoints: waypoints,
                optimizeWaypoints: true,
                travelMode: "DRIVING",
              }}
              callback={directionsCallback}
            />
          )}
          {response !== null && (
            <DirectionsRenderer
              directions={response}
              panel={document.getElementById("panel")}
            />
          )}
          <div id="panel"></div>
        </GoogleMap>
      </React.Fragment>
    );
  }

  return "";
}

Map.propTypes = {
  origin: PropTypes.string,
  destination: PropTypes.string,
  newRequest: PropTypes.bool,
  requestHandled: PropTypes.func,
};

export default Map;
