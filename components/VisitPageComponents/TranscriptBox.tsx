import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import PatientCard from './PatientCard';

const PatientBox = ({ timeDataBlock,time, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.timeArea}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.cardsContainer}>
        {timeDataBlock.map((item, index) => (
          <View key={index} style={styles.cardWrapper}>
            <PatientCard/>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '95%',
    
    alignContent: 'space-evenly',
    
  },
  timeArea: {
    marginLeft: '4%',
    top: 6,
  },
  timeText: {
    fontSize: 15,
    color: '#97979b',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  cardWrapper: {
    width: '50%', // Makes each card take 50% of the row width
    padding: 5, // Optional: Adds spacing between cards
  },
});

export default PatientBox;
