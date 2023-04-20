/** @format */

//extracting the worker modal
const Worker = require("../models/worker");
const Complain = require("../models/complain");
const User = require("../models/user");

//for creating-checking jwt token
const jwt = require("jsonwebtoken");

//add worker
const addWorker = async (req, res) => {
  console.log("\nadd worker/profession api hit");

  //verifying login token
  let login_token;

  //access login token
  try {
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) throw Error("\nSession expired");
  } catch (error) {
    console.log(error.message);
    const response = { error: "Please login to add profession" };
    res.status(400).json(response);
    return;
  }

  //decoding login token
  let decoded_login_token;
  try {
    console.log("\ndecoding login token");
    decoded_login_token = jwt.verify(login_token, process.env.JWT_SECRET);

    console.log("\ndecoded", decoded_login_token);
  } catch (err) {
    console.log("\ncan't able to decode login token");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  //finding user-details
  let existingUser;
  try {
    console.log("\nfinding user details");
    existingUser = await User.findOne({
      username: decoded_login_token.userName,
    });

    //if user with this username doesn't exists
    if (!existingUser) {
      console.log("\nuser with this userName don't exist");
      res
        .status(400)
        .json({ error: "Looks like there is some issue. Please login again" });
      return;
    }
  } catch (err) {
    console.log("\nfailed to fetch user");
    console.log("\n", err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  const profession = req.body.profession;
  const creationTime = req.body.creationTime;
  const userName = req.body.username;

  //check whether username matches;
  console.log("\nchecking authentication");
  if (userName !== decoded_login_token.userName) {
    console.log(
      "\nrequest username doesn't matches with access token username"
    );
    res
      .status(400)
      .json({ error: "You can't add profession for this username" });
    return;
  }

  console.log("\nprofession :", profession);

  //added worker in workerList
  try {
    console.log("\ncreating new worker object");
    const newWorker = new Worker({
      workerUsername: existingUser.username,
      workerFirstName: existingUser.firstName,
      workerLastName: existingUser.lastName,
      workerEmail: existingUser.email,
      workerPhonenum: existingUser.phonenum,
      workerAge: existingUser.age,
      profession,
      workerAddress: existingUser.address,
      location: {
        lat: existingUser.location.lat,
        lng: existingUser.location.lng,
      },
      creationTime,
      rating: 0,
      TCR: 0,
      score: 0,
    });

    //checking if a worker with same username and profession exists
    try {
      console.log(
        "\nchecking for existing worker with same username and profession"
      );

      const existingWorker = await Worker.findOne({
        workerUsername: existingUser.username,
        profession,
      });

      if (existingWorker) {
        console.log("\nworker already exists", existingWorker);
        res.status(400).json({
          error:
            "You already have a worker profile with this profession. Please refresh the page.",
        });
        return;
      }
    } catch (err) {
      console.log("\ncan't fetch worker from database");
      console.log("\n", err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    //adding worker
    await newWorker.save();

    //add profession in userList
    try {
      console.log("\nadding profession in user list");

      const userProfession = await User.updateOne(
        {
          username: existingUser.username,
        },
        {
          $push: {
            professions: {
              workerId: newWorker._id,
              workerProfession: profession,
            },
          },
        }
      );

      console.log("\nadded profession in user profile", userProfession);
    } catch (err) {
      console.log("\nfailed to update user list");
      console.log(err.message);
      res.status(500).json({ error: err.message });
      return;
    }

    //sending response
    console.log("\nworker added in database");
    console.log(newWorker);
    res.status(200).json({ data: newWorker });
    return;
  } catch (err) {
    console.log("\nfailed to add worker");
    console.log("\n", err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

//find worker details
const getWorkerDetails = async (req, res, next) => {
  console.log("\nget worker details api hit");

  const userName = req.params.uid;
  const profession = req.params.profession;
  console.log("\nuser id", userName);
  console.log("\nprofession", profession);

  let login_token;
  let isVerifiedUser = false;

  //fetching worker details from database
  let workerDetails;
  try {
    console.log("\nfetching worker from database");
    workerDetails = await Worker.findOne({
      workerUsername: userName,
      profession,
    });

    console.log("\nfetched worker from database");
    console.log(workerDetails);

    //if worker doesn't exists
    if (!workerDetails) {
      console.log("\nno worker exists with this username and profession");
      res.status(400).json({
        error: "worker doesn't exists with this username and profession",
      });
      return;
    }
  } catch (err) {
    console.log("\ncan't fetch worker from database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }

  let decoded_login_token;
  //verifying login token
  try {
    //accessing login token
    console.log("\nstoring access token");
    login_token = req.cookies[process.env.LOGIN_COOKIE_NAME];

    if (!login_token) {
      throw Error("\nsession expired");
    }

    //decoding login token
    try {
      console.log("\ndecoding login token");
      decoded_login_token = jwt.verify(login_token, process.env.JWT_SECRET);
      console.log("\ndecoded", decoded_login_token);
      if (decoded_login_token.userName === userName) {
        isVerifiedUser = true;
      }
    } catch (err) {
      console.log("\ncan't able to decode login token");
      console.log(err.message);
    }
  } catch (error) {
    console.log(error.message);
  }
  console.log("\nisUserVerified", isVerifiedUser);

  //sending response
  res.status(200).json({ data: { worker: workerDetails, isVerifiedUser } });
  return;
};
//filter worker
const filterWorker = async (req, res) => {
  console.log("\nfilter worker api hit");

  console.log(req.params);
  const profession = req.params.profession;
  console.log(profession);

  let filteredworkers;
  //different filter route
  try {
    filteredworkers = await Worker.find({
      profession: profession,
    });
    console.log("\ngot workers from database");
    console.log("\nfiltered workers sent");
    res.status(200).json({ data: filteredworkers });
  } catch (err) {
    console.log("\ncan't fetch filtered workers from database");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

//delete worker
const deleteWorker = async (req, res) => {
  console.log("\ndelete worker api hit");

  const userName = req.params.workerUsername;
  const profession = req.params.profession;

  console.log(userName, profession);
  let result1, result2;
  //different filter route
  try {
    result1 = await Worker.deleteOne({
      workerUsername: userName,
      profession: profession,
    });
    result2 = await User.findOneAndUpdate(
      {
        username: userName,
      },
      {
        $pull: {
          professions: {
            workerProfession: profession,
          },
        },
      }
    );
    if (result1.deletedCount == 0) {
      res
        .status(400)
        .json({ error: "no worker exist with this username and profession" });
      return;
    }
    console.log("\ndelete succesfull");
    console.log(result1, result2);
    res.status(200).json({ data: [result1, result2] });
    return;
  } catch (err) {
    console.log("delete Unsuccesful");
    console.log(err.message);
    res.status(500).json({ error: err.message });
    return;
  }
};

exports.addWorker = addWorker;
exports.getWorkerDetails = getWorkerDetails;
exports.filterWorker = filterWorker;
exports.deleteWorker = deleteWorker;
