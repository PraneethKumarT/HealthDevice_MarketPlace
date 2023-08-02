import { Image, View, Text} from 'react-native'
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import styles from './styles'
import QuantitySelector from '../QuantitySelector';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {getCartProduct} from '../../graphql/queries';
import {updateCartProduct} from '../../graphql/mutations';




const CartProductItem = ({cartItem}) => {
 

  const  item = cartItem.product;


  const updateQuantity = async (newQuantity) => {

    try{
      const original = await API.graphql(graphqlOperation(getCartProduct, {id: cartItem.id}));

  
      const data = original.data.getCartProduct



      if(data){
        const updatedInput = {
          id: cartItem.id,
          quantity: newQuantity,
          _version: data._version
        }
  
        await await API.graphql({ 
          query: updateCartProduct, 
          variables: { input: updatedInput }
        });
      
      }
    } catch(err){
      console.log('error adding qty!:', err);
    }

      
  };

  
    return (
        <View style={styles.root}>
          <View style = {styles.row}>
            <Image style={styles.image} source={{uri : item.image}}/>
            <View style={styles.rightContainer}>
               <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
                {/*Rating*/}
                <View style = {styles.ratingsContainer}>
                  {
                    [0,0,0,0,0].map((element, index) => 
                      <FontAwesome style = {styles.star} 
                      key={`${item.id}-${index}`}
                      name= {index < Math.floor(item.avgRating) ? 'star' :  'star-o' } 
                      size={18} 
                      color="#e47911" />
                    )
                  }

                  <Text>{item.ratings}</Text>
                </View>
                <Text style={styles.price}>
                  ${item.price}
                  {
                    item.oldPrice ? 
                  <Text style={styles.oldPrice}> ${item.oldPrice}</Text>
                    : <></>
                  }
    
                </Text>
            </View>
          </View>
          <View style={styles.quantityContainer}>
        <QuantitySelector
          quantity={cartItem.quantity}
          setQuantity={updateQuantity}
        />
      </View>
        </View>
      )
}

export default CartProductItem;

