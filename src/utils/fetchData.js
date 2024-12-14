// utils/fetchData.js

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchData = async (databaseName, condition, value) => {
  try {
    let ordersData = [];
    const q = query(
      collection(db, databaseName),
      where(condition, "==", value)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      ordersData.push({ id: doc.id, ...doc.data() });
    });
    return ordersData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export default fetchData;
