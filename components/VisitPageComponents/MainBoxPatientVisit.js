import React, { useContext, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Animated, Text, ScrollView } from 'react-native';
import PatientBox from '../HomeScreenCoponents/PatientBox';
import PatientInfoBox from './PatientInfoBox';
import PatientTranscript from './PatientTranscript';
import RecordingButtons from './RecordingButtons';
import TopMenu from '../HomeScreenCoponents/TopMenuBar';
import TopMenuPatient from './TopMenuPatient';
import PatientCard from './PatientCard';
import Oscilloscope from './Oscilloscope';
const MainBoxPatientVisit = ({ timeAppointment, namePatient, symptoms, navigation, setSideMenuVisible }) => {
    const scrollY = useRef(new Animated.Value(0)).current;
    const [listHeight, setListHeight] = useState(0);
    const [contentHeight, setContentHeight] = useState(1);
    const [searchValue, setSearchValue] = useState(null);
    const [isRecording, setIsRecording] = useState(false)

    const indicatorHeight = listHeight * (listHeight / contentHeight) * 1.5;


    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TopMenuPatient appointmentsNumber={20} useExpand={true} setSideMenuVisible={setSideMenuVisible} setFilterValue={setSearchValue} />
            </View>
            <View style={styles.patientBoxCard}><PatientCard /></View>
            <View style={styles.oscilloscopeBox}>
            <Oscilloscope recordingval={isRecording} />
            </View>
            <View style={styles.bodyBox}>
                <PatientTranscript />
            </View>
            <View style={styles.bottomBar}>
                <RecordingButtons appointmentsNumber={20} useExpand={false} navigation={navigation} setIsRecording={setIsRecording} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomBar: {
        position: 'absolute', // Make the bottom bar fixed
        bottom: 0, // Align it to the bottom of the screen
        width: '100%', // Stretch it across the full width of the screen
        paddingVertical: 30, // Add vertical padding for spacing
        alignItems: 'flex-end', // Center content horizontally
    },
    patientBoxCard: {
        paddingBottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bodyBox: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '55%',
    },
    listContentContainer: {
        paddingBottom: 20,
    },
    patientContent: {
        flexDirection: 'row',
        height: "100%",
        width: "100%",
    },
    flatListContent: {
        width: '100%',
        height: '100%',
    },
    oscilloscopeBox: {
        height: 70,
    },
    scrollBarContainer: {
        position: 'absolute',
        right: 6,
        top: '15%', // Adjust this value to position the scrollbar correctly
        width: 5,
        height: '80%', // Make the grey scrollbar take up 80% of the screen height
        backgroundColor: '#c3c3c3',
        borderRadius: 5,
    },
    scrollIndicator: {
        width: '100%',
        backgroundColor: '#194a81',
        borderRadius: 5,
    },
});


export default MainBoxPatientVisit;
