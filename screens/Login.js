import React, { useEffect, useState } from 'react';
import { Text, Alert, Image, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import log from '../Log';

const Login = () => {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigateToHome = () => {
        navigation.navigate('Home');
    };
    async function fetchData() {
        try {
            const API_URL = 'http://192.168.0.102:3000/Admins';
            const response = await fetch(API_URL);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            log.error('Fetch data failed ' + error);
            return null;
        }
    }
    useEffect(()=>{
        fetchData();
    }, []);

    storeAuthInfo = async (value) => {
        try {
            const authInfo = JSON.stringify(value);
            await AsyncStorage.setItem('authInfo', authInfo);
        } catch (error) {
            log.info(error);
        }
    };

    const validateAuthInfo = (authInfo) => {
        if (authInfo.userName === '') {
            setUsernameError('Không được để trống user');
            return false;
        }

        if (authInfo.password === '') {
            setUsernameError('');
            setPasswordError('Không được để trống password');
            return false;
        }
        return true;
    };

    const clearError = (usernameError, passwordError) => {
        if (usernameError) setUsernameError('');
        if (passwordError) setPasswordError('');
    };
    const doLogin = () => {
        let request = { userName: username, password: password };
        log.info('authInfo: ' + JSON.stringify(request));
        if (users) {
            const validateResult = validateAuthInfo(request);
            if (validateResult === true) {
                const authInfo = users.find((user) => request.userName === user.userName);
                if (!authInfo) {
                    clearError(usernameError, passwordError);
                    Alert.alert('Lỗi', 'Không nhận đc thông tin từ user', [{ text: 'Cancel', onPress: () => log.error('Cant find user ' + request.userName) }]);
                } else {
                    if (!(authInfo.password === request.password)) {
                        clearError(usernameError, passwordError);
                        setPasswordError('Sai Password');
                        return;
                    } else {
                        clearError(usernameError, passwordError);
                        storeAuthInfo(authInfo);
                        Alert.alert('Thông tin', 'Login thành công' + request.userName, [
                            { text: 'OK', onPress: () => navigateToHome() },
                            { text: 'Cancel', onPress: () => log.info('Press Cancel') }
                        ]);
                    }
                }
            }
        }
    };

    return (
        <View style={styles.root}>
            <View style={styles.cotainer}>
                <Image source={require('../assets/logo.png')} style={styles.logo} />
            </View>
            <CustomInput placeholder='Username' value={username} setValue={setUsername} secureTextEntry={false} />
            <Text style={styles.errorTxt}>{usernameError}</Text>
            <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry={true} />
            <Text style={styles.errorTxt}>{passwordError}</Text>
            <CustomButton btnLabel={'Sign In'} onPress={doLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    root: {
        padding: 20
    },
    cotainer: {
        marginTop: 100,
        alignItems: 'center'
    },
    logo: {
        width: '50%',
        height: '50%',
        resizeMode: 'contain',
        alignItems: 'center'
    },
    errorTxt: {
        color: 'red',
        marginVertical: 5
    }
});

export default Login;
