import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Asset } from 'expo-asset'
import {
  Chip,
  Appbar,
  List,
  Avatar,
  TextInput,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-react-native'
import { bundleResourceIO } from '@tensorflow/tfjs-react-native'

import { Dimensions } from 'react-native';
import Search from "../../../components/searchbar.component";
import { Ionicons } from "react-native-vector-icons";
import SafeArea from "../../../components/safeArea.component";
import { MsgContext } from "../../../infrastructure/context/message.context";
import { SocketContext } from "../../../infrastructure/context/socket.context";
import { useDispatch, useSelector } from "react-redux";
import * as FileSystem from 'expo-file-system'
import {
  getCurrentMsging,
  setCurrentMsging,
} from "../../../common/getSetCurrentMsging";
import { setCurrentMessaging } from "../../../common/actions";
import * as ImagePicker from "expo-image-picker";
import MessageComponent from "../../../components/message.component";
import { Platform } from "react-native";
import { POST } from "../../../adapters/http.adapter";
import { displayError } from "../../../common/toaster";
import * as jpeg from 'jpeg-js';
import * as ImageManipulator from 'expo-image-manipulator'

function Chat({ navigation }) {
  const listRef = useRef(null);
  const [msgNav, setMsgNav] = useState("inbox");
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;
  const [mdlImg, setMdlImg] = useState(null)
  const [open, setOpen] = useState(false)
  const [textMsg, setTextMsg] = useState("");
  const [images, setImages] = useState([]);
  const { messages, setMsg } = useContext(MsgContext);
  const [pred, setPred] = useState('ham')
  const currentMsging = useSelector((state) => state.currentMsging.info);
  const { socket, setSocket } = useContext(SocketContext);
  const dispatch = useDispatch();

  const selectImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    setImages([...images, result]);
  };

  const modelOpen = (image) => {
    console.log(mdlImg)
    setMdlImg(image)
    setOpen(true)
  }


  const modelInit = async () => {
    class L2 {

      static className = 'L2';

      constructor(config) {
        return tf.regularizers.l1l2(config)
      }
    }
    tf.serialization.registerClass(L2);
    const modelJSON = require('../../../assets/model.json');
    // Expo.Asset.fromModule(require("./assets/markdown/test-1.md"))
    const modelWeights = await require('../../../assets/group1_shards.bin');
    // const modelWeights =  Asset.fromModule(require('../../../assets/NEWJSON2/group1_shards.bin'))

    let model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights));

    return model;
  }


  const imageToTensor = (rawImageData) => {
    const To_UINT8Array = true;
    const { width, height, data } = jpeg.decode(rawImageData, To_UINT8Array);
    const buffer = new Uint8Array(width * height * 3);
    let offset = 0;
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1];
      buffer[i + 2] = data[offset + 2];
      offset += 4;

    }
    tf.tensor3d(buffer, [height, width, 3]).expandDims(0);
    return tf.image.resize(test_img, [224, 224])
  }

  const classify = async (image) => {
    try {
      await tf.ready();
      await tf.setBackend('cpu');
      image = await ImageManipulator.manipulateAsync(image, uri, {
        resize: { width: 224, height: 224 }
      })
      const imageAssetPath = Image.resolveAssetSource(image)
      const imgB64 = await FileSystem.readAsStringAsync(imageAssetPath.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer)
      const imageTensor = imageToTensor(raw);
      // console.log('imageTensor: ', imageTensor);
      let model = await modelInit();
      let prediction = await model.predict(imageTensor);
      let predVal = prediction.arraySync()[0][0];
      console.log(predVal)
      // console.log(response)
      // // const response = Image.resolveAssetSource(imagePng).uri 
      // const rawImageData = await response.arrayBuffer();
      // const tensor = imageToTensor(rawImageData);
      // let model = await modelInit();
      // let prediction = await model.predict(tensor)
      // let predVal = prediction.arraySync()[0][0];
      // console.log(predVal)
    }
    catch (e) {
      console.log(e)
    }
  }

  // const handleCanvas = canvas => {
  //   const image = new CanvasImage(canvas);
  //   canvas.width = 224;
  //   canvas.height = 224;

  //   const context = canvas.getContext('2d');

  //   image.src = images[0];
  //   // RNimage.resolveAssetSource(imagePng).uri 


  //   image.addEventListener('load', () => {
  //     // debugger
  //     console.log('image is loaded');
  //     context.drawImage(image, 0, 0);
  //     const tensor = tf.browser
  //       .fromPixels(canvas)
  //       // .div(255)
  //       .toFloat()
  //       .expandDims(0);


  //     let result = predVal ? 'spam' : 'ham';
  //     setPred(result)

  //   });
  // }


  const removeImage = (i) => {
    let imgs = [...images];
    imgs.splice(i, 1);

    setImages(imgs);
  };
  const messageSend = () => {
    if (!textMsg.length && !images.length) {
      return;
    }

    if (images.length) {
      let formData = new FormData();
      formData.append("textMsg", textMsg);
      formData.append("from", user?._id);
      if (currentMsging.fullname) {
        formData.append("toInd", currentMsging._id);
      } else {
        formData.append("toGrp", currentMsging._id);
      }
      images.forEach(async (image) => {
        let localUri = image.uri;
        let filename = localUri.split('/').pop();
        const pred = await classify(image);
        console.log(pred)

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append("images", {
          uri: localUri, name: filename, type
        });
      });
      // POST("/messages/", formData, true, "multipart/form-data")
      //   .then((data) => {

      //     socket.emit("imgMsg", data);
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     displayError(err?.response?.data?.message);
      //   });
    } else {
      let receiver = currentMsging.fullname
        ? {
          toInd: currentMsging._id,
        }
        : {
          toGrp: currentMsging._id,
        };
      let msg = {
        ...receiver,
        from: user?._id,
        text: textMsg,
      };
      socket.emit("msgS", msg);
    }
    setTextMsg("");
    setImages([]);
  };

  let filteredMessages = [];
  if (currentMsging && currentMsging._id) {
    if (messages.length) {
      filteredMessages = messages.filter((msg) => {
        if (currentMsging.name) {
          if (msg.toGrp) {
            return msg.toGrp._id === currentMsging._id;
          }
        } else {
          if (msg.toInd) {
            if (
              msg.toInd._id === currentMsging._id ||
              (msg.from._id === currentMsging._id && msg.toInd._id === user?._id)
            ) {
              return true;
            }
          }
        }
        return false;
      });
    }
  }
  if (!user || !currentMsging) {
    return (
      <ActivityIndicator
        style={{ marginTop: 40 }}
        size="large"
        animating={true}
        color="blue"
      />
    );
  }

  return (
    <SafeArea>
      {/* <Canvas ref={handleCanvas}></Canvas> */}
      <View>
        <Appbar.Header
          style={{
            height: 50,
            zIndex: -1,
            backgroundColor: "rgb(106,106,232)",
          }}
        >
          <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate("Info", {
          //     profileUser: currentMsging,
          //   });
          // }}
          >
            <Appbar.Content
              title={
                currentMsging.fullname
                  ? currentMsging.fullname
                  : currentMsging.name
              }
              subtitle={currentMsging.status}
            />
          </TouchableOpacity>
        </Appbar.Header>
        <View style={styles.msgsNav}>
          <Chip
            type="outlined"
            selected={msgNav === "inbox"}
            icon="inbox"
            onPress={() => setMsgNav("inbox")}
          >
            Inbox
          </Chip>

          <Chip
            type="outlined"
            selected={msgNav === "spam"}
            style={styles.chips}
            icon="message-text-clock"
            onPress={() => setMsgNav("spam")}
          >
            Spam
          </Chip>
        </View>
      </View>

      <FlatList
        style={styles.msgList}
        ref={listRef}
        onContentSizeChange={() =>
          listRef.current.scrollToEnd({ animating: false })
        }
        data={filteredMessages}
        renderItem={({ item, i }) => (
          <MessageComponent
            msg={item}
            modelOpen={modelOpen}
            mdlImg={mdlImg}
            myID={user?._id}
            key={item._id}
            details={true}
          />
        )}
      />
      <View style={styles.selectedImage}>
        {images.length
          ? images.map((image, i) => (
            <View key={i}>
              <Image
                source={{ uri: image.uri }}
                style={{ width: 100, height: 100 }}
              />
              <TouchableOpacity
                style={styles.removeIcon}
                onPress={() => removeImage(i)}
              >
                <Ionicons name="trash" size={25} color="red" />
              </TouchableOpacity>
            </View>
          ))
          : null}

      </View>
      <TextInput
        placeholder="Type your message"
        value={textMsg}
        multiline={true}
        left={<TextInput.Icon name="image" onPress={selectImage} />}
        right={<TextInput.Icon name="send" onPress={messageSend} />}
        onChangeText={(text) => setTextMsg(text)}
      />
      {
        open ?
          <Pressable style={styles.modal}>
            <Ionicons name="arrow-back"
              onPress={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: 40,
                backgroundColor: 'black',
                zIndex: 300,
              }} size={50} color="white" />
            <Image
              source={{ uri: mdlImg }}
              style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height - 160, resizeMode: 'contain' }}
            />
          </Pressable>

          : null
      }
    </SafeArea>
  );
}

export default Chat;

const styles = StyleSheet.create({
  msgsNav: {
    position: "relative",
    top: 0,
    zIndex: 100,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  msgList: {
    height: "100%",
    flexGrow: 0,
  },
  selectedImage: {
    display: "flex",
    flexDirection: "row",
  },
  removeIcon: {
    position: "absolute",
    top: 0,

    right: 0,
  },
  modal: {
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
    position: 'absolute',
    top: 80,
    width: '100%',
    height: '200%',
    zIndex: 200

  }
});
