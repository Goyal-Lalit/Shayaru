import { supabase } from "./supabase";

export type Link = {
  id?: number;
  title: string;
  url: string;
  created_at?: string;
};

export async function getLinks(): Promise<Link[]> {
  const { data, error } = await supabase.from("links").select("*").order("id", { ascending: false });
  if (error) {
    console.error(error);
    return [];
  }
  return data as Link[];
}

export async function addLink(title: string, url: string) {
  const { data, error } = await supabase.from("links").insert([{ title, url }]);
  if (error) console.error(error);
  return data;
}

export async function deleteLink(id: number) {
  const { error } = await supabase.from("links").delete().eq("id", id);
  if (error) console.error(error);
}
