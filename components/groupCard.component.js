import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, KeyboardAvoidingView, ScrollView, FlatList, Pressable } from 'react-native';
import { Avatar, Button, Card, IconButton, Paragraph, TextInput, Title, Chip } from 'react-native-paper';
import Search from './searchbar.component';
import TinyProfile from './tinyProfile.component';

import { Ionicons } from 'react-native-vector-icons'
export default function GroupCard({
    setGroup,
    grpImg,
    group,
    search,
    setGrpImg,
    setDispFriends,
    grpName,
    setGrpName,
    selectImage,
    addToGrp,
    removeFromGrp,
    create,
    friends,
    editS,
    edit
}) {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : 'height'}
            keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            enabled={true}
        >
            {/* <ScrollView> */}
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
                    <Button onPress={edit ? editS : create}>{edit ? "Edit" : "Create"}</Button>
                </Card.Actions>
            </Card>
            {/* </ScrollView> */}
        </KeyboardAvoidingView>
    )
}