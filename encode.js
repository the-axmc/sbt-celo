// Import ethers
const { ethers } = require("ethers");

// Replace with the address you want to encode
const initialOwner = "0x075a544BC3C211b3Ab6726F63e132865227C986a";  // Change to your address

// ABI encode the address using ethers.js v6
const encodedArgs = ethers.utils.defaultAbiCoder.encode(
  ["address"], // Type of the parameter (address in this case)
  [initialOwner] // The value of the argument (your address)
);

// Print the ABI-encoded argument to the console
console.log(encodedArgs);
