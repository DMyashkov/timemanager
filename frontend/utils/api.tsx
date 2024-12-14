import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getDataIndex = async () => {
  const token = await AsyncStorage.getItem("authToken");
  return axios.get("http://127.0.0.1:8000/api/tags/data_index/", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
};

export const rebuildDataIndex = async () => {
  const token = await AsyncStorage.getItem("authToken");
  return axios.post(
    "http://127.0.0.1:8000/api/tags/rebuild_index/",
    {},
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    },
  );
};
