import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    page:{
      padding: 10,
    },
    wishlist:{
      marginLeft: 18,
      marginTop: 12,
      alignSelf:'flex-start',
      justifyContent: 'space-between'
    },
    root: {
      flexDirection:'row',
      margin: 10,
      marginBottom: 15,
      borderWidth: 1,
      borderColor:'#d1d1d1',
      borderRadius:10,
      backgroundColor: '#fff',
      height: 500,
      flexDirection : 'column',
      justifyContent: 'center',
      alignItems: 'center',

    },
    rightContainer:{
      padding: 2,
      flex:3,
      flexDirection:'column'
     
    },
    image : {
        flex:4,
        width:150,
        height: 250,
        resizeMode:'contain',
    },
    title:{
      color: '#434343',
      fontSize: 20,
      fontWeight: 'bold',
      letterSpacing: 0,

    },
    price:{
      fontSize: 18,
      // fontWeight: 'bold'
    },
    oldPrice:{
      fontSize:14,
      fontWeight: 'normal',
      textDecorationLine: 'line-through',
    
    },
    ratingContainer:{
      flexDirection:'row',
      alignItems:'center',
      marginVertical: 8
    },
    star:{
      margin:2,
    },

    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonOpen: {
      backgroundColor: '#759d75',
    },
    buttonClose: {
      backgroundColor:  '#759d75',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
    

    modalView: {
      
      margin: 20,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },

    modalInputView :{
      margin: 5,
      padding: 5,
      backgroundColor: 'white',
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#759d75',
      flexDirection: 'row',
      alignItems: 'center',
    }


})

export default styles;