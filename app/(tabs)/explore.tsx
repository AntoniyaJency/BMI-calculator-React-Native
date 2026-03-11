import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface BMIRecord {
  id: string;
  date: string;
  bmi: number;
  category: string;
  height: number;
  weight: number;
  age: number;
  gender: "male" | "female";
  unit: "metric" | "imperial";
}

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const [history, setHistory] = useState<BMIRecord[]>([]);

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
    statsContainer: {
      flexDirection: "row",
      marginBottom: 25,
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: "#ffffff",
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    statIcon: {
      fontSize: 24,
      marginBottom: 8,
    },
    statLabel: {
      fontSize: 12,
      color: "#6c757d",
      marginBottom: 8,
      fontWeight: "500",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1a1a1a",
    },
    trendValue: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1a1a1a",
    },
    historyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    historyTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1a1a1a",
    },
    list: {
      paddingBottom: 20,
    },
    historyItem: {
      backgroundColor: "#ffffff",
      borderRadius: 16,
      padding: 20,
      marginBottom: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    date: {
      fontSize: 16,
      fontWeight: "600",
      color: "#1a1a1a",
    },
    categoryBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
    },
    categoryText: {
      color: "#fff",
      fontSize: 12,
      fontWeight: "600",
    },
    bmiDisplay: {
      flexDirection: "row",
      alignItems: "baseline",
      marginBottom: 15,
    },
    bmiValue: {
      fontSize: 48,
      fontWeight: "700",
      marginRight: 10,
    },
    bmiLabel: {
      fontSize: 14,
      color: "#6c757d",
      fontWeight: "500",
    },
    details: {
      gap: 8,
    },
    detailText: {
      fontSize: 14,
      color: "#6c757d",
    },
    clearButton: {
      backgroundColor: "#f8f9fa",
      borderWidth: 1,
      borderColor: "#e9ecef",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    clearButtonText: {
      color: "#6c757d",
      fontSize: 14,
      fontWeight: "600",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "#f8f9fa",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    emptyIconText: {
      fontSize: 40,
    },
    emptyText: {
      fontSize: 20,
      fontWeight: "700",
      color: "#1a1a1a",
      marginBottom: 10,
      textAlign: "center",
    },
    emptySubtext: {
      fontSize: 16,
      color: "#6c757d",
      textAlign: "center",
      marginBottom: 30,
      lineHeight: 24,
    },
    emptyButton: {
      backgroundColor: "#007AFF",
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 12,
      shadowColor: "#007AFF",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    emptyButtonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
  });

  useEffect(() => {
    // Load history from storage (for demo, we'll use mock data)
    const mockHistory: BMIRecord[] = [
      {
        id: "1",
        date: "2024-01-15",
        bmi: 22.5,
        category: "Normal weight",
        height: 175,
        weight: 70,
        age: 30,
        gender: "male",
        unit: "metric",
      },
      {
        id: "2",
        date: "2024-02-20",
        bmi: 24.1,
        category: "Normal weight",
        height: 175,
        weight: 75,
        age: 30,
        gender: "male",
        unit: "metric",
      },
      {
        id: "3",
        date: "2024-03-10",
        bmi: 23.8,
        category: "Normal weight",
        height: 175,
        weight: 73,
        age: 30,
        gender: "male",
        unit: "metric",
      },
    ];
    setHistory(mockHistory);
  }, []);

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

  const clearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all BMI history?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear", style: "destructive", onPress: () => setHistory([]) },
      ],
    );
  };

  const renderBMIItem = ({ item }: { item: BMIRecord }) => (
    <View style={styles.historyItem}>
      <View style={styles.itemHeader}>
        <ThemedText style={styles.date}>{item.date}</ThemedText>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: getCategoryColor(item.category) },
          ]}
        >
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
      </View>

      <View style={styles.bmiDisplay}>
        <Text
          style={[styles.bmiValue, { color: getCategoryColor(item.category) }]}
        >
          {item.bmi}
        </Text>
        <ThemedText style={styles.bmiLabel}>BMI</ThemedText>
      </View>

      <View style={styles.details}>
        <ThemedText style={styles.detailText}>
          Height: {item.height} {item.unit === "metric" ? "cm" : "in"}
        </ThemedText>
        <ThemedText style={styles.detailText}>
          Weight: {item.weight} {item.unit === "metric" ? "kg" : "lbs"}
        </ThemedText>
        <ThemedText style={styles.detailText}>
          Age: {item.age} | Gender:{" "}
          {item.gender.charAt(0).toUpperCase() + item.gender.slice(1)}
        </ThemedText>
      </View>
    </View>
  );

  const getAverageBMI = () => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, record) => acc + record.bmi, 0);
    return (sum / history.length).toFixed(1);
  };

  const getTrend = () => {
    if (history.length < 2) return "stable";
    const recent = history.slice(-2);
    if (recent[1].bmi > recent[0].bmi) return "up";
    if (recent[1].bmi < recent[0].bmi) return "down";
    return "stable";
  };

  const getTrendIcon = () => {
    const trend = getTrend();
    switch (trend) {
      case "up":
        return "↗️";
      case "down":
        return "↘️";
      default:
        return "→";
    }
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
              <Text style={styles.iconText}>📊</Text>
            </View>
            <ThemedText type="title" style={styles.title}>
              BMI History
            </ThemedText>
          </View>
          <ThemedText style={styles.subtitle}>
            Track Your Health Journey Over Time
          </ThemedText>
          <View style={styles.headerLine} />
        </View>

        {history.length > 0 && (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📈</Text>
              <ThemedText style={styles.statLabel}>Average BMI</ThemedText>
              <Text style={styles.statValue}>{getAverageBMI()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📉</Text>
              <ThemedText style={styles.statLabel}>Trend</ThemedText>
              <Text style={styles.trendValue}>
                {getTrendIcon()} {getTrend()}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📋</Text>
              <ThemedText style={styles.statLabel}>Total Records</ThemedText>
              <Text style={styles.statValue}>{history.length}</Text>
            </View>
          </View>
        )}

        {history.length > 0 ? (
          <>
            <View style={styles.historyHeader}>
              <ThemedText style={styles.historyTitle}>
                Measurement History
              </ThemedText>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearHistory}
              >
                <Text style={styles.clearButtonText}>🗑️ Clear All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={history}
              renderItem={renderBMIItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📝</Text>
            </View>
            <ThemedText style={styles.emptyText}>No BMI History Yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Start calculating your BMI to track your health progress over time
            </ThemedText>
            <TouchableOpacity style={styles.emptyButton} onPress={() => {}}>
              <Text style={styles.emptyButtonText}>Calculate First BMI</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}
