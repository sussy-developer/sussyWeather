import { StyleSheet, Text, View, Image } from 'react-native';

export default function Humidity({ weatherData, textColor, isDark }) {
    let humi = weatherData?.current?.relative_humidity_2m;
    const isDarkBg = isDark ?? (weatherData?.current?.is_day === 0 || [95, 96, 99].includes(weatherData?.current?.weather_code));
    const activeColor = textColor || (isDarkBg ? '#ffffff' : '#070707');

    return (
        <View style={styles.contt}>

            <View style={styles.cont}>
                <Image
                    source={require('../../../assets/humidity.png')}
                    style={[styles.img, isDarkBg && { tintColor: '#ffffff' }]}
                />
            </View>


            <Text style={[styles.text, { color: activeColor }]}>{humi !== undefined ? `${humi} %` : '--'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contt: {
        display: 'flex',
        alignItems: 'center',
    },

    img: {

        width: 40,
        height: 40
    },

    cont: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#a8a6a685',
        borderRadius: 800,
        height: 80,
        borderStyle: 'solid',
        width: 80,
        gap: 50,
    },

    text: {
        fontSize: 15,
        fontWeight: 'bold',
        marginVertical: 5,
    }
});