import React, {useState} from 'react';
import { View, Text, Button, Alert, StyleSheet, TextInput, TouchableOpacity, Image} from 'react-native';
import * as ImgPick from 'expo-image-picker';
import * as DocPick from 'expo-document-picker';
import { FlatList } from 'react-native';

type Item = {
    id: string;
    title: string;
    description: string;
    date: string;
    kind: 'image'| 'file';
    uri: string;
    filename?: string;
}

export default function UploadScreen() {
    const[item, setItem] = useState<Item[]>([]);
    const[title, setTitle] = useState('');
    const[description, setDescription] = useState('');
    
  
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
        sendToAPI(newItem)
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

    const renderItem = ({ item }: {item : Item}) => (
        <View style={styles.notes}>
            {item.kind === "image" ? (
            <Image source={{ uri: item.uri }} style={styles.img} />) : (<Text style={styles.fIcon}>📄</Text>)}
            <View style={styles.textBox}>
            <Text style={styles.nTitle}>{item.title}</Text>
            {!!item.description && <Text>{item.description}</Text>}
            <Text style={styles.nDate}>{item.date}</Text>
            {item.kind === "file" && <Text>{item.filename}</Text>}

        <TouchableOpacity onPress={() => removeItem(item.id)}>
            <Text style={styles.deleteBtn}>🗑 Usuń</Text>
        </TouchableOpacity>
        </View>
    </View>
    );

    function removeItem(id: string) {
        setItem(prev => prev.filter(item => item.id !== id));
    }
  
    return (
        <View style={styles.main}>
            <Text style={styles.title}>Dodaj plik/zdjęcie</Text>
            <TextInput style={styles.p1} placeholder="Title" value={title} onChangeText={setTitle}/>
            <TextInput style={styles.p2} placeholder="Description" multiline value={description} onChangeText={setDescription}/>
            <View>
              <TouchableOpacity style={styles.btn} onPress={pickImage}>
                <Text style={styles.btnText}>WYBIERZ ZDJĘCIE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={pickDocument}>
                <Text style={styles.btnText}>WYBIERZ PLIK</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={item}
              keyExtractor={item => item.id}
              renderItem = {renderItem}
            />
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
  fontSize: 12,
  color: "#666"
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
    backgroundColor: "#e63737ff",
    width: "auto",
    justifyContent: 'space-between', 
    borderRadius: 6, 
    alignItems: "flex-end"
  },

});

// BUTTONY ZAMIENIĆ NA TouchableOpacity, POPRAWIĆ WYGLĄD -> LISTA MA SIĘ POKAZYWAĆ NA GŁÓWNEJ STRONIE, 