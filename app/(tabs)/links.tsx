import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { getLinks, addLink, deleteLink, Link } from "../../lib/links";

export default function Links() {
  const [links, setLinks] = useState<Link[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    const data = await getLinks();
    setLinks(data);
  };

  const handleAdd = async () => {
    if (!title.trim() || !url.trim()) return;
    await addLink(title, url);
    setTitle("");
    setUrl("");
    loadLinks();
  };

  const handleDelete = async (id: number) => {
    await deleteLink(id);
    loadLinks();
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    // Alert.alert("Copied", "Link copied to clipboard!");
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#000" }}>
      <Text style={styles.header}>Links</Text>

      {/* Input Section */}
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="https://..."
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TouchableOpacity onPress={handleAdd} style={styles.addBtn}>
          <Text style={{ color: "#000", fontWeight: "600" }}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Grid of Tabs */}
      <FlatList
        data={links}
        numColumns={2} // 2 items per row
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardUrl}>{item.url}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => handleCopy(item.url)}
                style={styles.copyBtn}
              >
                <Text style={{ color: "#000", width:40 }}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id!)}
                style={styles.deleteBtn}
              >
                <Text style={{ color: "#F6F6F6", width:50}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 12,
    color: "#CFFFE2",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#1A1A1A",
    color: "#fff",
    padding: 8,
    borderRadius: 8,
    marginRight: 6,
  },
  addBtn: {
    backgroundColor: "#CFFFE2",
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#A2D5C6",
    borderRadius: 12,
    padding: 12,
    margin: 6,
  },
  cardTitle: {
    fontWeight: "700",
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  cardUrl: {
    color: "#2D336B",
    fontSize: 12,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  copyBtn: {
    backgroundColor: "#CFFFE2",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteBtn: {
    backgroundColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
});
