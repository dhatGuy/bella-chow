import { supabase } from "api";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    let res = await supabase.auth.signOut();
    setUser(null);
    return res;
  };

  const signIn = async (data) => {
    let res = await supabase.auth.signIn(data);
    if (!res.error) {
      const { data: profile, error } = await supabase
        .from("users")
        .select()
        .eq("id", res.user.id)
        .single();

      const user = {
        ...res.data.user,
        ...profile,
      };

      setUser(user);
    }
    return res;
  };

  const signUp = async (data) => {
    return await supabase.auth.signUp(data);
  };

  const forgotPassword = async (email) => {
    return await supabase.auth.api.resetPasswordForEmail(email);
  };

  useEffect(() => {
    setLoading(true);
    // Check active sessions and sets the user
    const session = supabase.auth.session();
    // const getProfile = async () => {
    if (session) {
      supabase
        .from("users")
        .select(`*, cafe:cafeterias!owned_by(*)`)
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
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const value = {
    signUp,
    signIn,
    signOut,
    user,
    setUser,
    loading,
    forgotPassword,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
