const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

module.exports = function () {
  if (!jwtPrivateKey) {
    throw new Error("FATAL Error: jwtPrivatekey is not defind");
  }
};
