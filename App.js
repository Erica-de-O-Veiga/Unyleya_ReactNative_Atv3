import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet,
   Text,
   View,
   TextInput,
   TouchableOpacity, 
   FlatList,
   KeyboardAvoidingView,
   Platform,
   Keyboard,
   Alert,
   AsyncStorage
   

} from 'react-native';

import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import  { useState, useEffect } from 'react';
export default function App() {
  const [task, setTask] = useState([ ]);
  const [newTask, setNewTask] = useState("");

 
   async function addTask(){
    if (newTask === ''){
      return;
    }       
    const search= task.filter(task => task === newTask);
    if (search.length != 0){
      Alert.alert("Atenção", "Nome da tarefa repetido!");
      return; 
    }

    // teste
    setTask([...task, newTask]);
    setNewTask('');
    Keyboard.dismiss();

   }
   async function removerTask(item){
    Alert.alert(
       "Apagar Task",
       "Tem certeza que deseja  remover esta tarefa?",
       [
        {
        text: "Cancel",
        onPress:() =>{
          return;
        },
        style:'cancel'
       }, 
      {
        text: "Ok",
        onPress: () => setTask(task.filter(task != item))
      }, 
    ], 
    { cancelable : false }
    );
    
   }

   useEffect(()=> {
    async function carregarDados(){
      const task = await AsyncStorage.getItem("task");
       if(task){
        setTask(JSON.parse(task));
       }
    }
    carregarDados();
   },[])

   useEffect(() => {
    async function salvaDados(){
      AsyncStorage.setItem("task", JSON.stringify(task))
    }
    salvaDados();
   }, [task]) 

  return (
    <>
    <KeyboardAvoidingView
       keyboardVerticalOffset={0}
       behavior = "padding"
       style= {{flex: 1}}
       enable = {Platform.OS === 'ios'}
       >
         
      <View style={styles.container}>
        <View style= {styles.Body}>
          <FlatList 
             style={styles.FlatList}
             data ={task}
             keyExtractor={item => item.toString()}
             showsVerticalScrollIndicator={false}
             renderItem={({item}) => (
              <View style={styles.ContainerView}>
                <Text style={styles.Texto}>{item}</Text>
                <TouchableOpacity onPress={() =>removerTask(item)}>
                  <MaterialIcons 
                  name= "delete-forever"
                   size ={25}
                   color ="#f64c65"
                   />
                </TouchableOpacity>
              </View>
             )} 
          />    
        </View>        
        <StatusBar style="auto" />
        <View style={styles.Form}>
        <TextInput 
           style= {styles.Input}
           placeholderTextColor="#999"
           autoCorrect={true}
           placeholder= "Adicione uma tarefa"
           maxLength={25}
           onChangeText={text => setNewTask(text)}
           value = {newTask}
        ></TextInput>
        <TouchableOpacity style={styles.Button} onPress={()=> addTask() }>
          <Ionicons name= "ios-add" size={25} color="#FFF"/>
        </TouchableOpacity>
      </View>
      </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal:20,
    paddingLeft:20,
    marginTop:20
  },
  Body:{
    flex:1
  },
  Form:{
    padding:0,
    height:60,
    justifyContent:"center",
    alinSelf: "streatch",
    flexDirection: "row",
    paddingTop:13,
    marginBottom: 20,
    borderTopWith:1,
    borderColor:"#eee"
    
  }, 
  Input: {
    flex:1,
    height:40,
    backgroundColor:"#eee",
    borderRadius:4,
    paddingVertical:5,
    paddingHorizontal:5,
    borderWidth:1,
    borderColor:"#eee"
  },
  Button:{
    height:40,
    width:40,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"lightblue",
    borderRadius:4,
    marginLeft: 10
  }, 
  FlatList:{
    flex:1,
    marginTop: 5
  },
  ContainerView:{
    marginBottom: 15,
    padding:15,
    borderRadius:4,
    backgroundColor: "#eee",
    display: 'flex',
    flexDirection: 'row', 
    alignItems: "center",
    justifyContent:"space-between",
    borderWidth: 1,
    borderColor: "#eee"
  },
  Texto: {
    fontSize:14,
    color:"#333",
    fontWeight: "bold",
    marginTop:4,
    textAlign:"center"
  }

});
