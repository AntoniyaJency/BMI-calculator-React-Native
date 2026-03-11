import { BannerAdComponent } from "@/components/ads/banner-ad";
import { useInterstitialAd } from "@/components/ads/interstitial-ad";
import { BMIProgressChart } from "@/components/charts/bmi-progress-chart";
import { CalorieRecommendationComponent } from "@/components/nutrition/calorie-recommendation";
import { DietSuggestionsComponent } from "@/components/nutrition/diet-suggestions";
import { PremiumUpgradeScreen } from "@/components/premium/premium-upgrade-screen";
import { HealthReportGenerator } from "@/components/reports/health-report-generator";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { usePremium } from "@/contexts/premium-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { BMIRecord, BMIStorage } from "@/services/bmi-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function BMICalculatorScreen() {
  const colorScheme = useColorScheme();
  const { isPremium, premiumFeatures } = usePremium();
  const { showInterstitial } = useInterstitialAd({
    onAdClosed: () => {
      console.log("Interstitial ad closed");
    },
  });

  const [heightValue, setHeightValue] = useState("");
  const [weightValue, setWeightValue] = useState("");
  const [ageValue, setAgeValue] = useState("");
  const [gender, setGender] = useState<"male" | "female" | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "calculator" | "chart" | "calories" | "diet" | "report"
  >("calculator");
  const [bmiHistory, setBmiHistory] = useState<BMIRecord[]>([]);

  const calculateBMI = async () => {
    if (!heightValue || !weightValue || !ageValue || !gender) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields and select your gender.",
      );
      return;
    }

    let heightInMeters: number;
    let weightInKg: number;

    if (unit === "metric") {
      heightInMeters = parseFloat(heightValue) / 100;
      weightInKg = parseFloat(weightValue);
    } else {
      heightInMeters = (parseFloat(heightValue) * 2.54) / 100;
      weightInKg = parseFloat(weightValue) * 0.453592;
    }

    if (heightInMeters <= 0 || weightInKg <= 0) {
      Alert.alert(
        "Invalid Values",
        "Please enter valid height and weight values.",
      );
      return;
    }

    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    const roundedBMI = Math.round(bmiValue * 10) / 10;
    setBmi(roundedBMI);

    let bmiCategory = "";
    if (bmiValue < 18.5) bmiCategory = "Underweight";
    else if (bmiValue < 25) bmiCategory = "Normal weight";
    else if (bmiValue < 30) bmiCategory = "Overweight";
    else bmiCategory = "Obese";

    setCategory(bmiCategory);

    // Save to history if premium
    if (isPremium && premiumFeatures.weightHistory) {
      try {
        await BMIStorage.saveBMIRecord({
          bmi: roundedBMI,
          category: bmiCategory,
          height: parseFloat(heightValue),
          weight: parseFloat(weightValue),
          age: parseInt(ageValue),
          gender,
          unit,
        });
        loadBMIHistory();
      } catch (error) {
        console.error("Error saving BMI record:", error);
      }
    }

    // Show interstitial ad for free users
    if (!isPremium) {
      setTimeout(() => {
        showInterstitial();
      }, 1000);
    }
  };

  const loadBMIHistory = async () => {
    try {
      const history = await BMIStorage.getBMIHistory();
      setBmiHistory(history);
    } catch (error) {
      console.error("Error loading BMI history:", error);
    }
  };

  useEffect(() => {
    if (isPremium && premiumFeatures.weightHistory) {
      loadBMIHistory();
    }
  }, [isPremium, premiumFeatures.weightHistory]);

  const resetCalculator = () => {
    setHeightValue("");
    setWeightValue("");
    setAgeValue("");
    setGender(null);
    setBmi(null);
    setCategory("");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Underweight":
        return "#3B82F6";
      case "Normal weight":
        return "#10B981";
      case "Overweight":
        return "#F59E0B";
      case "Obese":
        return "#EF4444";
      default:
        return colorScheme === "dark" ? "#fff" : "#000";
    }
  };

  const handleFeatureAccess = (feature: string) => {
    if (!isPremium) {
      setShowPremiumModal(true);
    }
  };

  const getCalorieGoal = () => {
    if (!bmi || !gender || !ageValue || !heightValue || !weightValue)
      return "maintain";

    if (bmi < 18.5) return "gain_weight";
    if (bmi >= 25) return "lose_weight";
    return "maintain";
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerIcon}>
              <Text style={styles.iconText}>❤️</Text>
            </View>
            <View style={styles.titleContainer}>
              <ThemedText type="title" style={styles.title}>
                BMI Calculator
              </ThemedText>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>⭐ Premium</Text>
                </View>
              )}
            </View>
          </View>
          <ThemedText style={styles.subtitle}>
            Professional Health Assessment Tool
          </ThemedText>
          <View style={styles.headerLine} />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "calculator" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("calculator")}
          >
            <Text
              style={[
                styles.tabButtonText,
                activeTab === "calculator" && styles.tabButtonTextActive,
              ]}
            >
              Calculator
            </Text>
          </TouchableOpacity>

          {isPremium || premiumFeatures.bmiProgressChart ? (
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "chart" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("chart")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "chart" && styles.tabButtonTextActive,
                ]}
              >
                Progress
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.tabButton, styles.tabButtonDisabled]}
              onPress={() => handleFeatureAccess("chart")}
            >
              <Text style={styles.tabButtonText}>🔒 Progress</Text>
            </TouchableOpacity>
          )}

          {isPremium || premiumFeatures.calorieRecommendation ? (
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "calories" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("calories")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "calories" && styles.tabButtonTextActive,
                ]}
              >
                Calories
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.tabButton, styles.tabButtonDisabled]}
              onPress={() => handleFeatureAccess("calories")}
            >
              <Text style={styles.tabButtonText}>🔒 Calories</Text>
            </TouchableOpacity>
          )}

          {isPremium || premiumFeatures.dietSuggestions ? (
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "diet" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("diet")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "diet" && styles.tabButtonTextActive,
                ]}
              >
                Diet
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.tabButton, styles.tabButtonDisabled]}
              onPress={() => handleFeatureAccess("diet")}
            >
              <Text style={styles.tabButtonText}>🔒 Diet</Text>
            </TouchableOpacity>
          )}

          {isPremium || premiumFeatures.pdfReports ? (
            <TouchableOpacity
              style={[
                styles.tabButton,
                activeTab === "report" && styles.tabButtonActive,
              ]}
              onPress={() => setActiveTab("report")}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === "report" && styles.tabButtonTextActive,
                ]}
              >
                Report
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.tabButton, styles.tabButtonDisabled]}
              onPress={() => handleFeatureAccess("report")}
            >
              <Text style={styles.tabButtonText}>🔒 Report</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Content */}
        {activeTab === "calculator" && (
          <>
            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                Measurement Units
              </ThemedText>
              <View style={styles.unitToggle}>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    unit === "metric" && styles.unitButtonActive,
                  ]}
                  onPress={() => setUnit("metric")}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      unit === "metric" && styles.unitButtonTextActive,
                    ]}
                  >
                    Metric
                  </Text>
                  <Text
                    style={[
                      styles.unitSubtext,
                      unit === "metric" && styles.unitButtonTextActive,
                    ]}
                  >
                    cm / kg
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unitButton,
                    unit === "imperial" && styles.unitButtonActive,
                  ]}
                  onPress={() => setUnit("imperial")}
                >
                  <Text
                    style={[
                      styles.unitButtonText,
                      unit === "imperial" && styles.unitButtonTextActive,
                    ]}
                  >
                    Imperial
                  </Text>
                  <Text
                    style={[
                      styles.unitSubtext,
                      unit === "imperial" && styles.unitButtonTextActive,
                    ]}
                  >
                    in / lbs
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.card}>
              <ThemedText style={styles.cardTitle}>
                Personal Information
              </ThemedText>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>Height</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={heightValue}
                      onChangeText={setHeightValue}
                      placeholder={`Enter height`}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    <Text style={styles.inputUnit}>
                      {unit === "metric" ? "cm" : "in"}
                    </Text>
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Weight</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      value={weightValue}
                      onChangeText={setWeightValue}
                      placeholder={`Enter weight`}
                      keyboardType="numeric"
                      placeholderTextColor="#999"
                    />
                    <Text style={styles.inputUnit}>
                      {unit === "metric" ? "kg" : "lbs"}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Age</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    value={ageValue}
                    onChangeText={setAgeValue}
                    placeholder="Enter your age"
                    keyboardType="numeric"
                    placeholderTextColor="#999"
                  />
                  <Text style={styles.inputUnit}>years</Text>
                </View>
              </View>

              <View style={styles.genderContainer}>
                <Text style={styles.inputLabel}>Gender</Text>
                <View style={styles.genderButtons}>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "male" && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender("male")}
                  >
                    <Text style={styles.genderIcon}>👨</Text>
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "male" && styles.genderButtonTextActive,
                      ]}
                    >
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.genderButton,
                      gender === "female" && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender("female")}
                  >
                    <Text style={styles.genderIcon}>👩</Text>
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === "female" && styles.genderButtonTextActive,
                      ]}
                    >
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.calculateButton}
                onPress={calculateBMI}
              >
                <Text style={styles.calculateButtonText}>Calculate BMI</Text>
                <Text style={styles.calculateButtonSubtext}>
                  Get your health assessment
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculator}
              >
                <Text style={styles.resetButtonText}>↻ Reset</Text>
              </TouchableOpacity>
            </View>

            {bmi !== null && (
              <View style={styles.resultContainer}>
                <View style={styles.resultHeader}>
                  <ThemedText type="title" style={styles.resultTitle}>
                    Your BMI Analysis
                  </ThemedText>
                  <View
                    style={[
                      styles.resultBadge,
                      { backgroundColor: getCategoryColor(category) },
                    ]}
                  >
                    <Text style={styles.resultBadgeText}>{category}</Text>
                  </View>
                </View>

                <View style={styles.bmiDisplay}>
                  <View style={styles.bmiMain}>
                    <Text
                      style={[
                        styles.bmiValue,
                        { color: getCategoryColor(category) },
                      ]}
                    >
                      {bmi}
                    </Text>
                    <Text style={styles.bmiLabel}>Body Mass Index</Text>
                  </View>

                  <View style={styles.bmiScale}>
                    <Text style={styles.scaleTitle}>BMI Categories</Text>
                    <View style={styles.scale}>
                      <View
                        style={[
                          styles.scaleSegment,
                          { backgroundColor: "#3B82F6" },
                        ]}
                      />
                      <View
                        style={[
                          styles.scaleSegment,
                          { backgroundColor: "#10B981" },
                        ]}
                      />
                      <View
                        style={[
                          styles.scaleSegment,
                          { backgroundColor: "#F59E0B" },
                        ]}
                      />
                      <View
                        style={[
                          styles.scaleSegment,
                          { backgroundColor: "#EF4444" },
                        ]}
                      />
                    </View>
                    <View style={styles.scaleLabels}>
                      <View style={styles.scaleLabelItem}>
                        <Text style={styles.scaleValue}>&lt;18.5</Text>
                        <Text style={styles.scaleName}>Under</Text>
                      </View>
                      <View style={styles.scaleLabelItem}>
                        <Text style={styles.scaleValue}>18.5-24.9</Text>
                        <Text style={styles.scaleName}>Normal</Text>
                      </View>
                      <View style={styles.scaleLabelItem}>
                        <Text style={styles.scaleValue}>25-29.9</Text>
                        <Text style={styles.scaleName}>Over</Text>
                      </View>
                      <View style={styles.scaleLabelItem}>
                        <Text style={styles.scaleValue}>&gt;30</Text>
                        <Text style={styles.scaleName}>Obese</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.recommendationContainer}>
                  <Text style={styles.recommendationTitle}>
                    Health Recommendations
                  </Text>
                  <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationIcon}>💡</Text>
                    <Text style={styles.recommendationText}>
                      {category === "Underweight" &&
                        "Consider consulting a nutritionist for healthy weight gain strategies. Focus on nutrient-dense foods and strength training."}
                      {category === "Normal weight" &&
                        "Excellent! Maintain your healthy lifestyle with balanced diet and regular exercise. Continue monitoring your health metrics."}
                      {category === "Overweight" &&
                        "Consider increasing physical activity to 150 minutes per week and monitoring your diet. Focus on portion control and whole foods."}
                      {category === "Obese" &&
                        "Consult with a healthcare provider for a comprehensive weight management plan. Consider working with a dietitian and exercise specialist."}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </>
        )}

        {activeTab === "chart" && bmi && (
          <BMIProgressChart
            data={bmiHistory}
            color={getCategoryColor(category)}
          />
        )}

        {activeTab === "calories" &&
          bmi &&
          gender &&
          ageValue &&
          heightValue &&
          weightValue && (
            <CalorieRecommendationComponent
              weight={parseFloat(weightValue)}
              height={parseFloat(heightValue)}
              age={parseInt(ageValue)}
              gender={gender}
              bmi={bmi}
            />
          )}

        {activeTab === "diet" && bmi && gender && ageValue && (
          <DietSuggestionsComponent
            bmi={bmi}
            weight={parseFloat(weightValue)}
            age={parseInt(ageValue)}
            gender={gender}
            goal={getCalorieGoal()}
          />
        )}

        {activeTab === "report" && bmi && (
          <HealthReportGenerator
            currentBMI={bmi}
            category={category}
            height={parseFloat(heightValue)}
            weight={parseFloat(weightValue)}
            age={parseInt(ageValue)}
            gender={gender!}
            unit={unit}
            history={bmiHistory}
          />
        )}

        {/* Banner Ad for free users */}
        {!isPremium && <BannerAdComponent />}

        {/* Premium Upgrade Modal */}
        <Modal
          visible={showPremiumModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <PremiumUpgradeScreen onClose={() => setShowPremiumModal(false)} />
        </Modal>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  premiumBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e3f2fd",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconText: {
    fontSize: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 0,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "400",
  },
  headerLine: {
    height: 2,
    backgroundColor: "#e9ecef",
    width: 100,
    borderRadius: 1,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  unitToggle: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 6,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  unitButtonActive: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6c757d",
    marginBottom: 2,
  },
  unitButtonTextActive: {
    color: "#ffffff",
  },
  unitSubtext: {
    fontSize: 12,
    color: "#6c757d",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
  },
  inputUnit: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  genderContainer: {
    marginBottom: 20,
  },
  genderButtons: {
    flexDirection: "row",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    backgroundColor: "#f8f9fa",
    alignItems: "center",
  },
  genderButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  genderIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6c757d",
  },
  genderButtonTextActive: {
    color: "#ffffff",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },
  calculateButton: {
    flex: 2,
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  calculateButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  calculateButtonSubtext: {
    color: "#ffffff",
    fontSize: 12,
    opacity: 0.8,
  },
  resetButton: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#e9ecef",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  resetButtonText: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "600",
  },
  resultContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 0,
  },
  resultBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  resultBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  bmiDisplay: {
    marginBottom: 24,
  },
  bmiMain: {
    alignItems: "center",
    marginBottom: 24,
  },
  bmiValue: {
    fontSize: 72,
    fontWeight: "700",
    lineHeight: 80,
  },
  bmiLabel: {
    fontSize: 14,
    color: "#6c757d",
    fontWeight: "500",
  },
  bmiScale: {
    marginBottom: 24,
  },
  scaleTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  scale: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  scaleSegment: {
    flex: 1,
  },
  scaleLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  scaleLabelItem: {
    alignItems: "center",
    flex: 1,
  },
  scaleValue: {
    fontSize: 10,
    color: "#6c757d",
    fontWeight: "500",
    textAlign: "center",
  },
  scaleName: {
    fontSize: 11,
    color: "#6c757d",
    fontWeight: "600",
    textAlign: "center",
  },
  recommendationContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  recommendationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  recommendationIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 2,
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: "#495057",
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 6,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonActive: {
    backgroundColor: "#007AFF",
  },
  tabButtonDisabled: {
    opacity: 0.6,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6c757d",
  },
  tabButtonTextActive: {
    color: "#ffffff",
  },
});
