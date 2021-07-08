import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    let res = await supabase.auth.signOut();
    setUser(null);
    return res;
  };

  const signIn = async (data) => {
    let res = await supabase.auth.signIn(data);
    const { data: profile, error } = await supabase
      .from("users")
      .select()
      .eq("id", res.user.id)
      .single();

    const user = {
      ...res.user,
      ...profile,
    };

    setUser(user);
    return user;
  };

  const signUp = async (data) => {
    const res = await supabase.auth.signUp(data);
    return res;
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.session();
    // const getProfile = async () => {
    supabase
      .from("users")
      .select()
      .eq("id", session?.user.id)
      .single()
      .then(({ data, error }) => {
        const user = {
          ...(session?.user ?? null),
          ...data,
        };
        setUser(user ?? null);
        setLoading(false);
      });

    // Listen for changes on auth state (logged in, signed out, etc.)
    // const { data: listener } = supabase.auth.onAuthStateChange(
    //   async (event, session) => {
    //     setUser(session?.user ?? null);
    //     setLoading(false);
    //   }
    // );

    // return () => {
    //   listener?.unsubscribe();
    // };
  }, []);

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    setUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within UserProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
