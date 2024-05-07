// import model
const State = require("../model/States");
const StatesFunF = require("../model/StatesFunF");
const statesData = require("../model/states.json");

const fs = require("fs");
const path = require("path");

// ------------------------------------------------GetAllStates local + Mongo DB

const data = {
  states: require("../model/states.json"),
  setState(data) {
    this.states = data;
  }
};

// const GetAllStates = (req, res) => {
//   //
//   res.json(data.states);
// };

const GetAllStates = async (req, res) => {
  try {
    // json file
    const statesData = data.states;

    // fetching fun facts from mongo db
    const promises = statesData.map(async (state) => {
      //
      // find the state in mongo db based on its state code
      const stateDataFromDB = await State.findOne({ stateCode: state.code });

      // If state code merge the fun facts from mongo db
      if (stateDataFromDB) {
        //
        state.funfacts = [...state.funfacts, ...stateDataFromDB.funfacts];
      }

      return state;
    });

    // await for all promises to resolve
    const statesWithData = await Promise.all(promises);

    // send response updated states data
    res.json(statesWithData);
  } catch (error) {
    //
    console.error("Error fetching states data:", error);
    //  error response
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -------------------------------------------------- GetState

const GetState = (req, res) => {
  // gets param from url
  const stateCode = req.params.state.toUpperCase();

  // find the state info by matching the state code

  const stateInfo = statesData.find((state) => state.code === stateCode);

  if (stateInfo) {
    // state response
    res.json(stateInfo);
    //
  } else {
    // If state not found, send a 404 status code
    res.status(404).json({ message: "404 - State not found" });
  }

  // res.json(stateInfo);
};

// ------------------------------------------------------------------------- GetStateCapital

const GetStateCapital = (req, res) => {
  // gets param from url
  const stateCode = req.params.state.toUpperCase();

  // Find the state info by matching the state code
  const stateCapital = statesData.find((state) => state.code === stateCode);

  if (stateCapital) {
    //
    const capitalCity = stateCapital.capital_city;
    //
    res.json({ state: stateCapital.state, capital: capitalCity });
  } else {
    // error 404 message
    res.status(404).json({ message: "404 - State not found" });
  }
};

// ------------------------------------------------------------------------- GetStateNickname

const GetStateNickname = (req, res) => {
  // gets param from url
  const stateCode = req.params.state.toUpperCase();

  // Find the state info by matching the state code
  const stateNick = statesData.find((state) => state.code === stateCode);

  if (stateNick) {
    //
    res.json({ state: stateNick.state, nickname: stateNick.nickname });
  } else {
    // error 404 message
    res.status(404).json({ message: "404 - State not found" });
  }
};

// ------------------------------------------------------------------------- GetStatePopulation

const GetStatePopulation = (req, res) => {
  // gets param from url
  const stateCode = req.params.state.toUpperCase();

  // find the state info by matching the state code
  const statePop = statesData.find((state) => state.code === stateCode);

  if (statePop) {
    //
    res.json({ state: statePop.state, population: statePop.population });
  } else {
    // error 404 message
    res.status(404).json({ message: "404 - State not found" });
  }
};

// ------------------------------------------------------------------------- GetStateAdmission

const GetStateAdmission = (req, res) => {
  // gets param from url
  const stateCode = req.params.state.toUpperCase();

  // find the state info by matching the state code
  const stateAdmi = statesData.find((state) => state.code === stateCode);

  if (stateAdmi) {
    //
    res.json({ state: stateAdmi.state, admitted: stateAdmi.admission_date });
  } else {
    // error 404 message
    res.status(404).json({ message: "404 - State not found" });
  }
};

// --------------------------------------------------------------------------------------GetStateFunFacts

const GetStateFunFacts = (req, res) => {
  // gets param from url
  const stateCode = req.params.state.toUpperCase();

  // find the state info by matching the state code
  const stateFunF = statesData.find((state) => state.code === stateCode);

  if (stateFunF) {
    //
    res.json({ state: stateFunF.state, funfacts: stateFunF.funfacts });
  } else {
    // error 404 message
    res.status(404).json({ message: "404 - State not found" });
  }
};

// --------------------------------------------------------------------------------------GetRandomFunFact

const GetRandomFunFact = async (req, res) => {
  // gets param from URL
  const stateCode = req.params.state.toUpperCase();

  try {
    // find the state info by matching the state code
    const stateFunF = await State.findOne({ stateCode });

    if (stateFunF) {
      //
      // Check if the funfacts array exists and has elements
      if (stateFunF.funfacts && stateFunF.funfacts.length > 0) {
        //
        // Generate a random index
        const randomIndex = Math.floor(
          Math.random() * stateFunF.funfacts.length
        );
        // Retrieve the random fun fact
        const randomFunFact = stateFunF.funfacts[randomIndex];
        //
        res.json({ state: stateFunF.stateCode, funfact: randomFunFact });
      } else {
        res
          .status(404)
          .json({ message: "No fun facts available for this state" });
      }
    } else {
      res.status(404).json({ message: "State does not have funfacts" });
    }
  } catch (error) {
    //
    console.error("Error fetching state fun facts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// -------------------------------------------------------------CreateNewStateFact (Mongo db)

const CreateNewStateFact = async (req, res) => {
  if (!req.body.stateCode || !req.body.funfacts) {
    return res
      .status(400)
      .json({ message: "State code and fun facts are required" });
  }
  try {
    // stateCode already exists ?
    let existingState = await State.findOne({ stateCode: req.body.stateCode });

    if (existingState) {
      //
      // push new funfact to pre existing array
      existingState.funfacts.push(...req.body.funfacts);
      //
      existingState = await existingState.save();
      //
      return res.status(200).json(existingState);
    } else {
      //
      //  if stateCode doesn't exist create a new document
      const newState = await State.create({
        //
        stateCode: req.body.stateCode,
        funfacts: req.body.funfacts
      });
      return res.status(201).json(newState);
    }
  } catch (err) {
    //
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// -------------------------------------------------------------DeleteStateFunFact (Mongo db)

const DeleteStateFunFact = (req, res) => {
  const { stateCode, index } = req.body;

  State.findOne({ stateCode: stateCode })
    .then((state) => {
      if (!state) {
        //
        console.log("State not found:", stateCode);
        return res.status(404).json({ error: "State not found" });
      }

      // check for index in funfacts array
      if (index < 0 || index >= state.funfacts.length) {
        //
        console.log("Invalid index:", index);
        return res.status(400).json({ error: "Invalid index" });
      }

      // remove item at  index
      state.funfacts.splice(index, 1);

      // updated doc
      return state.save();
    })
    .then((updatedState) => {
      //
      console.log("Fun fact deleted successfully:", updatedState);
      res.status(200).json({
        message: "Fun fact deleted successfully",
        state: updatedState
      });
    })
    .catch((err) => {
      //
      console.error(err);
      res.status(500).json({ error: "Error while deleting the fun fact" });
    });
};

// ------------------------------------------------------------- UpdateStateFunFact

const UpdateStateFunFact = (req, res) => {
  // get data from URL
  const { state } = req.params;
  // get data from request body
  const { index, funfact } = req.body;

  // find matching state
  State.findOne({ stateCode: state })
    //
    .then((state) => {
      if (!state) {
        console.log("State not found:", state);
        return res.status(404).json({ error: "State not found" });
      }

      if (!index) {
        console.log("Index not provided");
        return res.status(400).json({ error: "Index not provided" });
      }

      // check if the index - subtract 1 to adjust for zero-based index
      const adjustedIndex = index - 1;

      // if the adjusted index is within the bounds of the funfacts array
      if (adjustedIndex >= state.funfacts.length) {
        console.log("Invalid index:", adjustedIndex);
        return res.status(400).json({ error: "Invalid index" });
      }

      // update item in funfacts array
      state.funfacts[adjustedIndex] = funfact;

      // updated doc
      return state.save();
    })
    .then((updatedState) => {
      console.log("Fun fact updated successfully:", updatedState);
      //
      res.status(200).json({
        message: "Fun fact updated successfully",
        state: updatedState
      });
    })
    .catch((err) => {
      console.error(err);
      //
      res
        .status(500)
        .json({ error: "An error occurred while updating the fun fact" });
    });
};

// ------------------------------------------------------------- GetContiguousStates

const GetContiguousStates = async (req, res) => {
  try {
    // get json data
    const statesFilePath = path.join(__dirname, "../model/states.json");
    const rawData = await fs.promises.readFile(statesFilePath, "utf-8");

    const data = JSON.parse(rawData);
    //
    // filter contigous states
    const contiguousStates = data.filter(
      (state) => state.state !== "Alaska" && state.state !== "Hawaii"
    );

    res.status(200).json(contiguousStates);
  } catch (err) {
    //
    console.error("Error retrieving states:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// -------------------------------------------- GetNonContiguousStates

const GetNonContiguousStates = async (req, res) => {
  try {
    // get json data
    const statesFilePath = path.join(__dirname, "../model/states.json");
    const rawData = await fs.promises.readFile(statesFilePath, "utf-8");

    const data = JSON.parse(rawData);

    // filter non-contigous statess
    const contiguousStates = data.filter(
      (state) => state.state === "Alaska" || state.state === "Hawaii"
    );

    res.status(200).json(contiguousStates);
  } catch (err) {
    //
    console.error("Error retrieving states:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  GetAllStates,
  CreateNewStateFact,
  GetState,
  GetStateCapital,
  GetStateNickname,
  GetStatePopulation,
  GetStateAdmission,
  DeleteStateFunFact,
  GetContiguousStates,
  GetNonContiguousStates,
  GetStateFunFacts,
  GetRandomFunFact,
  UpdateStateFunFact
};
