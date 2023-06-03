import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                <Stack.Screen name='Login' component={Login} options={{ headerShown: false, gestureEnabled: false }} />
                <Stack.Screen name='Home' component={Home} options={{ gestureEnabled: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
