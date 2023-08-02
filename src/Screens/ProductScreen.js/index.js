import {  Text, ScrollView, ActivityIndicator  } from 'react-native'
import React,{useState, useEffect} from 'react'
import {Picker} from '@react-native-picker/picker';
import {useRoute, useNavigation} from '@react-navigation/native';
import QuantitySelector from '../../Component/QuantitySelector';
// import product from '../../data/product';
import styles from './styles';
import Button from '../../Component/Button/index'
import ImageCarousel from '../../Component/ImageCarousel/index';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import {createCartProduct} from '../../graphql/mutations';
import {CartProduct} from '../../models';
import {getProduct} from '../../graphql/queries';

 


const ProductScreen = () => {

    const [selectedOption, setSelectedOption] = useState("");
    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const navigation = useNavigation();
    const route = useRoute();
  


    useEffect(() => {
      if (!route.params?.id) {
        return;
      }

      fetchProduct(route.params?.id)
    }, [route.params?.id]);
  

    async function fetchProduct(id) {
      try {
        const productData = await API.graphql(graphqlOperation(getProduct, {id: id}));
        const res = productData.data.getProduct;
        setProduct(res)

      } catch (err) {
        console.log('error fetching Products');
      }
    }


    useEffect(() => {
      if (product?.options) {
        setSelectedOption(product.options[0]);
      }
    }, [product]);

    if (!product) {
      return <ActivityIndicator />;
    }


    const onAddToCart = async () => {
      const userData = await Auth.currentAuthenticatedUser();


      if (!product || !userData) {
        return;
      }
  

      try {

        await API.graphql(graphqlOperation(createCartProduct, {input: {
          userSub: userData.attributes.sub,
          quantity,
          option: selectedOption,
          productID: product.id,
        }}));
        navigation.navigate('shoppingCart');
      } catch (err) {
        console.warn('Error Adding to Cart')
        console.log('error Adding to Cart:', err);
      }
  

    };
  


    return (
        <ScrollView style={styles.root}>
          <Text style={styles.title}>{product.title}</Text>
    
          {/* Image carousel */}
          <ImageCarousel images={product.images} />
    
          {/* Option selector */}
          <Picker
            selectedValue={selectedOption}
            onValueChange={itemValue => setSelectedOption(itemValue)}>
            {product.options.map(option => (
              <Picker.Item label={option} value={option} />
            ))}
          </Picker>
    
          {/* Price */}
          <Text style={styles.price}>
            from ${product.price.toFixed(2)}
            {product.oldPrice && (
              <Text style={styles.oldPrice}> ${product.oldPrice.toFixed(2)}</Text>
            )}
          </Text>
    
          {/* Description */}
          <Text style={styles.description}>{product.description}</Text>
    
          {/* Qunatiti selector */}
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
    
          {/* Button */}
          <Button
            text={'Add To Cart'}
            onPress={onAddToCart}
            containerStyles={{backgroundColor: '#698d69', borderColor: '#698d69'}}
            textStyle={{color:'#FFFFFF'}}
          />

          <Button
            text="Buy Now"
            onPress={() => {
              console.warn('Buy now');
            }}
            containerStyles={{backgroundColor: '#3b4f3b', borderColor: '#3b4f3b'}}
            textStyle={{color:'#FFFFFF'}}

          />
        </ScrollView>
      );
}

export default ProductScreen;

