import express from "express";
const app = express();
const port = 4000;
import mongoose from "mongoose";
import { marked } from "marked";
import methodOverride from "method-override";


import articleRouter from "./routes/articles.js";
import Article from "./Markdown-Blog/article-mongoose.js";

app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost/my_Blog")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(methodOverride("_method"));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false })); 

app.get("/", async(req, res) => {
  // const articles = [
  //   { author: "Author 1",
  //     title: "Article 1", 
  //     createdAt: new Date(),  
  //     description: "This is article 1" ,
  //     markdown: "Content of article 1",
  //   },
   
  // ];
  try {
    
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index.ejs", {articles: articles, title: "My Blog"});
  } catch (e) {
    console.log(e);
    res.status(500).send("Error fetching articles");
  }
});


app.use("/articles", articleRouter); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});