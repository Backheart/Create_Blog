import express from "express";
const router = express.Router();

import Article from "../Markdown-Blog/article-mongoose.js";

router.get("/new", (req, res) => {
  res.render("articles/new.ejs", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit.ejs", { article: article });
});

router.get("/:slug",  async (req, res) => {
  const article = await Article.findOne({slug: req.params.slug});
  if (article == null) res.redirect("/");
  res.render("articles/show.ejs", { article: article });
});

router.post("/", async(req, res, next) => {
req.article = new Article();
next();
},  wrapPostAndPut("new.ejs" ));

router.put("/:id", async(req, res, next) => {
  req.article = await Article.findById(req.params.id);
  next();
},  wrapPostAndPut("edit.ejs" ));

router.delete("/:id", async (req, res) =>{
await Article.findByIdAndDelete(req.params.id);
res.redirect("/")
})

function wrapPostAndPut(path) {
  return async (req, res, next) => {
    let article = req.article;
    article.author = req.body.author;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      article = await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      console.log(e);
      res.render(path, { article: article });
    }
  };
}
export default router;
