import 'dotenv/config';
import express from "express";
const app = express();
const PORT = process.env.PORT || 4000;
import mongoose from "mongoose";



import methodOverride from "method-override";


import articleRouter from "./routes/articles.js";
import Article from "./Markdown-Blog/article-mongoose.js";

app.set("view engine", "ejs");

// Prefer environment variable, fall back to local MongoDB for development
const CONNECTION_URL = process.env.DATABASE_URL;

// If you require an env var in production, use a check like this:
if (!CONNECTION_URL) {
    console.error("FATAL ERROR: DATABASE_URL environment variable is missing!");
    // It's often best to halt the app if a critical resource like the DB is missing
    process.exit(1); 
}

mongoose.connect(CONNECTION_URL)
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.error('Connection Error:', err));

// mongoose.connect("mongodb://localhost/my_Blog")
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));


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

app.listen(PORT, () => { // Note the uppercase P
  console.log(`Server running on port ${PORT}`);
});