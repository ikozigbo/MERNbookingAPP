export default function PlaceImg({ place, index = 0, className = null }) {
  if (!place.photos?.length) {
    return "";
  } else {
    if (!className) {
      className = "object-cover h-full";
    }
    return (
      <img
        className={className}
        src={"http://localhost:9091/uploads/" + place.photos[index]}
        alt=""
      />
    );
  }
}
