import { BMIRecord } from "@/services/bmi-storage";
import React from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RNFS from "react-native-fs";
import * as RNHTMLtoPDF from "react-native-html-to-pdf";

interface HealthReportGeneratorProps {
  currentBMI: number;
  category: string;
  height: number;
  weight: number;
  age: number;
  gender: "male" | "female";
  unit: "metric" | "imperial";
  history: BMIRecord[];
  onReportGenerated?: (filePath: string) => void;
}

export const HealthReportGenerator: React.FC<HealthReportGeneratorProps> = ({
  currentBMI,
  category,
  height,
  weight,
  age,
  gender,
  unit,
  history,
  onReportGenerated,
}) => {
  const [isGenerating, setIsGenerating] = React.useState(false);

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
        return "#6c757d";
    }
  };

  const getHealthRecommendations = (category: string) => {
    switch (category) {
      case "Underweight":
        return [
          "Focus on nutrient-dense foods to gain weight healthily",
          "Include protein-rich foods in every meal",
          "Consider strength training to build muscle mass",
          "Eat smaller, more frequent meals throughout the day",
          "Consult a healthcare provider for personalized guidance",
        ];
      case "Normal weight":
        return [
          "Maintain your current healthy lifestyle",
          "Continue regular physical activity (150 minutes/week)",
          "Eat a balanced diet with plenty of fruits and vegetables",
          "Monitor your weight regularly",
          "Get adequate sleep (7-9 hours per night)",
        ];
      case "Overweight":
        return [
          "Aim for gradual weight loss (1-2 pounds per week)",
          "Increase physical activity to 300 minutes per week",
          "Focus on portion control and mindful eating",
          "Choose whole foods over processed options",
          "Consider consulting a registered dietitian",
        ];
      case "Obese":
        return [
          "Seek professional medical guidance for weight management",
          "Start with low-impact exercises like walking or swimming",
          "Focus on sustainable lifestyle changes rather than quick fixes",
          "Monitor blood pressure and other health markers regularly",
          "Consider working with a healthcare team for comprehensive support",
        ];
      default:
        return [];
    }
  };

  const generateHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const categoryColor = getCategoryColor(category);
    const recommendations = getHealthRecommendations(category);

    // Calculate statistics
    const averageBMI =
      history.length > 0
        ? (
            history.reduce((sum, record) => sum + record.bmi, 0) /
            history.length
          ).toFixed(1)
        : currentBMI.toFixed(1);

    const trend =
      history.length >= 2
        ? history[history.length - 1].bmi > history[history.length - 2].bmi
          ? "Increasing"
          : "Decreasing"
        : "Stable";

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>BMI Health Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
            color: #1a1a1a;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 20px;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #007AFF;
            margin-bottom: 10px;
        }
        .date {
            color: #6c757d;
            font-size: 14px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 15px;
            border-left: 4px solid #007AFF;
            padding-left: 10px;
        }
        .bmi-display {
            text-align: center;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 25px;
        }
        .bmi-value {
            font-size: 48px;
            font-weight: bold;
            color: ${categoryColor};
            margin-bottom: 10px;
        }
        .bmi-category {
            font-size: 24px;
            font-weight: 600;
            color: ${categoryColor};
            margin-bottom: 10px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 25px;
        }
        .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 3px solid #007AFF;
        }
        .info-label {
            font-size: 12px;
            color: #6c757d;
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
        }
        .recommendations {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
        }
        .recommendation-item {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }
        .recommendation-item:before {
            content: "•";
            color: #007AFF;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        .stats-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .stats-table th, .stats-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #e9ecef;
        }
        .stats-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #1a1a1a;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            text-align: center;
            color: #6c757d;
            font-size: 12px;
        }
        .disclaimer {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .disclaimer-title {
            font-weight: 600;
            color: #856404;
            margin-bottom: 10px;
        }
        .disclaimer-text {
            color: #856404;
            font-size: 14px;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="title">BMI Health Report</div>
            <div class="date">Generated on ${currentDate}</div>
        </div>

        <div class="section">
            <div class="section-title">Current BMI Analysis</div>
            <div class="bmi-display">
                <div class="bmi-value">${currentBMI.toFixed(1)}</div>
                <div class="bmi-category">${category}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Height</div>
                    <div class="info-value">${height} ${unit === "metric" ? "cm" : "in"}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Weight</div>
                    <div class="info-value">${weight} ${unit === "metric" ? "kg" : "lbs"}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Age</div>
                    <div class="info-value">${age} years</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Gender</div>
                    <div class="info-value">${gender.charAt(0).toUpperCase() + gender.slice(1)}</div>
                </div>
            </div>
        </div>

        ${
          history.length > 0
            ? `
        <div class="section">
            <div class="section-title">BMI Statistics</div>
            <table class="stats-table">
                <tr>
                    <th>Metric</th>
                    <th>Value</th>
                </tr>
                <tr>
                    <td>Average BMI</td>
                    <td>${averageBMI}</td>
                </tr>
                <tr>
                    <td>Trend</td>
                    <td>${trend}</td>
                </tr>
                <tr>
                    <td>Total Records</td>
                    <td>${history.length}</td>
                </tr>
            </table>
        </div>
        `
            : ""
        }

        <div class="section">
            <div class="section-title">Health Recommendations</div>
            <div class="recommendations">
                ${recommendations.map((rec) => `<div class="recommendation-item">${rec}</div>`).join("")}
            </div>
        </div>

        <div class="disclaimer">
            <div class="disclaimer-title">Medical Disclaimer</div>
            <div class="disclaimer-text">
                This report is generated based on BMI calculations and general health guidelines. 
                It is not a substitute for professional medical advice. Please consult with a 
                healthcare provider for personalized medical recommendations and before making 
                any changes to your diet or exercise routine.
            </div>
        </div>

        <div class="footer">
            <p>Generated by BMI Calculator App</p>
            <p>For informational purposes only</p>
        </div>
    </div>
</body>
</html>
    `;
  };

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      const html = generateHTML();

      const options = {
        html,
        fileName: `BMI_Health_Report_${new Date().toISOString().split("T")[0]}`,
        directory: RNFS.DocumentDirectoryPath,
      };

      const pdf = await RNHTMLtoPDF.convert(options);

      if (pdf.filePath) {
        onReportGenerated?.(pdf.filePath);
        Alert.alert(
          "Report Generated",
          "Your health report has been generated successfully!",
          [
            { text: "OK" },
            {
              text: "View File",
              onPress: () => {
                // In a real app, you would open the file here
                console.log("PDF file path:", pdf.filePath);
              },
            },
          ],
        );
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert(
        "Error",
        "Failed to generate health report. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Download Health Report</Text>
      <Text style={styles.subtitle}>
        Generate a comprehensive PDF report with your BMI analysis and health
        recommendations
      </Text>

      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📊</Text>
          <Text style={styles.featureTitle}>BMI Analysis</Text>
          <Text style={styles.featureDescription}>
            Current BMI and category assessment
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📈</Text>
          <Text style={styles.featureTitle}>Statistics</Text>
          <Text style={styles.featureDescription}>
            Historical data and trends
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>💡</Text>
          <Text style={styles.featureTitle}>Recommendations</Text>
          <Text style={styles.featureDescription}>
            Personalized health advice
          </Text>
        </View>

        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>📄</Text>
          <Text style={styles.featureTitle}>Professional Format</Text>
          <Text style={styles.featureDescription}>
            Clean, printable PDF document
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.generateButton,
          isGenerating && styles.generateButtonDisabled,
        ]}
        onPress={generatePDF}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <>
            <Text style={styles.generateButtonText}>
              📄 Generate PDF Report
            </Text>
            <Text style={styles.generateButtonSubtext}>
              Download your complete health analysis
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>Important Note</Text>
        <Text style={styles.disclaimerText}>
          This report is for informational purposes only and should not replace
          professional medical advice.
        </Text>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 20,
    lineHeight: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
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
  },
  generateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  generateButtonDisabled: {
    backgroundColor: "#6c757d",
  },
  generateButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  generateButtonSubtext: {
    color: "#ffffff",
    fontSize: 12,
    opacity: 0.8,
  },
  disclaimer: {
    backgroundColor: "#fff3cd",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ffeaa7",
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#856404",
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 18,
  },
});
