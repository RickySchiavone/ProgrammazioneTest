# FastFood Full Base

Base full-stack per il progetto **FastFood** di Programmazione Web e Mobile A.A. 2025/2026. L'obiettivo è fornire una struttura già pronta per coprire i requisiti della versione Full: profili utente, ristoranti, menu, ordini, consegne, statistiche e API REST documentate.

## Scelte progettuali

- **Backend Node.js + Express**: consente di organizzare le API REST in controller, route, modelli e servizi separati.
- **MongoDB + Mongoose**: rispetta il requisito di persistenza documentale e rende naturale memorizzare menu, carrelli e storico stati ordine.
- **JWT per autenticazione**: separa clienti e ristoratori con middleware di ruolo.
- **Frontend HTML5/CSS3/JavaScript**: `index.html` contiene la struttura, `public/css/styles.css` la presentazione e `public/js/app.js` il comportamento/API client.
- **Swagger**: `docs/swagger.yaml` documenta gli endpoint REST esposti su `/api-docs`.
- **Setup dati iniziali**: `npm run seed` importa i piatti comuni da `data/meal.json`, simulando il JSON allegato dalla traccia.
- **Consegna a domicilio**: il servizio `deliveryService` usa OpenStreetMap Nominatim per geocodificare l'indirizzo e calcola costo in base ai km; per semplicità usa distanza Haversine, sostituibile con OSRM per percorrenza stradale reale.

## Funzionalità coperte

### Profilo utente

- Registrazione cliente o ristoratore.
- Visualizzazione degli utenti registrati filtrabili per ruolo.
- Login con token JWT.
- Visualizzazione, modifica e cancellazione logica del profilo.
- Preferenze cliente e metodo di pagamento.

### Ristorante e menu

- Creazione/modifica/cancellazione del ristorante del ristoratore.
- Dati principali: nome, telefono, partita IVA, indirizzo, città e coordinate.
- Menu composto da piatti comuni o personalizzati.
- Ricerca ristoranti per nome, luogo e piatto.

### Piatti

- Import iniziale da `data/meal.json`.
- Ricerca per nome, tipologia, prezzo massimo, ingrediente e allergene escluso.
- Creazione/modifica/cancellazione piatti personalizzati da parte del ristoratore.

### Ordini e consegne

- Cliente autenticato può ordinare uno o più piatti dal menu di un ristorante.
- Stati supportati: `ordinato`, `in_preparazione`, `in_consegna`, `consegnato`.
- Ritiro al ristorante con stima attesa basata sugli ordini in coda.
- Consegna a domicilio con costo proporzionale alla distanza.
- Conferma consegna da parte del cliente.
- Storico acquisti presenti e passati.
- Statistiche per ristorante.

## Avvio locale

```bash
npm install
cp .env.example .env
npm run seed
npm run dev
```

- Frontend: <http://localhost:3000>
- API health: <http://localhost:3000/api/health>
- Swagger UI: <http://localhost:3000/api-docs>

## Struttura

```text
src/
  config/          configurazione ambiente e MongoDB
  controllers/     logica applicativa REST
  middleware/      autenticazione, ruoli, gestione async
  models/          schemi Mongoose
  routes/          endpoint Express
  seed/            import dei piatti comuni
  services/        calcolo consegne/OpenStreetMap
public/
  css/             stile CSS3 separato
  js/              JavaScript frontend

data/meal.json     dataset iniziale piatti
docs/swagger.yaml  documentazione OpenAPI
```

## Prossimi miglioramenti suggeriti

- Aggiungere test di integrazione con `mongodb-memory-server`.
- Sostituire Haversine con OSRM o GraphHopper per distanza stradale reale.
- Inserire ruoli amministrativi se richiesti dal docente.
- Aggiungere validazione più severa degli input con Joi o Zod.
- Aggiungere immagini reali in `public/images/`.
