import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BarList = () => {
  const [bars, setBars] = useState([]);

  const fetchBars = async () => {
    try {
      const response = await axios.get('/api/v1/bars');
      setBars(response.data.bars || []); // Asegúrate de que `bars` esté definido
    } catch (error) {
      console.error('Error fetching bars', error);
    }
  };

  useEffect(() => {
    fetchBars();
  }, []);

  return (
    <div>
      {Array.isArray(bars) && bars.length > 0 ? (
        <ul>
          {bars.map(bar => (
            <li key={bar.id}>{bar.name}</li>
          ))}
        </ul>
      ) : (
        <p>No bars available</p>
      )}
    </div>
  );
};

export default BarList;
