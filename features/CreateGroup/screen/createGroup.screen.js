import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentMessaging, setUser } from '../../../common/actions';
import SafeArea from '../../../components/safeArea.component';
import * as ImagePicker from "expo-image-picker";
import { displayError, displayInfo, displaySuccess } from '../../../common/toaster';
import { POST, PUT } from '../../../adapters/http.adapter';
import { SocketContext } from '../../../infrastructure/context/socket.context';
import { getToken } from '../../../common/getSetToken';
import GroupCard from '../../../components/groupCard.component';
export default function CreateGroup({ edit = false, navigation }) {
    const dispatch = useDispatch();
    const { people } = useSelector(state => state.people)
    const me = useSelector(state => state.user.user)
    const [dispFriends, setDispFriends] = useState(false)
    const [group, setGroup] = useState([]);
    const [grpImg, setGrpImg] = useState(null);
    const [grpName, setGrpName] = useState("");

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
    const editS = () => {

    }
    const friends = people.filter(p => me.friends.findIndex(f => f._id === p._id) >= 0)
    return (
// 
        <SafeArea>

            <GroupCard
                edit={edit}
                editS={editS}
                selectImage={selectImage}
                search={search}
                setDispFriends={setDispFriends}
                group={group}
                setGroup={setGroup}
                grpImg={grpImg} setGrpImg={setGrpImg} setGrpName={setGrpName} addToGrp={addToGrp} removeFromGrp={removeFromGrp} create={create} friends={friends} />
        </SafeArea>
    )
}