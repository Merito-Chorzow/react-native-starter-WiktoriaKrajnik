import React, {useState} from 'react';
import { View, Text, Alert, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import * as ImgPick from 'expo-image-picker';
import * as DocPick from 'expo-document-picker';
import { emitNoteAdded, type Item } from '../../components/Note';
import { impactAsync } from 'expo-haptics';
import { useRouter } from 'expo-router';

export default function UploadScreen() {
    const[item, setItem] = useState<Item[]>([]);
    const[title, setTitle] = useState('');
    const[description, setDescription] = useState('');
    const router = useRouter();
    
  
    const pickImage = async () => {
      const result = await ImgPick.launchImageLibraryAsync({
        mediaTypes: 'images', 
        quality: 1,
        });
        console.log(result);
        if (!result.canceled) {addItem('image', result.assets[0].uri)}
    };

    const pickDocument = async () =>  {
        const result = await DocPick.getDocumentAsync({ type: '*/*', multiple: false, copyToCacheDirectory: true});
        if(result.canceled) return;
        const file = result.assets[0];
        if (!file?.uri) {
          Alert.alert('Błąd', 'Nie udało się odczytać pliku.');
          return;
        }
        addItem("file", file.uri, file.name ?? 'plik');
    };

    function addItem(kind: Item['kind'], uri: string, filename?: string){
        if(!title.trim()) return Alert.alert('Brak tytułu.');
        const newItem: Item = {
            id: String(Date.now()),
            title: title.trim(),
            description: description.trim(),
            date: new Date().toLocaleString(),
            kind,
            uri,
            filename,
        };
        setItem(prev => [newItem, ...prev]);
        emitNoteAdded(newItem);
        sendToAPI(newItem);
        setTitle('');
        setDescription('');
    };

    const sendToAPI = async (note: Item) => {
        try {
          const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(note),
        });
        const result = await response.json();
        Alert.alert("Sukces", "Wysłano notatkę do API");
        } catch (error) {
        Alert.alert("Błąd", "Nie udało się wysłać do API");
        }
    };
  
    return (
        <View style={styles.main}>
            <Text style={styles.title}>Add File/Photo</Text>
            <TextInput style={styles.p1} placeholder="Title" value={title} onChangeText={setTitle}/>
            <TextInput style={styles.p2} placeholder="Description" multiline value={description} onChangeText={setDescription}/>
            <View>
              <TouchableOpacity style={styles.btn} onPress={pickImage}>
                <Text style={styles.btnText}>CHOOSE PHOTO</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={pickDocument}>
                <Text style={styles.btnText}>CHOOSE FILE</Text>
              </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 20,
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

// BUTTONY ZAMIENIĆ NA TouchableOpacity, POPRAWIĆ WYGLĄD -> LISTA MA SIĘ POKAZYWAĆ NA GŁÓWNEJ STRONIE, 