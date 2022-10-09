import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { useIsFocused } from "@react-navigation/native";
import { Alert, Modal } from "react-native";
import {
  Feather,
  EvilIcons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function Acceuil({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [pressedcam, setPressedcam] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState(null);
  const isFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false);
  const [adresseIP, setAdresseIP] = useState("192.168.185.102");
  const [port, setPort] = useState("6789");
  const [height, setHeight] = useState("250");
  const [width, setWidth] = useState("250");
  const [dureecomp, setDureecomp] = useState(0);

  useEffect(() => {
    const cameraStatus = Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === "granted");
    getModalInfo();
  }, []);

  const predict = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      var t0 = performance.now();
      const compressedData = await ImageManipulator.manipulateAsync(
        data.uri,
        [{ resize: { width: 250, height: 250 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );

      var t1 = performance.now();
      setDureecomp(((t1 - t0) * 10e-3).toFixed(3));

      const base64 = await FileSystem.readAsStringAsync(data.uri, {
        encoding: "base64",
      });
      const base64Compressed = await FileSystem.readAsStringAsync(
        compressedData.uri,
        {
          encoding: "base64",
        }
      );
      navigation.navigate("Predict", {
        width: data.width,
        height: data.height,
        dureecomp: dureecomp,
        widthsendback: width,
        heightsendback: height,
        format: data.uri.split(".").pop(),
        server: { adress: adresseIP, port: port },
        image: "data:image/jpeg;base64," + base64,
        compressedImage: "data:image/jpeg;base64," + base64Compressed,
      });
    }
  };

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    t0 = performance.now();
    const compressedData = await ImageManipulator.manipulateAsync(
      pickerResult.uri,
      [{ resize: { width: 250, height: 250 } }],
      { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
    );
    t1 = performance.now();
    setDureecomp(((t1 - t0) * 10e-3).toFixed(3));
    const base64 = await FileSystem.readAsStringAsync(pickerResult.uri, {
      encoding: "base64",
    });
    const base64Compressed = await FileSystem.readAsStringAsync(
      compressedData.uri,
      {
        encoding: "base64",
      }
    );
    navigation.navigate("Predict", {
      width: pickerResult.width,
      dureecomp: dureecomp,
      height: pickerResult.height,
      widthsendback: width,
      heightsendback: height,
      format: pickerResult.uri.split(".").pop(),
      server: { adress: adresseIP, port: port },
      image: "data:image/jpeg;base64," + base64,
      compressedImage: "data:image/jpeg;base64," + base64Compressed,
    });
  };
  // AsyncStorage

  const saveModalInfo = async (madalinfo) => {
    try {
      const jsonValue = JSON.stringify(madalinfo);
      await AsyncStorage.setItem("@madalinfo", jsonValue);
    } catch (err) {
      console.log(err);
    }
  };
  const getModalInfo = async () => {
    try {
      await AsyncStorage.getItem("@madalinfo", (errs, result) => {
        if (!errs) {
          if (result !== null) {
            info = JSON.parse(result);
            setHeight(info.height);
            setWidth(info.width);
            setAdresseIP(info.adresseIP);
            setPort(info.port);
          }
        }
      });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 27,
          width: "100%",
          marginTop: 15,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.instructions}>o4iz-API</Text>
      </View>
      <View style={{ justifyContent: "center" }}>
        <View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              margin: 10,
            }}
          >
            {pressedcam
              ? isFocused && (
                  <Camera
                    ref={(ref) => setCamera(ref)}
                    style={{ width: 270, height: 270, borderRadius: 40 }}
                    type={type}
                    ratio={"4:4"}
                  />
                )
              : null}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {!pressedcam ? (
              <View
                style={{
                  height: 130,
                  width: 130,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "white",
                  backgroundColor: "#6779ce",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setPressedcam(true);
                  }}
                  style={styles.button}
                >
                  <View
                    style={{
                      justifyContent: "space-around",
                      flex: 1,
                      padding: 2,
                    }}
                  >
                    <EvilIcons
                      name="camera"
                      size={50}
                      color={"white"}
                    ></EvilIcons>
                    <Text style={{ color: "white", paddingLeft: 10 }}>
                      Appuyer pour prendre une photo
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
            {pressedcam ? (
              <View
                style={{
                  height: 130,
                  width: 130,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: "white",
                  backgroundColor: "#6779ce",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    predict();
                  }}
                  style={styles.button}
                >
                  <View
                    style={{
                      justifyContent: "space-around",
                      flex: 1,
                      padding: 2,
                    }}
                  >
                    <EvilIcons
                      name="camera"
                      size={50}
                      color={"white"}
                    ></EvilIcons>
                    <Text style={{ color: "white", paddingLeft: 10 }}>
                      Appuyer pour prendre une photo
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
            <View
              style={{
                height: 130,
                width: 130,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#6779ce",
                backgroundColor: "white",
                marginLeft: 40,
              }}
            >
              <TouchableOpacity
                onPress={openImagePickerAsync}
                style={styles.button}
              >
                <View
                  style={{
                    justifyContent: "space-around",
                    flex: 1,
                    padding: 10,
                  }}
                >
                  <EvilIcons
                    name="image"
                    size={50}
                    color={"#6779ce"}
                  ></EvilIcons>
                  <Text style={{ color: "#6779ce", paddingLeft: 10 }}>
                    Selectionner une photo{" "}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
            height: "10%",
          }}
        >
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    flexDirection: "row",
                  }}
                >
                  <TouchableOpacity
                    style={{ width: 40, height: 40 }}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      saveModalInfo({
                        height: height,
                        width: width,
                        port: port,
                        adresseIP: adresseIP,
                      });
                    }}
                  >
                    <MaterialIcons
                      name="cancel"
                      size={40}
                      color="#e60000"
                    ></MaterialIcons>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    alignContent: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      color: "#6779ce",
                      fontSize: 15,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      marginTop: 20,
                    }}
                  >
                    Image ( Hauteur x Largeur ) :
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: 10,
                    }}
                  >
                    <TextInput
                      value={height}
                      onChangeText={setHeight}
                      style={styles.textinput}
                    ></TextInput>
                    <FontAwesome
                      name="times"
                      size={25}
                      color={"#6779ce"}
                    ></FontAwesome>
                    <TextInput
                      value={width}
                      onChangeText={setWidth}
                      style={styles.textinput}
                    ></TextInput>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "space-between",
                    marginTop: 20,
                    width: "100%",
                  }}
                >
                  <Text
                    style={{
                      color: "#6779ce",
                      fontSize: 15,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      marginTop: 10,
                    }}
                  >
                    Adresse IP :
                  </Text>
                  <TextInput
                    value={adresseIP}
                    onChangeText={setAdresseIP}
                    style={styles.textmodal}
                  ></TextInput>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    marginVertical: 20,
                  }}
                >
                  <Text
                    style={{
                      color: "#6779ce",
                      fontSize: 15,
                      fontWeight: "bold",
                      fontFamily: "sans-serif",
                      marginTop: 10,
                    }}
                  >
                    Port:
                  </Text>
                  <TextInput
                    value={port}
                    onChangeText={setPort}
                    style={styles.textmodal}
                  ></TextInput>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
          }}
          style={styles.server}
        >
          <Feather name="server" size={30} color={"#edf2f4"}></Feather>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eceef9",
    justifyContent: "space-around",
    alignContent: "center",
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  logo: {
    width: 102,
    height: 37,
    marginBottom: 20,
  },
  instructions: {
    color: "#6779ce",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  button: {
    height: 130,
    width: 130,
    borderRadius: 20,
  },
  buttonok: {
    backgroundColor: "#6779ce",
    margin: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 15,
    color: "#edf2f4",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    justifyContent: "space-between",
    alignContent: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    margin:10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  body: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },

  textinput: {
    height: 40,
    width: 100,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#6779ce",
    borderRadius: 20,
    padding: 10,
  },
  textmodal: {
    height: 40,
    width: 150,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#6779ce",
    borderRadius: 15,
    padding: 10,
  },
  server: {
    height: 60,
    width: 60,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6779ce",
    shadowColor: "#081111",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    borderRadius: 50,
  },
});
