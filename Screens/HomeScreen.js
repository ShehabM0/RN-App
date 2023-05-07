import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
} from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";
import { SearchBar } from "react-native-elements";
import { TextInput, Searchbar } from "react-native-paper";
import { auth,db } from "../firebase/config";
import { getUserUId, getUserById } from "../firebase/user";
import { getProducts } from "../firebase/products";
import ProductCard from "../Components/productCard";
import { logout } from "../firebase/auth";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { AppLoading } from "expo";
const { width } = Dimensions.get("window");
const d = Dimensions.get("window");
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

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#E4EDFA",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: isIOS ? 0 : StatusBar.currentHeight,
      }}
    >
      <View
        style={{
          width: 400,
          height: 280,
          backgroundColor: "#FFFFFF",
          elevation: 75,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 5.25,
          shadowRadius: 3.84,
        }}
      >
        <ImageBackground
          style={{ flex: 1 }}
          source={require("../assets/Rectangle.png")}
        >
          <Text
            style={{
              position: "absolute",
              color: "#DDDDDD",
              left: 20,
              fontSize: 25,
             
              top: 60,
              fontFamily: "Sora-SemiBold",
            }}
          >
            Hello, {firstname}
          </Text>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileTab")}
              style={{
                borderRadius: 10,
                overflow: "hidden",
                width: 10 * 4,
                height: 10 * 4,
                paddingBottom: 12,
              }}
            ></TouchableOpacity>
            <View
              style={{
                width: 10 * 4,
                height: 10 * 4,
                overflow: "hidden",
                borderRadius: 10,
                top: 50,
                right: 10,
                marginRight:15
              }}
            >
              <BlurView
                style={{
                  height: "100%",
                  padding: 10 / 2,
                
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("ProfileTab")}
                >
                  <Image
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: 10,
                    
                    }}
                    source={{ uri: image }}
                  />
                </TouchableOpacity>
              </BlurView>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Searchbar
              placeholder="Search Coffee"
              placeholderTextColor="#989898"
              iconColor="white"
              value={searchTerm}
              onChangeText={(query) => setSearchTerm(query)}
              onIconPress={getProductHandle}
              style={{
                width: "90%",
                backgroundColor: "#313131",
                borderRadius: 20,
              }}
            />
          </View>

        </ImageBackground>
      </View>
      <View style={{
  position: "absolute",
  width: 315,
  height: 140,
  left: 45,
  top: 204,
  backgroundColor: "#EAE7E7",
  borderRadius: 16,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 4,

}}>
  <Image  style={{width: 315,
  height: 140,borderRadius: 16,}} source={require("../assets/beansBackground1.png")} ></Image>
</View>

      <FlatList
        style={{ padding: 10,marginTop:5}}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={{ width: "80%", marginVertical: 10 * 3 , }}></View>
          </>
        }
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