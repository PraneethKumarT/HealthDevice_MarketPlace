import {
    View,
    Text,
    TextInput,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
  } from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useStripe} from '@stripe/stripe-react-native';
import {Auth,DataStore,  API, graphqlOperation} from 'aws-amplify';
import { Picker } from '@react-native-picker/picker'
import styles from './styles'
import countryList from 'country-list';
import Button from '../../Component/Button';
import {createOrder, deleteCartProduct, createOrderProduct,createPaymentIntent} from '../../graphql/mutations';
import {listCartProducts} from '../../graphql/queries';


const countries = countryList.getData();

const AddressScreen = () => {
    const [country, setCountry] = useState(countries[0].code);
    const [fullname, setFullname] = useState('');
    const [phone, setPhone] = useState('');
  
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
  
    const [city, setCity] = useState('');
    const [clientSecret, setClientSecret] = useState(null);
    const {initPaymentSheet, presentPaymentSheet} = useStripe();
    const navigation = useNavigation();
    const route = useRoute();
    const amount = Math.floor(route.params?.totalPrice * 100 || 0);
    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //   fetchPaymentIntent();
    // }, []);


  
    useEffect(() => {
        initializePaymentSheet();
    },[]);


  
    const fetchPaymentIntent = async () => {
      try{
        const response = await API.graphql(
          graphqlOperation(createPaymentIntent, {amount}),       
        );
      // setClientSecret(response.data.createPaymentIntent.clientSecret);
      return response.data.createPaymentIntent.clientSecret;
      } catch(err){
        console.log("error from fetch Payment")
      }
      return null;
    };



    const initializePaymentSheet = async () => {
      const res = await fetchPaymentIntent();
      setClientSecret(res);
      console.log("initliaise payment  " + res)
      
      const {error} = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        payment_method_types: ["card", "ideal"],
        paymentIntentClientSecret: res,
        defaultBillingDetails: {
          name: 'Jane Doe',
        }
      });
      console.log('success');
      if (error) {
        Alert.alert(error.message);
      } else {
        setLoading(true);
      }
    };



    const openPaymentSheet = async () => {
      
      const {error} = await presentPaymentSheet();
      console.log("in openpayment sheet")
      if (error) {
        Alert.alert(`Error code: ${error.code}`, error.message);
      } else {
        saveOrder();
        Alert.alert('Success', 'Your payment is confirmed!');
      }
    };


    const saveOrder = async () => {
      // get user details
      const userData = await Auth.currentAuthenticatedUser();
      // create a new order

      const newOrder = await API.graphql(graphqlOperation(createOrder,{input: {
        userSub: userData.attributes.sub,
        fullName: fullname,
        phoneNumber: phone,
        country,
        city,
        address,
      }}))
      // fetch all cart items
      const res = await API.graphql(graphqlOperation(listCartProducts, {
        filter: { userSub : {eq : userData.attributes.sub }}
      }));

      const cartItems = res.data.listCartProducts.items
      // attach all cart items to the order
      try{
        await Promise.all(
          cartItems.map(cartItem =>
           
            API.graphql(
              graphqlOperation(createOrderProduct, { input:{
                quantity: cartItem.quantity,
                option: cartItem.option,
                productID: cartItem.productID,
                orderID: newOrder?.data.createOrder.id,
              }
              
              }),
            ),
          ),
        );
      } catch(err) {
        console.log(err)
      }
  
      // delete all cart items
      cartItems.map(cartItem => console.log(cartItem))
      cartItems.map(cartItem => console.log(cartItem.userSub))
      cartItems.map(cartItem => console.log(cartItem.quantity))
      cartItems.map(cartItem => console.log(cartItem.option))
      cartItems.map(cartItem => console.log(cartItem.productID))

      try{

        // await API.graphql(graphqlOperation(deleteCartProduct, {input: {
        //   id : '5d71a1e5-fbad-49a8-b884-a05f165c869e',
        //   userSub: 'c4087498-d081-706b-55ed-3e2d1ff11736',
        //   quantity: '19',
        //   option: 'exercitationconsect',
        //   productID: 'eamagnacupidatatdolorinc - bb63eec7-9160-4798-bfaa-0834866092e5',
        //   _version:'32',
        //   _deleted : 'true'
        // }}));

        // await Promise.all(cartItems.map(cartItem => API.graphql(graphqlOperation(deleteCartProduct, {input: {
        //   //id : cartItem.id,
        //   userSub : cartItem.userSub,
        //   quantity: cartItem.quantity,
        //   option:cartItem.option,
        //   productID:cartItem.productID
        //   }
        //  }))));

      } catch(err){
        console.log(err)
      }
      
      // redirect home
      navigation.navigate('Home');
    };



    const onCheckout = () => {
        if (addressError) {
          Alert.alert('Fix all field errors before submiting');
          return;
        }
    
        if (!fullname) {
          Alert.alert('Please fill in the fullname field');
          return;
        }
    
        if (!phone) {
          Alert.alert('Please fill in the phone number field');
          return;
        }
    
        // handle payments
        console.log("opening paymetn screen")
        openPaymentSheet();
        
      };

    const validateAddress = () => {
        if (address.length < 3) {
          setAddressError('Address is too short');
        }
      };


    return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>

          <ScrollView style={styles.root}>
            <View style={styles.row}>
              <Picker selectedValue={country} onValueChange={setCountry}>
                {countries.map(country => (
                  <Picker.Item value={country.code} label={country.name} />
                ))}
              </Picker>
            </View>
    
            {/* Full name */}
            <View style={styles.row}>
              <Text style={styles.label}>Full name (First and Last name)</Text>
              <TextInput
                style={styles.input}
                placeholder="Full name"
                value={fullname}
                onChangeText={setFullname}
              />
            </View>
    
            {/* Phone number */}
            <View style={styles.row}>
              <Text style={styles.label}>Phone number</Text>
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                value={phone}
                onChangeText={setPhone}
                keyboardType={'phone-pad'}
              />
            </View>
    
            {/* Address */}
            <View style={styles.row}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onEndEditing={validateAddress}
                onChangeText={text => {
                  setAddress(text);
                  setAddressError('');
                }}
              />
              {!!addressError && (
                <Text style={styles.errorLabel}>{addressError}</Text>
              )}
            </View>
    
            {/* City */}
            <View style={styles.row}>
              <Text style={styles.label}>City</Text>
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
            </View>
    
            <Button  disabled={!loading} text="Checkout" onPress={onCheckout} />
          </ScrollView>
        </KeyboardAvoidingView>
      );
}

export default AddressScreen;

