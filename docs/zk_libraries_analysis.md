# Analisis Library Zero-Knowledge untuk Solana/JavaScript/TypeScript: Kompatibilitas, Komunitas, dan Kurva Belajar

## Ringkasan Eksekutif

Ekosistem zero-knowledge (ZK) di Solana bergerak cepat menuju tahapier yang lebih matang, ditandai oleh ketersediaan alat inti di runtime (syscall) serta pertumbuhan lapisan aplikasi seperti ZK Compression. Tiga pilar pendukung utama revolusi ini adalah: (i) syscall ZK di Solana Virtual Machine (SVM) untuk operasi kurva dan hash yang penting secara on-chain, (ii) program resmi zk-token-sdk untuk verifikasi dan privacy SPL, dan (iii) protokol Layer-2 seperti Light Protocol yang menawarkan ZK Compression untuk menurunkan biaya penyimpanan state secara dramatis[^11][^1][^12][^14][^9].

Pada sisi tooling JavaScript/TypeScript (JS/TS), empat library yang paling relevan adalah:
- circom: compiler sirkuit R1CS dengan ekosistem komprehensif (template, tester, analisis statis) dan alur bukti yang matang untuk Groth16/PLONK[^5][^6].
- snarkjs: engine JS/WASM untuk penyiapan terpercaya (trusted setup) multi-pihak dan menghasilkan/memverifikasi bukti Groth16/PLONK/FFLONK di Node.js dan browser[^4].
- @zk-kit: monorepo primitif kriptografis JS/TS yang siap pakai (Poseidon, EdDSA, Incremental Merkle Tree, LeanIMT, SparseMT) dan benchmark untuk berbagai ukuran pohon Merkle[^7][^8].
- solana-zk-sdk (Rust): crate resmi untuk membuat/memverifikasi bukti pada data terenkripsi dan menyediakan program bukti ZK ElGamal native[^2][^3][^18].

Secara ringkas:
- JS/TS-first untuk rapid prototyping: circom + snarkjs + @zk-kit. Workflow ini memungkinkan pembuatan sirkuit, perhitungan witness, dan verifikasi bukti cepat di браузер/Node, cocok untuk MVP.
- Rust-first untuk on-chain verifier dan integrasi mendalam: solana-zk-sdk dan ekosistem Light Protocol (gro16 verifier, Poseidon, SMT), memanfaatkan syscall alt_bn128, Poseidon, dan kompresi g1/g2 untuk on-chain verification yang efisien[^11][^12][^14][^15][^17].

Risiko utama meliputi: aspek keamanan dan audit (snarkjs berlicense GPL-3.0, klaim non-produksi pada arkworks), pemilihan kurva (bn128/bls12-381 vs alt_bn128), serta performa/ukuran bukti on-chain. Rekomendasi tinggi-level: gunakan JS/TS untuk iterasi cepat (bukti off-chain, verifikasi ringan), pindahkan verifikasi on-chain ke Rust dengan syscalls yang sesuai, dan pilih protokol aplikasi seperti Light Protocol bila tujuan skalabilitas/biaya storage menjadi prioritas[^4][^7][^9][^11].

## Metodologi & Kriteria Evaluasi

Analisis ini berfokus pada:
- Kompatibilitas dengan Solana: ketersediaan syscall, verifikator on-chain, dan dukungan kurva yang relevan.
- Community support & dokumentasi: kelengkapan panduan, aktivitas repo, dan contoh production-grade.
- Learning curve: kompleksitas alur dari sirkuit ke bukti hingga verifikasi on-chain, termasuk tooling JS/TS vs Rust.

Sumber informasi bersifat publik dan terverifikasi: dokumentasi resmi, GitHub, docs.rs, dan ringkasan proyek di “tour-de-zk” yang mengkatalog fasilitas ZK di Solana[^11]. Keterbatasan data meliputi ketiadaan benchmarkperf komprehensif on-chain di Solana untuk setiap library, tidak adanya metrik terstandardisasi untuk “community support” lintas library (mis. SLA resolusi issues), panduan step-by-step production-grade untuk integrasi snarkjs→Solana di luar Beispiel第三方 yang terbatas, status produksi/audit mendalam untuk beberapa paket @zk-kit yang belum seluruhnya teraudit, serta detail API program zk-token-sdk di luar kemampuan umum yang disebutkan di docs.rs[^8][^2][^11].

## Fondasi ZK di Solana: Syscall, Program, dan Kurva

Syscall ZK di SVM adalah fondasi utama untuk verifikasi on-chain yang efisien. Tiga syscall krusial:
- alt_bn128: operasi kurva bn254/bn256 yang kompatibel dengan EVM, mencakup penjumlahan titik, scalar multiplication, dan pairing; esensial untuk Groth16 verifier dan sistem lain yang mengandalkan kurva bn128[^11].
- Poseidon hash: fungsi hash yang cocok untuk bukti ZK karena biaya on-chain rendah dan struktur yang amigable untuk sirkuit; sejak aktivasi di v1.17, Poseidon syscall tersedia untuk proses hash di program Solana[^11].
- curve25519/ristretto: operasi kurva untuk kebutuhan kriptografis alternatif; tersedia sebagai syscall untuk menyelesaikan operasi group/curve di SVM[^11].

Untuk mengurangi biaya verifikasi Groth16 on-chain, Solana menyediakan alt_bn128 g1 & g2 compression syscall yang memampatkan representasi bukti sehingga ukuran payload yang dikirim ke program berkurang. Mcchanically, ini membantu menekan biaya transaksi dan I/O akun pada verifikasi bukti Groth16[^11]. Pada sisi program resmi, zk-token-sdk menyediakan fasilitas pembuatan dan verifikasi bukti ZK serta program bukti ZK ElGamal native, yang menjadi tulang punggung privacy SPL dan fitur-fitur lanjutan (contoh stealth, token privacy) di ekosistem Solana[^2][^11].

Di lapisan aplikasi, Light Protocol menawarkan ZK Compression yang memindahkan state dari account space yang mahal ke ledger space yang lebih murah, dengan integritas yang dijamin oleh validity proofs. Dengan pendekatan ini, biaya storage menurun drastis sementara kinerja dan jaminan keamanan L1 tetap terjaga[^9][^10][^11]. Kombinasi syscall, program resmi, dan protokol aplikasi ini membentuk fondasi praktis bagi developer JS/TS dan Rust untuk mengintegrasikan ZK secara mendalam di Solana.

Untuk mengilustrasikan fungsi dan posisi masing-masing fasilitas, Tabel 1 merangkum syscall ZK utama dan program terkait.

Tabel 1. Ringkasan Syscall ZK di Solana dan Fungsi-nya

| Nama Syscall/Program               | Fungsi Kriptografis Utama                         | Aktivasi/Versi      | Peran On-Chain                                                                 |
|------------------------------------|----------------------------------------------------|---------------------|--------------------------------------------------------------------------------|
| alt_bn128                          | Operasi kurva bn254/bn256 (add, scalar mult, pairing) | v1.17               | Verifikasi Groth16/PLONK yang membutuhkan pairing dan operasi kurva bn128[^11] |
| Poseidon hash syscall              | Hash Poseidon untuk sirkuit ZK                    | v1.17               | Komputasi hash berbiaya rendah dalam program, cocok untuk SMT/IMT[^11]         |
| curve25519/ristretto syscall       | Operasi kurva Edwards/Ristretto                   | v1.17               | Alternatif kurva untuk kebutuhan kriptografis khusus[^11]                      |
| alt_bn128 g1/g2 compression        | Kompresi representasi bukti Groth16               | v1.17               | Memperkecil ukuran bukti Groth16 dikirimkan on-chain[^11]                      |
| zk-token-proof (program resmi)     | Verifikasi bukti ZK dan privacy SPL               | —                   | Program vended Solana untuk ZK, termasuk ElGamal proof[^2][^11]                 |
| ZK Compression (Light Protocol)    | Validitas state terkompresi di ledger             | — (protokol aplikasi) | Skalabilitas storage dengan ZK validity proofs, integrasi RPC[^9][^10][^11]    |

Signifikansinya: tanpa syscall ini, verifikasi ZK on-chain akan jauh lebih mahal atau bahkan tidak praktis. alt_bn128 dan Poseidon khususnya menurunkan biaya secara substansial, sedangkan kompresi bukti Groth16 mengurangi ukuran payload untuk transaksi. Program resmi zk-token-proof memastikan integrasi ZK yang sesuai standar, sementara Light Protocol menunjukkan jalur praktis untuk skalabilitas state.

## Profil Library Inti (JS/TS dan Rust)

### circom (Compiler Sirkuit, Rust)

circom adalah compiler bahasa khusus domain untuk mendefinisikan sirkuit aritmatika yang menghasilkan representasi R1CS serta program (WASM/C++/Rust) untuk menghitung witness. Ekosistemnya meliputi circomlib (ratusan template), circomlibjs (perhitungan witness di JS), circom_tester (pengujian), serta alat analisis statis seperti circomspect dan Ecne. Trustet setup untuk Groth16/PLONK dapat dilakukan dengan toolchain lain seperti snarkjs; output circom (R1CS, witness calculator) dapat diploy dalam alur bukti yang interoperable. Untuk Solana, circom bersinar dalam pembuatan sirkuit dan perhitungan witness off-chain (WASM di браузер/Node), sedangkan verifikasi on-chain bergantung pada syscalls alt_bn128 dan Poseidon serta program verifier Rust (mis. Light Groth16 verifier). Learning curve moderat: syntax khusus domain dan disiplin constraint generation membutuhkan练习, tetapi dokumentasi dan ekosistem alat memudahkan adjoint pengembangan[^5][^6][^11][^14].

### snarkjs (JS/WASM, Groth16/PLONK/FFLONK)

snarkjs menyediakan implementasi zkSNARK/PLONK/FFLONK di JS/WASM yang berjalan di Node.js dan браузер. Ia mendukung ceremony powers of tau universal dan fase 2 spesifik sirkuit, serta berisi alat untuk memverifikasi kontribusi, finalisasi dengan random beacon, dan ekspor verification key sebagai JSON. Berbahaya on-chain, snarkjs cenderung digunakan untuk proses off-chain (pembuatan dan verifikasi witness/bukti di klien), sementara verifikasi on-chain di Solana dilakukan melalui program Rust dan syscalls yang sesuai. Cakupan kurva mencakup bn128 dan bls12-381; untuk Solana, jalur verifikasi praktis memanfaatkan alt_bn128 pairing di SVM. Learning curve rendah-untuk-menengah bagi JS/TS developers, dengan dokumentasi memadai dan contoh umum; namun, untuk produksi di Solana, tetap perlu membangun verifikator Rust dan memastikan kesesuaian kurva serta ukuran bukti. Metric komunitas solid dengan rilis yang aktif dan dependent yang luas[^4][^11].

### @zk-kit (Monorepo JS/TS)

@zk-kit menyatukan primitif ZK yang reusable dalam JS/TS, meliputi Poseidon, EdDSA, BabyJubJub, Incremental Merkle Tree (IMT), LeanIMT, dan Sparse Merkle Tree (SMT), beserta benchmark yang membantu memilih struktur pohon yang tepat berdasarkan ukuran set dan operasi yang dominan. Paket-paket tertentu telah ter-audit (mis. LeanIMT, IMT, EdDSA Poseidon), namun tidak semuanya memiliki audit formal. Karena berfokus pada primitif而非 proving system, integrasi ke Solana typically happens via Rust verifiers yang memanfaatkan output estructuras data @zk-kit untuk verifikasi SMT/IMT on-chain. Learning curve rendah bagi JS/TS engineers berkat TypeScript, dokumentasi yang baik, dan benchmark yang transparan[^7][^8].

Untuk memberikan gambaran praktis kinerja struktur pohon, Tabel 2 merangkum benchmark IMT vs LeanIMT vs SparseMT pada 8, 128, dan 1024 leaf.

Tabel 2. Benchmark Merkle Tree (@zk-kit)

| Ukuran Leaf | Operas i         | Tercepat     | Terlambat     |
|-------------|-------------------|--------------|---------------|
| 8           | Insert            | IMT          | LeanIMT       |
| 8           | Delete            | IMT ≈ SparseMT | IMT ≈ SparseMT |
| 8           | Update            | LeanIMT      | IMT           |
| 8           | Generate Proof    | LeanIMT      | SparseMT      |
| 8           | Verify Proof      | IMT          | SparseMT      |
| 128         | Insert            | IMT          | LeanIMT       |
| 128         | Delete            | SparseMT     | IMT           |
| 128         | Update            | LeanIMT      | IMT           |
| 128         | Generate Proof    | LeanIMT      | IMT           |
| 128         | Verify Proof      | SparseMT     | IMT           |
| 1024        | Insert            | SparseMT     | LeanIMT       |
| 1024        | Delete            | SparseMT     | IMT           |
| 1024        | Update            | LeanIMT      | IMT           |
| 1024        | Generate Proof    | LeanIMT      | IMT           |
| 1024        | Verify Proof      | SparseMT     | IMT           |

Inti takeaway: LeanIMT unggul dalam pembangkitan bukti dan pembaruan dengan profil memori lebih hemat, sementara IMT memimpin untuk operasi insert dan verifikasi bukti pada ukuran kecil-sedang. SparseMT menunjukkan keunggulan pada set besar dan operasi verify/delete. Pemilihan struktur harus mempertimbangkan ukuran state dan pola transaksi aplikasi[^8][^7].

### solana-zk-sdk (Rust, Resmi)

solana-zk-sdk adalah crate Rust resmi yang menyediakan alat untuk membuat dan memverifikasi bukti ZK pada data terenkripsi, serta modul terkait enkripsi dan program bukti ZK ElGamal native. Integrasi alami dengan program Solana dan syscalls ZK memungkinkan verifikasi on-chain yang efisien. Bahasa Rust dan tooling program Solana menjadikan library ini pilihan tepat untuk membangun verifier on-chain, aggregator bukti, dan privacy features di SPL. Learning curve menengah-untuk-tinggi karena требования Rust dan понимание runtime Solana, namun dokumentasi dan status “vended contract” memberikan confidence yang tinggi bagi produksi[^2][^3][^18].

## Library Pendukung & Alternatif (Rust/Go)

### arkworks (Rust, Prototipe Akademik)

arkworks menyediakan antarmuka generik untuk relations (R1CS) dan SNARKs (Groth16, GM17, Marlin), berguna sebagai fondasi untuk membangun proving system di Rust. Namun, repositori utamanya menekankan bahwa kode adalah prototipe akademik dan tidak produksi-ready. Di Solana, arkworks bisa dipakai sebagai backstage untuk sirkuit Rust yang dikompilasi ke verifier on-chain, meski kompleksitas dan kurva belajar tinggi serta ketiadaan klaim produksi membatasi adopsi untuk aplikasi nyata tanpa effort engineering tambahan[^16].

### gnark (Go, Produktif)

gnark adalah library zk-SNARK cepat dengan API tingkat tinggi untuk merancang sirkuit, lengkap dengan tooling debugging, profiling, dan playground di браузер. Licence Apache-2.0 dan aktivitas komunitas yang baik. Di konteks Solana, gnark relevan bila tooling/komputasi berada di sisi server (Go) untuk menghasilkan artefak bukti yang kemudian diverifikasi on-chain melalui program Solana menggunakan syscalls ZK. Learning curve moderat untuk tim Go, dokumentasi kuat memfasilitasi onboarding[^13].

### plonky2 (Rust, PLONK+FRI)

plonky2 mengombinasikan teknik PLONK dan FRI dalam implementasi Rust dengan modul recursion, hash in-circuit, dan Merkle verification. Cocok untuk skenario yang membutuhkan verifikasi rekursif dan bukti yang efisien pada struktur besar. Pada Solana, plonky2 berpotensi digunakan sebagai proving system alternatif; verifikasi on-chain tetap memerlukan pemetaan ke kurva dan syscalls yang tersedia (alt_bn128) dan desain payload yang efisien. Dokumentasi modul yang kaya memberikan ruang eksplorasi bagi engineer Rust[^17].

## Kompatibilitas & Integrasi dengan Solana

Syscall alt_bn128, Poseidon, dan curve25519/ristretto memungkinkan komputasi kriptografis on-chain berbiaya rendah. Dengan alt_bn128 g1/g2 compression, ukuran bukti Groth16 dapat dikurangi untuk transmission on-chain. Program resmi zk-token-proof melengkapi abilities verifikasi bukti dan privacy SPL. Light Protocol menyediakan ZK Compression sebagai protokol aplikasi, sementara Elusiv menawarkan privacy transfer SPL danпример verifikasi V1. Untuk JS/TS, integrasi umum dilakukan melalui proses off-chain (perhitungan witness, generasi bukti) menggunakan circom/snarkjs, dan verifikasi on-chain via Rust verifier yang memanfaatkan syscalls dan program resmi[^11][^2][^14][^19][^9].

Untuk menyatukan gambaran, Tabel 3 memetakan library terhadap syscall/program.

Tabel 3. Peta Kompatibilitas Library ↔ Syscall/Program Solana

| Library/Stack           | alt_bn128 | Poseidon | Ristretto/Edwards | g1/g2 Compression | zk-token-proof | Light Protocol |
|-------------------------|-----------|----------|-------------------|-------------------|----------------|----------------|
| circom (R1CS)           | Indirect (via verifier Rust) | Indirect (via Rust verifier) | Indirect | Indirect | Indirect | Indirect |
| snarkjs (JS/WASM)       | Indirect (off-chain proof; on-chain verification via Rust) | Indirect | Indirect | Indirect | Indirect | Indirect |
| @zk-kit (JS/TS)         | Indirect (primitif data; Rust verifier) | Indirect (hashes via Rust) | Indirect | Indirect | Indirect | Indirect |
| solana-zk-sdk (Rust)    | Yes       | Yes      | Maybe             | Yes               | Yes            | —              |
| Light Protocol (Rust)   | Yes (Groth16 verifier) | Yes (Poseidon) | —              | Yes               | —              | Yes            |
| Elusiv (Rust/TS?)       | Via verifier program | Via verifier program | —              | —                 | Yes            | —              |

Interpretasi: library JS/TS menghasilkan artefak sirkuit/bukti off-chain; verifikasi on-chain Solana mengandalkan Rust (solana-zk-sdk, Light verifiers, program resmi). @zk-kit berguna menyusun struktur data (IMT/LeanIMT/SMT) yang diverifikasi on-chain oleh Rust.gnark dan plonky2 bisa menghasilkan artefak bukti di backend (Go/Rust), dengan verifikasi pada program Solana memanfaatkan syscalls ZK[^11][^2][^14][^19][^9].

## Dukungan Komunitas & Dokumentasi

- snarkjs menunjukkan aktivitas terukur di GitHub, dengan rilis aktif, dukungan kurva bn128/bls12-381, dan tooling trusted setup multi-pihak. Dokumentasi memadai untuk JS/TS developer[^4].
- @zk-kit memiliki dokumentasi TS yang kuat, benchmark publik, dan beberapa paket ter-audit; posisinya sebagai monorepo primitif memudahkan integrasi di stack JS/TS[^7][^8].
- circom menyediakan dokumentasi lengkap yang mencakup bahasa, ekosistem perpustakaan, dan alat pengujian/analisis; repositori aggiornato dengan rilis stabil dan komunitas akademis/profesional[^5][^6].
- gnark menunjukkan dokumentasi berorientasi produksi dan playground, mendukung onboarding cepat untuk engineer Go[^13].
- solana-zk-sdk berstatus resmi; docs.rs mengindikasikan coverage dokumentasi yang baik dan lisensi Apache-2.0. позиционирование sebagai crate resmi menambah kuatnya dukungan komunitas Solana[^2].
- Light Protocol memiliki dokumentasi protokol yang jelas dan audit tersedia di repo; protokol ini membangun di atas syscalls Solana untuk mencapai skalabilitas[^9][^12].
- arkworks khususnya menekankan sifat prototipe; cocok untuk riset, namun tidak untuk produksi tanpa effort tambahan[^16].

Tabel 4. Metrik Komunitas & Dokumentasi

| Library/Stack     | Repo (contoh)        | Aktivitas/rilis         | Licence             | Audit/claims                  | Catatan Komunitas                    |
|-------------------|----------------------|-------------------------|---------------------|-------------------------------|--------------------------------------|
| snarkjs           | iden3/snarkjs        | Rilis aktif; dependent luas | GPL-3.0          | —                             | Trusted setup tools; JS/WASM[^4]     |
| @zk-kit           | PSE/zk-kit           | Rilis berkala; benchmark | MIT                | Beberapa paket ter-audit       | Monorepo TS; Discord PSE[^7][^8]     |
| circom            | iden3/circom         | Rilis stabil; aktif      | GPL-3.0            | Alat analisis (circomspect)    | Ekosistem alat luas[^5][^6]          |
| gnark             | ConsenSys/gnark      | Rilis; dokumentasi kuat  | Apache-2.0         | —                             | Playground; tooling Go[^13]          |
| solana-zk-sdk     | docs.rs/Crates.io    | v4.0.0 (docs.rs coverage) | Apache-2.0       | Vended contract (program resmi) | Support resmi Solana[^2][^3]         |
| Light Protocol    | lightprotocol.com    | Audit di repo; dokumentasi | —               | Audit terbuka                  | Discord/Twitter komunitas[^9][^12]   |
| arkworks          | arkworks-rs/snark    | Repositori aktif         | Apache-2.0/MIT     | Prototipe akademik             | Riset; bukan produksi[^16]           |

## Kurva Belajar & Kerangka Kerja Implementasi

- JS/TS-first (circom + snarkjs + @zk-kit). Alur: desain sirkuit → kompilasi circom → witness (WASM) → generate/verify bukti (snarkjs) di браузер/Node → verifikasi on-chain via program Rust yang memanfaatkan alt_bn128/Poseidon dan program zk-token-proof. Cocok untuk MVP, aplikasi klien приватnosti, dan prototipe verifikasi cepat. Tantangan utama: membangun verifier Rust yang sesuai kurva dan ukuran bukti, serta memahami constraint generation dan trusted setup[^6][^4][^11].
- Rust-first (solana-zk-sdk, Light Protocol). Alur: bangun verifier on-chain dengan syscalls alt_bn128/Poseidon → rancang aplikasi ZK (mis. ZK Compression) yang membawa state ke ledger space → verifikasi program terverifikasi (vended). Cocok untuk produksi dengan perhatian pada biaya transaksi, kinerja on-chain, dan audit protokol. Tantangan: kompleksitas Rust, syscall compatibility, dan desain state yang memanfaatkan struktur pohon (IMT/LeanIMT/SMT) secara efisien[^2][^9][^11][^14].

Untuk memperjelas lintas permukaan bahasa dan integrasi, Tabel 5 merangkum peran toolchain JS/TS vs Rust.

Tabel 5. Peran Toolchain: JS/TS vs Rust

| Aspek                 | JS/TS (circom/snarkjs/@zk-kit)                          | Rust (solana-zk-sdk/Light)                               |
|-----------------------|----------------------------------------------------------|----------------------------------------------------------|
| Sirkuit               | circom untuk desain dan R1CS                             | Rust verifier/sirkuit pembacaan artefak                  |
| Witness               | Kompilasi ke WASM; kalkulasi di браузер/Node            | Tidak umum; witness dihasilkan off-chain                 |
| Proof (generate/verify) | snarkjs untuk generate/verify off-chain               | On-chain verify via syscalls (alt_bn128, Poseidon)       |
| Verifikasi on-chain   | Via Rust program dan syscalls                            | Menggunakan alt_bn128 pairing, Poseidon hash, kompresi   |
| Struktur data (Merkle) | @zk-kit (IMT/LeanIMT/SMT) untuk off-chain/manajemen     | SMT/IMT on-chain di Rust verifier                        |
| Skalabilitas/storage  | Off-chain optimisasi; bukti dikirim ke on-chain         | Light Protocol ZK Compression, ledger space              |

Rekomendasi praktik: lakukan seed trusted setup yang kredibel untuk Groth16; pilih kurva kompatibel dengan syscalls (alt_bn128) untuk verifikasi on-chain; gunakan Poseidon untuk hash di sirkuit; dan gunakan @zk-kit LeanIMT/SMT sesuai pola akses data untuk meminimalkan biaya verifikasi[^11][^8][^14].

## Analisis Komparatif & Rekomendasi

Circom vs snarkjs: circom unggul dalam definição sirkuit dan ekosistem alat (template, tester, analisis), sementara snarkjs memberikanengine JS/WASM yang matang untuk membuktikan/memverifikasi dan melakukan ceremony trusted setup. Kombinasi keduanya merupakan standar de facto untuk alur JS/TS. @zk-kit melengkapi dengan primitif yang mempercepat implementasi struktur data ZK dan tanda tangan, terutama untuk aplikasi identitas dan privasi. solana-zk-sdk dan Light Protocol memastikan verifikasi on-chain yang efisien dan jalur skalabilitas produksi.

Tabel 6. Perbandingan Library ZK untuk Solana

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

Rekomendasi praktis:
- Aplikasi JS/TS-first: gunakan circom + snarkjs untuk iterasi cepat, @zk-kit untuk struktur data. Verifikasi on-chain via solana-zk-sdk atau Light verifier. Pendekatan ini ideal untuk produk dengan bukti di klien dan verifikasi ringan on-chain[^4][^7][^2][^14].
- Aplikasi Rust-first dan biaya on-chain rendah: pilih solana-zk-sdk untuk verifikasi dan privacy SPL, serta Light Protocol untuk ZK Compression bila storage cost mendominasi. Pastikan desain sirkuit menggunakan Poseidon dan pairing alt_bn128 untuk efisiensi[^2][^9][^11][^14].
- Riset atau specialized SNARK: gnark untuk backend Go dan plonky2 untuk recursion; arkworks untuk eksperimen akademik. Untuk produksi, evaluasi ulang kematangan dan audit sebelum adopsi[^13][^17][^16].

## Checklist Implementasi & Risiko

Checklist kunci:
- Memastikan syscall tersedia dan kompatibel (alt_bn128 pairing, Poseidon hash, kompresi g1/g2). Verifikasi versi Solana dan aktivasi fitur ZK di target network[^11].
- Menyelaraskan kurva: bn128/bls12-381 untuk bukti off-chain, alt_bn128 untuk verifikasi on-chain. Hindari mismatch kurva yang membuat verifier gagal.
- Menyiapkan trusted setup kredibel untuk Groth16/PLONK; gunakan tooling yang mendukung ceremony multi-pihak dan finalisasi yang kuat[^4][^6].
- Audit dan review alat: untuk circom, gunakan circomspect/Ecne untuk analisis statis; untuk protokol aplikasi (Light Protocol), rujuk audit publik; untuk paket @zk-kit, verifikasi status audit paket yang digunakan[^6][^12][^8].
- Aspek lisensi: snarkjs dan circom berlisensi GPL-3.0; pastikan kepatuhan lisensi pada distribusi dan produk komersil; alternatif dengan lisensi permissive (gnark, @zk-kit) dapat dipertimbangkan untuk komponen tertentu[^4][^5][^13][^7].

## Lampiran

Tabel 7. Daftar URL Sumber Utama

| Sumber                            | Deskripsi Singkat                                                |
|-----------------------------------|------------------------------------------------------------------|
| Light Protocol                    | ZK Compression untuk skalabilitas Solana                         |
| solana_zk-sdk (docs.rs)           | Crate Rust resmi untuk bukti ZK dan ElGamal native               |
| snarkjs (GitHub)                  | Implementasi JS/WASM zkSNARK/PLONK/FFLONK                        |
| zk-kit (GitHub)                   | Monorepo JS/TS primitif ZK dan benchmark                         |
| Circom 2 Documentation            | Dokumentasi bahasa, ekosistem, dan workflow                      |
| iden3/circom (GitHub)             | Compiler sirkuit Rust; output R1CS dan program witness           |
| gnark Docs                        | Library Go; API tinggi untuk sirkuit dan playground              |
| arkworks-rs/snark (GitHub)        | Antarmuka generik SNARK; bersifat prototipe akademik             |
| plonky2 (docs.rs)                 | Implementasi Rust PLONK+FRI dengan modul recursion               |
| tour-de-zk (GitHub)               | Katalog ZK di Solana (syscalls, program, proyek)                 |
| Solana zk-token-proof Docs        | Program verifikasi bukti ZK resmi                                |
| Light Protocol Audit              | Audit keamanan protokol                                           |
| Elusiv GitHub                     | Implementasi privacy transfer dan verifier V1                    |
| Light Groth16 Verifier (GitHub)   | Verifier Groth16 di Solana menggunakan alt_bn128                 |
| light-poseidon (crates.io)        | Poseidon untuk Rust di ekosistem Light                            |

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
[^22]: Circomspect (GitHub). “Static analyzer untuk circom.” https://github.com/trailofbits/circomspect
[^23]: Ecne (GitHub). “Static analyzer untuk verifikasi keamanan circom.” https://github.com/franklynwang/EcneProject