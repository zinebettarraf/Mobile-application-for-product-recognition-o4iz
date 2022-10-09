import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { View } from "react-native";
import { Acceuil } from "./pages/Acceuil";
import { Predict } from "./pages/Predict";



export const loadData = (server , url, method, param, finalFunction) => {
  let Url = url;
  let reponse = {};
  let port = server.port
  let adress = server.adress

  fetch("http://"+adress +":"+port+ Url, {
    method: method,
    Accept: "application/json",
    "Content-Type": "application/json",
    body: (method == "POST") || (method == "PUT") || (method == "DELETE") ? JSON.stringify(param) : null,
  })
    .then((response) => response.json())
    .then((data) => {
      reponse = data;
    })
    .catch((error) => {
      throw error
    })
    .finally(() => {
      if (finalFunction) finalFunction(reponse);
    });


};

const theme = {
  ...DefaultTheme,
  roundness: 5,
  colors: {
    ...DefaultTheme.colors,
    primary: "#3498db",
    accent: "#f1c40f",
  },
};


const App = () => {
 
  const Stack = createNativeStackNavigator();
  return (
      <PaperProvider theme={theme}>
          <View style={{ width: "100%", flex: 1 }}> 
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="Acceuil" component={Acceuil} />
                <Stack.Screen name="Predict" component={Predict} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
      </PaperProvider>
  );
};

export default App;