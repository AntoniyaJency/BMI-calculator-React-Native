export interface DietSuggestion {
  category: string;
  foods: string[];
  benefits: string[];
  portionSize: string;
  calories: number;
}

export interface DietPlan {
  goal: 'lose_weight' | 'maintain' | 'gain_weight';
  bmi: number;
  suggestions: {
    breakfast: DietSuggestion[];
    lunch: DietSuggestion[];
    dinner: DietSuggestion[];
    snacks: DietSuggestion[];
  };
  restrictions: string[];
  supplements: string[];
}

export class DietSuggestionEngine {
  static generateDietPlan(
    bmi: number,
    goal: 'lose_weight' | 'maintain' | 'gain_weight',
    gender: 'male' | 'female',
    age: number
  ): DietPlan {
    const suggestions = this.getMealSuggestions(goal, bmi);
    const restrictions = this.getDietaryRestrictions(bmi, age);
    const supplements = this.getSupplementRecommendations(goal, age, gender);

    return {
      goal,
      bmi,
      suggestions,
      restrictions,
      supplements,
    };
  }

  private static getMealSuggestions(
    goal: 'lose_weight' | 'maintain' | 'gain_weight',
    bmi: number
  ) {
    const baseSuggestions = {
      breakfast: this.getBreakfastSuggestions(goal),
      lunch: this.getLunchSuggestions(goal),
      dinner: this.getDinnerSuggestions(goal),
      snacks: this.getSnackSuggestions(goal),
    };

    return baseSuggestions;
  }

  private static getBreakfastSuggestions(goal: string): DietSuggestion[] {
    const suggestions: DietSuggestion[] = [
      {
        category: 'Protein-Rich',
        foods: ['Greek yogurt with berries', 'Eggs with whole grain toast', 'Protein smoothie'],
        benefits: ['Muscle maintenance', 'Satiety', 'Metabolism boost'],
        portionSize: '1 cup yogurt or 2 eggs',
        calories: goal === 'lose_weight' ? 250 : 350,
      },
      {
        category: 'Complex Carbs',
        foods: ['Oatmeal with nuts', 'Whole grain cereal', 'Quinoa porridge'],
        benefits: ['Sustained energy', 'Fiber', 'Heart health'],
        portionSize: '1/2 cup cooked',
        calories: goal === 'lose_weight' ? 150 : 250,
      },
    ];

    if (goal === 'gain_weight') {
      suggestions.push({
        category: 'High-Calorie',
        foods: ['Avocado toast with eggs', 'Nut butter banana sandwich', 'Smoothie with protein powder'],
        benefits: ['Healthy fats', 'Calorie density', 'Muscle building'],
        portionSize: '2 slices bread + 1/2 avocado',
        calories: 450,
      });
    }

    return suggestions;
  }

  private static getLunchSuggestions(goal: string): DietSuggestion[] {
    const suggestions: DietSuggestion[] = [
      {
        category: 'Lean Protein',
        foods: ['Grilled chicken salad', 'Turkey wrap', 'Fish with vegetables'],
        benefits: ['Muscle building', 'Low fat', 'High protein'],
        portionSize: '4-6 oz protein',
        calories: goal === 'lose_weight' ? 300 : 400,
      },
      {
        category: 'Plant-Based',
        foods: ['Lentil soup', 'Chickpea curry', 'Tofu stir-fry'],
        benefits: ['Fiber rich', 'Antioxidants', 'Heart healthy'],
        portionSize: '1.5 cups',
        calories: goal === 'lose_weight' ? 280 : 380,
      },
    ];

    if (goal === 'gain_weight') {
      suggestions.push({
        category: 'Balanced Meal',
        foods: ['Salmon with quinoa', 'Beef bowl with rice', 'Pasta with lean meat sauce'],
        benefits: ['Complete nutrition', 'Energy dense', 'Recovery'],
        portionSize: '6 oz protein + 1 cup grains',
        calories: 550,
      });
    }

    return suggestions;
  }

  private static getDinnerSuggestions(goal: string): DietSuggestion[] {
    const suggestions: DietSuggestion[] = [
      {
        category: 'Light & Healthy',
        foods: ['Vegetable stir-fry', 'Clear soup with vegetables', 'Grilled fish with asparagus'],
        benefits: ['Easy digestion', 'Low calorie', 'Nutrient dense'],
        portionSize: '2-3 cups vegetables',
        calories: goal === 'lose_weight' ? 250 : 350,
      },
      {
        category: 'Balanced Dinner',
        foods: ['Chicken with roasted vegetables', 'Lean beef with sweet potato', 'Shrimp pasta'],
        benefits: ['Complete meal', 'Satisfaction', 'Nutrition balance'],
        portionSize: '4 oz protein + 1 cup vegetables',
        calories: goal === 'lose_weight' ? 350 : 450,
      },
    ];

    if (goal === 'gain_weight') {
      suggestions.push({
        category: 'Substantial',
        foods: ['Steak with potatoes', 'Chicken curry with rice', 'Pasta with meat sauce'],
        benefits: ['High protein', 'Energy rich', 'Muscle recovery'],
        portionSize: '6 oz protein + 1.5 cups carbs',
        calories: 600,
      });
    }

    return suggestions;
  }

  private static getSnackSuggestions(goal: string): DietSuggestion[] {
    const baseCalories = goal === 'lose_weight' ? 100 : 150;
    const gainWeightCalories = 200;

    const suggestions: DietSuggestion[] = [
      {
        category: 'Healthy Snacks',
        foods: ['Mixed nuts', 'Apple with peanut butter', 'Greek yogurt'],
        benefits: ['Healthy fats', 'Fiber', 'Protein'],
        portionSize: '1/4 cup nuts or 1 fruit',
        calories: baseCalories,
      },
      {
        category: 'Light Options',
        foods: ['Vegetable sticks', 'Rice cakes', 'Herbal tea'],
        benefits: ['Low calorie', 'Hydration', 'Craving control'],
        portionSize: '1 cup vegetables or 2 cakes',
        calories: goal === 'lose_weight' ? 50 : 80,
      },
    ];

    if (goal === 'gain_weight') {
      suggestions.push({
        category: 'High-Calorie Snacks',
        foods: ['Trail mix', 'Protein bar', 'Cheese with crackers'],
        benefits: ['Energy dense', 'Convenient', 'Nutrient rich'],
        portionSize: '1/3 cup mix or 1 bar',
        calories: gainWeightCalories,
      });
    }

    return suggestions;
  }

  private static getDietaryRestrictions(bmi: number, age: number): string[] {
    const restrictions: string[] = [];

    if (bmi >= 30) {
      restrictions.push('Limit processed foods and sugars');
      restrictions.push('Reduce sodium intake');
      restrictions.push('Avoid fried foods');
    } else if (bmi < 18.5) {
      restrictions.push('Avoid excessive fiber that may cause fullness');
      restrictions.push('Limit empty calorie foods');
    }

    if (age > 50) {
      restrictions.push('Increase calcium and vitamin D');
      restrictions.push('Monitor sodium for blood pressure');
    }

    if (age < 25) {
      restrictions.push('Ensure adequate protein for development');
    }

    return restrictions;
  }

  private static getSupplementRecommendations(
    goal: string,
    age: number,
    gender: string
  ): string[] {
    const supplements: string[] = [];

    // General recommendations
    supplements.push('Multivitamin (daily)');
    supplements.push('Omega-3 fatty acids');

    if (goal === 'lose_weight') {
      supplements.push('Vitamin D (supports metabolism)');
      supplements.push('B-complex vitamins (energy)');
    } else if (goal === 'gain_weight') {
      supplements.push('Creatine (muscle building)');
      supplements.push('Vitamin B12 (energy production)');
    }

    if (age > 40) {
      supplements.push('Calcium (bone health)');
      supplements.push('Magnesium (muscle function)');
    }

    if (gender === 'female' && age < 50) {
      supplements.push('Iron (if deficient)');
      supplements.push('Folic acid');
    }

    return supplements;
  }

  static getHydrationRecommendations(weight: number, activityLevel: string): string[] {
    const baseWater = Math.round(weight * 0.033); // 33ml per kg
    const recommendations: string[] = [];

    recommendations.push(`Drink at least ${baseWater} liters of water daily`);

    if (activityLevel === 'active' || activityLevel === 'very_active') {
      recommendations.push('Add 500ml for each hour of exercise');
    }

    recommendations.push('Drink water before, during, and after meals');
    recommendations.push('Monitor urine color for hydration status');
    recommendations.push('Limit caffeine and alcohol intake');

    return recommendations;
  }
}
