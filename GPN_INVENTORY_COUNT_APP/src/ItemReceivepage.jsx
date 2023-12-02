import { useSelector } from "react-redux";
import ItemInputFormTable from "./components/ItemInputFormTable";

export default function ItemReceivePage() {
  const { allItems, index } = useSelector((state) => state.requests);

  return (
    <>
      <ItemInputFormTable />
    </>
  );
}
