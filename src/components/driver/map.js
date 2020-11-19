import React, { useState } from "react";
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
  lat: 37.335384,
  lng: -121.881061,
};

function Map({ origin, destination, newRequest, requestHandled }) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCvNOUWjkIi8V_jKReYrhrNSSHDnVKn2K8",
  });
  const [response, setResponse] = useState(null);
  const [found, setFound] = useState(true);

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

  if (loadError) {
    return "Error loading map";
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

export default Map;
