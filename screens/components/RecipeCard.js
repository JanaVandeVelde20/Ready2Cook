// RecipeCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const RecipeCard = ({ item, isLiked, toggleLike, navigation }) => (
  <View style={styles.recipeCardContainer}>
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetails', { recipeId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
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
            <Text style={styles.infoText}>{item.time} min</Text>
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

const styles = StyleSheet.create({
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
    minHeight: 240,
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
    marginTop: 10,
    width: '100%',
  },
  leftColumn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center',
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
  heartIconContainer: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 1,
    padding: 12,
    backgroundColor: 'rgba(150, 150, 150, 0.8)',
    borderRadius: 50,
  },
});

export default RecipeCard;
