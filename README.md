
  

# A Node.js + Express.js + Mongodb GraphQL with JWT authentication

  

  

  

🖐 Hi there, I've built a node.js + express.js + MongoDB GraphQL along with JWT authentication. Here I've taken book-database as an example for making CRUD operations via GraphQL queries with JWT authentication. Please go through the screenshots to know more about endpoints. Feel free to use this code and work around it. Hope you got the insights!

  ## 📦packages used:

 1. bcryptjs - Password hashing
 2. jsonwebtoken - for generating JWT
 3. express-validator - Input validation
 4. mongodb - mongodb cluster
 5. mongoose - ODM
 6. express - node.js framework
 7. express-graphql & graphql - for defining schema and resolvers

## Endpoints

    http://localhost:3000/graphql
 

## 📸 ScreenShots:
Authentication
![authentication](https://images2.imgbox.com/86/26/9R7htj37_o.jpg)

GET Query
![Get method](https://images2.imgbox.com/f7/26/JQpbeo3l_o.jpg)


GET/id Query
![Get method](https://images2.imgbox.com/fd/31/VJl8ojL7_o.jpg)

POST (Mutation)
![Post method](https://images2.imgbox.com/c6/fa/DB8qAkaw_o.jpg)


PUT (Mutation)
![PUT method](https://images2.imgbox.com/f3/0a/5YH17hCQ_o.jpg)


DELETE (Mutation)
![DELETE method](https://images2.imgbox.com/d4/aa/qF87x5U9_o.jpg)

## 😀How to use this project

1. Well, first clone or download this repo.
2. Create a cluster in mongodb Atlas, and then create a collection, and get your access URL to your cluster's database and paste it in ***app.js*** for ***MONGODBURL*** variable.
3. Run "npm install" to install dependent packages for the app.
4. Create a document with email and password(bcrypt hashed) in user collection for you to authenticate yourselves.
5. Now, you're ready to go!




## 📰License

  

[MIT](https://choosealicense.com/licenses/mit/)

  

  

## ❤️Loved this project?

Please give me a **star**⭐ to this repo, I'll be happy😊.

  

## 🔗 Let's connect!

  

  

  

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white&style=plastic)](https://www.linkedin.com/in/hanoak/)

  

  

  

[![twitter](https://img.shields.io/badge/twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white&style=plastic)](https://twitter.com/_hanoak)

  

  

  

[![twitter](https://img.shields.io/badge/YouTube-red?style=for-the-badge&logo=youtube&logoColor=white&style=plastic)](https://www.youtube.com/channel/UCgqAS2Phb6DNyGD-8n7Jg-Q/?sub_confirmation=1)

  

  

  

[![medium](https://img.shields.io/badge/Medium-000?style=for-the-badge&logo=medium&logoColor=white&style=plastic)](https://medium.com/@hanoak)