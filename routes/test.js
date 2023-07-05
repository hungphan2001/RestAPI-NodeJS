var express = require("express");
var router = express.Router();
var database = require("../config/database");
router.get("/", function (req, res, next) {
  var query = "SELECT * FROM sample_data ORDER BY id DESC";
  database.query(query, (error, data) => {
    if (error) {
      throw error;
    } else {
      // res.render("sample_data", {
      //   title: "Node.js MySQL CRUD Application",
      //   action: "list",
      //   sampleData: data,
      // });
      res.status(200).json({
        status: "success",
        length: data?.length,
        data: data,
      });
    }
  });
});

router.get("/add", function (req, res, next) {
  res.render("sample_data", { title: "Insert Data into MySQL", action: "add" });
});

router.post("/add_sample_data", (req, res, next) => {
  var { first_name, last_name, age, gender } = req.body;
  var query = `INSERT INTO sample_data(first_name,last_name,age,gender) VALUES("${first_name}","${last_name}","${age}","${gender}")`;

  database.query(query, (error, data) => {
    if (error) {
      throw error;
    } else {
      res.redirect("/sample_data");
    }
  });
});

router.get("/edit/:id", (req, res, next) => {
  var { id } = req.params;
  var query = `SELECT * FROM sample_data WHERE id ="${id}"`;
  database.query(query, (error, data) => {
    res.render("sample_data", {
      title: "edit mysql",
      action: "edit",
      sampleData: data[0],
    });
  });
});

router.post('/edit/:id', function(request, response, next){

	var id = request.params.id;

	var {first_name, last_name, age, gender } = request.body;

	var query = `
	UPDATE sample_data 
	SET first_name = "${first_name}", 
	last_name = "${last_name}", 
	age = "${age}", 
	gender = "${gender}" 
	WHERE id = "${id}"
	`;

	database.query(query, function(error, data){

		if(error)
		{
			throw error;
		}
		else
		{
			request.flash('success', 'Sample Data edited');
			response.redirect('/sample_data');
		}

	});

});

router.get("/delete/:id", function (request, response, next) {
  var id = request.params.id;

  var query = `
	DELETE FROM sample_data WHERE id = "${id}"
	`;

  database.query(query, function (error, data) {
    if (error) {
      throw error;
    } else {
	  request.flash('alert', 'Sample Data Deleted');
      response.redirect("/sample_data");
    }
  });
});
module.exports = router;
