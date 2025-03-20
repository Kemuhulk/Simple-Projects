import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    // Fetch medicines from the backend
    axios
      .get("http://localhost:5000/api/medicines")
      .then((response) => setMedicines(response.data))
      .catch((error) => console.error("Error fetching medicines:", error));
  }, []);

  return (
    <div>
      <h1>Medicines</h1>
      <ul>
        {medicines.map((medicine) => (
          <li key={medicine._id}>
            {medicine.name} - {medicine.quantity} units - ${medicine.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
