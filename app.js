const express = require('express'); // Express.js, web uygulamaları ve API'ler oluşturmak için kullanılan bir web çerçevesidir.
const mongoose = require('mongoose'); // Mongoose, MongoDB ile etkileşim kurmayı kolaylaştıran bir Object Data Modeling (ODM) kütüphanesidir.
const fileUpload = require('express-fileupload');
const ejs = require('ejs'); // EJS (Embedded JavaScript), HTML şablonlarında dinamik içerik oluşturmayı sağlayan bir şablondur.
const path = require('path'); // Path modülü, dosya yollarını düzenlemek, birleştirmek ve ayrıştırmak için kullanışlı fonksiyonlar içerir.
const Photo = require('./models/Photo'); // "models" klasöründeki "Photo" modelini içe aktarıyoruz. Bu model, MongoDB veritabanındaki "Photo" koleksiyonunu temsil eder.



const app = express(); // Express uygulamasını oluşturuyoruz. Bu "app" nesnesi, sunucu işlevselliğini barındırır ve yönetir.

// Veritabanına bağlanma işlemi
mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Template Engine ayarı
app.set('view engine', 'ejs'); // Template engine olarak EJS kullanacağımızı belirtiyoruz.

// Middleware'ler
app.use(express.static('public')); // İstemcilere statik dosyaları (örneğin CSS, resimler) sunmak için "public" dizinini kullanır.
app.use(express.urlencoded({ extended: true })); // URL kodlamalı verileri (form verileri gibi) işlemek için yardımcı olur.
app.use(express.json()); // JSON verilerini işlemek için kullanılır. Gelen isteklerdeki JSON verilerini işlenebilir bir forma çevirir.

// Rotalar
app.get('/', async (req, res) => {
  const photos = await Photo.find({}); // Tüm fotoğrafları veritabanından çekiyoruz.
  res.render('index', {
    photos, // index.ejs dosyasını render (işlemek) ederken, veriyi gönderiyoruz.
  });
});

app.get('/photos/:id', async (req, res) => {
  // res.render('about'); // about.ejs dosyasını render (işlemek) eder.
  const photo = await Photo.findById(req.params.id) // Belirli bir ID'ye sahip fotoğraf verisi veritabanından çekilir.
  res.render('photo', {
    photo // Çekilen fotoğraf verisi "photo.ejs" şablonuna iletilir.
  })

});

app.get('/about', (req, res) => {
  res.render('about'); // about.ejs dosyasını render (işlemek) eder.
});

app.get('/add', (req, res) => {
  res.render('add'); // add.ejs dosyasını render (işlemek) eder.
});

app.post('/photos', async (req, res) => {
  await Photo.create(req.body); // Gönderilen fotoğraf verisini Photo modeli kullanarak veritabanına ekliyoruz.
  res.redirect('/'); // Anasayfaya yönlendirme yapılır.
});

const port = 3000; // Sunucunun dinlemesi için kullanılacak port numarası.

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`); // Sunucu başladığında konsola mesaj yazdırılır.
});