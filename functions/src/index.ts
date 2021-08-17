import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: 'https://firestore-goty.firebaseio.com'
});

const db = admin.firestore();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  //   functions.logger.info("Hello logs!", {structuredData: true});
  response.json({
    ok: true,
    msg: "Hola mundo Desde Funciones",
  });
});

export const getGOTY = functions.https.onRequest(async (request, response) => {
  //   functions.logger.info("Hello logs!", {structuredData: true});
  // const nombre = request.query.nombre || 'Sin Nombre';


});

// express
const app = express();
app.use(cors({origin: true}));

app.get("/goty", async (req, res) => {
  const gotyRef = db.collection("goty");
  const docSnap = await gotyRef.get();
  const juegos = docSnap.docs.map((doc) => doc.data());

  res.json(juegos);
});


app.post("/goty/:id", async (req, res) => {
  const id = req.params.id;
  const gameRef = db.collection("goty").doc(id);
  const gameSnap = await gameRef.get();

  if (!gameSnap.exists) {
    res.status(404).json({
      ok: false,
      msg: "No Existe Un Juego Con El Id " + id,
    });
  } else {
    const antes = gameSnap.data() || {votos: 0};
    await gameRef.update({
      votos: antes.votos + 1,
    });

    res.status(200).json({
      ok: true,
      msg: `Gracias por tu voto a ${antes.name}`,
    });
  }
});


export const api = functions.https.onRequest(app);
