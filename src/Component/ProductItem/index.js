import { Pressable, Image, View, Text, Modal, TextInput} from 'react-native'
import React,{useState} from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Button from '../Button/index'
import styles from './styles'
import { useNavigation } from "@react-navigation/native";

import {API, graphqlOperation, Auth} from 'aws-amplify';
import {createCartProduct} from '../../graphql/mutations';

const ProductItem = ({item}) => {


  const [shareTo, setShareTo] = useState('');
  const [desciption, setDescription] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const onPress = () => {
    navigation.navigate('ProductDetails', {id: item.id});
  };


  const onAddToCart = async () => {
    const userData = await Auth.currentAuthenticatedUser();
    if (!userData) {
      return;
    }
    try {

      await API.graphql(graphqlOperation(createCartProduct, {input: {
        userSub: userData.attributes.sub,
        quantity : 1,
        option: item.option,
        productID: item.id,
      }}));
      navigation.navigate('shoppingCart');
    } catch (err) {
      console.warn('Error Adding to Cart')
      console.log('error Adding to Cart:', err);
    }


  };

 

  


    return (
      <Pressable onPress={onPress} style={styles.root}>
        <View style = {styles.wishlist}>
          <Feather onPress={() => setModalVisible(true)} style = {{marginBottom:5}} name="share-2" size={24} color="black" />
          <FontAwesome name="heart-o" size={24} color="black" />
        </View>

        {/* Modal View */}

        <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Share</Text>
            
            <View style={styles.modalInputView}>
              <TextInput
                style={{height: 70, width: 300, marginLeft: 10, borderColor:'#759d75',}}
                placeholder="Enter Email Address of your friends, saperated by commas"
                value={shareTo} onChangeText={setShareTo}
              />
            </View>


            <View style={styles.modalInputView}>
              <TextInput
                style={{height: 70, width: 300, marginLeft: 10, borderColor:'#759d75',}}
                placeholder="Enter Description you wish to share!"
                value={desciption} onChangeText={setDescription}
              />
            </View>

         

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
       
      </Modal>
    
    </View>

        {/* Modal View End */}

          <Image style={styles.image} source={{uri : item.image}}/>
            <View style={styles.rightContainer}>
               <Text style={styles.title} numberOfLines={3}>{item.title}</Text>
                {/*Rating*/}
                <View style = {styles.ratingContainer}>
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
              
                  You Pay: ${item.price.toFixed(2)}{"\n"}
                  {
                    item.oldPrice ? 
                  <Text style = {{fontSize: 16}}>Regular Price : <Text  style={styles.oldPrice}>${item.oldPrice.toFixed(2)}</Text></Text>
                    : <></>
                  }
    
                </Text>

                <Button
                    text={'Add To Cart '}
                    onPress={onAddToCart}
                    containerStyles={{backgroundColor: '#759d75', borderColor: '#759d75', Color:'#FFFFFF'}}
                    textStyle={{color:'#FFFFFF'}}
                  />
            </View>
 
        </Pressable>

      )
}

export default ProductItem;

