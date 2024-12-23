import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import SideMenu from '../components/SharedComponents/SideMenu';
import MainBoxPatientVisit from '../components/VisitPageComponents/MainBoxPatientVisit';

const VisitPage = ({ route }) => {
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const { patientItem, navigation } = route.params;


  return (
    <View style={styles.container}>
      <View style={[styles.sideMenuContainer, { width: isSideMenuVisible ? '95%' : "0%" }]}>
        <SideMenu setSideMenuVisible={setSideMenuVisible} isSideMenuVisible={isSideMenuVisible} />
      </View>
      <View style={[styles.mainBoxContainer, { opacity: isSideMenuVisible ? 0 : 1 }]}>
      <MainBoxPatientVisit navigation={navigation} patientItem={patientItem} setSideMenuVisible={setSideMenuVisible}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    
    marginTop:"20%"
  },
  sideMenuContainer: {
    transition: 'width 0.3s ease-in-out', // Smooth transition for width change
  },
  mainBoxContainer: {
    flex: 1,
    transition: 'width 0.3s ease-in-out', // Smooth transition for width change
  },
});

export default VisitPage;
