import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHTML from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const LocalRecipeDetailsScreen = ({ route }) => {
  const { recipeId } = route.params;
  const [recipeDetails, setRecipeDetails] = useState(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const loadRecipeDetails = async () => {
      try {
        const storedRecipes = await AsyncStorage.getItem('recipes');
        const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
        const foundRecipe = recipes.find(recipe => recipe.id === recipeId);
        setRecipeDetails(foundRecipe || null);
      } catch (error) {
        console.error('Error loading recipe details:', error);
        Alert.alert('Error', 'Failed to load recipe details. Please try again.');
      }
    };

    loadRecipeDetails();
  }, [recipeId]);

  if (!recipeDetails) {
    return <Text>No details found for this recipe.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipeDetails.image }} style={styles.image} />
      <Text style={styles.title}>{recipeDetails.title}</Text>
      <View style={styles.infoRow}>
        <MaterialIcons name="timer" size={20} color="#555" />
        <Text style={styles.subtitle}>Cooking Time: {recipeDetails.cookingTime} minutes</Text>
      </View>
      <View style={styles.infoRow}>
        <MaterialIcons name="group" size={20} color="#555" />
        <Text style={styles.subtitle}>Servings: {recipeDetails.servings}</Text>
      </View>
      <Text style={styles.header}>Ingredients</Text>
      {recipeDetails.ingredients?.length > 0 ? (
        recipeDetails.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredient}>{ingredient}</Text>
        ))
      ) : (
        <Text>No ingredients found.</Text>
      )}
      <Text style={styles.header}>Instructions</Text>
      <RenderHTML
        contentWidth={width}
        source={{ html: recipeDetails.instructions ? `<p>${recipeDetails.instructions.replace(/\n/g, '<br/>')}</p>` : '<p>No instructions provided</p>' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  image: { width: '100%', height: 200, borderRadius: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  subtitle: { fontSize: 16, marginLeft: 8 },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 12 },
  ingredient: { fontSize: 16, marginVertical: 2 },
});

export default LocalRecipeDetailsScreen;
