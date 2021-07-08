import Cafeteria from "./Cafeteria";

const CafeteriaList = ({ cafes }) => {
  return (
    <div>
      {cafes.map((cafe) => (
        <Cafeteria key={cafe.id} cafe={cafe} />
      ))}
    </div>
  );
};

export default CafeteriaList;
