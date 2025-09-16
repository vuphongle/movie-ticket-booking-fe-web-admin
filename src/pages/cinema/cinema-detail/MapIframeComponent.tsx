interface MapIframeComponentProps {
  mapLocation: string;
}

const MapIframeComponent = ({ mapLocation }: MapIframeComponentProps) => {
  return (
    <div style={{ width: "100%" }}>
      <iframe
        src={mapLocation}
        width="100%"
        height="450"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapIframeComponent;
