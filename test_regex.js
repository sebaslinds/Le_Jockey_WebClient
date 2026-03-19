const text = `ADD_TO_CART: {"id": "custom-vj-d", "name": "Le Vieux Jockey", "price": 16, "quantity": 1, "type": "custom", "alcohol_portion": "double", "flavor_profile": "Fort", "alcohol_choice": "Whiskey"}`;
const match = text.match(/ADD_TO_CART:\s*(\{.*?\})/s);
console.log(match);
