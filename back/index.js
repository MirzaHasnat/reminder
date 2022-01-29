let app = require("express")();
let mongo = require("mongodb").MongoClient;
let mailer = require("nodemailer");

// mailer config
const transporter = mailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'dolores.hansen12@ethereal.email',
        pass: 'QUQVUjexJvdumnp39D'
    }
});

app.use(require("body-parser").json());
// defining header for cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
});

if(mongo){

mongo.connect("mongodb://localhost:27017/", (err, db) => {
    if (err) throw err;

    let reminder = db.db("reminder");

    app.get("/", (req, res) => {
        res.send("API is Working Fine");
    });

    app.get("/remind",(req,res)=>{
        reminder.collection("remind").find().toArray((err,result)=>{
            if(err) throw err;
            res.send(result);
        });
    })

    app.post("/remind",(req,res)=>{
        let data = req.body;
        data.issent = false;
        reminder.collection("remind").insertOne(data,(err,result)=>{
            if(err) throw err;
            res.send(result);
        });

    })

    app.get("/remind/remind",(req,res)=>{
        let scheduling = require("node-schedule");
        let moment = require("moment");
        // use nodemailer to send email to everyone

        reminder.collection("remind").find({issent:false}).toArray((err,result)=>{
            if(err) throw err;
            // send email from result emails
            result.forEach(element => {
                let tempId = element._id;

                let mailOptions = {
                    from: 'dolores.hansen12@ethereal.email',
                    to: element.email,
                    subject: 'Reminder',
                    text: 'You have to do this task on '+element.date
                };
                // compare today date with format YYYY-MM-DD
                if(!moment().format("YYYY-MM-DD") == element.date){
                    // schedule the email
                    console.log("Scheduling email");
                    scheduling.scheduleJob(element.date,()=>{
                        // send email
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) throw error;
                            console.log('Email sent: ' + info.response);
                        });
                    });
                }else {
                    // if the date is in the past, remove the task
                    console.log("Sending email");
                    // send email now
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) throw error;
                        console.log('Email sent: ' + info.response);
                    });
                    
                }
                reminder.collection("remind").updateOne({_id:tempId},{$set:{issent:true}});
                
            });
            if(result.length == 0){
                res.send("All Emails are Already Scheduled.");
            }else{
                res.send("Sent");
            }
        });
    });

});

}else{

    app.all("*", (req, res) => {
        res.send("API is not working");
    });

}


app.listen(5000, (p) => {
    console.log("Started")
});
