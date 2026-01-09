const permisionUser = {
  isAdmin: (role) => {
    console.log(role);
    return role === "admin";
  },
};

module.exports = permisionUser;
