import { StyleSheet, Text, View } from 'react-native';
import TempText from './TempText'
export default function TempSection({ weatherData, textColor, isDark }) {
    return (
        <View style={styles.Temp}>
            <TempText weatherData={weatherData} textColor={textColor} isDark={isDark} />
        </View>
    );
}

const styles = StyleSheet.create({
    Temp: {
        position: 'relative',
        
        // borderWidth: 2,           // Thickness
        // borderColor: 'green',      // Color
        // borderRadius: 8,          // Rounded corners
        // borderStyle: 'solid',     // type
        marginHorizontal : 10,
        // marginVertical : 30,

        display :'flex',
        flexDirection :'row',
        justifyContent : 'center'
        // height: 300,
    }
});