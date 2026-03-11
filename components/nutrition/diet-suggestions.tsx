import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { DietSuggestionEngine, DietPlan, DietSuggestion } from '@/services/diet-suggestion-engine';

interface DietSuggestionsComponentProps {
  bmi: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  goal: 'lose_weight' | 'maintain' | 'gain_weight';
}

export const DietSuggestionsComponent: React.FC<DietSuggestionsComponentProps> = ({
  bmi,
  weight,
  age,
  gender,
  goal,
}) => {
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast');
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);

  React.useEffect(() => {
    const plan = DietSuggestionEngine.generateDietPlan(bmi, goal, gender, age);
    setDietPlan(plan);
  }, [bmi, goal, gender, age]);

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case 'lose_weight': return '#EF4444';
      case 'maintain': return '#10B981';
      case 'gain_weight': return '#3B82F6';
      default: return '#6c757d';
    }
  };

  const getGoalText = (goal: string) => {
    switch (goal) {
      case 'lose_weight': return 'Weight Loss';
      case 'maintain': return 'Maintenance';
      case 'gain_weight': return 'Weight Gain';
      default: return 'Unknown';
    }
  };

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snacks': return '🍿';
      default: return '🍽️';
    }
  };

  const renderDietSuggestion = (suggestion: DietSuggestion, index: number) => (
    <View key={index} style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <Text style={styles.suggestionCategory}>{suggestion.category}</Text>
        <Text style={styles.suggestionCalories}>{suggestion.calories} cal</Text>
      </View>
      
      <View style={styles.suggestionContent}>
        <Text style={styles.suggestionTitle}>Food Options:</Text>
        {suggestion.foods.map((food, idx) => (
          <Text key={idx} style={styles.foodItem}>• {food}</Text>
        ))}
        
        <Text style={styles.suggestionTitle}>Benefits:</Text>
        {suggestion.benefits.map((benefit, idx) => (
          <Text key={idx} style={styles.benefitItem}>✓ {benefit}</Text>
        ))}
        
        <View style={styles.portionContainer}>
          <Text style={styles.portionLabel}>Portion Size:</Text>
          <Text style={styles.portionText}>{suggestion.portionSize}</Text>
        </View>
      </View>
    </View>
  );

  if (!dietPlan) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading diet suggestions...</Text>
      </View>
    );
  }

  const hydrationTips = DietSuggestionEngine.getHydrationRecommendations(weight, 'moderate');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Personalized Diet Plan</Text>
        <View style={[styles.goalBadge, { backgroundColor: getGoalColor(goal) }]}>
          <Text style={styles.goalText}>{getGoalText(goal)}</Text>
        </View>
      </View>

      <View style={styles.mealSelector}>
        {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((meal) => (
          <TouchableOpacity
            key={meal}
            style={[
              styles.mealButton,
              selectedMeal === meal && styles.mealButtonActive,
            ]}
            onPress={() => setSelectedMeal(meal)}
          >
            <Text style={styles.mealIcon}>{getMealIcon(meal)}</Text>
            <Text
              style={[
                styles.mealButtonText,
                selectedMeal === meal && styles.mealButtonTextActive,
              ]}
            >
              {meal.charAt(0).toUpperCase() + meal.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.sectionTitle}>
          {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} Suggestions
        </Text>
        {dietPlan.suggestions[selectedMeal].map((suggestion, index) =>
          renderDietSuggestion(suggestion, index)
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dietary Restrictions</Text>
        {dietPlan.restrictions.map((restriction, index) => (
          <View key={index} style={styles.restrictionItem}>
            <Text style={styles.restrictionIcon}>⚠️</Text>
            <Text style={styles.restrictionText}>{restriction}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Supplements</Text>
        <View style={styles.supplementsGrid}>
          {dietPlan.supplements.map((supplement, index) => (
            <View key={index} style={styles.supplementItem}>
              <Text style={styles.supplementIcon}>💊</Text>
              <Text style={styles.supplementText}>{supplement}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hydration Tips</Text>
        {hydrationTips.map((tip, index) => (
          <View key={index} style={styles.hydrationItem}>
            <Text style={styles.hydrationIcon}>💧</Text>
            <Text style={styles.hydrationText}>{tip}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.infoButton}
        onPress={() => {
          Alert.alert(
            'Diet Plan Information',
            'This diet plan is generated based on your BMI and goals. Consult with a healthcare professional or registered dietitian before making significant dietary changes.',
            [{ text: 'OK' }]
          );
        }}
      >
        <Text style={styles.infoButtonText}>ℹ️ Important Disclaimer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  goalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goalText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  mealSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  mealButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealButtonActive: {
    backgroundColor: '#007AFF',
  },
  mealIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  mealButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6c757d',
  },
  mealButtonTextActive: {
    color: '#ffffff',
  },
  suggestionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  suggestionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  suggestionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  suggestionCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  suggestionContent: {
    gap: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  foodItem: {
    fontSize: 14,
    color: '#495057',
    marginLeft: 8,
    marginBottom: 2,
  },
  benefitItem: {
    fontSize: 14,
    color: '#10B981',
    marginLeft: 8,
    marginBottom: 2,
  },
  portionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
  },
  portionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
    marginRight: 8,
  },
  portionText: {
    fontSize: 12,
    color: '#6c757d',
  },
  section: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  restrictionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  restrictionIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  restrictionText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  supplementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  supplementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 8,
    flex: 1,
    minWidth: 150,
  },
  supplementIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  supplementText: {
    flex: 1,
    fontSize: 12,
    color: '#495057',
  },
  hydrationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hydrationIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  hydrationText: {
    flex: 1,
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  infoButton: {
    backgroundColor: '#f8f9fa',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  infoButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
  },
});
