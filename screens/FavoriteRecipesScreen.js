import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import RecipeCard from './components/RecipeCard';
import CustomHeader from './components/CustomHeader';

const FavoriteRecipeScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);

  const loadFavoriteRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem('likedRecipes');
      const parsedRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      const validRecipes = parsedRecipes.filter(recipe => recipe && recipe.id);
      setRecipes(validRecipes);
    } catch (error) {
      console.error('Error loading favorite recipes:', error);
      Alert.alert('Error', 'Failed to load your favorite recipes. Please try again.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadFavoriteRecipes();
    }, [])
  );

  const removeRecipeFromFavorites = async (recipeId) => {
    try {
      const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
      setRecipes(updatedRecipes);
      await AsyncStorage.setItem('likedRecipes', JSON.stringify(updatedRecipes));
      navigation.navigate('Home', { refresh: true });
    } catch (error) {
      console.error('Error updating favorite recipes:', error);
      Alert.alert('Error', 'Failed to update your favorites.');
    }
  };

  const renderRecipeItem = ({ item }) => (
    <RecipeCard
      item={item}
      isLiked={true}
      toggleLike={() => removeRecipeFromFavorites(item.id)}
      navigation={navigation}
    />
  );

  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} title="Recipe Finder" style={styles.header} />
      {recipes.length === 0 ? (
        <Text style={styles.noFavoritesText}>No favorite recipes added yet</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRecipeItem}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'stretch',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 70,
  },
  flatListContent: {
    paddingVertical: 10,
  },
});

export default FavoriteRecipeScreen;
