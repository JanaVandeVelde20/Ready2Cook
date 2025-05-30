import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CustomHeader from './components/CustomHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; 
import * as FileSystem from 'expo-file-system';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; 

// Top Tab Navigator
const Tab = createMaterialTopTabNavigator();

export default function AddRecipeScreen({ navigation }) {
    return (
        <SafeAreaView style={styles.safeArea}>
            <CustomHeader navigation={navigation} title="My Recipes" />
            <Tab.Navigator
                screenOptions={{
                    tabBarIndicatorStyle: {
                        backgroundColor: '#4CAF50', 
                        height: 3, 
                    },
                    tabBarActiveTintColor: '4CAF50', 
                    tabBarInactiveTintColor: '#999', 
                    tabBarLabelStyle: { fontSize: 14 }, 
                }}
            >
                <Tab.Screen name="New Recipe" component={NewRecipeTab} />
                <Tab.Screen name="My Recipes" component={MyRecipesTab} />
            </Tab.Navigator>
        </SafeAreaView>
    );
}

// New Recipe Tab Component
function NewRecipeTab({ navigation }) {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [servings, setServings] = useState('');
    const [image, setImage] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePicture = async () => {
        let photo = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!photo.canceled) {
            setImage(photo.assets[0].uri);
        }
    };

    const handleSaveRecipe = async () => {
        if (!title || !ingredients || !instructions || !cookingTime || !servings || !image) {
            alert("Please fill in all fields and add an image");
            return;
        }
    
        // Save image locally
        const imageName = image.split('/').pop();
        const newImageUri = `${FileSystem.documentDirectory}${imageName}`;
        await FileSystem.moveAsync({
            from: image,
            to: newImageUri,
        });
    
        const newRecipe = {
            id: Date.now().toString(),
            title,
            ingredients: ingredients.split('\n'), // Split by line breaks for array format
            instructions,
            cookingTime,
            servings,
            image: newImageUri,
        };
    
        try {
            const storedRecipes = await AsyncStorage.getItem('recipes');
            const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
            recipes.push(newRecipe);
            await AsyncStorage.setItem('recipes', JSON.stringify(recipes));
    
            // Clear form fields
            setTitle('');
            setIngredients('');
            setInstructions('');
            setCookingTime('');
            setServings('');
            setImage(null);
            navigation.navigate('My Recipes');
        } catch (error) {
            console.error("Failed to save the recipe", error);
        }
    };
    

    if (hasCameraPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <Text style={styles.titleText}>Add Recipe</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Recipe Title"
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={[styles.input, styles.multiLineInput]}
                        placeholder="Ingredients"
                        value={ingredients}
                        onChangeText={setIngredients}
                        placeholderTextColor="#888"
                        multiline={true}
                        numberOfLines={4}
                    />
                    <TextInput
                        style={[styles.input, styles.multiLineInput]}
                        placeholder="Instructions"
                        value={instructions}
                        onChangeText={setInstructions}
                        placeholderTextColor="#888"
                        multiline={true}
                        numberOfLines={4}
                    />
                    <View style={styles.row}>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Cooking Time (min)"
                                value={cookingTime}
                                onChangeText={setCookingTime}
                                placeholderTextColor="#888"
                                keyboardType="numeric"
                            />
                            {cookingTime ? (
                                <Ionicons name="time-outline" size={20} color="#28a745" style={styles.icon} />
                            ) : null}
                        </View>
                        <View style={styles.inputWithIcon}>
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Servings"
                                value={servings}
                                onChangeText={setServings}
                                placeholderTextColor="#888"
                                keyboardType="numeric"
                            />
                            {servings ? (
                                <Ionicons name="people-outline" size={20} color="#28a745" style={styles.icon} />
                            ) : null}
                        </View>
                    </View>

                    {image && <Image source={{ uri: image }} style={styles.image} />}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
                            <Ionicons name="image" size={32} color="#28a745" />
                            <Text style={styles.iconButtonText}>Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton} onPress={takePicture}>
                            <Ionicons name="camera" size={32} color="#28a745" />
                            <Text style={styles.iconButtonText}>Camera</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveRecipe}>
                        <Ionicons name="save-outline" size={24} color="white" />
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// My Recipes Tab Component
function MyRecipesTab() {
    const [recipes, setRecipes] = useState([]);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
            const fetchRecipes = async () => {
                try {
                    const storedRecipes = await AsyncStorage.getItem('recipes');
                    const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
                    console.log("Loaded recipes:", recipes); // Debugging log
                    setRecipes(recipes);
                } catch (error) {
                    console.error("Failed to load recipes", error);
                }
            };
            
            fetchRecipes();
        }, [])
    );

    const handleDeleteRecipe = async (recipeId) => {
        Alert.alert(
            "Delete Recipe",
            "Are you sure you want to delete this recipe?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        // Filter out the recipe to delete
                        const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
                        setRecipes(updatedRecipes);

                        // Update local storage
                        await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes));
                    },
                },
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.titleText}>My Recipes</Text>
            {recipes.length === 0 ? (
                <Text style={styles.noRecipesText}>No recipes added yet</Text>
            ) : (
                recipes.map((recipe) => (
                    <View key={recipe.id} style={styles.recipeCard}>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('LocalRecipeDetails', { recipeId: recipe.id })}
                        >
                            <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                            <Text style={styles.recipeTitle}>{recipe.title}</Text>
                        </TouchableOpacity>
                        <View style={styles.recipeDetailsContainer}>
                            <View style={styles.recipeDetailRow}>
                                <Ionicons name="time-outline" size={14} color="#666" />
                                <Text style={styles.recipeTime}>{recipe.cookingTime} min</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.trashIconContainer}
                                onPress={() => handleDeleteRecipe(recipe.id)}
                            >
                                <FontAwesome name="trash" size={20} color="#d9534f" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 1, 
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12, 
        marginHorizontal: 15,
        marginVertical: 15,
        paddingBottom: 5, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 28, 
        marginTop:10,
    },
    input: {
        width: '100%',
        padding: 10, 
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 8, 
        fontSize: 13,
    },
    multiLineInput: {
        height: 70, 
    },
    image: {
        width: '100%',
        height: 150,
        marginBottom: 8,
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10, 
    },
    inputWithIcon: {
        flex: 0.48,
        position: 'relative',
    },
    halfInput: {
        paddingRight: 22,
    },
    icon: {
        position: 'absolute',
        right: 8,
        top: '50%',
        transform: [{ translateY: -8 }],
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 15,
    },
    iconButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#28a745',
        borderRadius: 20,
        paddingVertical: 5, 
        paddingHorizontal: 8,
        flex: 0.45,
        justifyContent: 'center',
    },
    iconButtonText: {
        color: '#333',
        marginLeft: 5, 
        fontSize: 12,
    },
    saveButton: {
        position: 'absolute',
        top: 12,  
        right: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#28a745',
        paddingVertical: 10,  
        paddingHorizontal: 10,
        borderRadius: 12,  
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        marginBottom: 20, 
    },
    saveButtonText: {
        color: 'white',
        marginLeft: 6,
        fontSize: 15,  
        fontWeight: 'bold', 
    },
    noRecipesText: {
        textAlign: 'center',
        marginTop: 10, 
        fontSize: 14,
        color: '#666',
    },
    recipeCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        marginVertical: 5,
        marginHorizontal: 10, 
    },
    recipeImage: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    recipeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 5,
        textAlign: 'center',
    },
    recipeDetailsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        alignItems: 'center',
    },
    recipeDetailRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    recipeTime: {
        marginLeft: 5,
        color: '#666',
        fontSize: 12,
    },
    trashIconContainer: {
        marginLeft: 'auto',
    },
});




