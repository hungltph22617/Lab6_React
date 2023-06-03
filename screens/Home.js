import React, { useEffect, useState } from 'react';
import { SafeAreaView, Button, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import log from '../Log';
import Student from '../components/Student';

const Home = () => {
    const navigation = useNavigation();
    const [students, setStudents] = useState([]);
    const [authInfo, setAuthInfo] = useState();
    const navigateToLogin = () => {
        navigation.navigate('Login');
    };
    const retrieveData = async () => {
        try {
            const authInfo = await AsyncStorage.getItem('authInfo');
            if (authInfo !== null) {
                log.info('====> authInfo from AsyncStorage', authInfo);
                setAuthInfo(JSON.parse(authInfo));
            }
        } catch (error) {
            log.error(error);
        }
    };

    const doLogout = () => {
        AsyncStorage.removeItem('authInfo');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    };
    async function getListStudent() {
        try {
            const API_URL = 'http://192.168.0.102:3000/Staffs';
            const response = await fetch(API_URL);
            const data = await response.json();
            setStudents(data);
            log.info('====> students:', JSON.stringify(data));
        } catch (error) {
            log.error('Fetch data failed ' + error);
        }
    }
    useEffect(() => {
        retrieveData();
        getListStudent();
    }, []);
    const renderStudents = () => {
        return (
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View>
                    <Text style={styles.txtHeader}>List Student</Text>
                </View>
                <View style={styles.studentContainer}>
                    {students.map((item, index) => {
                        return <Student student={item} key={index}></Student>;
                    })}
                </View>
            </ScrollView>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            {authInfo ? <Button title='Logout' onPress={doLogout} /> : <Button title='Go to Login Screen' onPress={navigateToLogin} />}
            {authInfo?.role === 'ADMIN' ? renderStudents() : null}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollView: {
        flexGrow: 1,
        padding: 20
    },
    txtHeader: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    studentContainer: {
        flex: 1
    }
});

export default Home;
