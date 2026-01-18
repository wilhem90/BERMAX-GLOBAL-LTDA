const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables."
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const authUser = {
  signUp: async (req, res) => {
    try {
      const { email, password } = req.body ?? {};

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, error: "Email and password are required" });
      }

      // validação básica
      if (typeof password !== "string" || password.length < 8) {
        return res.status(422).json({
          success: false,
          error: "Password must be at least 6 characters",
        });
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        // Retorna código apropriado conforme o erro
        return res.status(400).json({ success: false, message: error.message });
      }

      return res.status(201).json({ success: true, data });
    } catch (err) {
      console.error("SignUp error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Internal server error" });
    }
  },

  singIn: async (req, res) => {
    const { email, password } = req.body;
    let { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return res.status(200).json({
      success: true,
      access_token: data.session.access_token,
    });
  },
};

module.exports = authUser;
