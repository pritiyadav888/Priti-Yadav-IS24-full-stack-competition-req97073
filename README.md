# ImbApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.4.

NOTE- Make sure to have Angular CLI installed (`npm insatll -g @angular/cli`)

This project has seperate frontend and backend(`server` in this case)

## Backend server
1. Please clone the git repo. 
2. In a new terminal navigate to `server` directroy
3. Run `npm install`
4. Run this command to run the frontend --  `node index.js`
5. Navigate to `http://localhost:3000/api/health`. 
6. Navigate to `http://localhost:3000/api/api-docs/` to get swagger

## Run Frontend
1. Navigate to frontend/imb_app
2. Run `npm install`
3. Run this command to run the frontend --  `ng serve`
4. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## CRUD(APIs)

Here's the list of CRUD api's. Here's the Postman Collection (`IMB.postman_collection.json`) This collection is in the root directory. Please modify the id values as random data is getting generated every time we start the app. 

1. GET (get health status) : `http://localhost:3000/api/health`
2. GET (get products list): `http://localhost:3000/api/products`
3. POST (Add new product): `http://localhost:3000/api/products`
4. PUT (Update existing product by id): `http://localhost:3000/api/products/:id`
5. DELETE (Delete existing product by id): `http://localhost:3000/api/products/:id`
6. GET (get product by id) : `http://localhost:3000/api/products/:id`

## Landing Page
`product-list.component.html ` IS THE DEFAULT LANDING PAGE
## IMPORTANT
New data gets generated every time the app gets started