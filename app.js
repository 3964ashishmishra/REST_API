const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");


const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));

// Database creation

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articlesSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article",articlesSchema);

app.get("/",function(req,res){
    res.send("<h1> Hello API </h1>")
})

app.route("/articles")

    .get(function(re,res){
    
        Article.find({},function(err,foundArticles){
            res.send(foundArticles);
        })
    })

    .post(function(req,res){
        const newArticle = new Article({
            title:req.body.title,
            content:req.body.content
        });
    
        newArticle.save(function(err){
            if(!err){
                res.send("Sucessfully added to Database");
            }else{
                res.send(err);
            }
        })
    })

    .delete(function(req,res){
        Article.deleteMany({},function(err){
            if(!err){
                res.send("Deleted all articles");
            }else{
                res.send(err);
            }
        })
    })

app.route("/articles/:articleTitle")

    .get(function(req,res){

        Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
            res.send(foundArticle);
        })

    })

    .put(function(req,res){
        Article.updateOne(
            {title:req.params.articleTitle},
            {title:req.body.title,content:req.body.content},
            function(err,docs){
                if(!err){
                    res.send("Successfully Updated");
                }
            }
        )
    })

    .delete(function(req,res){

        Article.deleteOne({title:req.params.articleTitle},function(err){
            if(!err){
                res.send("Deleted all documents from "+req.params.articleTitle);
            }
        })
    })



app.listen(3000,function(req,res){
    console.log("Listenning to port 3000");
})