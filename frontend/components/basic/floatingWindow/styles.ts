import { StyleSheet } from 'react-native';

export default function useStyles() {
  return StyleSheet.create({
    safeArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9997,
    },
    container: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 9999,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    snapIndicator: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderRadius: 10,
      zIndex: 9998,
      opacity: 0.7,
      borderWidth: 2,
      borderColor: '#000',
    },
  });
} 