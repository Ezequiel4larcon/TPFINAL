import admin from "firebase-admin";
import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
const PORT = 3001;


app.use(express.json());
app.use(cors());

/*admin.initializeApp({
  credential: admin.credential.cert('../credentials.json'),
  databaseURL: "https://tp-final-prog3-default-rtdb.firebaseio.com"
});


app.post('/register', async (req, res) => {
  const { email, password, nombre, apellido, dni, dob } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    await admin.firestore().collection('socios').doc(userRecord.uid).set({
      nombre: nombre,
      apellido: apellido,
      dni: dni,
      dob: dob,
    });

    await admin.firestore().collection('usuarios').doc(userRecord.uid).set({
        nombre: nombre,
        rol: 'user',
      });
  

    res.status(200).send({ message: 'Usuario registrado exitosamente', uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



*/


const client = new MercadoPagoConfig({ accessToken: 'APP_USR-2338624890658994-071705-2f00b42f331522f044da57b59d909a3c-1903582661' });

app.get("/", (req, res) => {
    res.send("Server corriendo")
});


app.post("/create_preference", async (req, res) => {
    try {
    const body = {
        items: [
        {
            title: req.body.description,
            unit_price: Number(req.body.amount),
            quantity: 1,
            current_id: "ARS",
        },
        ],
        back_urls: {
        success: "https://www.google.com.ar/?gws_rd=ssl", 
        failure: "https://www.google.com.ar/?gws_rd=ssl", 
        pending: "https://www.google.com.ar/?gws_rd=ssl", 
        },
        auto_return: "approved",
    };
        const preferencia = new Preference(client);
        const response = await preferencia.create({ body });
        res.json({ id: response.id });
    } catch (error) {
        console.error("Error al crear preferencia:", error);
        res.status(500).send("Error al crear preferencia");
    }
});

app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});
