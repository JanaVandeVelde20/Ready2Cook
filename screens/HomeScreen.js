import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  SafeAreaView,
  TextInput,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from './components/CustomHeader';
import { useFocusEffect } from '@react-navigation/native';

const API_KEY = '38233b667c364f25ba1a3c23891128ca';

const HomeScreen = ({ navigation }) => {
  const [ingredientsInput, setIngredientsInput] = useState(''); 
  const [ingredients, setIngredients] = useState(''); 
  const [recipes, setRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cache is used to store fetched recipes based on input to avoid redundant API calls
  const cache = useRef({});

  const loadLikedRecipes = async () => {
    const liked = await AsyncStorage.getItem('likedRecipes');
    if (liked) setLikedRecipes(JSON.parse(liked));
  };

  useEffect(() => {
    if (ingredients) {
      getRecipes();
    }
  }, [ingredients]);

  // useFocusEffect ensures liked recipes are loaded whenever this screen gains focus
  useFocusEffect(
    useCallback(() => {
      loadLikedRecipes(); 
    }, [])
  );

  const getRecipes = async () => {
    if (!ingredients) return;

    // Check if recipes for the current input are already cached
    const cachedData = cache.current[ingredients];
    if (cachedData) {
      setRecipes(cachedData);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${API_KEY}`
      );

      // Error handling when there are no recipes found
      if (!response.data || response.data.length === 0) {
        console.log('No recipes found.');
        setRecipes([]);
        return;
      }

      const detailedRecipes = await Promise.all(
        response.data.map(async (recipe) => {
          try {
            const recipeDetail = await axios.get(
              `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}`
            );
            return { 
              ...recipe, 
              time: recipeDetail.data.readyInMinutes,
              vegetarian: recipeDetail.data.vegetarian 
            };
          } catch (error) {
            console.error(`Error fetching details for recipe ID: ${recipe.id}, error`);
            return recipe;
          }
        })
      );

      cache.current[ingredients] = detailedRecipes.filter(item => item.title); 
      setRecipes(detailedRecipes.filter(item => item.title)); 
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle the "like" status of a recipe and save the updated list in AsyncStorage
  const toggleLike = async (recipe) => {
    const isLiked = likedRecipes.some((r) => r.id === recipe.id); 
    const updatedLikedRecipes = isLiked
      ? likedRecipes.filter((r) => r.id !== recipe.id) // Remove recipe if already liked
      : [...likedRecipes, recipe]; // Add recipe to liked list if not already liked

    setLikedRecipes(updatedLikedRecipes);
    await AsyncStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
  };

  const renderRecipeItem = ({ item }) => {
    const isLiked = likedRecipes.some((r) => r.id === item.id);

    return (
      <View style={styles.recipeCardContainer}>
        <TouchableOpacity
          style={styles.recipeCard}
          onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
        >
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.recipeImage} />
          )}
          <Text style={styles.recipeTitle}>{item.title}</Text>

          <View style={styles.infoContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.infoRow}>
              <FontAwesome name="check-circle" size={18} color="green" />
              <Text style={styles.infoText}>Used: {item.usedIngredientCount}</Text>
            </View>
            <View style={styles.infoRow}>
              <FontAwesome name="times-circle" size={18} color="red" />
              <Text style={styles.infoText}>Missing: {item.missedIngredientCount}</Text>
            </View>
  </View>
  
  <View style={styles.rightColumn}>
    <View style={styles.infoRow}>
      <FontAwesome name="clock-o" size={18} color="#888" />
      <Text style={styles.cookingTime}>{item.time} min</Text>
    </View>
    {item.vegetarian && (
      <View style={styles.infoRow}>
        <FontAwesome name="leaf" size={18} color="green" />
        <Text style={styles.infoText}>Vegetarian</Text>
      </View>
    )}
  </View>
</View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.heartIconContainer}
          onPress={() => toggleLike(item)}
          activeOpacity={0.7}
        >
          <View style={styles.heartBackground}>
            <FontAwesome
              name={isLiked ? 'heart' : 'heart-o'}
              size={22}
              color={isLiked ? '#ed1d24' : 'white'}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CustomHeader navigation={navigation} title="Recipe Finder" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Text style={styles.header}>Recipe Finder</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="search" size={20} color="#888" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter ingredients (comma separated)"
            value={ingredientsInput}
            onChangeText={setIngredientsInput}
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setIngredients(ingredientsInput)}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>

        {loading && <Text style={styles.loadingText}>Loading...</Text>}

        <FlatList
          data={recipes}
          renderItem={renderRecipeItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.flatListContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 40,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    height: '100%',
  },
  searchButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeCardContainer: {
    width: '98%',
    margin: '1%',
    position: 'relative',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginVertical: 10,
  },
  recipeCard: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  recipeImage: {
    width: 300,
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    width: '100%',
    marginTop: 10,
  },
  leftColumn: {
    flex: 1,
    alignItems: 'flex-start', 
  },
  rightColumn: {
    flex: 1,
    alignItems: 'flex-end', 
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#555',
  },
  cookingTime: {
    marginLeft: 3,
    fontSize: 14,
    color: '#555',
  },
  heartIconContainer: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 1,
    padding: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.8)',
    borderRadius: 50,
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  flatListContent: {
    paddingBottom: 300,
  },
});

export default HomeScreen;
