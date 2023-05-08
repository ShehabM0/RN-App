import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  FlatList,
  ScrollView,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { doc, setDoc } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import { SearchBar } from "react-native-elements";
import { auth,db } from "../firebase/config";
import { getUserUId, getUserById } from "../firebase/user";
import { getProducts } from "../firebase/products";
import ProductCard from "../Components/productCard";
import { logout } from "../firebase/auth";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { AppLoading } from "expo";
const {width} = Dimensions.get('screen');
const cardWidth = width / 2 - 20;

export default function ProfileScreen({ navigation }) {
  const [fullname, setfullname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [image, setimage] = useState(null);
  const [role, setRole] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const [fontLoaded, setFontLoaded] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
  const isIOS = Platform.OS === "ios";

  const getProductHandle = async () => {
    const arr = await getProducts();
    if (searchTerm) {
      const filteredArr = arr.filter((product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filteredArr);
    } else {
      setFilteredProducts(arr);
    }
  };

  useEffect(() => {
    getProductHandle();
  }, [searchTerm]);

  const ss = () => {
    logout(auth).then(() => {
      console.log("sign out done");
      navigation.navigate("SignIn");
    });
  };
  useEffect(() => {
    getUserUId().then((id) => {
      getUserById(id).then((user) => {
        setFirstname(user[0].firstname);
        setimage(user[0].image);
        setRole(user[0].Role);
      });
    });
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        "Sora-SemiBold": require("../assets/Fonts/static/Sora-SemiBold.ttf"),
      });
      setFontLoaded(true);
    };

    loadFonts();
  }, []);

  if (!fontLoaded) {
    return null; // Render nothing until the font is loaded
  }
  const categories = [
    {id: '1', name: 'Coffee'},
    {id: '2', name: 'Tea'},
    {id: '3', name: 'Milk',},
    {id: '4', name: 'Soda', },
  ];
  const ListCategories = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.categoriesListContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => setSelectedCategoryIndex(index)}>
            <View
              style={{
                backgroundColor:
                  selectedCategoryIndex == index
                    ? '#F9813A'
                    : '#fedac5',
                ...style.categoryBtn,
              }}>
              <View style={style.categoryBtnImgCon}>
                {/* <Image
                  source={category.image}
                  style={{height: 35, width: 35, resizeMode: 'cover'}}
                /> */}
              </View>
              <Text
                style={{
                  fontSize: 15,
                  fontFamily:"Sora-SemiBold",
                  marginLeft: 10,
                  color:
                    selectedCategoryIndex == index
                      ? "white"
                      : '#F9813A',
                }}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor:"#ffff",}}>
      <View style={style.header}>
        <View style={{}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{fontSize: 25 ,fontFamily: "Sora-SemiBold"}}>Hello,</Text>
            <Text style={{fontSize: 25, fontFamily: "Sora-SemiBold", marginLeft: 6}}>
             {firstname}
            </Text>
          </View>
          <Text style={{marginTop: 5, fontSize: 15, color: '#908e8c',fontFamily: "Sora-SemiBold"}}>
            What do you want today
          </Text>
        </View>
       
        <TouchableOpacity
        onPress={() => console.log("fuck")}
            style={{
              borderRadius: 10,
              overflow: "hidden",
              width: 10 * 5,
              height: 10 *5,
            }}
          >
            <BlurView
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 10,
                }}
                source={{uri:image}}
              />
            </BlurView>
          </TouchableOpacity>
       
      </View>
      <View
        style={{
          marginTop: 30,
          flexDirection: 'row',
          paddingHorizontal: 20,
        }}>
        <View style={style.inputContainer}>
          <Icon name="search" size={28} />
          <TextInput
            style={{flex: 1, fontSize: 18}}
            placeholder="Search for Coffee"
            value={searchTerm}
            onChangeText={(query) => setSearchTerm(query)}
            onIconPress={getProductHandle}
          />
        </View>
       
      </View>
      <View>
        <ListCategories />
        
      </View>
      <FlatList
        style={{ padding: 10,marginTop:5}}
        showsVerticalScrollIndicator={false}
        data={filteredProducts}
        numColumns={2}
        renderItem={(itemData) => {
          return (
            <ProductCard
              productName={itemData.item.productName}
              price={itemData.item.price}
              details={itemData.item.details}
              image={itemData.item.image}
              Rate={itemData.item.Rate}
              id={itemData.item.id}
            />
          );
        }}
      />
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  header: {
    marginTop: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  inputContainer: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#E5E5E5',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  sortBtn: {
    width: 50,
    height: 50,
    marginLeft: 10,
    backgroundColor: '#F9813A',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesListContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  categoryBtn: {
    height: 45,
    width: 120,
    marginRight: 7,
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 5,
    flexDirection: 'row',
  },
  categoryBtnImgCon: {
    height: 35,
    width: 35,
    backgroundColor: "white",
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    height: 220,
    width: cardWidth,
    marginHorizontal: 10,
    marginBottom: 20,
    marginTop: 50,
    borderRadius: 15,
    elevation: 13,
    backgroundColor: "white",
  },
  addToCartBtn: {
    height: 30,
    width: 30,
    borderRadius: 20,
    backgroundColor: '#F9813A',
    justifyContent: 'center',
    alignItems: 'center',
  },
});