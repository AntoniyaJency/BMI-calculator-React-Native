import AsyncStorage from '@react-native-async-storage/async-storage';

export interface BMIRecord {
  id: string;
  date: string;
  bmi: number;
  category: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female';
  unit: 'metric' | 'imperial';
}

const BMI_HISTORY_KEY = '@bmi_calculator_history';

export class BMIStorage {
  static async saveBMIRecord(record: Omit<BMIRecord, 'id' | 'date'>): Promise<BMIRecord> {
    try {
      const id = Date.now().toString();
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      const newRecord: BMIRecord = { ...record, id, date };
      
      const existingHistory = await this.getBMIHistory();
      existingHistory.push(newRecord);
      
      // Keep only last 100 records
      const limitedHistory = existingHistory.slice(-100);
      
      await AsyncStorage.setItem(BMI_HISTORY_KEY, JSON.stringify(limitedHistory));
      return newRecord;
    } catch (error) {
      console.error('Error saving BMI record:', error);
      throw error;
    }
  }

  static async getBMIHistory(): Promise<BMIRecord[]> {
    try {
      const history = await AsyncStorage.getItem(BMI_HISTORY_KEY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting BMI history:', error);
      return [];
    }
  }

  static async deleteBMIRecord(id: string): Promise<void> {
    try {
      const history = await this.getBMIHistory();
      const filteredHistory = history.filter(record => record.id !== id);
      await AsyncStorage.setItem(BMI_HISTORY_KEY, JSON.stringify(filteredHistory));
    } catch (error) {
      console.error('Error deleting BMI record:', error);
      throw error;
    }
  }

  static async clearBMIHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(BMI_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing BMI history:', error);
      throw error;
    }
  }

  static async getBMIStats() {
    try {
      const history = await this.getBMIHistory();
      
      if (history.length === 0) {
        return {
          averageBMI: 0,
          latestBMI: 0,
          trend: 'stable' as 'up' | 'down' | 'stable',
          totalRecords: 0,
        };
      }

      const averageBMI = history.reduce((sum, record) => sum + record.bmi, 0) / history.length;
      const latestBMI = history[history.length - 1].bmi;
      
      let trend: 'up' | 'down' | 'stable' = 'stable';
      if (history.length >= 2) {
        const previousBMI = history[history.length - 2].bmi;
        if (latestBMI > previousBMI) trend = 'up';
        else if (latestBMI < previousBMI) trend = 'down';
      }

      return {
        averageBMI: Math.round(averageBMI * 10) / 10,
        latestBMI,
        trend,
        totalRecords: history.length,
      };
    } catch (error) {
      console.error('Error getting BMI stats:', error);
      return {
        averageBMI: 0,
        latestBMI: 0,
        trend: 'stable' as const,
        totalRecords: 0,
      };
    }
  }
}
