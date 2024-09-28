import React, { useState, useEffect } from 'react';
import { supabase } from '../../components/supabaseClient';
import NavigationBar from '../../components/NavigationBar/NavigationBar'; // Assuming NavigationBar is already implemented
import './analytics-page.css'; // Styling for your Analytics page

function AnalyticsPage() {
  const [categories, setCategories] = useState([]);

  // Fetch unique categories and their counts from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('Chats') // Adjust table name if different
        .select('*');

      if (error) {
        console.error('Error fetching categories:', error);
        return;
      }

      console.log('Data:', data);

      // Count occurrences of each category
      const categoryCounts = data.reduce((acc, item) => {
        acc[item.category] = acc[item.category] ? acc[item.category] + 1 : 1;
        return acc;
      }, {});

      // Convert object to array of categories for easy rendering
      const formattedCategories = Object.entries(categoryCounts).map(
        ([category, count]) => ({
          category,
          count,
        })
      );

      // Log the formatted categories to the console
      console.log('Fetched Categories:', formattedCategories);

      // Update the state with the categories
      setCategories(formattedCategories);
    };

    fetchCategories();
  }, []);

  return (
    <div className="page-container">
      <NavigationBar />
      <div className="analytics-container">
        <h1>Analytics Page</h1>
        <div className="analytics-content">
          {categories.length > 0 ? (
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
