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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SearchBar } from "react-native-elements";
import { TextInput, Searchbar } from "react-native-paper";
import { auth } from "../firebase/config";
import { getUserUId, getUserById } from "../firebase/user";
import { getProducts } from "../firebase/products";
import ProductCard from "../Components/productCard";
import { logout } from "../firebase/auth";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const d = Dimensions.get("window");
export default function ProfileScreen({ navigation }) {
  const [fullname, setfullname] = useState("");
  const [image, setimage] = useState(null);
  const [role, setRole] = useState("");
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getProductHandle = async () => {
    const arr = await getProducts();
    setProducts(arr);
  };

  useEffect(() => {
    getProductHandle();
  }, []);
  const ss = () => {
    logout(auth).then(() => {
      console.log("sign out done");
      navigation.navigate("SignIn");
    });
  };
  useEffect(() => {
    getUserUId().then((id) => {
      getUserById(id).then((user) => {
        setfullname(user[0].fullname);
        setimage(user[0].image);
        setRole(user[0].Role);
      });
    });
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "grey", height: "100%" }}>
      <ScrollView
        style={{
          padding: 10,
          marginTop: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 10,
              overflow: "hidden",
              width: 10 * 4,
              height: 10 * 4,
            }}
          >
            <BlurView
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="menu" size={10 * 2.5} color={"#52555A"} />
            </BlurView>
          </TouchableOpacity>
          <View
            style={{
              width: 10 * 4,
              height: 10 * 4,
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <BlurView
              style={{
                height: "100%",
                padding: 10 / 2,
              }}
            >
              <Image
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: 10,
                }}
                source={{ uri: image }}
              />
            </BlurView>
          </View>
        </View>
        <View style={{ width: "80%", marginVertical: 10 * 3 }}>
          <Text
            style={{
              color: "white",
              fontSize: 10 * 3.5,
              fontWeight: "600",
            }}
          >
            Find the best coffee for you
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "##fff" }}>
          <Searchbar placeholder="Search" value={searchTerm} />
        </View>
        {/* 
      <Categories onChange={(id) => setActiveCategoryId(id)} /> */}

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginTop: 15,
          }}
        >
          <FlatList
            data={products}
            numColumns={2}
            showsHorizontalScrollIndicator={true}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
