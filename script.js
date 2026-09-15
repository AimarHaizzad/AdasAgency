document.getElementById('year').textContent = new Date().getFullYear();

const WHATSAPP_NUMBER = '60189692946';

const form = document.getElementById('quotation-form');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const nama = form.nama.value.trim();
  const ic = form.ic.value.trim();
  const plate = form.plate.value.trim();
  const model = form.model.value.trim();
  const tahun = form.tahun.value.trim();
  const alamat = form.alamat.value.trim();

  const message =
    'Sila lengkapkan maklumat di bawah untuk dapatkan Quotation Percuma\n\n' +
    'Nama : ' + nama + '\n' +
    'No. IC : ' + ic + '\n' +
    'No Plate : ' + plate + '\n' +
    'Model : ' + model + '\n' +
    'Tahun: ' + tahun + '\n' +
    'Alamat penuh serta poskod: ' + alamat;

  const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank', 'noopener');
});
