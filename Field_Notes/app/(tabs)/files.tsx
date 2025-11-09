import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import { setOnNoteAdded2, type Item, emitNoteRemove, AllNotes } from '../../components/Note';

export default function HomeScreen() {
  const[item, setItem] = useState<Item[]>([]);
  const[detailsId, setDetailsId] = useState<Set<string>>(new Set());

  useEffect(()=>{
    setItem(AllNotes());
    setOnNoteAdded2((item) => setItem(prev => [item, ...prev]));
  },[]);
  
  function removeItem(id: string) {
    setItem(prev => prev.filter(item => item.id !== id));
    emitNoteRemove(id);
  }

  function showDetails(id: string){
    setDetailsId((prev) => {
      const detail = new Set(prev);
      if (detail.has(id)) detail.delete(id);
      else detail.add(id);
      return detail;
    })
  }

  
  const renderItem = ({ item }: {item : Item}) => (
    <View style={styles.notes}>
      <View style={styles.row}>
        {item.kind === "image" ? (
        <Image source={{ uri: item.uri }} style={styles.img} />) : (<Text style={styles.fIcon}>📄</Text>)}
        <View style={styles.textBox}>
          <Text style={styles.nTitle}>Title: {item.title}</Text>
          <Text style={styles.nDate}>Date: {item.date}</Text>
          {item.kind === "file" && <Text>{item.filename}</Text>}
          <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Text style={styles.deleteBtn}>🗑 Delete</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.deleteBtn}>✒️ Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showDetails(item.id)}>
            <Text style={styles.deleteBtn}>{detailsId.has(item.id) ? '🔺Hide' : 'ℹ️ Details'}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {detailsId.has(item.id) && (
        <View style={styles.detailsBox}>
          {item.kind === "image" ? (
            <Image source={{ uri: item.uri }} style={styles.img2}/>
          ) : (
            <Text style={styles.fIcon}>📄</Text>
          )}

          <View style={styles.details}>
            <Text style={styles.detailsTitle}>Title: {item.title}</Text>
            {!!item.description && <Text>Description: {item.description}</Text>}
            <Text>Date: {item.date}</Text>
            {item.kind === "file" && !!item.filename && <Text>{item.filename}</Text>}
          </View>
        </View>
      )}
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
      <Text style={styles.title}>Edit notes</Text>
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
    flexDirection: "column",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fafafa",
    gap: 10
  },
  row:{
    flexDirection: "row",
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
  },
  deleteBtn: { 
    width: "auto",
    justifyContent: 'space-between', 
    borderRadius: 6, 
    alignItems: "flex-end"
  },
  detailsBox:{
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    paddingBottom: 12,
    gap: 10,
  },
  img2:{
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  details:{
    gap: 4,
  },
  detailsTitle:{
    fontWeight: '600',
  }
});
