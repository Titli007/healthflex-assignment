import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTimers } from '../context/TimerContext';
import TimerItem from './TimerItem';
import { CategoryGroupProps } from '../../types';

const CategoryGroup: React.FC<CategoryGroupProps> = ({ category, timers }) => {
  const [expanded, setExpanded] = useState<boolean>(true);
  const { 
    startCategoryTimers, 
    pauseCategoryTimers, 
    resetCategoryTimers 
  } = useTimers();

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleStartAll = () => {
    startCategoryTimers(category);
  };

  const handlePauseAll = () => {
    pauseCategoryTimers(category);
  };

  const handleResetAll = () => {
    resetCategoryTimers(category);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={toggleExpanded}
      >
        <View style={styles.headerLeft}>
          <Icon 
            name={expanded ? 'chevron-down' : 'chevron-forward'} 
            size={20} 
            color="#333" 
          />
          <Text style={styles.categoryTitle}>{category}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{timers.length}</Text>
          </View>
        </View>
        
        {expanded && (
          <View style={styles.bulkActions}>
            <TouchableOpacity 
              style={[styles.bulkButton, styles.startButton]} 
              onPress={handleStartAll}
            >
              <Icon name="play" size={16} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.bulkButton, styles.pauseButton]} 
              onPress={handlePauseAll}
            >
              <Icon name="pause" size={16} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.bulkButton, styles.resetButton]} 
              onPress={handleResetAll}
            >
              <Icon name="refresh" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
      
      {expanded && (
        <View style={styles.timersList}>
          {timers.map(timer => (
            <TimerItem key={timer.id} timer={timer} />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  countBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  countText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  bulkActions: {
    flexDirection: "row",
  },
  bulkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  startButton: {
    backgroundColor: "#4CAF50",
  },
  pauseButton: {
    backgroundColor: "#FF9800",
  },
  resetButton: {
    backgroundColor: "#F44336",
  },
  timersList: {
    padding: 16,
  },
})

export default CategoryGroup
