import { supabase } from "./supabase";

export type Note = {
  updated_at: string | number | Date;
  id?: string;   // <-- uuid instead of number
  title: string;
  content: string;
  color?: string;
  checklist?: string[];
  isImportant?: boolean;
  isBookmarked?: boolean;
  created_at?: string;
};

export async function getNotes(filter: string = "all"): Promise<Note[]> {
  let query = supabase.from("notes").select("*").order("created_at", { ascending: false });

  if (filter === "important") query = query.eq("isImportant", true);
  if (filter === "bookmarked") query = query.eq("isBookmarked", true);

  const { data, error } = await query;
  if (error) {
    console.error(error);
    return [];
  }
  return data as Note[];
}

export async function getNoteById(id: string): Promise<Note | null> {
  const { data, error } = await supabase.from("notes").select("*").eq("id", id).single();
  if (error) {
    console.error(error);
    return null;
  }
  return data as Note;
}

export async function addNote(note: Note) {
  const { data, error } = await supabase.from("notes").upsert([note]);
  if (error) console.error(error);
  return data;
}

export async function deleteNote(id: string) {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) console.error(error);
}
