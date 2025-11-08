import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { setOnNoteAdded, type Item, setOnNoteDelete } from '../../components/Note';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const[item, setItem] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(()=>{
    setOnNoteAdded((item) => setItem(prev => [item, ...prev]));
    setOnNoteDelete((id) => setItem((prev) => prev.filter((item) => item.id !== id)));
  },[]);
  
  const renderItem = ({ item }: {item : Item}) => (
    <View style={styles.notes}>
      {item.kind === "image" ? (
      <Image source={{ uri: item.uri }} style={styles.img} />) : (<Text style={styles.fIcon}>📄</Text>)}
      <View style={styles.textBox}>
        <Text style={styles.nTitle}>Title: {item.title}</Text>
        <Text style={styles.nDate}>Date: {item.date}</Text>
        {item.kind === "file" && <Text>{item.filename}</Text>}
      </View>
    </View>
  );

  const ListEmptyComponent = () => {
    return (
      <View style={styles.empty}>
        <Text  style={styles.emptyText}>You haven't add any notes</Text>
      </View>
    );
  };

  return (
    <View style={styles.all}>
      <Text style={styles.title}>Note List</Text>
      <FlatList
        data={item}
        keyExtractor={item => item.id}
        renderItem = {renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  all:{
    flex:1,
  },
  title:{
    textAlign: 'center',
    fontSize: 25,
    marginTop: 12,
    marginBottom: 12,
  },
  empty:{
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyText:{
    fontSize: 30,
    textAlign: 'center',
  },
  notes:{
    flexDirection: "row",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fafafa",
    gap: 10
  },
  textBox: {
    flex: 1,
  },
  nTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  nDate: {
    fontSize: 16,
  },
  fIcon: {
    fontSize: 40,
    textAlignVertical: "center"
  },
  img:{
      width: 100, 
      height: 80, 
      borderRadius: 6, 
      backgroundColor: '#ddd'
  }
});
