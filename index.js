import { graphqlHTTP } from "express-graphql";
import { buildSchema, assertInputType } from "graphql";
import express from "express";

// Construct a schema, using GraphQL schema language
var restaurants = [
  {
    id: 1,
    name: "WoodsHill ",
    description:
      "American cuisine, farm to table, with fresh produce every day",
    dishes: [
      {
        name: "Swordfish grill",
        price: 27,
      },
      {
        name: "Roasted Broccily ",
        price: 11,
      },
    ],
  },
  {
    id: 2,
    name: "Fiorellas",
    description:
      "Italian-American home cooked food with fresh pasta and sauces",
    dishes: [
      {
        name: "Flatbread",
        price: 14,
      },
      {
        name: "Carbonara",
        price: 18,
      },
      {
        name: "Spaghetti",
        price: 19,
      },
    ],
  },
  {
    id: 3,
    name: "Karma",
    description:
      "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
    dishes: [
      {
        name: "Dragon Roll",
        price: 12,
      },
      {
        name: "Pancake roll ",
        price: 11,
      },
      {
        name: "Cod cakes",
        price: 13,
      },
    ],
  },
];
var schema = buildSchema(`
type Query{
  restaurant(id: Int): restaurant
  restaurants: [restaurant]
},
type restaurant {
  id: Int
  name: String
  description: String
  dishes:[Dish]
}
type Dish{
  name: String
  price: Int
}
input restaurantInput{
  name: String
  description: String
}
type DeleteResponse{
  ok: Boolean!
}
type Mutation{
  setrestaurant(input: restaurantInput): restaurant
  deleterestaurant(id: Int!): DeleteResponse
  editrestaurant(id: Int!, name: String!): restaurant
}
`);
// The root provides a resolver function for each API endpoint

var root = {
  restaurant: (arg) => {
    // Your code goes here
    // Entrega un solo restaurante por su id
    return restaurants.find((restaurant) => restaurant.id === arg.id);
  },
  restaurants: () => {
    // Your code goes here
    // Entrega todos los restaurantes
    return restaurants;
  },
  setrestaurant: ({ input }) => {
    // Your code goes here
    // Crea un Nuevo restaurante y toma de input name y description
    const newRestaurant = {
      id: restaurants.length + 1,
      name: input.name,
      description: input.description || "",
      dishes: [],
    };
    restaurants.push(newRestaurant);
    return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
    // Your code goes here
    // Elimina un restaurante por su id
    const restaurantIndex = restaurants.findIndex(
      (restaurant) => restaurant.id === id
    );
    if (restaurantIndex === -1) {
      return { ok: false };
    }
    restaurants.splice(restaurantIndex, 1);
    return { ok: true };
  },
  editrestaurant: ({ id, ...restaurant }) => {
    // Your code goes here
    // Cambia el nombre del restaurante
    const rest = restaurants.find(
      (rest) => rest.id === id 
    );
    if (!rest) {
      throw new Error("El restaurante no se encontro");
    }
    rest.name = restaurant.name;
    return rest;
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
var port = 5500;
app.listen(5500, () => console.log("Running Graphql on Port:" + port));

export default root;
