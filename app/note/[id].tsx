import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { RichEditor, RichToolbar, actions } from "react-native-pell-rich-editor";
import { getNoteById, addNote, deleteNote, Note } from "../../lib/notes";
import { Ionicons } from "@expo/vector-icons";

export default function NoteDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState<Note>({ title: "", content: "" });
  const [lastSaved, setLastSaved] = useState<string>("");
  const richText = useRef<RichEditor>(null);

  useEffect(() => {
    if (id && id !== "new") {
      loadNote(id);
    } else {
      // New note ke liye aaj ki date save ho
      const today = new Date().toLocaleDateString();
      setLastSaved(today);
    }
  }, [id]);

  const loadNote = async (noteId: string) => {
    const data = await getNoteById(noteId);
    if (data) {
      setNote(data);
      // Sirf date (time nahi)
      setLastSaved(new Date().toLocaleDateString());
    }
  };

  const saveNote = async () => {
    await addNote(note);
    // Save karte waqt sirf date update hogi
    setLastSaved(new Date().toLocaleDateString());
    // Alert.alert("Saved", "Your note has been saved!");
  };

  const handleDelete = async () => {
    if (!id || id === "new") return router.back();
    Alert.alert("Delete?", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteNote(id);
          router.back();
        },
      },
    ]);
  };

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`${note.title}\n${note.content}`);
    Alert.alert("Copied", "Note copied to clipboard!");
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${note.title}\n\n${note.content}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#A2D5C6" />
        </TouchableOpacity>

        {/* Date in Center */}
        <Text style={styles.dateText}>{lastSaved}</Text>

        <TouchableOpacity onPress={saveNote}>
          <Ionicons name="save-outline" size={26} color="#A2D5C6" />
        </TouchableOpacity>
      </View>

      {/* Title Input */}
      <TextInput
        placeholder="Enter title..."
        placeholderTextColor="#A2D5C6"
        value={note.title}
        onChangeText={(text) => setNote((n) => ({ ...n, title: text }))}
        style={styles.titleInput}
      />

      {/* Rich Text Editor */}
      <ScrollView style={{ flex: 1 }}>
      <RichEditor
        ref={richText}
        initialContentHTML={note.content}
        placeholder="Write your note..."
        onChange={(html) => setNote((n) => ({ ...n, content: html }))}
        editorStyle={{
          backgroundColor: "#000000",
          color: "#fff",
          placeholderColor: "#A2D5C6",
        }}
        style={styles.editor}
      />
      </ScrollView>

      {/* Toolbar with text tools */}
      <RichToolbar
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.insertLink,
          actions.setStrikethrough,
        ]}
        style={styles.toolbar}
        iconTint="#A2D5C6"
      />

      {/* Bottom Icons */}
      <View style={styles.buttons}>
        <TouchableOpacity onPress={handleCopy}>
          <Ionicons name="copy-outline" size={26} color="#27AE60" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={26} color="#F39C12" />
        </TouchableOpacity>
        {id !== "new" && (
          <TouchableOpacity onPress={handleDelete}>
            <Ionicons name="trash-outline" size={26} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#00000", padding: 16 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateText: {
    color: "#A2D5C6",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 12,
    paddingVertical: 6,
  },
  editor: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: "#333",
    marginBottom: 10,
    minHeight: 250,
  },
  toolbar: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    marginVertical: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
});
