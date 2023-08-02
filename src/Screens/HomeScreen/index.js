import { StyleSheet, Image, View, Text, FlatList} from 'react-native'
import React, {useState, useEffect} from 'react';
import ProductItem from '../../Component/ProductItem';
// import products from '../../data/products';
import {API, graphqlOperation} from 'aws-amplify';
import {listProducts} from '../../graphql/queries';
 

const HomeScreen = ({searchValue}) => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetchProducts();
    
  }, []);

  async function fetchProducts() {
    try {
      const productData = await API.graphql(graphqlOperation(listProducts));
      const res = productData.data.listProducts.items;
      setProducts(res);
    } catch (err) {
      console.log('error fetching Products');
    }
  }


  return (
    <View style={styles.page}>
      {/* Render Product Componet */}
      <FlatList
        data={products}
        keyExtractor={(prod) => prod.id}
        renderItem={({item}) => <ProductItem item={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

}


const styles = StyleSheet.create({
  page: {
    padding: 10,
  },
});

export default HomeScreen;

