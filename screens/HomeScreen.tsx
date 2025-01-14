import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import SideMenu from '../components/HomeScreenComponents/SideMenu';
import MainBox from '../components/HomeScreenComponents/MainBox';
import { UserContext } from '../data/loadData';
import { Auth } from 'aws-amplify';
import { API } from 'aws-amplify';
import Config from 'react-native-config';
import axios from 'axios';

import { PatchAppointmentRequest } from '../src/hooks/useFetchAppointmentData'
function HomeScreen({ navigation }) {
  const poolId = Config.VITE_REACT_APP_USER_POOL_ID;
  const apiUrl = Config.VITE_API_URL;
  const [unsortedData, setUnsortedData] = useState([]);
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [selectedSideMenu, setSelectedSideMenu] = useState(1);
  const [dataItems, setDataItems] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [categorizedAppointmentsSide, setCategorizedAppointmentsSide] = useState(null)

  const fetchData = async () => {
    const apiName = 'DataApi';
    const path = '/appointments';
    const sessionData = await Auth.currentAuthenticatedUser()
    const myInit = {
      headers: {
        Authorization: `Bearer ${sessionData.signInUserSession.accessToken.jwtToken}`
      }
    };
    console.log(sessionData.signInUserSession.accessToken.jwtToken)

    API.get(apiName, path, myInit)
      .then((response) => {
        // Add your code here
        console.log(response)
        setUnsortedData(response)
        groupAppointmentsByDate(response);
      })
      .catch((error) => {
      });
  }
  useEffect(() => {
    if (unsortedData.length > 0) {
      //groupAppointmentsByDate(); // Run when unsortedData is updated
    }
    getCurrentData();
    setReloadKey((prev) => prev + 1);
  }, [unsortedData]); // Run this useEffect when unsortedData is updated

  useEffect(() => {
    const fetchAndGroupAppointments = async () => {
      try {
        await fetchData();
      } catch (error) {
        console.error("Error fetching and grouping appointments:", error);
      }
    };

    fetchAndGroupAppointments();
    setReloadKey((prev) => prev + 1);
  }, []);



  const sideMenuWidth = useState(new Animated.Value(0))[0];
  const mainBoxOpacity = useState(new Animated.Value(1))[0];

  const setSelectedSideMenuFunction = (item) => {
    setSelectedSideMenu(item)
    getCurrentData()

  }


  const groupAppointmentsByDate = async (dataLoop) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yearToday = today.getFullYear();
    const monthToday = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dayToday = String(today.getDate()).padStart(2, '0');
    const formattedDateToday = `${yearToday}-${monthToday}-${dayToday}`;
    const categorizedAppointments = {
      today: [],
      tomorrow: [],
      future: [],
      past: [],
      inProgress: [],
      inReview:[]

    };

    dataLoop.forEach(appointment => {
      const appointmentDate = new Date(appointment.scheduledAt);
      const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
      const appointmentDateString = appointmentDate.toISOString().split('T')[0]
      if (appointment.appointmentState.appointmentStateName == "In Progress") {
        categorizedAppointments.inProgress.push(appointment);
      }
      else if (appointment.appointmentState.appointmentStateName == "In Review") {
          categorizedAppointments.inReview.push(appointment);
        
      }
      else if (appointmentDateString === today.toISOString().split('T')[0]) {
        categorizedAppointments.today.push(appointment);
      }
      else if (appointmentDateString === tomorrow.toISOString().split('T')[0]) {
        categorizedAppointments.tomorrow.push(appointment);
      }
      else if (appointmentDateOnly > tomorrow) {
        categorizedAppointments.future.push(appointment);
      }
      else if (appointmentDateOnly < today) {
        categorizedAppointments.past.push(appointment);
      }


      if (!categorizedAppointments[appointment.appointmentState.appointmentStateName]) {
        categorizedAppointments[appointment.appointmentState.appointmentStateName] = []
      }
      categorizedAppointments[appointment.appointmentState.appointmentStateName].push(appointment)
    });

    setCategorizedAppointmentsSide(categorizedAppointments);

  };


  const getCurrentData = () => {
    // Today Value
    try {
      if (selectedSideMenu == 1) {
        setDataItems(categorizedAppointmentsSide.today);

      } else if (selectedSideMenu == 2) {
        setDataItems(categorizedAppointmentsSide.tomorrow);
      } else if (selectedSideMenu == 3) {
        setDataItems(categorizedAppointmentsSide.inProgress);
      }
      else if (selectedSideMenu == 4) {
        setDataItems(categorizedAppointmentsSide.inReview);
      }
      else {
        setDataItems([])
      }
    } catch (error) {
      setDataItems([])
    }
    setReloadKey((prev) => prev+1)


  };

  useEffect(() => {
    getCurrentData();
    // Trigger animations when `isSideMenuVisible` changes
    if (isSideMenuVisible) {
      Animated.timing(sideMenuWidth, {
        toValue: 95, // 95% width for side menu
        duration: 300,
        useNativeDriver: false, // Native driver not supported for width changes
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
      <Animated.View
        style={[
          styles.sideMenuContainer,
          {
            width: sideMenuWidth.interpolate({
              inputRange: [0, 95],
              outputRange: ['0%', '95%'],
            }),
          },
        ]}
      >
        <SideMenu
          navigation={navigation}
          setSideMenuVisible={setSideMenuVisible}
          isSideMenuVisible={isSideMenuVisible}
          selectedSideMenu={selectedSideMenu}
          setSelectedSideMenu={setSelectedSideMenuFunction}
          lengthToday={categorizedAppointmentsSide?.today?.length || 0}
          lengthTomorrow={categorizedAppointmentsSide?.tomorrow?.length || 0}
          lengthInProgress={categorizedAppointmentsSide?.inProgress?.length || 0}
          lengthInReview={categorizedAppointmentsSide?.inReview?.length || 0}

        />
      </Animated.View>
      <Animated.View
        style={[
          styles.mainBoxContainer,
          { opacity: mainBoxOpacity },
        ]}
      >
        <MainBox
          navigation={navigation}
          setSideMenuVisible={setSideMenuVisible}
          jsonData={dataItems}
          patientsNumber={dataItems.length}
          key={reloadKey}
          stateItems={selectedSideMenu == 4}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: '100%',
  },
  sideMenuContainer: {
    backgroundColor: '#f8f8f8', // Optional background for visibility
  },
  mainBoxContainer: {
    flex: 1,
    backgroundColor: '#fff', // Optional background for visibility
  },
});

export default HomeScreen;
