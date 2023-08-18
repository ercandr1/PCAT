const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const PhotoSchema = new Schema({ //PhotoSchema, bu modelin şema (schema) yapısını belirtir.
  title: String,
  description: String,
  image: String, 
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

//Bu satır, Mongoose modelini oluşturur. 'Photo', veritabanındaki koleksiyon adını temsil eder.
const Photo = mongoose.model('Photo', PhotoSchema); 

module.exports = Photo //Photo modelini diğer dosyalara dışa aktarmanın bir yolu
//exports ile belirttiğiniz öğeleri diğer dosyalarda kullanabilirsiniz.

