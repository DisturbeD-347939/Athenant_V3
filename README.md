# **Athenant**
Created by Ricardo Graça.

---
## **Description**
Athenant is a web app which allows you to **search for someone's details** by only typing their **Twitter handle**.
It retrieves only public information available on the target's Twitter. With this information the app constructs a profile out of the person and tries to get information such as where the person is from, when is their birthday, etc.

The most important bit of this search is the graphs that come along with it, there are graphs displaying the **times of the day** a user in online, the **times of the week he's online** and even the **location** of where the user sends the tweets from. There's also a cloudword with the **most common used words** on the targets profile.

**Images** can be found [here](https://imgur.com/a/9gwJLuN)

This project was created as an **artefact** to my **dissertation** at University. It's meant to show how much public information we have out in the Internet and how harmful it can be if used in the wrong hands.

This project is **finished**!

---
## **Technologies used**
Back-End:
  1. NodeJS
  2. Express
  3. Npm
  
Front-end:
  1. Javascript(JQuery)
  2. SCSS
  3. Pug/Jade

---
## **Installation**
To run the web app just make a **copy** of the repository within your computer and be sure to have [NodeJS installed](https://nodejs.org/en/download/) too!

After that **be sure** to run **`npm install`** inside the repository.
Once that's done just run **`npm app --ignore Users`**

---
## **Development Map**
This is the steps followed in order to complete this project:
1. Work with Twitter API to retrieve information.
2. Learn about Charts.js in order to create graphs with the data.
3. Learn about the Google Maps API.
4. Learn about the module wordcloud in NPM.
5. Organize the information to display.
6. Display all the information in the form of graphs/maps/wordclouds.
