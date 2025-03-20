import { useParams } from "react-router";

export const Page = () => {
  let { path } = useParams();
  return <div>{path}</div>;
};
