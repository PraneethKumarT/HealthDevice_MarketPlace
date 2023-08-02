import { StyleSheet, ActivityIndicator, View, Text, FlatList} from 'react-native'
import React, {useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import CartProductItem from '../../Component/CartProductItem';
// import cartProducts from '../../data/cart';
import Button from '../../Component/Button/index'
import {API, graphqlOperation, Auth, DataStore} from 'aws-amplify';
import {listCartProducts} from '../../graphql/queries';
import {onUpdateCartProduct, onCreateCartProduct} from '../../graphql/subscriptions';
import {Product, CartProduct} from '../../models';


const ShoppingCart = () => {

  const [cartProducts, setCartProducts] = useState([]);


  const navigation = useNavigation();

    

  const fetchCartProducts = async () => {

    const userData = await Auth.currentAuthenticatedUser();
    try {
      const CartData = await API.graphql(graphqlOperation(listCartProducts, {
        filter: { userSub : {eq : userData.attributes.sub }}
      }));
      const res = CartData.data.listCartProducts.items;
      setCartProducts(res);
    } catch (err) {
      console.log('error fetching shopping');
    }
  };

  useEffect(() => {
    fetchCartProducts();
  }, []);

  // useEffect(() => {

  //   const subscription = API.graphql(
  //     graphqlOperation(onUpdateCartProduct)
  //   ).subscribe(msg =>
  //     fetchCartProducts(),
  //   );

  //   return subscription.unsubscribe;
  // }, []);

  useEffect(() => {

    const subscription = API.graphql(
      graphqlOperation(onUpdateCartProduct)
    ).subscribe({
      next: msg =>{
        fetchCartProducts()
        console.log("msg!!")
          console.log(msg.value.data.onUpdateCartProduct) 
      } ,
      error: (error) => console.warn(error)
  });

    return subscription.unsubscribe;
  }, []);


  useEffect(() => {

    const subscription = API.graphql(
      graphqlOperation(onCreateCartProduct)
    ).subscribe({
      next: msg =>{

        fetchCartProducts()
        console.log("msg!!!!!!!!!!!!")
          console.log(msg.value.data.onCreateCartProduct)

        
      } ,
      error: (error) => console.warn(error)
  });

    return subscription.unsubscribe;
  }, []);



  // useEffect(() => {
  //   const subscriptions = cartProducts.map(cp =>
  //     API.graphql(
  //       graphqlOperation(onUpdateCartProduct)
  //     ).subscribe(msg => {
  //       console.log('msg')
  //      // if (msg.opType === 'UPDATE') {

  //         setCartProducts(curCartProducts =>
  //           curCartProducts.map(cp => {
  //             if (cp.id !== msg?.value?.data?.onUpdateCartProduct.id) {
  //               console.log('differnt id');
  //               console.log(cp)
  //               return cp;
  //             }
  //             return {
  //               ...cp,
  //               ...msg?.value?.data?.onUpdateCartProduct,
  //             };
  //           }),
  //         );

  //       //}
  //     }),
  //   );
  //   return () => {
  //     subscriptions.forEach(sub => sub.unsubscribe());
  //   };
  // }, [cartProducts]);

  


  const totalPrice = cartProducts.reduce(
    (summedPrice, product) =>
      summedPrice + (product?.product?.price || 0) * product.quantity,0,
  );

  const onCheckout = () => {
    navigation.navigate('Address', {totalPrice});
  };



  if (cartProducts.length === 0) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{padding: 10}}>
      {/* Render Product Componet */}
   
      <FlatList
        data={cartProducts}
        renderItem={({item}) => <CartProductItem cartItem={item} />}
        // renderItem={({item}) => console.log(item.product)}

        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <Text style={{fontSize: 18}}>
              Subtotal ({cartProducts.length} items):{' '}
              <Text style={{color: '#e47911', fontWeight: 'bold'}}>
                ${totalPrice.toFixed(2)}
              </Text>
            </Text>
            <Button
              text="Proceed to checkout"
              onPress={onCheckout}
              containerStyles={{
                backgroundColor: '#f7e300',
                borderColor: '#c7b702',
              }}
            />
          </View>
        )}
      />
    </View>
  );
}

export default ShoppingCart;

