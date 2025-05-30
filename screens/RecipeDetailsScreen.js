import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import axios from 'axios';
import RenderHTML from 'react-native-render-html'; 
import { useWindowDimensions } from 'react-native'; // To handle screen width for rendering HTML

const API_KEY = '38233b667c364f25ba1a3c23891128ca'; 

const RecipeDetailsScreen = ({ route }) => {
  const { recipeId } = route.params; // Get the recipe ID from navigation params
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const { width } = useWindowDimensions(); // Get window dimensions

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        console.log('Fetching details for Recipe ID:', recipeId); 
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
        );
        setRecipeDetails(response.data);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        setError('Failed to load recipe details.'); 
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!recipeDetails) {
    return <Text>No details found for this recipe.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipeDetails.image }} style={styles.image} />
      <Text style={styles.title}>{recipeDetails.title}</Text>
      <Text style={styles.subtitle}>Cooking Time: {recipeDetails.readyInMinutes} minutes</Text>
      <Text style={styles.subtitle}>Servings: {recipeDetails.servings}</Text>
      <Text style={styles.header}>Ingredients</Text>
      {recipeDetails.extendedIngredients && recipeDetails.extendedIngredients.length > 0 ? (
        recipeDetails.extendedIngredients.map(ingredient => (
          <Text key={ingredient.id} style={styles.ingredient}>{ingredient.original}</Text>
        ))
      ) : (
        <Text>No ingredients found.</Text>
      )}
      <Text style={styles.header}>Instructions</Text>
      <RenderHTML
        contentWidth={width} 
        source={{ html: recipeDetails.instructions || '<p>No instructions provided</p>' }} // Provide fallback if instructions are empty
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 4,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  ingredient: {
    fontSize: 16,
    marginVertical: 2,
  },
});

export default RecipeDetailsScreen;
