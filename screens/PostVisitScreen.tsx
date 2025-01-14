import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import SideMenu from '../components/SharedComponents/SideMenu';
import MainPostVisitComponentsBox from '../components/PatientSummaryComponents/MainPostVisitComponentsBox';

const PostVisitPage = ({ route }) => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const { navigation, patientItem } = route.params;

  // Animated values for width and opacity
  const sideMenuWidth = useState(new Animated.Value(0))[0];
  const mainBoxOpacity = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Trigger animations when `isSideMenuVisible` changes
    if (isSideMenuVisible) {
      Animated.timing(sideMenuWidth, {
        toValue: 95, // 95% width for side menu
        duration: 300,
        useNativeDriver: false, // Use native driver for non-layout animations
      }).start();

      Animated.timing(mainBoxOpacity, {
        toValue: 0, // Hide main box
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(sideMenuWidth, {
        toValue: 0, // 0% width for side menu
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(mainBoxOpacity, {
        toValue: 1, // Show main box
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [isSideMenuVisible, sideMenuWidth, mainBoxOpacity]);

  return (
    <View style={styles.container}>
     
        <MainPostVisitComponentsBox
          setSideMenuVisible={setSideMenuVisible}
          patientItem={patientItem}
          navigation={navigation}
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    marginTop:"20%",
  },
  sideMenuContainer: {
  },
  mainBoxContainer: {
    flex: 1,
    backgroundColor: '#fff', // Optional background for visibility
  },
});

export default PostVisitPage;
