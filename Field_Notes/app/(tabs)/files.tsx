import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { setOnNoteAdded2, type Item, emitNoteRemove, AllNotes, emitEditNote } from '../../components/Note';

export default function HomeScreen() {
  const[item, setItem] = useState<Item[]>([]);
  const[detailsId, setDetailsId] = useState<Set<string>>(new Set());
  const[editId, setEditId] = useState<string | null>(null)
  const[newTitle, setNewTitle] = useState<string>('')
  const[newDescription, setNewDescription] = useState<string>('')

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

  function startEdit(item : Item){
    if (editId === item.id) {
    setEditId(null);
    setNewTitle('');
    setNewDescription('');
  } else {
    setDetailsId(new Set());
    setEditId(item.id);
    setNewTitle(item.title);
    setNewDescription(item.description ?? '');
  }
  }

  function cancelEdit(){
    setEditId(null);
    setNewTitle('');
    setNewDescription('');
  }

  function saveEdit(item: Item){
    const newtitle = newTitle.trim();
    const newdescription = newDescription.trim()
    if(!newtitle) {
      Alert.alert('Validation', 'Title cannot be empty'); 
      return;
    }
    const edit: Item = {
      ...item,
      title: newtitle,
      description: newdescription,
    };

    emitEditNote(edit);
    setItem(prev => prev.map(note => note.id === edit.id ? edit : note));
    setEditId(null);
  }


  
  const renderItem = ({ item }: {item : Item}) => (
    <View style={styles.notes}>
      <View style={styles.row}>
        {item.kind === "image" ? (
        <Image source={{ uri: item.uri }} style={styles.img} accessibilityRole="image" accessibilityLabel={'Photo'} />) : (<Text style={styles.fIcon} accessible={false}>📄</Text>)}
        <View style={styles.textBox}>
          <Text style={styles.nTitle}>Title: {item.title}</Text>
          <Text style={styles.nDate}>Date: {item.date}</Text>
          {item.kind === "file" && <Text>{item.filename}</Text>}
          <View style={styles.action}>
            <TouchableOpacity style={styles.btn} onPress={() => removeItem(item.id)} accessibilityRole="button" accessibilityLabel={'Delete note'}>
              <Text style={styles.btnText}>🗑 Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => startEdit(item)} accessibilityRole="button" accessibilityLabel={editId === item.id ? 'Cancel edit' : 'Edit'}>
              <Text style={styles.btnText}>{editId === item.id ? '❌ Cancel' : '✒️ Edit'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => showDetails(item.id)} accessibilityRole="button" accessibilityLabel= {detailsId.has(item.id) ? 'Hide note details' : 'Show note details' }>
              <Text style={styles.btnText}>{detailsId.has(item.id) ? '🔺Hide' : 'ℹ️ Details'}</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
      
      {editId === item.id && (
        <View style={styles.detailsBox}>
          <TextInput style={styles.p1} value={newTitle} onChangeText={setNewTitle} placeholder='Title' accessibilityLabel='Edit title'/>
          <TextInput style={styles.p2} value={newDescription} onChangeText={setNewDescription} placeholder='Description' accessibilityLabel='Edit description' multiline/>
          <View>
            <TouchableOpacity  style={styles.btn} onPress={() => saveEdit(item)} accessibilityRole="button" accessibilityLabel="Save edit">
              <Text style={styles.btnText}>Save changes</Text>
            </TouchableOpacity>
            <TouchableOpacity  style={styles.btn} onPress={cancelEdit} accessibilityRole="button" accessibilityLabel="Cancel changes">
              <Text style={styles.btnText}>Cancel changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {detailsId.has(item.id) && (
        <View style={styles.detailsBox}>
          {item.kind === "image" ? (
            <Image source={{ uri: item.uri }} style={styles.img2} accessibilityRole="image" accessibilityLabel={'Photo'}/>
          ) : (
            <Text style={styles.fIcon} accessible={false}>📄</Text>
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
        <Text  style={styles.emptyText} accessibilityRole="text"  accessibilityLabel= "No notes. Add first in the upload.">You haven't added any notes</Text>
      </View>
    );
  };

  return (
    <View style={styles.all}>
      <Text style={styles.title} accessibilityRole="header">Edit notes</Text>
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
    width: 100,
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
  action:{
    flexDirection: 'column',
    gap: 12,
    marginTop: 60,
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
  },
  p1:{
    fontSize: 20,
    color: "#000",
    borderColor: "#a7a7a7ff",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
  },
  p2:{
    fontSize: 20,
    color: "#000",
    borderColor: "#a7a7a7ff",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12
  },
  btn: {
    fontSize:18,
    width: 140,
    height: 48,
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#000",
    color:"#fff",
    alignItems: 'center',
  },
  btnText: {
    fontSize:18,
    color:"#fff",
    textAlign: 'center'
  }
});
