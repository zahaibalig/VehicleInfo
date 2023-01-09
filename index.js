const express = require("express");
const axios = require("axios");

const app = express();



// urlencodedl =  https://autosys-kjoretoy-api.atlas.vegvesen.no/api-ui/index-enkeltoppslag.html?appid=fea6488c-bf34-4326-8b83-d1cb5e25d810

const fetchresults = async (number) => {
  try {
    const res = await axios.get(
      `https://www.vegvesen.no/ws/no/vegvesen/kjoretoy/felles/datautlevering/enkeltoppslag/kjoretoydata?kjennemerke=${number}`,
      {
        headers: {
          "SVV-Authorization": "Apikey fea6488c-bf34-4326-8b83-d1cb5e25d810",
        },
      }
    );
    return res.data;
  } catch (err) {
    console.log("error retriving the data");
  }
};

app.get("/", async (req, res) => {
  const regNumber = req.query.number;
  let data = await fetchresults(regNumber);

  let {
    kjoretoyId,
    registrering: {
      kjoringensArt: { kodeBeskrivelse },
    },
    godkjenning:{tekniskGodkjenning:{tekniskeData:{generelt:{merke}}}},
    godkjenning:{tekniskGodkjenning:{tekniskeData:{generelt:{handelsbetegnelse}}}},
    periodiskKjoretoyKontroll:{kontrollfrist,sistGodkjent}
  } = data.kjoretoydataListe[0];
 
  const filteredData = {
    kjoretoyId,
    kodeBeskrivelse,
    merke,
    handelsbetegnelse,
    kontrollfrist,
    sistGodkjent
  };
  res.send(JSON.stringify(filteredData));
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
