import { BMIRecord } from "@/services/bmi-storage";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface BMIProgressChartProps {
  data: BMIRecord[];
  color?: string;
}

const { width: screenWidth } = Dimensions.get("window");

export const BMIProgressChart: React.FC<BMIProgressChartProps> = ({
  data,
  color = "#007AFF",
}) => {
  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No data available</Text>
        <Text style={styles.emptySubtext}>
          Calculate your BMI to see progress over time
        </Text>
      </View>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Take last 30 records for better visualization
  const chartData = sortedData.slice(-30);

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) =>
      `${color}${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
    labelColor: (opacity = 1) =>
      `#6c757d${Math.round(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: color,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      stroke: "#e9ecef",
    },
  };

  const labels = chartData.map((record) => {
    const date = new Date(record.date);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });

  const bmiValues = chartData.map((record) => record.bmi);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>BMI Progress Over Time</Text>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#3B82F6" }]} />
          <Text style={styles.legendText}>Underweight (&lt;18.5)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#10B981" }]} />
          <Text style={styles.legendText}>Normal (18.5-24.9)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#F59E0B" }]} />
          <Text style={styles.legendText}>Overweight (25-29.9)</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.legendText}>Obese (&gt;30)</Text>
        </View>
      </View>

      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: bmiValues,
              color: () => color,
              strokeWidth: 3,
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={true}
        withVerticalLines={true}
        withHorizontalLines={true}
        segments={4}
        formatYLabel={(value) => parseFloat(value).toFixed(1)}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Current BMI</Text>
          <Text style={styles.statValue}>
            {bmiValues[bmiValues.length - 1]}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Average BMI</Text>
          <Text style={styles.statValue}>
            {(bmiValues.reduce((a, b) => a + b, 0) / bmiValues.length).toFixed(
              1,
            )}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Records</Text>
          <Text style={styles.statValue}>{chartData.length}</Text>
        </View>
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
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 120,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11,
    color: "#6c757d",
    flex: 1,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
  },
  statItem: {
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    color: "#6c757d",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  emptyContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
  },
});
