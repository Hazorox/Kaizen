import { useParams } from "react-router-dom";

const Battle = () => {
  const { id } = useParams();
  return <>{id && "hiiiiiii"}</>;
};

export default Battle;
