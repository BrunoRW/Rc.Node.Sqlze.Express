import { StyleSheet, Text, View, TouchableOpacity, FlatList,TextInput} from "react-native";
import { useState, useEffect } from "react";

export default function Page() {
  const [users, setUsers] = useState([]);
  const [nomeU, setNome] = useState("");
  const [emailU, setEmail] = useState("");

  const [load, setLoad] = useState(false);

  const [editItem, setEdit] = useState(false);
  const [item, setItem] = useState(0);

  async function fetchUsers() {
    await fetch("http://localhost:3000/users", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setUsers(data.reverse()));
  }

  async function addUser() {

    console.log(nomeU, emailU)

    if(nomeU && emailU){
      await fetch("http://localhost:3000/users", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          nome: nomeU,
          email: emailU,
        }),
      }).then(() => fetchUsers());
    }
  }

  async function del(e){
    await fetch(`http://localhost:3000/users/${e}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
    }).then(() => fetchUsers());
  }

  function openEdit(e){
    setNome("");
    setEmail("");
    setEdit(true);
    setItem(e);
  }

  function cancelarEdit(){
    setEdit(false);
  }

  async function edit(e){
    let nName = nomeU;
    let nEmail = emailU;

    await fetch(`http://localhost:3000/users/${e}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        nome: nName,
        email: nEmail,
      }),
    }).then(() => fetchUsers())
    .then(()=>{
      setEdit(false);
    })
  }

  if(load == false){
    setLoad(true);
    fetchUsers();
  }

  return (
    <View style={styles.container}>
        <Text style={styles.title}>USERS LIST</Text>
        <View style={styles.formOut}>
          <TextInput style={styles.inp} onChangeText={(value) => setNome(value)} placeholder="Nome do usuário"/>
          <TextInput style={styles.inp} onChangeText={(value) => setEmail(value)} placeholder="Email do usuário"/>
          <TouchableOpacity style={styles.bt} onPress={() => addUser()}>
            <Text style={styles.txtBt}>Adicionar</Text>
          </TouchableOpacity>
        </View>

        <View style={editItem == true ? styles.itemEdit : styles.closedEdit}>
          <TextInput style={styles.inp} value={nomeU} onChangeText={(value) => setNome(value)} placeholder="Novo nome"/>
          <TextInput style={styles.inp} value={emailU} onChangeText={(value) => setEmail(value)} placeholder="Novo email"/>
          <TouchableOpacity style={styles.bts} onPress={() => edit(item)}>
            <Text>Alterar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bts} onPress={() => cancelarEdit()}>
            <Text>Cancelar</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.listOut}>
          <FlatList
            style={styles.list}
            data={users}
            renderItem={({ item }) => (
              <View style={styles.itens}>
                <View style={styles.infos}>
                  <Text style={styles.titleIn}>Nome</Text>
                  <Text>{item.nome}</Text>
                  <Text style={styles.titleIn}>Email</Text>
                  <Text>{item.email}</Text>
                </View>
                <View style={styles.btns}>
                  <TouchableOpacity style={styles.bts} onPress={() => del(item.id)}>
                    <Text>Deletar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.bts} onPress={() => openEdit(item.id)}>
                    <Text>Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#d7e3ed",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  title: {
    fontWeight: "bolder",
    fontSize: 20
  },
  formOut: {
    margin: 20,
    display: "flex",
    gap: 10,
    width: "100%"
  },
  inp: {
    padding: 10,
    width: "100%",
    backgroundColor: "white",
    color: "gray",
    borderRadius: 5,
    borderColor: "#72899c",
    borderWidth: "2px",
    borderStyle: "solid",
    marginTop: 10,
  },
  bt: {
    padding: 10,
    backgroundColor: "#72899c",
    borderRadius: 5,
  },
  txtBt: {
    color: "white",
    textAlign: "center"
  },
  listOut:{
    marginTop: 10,
    width: "100%",
  },
  list:{
    width: "100%",
  },
  itens: {
    width: "calc(100%)",
    display: "flex",
    padding: 10,
    backgroundColor: "white",    
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderRadius: 5
  },
  titleIn:{
    fontWeight: "bolder"
  },
  infos: {
    display: "flex",
    gap: 10
  },
  btns:{
    margin: 10,
    display: "flex",
    flexDirection: "column",
    gap: 10
  },
  bts:{
    padding: 10,
    backgroundColor: "#eee",
    textAlign: "center",
    borderRadius: 5,
    marginTop: 10
  },
  closedEdit: {
    display: "none"
  },
  itemEdit: {
    width: "100%",
    backgroundColor: "white",
    padding: 10
  }
})