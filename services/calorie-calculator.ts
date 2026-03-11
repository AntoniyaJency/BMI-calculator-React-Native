export interface CalorieRecommendation {
  dailyCalories: number;
  goal: 'lose_weight' | 'maintain' | 'gain_weight';
  recommendations: {
    breakfast: number;
    lunch: number;
    dinner: number;
    snacks: number;
  };
  tips: string[];
}

export class CalorieCalculator {
  static calculateDailyCalories(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female',
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' = 'moderate'
  ): number {
    // Mifflin-St Jeor Equation
    let bmr: number;
    
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,      // Little or no exercise
      light: 1.375,        // Light exercise 1-3 days/week
      moderate: 1.55,      // Moderate exercise 3-5 days/week
      active: 1.725,       // Hard exercise 6-7 days/week
      very_active: 1.9,    // Very hard exercise & physical job
    };

    return Math.round(bmr * activityMultipliers[activityLevel]);
  }

  static getCalorieRecommendations(
    weight: number,
    height: number,
    age: number,
    gender: 'male' | 'female',
    bmi: number,
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' = 'moderate'
  ): CalorieRecommendation {
    const dailyCalories = this.calculateDailyCalories(weight, height, age, gender, activityLevel);
    
    let goal: 'lose_weight' | 'maintain' | 'gain_weight';
    let adjustedCalories = dailyCalories;
    
    // Determine goal based on BMI
    if (bmi < 18.5) {
      goal = 'gain_weight';
      adjustedCalories = dailyCalories + 500; // 500 calorie surplus for weight gain
    } else if (bmi >= 25) {
      goal = 'lose_weight';
      adjustedCalories = dailyCalories - 500; // 500 calorie deficit for weight loss
    } else {
      goal = 'maintain';
      adjustedCalories = dailyCalories;
    }

    // Distribute calories throughout the day
    const recommendations = {
      breakfast: Math.round(adjustedCalories * 0.25),  // 25%
      lunch: Math.round(adjustedCalories * 0.35),     // 35%
      dinner: Math.round(adjustedCalories * 0.30),    // 30%
      snacks: Math.round(adjustedCalories * 0.10),   // 10%
    };

    const tips = this.getNutritionTips(goal, bmi);

    return {
      dailyCalories: adjustedCalories,
      goal,
      recommendations,
      tips,
    };
  }

  private static getNutritionTips(
    goal: 'lose_weight' | 'maintain' | 'gain_weight',
    bmi: number
  ): string[] {
    const tips: string[] = [];

    if (goal === 'lose_weight') {
      tips.push('Focus on whole, unprocessed foods');
      tips.push('Increase protein intake to preserve muscle mass');
      tips.push('Drink plenty of water (8-10 glasses daily)');
      tips.push('Limit sugary drinks and empty calories');
      tips.push('Include fiber-rich vegetables for satiety');
      tips.push('Practice portion control and mindful eating');
    } else if (goal === 'gain_weight') {
      tips.push('Eat calorie-dense, nutritious foods');
      tips.push('Include healthy fats (nuts, avocado, olive oil)');
      tips.push('Consume protein with every meal');
      tips.push('Eat 5-6 smaller meals throughout the day');
      tips.push('Add strength training to build muscle');
      tips.push('Choose complex carbs for sustained energy');
    } else {
      tips.push('Maintain a balanced macronutrient ratio');
      tips.push('Eat a variety of colorful vegetables');
      tips.push('Include lean proteins in most meals');
      tips.push('Choose whole grains over refined grains');
      tips.push('Limit processed foods and added sugars');
      tips.push('Stay hydrated and listen to hunger cues');
    }

    // Add BMI-specific tips
    if (bmi < 18.5) {
      tips.push('Consult a healthcare provider for healthy weight gain');
    } else if (bmi >= 30) {
      tips.push('Consider professional guidance for safe weight loss');
    }

    return tips;
  }

  static getMacroDistribution(
    dailyCalories: number,
    goal: 'lose_weight' | 'maintain' | 'gain_weight'
  ) {
    let proteinRatio: number;
    let fatRatio: number;
    let carbRatio: number;

    if (goal === 'lose_weight') {
      proteinRatio = 0.35;  // Higher protein for satiety
      fatRatio = 0.30;
      carbRatio = 0.35;
    } else if (goal === 'gain_weight') {
      proteinRatio = 0.25;
      fatRatio = 0.25;
      carbRatio = 0.50;  // Higher carbs for energy
    } else {
      proteinRatio = 0.30;
      fatRatio = 0.30;
      carbRatio = 0.40;
    }

    return {
      protein: Math.round((dailyCalories * proteinRatio) / 4),  // 4 calories per gram
      fat: Math.round((dailyCalories * fatRatio) / 9),          // 9 calories per gram
      carbs: Math.round((dailyCalories * carbRatio) / 4),      // 4 calories per gram
    };
  }
}
