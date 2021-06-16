import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";

function Search() {
  const [searchQuery, setSearchQuery] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  return (
    <Searchbar
      placeholder="Search People"
      onChangeText={onChangeSearch}
      value={searchQuery}
    />
  );
}

export default Search;

const styles = StyleSheet.create({

});
