import { StyleSheet, Text, View } from 'react-native';
import Humidity from './Humidity';
import Wind from './Wind';

export default function Info({ weatherData, textColor, isDark }) {
    return (
        <View style={styles.cont}>
            <Humidity weatherData={weatherData} textColor={textColor} isDark={isDark} />
            <Wind weatherData={weatherData} textColor={textColor} isDark={isDark} />
        </View>
    );
}

const styles = StyleSheet.create({ 
    cont : {
        display : 'flex',
        flexDirection : 'row',
        gap : 40 ,
    }

})