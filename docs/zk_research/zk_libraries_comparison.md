# Blueprint Analisis Mendalam Library circom, snarkjs, dan @zk-kit untuk Zero-Knowledge Proofs di Solana

## 1. Pendahuluan & Ringkasan Eksekutif

Laporan ini menyajikan analisis teknis komparatif terhadap tiga pustaka zero-knowledge (ZK) yang widely adopted—circom, snarkjs, dan @zk-kit—dengan fokus pada kompatibilitas terhadap Solana, kemudahan integrasi, performa, dukungan komunitas, dan implikasi operasional/polik lisensi dalam konteks produksi. Ruang lingkup meliputi:

- Peran library dalam pipeline bukti ZK (sirkuit → witness → proving → verifikasi) dan interop-nya dengan ekosistem Solana, khususnya syscalls ZK yang relevan dan verifikasi on-chain.
- Pola integrasi dengan Solana untuk skenario off-chain proving dan on-chain verification, termasuk pemetaan terhadap alt_bn128 (pairing), Poseidon hash, compression g1/g2, program resmi zk-token-proof, serta integrasi dengan Light Protocol (ZK Compression).
- Kajian performa relative terhadap prover alternatif (rapidsnark, arkworks, wasmsnark), implikasi pemilihan hash ZK-friendly (Poseidon/Poseidon2), dan dampak ke ukuran bukti/CU on-chain.
- Kerangka keputusan pragmatic yang memetakan use-case (MVP JS/TS, produksi on-chain biaya rendah, privasi SPL, skala state) terhadap kombinasi stack/library yang optimal.

Ringkasnya, untuk MVP di браузер/Node dan iterasi cepat, kombinasi circom (compiler sirkuit) + snarkjs (prover/verifier JS/WASM) + @zk-kit (primitif ZK, struktur data) memberikan jalur terpendek dari konsep ke bukti. Sebaliknya, untuk produksi on-chain di Solana, verifikasi on-chain harus diletakkan di Rust (program Solana) memanfaatkan syscalls ZK (alt_bn128/Poseidon), serta mempertimbangkan Light Protocol untuk ZK Compression bila biaya state mendominasi. Rekomendasi final disajikan pada bagian penutup, sekaligus menggarisbawahi lisensi (GPL-3.0 untuk circom/snarkjs vs MIT untuk @zk-kit), kepercayaan komunitas (PSE/iden3), dan risiko yang harus dikelola (trusted setup, audit, dan kesesuaian kurva).

## 2. Metodologi & Kriteria Evaluasi

Evaluasi dilakukan dengan kriteria berikut: (i) kompatibilitas Solana (syscalls ZK, program resmi), (ii) kemudahan integrasi (DX/TS, tooling, alur end-to-end), (iii) performa (witness generation, proof generation, verifikasi, ukuran bukti), (iv) dukungan komunitas (riwayat rilis, kontributor, dokumentasi), dan (v) produktivitas (kurva belajar, ekosistem alat). Sumber informasi adalah repositori resmi dan dokumentasi proyek, ditambah studi komparatif dan benchmark independen. Keterbatasan yang perlu dicatat:

- Belum tersedia benchmark resmi dan menyeluruh untuk kinerja library JS/TS (snarkjs, @zk-kit) dalam environment Solana mainnet/devnet; bias terhadap angka EVM/benchmark sintetis.
- Tidak ada metrik komunitas terstandardisasi lintas library (misal SLA resolution issues); data stars/contributors bersifat indikatif.
- Informasi terbaru tentang status audit untuk seluruh paket @zk-kit belum lengkap (beberapa ter-audit, sebagian belum).
- Panduan produksi end-to-end untuk integrasi snarkjs → verifikasi on-chain Solana masih terbatas di sumber publik.
- Dampak kombinasi Poseidon2 + alt_bn128 secara spesifik pada CU/biaya verifikasi Solana belum dipublikasikan luas.

Pendekatan kami menggabungkan analisis komparatif Circom vs ZoKrates dari studi CEUR-WS sebagai baseline efisiensi artefak dan gas verifier, survey arXiv 2025 untuk kerangka evaluasi lintas framework, benchmark hash ZK-friendly untuk implikasi biaya verifikasi on-chain, serta dokumentasi resmi Solana/ Light Protocol untuk pemetaan syscall-program yang menjadi landasan integrasi on-chain.[^23][^25][^24][^11]

## 3. Fondasi ZK di Solana: Syscall, Program, dan Kurva

Ekosistem ZK di Solana memasuki fase kematangan operasional dengan ketersediaan syscalls kriptografis yang menurunkan biaya verifikasi on-chain dan membuka interoperabilitas lintas rantai. Tiga blok pembangun utama adalah:

- alt_bn128 pairing operations: memungkinkan verifikasi SNARK yang bergantung pada pairing (mis. Groth16) langsung on-chain dengan biaya yang jauh lebih efisien dibanding sebelumnya.
- Poseidon hash syscall: menyediakan hash ZK-friendly di runtime Solana yang murah untuk verifikasi dan cocok untuk struktur bukti Merkle (IMT/LeanIMT/SMT).
- curve25519/ristretto syscall: menyediakan operasi kurva alternatif untuk kebutuhan kriptografis spesifik.

Selain itu, alt_bn128 g1/g2 compression mengurangi ukuran payload bukti Groth16 yang dikirimkan ke program, menekan biaya transaksi. Pada lapisan program resmi, zk-token-proof menyediakan fasilitas verifikasi bukti ZK dan dukungan privasi SPL (termasuk program bukti ZK ElGamal native). Di lapisan aplikasi, Light Protocol mengenalkan ZK Compression: state akun dikompresi menjadi leaf pada Sparse Merkle Tree yang di-root-kan on-chain, dengan bukti validitas Groth16 ringkas (128 byte) yang diverifikasi terhadap root, sehingga biaya penyimpanan turun dramatis sementara integritas L1 tetap terjaga.[^11][^1][^2][^12][^14]

Tabel 1 berikut merangkum syscall ZK dan program terkait berikut fungsi, status aktivasi, dan peran on-chain.

Tabel 1. Syscall ZK di Solana dan Fungsi-nya

| Nama Syscall/Program               | Fungsi Kriptografis Utama                         | Aktivasi/Versi      | Peran On-Chain                                                                 |
|------------------------------------|----------------------------------------------------|---------------------|--------------------------------------------------------------------------------|
| alt_bn128                          | Operasi kurva bn254/bn256 (add, scalar mult, pairing) | v1.17               | Verifikasi Groth16/PLONK yang membutuhkan pairing dan operasi kurva bn128[^11] |
| Poseidon hash syscall              | Hash Poseidon untuk sirkuit ZK                    | v1.17               | Komputasi hash berbiaya rendah dalam program, cocok untuk SMT/IMT[^11]         |
| curve25519/ristretto syscall       | Operasi kurva Edwards/Ristretto                   | v1.17               | Alternatif kurva untuk kebutuhan kriptografis khusus[^11]                      |
| alt_bn128 g1/g2 compression        | Kompresi representasi bukti Groth16               | v1.17               | Memperkecil ukuran bukti Groth16 dikirimkan on-chain[^11]                      |
| zk-token-proof (program resmi)     | Verifikasi bukti ZK dan privacy SPL               | —                   | Program vended Solana untuk ZK, termasuk ElGamal proof[^2][^11]                 |
| ZK Compression (Light Protocol)    | Validitas state terkompresi di ledger             | — (protokol aplikasi) | Skalabilitas storage dengan ZK validity proofs, integrasi RPC[^9][^10][^11]    |

Signifikansi tabel: syscalls dan program resmi ini memperbaiki kelayakan ekonomi verifikasi on-chain. alt_bn128 dan Poseidon menjadi tulang punggung verifikasi Groth16 dan komputasi hash, sedangkan kompresi g1/g2 memotong ukuran bukti. Light Protocol memperluas efisiensi ke domain skala state, memanfaatkan verifier Groth16 yang kompatibel dengan alt_bn128.

## 4. Profil Library Inti

Pustaka yang dikaji berada pada sisi yang berbeda dari pipeline ZK. circom adalah compiler sirkuit (R1CS) dengan ekosistem lengkap; snarkjs adalah prover/verifier JS/WASM yang menaut ke artefak circom; @zk-kit adalah monorepo primitif JS/TS (hash, tanda tangan, struktur Merkle). Pada sisi Solana, verifikasi on-chain terjadi di program Rust melalui syscalls ZK.

### 4.1 circom (Compiler Sirkuit, Rust)

circom merupakan bahasa domain-spesifik untuk mendefinisikan sirkuit aritmatika yang menghasilkan R1CS dan program witness (WASM/C++/Rust). Ekosistemnya meliputi circomlib (template), circom_tester, serta alat analisis statis seperti circomspect dan Ecne. Keunggulan circom: (i) modul template yang memfasilitasi konstruksi sirkuit besar, (ii) toolchain lengkap untuk pengujian dan audit, (iii) interoperabilitas luas sebagai前端 ke prover lintas bahasa. circom bersifat kurva agnostic; verifikasi on-chain di Solana membutuhkan Rust verifier yang memanfaatkan alt_bn128 pairing dan Poseidon hash. Learning curve moderat (DSL + disiplin constraint), dokumentasi Circom 2 sangat membantu.[^5][^6]

### 4.2 snarkjs (JS/WASM, Groth16/PLONK/FFLONK)

snarkjs menyediakan mesin JS/WASM untuk powers-of-tau (universal), fase 2 spesifik sirkuit, ekspor verification key, dan fungsi proving/verifying untuk Groth16/PLONK/FFLONK. Ia mendukung kurva bn128/bls12-381 dan berjalan di браузер serta Node.js. Di Solana, snarkjs unggul sebagai prover off-chain; verifikasi on-chain dilakukan oleh program Rust via alt_bn128 pairing. Kinerjanya kompetitif untuk beban ringan hingga medium, namun prover native (C++/Rust) cenderung unggul untuk beban berat (lihat bagian 5).snarkjs dilisensikan GPL-3.0 dan memiliki komunitas luas serta dokumentasi yang konsisten.[^4]

### 4.3 @zk-kit (Monorepo JS/TS)

@zk-kit mengumpulkan primitif ZK siap pakai dalam JS/TS: Poseidon, EdDSA, BabyJubJub, Incremental Merkle Tree (IMT), LeanIMT, dan Sparse Merkle Tree (SMT), lengkap dengan benchmark公开 dan beberapa paket ter-audit. Keunggulannya pada DX TypeScript, dokumentasi yang baik, dan benchmarking transparan (framework Benny). Karena berfokus pada primitif (bukan proving system), integrasi on-chain Solana umumnya memanfaatkan struktur data @zk-kit di off-chain, sementara verifier Rust memverifikasi terhadap root/state di on-chain. Learning curve rendah bagi tim TS; coverage audit bervariasi per paket.[^7][^8]

Tabel 2 merangkum benchmark struktur Merkle @zk-kit yang menjadi referensi pemilihan struktur pohon berdasarkan ukuran leaf dan operasi dominan.

Tabel 2. Benchmark Merkle Tree (@zk-kit)

| Ukuran Leaf | Operasi         | Tercepat   | Terlambat  |
|-------------|------------------|------------|------------|
| 8           | Insert           | IMT        | LeanIMT    |
| 8           | Delete           | IMT ≈ SparseMT | IMT ≈ SparseMT |
| 8           | Update           | LeanIMT    | IMT        |
| 8           | Generate Proof   | LeanIMT    | SparseMT   |
| 8           | Verify Proof     | IMT        | SparseMT   |
| 128         | Insert           | IMT        | LeanIMT    |
| 128         | Delete           | SparseMT   | IMT        |
| 128         | Update           | LeanIMT    | IMT        |
| 128         | Generate Proof   | LeanIMT    | IMT        |
| 128         | Verify Proof     | SparseMT   | IMT        |
| 1024        | Insert           | SparseMT   | LeanIMT    |
| 1024        | Delete           | SparseMT   | IMT        |
| 1024        | Update           | LeanIMT    | IMT        |
| 1024        | Generate Proof   | LeanIMT    | IMT        |
| 1024        | Verify Proof     | SparseMT   | IMT        |

Inti pengambilan: LeanIMT unggul pada generate proof dan update dengan profil memori hemat; IMT memimpin untuk insert dan verify proof pada ukuran kecil–sedang; SparseMT menunjukkan dominar pada set besar serta operasi verify/delete. Pilihan struktur harus selaras dengan pola akses dan ukuran state aplikasi.[^8]

## 5. Kinerja & Kompatibilitas relative terhadap Prover Lain

Ekosistem Circom menyediakan beberapa prover yang dapat menerima artefak R1CS dan menghasilkan bukti. Perbandingan yang konsisten dari komunitas menunjukkan bahwa prover native (C++/Rust) secara umum mengungguli snarkjs dalam hal kecepatan, khususnya untuk sirkuit besar.

Tabel 3. Perbandingan Prover Groth16 untuk Circom

| Prover           | Bahasa | Kinerja Relatif        | Dukungan Platform           | Catatan Kunci                                                |
|------------------|--------|-------------------------|-----------------------------|--------------------------------------------------------------|
| rapidsnark       | C++    | Tercepat 🚀             | Desktop, iOS, Android       | Paralelisasi tinggi; Groth16 only; integrasi native lebih kompleks[^22] |
| witnesscalc      | C++    | Tercepat 🚀             | Desktop, iOS, Android       | Ringan untuk witness; tidak mendukung semua sirkuit (mis. RSA)[^22]     |
| rust-witness     | Rust   | Sedikit lebih cepat     | Desktop, iOS, Android       | Kompatibel lintas sirkuit; portabel via w2c2[^22]            |
| wasmer           | Rust   | Sebanding snarkjs (WASM) | Desktop, Android            | Ditinggalkan; isu memori dan dukungan App Store[^22]        |
| snarkjs          | JS/WASM| Lebih lambat            | Browser, Node               | Integrasi JS mulus; multithread opsional; single-thread untuk lingkungan terbatas[^22][^4] |

Implikasi: untuk beban besar (mis. sirkuit RSA, zkEmail), mengganti snarkjs dengan rapidsnark/witnesscalc dapat menurunkan waktu pembuatan bukti secara signifikan, dengan harga ketergantungan native yang lebih tinggi dan tantangan integrasi pada platform tertentu (mis. iOS App Store). Untuk mobile браузер, trade-off antara portabilitas dan kecepatan menjadikan snarkjs tetap relevan sebagai baseline prover.

Di sisi verifikasi on-chain, pemilihan hash ZK-friendly mempengaruhi biaya secara nyata. Studi benchmarking terbaru menunjukkan Poseidon/Poseidon2 unggul pada waktu dan memori selama pembuatan bukti Groth16; Poseidon2 mengurangi biaya on-chain hingga 73% pada EVM dan hampir 26% pada Hedera. Pada Solana, hal ini memberi indikasi bahwa Poseidon/Poseidon2 cenderung lebih efisien dibanding alternatif lain dalam pipeline Groth16, meskipun angka spesifik CU masih menunggu data produksi.[^24]

Tabel 4. Ringkasan Benchmark Hash ZK-friendly (Groth16)

| Hash            | Karakteristik Utama                     | Dampak Biaya On-chain (EVM)         | Catatan                   |
|-----------------|-----------------------------------------|--------------------------------------|---------------------------|
| Poseidon2       | Waktu & memori superior                 | Pengurangan biaya hingga 73%         | Data Hedera: ~26% reduction[^24] |
| Poseidon        | ZK-friendly, biaya verifikasi rendah    | Signifikan dibanding baseline        | Kompatibel dengan syscall Poseidon Solana[^11][^24] |
| Neptune/GMiMC   | Beragam profil performa                 | Bervariasi                           | Digunakan pada studi komparatif[^24]                |

Keterkaitan dengan Solana: Poseidon menjadi kandidat utama untuk hash di sirkuit yang akan diverifikasi on-chain melalui syscall Poseidon; bukti dengan Groth16 memanfaatkan alt_bn128 pairing. Pengurangan biaya on-chain di EVM/Hedera memberi proyeksi awal bahwa Poseidon2 juga berpotensi menurunkan CU verifikasi di Solana, namun angka validasi mainnet/devnet belum tersedia.

## 6. Kompatibilitas & Integrasi dengan Solana

Integrasi ZK di Solana mengikuti pola pemisahan peran: pembuktian (proving) off-chain menggunakan circom/snarkjs/@zk-kit, verifikasi on-chain melalui program Rust dengan syscalls ZK. Syscalls kunci adalah alt_bn128 (pairing), Poseidon (hash), dan kompresi g1/g2; program resmi zk-token-proof menyediakan verifikasi bukti dan dukungan privasi SPL; Light Protocol menawarkan ZK Compression dengan verifier Groth16 yang memanfaatkan syscalls Solana.

Tabel 5 berikut memetakan kompatibilitas library terhadap syscall/program Solana.

Tabel 5. Peta Kompatibilitas Library ↔ Syscall/Program Solana

| Library/Stack           | alt_bn128 | Poseidon | Ristretto/Edwards | g1/g2 Compression | zk-token-proof | Light Protocol |
|-------------------------|-----------|----------|-------------------|-------------------|----------------|----------------|
| circom (R1CS)           | Indirect (via verifier Rust) | Indirect (via Rust verifier) | Indirect | Indirect | Indirect | Indirect |
| snarkjs (JS/WASM)       | Indirect (off-chain proof; on-chain verification via Rust) | Indirect | Indirect | Indirect | Indirect | Indirect |
| @zk-kit (JS/TS)         | Indirect (primitif data; Rust verifier) | Indirect (hashes via Rust) | Indirect | Indirect | Indirect | Indirect |
| solana-zk-sdk (Rust)    | Yes       | Yes      | Maybe             | Yes               | Yes            | —              |
| Light Protocol (Rust)   | Yes (Groth16 verifier) | Yes (Poseidon) | —              | Yes               | —              | Yes            |
| Elusiv (Rust/TS?)       | Via verifier program | Via verifier program | —              | —                 | Yes            | —              |

Interpretasi: library JS/TS menghasilkan artefak sirkuit/bukti off-chain; verifikasi on-chain dijalankan oleh Rust verifier dan program resmi. @zk-kit menyediakan struktur data (IMT/LeanIMT/SMT) yang diverifikasi on-chain oleh Rust verifier; Light Protocol menyediakan verifier Groth16 yang terintegrasi dengan Poseidon dan compression untuk verifikasi on-chain yang efisien.[^11][^2][^14][^19]

## 7. Dukungan Komunitas & Dokumentasi

- snarkjs memiliki aktivitas terukur di GitHub, rilis aktif, dependent luas, dan dokumentasi memadai bagi JS/TS; lisensi GPL-3.0.[^4]
- @zk-kit dikelola Privacy Scaling Explorations (PSE), dokumentasi TS kuat, benchmark publik, dan beberapa paket ter-audit (LeanIMT, EdDSA Poseidon); lisensi MIT.[^7][^8]
- circom memiliki dokumentasi lengkap (Circom 2), toolset luas (circomlib, circomspect, Ecne), dan komunitas aktif; lisensi GPL-3.0.[^5][^6]
- solana-zk-sdk berstatus resmi Solana, coverage docs.rs, lisensi Apache-2.0; posisi sebagai vended contract memperkuat dukungan komunitas.[^2][^3]
- Light Protocol memiliki dokumentasi protokol yang jelas, audit terbuka di repo, dan komunitas aktif; integrasi dengan syscalls Solana.[^9][^12]
- gnark (Go) kuat dalam dokumentasi dan produktivitas; cocok sebagai backend prover alternatif di server-side.[^13]
- arkworks menekankan sifat prototipe akademik; cocok untuk riset, bukan produksi tanpa effort tambahan.[^16]

Tabel 6. Metrik Komunitas & Dokumentasi

| Library/Stack     | Repo (contoh)        | Aktivitas/rilis         | Licence             | Audit/claims                  | Catatan Komunitas                    |
|-------------------|----------------------|-------------------------|---------------------|-------------------------------|--------------------------------------|
| snarkjs           | iden3/snarkjs        | Rilis aktif; dependent luas | GPL-3.0          | —                             | Trusted setup tools; JS/WASM[^4]     |
| @zk-kit           | PSE/zk-kit           | Rilis berkala; benchmark | MIT                | Beberapa paket ter-audit       | Monorepo TS; Discord PSE[^7][^8]     |
| circom            | iden3/circom         | Rilis stabil; aktif      | GPL-3.0            | Alat analisis (circomspect)    | Ekosistem alat luas[^5][^6]          |
| gnark             | ConsenSys/gnark      | Rilis; dokumentasi kuat  | Apache-2.0         | —                             | Playground; tooling Go[^13]          |
| solana-zk-sdk     | docs.rs/Crates.io    | v4.0.0 (docs.rs coverage) | Apache-2.0       | Vended contract (program resmi) | Support resmi Solana[^2][^3]         |
| Light Protocol    | lightprotocol.com    | Audit di repo; dokumentasi | —               | Audit terbuka                  | Discord/Twitter komunitas[^9][^12]   |
| arkworks          | arkworks-rs/snark    | Repositori aktif         | Apache-2.0/MIT     | Prototipe akademik             | Riset; bukan produksi[^16]           |

## 8. Kurva Belajar & Kerangka Implementasi

JS/TS-first. Alur yang direkomendasikan: desain sirkuit di circom → kompilasi ke R1CS/witness → generate/verify bukti menggunakan snarkjs di браузер/Node → verifikasi on-chain via program Rust yang memanfaatkan alt_bn128 pairing dan Poseidon hash. Jalur ini ideal untuk MVP, klient-side privasi, dan siklus iterasi cepat. Tantangan: membangun verifier Rust yang sesuai kurva dan ukuran bukti, memahami trusted setup, serta disiplin constraint generation.[^6][^4][^11]

Rust-first. Alur produksi: verifikasi on-chain di Rust memanfaatkan syscalls Solana (alt_bn128/Poseidon) dan program resmi (zk-token-proof), serta ZK Compression (Light Protocol) untuk menurunkan biaya state. Jalur ini meminimalkan biaya transaksi on-chain dan membawa state ke ledger space yang lebih murah dengan bukti validitas ringkas. Tantangan: kompleksitas Rust, desain state dengan struktur pohon (IMT/LeanIMT/SMT), dan kesiapan infrastruktur (Photon/Foresters).[^2][^9][^11][^14]

Tabel 7. Peran Toolchain: JS/TS vs Rust

| Aspek                 | JS/TS (circom/snarkjs/@zk-kit)                          | Rust (solana-zk-sdk/Light)                               |
|-----------------------|----------------------------------------------------------|----------------------------------------------------------|
| Sirkuit               | circom untuk desain dan R1CS                             | Rust verifier/sirkuit pembacaan artefak                  |
| Witness               | Kompilasi ke WASM; kalkulasi di браузер/Node            | Tidak umum; witness dihasilkan off-chain                 |
| Proof (generate/verify) | snarkjs untuk generate/verify off-chain               | On-chain verify via syscalls (alt_bn128, Poseidon)       |
| Verifikasi on-chain   | Via Rust program dan syscalls                            | Menggunakan alt_bn128 pairing, Poseidon hash, kompresi   |
| Struktur data (Merkle) | @zk-kit (IMT/LeanIMT/SMT) untuk off-chain/manajemen     | SMT/IMT on-chain di Rust verifier                        |
| Skalabilitas/storage  | Off-chain optimisasi; bukti dikirim ke on-chain         | Light Protocol ZK Compression, ledger space              |

Rekomendasi praktik: gunakan Poseidon untuk hash di sirkuit; pilih kurva kompatibel dengan syscalls (alt_bn128) untuk verifikasi on-chain; gunakan @zk-kit LeanIMT/SMT sesuai pola akses data untuk meminimalkan biaya verifikasi. Pastikan trusted setup kredibel untuk Groth16 dan lakukan analisis statis pada sirkuit (circomspect/Ecne).[^11][^8][^14]

## 9. Analisis Komparatif & Rekomendasi

Perbandingan inti:
- circom unggul dalam definisi sirkuit dan ekosistem alat; snarkjs memberikan mesin proving/verifying yang matang untuk JS/TS; @zk-kit menyediakan primitif ZK siap pakai yang mempercepat implementasi struktur data.
- Pada produksi Solana, verifikasi on-chain efisien membutuhkan Rust verifier dan syscalls alt_bn128/Poseidon; Light Protocol menambah jalur skala state melalui ZK Compression.
- Performa prover native lebih tinggi daripada snarkjs untuk beban berat; namun trade-off integrasi native dan portabilitas браузер/mobile perlu dikelola.
- Hash ZK-friendly (Poseidon/Poseidon2) memberi pengurangan biaya verifikasi on-chain; Solana berpotensi mendapat manfaat serupa melalui Poseidon syscall dan verifier Groth16 alt_bn128.

Tabel 8. Perbandingan Library ZK untuk Solana

| Library            | Bahasa         | Use-case Utama                      | Kompatibilitas Solana        | Docs/Community                 | Lisensi           | Learning Curve       |
|--------------------|----------------|-------------------------------------|------------------------------|--------------------------------|-------------------|----------------------|
| circom             | Rust/DSL       | Sirkuit, R1CS, template, witness    | Off-circuit (WASM), verifier on-chain via Rust | Docs lengkap; toolset luas       | GPL-3.0           | Moderat (DSL, R1CS)  |
| snarkjs            | JS/WASM        | Trusted setup, proof generate/verify | Off-chain; on-chain via Rust | Aktif; dependent luas; rilis rutin | GPL-3.0           | Rendah–menengah (JS) |
| @zk-kit            | TS/JS          | Prim kriptografis (Poseidon, IMT/SMT) | Off-chain; data structures on-chain via Rust | Monorepo terstruktur; benchmark | MIT               | Rendah (TS)          |
| solana-zk-sdk      | Rust (resmi)   | Verifier on-chain, ElGamal proof     | Syscalls, zk-token-proof     | Docs.rs coverage; vended       | Apache-2.0        | Menengah–tinggi     |
| Light Protocol     | Rust           | ZK Compression, verifier (Groth16)   | alt_bn128/Poseidon; kompresi | Audit repo; docs protokol      | —                 | Menengah–tinggi     |
| gnark              | Go             | Sirkuit server-side; backend proof   | Proof off-chain; verify via Solana | Docs kuat; playground         | Apache-2.0        | Moderat (Go)         |
| plonky2            | Rust           | PLONK+FRI; recursion                 | On-chain via syscalls (indirect) | Docs modul; crates aktif       | MIT/Apache-2.0    | Tinggi (Rust+ZK)     |
| arkworks           | Rust           | Fondasi riset SNARK                  | Back-end riset; bukan produksi | Akademik; bukan production-ready | Apache/MIT        | Tinggi (akademik)    |

Rekomendasi pragmatis:
- MVP JS/TS-first (klien/браузер): circom + snarkjs + @zk-kit; verifikasi on-chain via solana-zk-sdk/Light verifier. Fokus pada iterasi cepat, bukti di klien, verifikasi ringan on-chain.[^4][^7][^2][^14]
- Produksi on-chain biaya rendah: solana-zk-sdk untuk verifikasi dan privacy SPL; Light Protocol untuk ZK Compression; rancang sirkuit dengan Poseidon dan verifikasi pairing alt_bn128.[^2][^9][^11][^14]
- Riset/skema khusus: gnark (backend Go) dan plonky2 (rekursi); arkworks untuk eksperimen akademik; evaluasi kematangan/audit sebelum produksi.[^13][^17][^16]

## 10. Checklist Implementasi & Risiko

Checklist implementasi:
- Pastikan syscall tersedia dan kompatibel (alt_bn128 pairing, Poseidon hash, g1/g2 compression). Verifikasi versi Solana dan aktivasi fitur ZK di target network.[^11]
- Selaraskan kurva: bn128/bls12-381 untuk bukti off-chain, alt_bn128 untuk verifikasi on-chain; hindari mismatch kurva.
- Siapkan trusted setup kredibel untuk Groth16/PLONK; gunakan tooling multi-pihak dan finalisasi yang kuat.[^4][^6]
- Audit dan review alat: gunakan circomspect/Ecne; rujuk audit Light Protocol untuk produksi; verifikasi status audit paket @zk-kit yang digunakan.[^6][^12][^8]
- Perhatikan lisensi: GPL-3.0 (snarkjs/circom) vs MIT (@zk-kit). Evaluasi implikasi distribusi dan komersialisasi.[^4][^5][^7]

Manajemen risiko:
- Keamanan & audit: lakukan fuzzing, analisis statis/dinamis, dan review program verifikasi bukti.
- Trust assumptions: trusted setup, Foresters/Photon untuk ZK Compression; mitigasi melalui prosedur operasional dan monitoring backlog nullifier.
- Keandalan infrastruktur: definisikan SLO/SLA untuk node prover/verifier dan RPC.
- Kepatuhan: audit selektif via kunci auditor (Confidential Transfer), kebijakan akses, dan transparansi operasional.

## 11. Lampiran

Tabel 9. Daftar URL Sumber Utama

| Sumber                            | Deskripsi Singkat                                                |
|-----------------------------------|------------------------------------------------------------------|
| Light Protocol                    | ZK Compression untuk skalabilitas Solana                         |
| solana_zk-sdk (docs.rs)           | Crate Rust resmi untuk bukti ZK dan ElGamal native               |
| snarkjs (GitHub)                  | Implementasi JS/WASM zkSNARK/PLONK/FFLONK                        |
| zk-kit (GitHub)                   | Monorepo JS/TS primitif ZK dan benchmark                         |
| Circom 2 Documentation            | Dokumentasi Circom 2                                             |
| iden3/circom (GitHub)             | Compiler sirkuit zkSnark                                         |
| gnark Documentation               | Library Go; API tinggi untuk sirkuit dan playground              |
| arkworks-rs/snark (GitHub)        | Antarmuka generik SNARK; bersifat prototipe akademik             |
| plonky2 — Docs.rs                 | Implementasi Rust PLONK+FRI dengan modul recursion               |
| tour-de-zk (GitHub)               | Katalog ZK di Solana (syscalls, program, proyek)                 |
| Solana zk-token-proof Docs        | Program verifikasi bukti ZK resmi                                |
| Light Protocol — Audits (GitHub)  | Audit keamanan Light Protocol                                    |
| Elusiv GitHub                     | Implementasi privacy transfer dan verifier V1                    |
| Light Groth16 Verifier (GitHub)   | Verifier Groth16 di Solana menggunakan alt_bn128                 |
| light-poseidon (Crates.io)        | Poseidon untuk Rust di ekosistem Light                            |

## Referensi

[^1]: Light Protocol. “LIGHT SCALES SOLANA WITH ZK COMPRESSION.” https://lightprotocol.com/
[^2]: solana_zk_sdk — Rust (Docs.rs). “Crate solana_zk_sdk v4.0.0.” https://docs.rs/solana-zk-sdk
[^3]: solana-zk-sdk (Crates.io). “Crate: solana-zk-sdk.” https://crates.io/crates/solana-zk-sdk
[^4]: iden3/snarkjs (GitHub). “zkSNARK implementation in JavaScript & WASM.” https://github.com/iden3/snarkjs
[^5]: Circom 2 Documentation. “Dokumentasi Circom 2.” https://docs.circom.io/
[^6]: iden3/circom (GitHub). “zkSnark circuit compiler.” https://github.com/iden3/circom
[^7]: zk-kit/zk-kit (GitHub). “Monorepo pustaka ZK JS/TS.” https://github.com/privacy-scaling-explorations/zk-kit
[^8]: ZK-Kit — PSE. “Proyek ZK-Kit.” https://pse.dev/projects/zk-kit
[^9]: ZK Compression: Introduction. “ZK Compression: Introduction.” https://www.zkcompression.com/
[^10]: Helius Blog. “Zero-Knowledge Proofs: Its Applications on Solana.” https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana
[^11]: anagrambuild/tour-de-zk (GitHub). “Daftar proyek ZK di Solana.” https://github.com/anagrambuild/tour-de-zk
[^12]: Light Protocol — Audits (GitHub). “Audit Keamanan Light Protocol.” https://github.com/Lightprotocol/light-protocol/tree/main/audits
[^13]: gnark Documentation. “Welcome to gnark docs.” https://docs.gnark.consensys.io/
[^14]: Light Protocol Groth16 Verifier (GitHub). “Groth16 verifier di Solana.” https://github.com/Lightprotocol/groth16-solana
[^15]: light-poseidon (Crates.io). “Poseidon untuk Rust.” https://crates.io/crates/light-poseidon
[^16]: arkworks-rs/snark (GitHub). “Interfaces untuk Relations & SNARKs.” https://github.com/arkworks-rs/snark
[^17]: plonky2 — Docs.rs. “Plonky2 crate documentation.” https://docs.rs/plonky2
[^18]: solana-program/zk-elgamal-proof (GitHub). “Program ZK ElGamal Proof.” https://github.com/solana-program/zk-elgamal-proof
[^19]: elusiv-privacy/elusiv (GitHub). “Kontrak Verifikasi V1.” https://github.com/elusiv-privacy/elusiv/blob/master/elusiv/src/instruction.rs
[^20]: zkREPL. “Playground sirkuit circom.” https://zkrepl.dev
[^21]: Hardhat-zkit (GitHub). “Lingkungan TS untuk pengembangan circom.” https://github.com/dl-solarity/hardhat-zkit
[^22]: Comparison of Circom Provers - Mopro. “Perbandingan prover untuk Circom.” https://zkmopro.org/blog/circom-comparison/
[^23]: zkSNARKs Libraries for Blockchains: a Comparative Study. “Perbandingan Circom vs ZoKrates.” https://ceur-ws.org/Vol-3791/paper7.pdf
[^24]: Benchmarking ZK-Friendly Hash Functions and SNARK Proving Systems. “Benchmark hash ZK-friendly dan biaya on-chain.” https://arxiv.org/abs/2409.01976
[^25]: Zero-Knowledge Proof Frameworks: A Systematic Survey. “Survei framework ZKP.” https://arxiv.org/pdf/2502.07063
[^26]: Does Solana support any popular zkSNARK libraries? (StackExchange). “Diskusi dukungan library ZK di Solana.” https://solana.stackexchange.com/questions/3264/does-solana-support-any-popular-zksnark-libraries

---

Catatan akhir tentang information gaps: laporan ini meminimalkan asumsi di luar sumber publik. Beberapa angka performa spesifik mainnet/devnet untuk snarkjs/@zk-kit dan Poseidon2 pada Solana, serta status audit menyeluruh untuk seluruh paket @zk-kit, memerlukan verifikasi tambahan dari dokumentasi resmi dan hasil uji produksi yang akan datang.