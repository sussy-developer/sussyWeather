import { StyleSheet, Text, View } from 'react-native';
export default function TempText({ weatherData, textColor, isDark }) {
    let temp = weatherData?.current?.temperature_2m;
    const isDarkBg = isDark ?? (weatherData?.current?.is_day === 0 || [95, 96, 99].includes(weatherData?.current?.weather_code));
    const activeColor = textColor || (isDarkBg ? '#ffffff' : '#070707');

    return (
        <View style={styles.Texxt}>
            <Text style={[styles.degree, { color: activeColor }]}>
                 {temp !== undefined ? `${Math.round(temp)}` : '--'} 
            </Text>
        </View>
        // i do -1 because this api show the temp 1 high temp than the other app
    );
}

const styles = StyleSheet.create({
    Texxt: {
        position: 'relative',
        // top: 30,
        // width : '100%',
        // borderWidth: 2,           // Thickness
        // borderColor: 'red',      // Color
        // borderRadius: 8,          // Rounded corners
        // borderStyle: 'solid',
        display :'flex',
        // justifyContent : 'center',
        // alignItems : 'center',
        // height: 300,
        padding : 10
    },

    degree : {
        fontSize : 200,
        fontWeight : 'bold',
        color : '#070707'
    }
});