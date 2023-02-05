import { getFirestore, doc, Firestore } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { app } from "../firebase";

function FirestoreDocument(props) {
  const [value, loading, error] = useDocument(
    doc(getFirestore(app), "sku", "sku"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  if (!loading && !error) {
    props.setSku(value.data().value);
  }
  return <></>;
}

export default FirestoreDocument;
