import { usePremium } from "@/contexts/premium-context";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export const PremiumUpgradeScreen: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { isPremium, purchasePremium, isLoading } = usePremium();

  const handlePurchase = async () => {
    try {
      await purchasePremium();
      Alert.alert(
        "Purchase Successful!",
        "Thank you for upgrading to Premium! You now have access to all premium features.",
        [{ text: "OK", onPress: onClose }],
      );
    } catch {
      Alert.alert(
        "Purchase Failed",
        "There was an error processing your purchase. Please try again.",
        [{ text: "OK" }],
      );
    }
  };

  if (isPremium) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🎉 Premium Active</Text>
          <Text style={styles.subtitle}>
            You have access to all premium features!
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⭐</Text>
          </View>
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>
            Unlock all features and support our app
          </Text>
        </View>

        <View style={styles.pricingContainer}>
          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>One-Time Purchase</Text>
            <Text style={styles.pricingPrice}>$4.99</Text>
            <Text style={styles.pricingDescription}>
              Lifetime access to all premium features
            </Text>
          </View>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Premium Features</Text>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>📊</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Weight History Tracking</Text>
              <Text style={styles.featureDescription}>
                Track your weight changes over time with detailed history
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>📈</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>BMI Progress Charts</Text>
              <Text style={styles.featureDescription}>
                Visualize your BMI trends with beautiful charts
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🍽️</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Calorie Recommendations</Text>
              <Text style={styles.featureDescription}>
                Get personalized daily calorie recommendations
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🥗</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Diet Suggestions</Text>
              <Text style={styles.featureDescription}>
                Receive personalized diet recommendations based on your goals
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>📄</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>PDF Health Reports</Text>
              <Text style={styles.featureDescription}>
                Generate and download detailed health reports
              </Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Text style={styles.featureIconText}>🚫</Text>
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>No Ads</Text>
              <Text style={styles.featureDescription}>
                Enjoy an ad-free experience throughout the app
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.purchaseButton}
            onPress={handlePurchase}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.purchaseButtonText}>Upgrade to Premium</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Maybe Later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    lineHeight: 24,
  },
  pricingContainer: {
    marginBottom: 30,
  },
  pricingCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  pricingPrice: {
    fontSize: 36,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 8,
  },
  pricingDescription: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureIconText: {
    fontSize: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6c757d",
    lineHeight: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  purchaseButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
  },
  closeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
