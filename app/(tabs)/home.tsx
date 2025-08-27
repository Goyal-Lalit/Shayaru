import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { getNotes, Note } from "../../lib/notes";

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ""); // remove all tags
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}`;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const loadNotes = async () => {
    const data = await getNotes("all");
    setNotes(data);
  };

  const filtered = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      stripHtml(n.content || "")
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shayaru</Text>

      {/* Search */}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search notes..."
        placeholderTextColor="#aaa"
        style={styles.search}
      />

      {/* Notes list in 2 columns */}
      <FlatList
        data={filtered}
        numColumns={2}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/note/[id]",
                params: { id: item.id?.toString() },
              })
            }
          >
            <Text style={styles.cardTitle}>{item.title || "Untitled"}</Text>
            <Text style={styles.cardContent} numberOfLines={3}>
              {stripHtml(item.content || "")}
            </Text>
            <Text style={styles.dateText}>
              {formatDate(item.created_at || new Date().toISOString())}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Add new note button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push({ pathname: "/note/[id]", params: { id: "new" } })
        }
      >
        <Text style={{ color: "#000", fontSize: 28, fontWeight: "700" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000000", padding: 16 },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 12, color: "#CFFFE2" },
  search: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#1A1A1A",
    color: "#CFFFE2",
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#A2D5C6",
    padding: 14,
    borderRadius: 12,
    width: "48%", // 2 cards ek row me
    minHeight: 160,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000000",
  },
  cardContent: { color: "#2D336B", flex: 1 },
  dateText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#CFFFE2",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});
