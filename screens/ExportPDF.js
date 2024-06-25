// pdfFunctions.js

import { Platform, PermissionsAndroid, Alert } from "react-native";
import RNFS from "react-native-fs";

const requestStoragePermission = async () => {
  if (Platform.OS === "android" && Platform.Version >= 29) {
    // For Android 10 and above, WRITE_EXTERNAL_STORAGE is not required
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Storage Permission Needed",
        message:
          "This app needs the storage permission to download files to your device",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

const downloadFile = async (url, filename) => {
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    console.log("Storage permission denied");
    return;
  }

  const downloadDest = `${RNFS.DownloadDirectoryPath}/${filename}`;

  console.log(`Download destination: ${downloadDest}`);

  const fileExists = await RNFS.exists(downloadDest);
  if (fileExists) {
    Alert.alert("File Exists", `File already exists at: ${downloadDest}`);
    return;
  }

  RNFS.downloadFile({
    fromUrl: url,
    toFile: downloadDest,
  })
    .promise.then((res) => {
      console.log(`Download result: ${JSON.stringify(res)}`);
      Alert.alert("Download Success", `File downloaded to: ${downloadDest}`);
    })
    .catch((err) => {
      console.error(`Download error: ${err.message}`);
      Alert.alert("Download Error", `Error downloading file: ${err.message}`);
    });
};

export { downloadFile };
