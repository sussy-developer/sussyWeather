import { StyleSheet, Text, View,Image } from 'react-native';
export default function Place({ weatherData, placeData, textColor, isDark }) {
    const isDarkBg = isDark ?? (weatherData?.current?.is_day === 0 || [95, 96, 99].includes(weatherData?.current?.weather_code));
    const activeColor = textColor || (isDarkBg ? '#ffffff' : '#ab0c0c');
    let place = placeData?.city ;
    return (
        <View style={styles.cont}>
            <Image 
                source={require("../../../assets/location.png")}
                style={[styles.img, isDarkBg && { tintColor: '#ffffffac' }]}
            />
            <Text style={[styles.degree, { color: activeColor }]}>
                {place !== undefined ? `${place}` : '--'}
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    cont: {
        // borderWidth: 2,           // Thickness
        // borderColor: 'red',      // Color
        // borderRadius: 8,          // Rounded corners
        // borderStyle: 'solid',
        display : 'flex',
        position : 'relative',
        // top : 50,
        // padding : 10,
        flexDirection : 'row',
        // gap : 10
        top : -30,
        left :-110

    },
    degree : {
        // borderWidth: 2,           // Thickness
        // borderColor: '#9a9999',      // Color
        // borderRadius:30,          // Rounded corners
        // borderStyle: 'solid',
        fontSize :20,
        fontWeight : 'bold',
        // paddingHorizontal : 20,
        // paddingVertical : 5
        display : 'flex',
        // justifyContent : 'center',
        // alignItems : 'center',
        paddingHorizontal : 20,
        paddingVertical : 10
,    },
img : {
    width :30,
    height :30,
}
})