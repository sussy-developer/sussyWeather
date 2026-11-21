import { StyleSheet, Text, View } from 'react-native';
import Humidity from './Humidity';
import Wind from './Wind';
import Aqi from './Aqi';

export default function Info({ weatherData,aqi, textColor, isDark }) {
    return (
        <View style={styles.cont}>
            <Humidity weatherData={weatherData} textColor={textColor} isDark={isDark} />
            <Wind weatherData={weatherData} textColor={textColor} isDark={isDark} />
            <Aqi aqi={aqi} textColor={textColor} isDark={isDark}/>
        </View>
    );
}

const styles = StyleSheet.create({ 
    cont : {
        display : 'flex',
        flexDirection : 'row',
        gap : 40 ,
        position: 'relative',
        top :-40,
    //         borderWidth: 2,           // Thickness
    // borderColor: 'red',      // Color
    // borderRadius: 8,          // Rounded corners
    // borderStyle: 'solid',
    }

})