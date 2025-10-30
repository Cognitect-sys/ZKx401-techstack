# ZKx401: Spesifikasi Fitur Privasi x402 dan Roadmap Implementasi Berkelanjutan

## Ringkasan Eksekutif: Misi ZKx401 dan Ruang Lingkup

ZKx401 adalah ekstensi privasi untuk protokol x402 yang menjaga kompatibilitas mundur (backward compatibility) sekaligus menambahkan jaminan kerahasiaan yang dapat diaudit. Fokus ZKx401 adalah kerahasiaan jumlah dan saldo (confidential amounts), bukti pembayaran tanpa pengetahuan (zero-knowledge payment proofs), serta akses API privat, dengan opsi unlinkability di lapisan aplikasi (stealth addresses). Desain ini menegaskan prinsip “confidentiality with auditability”: server dan auditor dapat memverifikasi kepatuhan tanpa menurunkan privasi pengguna secara keseluruhan.

Secara fungsional, ZKx401 menonjolkan dua pola pembayaran. Pertama, on-chain settlement di mana bukti kriptografis dan penyelesaian terjadi di blockchain. Kedua, deferred payments di mana komitmen berbayar dikirim melalui HTTP Message Signatures, sedangkan penyelesaian finansial dapat dibatch atau ditangguhkan. Kedua mode ini beroperasi tanpa состоя (stateless) pada lapisan HTTP, sambil tetap menjaga kemampuan audit yang terstruktur. Dengan dukungan primitives ZK di Solana (syscalls Poseidon dan alt_bn128 untuk verifikasi Groth16) dan ekstensi Token22 (Confidential Transfer/Balances), ZKx401 menimbang performa, biaya, dan kepatuhan secara pragmatis.[^7][^1][^9]

Pada aspek risiko, ZKx401 menjawab tiga kebutuhan mendasar: privasi yang bermakna bagi pengguna (rahasia jumlah/saldo), kepatuhan yang terukur (auditor key untuk akses selektif), dan performa yang memadai (pengelolaan compute units untuk verifikasi ZK on-chain). Dengan kebijakan aktivasi bertahap (feature gates), audit berjenjang, dan uji beban terkontrol, roadmap ini meminimalkan friksi integrasi sekaligus menjaga stabilitas ekosistem.



## Background & Pemodelan Ancaman

x402 adalah standar pembayaran berbasis HTTP yang mengaktifkan ulang kode status 402 “Payment Required” untuk menghasilkan autentikasi berbasis pembayaran on-chain atau komitmen kriptografis melalui HTTP Message Signatures. Dalam alur dasar, server menolak akses dengan 402, klien menghadirkan bukti pembayaran, fasilitator menyelesaikan transaksi on-chain atau menandai komitmen, lalu akses diberikan. Skema deferred payments memisahkan jabat tangan kriptografis dari penyelesaian: klien menyajikan komitmen berbayar dan bukti yang menyertainya, server memberikan akses, dan penyelesaian finansial dilakukan kemudian secara batch atau tradisional.[^7][^8]

Pada sisi blockchain, ekosistem Solana mendukung model akun dengan eksekusi paralel dan program stateless. Di domain privasi, strategi yang berkembang adalah kerahasiaan yang dapat diaudit melalui ekstensi Token22 (Confidential Transfer/Balances). Fitur-fitur ini memungkinkan merahasiakan jumlah dan saldo, pemotongan fee secara rahasia, serta penggunaan “global auditor key” untuk akses baca selektif yang dikontrol. Auditabilitas dibangun ke dalam desain, sehingga garis kebijakan kepatuhan dapat diterapkan tanpa mengorbankan privasi inti pengguna.[^1][^2][^13]

Pemodelan ancaman ZKx401 mencakup tiga kelas lawan:
- On-chain observer: menganalisis ledger, pola transaksi, dan interaksi program.
- Network-level observer: menggabungkan data on-chain dengan metadata jaringan (IP, waktu, frekuensi).
- Regulatory auditor: entitas yang memiliki akses legal/kunci auditor untuk membuka informasi selektif.

Linkage attacks (pengaitan identitas melalui pola), dust attacks (mengganggu privasi dengan dana kecil), serta kebocoran metadata melalui korelasi aktivitas HTTP↔on-chain adalah vektor utama. Asumsi kepercayaan: fasilitator jujur, key management aman di klien/dompet, dan governance program transparan. Untuk mencapai keseimbangan privasi–akuntabilitas, ZKx401 mengadopsi model akses selektif berbasis kebijakan yang ditopang oleh kunci auditor global (untuk konteks on-chain) dan kontrol akses di server (untuk konteks HTTP).[^20][^21]

Untuk memperjelas ruang lingkup fitur privasi Solana yang relevan, lihat Tabel 1 berikut.

Tabel 1. Fitur privasi Solana dan statusnya
| Fitur                         | Deskripsi ringkas                                                                                   | Status utama (saat ini)           | Rujukan utama |
|------------------------------|------------------------------------------------------------------------------------------------------|-----------------------------------|---------------|
| Confidential Transfer        | Transfer token tanpa看见 jumlah; saldo pribadi; bukti ZK untuk validitas dan rentang                | Dinonaktifkan sementara karena audit Program ZK ElGamal | [^1][^16]     |
| Confidential Balances        | Saldo rahasia untuk token; dukungan mint/burn dan fee secara rahasia; opsi global auditor key         | Aktif secara konsep; adopsi institusional didorong  | [^2][^13][^17] |
| ZK Token Proof Program       | Verifikasi bukti ZK untuk enkripsi ElGamal; protokol Sigma; global auditor                          | Variasif; komponen di SPL; ada riwayat audit bug     | [^6][^12][^16] |
| ZK Syscalls (Poseidon, alt_bn128) | Dukungan verifikasi ZK on-chain: Poseidon untuk hash ZK-friendly; alt_bn128 untuk pairing/Groth16 | Tersedia/bergerak menuju ketersediaan luas untuk Groth16 | [^9]          |

Penjelasan: tabel ini menegaskan bahwa fitur confidential amounts dan bukti ZK siap secara konsep, namun memerlukan cuidados aktivasi pasca-audit dan pengelolaan verifikasi on-chain yang efisien.



## Desain Fitur Privasi ZKx401

ZKx401 mendefinisikan empat komponen utama: Anonymous Transactions (by-policy), Private Payment Amounts, Zero-Knowledge Payment Proofs (untuk on-chain settlement dan deferred), serta Private API Access (otentikasi dan otorisasi berbasis bukti dan kebijakan). Desain ini meminimalkan invasif terhadap spesifikasi x402, menuntut header HTTP baru opsional yang menanggung bukti/komitmen, dan memperpanjang struktur pesan tanda tangan HTTP untuk membawa komitmen bernilai私家 (public inputs dapat terikat pada ciphertext dan resource target).

Private Payment Amounts menggunakan ekstensi Token22 Confidential Transfer/Balances. Instruksi deposit–apply–withdraw memisahkan saldo “pending” dan “available” secara rahasia, sementara bukti ZK memvalidasi kesetaraan input/output, validitas ciphertext, dan rentang nilai. Untuk kepatuhan, global auditor key memberikan akses baca selektif tanpa membuka identitas pengguna secara keseluruhan, sebuah pendekatan yang menegaskan auditabilitas sambil menjaga privasi. Namun, status aktifasi fitur ini bergantung pada hasil audit; aktivasi bertahap dengan feature gates adalah persyaratan.[^1][^2][^13]

Zero-Knowledge Payment Proofs menyertai komitmen pembayaran. Pada on-chain settlement, bukti memverifikasi ketersediaan dana tersembunyi dan kepatuhan parameter tanpa membocorkan alamat/jumlah; pada deferred, bukti memverifikasi komitmen berbayar yang dikirim via HTTP Message Signatures, sementara penyelesaian finansial dapat ditangguhkan atau dibatch. Di Solana, verifikasi Groth16 memanfaatkan syscalls Poseidon dan alt_bn128, membuka jalur bukti yang ringkas dan cepat verifikasi, sementara riset L1 on-chain STARK+PQC membuka alternatif yang transparan dan tahan kuantum, dengan kendali ukuran bukti dan biaya verifikasi yang ketat.[^9][^11][^10]

Private API Access dikembangkan sebagai mekanisme token berbasis bukti dan kebijakan, menggunakan HTTP Message Signatures yang terikat ke resource dan parameter alur pembayaran (misalnya invoice ID, scope akses). Server menilai bukti tanpa состоя (stateless), mengandalkan referensi yang terikat kriptografis (public inputs ↔ ciphertext ↔ resource). Untukusk privacy by design, server hanya menyimpan metadata minimal dan mengaktifkan retención terbatas sesuai kebijakan.

Stealth addresses di lapisan aplikasi/dompet menyediakan unlinkability penerima: setiap invoice atau sesi menghasilkan one-time address yang dipetakan ke Associated Token Account (ATA). Implementasi ini mengikuti prinsip ERC-5564 (Ethereum) namun diadaptasi ke model akun Solana; privasi dicapai pada level ledger, sementara metadata seperti waktu dan pola interaksi tetap perlu ditangani dengan kebijakan spend yang disiplin.[^19][^3]

Untuk menyorot implikasi desain terhadap privasi dan kepatuhan, lihat Tabel 2 berikut.

Tabel 2. Teknik privasi vs cakupan privasi dan implikasi kepatuhan
| Teknik                         | Pengirim       | Penerima      | Jumlah        | Implikasi kepatuhan                   | Rujukan utama |
|-------------------------------|----------------|---------------|---------------|---------------------------------------|---------------|
| Ring Signatures               | Terbatas       | Tidak         | Tidak         | Sulit diaudit; potensi delisting      | [^3]          |
| Stealth Addresses             | Tidak          | Kuat          | Tidak         | Audit via metadata/policy; feasible   | [^3][^19]     |
| Pedersen Commitments          | Tidak          | Tidak         | Kuat          | Range proof audit-friendly            | [^3]          |
| zk-SNARKs                     | Kuat           | Terbatas (tanpa z-address) | Kuat    | Bukti ringkas; audit via public inputs | [^3][^10]     |
| Ring Confidential Transactions (RingCT) | Terbatas | Kuat          | Kuat          | Kompleks; audit via kunci khusus      | [^3]          |

Penjelasan: desain ZKx401 memilih teknik yang memaksimalkan privasi pada jumlah/saldo dan komitmen, sambil menjaga auditability melalui kunci auditor global dan kebijakan server, menghindari anonymitas penuh yang menimbulkan risiko kepatuhan signifikan.



## Spesifikasi Teknis: Integrasi x402 + Solana

Ektensi header HTTP ZKx401 menempatkan bukti/komitmen dalam alur 402 tanpa mengorbankan kompatibilitas. Header opsional baru membawa ZK proof, public inputs yang terikat pada ciphertext/resource, serta signature binding untuk memastikan komitmen hanya berlaku terhadap resource yang diminta. Message signatures mengikuti pola x402, menambahkan komponen komitmen dan parameter kebijakan yang relevan; server memverifikasi signature dan bukti tanpa состоя (stateless), memilih mode on-chain settlement atau deferred berdasarkan kebijakan dan kemampuan fasilitator.

Verifikasi ZK on-chain memanfaatkan syscalls Poseidon untuk hash ZK-friendly dan alt_bn128 untuk operasi pairing yang dibutuhkan Groth16. ZK Token Proof Program menyediakan kerangka verifikasi bukti untuk enkripsi ElGamal yang mendasari confidential amounts; kebijakan server memilih apakah bukti harus diverifikasi on-chain (settlement) atau digunakan sebagai klaim terhadap komitmen deferred (verifikasi off-chain/on-chain ringan). Strategi ini membantu mengelola biaya compute units (CU) secara efektif bagi aliran pembayaran berfrekuensi tinggi atau bernilai kecil (micropayments).[^9][^6][^7]

Biaya verifikasi ZK tidak trivial. Sebagai ilustrasi, ZK Compression (Groth16) memerlukan sekitar ~100k CU untuk verifikasi validity proof, ~100k CU untuk penggunaan sistem, dan tambahan ~6k CU per baca/tulis akun terkompresi. Mengintegrasikan bukti pembayaran untuk confidential transfers menambah beban di atas operasi transfer biasa, sehingga batching proofs dan off-chain proving menjadi strategi penting untuk menjaga latensi dan pengalaman pengguna.[^9]

Untuk membantu pemilihan teknologi bukti sesuai skenario, lihat Tabel 3 berikut.

Tabel 3. SNARK vs STARK untuk pembayaran di Solana
| Kriteria                  | SNARK (mis. Groth16)                                 | STARK                                               |
|--------------------------|-------------------------------------------------------|-----------------------------------------------------|
| Trusted setup            | Diperlukan (per sirkuit untuk Groth16; universal untuk PLONK) | Tidak diperlukan (transparan)                      |
| Ukuran bukti             | Sangat kecil (≈100–200 byte)                          | Lebih besar (beberapa ratus KB)                    |
| Waktu verifikasi         | Sangat cepat (milidetik)                              | Cepat, namun sering lebih berat dari SNARK         |
| Ketahanan kuantum        | Lebih rendah (bergantung pairing-friendly curves)     | Lebih tinggi (bergantung hash dan informasi teori) |
| Kompatibilitas Solana    | Tinggi (alt_bn128; Groth16 verifier di syscalls)      | Mungkin lebih tinggi secara asumsi, namun bukti besar |
| Kebutuhan compute budget | Lebih rendah per bukti                                | Lebih tinggi per bukti (ukuran/verifikasi)         |

Penjelasan: untuk micropayments dan bandwidth ketat, SNARK (Groth16) sering menjadi pilihan default; STARK relevan untuk transparansi dan ketahanan kuantum, tetapi menuntut kebijakan verifikasi yang menyeluruh untuk mengelola biaya dan latensi.[^9][^10][^11]



## Private API Access: Otentikasi & Otorisasi Berbasis Bukti & Kebijakan

Private API access ZKx401 mengonversi pembayaran dan bukti menjadi token akses yang memahami konteks. Server memverifikasi header ZKx401 dan signature binding terhadap resource (misalnya endpoint, invoice, scope), lalu menurunkan kebijakan otorisasi (role, rate limits) yang selaras dengan bukti dan profil risiko. Auditabilitas diterapkan melalui logging terarah dan akses selektif oleh auditor; server menyimpan minimal data yang diperlukan, menutup penyimpanan setelah periode retensi yang singkat, dan menggunakan kunci auditor (untuk on-chain) atau kebijakan akses (untuk HTTP) hanya ketika diperlukan.

Persyaratan kepatuhan dibangun dari awal: akses selektif harus transparan, dapat diaudit, dan dibatasi oleh kebijakan yang jelas. Dengan confidentiality-with-auditability, ZKx401 selaras dengan praktik privasi–regulasi yang tumbuh di blockchain publik, mengurangi risiko delisting sembari tetap menjaga privasi pengguna.[^21][^13]



## Analisis Anonymous Transactions & Stealth Addresses

Anonimitas penuh pada jaringan publik seperti Solana menimbulkan tantangan teknis dan regulasi yang tidak trivial. ZKx401 mengambil posisi anonimitas-by-policy: privasi jumlah/saldo dan komitmen diperkuat, sedangkan identitas dan metadata dikelola melalui kebijakan spending dan pemisahan domain operasional, bukan melalui anonymity-by-default yang membutuhkan dukungan UTXO-like dan mekanisme z-address yang tidak lazim di Solana. Untuk skenario dengan kebutuhan privasi yang lebih tinggi, komputasi rahasia terdistribusi (MPC/DeCC) menjadi opsi, namun kompleksitas dan trust assumption terhadap node MPC perlu dikelola hati-hati.[^3][^5][^21]

Stealth addresses menghadirkan unlinkability penerima yang praktis di ZKx401. one-time address dipetakan ke ATA/SPL token, dompet penerima melakukan scanning dan spend sesuai kunci relevan. Praktik terbaik: hindari reuse kunci, pisahkan dompet operasional, dan gunakan kebijakan spend yang cenderung “consistent” (mencegah pola unik yang mudah dikorelasikan). ERC-5564 memberikan panduan yang dapat diadaptasi untuk ekosistem Solana, meski pemetaan ke akun token terlihat perlu mendapat perhatian khusus pada level aplikasi/dompet.[^19][^3]

Untuk merangkum perbandingan stealth addresses di Ethereum vs Solana, lihat Tabel 4 berikut.

Tabel 4. Stealth addresses: Ethereum vs Solana
| Aspek                     | Ethereum (ERC-5564)                                 | Solana (pendekatan aplikasi/dompet)                        |
|--------------------------|------------------------------------------------------|------------------------------------------------------------|
| Lapisan implementasi     | Standar protokol di atas EVM                        | Lapisan aplikasi/dompet; pemetaan ke akun token            |
| Skema alamat             | Stealth address generation dengan kunci pandang/belanja | One-time address dipetakan ke ATA/SPL token                |
| Scanning                 | Dompet melakukan scanning sesuai standar            | Dompet scanning stealth address→akun token                 |
| Kompatibilitas token     | ERC-20/721                                           | SPL Token via ATA                                          |
| Privasi yang dicapai     | Unlinkability penerima                               | Unlinkability pada ledger; alamat token tetap publik       |
| Metadata leakage         | Tetap ada via pola on-chain                         | Tetap ada; perlu kebijakan spending dan pemisahan domain   |

Penjelasan: ZKx401 mengandalkan stealth addresses sebagai opsi privasi penerima yang realistis di Solana, sembari mengakui bahwa metadata tetap memerlukan kebijakan perilaku pengguna dan desain operasional yang disiplin.[^19][^3]



## Analisis Keamanan & Threat Model

ZKx401 menghadapi ancaman yang sebagian besar bersifat operasional dan kriptografis. Deanonymization dapat terjadi melalui linkage attacks; dust attacks mengganggu privasi dengan dana kecil; double-spending pada saldo rahasia harus dicegah dengan bukti ZK yang mengikat saldo dan struktur apply/withdraw yang disiplin. Pada lapisan protokol, HTTP Message Signatures harus terikat kuat pada resource dan komitmen; abuse seperti komitmen yang tidak terikat harus ditangani dengan verifikasi signature JWK, kebijakan header, dan enforcement di sisi server. Pada lapisan ZK, insiden bug “Phantom challenge soundness” pada Solana’s ZK proof program mengingatkan bahwa kesalahan soundness dapat berakibat fatal; audit dan gated activation adalah keharusan.[^16][^14]

Program Solana memiliki pola kerentanan umum—data validation flaws, arbitrary CPI, missing ownership/signer checks, PDA misuse, seed collisions—yang harus dimitigasi dengan validasi input komprehensif, kontrol akses ketat, dan práticas terbaik pengembangan (Anchor constraints, Address Lookup Tables, pemeriksaan tetap setelah CPI). Dengan audit komunitas (Code4rena) dan rilis terkontrol, ZKx401 meminimalkan risiko sambil menjaga laju inovasi.[^15][^16][^14][^6]

Untuk mengoperasionalkan mitigasi, lihat Tabel 5 berikut.

Tabel 5. Serangan → kontrol mitigasi
| Serangan/Vektor                    | Deskripsi                                           | Kontrol mitigasi utama                                          |
|-----------------------------------|-----------------------------------------------------|------------------------------------------------------------------|
| Linkage/deanonymization           | Korelasi alamat, pola transaksi, metadata           | Unlinkability via stealth addresses; kebijakan spend; ZKP untuk privasi jumlah |
| Dust attacks                      | Saldo kecil memaksa interaksi                       | Confidential amounts; pemisahan dompet; kebijakan ignore/merge   |
| Double-spending                   | Pengeluaran ganda pada saldo rahasia                | ZKP binding saldo; nullifier-like controls; apply/withdraw disiplin |
| Arbitrary CPI                     | Pemanggilan program tak sah                         | Validasi program ID; Anchor CPI modules; allowlist program       |
| Ownership/signer check missing    | Operasi istimewa tanpa validasi pemilik/signer      | Pemeriksaan owner & is_signer; Anchor Signer/Account; pemisahan otoritas |
| PDA misuse & seed collisions      | Saluran otoritas bercampur; tabrakan seed           | Unique seeds; bump kanonis; modular PDA per domain; validasi seed |
| ZK soundness bugs                 | Kesalahan verifikasi bukti                          | Audit komunitas; gated activation; canary deployments; regression tests |
| HTTP signature abuse              | Komitmen tidak terikat ke resource                  | Signature binding; header policy; JWK dir verification           |

Penjelasan: pemetaan ini menyorot kebutuhan controles berlapis yang menjangkau protokol, kriptografi, dan operasi, memperkuat postur keamanan ZKx401 secara menyeluruh.[^16][^15][^14][^6]



## Skalabilitas, Biaya, dan Dampak Performa

Verifikasi bukti ZK on-chain membutuhkan biaya compute yang signifikan. Gambaran dari ZK Compression (Groth16) membantu mengkalibrasi ekspektasi: verifikasi validity proof ~100k CU, penggunaan sistem ~100k CU, dan tambahan ~6k CU per baca/tulis akun terkompresi. Mengintegrasikan bukti pembayaran untuk confidential transfers menambah beban di atas baseline transfer; ZKx401 mengadopsi strategi batching proofs, off-chain proving (jaringan prover yang kuat), dan referensi data on-chain minimal per bukti untuk mengurangi biaya dan latensi. Pada alternatif STARK, ukuran bukti yang lebih besar menuntut kontrol verifikasi dan kebijakan DoS/fee yang matang, terutama untuk micropayments.[^9][^10][^11]

Untuk memberi gambaran konkret, lihat Tabel 6 berikut.

Tabel 6. Estimasi biaya dan performa
| Komponen                             | Estimasi CU            | Implikasi latency/payload                    |
|--------------------------------------|------------------------|---------------------------------------------|
| Verifikasi validity proof (Groth16)  | ~100k CU               | Tambahan latency; payload bukti ≈128–200 B  |
| Penggunaan sistem (per transaksi)    | ~100k CU               | Overhead tetap per transaksi                 |
| Per akun terkompresi (read/write)    | ~6k CU                 | Biaya tambahan jika transaksi menyentuh banyak akun |
| Confidential transfer ZKP (estimasi) | Lebih tinggi dari baseline | Bergantung bukti rentang & ciphertext validity |

Penjelasan: angka bersifat indikatif dan dapat bervariasi; ZKx401 menargetkan jalur biaya yang terkendali melalui pemilihan bukti yang tepat (SNARK default) dan batching untukskala layanan dengan frekuensi pembayaran tinggi.[^9][^10]



## Kelayakan Implementasi & Integrasi x402

ZKx401 memperluas SDK untuk membawa ZKP yang menyertai komitmen pembayaran, baik pada on-chain settlement maupun deferred. Bindings antara public inputs dan ciphertext serta resource target menjadi inti jaminan kriptografis; verifikasi signature JWK memastikan integritas pengirim. Untuk on-chain settlement, koordinasikan dengan node RPC yang mendukung verifikasi ZK (syscalls Poseidon/alt_bn128); untuk deferred, verifikasi komitmen di lapisan HTTP dan penyelesaian batch on-chain di waktu yang telah ditentukan.

Dua arsitektur pembayaran ZKx401 memiliki implikasi berbeda terhadap biaya, latensi, dan kepatuhan. Untuk memperjelas, lihat Tabel 7 berikut.

Tabel 7. On-chain settlement vs deferred payments
| Dimensi              | On-chain settlement (Solana)                               | Deferred (x402)                                                |
|----------------------|------------------------------------------------------------|----------------------------------------------------------------|
| Alur                  | 402 → bukti pembayaran → transaksi token confidential → akses | 402 → HTTP message signature + ZKP komitmen → akses → penyelesaian later |
| Privasi               | Jumlah/saldo pribadi via Confidential Transfer/Balances     | Jumlah bisa pribadi via ZKP; alamat terlihat                   |
| Biaya CU              | Lebih tinggi (verifikasi ZK + eksekusi transfer)            | Lebih rendah di on-chain (b主要用于 verifikasi komitmen)       |
| Latensi               | Sekitar konfirmasi on-chain (detik)                         | Akses segera via komitmen; penyelesaian async                  |
| Kepatuhan             | Audit via kunci auditor global (opsional)                   | Audit via binding komitmen; kebijakan akses selektif            |
| Kompleksitas          | Moderat–tinggi (instruksi Token22 + ZK proof)              | Moderat (HTTP-native signatures + ZKP untuk komitmen)          |

Penjelasan: ZKx401 memberi fleksibilitas integrator memilih mode yang sesuai kebutuhan; on-chain settlement memberikan jaminan langsung, sedangkan deferred mengurangi latensi dan biaya on-chain untukskala besar.[^7][^8][^1][^9]



## Roadmap Implementasi ZKx401

Prioritas implementasi ZKx401 disusun untuk memaksimalkan manfaat privasi cepat, menjaga auditabilitas, dan meminimalkan friksi integrasi.

Tahap 1 — Confidential Transfer/Balances:
- Aktivasi ekstensi Token22 pasca-audit; gunakan feature gates, uji beban terkontrol, dan canary deployments. Dompet mendukung instruksi deposit–apply–withdraw dan kebijakan spending aman.[^1][^2][^13]

Tahap 2 — ZK Payment Proofs (deferred dan on-chain settlement):
- Perluas SDK x402 untuk membawa ZKP komitmen; terapkan binding antara public inputs dan ciphertext; verifikasi signature JWK; kontrol DoS/fee. Koordinasikan dengan RPC/node yang mendukung verifikasi ZK on-chain (syscalls Poseidon/alt_bn128).[^7][^9][^11]

Tahap 3 — Stealth addresses (aplikasi/dompet):
- Implementasikan one-time addresses yang dipetakan ke ATA/SPL; ikuti pola ERC-5564; edukasi pengguna tentang kebijakan spend dan pemisahan domain operasional.[^19][^3]

Tahap 4 — Studi kelayakan anonimitas tingkat jaringan:
- Jajaki MPC/DeCC (Arcium) untuk memproses transaksi pada data terenkripsi; kelola trust assumption, overhead komputasi, dan kebijakan audit selektif; jika risiko regulasi tinggi, tetap fokus pada anonymity-by-policy.[^5][^21]

Untuk mengoperasionalkan roadmap, lihat Tabel 8 berikut.

Tabel 8. Checklist implementasi per fitur
| Fitur                          | Dependensi utama                   | Audit           | Testnet → Mainnet                          | KPI/Ketahanan                        |
|-------------------------------|------------------------------------|-----------------|--------------------------------------------|--------------------------------------|
| Confidential Transfer/Balances | Token22, ZK ElGamal, syscalls ZK    | code423n4, internal | Feature gates, canary → activation penuh     | Verifikasi bukti stabil; CU terkendali; error rate rendah |
| ZK Payment Proofs              | alt_bn128, Groth16, Poseidon        | Security review | POC deferred → on-chain settlement           | Binding komitmen valid; DoS mitigation |
| Stealth addresses              | Dompet/SDK, ATA/SPL                 | N/A             | Beta terbatas → produksi                    | Unlinkability terjaga; metadata minimized |
| Anonimitas jaringan (studi)    | MPC/DeCC, governance                | N/A             | Penelitian → prototype                      | Trust assumptions jelas; audit selektif |

Penjelasan: checklist ini memandu tim teknis dari desain hingga produksi, memastikan setiap fitur melewati uji keamanan dan performa yang memadai.[^1][^7][^15][^5]



## Kelayakan Implementasi & Integrasi: Pemetaan Alur 402

Secara operasional, ZKx401 menambahkan tahap verifikasi bukti pada interaksi 402:
1. Server menegakkan 402 dan mendeklarasikan kebijakan pemblokiran/akses berdasarkan bukti yang diterima.
2. Klien menanggapi dengan header ZKx401 berisi ZKP, public inputs yang terikat ke ciphertext/resource, dan tanda tangan pesan yang mengikat komitmen ke resource yang diminta.
3. Server menilai bukti secara stateless: pada mode deferred, akses diberikan setelah verifikasi komitmen, sedangkan penyelesaian finansial menunggu; pada mode on-chain, fasilitator melanjutkan transaksi confidential transfer dan bukti diverifikasi on-chain sebelum akses diberikan.
4. Audit selektif berlangsung sesuai kebijakan: untuk on-chain, kunci auditor global; untuk HTTP, kebijakan akses dan logging terarah dengan retensi minimal.[^7][^8]



## Regulasi & Kepatuhan: Selective De-anonymization & Auditability

ZKx401 mengadopsi model “confidentiality with auditability” dengan selective de-anonymization berbasis kebijakan. Fitur seperti Confidential Balances menyediakan akses baca selektif melalui global auditor key, menyeimbangkan privasi dengan kebutuhan oversight. Risiko delisting dan kewajiban pelaporan meningkat untuk fitur yang mendorong anonimitas penuh; ZKx401 menekankan kerahasiaan yang dapat diaudit, kontrol akses yang jelas, dan dokumentasi kebijakan yang transparan. Pendekatan ini terbukti lebih selaras dengan tren regulasi dan kepatuhan di blockchain publik.[^2][^20][^21]



## Trade-offs Kunci ZKx401

Privasi vs Akuntabilitas: memfokuskan confidential amounts dan ZKP menjaga privasi tanpa menghilangkan akuntabilitas yang diperlukan, sementara stealth addresses memberi unlinkability dengan trade-off metadata yang harus dikelola.

Performa vs Biaya ZK: verifikasi ZK on-chain menambah biaya CU; ZKx401 memilih bukti ringkas (SNARK/Groth16) sebagai default untuk mengurangi latensi, dengan opsi STARK untuk kebutuhan ketahanan kuantum dan transparansi, sepanjang kebijakan verifikasi di/elakukan secara hati-hati.

Kepatuhan vs Adopsi Pasar: desain yang mendorong audit selektif dan kebijakan akses yang jelas lebih mungkin diadopsi oleh layanan institusional dan ritel, mengurangi risiko delisting sambil menjaga privasi bermakna bagi pengguna.



## Informasi yang Masih Kurang (Information Gaps)

Beberapa celah informasi perlu ditangani sebelum produksi:
- Hasil dan status akhir audit Program ZK ElGamal pasca-penonaktifan.
- Angka biaya compute aktual untuk verifikasi bukti ZK pada confidential transfers (di luar rujukan ZK Compression).
- Spesifikasi formal adaptasi stealth addresses ke model akun Solana dan pemetaan ke SPL.
- Detail implementasi Arcium/MPC yang relevan untuk operasi pembayaran privat.
- Status ketersediaan alt_bn128 dan Poseidon syscalls di mainnet (fees, aktivasi fitur).
- Kerangka kepatuhan yurisdiksi spesifik untuk adopsi luas fitur privasi.[^1][^16][^19][^5]



## Lampiran: Referensi dan Glosarium

Glosarium:
- Confidential Transfer: mekanisme di Token22 untuk merahasiakan jumlah transfer dan saldo dengan bukti ZK (validitas ciphertext, kesetaraan input/output, range proof).
- Confidential Balances: ekstensi saldo rahasia untuk SPL Token, termasuk mint/burn, fee rahasia, dan akses baca selektif via global auditor key.
- ZK Token Proof Program: program verifikasi bukti ZK untuk enkripsi ElGamal pada Solana.
- Global Auditor Key: kunci yang memungkinkan auditor mengakses informasi selektif secara terarah.
- Deferred Payments: pola pembayaran di mana komitmen berbayar dikirim via HTTP Message Signatures, sedangkan penyelesaian finansial dilakukan kemudian.
- SNARK vs STARK: dua kelas bukti tanpa pengetahuan; SNARK (mis. Groth16) memiliki ukuran bukti kecil dan verifikasi cepat dengan trusted setup; STARK transparan tanpa trusted setup namun ukuran bukti lebih besar.

Ringkasan tabel:
- Tabel 1 memetakan fitur privasi Solana dan status saat ini.
- Tabel 2 menyorot cakupan privasi berbagai teknik dan implikasi kepatuhan.
- Tabel 3 membandingkan SNARK vs STARK untuk konteks Solana.
- Tabel 4 membandingkan stealth addresses di Ethereum vs Solana.
- Tabel 5 memetakan serangan → kontrol mitigasi.
- Tabel 6 memberi estimasi biaya dan performa verifikasi ZK.
- Tabel 7 membandingkan on-chain settlement vs deferred payments.
- Tabel 8 menyajikan checklist implementasi per fitur.



## Referensi

[^1]: Confidential Transfer - Solana. https://solana.com/docs/tokens/extensions/confidential-transfer  
[^2]: Privacy on Solana: How Confidential Balances Work - OKX. https://www.okx.com/learn/solana-blockchain-privacy-confidential-balances  
[^7]: Launching the x402 Foundation with Coinbase, and support for x402 - Cloudflare. https://blog.cloudflare.com/x402/  
[^9]: Zero-Knowledge Proofs: Its Applications on Solana - Helius. https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana  
[^3]: Summarizing and Analyzing the Privacy-Preserving Techniques in Blockchains - arXiv (2109.07634). https://arxiv.org/html/2109.07634v3  
[^13]: Confidential SPL Token Deep Dive: Overview (Global Auditor) - Solana. https://spl.solana.com/confidential-token/deep-dive/overview#global-auditor  
[^20]: The Trade-Off Between Anonymity and Accountability in Blockchain - IJCIT (2025). https://www.ijcit.com/index.php/ijcit/article/view/503  
[^21]: Blockchain privacy and regulatory compliance: Towards a practical ... - ScienceDirect. https://www.sciencedirect.com/science/article/pii/S2096720923000519  
[^11]: Full L1 On-Chain ZK-STARK+PQC Verification on Solana - IACR ePrint 2025/1741. https://eprint.iacr.org/2025/1741  
[^10]: zk-SNARKs vs zk-STARKs - Chainlink. https://chain.link/education-hub/zk-snarks-vs-zk-starks  
[^8]: What Is x402 Protocol: Inside Coinbase's New Standard for Onchain and AI Payments - Bitget Academy. https://web3.bitget.com/en/academy/what-is-x402-protocol-inside-coinbases-new-standard-for-onchain-and-ai-payments  
[^19]: Private Transactions on Ethereum using Stealth Addresses (ERC-5564) - QuickNode. https://www.quicknode.com/guides/ethereum-development/wallets/how-to-use-stealth-addresses-on-ethereum-eip-5564  
[^6]: ZK Token Proof Program - Solana Docs. https://docs.solanalabs.com/runtime/zk-token-proof  
[^16]: Uncovering the Phantom Challenge Soundness Bug in Solana's ZK Proof Program - zksecurity. https://blog.zksecurity.xyz/posts/solana-phantom-challenge-bug/  
[^15]: 2025-08 Solana Foundation: Confidential Transfer Audit - Code4rena (GitHub). https://github.com/code-423n4/2025-08-solana-foundation  
[^14]: A Hitchhiker's Guide to Solana Program Security - Helius. https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security  
[^12]: Confidential SPL Token Deep Dive: Encryption (Twisted ElGamal) - Solana. https://spl.solana.com/confidential-token/deep-dive/encryption#twisted-elgamal-encryption  
[^17]: Solana developers launch 'Confidential Balances' token extensions to improve onchain privacy - The Block. https://www.theblock.co/post/350076/solana-developers-launch-new-confidential-balances-token-extensions-to-improve-onchain-privacy  
[^18]: Confidential Balances: Empowering Confidentiality on Solana - Helius. https://www.helius.dev/blog/confidential-balances  
[^5]: The Rebirth of Privacy on Solana - Arcium. https://www.arcium.com/articles/the-rebirth-of-privacy-on-solana