self.addEventListener("message", (event) => {
  const markers = JSON.parse(event.data);

  const renderedMarkers = markers.map((marker) => {
    // Process the marker
    return marker;
  });

  // Send the rendered markers back to the main thread
  self.postMessage(renderedMarkers);
});
