import {
    CalorieCalculator,
    CalorieRecommendation,
} from "@/services/calorie-calculator";
import React, { useCallback, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface CalorieRecommendationComponentProps {
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female";
  bmi: number;
}

export const CalorieRecommendationComponent: React.FC<
  CalorieRecommendationComponentProps
> = ({ weight, height, age, gender, bmi }) => {
  const [activityLevel, setActivityLevel] = useState<
    "sedentary" | "light" | "moderate" | "active" | "very_active"
  >("moderate");
  const [recommendation, setRecommendation] =
    useState<CalorieRecommendation | null>(null);

  const calculateRecommendations = useCallback(() => {
    const rec = CalorieCalculator.getCalorieRecommendations(
      weight,
      height,
      age,
      gender,
      bmi,
      activityLevel,
    );
    setRecommendation(rec);
  }, [weight, height, age, gender, bmi, activityLevel]);

  React.useEffect(() => {
    calculateRecommendations();
  }, [calculateRecommendations]);

  const getGoalColor = (goal: string) => {
    switch (goal) {
      case "lose_weight":
        return "#EF4444";
      case "maintain":
        return "#10B981";
      case "gain_weight":
        return "#3B82F6";
      default:
        return "#6c757d";
    }
  };

  const getGoalText = (goal: string) => {
    switch (goal) {
      case "lose_weight":
        return "Weight Loss";
      case "maintain":
        return "Maintenance";
      case "gain_weight":
        return "Weight Gain";
      default:
        return "Unknown";
    }
  };

  const getActivityText = (level: string) => {
    switch (level) {
      case "sedentary":
        return "Sedentary";
      case "light":
        return "Light Activity";
      case "moderate":
        return "Moderate Activity";
      case "active":
        return "Active";
      case "very_active":
        return "Very Active";
      default:
        return level;
    }
  };

  if (!recommendation) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading recommendations...</Text>
      </View>
    );
  }

  const macroDistribution = CalorieCalculator.getMacroDistribution(
    recommendation.dailyCalories,
    recommendation.goal,
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily Calorie Recommendations</Text>

      <View style={styles.activitySelector}>
        <Text style={styles.sectionTitle}>Activity Level</Text>
        <View style={styles.activityButtons}>
          {(
            ["sedentary", "light", "moderate", "active", "very_active"] as const
          ).map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.activityButton,
                activityLevel === level && styles.activityButtonActive,
              ]}
              onPress={() => setActivityLevel(level)}
            >
              <Text
                style={[
                  styles.activityButtonText,
                  activityLevel === level && styles.activityButtonTextActive,
                ]}
              >
                {getActivityText(level)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.mainResult}>
        <View style={styles.calorieDisplay}>
          <Text style={styles.calorieValue}>
            {recommendation.dailyCalories}
          </Text>
          <Text style={styles.calorieLabel}>calories per day</Text>
          <View
            style={[
              styles.goalBadge,
              { backgroundColor: getGoalColor(recommendation.goal) },
            ]}
          >
            <Text style={styles.goalText}>
              {getGoalText(recommendation.goal)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meal Distribution</Text>
        <View style={styles.mealGrid}>
          <View style={styles.mealItem}>
            <Text style={styles.mealIcon}>🌅</Text>
            <Text style={styles.mealName}>Breakfast</Text>
            <Text style={styles.mealCalories}>
              {recommendation.recommendations.breakfast} cal
            </Text>
          </View>
          <View style={styles.mealItem}>
            <Text style={styles.mealIcon}>☀️</Text>
            <Text style={styles.mealName}>Lunch</Text>
            <Text style={styles.mealCalories}>
              {recommendation.recommendations.lunch} cal
            </Text>
          </View>
          <View style={styles.mealItem}>
            <Text style={styles.mealIcon}>🌙</Text>
            <Text style={styles.mealName}>Dinner</Text>
            <Text style={styles.mealCalories}>
              {recommendation.recommendations.dinner} cal
            </Text>
          </View>
          <View style={styles.mealItem}>
            <Text style={styles.mealIcon}>🍿</Text>
            <Text style={styles.mealName}>Snacks</Text>
            <Text style={styles.mealCalories}>
              {recommendation.recommendations.snacks} cal
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Macronutrient Distribution</Text>
        <View style={styles.macroContainer}>
          <View style={styles.macroItem}>
            <Text style={styles.macroName}>Protein</Text>
            <Text style={styles.macroValue}>{macroDistribution.protein}g</Text>
            <View style={styles.macroBar}>
              <View
                style={[
                  styles.macroFill,
                  { width: "35%", backgroundColor: "#3B82F6" },
                ]}
              />
            </View>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroName}>Carbs</Text>
            <Text style={styles.macroValue}>{macroDistribution.carbs}g</Text>
            <View style={styles.macroBar}>
              <View
                style={[
                  styles.macroFill,
                  { width: "40%", backgroundColor: "#10B981" },
                ]}
              />
            </View>
          </View>
          <View style={styles.macroItem}>
            <Text style={styles.macroName}>Fats</Text>
            <Text style={styles.macroValue}>{macroDistribution.fat}g</Text>
            <View style={styles.macroBar}>
              <View
                style={[
                  styles.macroFill,
                  { width: "25%", backgroundColor: "#F59E0B" },
                ]}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nutrition Tips</Text>
        <ScrollView
          style={styles.tipsContainer}
          showsVerticalScrollIndicator={false}
        >
          {recommendation.tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  activitySelector: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  activityButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  activityButton: {
    flex: 1,
    minWidth: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    alignItems: "center",
  },
  activityButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  activityButtonText: {
    fontSize: 12,
    color: "#6c757d",
    fontWeight: "500",
  },
  activityButtonTextActive: {
    color: "#ffffff",
  },
  mainResult: {
    alignItems: "center",
    paddingVertical: 20,
    marginBottom: 20,
  },
  calorieDisplay: {
    alignItems: "center",
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
  },
  calorieLabel: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 12,
  },
  goalBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  goalText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginBottom: 20,
  },
  mealGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  mealItem: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  mealIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 12,
    color: "#6c757d",
  },
  macroContainer: {
    gap: 12,
  },
  macroItem: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  macroName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 8,
  },
  macroBar: {
    height: 6,
    backgroundColor: "#e9ecef",
    borderRadius: 3,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: 3,
  },
  tipsContainer: {
    maxHeight: 200,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
});
