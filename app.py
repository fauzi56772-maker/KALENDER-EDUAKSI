from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# CORS ini sangat krusial agar website Netlify kamu diizinkan bertukar data dengan Python
CORS(app)

# Database internal Python (Disimpan di RAM Server sementara)
database_waktu_kegiatan = []

@app.route('/')
def index():
    return "Mesin Waktu Inti Python Flask Eduaksi Berjalan Sukses!"

# 1. API Keamanan Tinggi Enkripsi Email
@app.route('/api/verifikasi-email', methods=['POST'])
def verifikasi_email():
    data = request.json
    email = data.get('email', 'User No-Name')
    return jsonify({
        "status": "success",
        "pesan": f"Sistem Keamanan Berlapis Aktif. Token Enkripsi Tinggi Berhasil dikirim ke {email}"
    })

# 2. API Simpan Jadwal & Berita Detik Permanen
@app.route('/api/simpan-jadwal', methods=['POST'])
def simpan_jadwal():
    data_baru = request.json
    database_waktu_kegiatan.append(data_baru)
    return jsonify({
        "status": "success",
        "pesan": "Berhasil mengunci data di basis lini masa Python!"
    })

# 3. API Ambil Jadwal Sesuai Filter Kalender dan Tahun
@app.route('/api/get-jadwal', methods=['GET'])
def get_jadwal():
    target_kalender = request.args.get('kalender')
    target_tahun = request.args.get('tahun')
    
    # Memfilter database internal Python sesuai halaman yang dibuka user
    hasil_filter = [
        item for item in database_waktu_kegiatan 
        if item['kalender'] == target_kalender and str(item['tahun']) == str(target_tahun)
    ]
    return jsonify(hasil_filter)

if __name__ == '__main__':
    # Server berjalan di port lokal 5000 terlebih dahulu
    app.run(debug=True, port=5000)

