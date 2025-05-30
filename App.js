import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './screens/HomeScreen';
import MyRecipesScreen from './screens/MyRecipesScreen';
import FavoriteRecipesScreen from './screens/FavoriteRecipesScreen';
import RecipeDetailsScreen from './screens/RecipeDetailsScreen'; 
import LocalRecipeDetailsScreen from './screens/LocalRecipeDetailsScreen';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="#4CAF50" 
      inactiveColor="#888"
      barStyle={{ backgroundColor: '#fff' }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="MyRecipes"
        component={MyRecipesScreen}
        options={{
          tabBarLabel: 'My Recipes',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="cutlery" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="FavoriteRecipes"
        component={FavoriteRecipesScreen}
        options={{
          tabBarLabel: 'Favorite Recipes',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="heart" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Stack Navigator that includes the TabNavigator and RecipeDetailsScreen
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeTabs" component={TabNavigator} options={{ headerShown: false, title:"Ready2Cook" }} />
        <Stack.Screen name="RecipeDetails" component={RecipeDetailsScreen} options={{ title: 'Recipe Details' }} />
        <Stack.Screen name="LocalRecipeDetails" component={LocalRecipeDetailsScreen}  options={{ title: 'Recipe Details' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
