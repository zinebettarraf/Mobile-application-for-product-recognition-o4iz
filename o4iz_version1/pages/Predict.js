import React from "react";
import { Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { loadData } from "../App";

export function Predict({ route }) {

  let uri = route.params.image;
  let compressedUri = route.params.compressedImage;

  const [typeObjet, setTypeObjet] = useState("");
  const [duree, setDuree] = useState("");
  const [displayinfo, setDisplayinfo] = useState(false);
  const [dureereq, setDureereq] = useState(0);
  useEffect(() => {
    var t0 = performance.now();
    loadData(
      route.params.server,
      "/api/modelscalable/predict/1",
      "POST",
      {
        idimg: compressedUri,
        details: "O",
      },
      (res) => {
        var t1 = performance.now();
        setDuree(res.transform_time.duration.toFixed(3));
        setTypeObjet(res.prediction);
        setDureereq(((t1 - t0) * 10e-4).toFixed(3));
        setDisplayinfo(true);
      }
    );
  }, []);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection:"row",paddingHorizontal:27 ,width:"100%",justifyContent:"space-between",marginTop:50,alignItems:"center"}}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.instructions}>o4iz-API</Text>
      </View>
      <View style={styles.body}>
        <View style={{justifyContent:"space-around",alignItems:"center"}}>
          <Image
            source={{ uri: uri }}
            style={{ width: 300, height: 300, borderRadius: 10 }}
          />
          <View style={{ marginTop: 5 }}>
            <Text style={{ color: "#737373", textAlign: "center" }}>
              {"Image originale   Résolution : " +
                route.params.width +
                "x" +
                route.params.height +
                "     " +
                "Format : " +
                route.params.format}
            </Text>
            <Text style={{ color: "#737373", textAlign: "center" }}>
              {"Image   prédite   Résolution : " +
               route.params.widthsendback +
                "x" +
                route.params.heightsendback+
                "     " +
                "Format : " +
                "jpg"}
            </Text>
          </View>
        </View>
        {displayinfo ? null : (
          <View style={{ margin: 20 }}>
            <ActivityIndicator size="large" color="#6779ce" />
          </View>
        )}
        {displayinfo ? (
          <View style={{ marginTop: 40 }}>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text style={styles.texttitle}> L'article détecté : </Text>
              <Text style={styles.textimg}>{typeObjet + " "}</Text>
            </View>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text style={styles.texttitle}> La durée de prédiction : </Text>
              <Text style={styles.textimg}>{duree + " s "}</Text>
            </View>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text style={styles.texttitle}> La durée de compression : </Text>
              <Text style={styles.textimg}>{route.params.dureecomp + " s "}</Text>
            </View>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text style={styles.texttitle}> La durée de la requête : </Text>
              <Text style={styles.textimg}>{dureereq + " s "}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#eceef9"
  },
  body: {
    flex: 1,
    alignItems: "center",
    marginTop:60,
  },
  logo: {
    width: 102,
    height: 37,
  },
  instructions: {
    color: "#6779ce",
    fontSize: 20,
    fontWeight: "bold",
  },
  textimg: {
    color: "#887d72",
    textAlign: "center",
    margin: 2,
    fontSize: 20,
    fontFamily: "sans-serif",
  },
  texttitle: {
    color: "#6779ce",
    textAlign: "center",
    margin: 5,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "sans-serif",
  },
});
