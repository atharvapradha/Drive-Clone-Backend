// src/models/User.js
const supabase = require("../config/supabaseClient");

// Create a new user
async function createUser({ name, email, password }) {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Find user by email
async function findUserByEmail(email) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // ignore "no rows" error
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

module.exports = { createUser, findUserByEmail };
