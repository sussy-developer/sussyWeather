import { StyleSheet, Text, View, Image } from 'react-native';

export default function Aqi({ weatherData,aqi, textColor, isDark }) {
    let Aqi = aqi?.current?.us_aqi;
    const isDarkBg = isDark ?? (weatherData?.current?.is_day === 0 || [95, 96, 99].includes(weatherData?.current?.weather_code));
    const activeColor = textColor || (isDarkBg ? '#ffffff' : '#070707');
    
    return (
        <View style={styles.contt}>
            <View style={styles.cont}>
                <Image 
                source={require("../../../assets/aqi.png")}
                style={[styles.img, isDarkBg && { tintColor: '#ffffff' }]}/>
            </View>
            
            {/* text */}
            <Text style={[styles.text, { color: activeColor }]}>{Aqi != undefined ?`${(Aqi)}` : '--'}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    contt: {
        display: 'flex',
        alignItems: 'center',
    },
img : {

    width : 40,
    height :40
},

    cont: {
         display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,           // Thickness
        borderColor: '#a8a6a685',      // Color
        borderRadius: 800,
        height: 70,          // Rounded corners
        borderStyle: 'solid',
        width: 70,
        // padding :10,
        gap: 50,
        // marginHorizontal : 90,
    },

    text : {
        fontSize : 15,
        fontWeight : 'bold',
        marginVertical : 5
    }
});