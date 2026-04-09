const express = require("express");
const cors = require("cors");
const fetch = (...args) => import("node-fetch").then(({ default: f }) => f(...args));

const app = express();
const KEY = process.env.GOOGLE_KEY;

app.use(cors());

app.get("/geocode", async (req, res) => {
  const { address } = req.query;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${KEY}`;
  const r = await fetch(url);
  res.json(await r.json());
});

app.get("/nearbysearch", async (req, res) => {
  const { lat, lng, radius, keyword } = req.query;
  const params = new URLSearchParams({ location: `${lat},${lng}`, radius: radius || "50000", type: "golf_course", keyword: keyword || "golf course", key: KEY });
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`;
  const r = await fetch(url);
  res.json(await r.json());
});

app.get("/placedetails", async (req, res) => {
  const { place_id } = req.query;
  const fields = "name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,opening_hours,photos,price_level,geometry";
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&fields=${fields}&key=${KEY}`;
  const r = await fetch(url);
  res.json(await r.json());
});

app.get("/photo", async (req, res) => {
  const { ref, maxwidth } = req.query;
  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth || 400}&photo_reference=${ref}&key=${KEY}`;
  const r = await fetch(url);
  res.setHeader("Content-Type", r.headers.get("content-type") || "image/jpeg");
  r.body.pipe(res);
});

app.listen(process.env.PORT || 3001, () => console.log("Proxy running"));
