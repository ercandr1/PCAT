const photo = require('../models/Photo');

exports.getAllPhotos = async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated'); // Tüm fotoğrafları veritabanından çekiyoruz.
  res.render('index', {
    photos, // index.ejs dosyasını render (işlemek) ederken, veriyi gönderiyoruz.
  });
};


exports.getPhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id); // Belirli bir ID'ye sahip fotoğraf verisi veritabanından çekilir.
    res.render('photo', {
      photo, // Çekilen fotoğraf verisi "photo.ejs" şablonuna iletilir.
    });
  };

  exports.createPhoto = async (req, res) => {

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
  };


  exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
  
    photo.save();
  
    res.redirect(`/photos/${req.params.id}`);
  };

  exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    let deletedImage = __dirname + '/public' + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect('/');
  };