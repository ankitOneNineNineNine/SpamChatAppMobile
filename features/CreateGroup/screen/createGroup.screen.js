import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, KeyboardAvoidingView, ScrollView, FlatList, Pressable } from 'react-native';
import { Avatar, Button, Card, IconButton, Paragraph, TextInput, Title, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from 'react-native-vector-icons'
import { setCurrentMessaging, setUser } from '../../../common/actions';
import SafeArea from '../../../components/safeArea.component';
import Search from '../../../components/searchbar.component';
import TinyProfile from '../../../components/tinyProfile.component';
import * as ImagePicker from "expo-image-picker";
import { displayError, displayInfo, displaySuccess } from '../../../common/toaster';
import { POST, PUT } from '../../../adapters/http.adapter';
import { SocketContext } from '../../../infrastructure/context/socket.context';
import { getToken } from '../../../common/getSetToken';
export default function CreateGroup({ navigation }) {
    const dispatch = useDispatch();
    const { people } = useSelector(state => state.people)
    const me = useSelector(state => state.user.user)
    const [dispFriends, setDispFriends] = useState(false)
    const [group, setGroup] = useState([]);
    const [grpImg, setGrpImg] = useState(null);
    const [grpName, setGrpName] = useState("")
    const { socket } = useContext(SocketContext)
    const search = () => {
        people.length && setDispFriends(true)
    }

    const addToGrp = (user) => {
        if (group.findIndex(g => g._id === user._id) < 0)
            setGroup([...group, user])
    }
    const selectImage = async () => {
        let permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.cancelled) {
                setGrpImg(result);
            }
        } catch (e) {
            setGrpImg(null);
        }
    };
    const removeFromGrp = (user) => {
        let gr = group;
        let newGroup = gr.filter(g => g._id !== user._id);
        setGroup(newGroup)
    }
    const create = async () => {
        if (!grpName || grpName.length < 4) {
            displayError('Name length should be more than 3')
        }
        else {
            let formData = new FormData();

            formData.append("name", grpName);

            if (grpImg) {
                let localUri = grpImg.uri;
                let filename = localUri.split("/").pop();

                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;

                formData.append("image", {
                    uri: localUri,
                    name: filename,
                    type,
                });
            }
            let members = group.map((u) => u._id);
            members.forEach((member) => {
                formData.append("members", member);
            });
            try {
                let resp = await POST("/group", formData, true, "multipart/form-data")

                displaySuccess(resp);
                let hash = await getToken();
                dispatch(setUser({ token: hash }));
                setGrpName("");
                socket.emit("newGroup", {
                    members,
                });
                navigation.push("Main")
            } catch (e) {
                console.log(e);
                displayError(e?.response?.data?.message);
            }
        }

    }
    const friends = people.filter(p => me.friends.findIndex(f => f._id === p._id) >= 0)
    return (

        <SafeArea>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : 'height'}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                enabled={true}
            >
                <ScrollView>
                    <Card>
                        {/* <Card.Title
                    title="Card Title"
                    subtitle="Card Subtitle"
                    left={(props) => <Avatar.Icon {...props} icon="folder" />}
                    right={(props) => <IconButton {...props} icon="more-vert" onPress={() => { }} />}
                /> */}
                        <Pressable
                            onPress={selectImage}
                            style={{
                                zIndex: 1,
                                borderRadius: 100,
                                backgroundColor: 'black',
                                position: 'absolute',
                                top: 0,
                            }}>
                            <Ionicons name='camera' size={30} color='white' />
                        </Pressable>
                        <Card.Cover source={{ uri: grpImg ? grpImg.uri : 'https://picsum.photos/700' }} />
                        <Card.Content>
                            <Title>
                                Group Name
                            </Title>
                            <TextInput
                                label="Group Name"
                                onChangeText={(text) => setGrpName(text)}
                                value={grpName}
                            // mode="flat"
                            // onChangeText={(text) => editCredentialsChange("fullname", text)}
                            />
                            <Title>Members</Title>
                            <View
                                style={{ flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'space-between' }}
                            >
                                {group.map(g => {
                                    return (
                                        <Chip
                                            key={g._id}
                                            type='outlined'
                                            avatar={g.image ?
                                                <Avatar.Image size={24} source={{ uri: g.image }} />
                                                :
                                                <Avatar.Text size={24} label={g.username.charAt(0)} />
                                            }
                                            onPress={() => removeFromGrp(g)}>{g.username}
                                        </Chip>
                                    )
                                })}
                            </View>
                            <Title>Add Members</Title>
                            <Search search={search} friendsOnly={true} />
                            {setDispFriends &&
                                <FlatList
                                    data={friends}
                                    keyExtractor={(item) => item._id}
                                    renderItem={({ item, i }) => (
                                        <TinyProfile
                                            key={item._id}
                                            add={true}
                                            onGrp={group.findIndex(g => g._id === item._id) >= 0}
                                            addToGrp={addToGrp}
                                            removeFromGrp={removeFromGrp}
                                            profile={item}

                                        />
                                    )}
                                />

                            }

                        </Card.Content>
                        <Card.Actions>
                            <Button>Cancel</Button>
                            <Button onPress = {create}>Create</Button>
                        </Card.Actions>
                    </Card>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeArea>
    )
}