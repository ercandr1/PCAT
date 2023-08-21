const express = require('express'); // Express.js, web uygulamaları ve API'ler oluşturmak için kullanılan bir web çerçevesidir.
const mongoose = require('mongoose'); // Mongoose, MongoDB ile etkileşim kurmayı kolaylaştıran bir Object Data Modeling (ODM) kütüphanesidir.
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const ejs = require('ejs'); // EJS (Embedded JavaScript), HTML şablonlarında dinamik içerik oluşturmayı sağlayan bir şablondur.
const fs = require('fs');
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
app.use(fileUpload());
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

// Rotalar
app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated'); // Tüm fotoğrafları veritabanından çekiyoruz.
  res.render('index', {
    photos, // index.ejs dosyasını render (işlemek) ederken, veriyi gönderiyoruz.
  });
});

app.get('/photos/:id', async (req, res) => {
  // res.render('about'); // about.ejs dosyasını render (işlemek) eder.
  const photo = await Photo.findById(req.params.id); // Belirli bir ID'ye sahip fotoğraf verisi veritabanından çekilir.
  res.render('photo', {
    photo, // Çekilen fotoğraf verisi "photo.ejs" şablonuna iletilir.
  });
});

app.get('/about', (req, res) => {
  res.render('about'); // about.ejs dosyasını render (işlemek) eder.
});

app.get('/add', (req, res) => {
  res.render('add'); // add.ejs dosyasını render (işlemek) eder.
});

// Gelen POST isteği için "/photos" yolunda işlem yapacak bir yönlendirici tanımlanıyor.
app.post('/photos', async (req, res) => {
  // console.log(req.files.image);

  // await Photo.create(req.body); // Gönderilen fotoğraf verisini Photo modeli kullanarak veritabanına ekliyoruz.
  // res.redirect('/'); // Anasayfaya yönlendirme yapılır.

  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    //uplaod dosyası yoksa
    fs.mkdirSync(uploadDir); //olustur
  }

  // İsteğin içinden "image" adlı dosya yakalanıyor
  let uploadeImage = req.files.image;

  // Yüklenen resmin kaydedileceği yol oluşturuluyor.
  let uploadPath = __dirname + '/public/uploads/' + uploadeImage.name; //dirname=varolan klasorun kendısı

  // Yüklenen resim, belirtilen yola taşınıyor.
  uploadeImage.mv(uploadPath, async () => {
    // Veritabanında yeni bir "Photo" oluşturuluyor ve resim bilgileri atanıyor.
    await Photo.create({
      ...req.body, // İsteğin gövdesindeki veriler
      image: '/uploads/' + uploadeImage.name, // Yüklenen resmin yolu
    });
    res.redirect('/'); //anasayfaya redirect islemi,yönlenme
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;

  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });
  let deletedImage = __dirname + '/public' + photo.image;
  fs.unlinkSync(deletedImage);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

const port = 3000; // Sunucunun dinlemesi için kullanılacak port numarası.

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`); // Sunucu başladığında konsola mesaj yazdırılır.
});
