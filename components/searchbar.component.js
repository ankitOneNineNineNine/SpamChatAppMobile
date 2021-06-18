import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { useDispatch } from "react-redux";
import { searchPeople } from "../common/actions";

function Search({ friends = false, search }) {
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const onChangeSearch = (query) => setSearchQuery(query);
  const srch = async () => {
    await dispatch(searchPeople(searchQuery));
    search();
  };
  return (
    <Searchbar
      placeholder={friends ? "Search Friends, Groups" : "Search People"}
      onChangeText={onChangeSearch}
      onSubmitEditing={srch}
      value={searchQuery}
    />
  );
}

export default Search;

const styles = StyleSheet.create({});
