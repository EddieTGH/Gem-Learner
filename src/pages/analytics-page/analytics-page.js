import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/supabaseClient';
import NavigationBar from '../../components/NavigationBar/NavigationBar'; // Assuming NavigationBar is already implemented
import './analytics-page.css'; // Styling for your Analytics page

function AnalyticsPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  // Fetch unique categories and their counts from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Call the SQL function via RPC to fetch category counts
        const { data, error } = await supabase.rpc('get_category_counts');

        if (error) {
          console.error('Error fetching categories:', error);
          setError(error.message);
          return;
        }

        console.log('Data:', data);

        // Format data for rendering
        const formattedCategories = data.map((item) => ({
          category: item.category,
          count: item.count,
        }));

        // Log the formatted categories to the console
        console.log('Fetched Categories:', formattedCategories);

        // Update the state with the categories
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Unexpected error fetching categories:', error);
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="page-container">
      <NavigationBar />
      <div className="analytics-container">
        <h1>Analytics Page</h1>
        <div className="analytics-content">
          {error ? (
            <p>Error: {error}</p>
          ) : categories.length > 0 ? (
            categories.map((item) => (
              <div key={item.category} className="category-card">
                <h2>{item.category}</h2>
                <p>Count: {item.count}</p>
              </div>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
