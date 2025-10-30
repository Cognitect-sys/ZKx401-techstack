# zk-SNARKs vs zk-STARKs untuk Implementasi di Solana: Perbandingan Mendalam Kinerja, Keamanan, dan Kemudahan Implementasi

## Ringkasan Eksekutif

Solana tengah mengalami pertumbuhan state yang eksponensial—lebih dari 500 juta akun, sekitar satu juta akun baru per hari, dan ukuran snapshot penuh sekitar 70 GB—yang mendorong kebutuhan akan primitive yang secara material menekan biaya state tanpa mengorbankan kinerja atau keamanan. ZK Compression menjawab tantangan ini dengan mengompresi state on-chain menggunakan validity proofs yang ringkas dan verifikasi on-chain yang efisien, memungkinkan penghematan biaya yang mencapai beberapa orde besaran untuk pembuatan akun dan pengelolaan state. Pada saat yang sama, fitur-fiturprivasi berbasis nol-pengetahuan (zero-knowledge, ZK) untuk token SPL也开始 diperluas, dengan program ZK Token Proof yang mendukung confidential transfers melalui skema enkripsi dan komitmen kriptografis.

Dalam konteks tersebut, pemilihan sistem bukti nol-pengetahuan—zk-SNARKs (Succinct Non-interactive Argument of Knowledge) atau zk-STARKs (Scalable Transparent Argument of Knowledge)—menjadi keputusan arsitektural yang strategis. zk-SNARKs menawarkan bukti yang sangat kecil dan verifikasi yang sangat cepat, tetapi memerlukan trusted setup dan bergantung pada asumsi kurva eliptik yang tidak tahan kuantum. zk-STARKs eliminasi trusted setup, tahan kuantum, dan memiliki sifat skalabilitas kuasi-linier, namun menghasilkan bukti yang lebih besar dan verifikasi yang lebih mahal dalam konteks on-chain. Di Solana, fasilitas syscall terbaru seperti Poseidon (hash ramah-ZK) dan alt_bn128 (kurva ramah-pairing) telah memindahkan viability verifikasi SNARK on-chain dari “sulit” menjadi “layak”, sementara pipeline verifikasi STARK L1 on-chain mulai masuk ke ranah produksi berdasarkan riset terbaru.

Rekomendasi tingkat tinggi kami untuk implementasi di Solana:
- Gunakan zk-SNARKs (misalnya Groth16) untuk verifikasi on-chain yang sangat sering, bukti konstan yang sangat kecil, dan integritas state akun yang padat (ZK Compression saat ini menggunakan SNARK). Pertimbangkan PLONK jika dibutuhkan trusted setup universal (universal setup) yang fleksibel untuk beberapa sirkuit, dengan pemahaman bahwa verifikasi on-chain alt_bn128 tersedia.
- Gunakan zk-STARKs untuk skenario yang menekankan transparansi (tanpa trusted setup), ketahanan kuantum, dan/or skalabilitas prover/verifier kuasi-linier pada dataset besar—misalnya pembuktian state yang sangat luas atau pipeline verifikasi yang dapat bertahap ditingkatkan di L1. Optimasi gas/compute-unit (CU) dan throughput harus dievaluasi ketat terhadap biaya verifikasi dan ukuran bukti yang lebih besar, terutama dalam batas transaksi Solana.

Perbedaan inti SNARK vs STARK dapat diringkas sebagai berikut. zk-SNARKs: bukti kecil (sekitar ratusan byte), verifikasi cepat (milidetik), cocok untuk constraints on-chain yang ketat, namun membutuhkan trusted setup dan tidak tahan kuantum. zk-STARKs: tanpa trusted setup, tahan kuantum, skalabilitas lebih kuat pada dataset besar, namun bukti cenderung besar (puluhan hingga ratusan KB) dan verifikasi on-chain lebih mahal. 作为 introduzioni, [[^1]] [[^2]] [[^4]] menyoroti implikasi praktis serta trade-off yang mendasari keputusan desain di Solana.

Untuk membantu penentuan cepat, Tabel 1 merangkum keputusan berdasarkan skenario-solana.

Tabel 1 — Matriks keputusan ringkas (SNARK vs STARK) untuk skenario umum di Solana
| Skenario Solana | Kebutuhan Utama | Batas Transaksi/Bukti | Kemampuan Syscall | Rekomendasi |
|---|---|---|---|---|
| Validitas state akun (ZK Compression) | Bukti sangat kecil, verifikasi on-chain sering | Transaksi capped ~1232 B; proof ~128 B | Poseidon (state tree), alt_bn128 (SNARK) | SNARK (Groth16/PLONK) |
| Kompresi state masif (banyak akun) | Skala prover/verifier kuasi-linier | Bukti besar dapat diterima; verifikasi on-chain lebih mahal | Perlu desain verifikasi bertahap | STARK (jika dataset besar dan transparansi prioritas) |
| Privasi token SPL (confidential transfer) | Overhead verifikasi moderat; skema enkripsi | Bukti kecil membantu throughput | curve25519 + program ZK | SNARK + enkripsi (Pedersen/Twisted ElGamal) |
| Verifikasi bertahap (L1 on-chain) | Ketahanan kuantum, tanpa trusted setup | Pipeline verifikasi perlu optimasi | Dukungancryptographic di L1 | STARK (dengan pipeline verifikasi disesuaikan) |

Analisis rekomendasi ini akan dikembangkan sepanjang laporan dengan memperhitungkan faktor on-chain Solana, resource verifikasi, tooling, dan risiko operasional.

## Metodologi dan Ruang Lingkup

Laporan ini mensintesis bukti dari sumber primer (paper kriptografi), sumber sekunder (artikel teknis, dokumentasi ekosistem), dan diskusi teknis kredibel. Substansi perbandingan SNARK vs STARK dikuatkan oleh [[^2]] dan [[^4]] untuk definisi serta ringkasan sifat-sifatnya. Kinerja dan skala dideskripsikan menggunakan asymtotik dan benchmark indikatif dari [[^6]], serta studi slid/opini masyarakat teknis dari [[^11]].

Ruang lingkup mencakup:
- Arsitektur Solana relevan (akun, batas transaksi, compute units, ruang ledger), dan bagaimana-nya ZKP memanfaatkan primitive ini untuk privasi serta skala.
- Perbandingan mendasar SNARK vs STARK pada kinerja (bukti, verifikasi, prover), keamanan (trusted setup, asumsi kriptografi, ketahanan kuantum), serta kemudahan implementasi di Solana (syscall Poseidon/alt_bn128, pipeline ZK Compression, dukungan toolchain).
- Praktik terbaik, mitigasi risiko, dan roadmap ekosistem ZK Solana.

Keterbatasan data:
- Tidak ada dataset benchmark seragam lintas-sirkuit besar pada workload Solana; referensi kinerja yang tersedia bersifat umum dan tidak spesifik target runtime Solana.
- Estimasi biaya gas yang disitir untuk STARK/SNARK berbasis Ethereum tidak otomatis translate ke CU/biaya Solana.
- Status ketersediaan alt_bn128 di mainnet vs devnet/testnet serta dampak stabilitasnya terhadap pipeline verifikasi dapat berubah; perlu konfirmasi paling mutakhir.
- Bukti performa verifikasi STARK L1 on-chain Solana masih riset terbaru; belum ada angkaCU resmi lintas kasus penggunaan.

## Arsitektur Solana untuk ZKP: Konsep Dasar dan Implikasinya

ZK Compression di Solana beroperasi dengan memindahkan sebagian besar data state off-chain ledger sementara hanya menyimpan bukti validitas ringkas dan root hash dari pohon state on-chain. Bukti validitas yang digunakan dalam ZK Compression saat ini adalah SNARK (Groth16) dengan ukuran sekitar 128 byte dan verifikasi on-chain yang membutuhkan sekitar 100k compute units (CUs), belum termasuk overhead sistem dan biaya per baca/tulis akun terkompresi. Poseidon syscall—hash ramah-ZK—digunakan untuk pohon state (concurrent Merkle tree), sementara alt_bn128 syscall menyediakan operasi kurva eliptik ramah-pairing untuk verifikasi SNARK on-chain. [[^8]]

Penting untuk memahami batas-batas runtime Solana:
- Ukuran transaksi maksimum adalah sekitar 1232 byte, sehingga bukti ringkas menjadi syarat mutlak untuk on-chain verification.
- Penggunaan CU per verifikasi bukti dan operasi sistem memerlukan perencanaan kapasitas yang cermat, terutama pada beban transaksi tinggi.
- State tree berbasis Poseidon disimpan secara konkuren; root state on-chain disimpan sebagai ringkasan ringkas, memungkinkan komposisi paralel dan komposabilitas atomik.

Untuk menyajikan konteks ukuran dan biaya, Tabel 2 merangkum parameter relevan ZK Compression di Solana.

Tabel 2 — Ringkasan parameter ZK Compression di Solana
| Parameter | Nilai/Deskripsi | Implikasi |
|---|---|---|
| Proof size (validity proof) | ~128 byte | Memenuhi batas transaksi Solana dan meminimalkan overhead on-chain |
| Proof system | SNARK (Groth16) | Kecepatan verifikasi on-chain tinggi; bukti konstan kecil |
| Verifier CU | ~100k CU | Perlu perencanaan kapasitas untuk throughput tinggi |
| System Use CU | ~100k CU | Tambahan overhead untuk operasi sistem |
| Per compressed account RW | ~6k CU | Biaya baca/tulis per akun terkompresi |
| Poseidon syscall | Aktif (Epoch 644) | Hash ramah-ZK untuk state trees; efisien untuk sirkuit |
| alt_bn128 syscall | Testnet; target Devnet/Mainnet-Beta | Operasi pairing untuk verifikasi SNARK on-chain |
| State tree | Concurrent Merkle tree | Parallelisme, skalabilitas state, root on-chain ringkas |
| Identitas akun | Hash akun (opsional address) | Overhead komputasi berkurang; fleksibilitas ID permanen |
| Transaksi | ~1232 byte cap | Bukti harus ringkas agar transaksi tetap feasible |
| Ketersediaan data | Ledger存储 (off-chain/hybrid) | Penghematan biaya storage dengan integritas yang dapat diverifikasi |

Sumber: [[^8]] [[^15]] [[^16]]

Angka-angka ini mengilustrasikan mengapa SNARK—dengan bukti yang sangat kecil—cocok untuk verifikasi on-chain yang sering terjadi dalam ZK Compression, dan mengapa Poseidon/alt_bn128 adalah enabler penting untuk viabilitas pipeline verifikasi di Solana. Riset terbaru juga menandakan bahwa pipeline verifikasi STARK penuh di L1 Solana semakin mendekati kelayakan produksi, membuka pilihan arsitektural tambahan untuk aplikasi yang mengutamakan transparansi dan ketahanan kuantum. [[^10]]

## zk-SNARKs di Solana: Kelebihan, Kekurangan, dan Use Cases

zk-SNARKs, sebagaimana dideskripsikan [[^1]], характеризуются oleh:
- Bukti yang sangat kecil dan verifikasi yang sangat cepat, konstan terhadap ukuran sirkuit.
- Trusted setup (Common Reference String, CRS) yang diperlukan untuk sistem berbasis pairing seperti Groth16, dan opsi universal setup untuk PLONK.
- Asumsi kriptografi pada kurva eliptik (pairing-friendly) yang tidak tahan kuantum.

Di Solana, ZK Compression memanfaatkan Groth16 untuk validity proofs—sekitar 128 byte per bukti—dengan verifikasi on-chain yang telah difasilitasi oleh alt_bn128 syscalls (di testnet; rencana devnet/mainnet). Performanya cocok untuk kasus penggunaan yang membutuhkan verifikasi sering, bukti kecil, dan throughput tinggi pada L1. [[^8]] [[^14]] [[^15]] [[^16]]

Keunggulan:
- Bukti ringkas ~128 B, verifier time sangat cepat (milidetik), dan biaya on-chain relatif rendah per bukti.
- Interoperabilitas dengan ekosistem EVM melalui kurva pairing (BN254), membuka peluang integrasi lintas-chain dengan alat dan kontrak yang ada. [[^15]] [[^16]]

Keterbatasan:
- Trusted setup diperlukan; keamanan bergantung pada销毁 trapdoor durante ceremony dan auditabilitas setup.
- Tidak tahan kuantum (asumsi kurva eliptik).
- Perlu pipeline setup terstandar (MPC ceremony) dan pengelolaan kunci yang aman.

Tabel 3 menyajikan alur implementasi SNARK untuk ZK Compression dan panggilan syscalls yang relevan.

Tabel 3 — Alur implementasi SNARK (Groth16) di Solana dan syscalls
| Tahap | Aktivitas | Syscall/Primitif | Catatan |
|---|---|---|---|
| 1 | Desain sirkuit | Bahasa sirkuit (mis. Circom) | Komponen Poseidon (input width, rounds) |
| 2 | Setup (CRS) | Ceremony (MPC) | Universal (PLONK) vs per-sirkuit (Groth16) |
| 3 | Pembuatan witness | Off-chain prover | Optimalisasi witness generation |
| 4 | Prove | Prover SNARK | Output: bukti ~128 B |
| 5 | Verifikasi on-chain | alt_bn128 pairing | BN254 G1/G2 ops; verifikasi murah |
| 6 | State tree updates | Poseidon syscall | Concurrent Merkle tree maintenance |

Sumber: [[^8]] [[^14]] [[^15]] [[^16]]

Implikasi operasional:
- Rencana kunci dan ceremony trusted setup harus diaudit, terdokumentasi, dan disertai peningkatan mitigasi untuk penyimpangan proses.
- alt_bn128 di testnet/devnet mensyaratkan uji regresi stabilitas; proyek harus siap dengan fallback (mis. verifikasi off-chain, pembuktian delayed) bila terjadi gangguan.

## zk-STARKs di Solana: Kelebihan, Kekurangan, dan Use Cases

zk-STARKs menawarkan sifat transparansi (tanpa trusted setup), ketahanan kuantum (asumsi hash), dan skalabilitas kuasi-linier pada ukuran data, membuatnya cocok untuk komputasi masif dan penjagaan privasi dengan verifikasi yang dapat dioptimalkan. [[^2]] [[^7]] Sifat-sifat ini sangat relevan ketika dataset dan witness besar, dan ketika menghindari trusted setup adalah prioritas kebijakan atau keamanan.

Keterbatasan praktis di L1:
- Ukuran bukti yang lebih besar (puluhan hingga ratusan KB) meningkatkan biaya verifikasi on-chain dan dapat menekan throughput bila bukti tidak dapat dikompresi atau disiapkan off-chain.
- Waktu verifikasi lebih tinggi daripada SNARK pada konteks on-chain tradisional; optimasi pipeline diperlukan. [[^2]] [[^6]]

Riset terbaru menunjukkan kelayakan verifikasi STARK penuh di L1 Solana dengan perhatian pada parameter kriptografis dan kebutuhan rekayasa runtime; pipeline ini masih dalam tahap emergensi dan membutuhkan evaluasi biaya/benefit terhadap batas transaksi dan CUs. [[^10]]

Tabel 4 merangkum sifat asimtotik STARK dan implikasi on-chain di Solana.

Tabel 4 — Sifat asimtotik STARK dan implikasi on-chain Solana
| Properti | STARK | Implikasi di Solana |
|---|---|---|
| Trusted setup | Tidak ada | Eliminasikepercayaan pada ceremony; transparansi tinggi |
| Ketahanan kuantum | Ya (hash) | Future-proof terhadap ancaman kuantum |
| Proof size | Log-poly (besar) | Memerlukan penghematan ketat pada payload transaksi |
| Prover time | Kuasi-linier | Skala baik pada dataset besar |
| Verifier time | Kuasi-linier (lebih tinggi dari SNARK) | Perlu desain verifikasi bertahap; optimasi syscall/CU |
| Asumsi kriptografi | Lebih lemah (hash, info-theoretic) | Audit fungsi hash dan parameter keacakan publik |
| Use cases | Dataset besar, transparansi prioritas | Pipeline verifikasi bertahap, batching verifikasi |

Sumber: [[^2]] [[^6]] [[^7]] [[^10]]

Secara praktis, STARK di Solana tepat untuk:
- Aplikasi yang memprioritaskan transparansi dan ketahanan kuantum, dan dapat mentoleransi bukti besar.
- Skema verifikasi bertahap dengan batching bukti, dimana verifikasi on-chain dapat disusun untuk mengurangi biaya per transaksi.

## Performa Kuantitatif: Ukuran Bukti, Verifikasi, dan Prover

Angka indikatif memberi gambaran relatif antara SNARK dan STARK, meski belum spesifik workload Solana:
- Proof sizes: SNARK ~288 B; STARK ~45 KB (satuan indikatif dari benchmark masyarakat). [[^6]]
- Verifier times: SNARK ~10 ms; STARK ~16 ms (indikatif). [[^6]]
- Prover times: STARK ~1.6 s; SNARK ~2.3 s (indikatif). [[^6]]

Tabel 5 — Benchmark indikatif SNARK vs STARK
| Metrik | zk-SNARK | zk-STARK | Catatan |
|---|---|---|---|
| Proof size | ~288 B | ~45 KB | SNARK jauh lebih ringkas |
| Verifier time | ~10 ms | ~16 ms | SNARK lebih cepat di verifier |
| Prover time | ~2.3 s | ~1.6 s | STARK lebih cepat di prover (umum) |

Sumber: [[^6]] (benchmark indikatif komunitas)

Interpretasi:
- Pada verifikasi on-chain yang sering, SNARK lebih cocok karena bukti sangat kecil dan verifikasi milidetik.
- Pada dataset besar, STARK memiliki keunggulan prover time kuasi-linier, tetapi biaya verifikasi on-chain tetap menjadi perhatian.
- мнения dari [[^11]] menunjukkan bukti bahwa prover STARK dapat jauh lebih cepat (5x–50x) dibanding SNARK framework tertentu, dengan konsekuensi ukuran bukti yang jauh lebih besar—implikasi yang perlu dipertimbangkan dalam desain pipeline Solana.

## Biaya On-Chain di Solana: Compute Units dan Trade-off

Dalam ZK Compression, verifikasi bukti SNARK menggunakan sekitar 100k CUs, dengan tambahan 100k CU untuk system use, serta sekitar 6k CU per operasi baca/tulis akun terkompresi. Ukuran bukti ~128 byte memberi ruang untuk tetap berada di bawah batas transaksi (~1232 byte), menjaga kelayakan transaksi. [[^8]] [[^15]]

Tabel 6 — Estimasi CU per operasi ZK Compression (indikatif)
| Operasi | Estimasi CU | Catatan |
|---|---|---|
| Verifikasi validity proof | ~100k CU | SNARK verifier (alt_bn128 pairing) |
| System use | ~100k CU | Overhead sistem |
| Per compressed account RW | ~6k CU | Biaya baca/tulis per akun |
| Proof size | ~128 B | Memungkinkan transaksi tetap feasible |

Sumber: [[^8]]

Implikasi throughput:
- Verifikasi on-chain berfrekuensi tinggi menuntun ke pengutamaan SNARK karena bukti kecil dan verifikasi cepat, sehingga biaya CU total terjaga.
- STARK, meskipun unggul pada prover dan sifat transparansi, menuntut optimasi verifikasi (misalnya, batching, verifikasi off-chain dengan proof of correctness) agar tidak membebani pipeline L1.

Perlu dicatat bahwa estimasi gas dari ekosistem Ethereum tidak langsung translate ke CU Solana. Поэтому perancangan arsitektur harus berbasis pada karakteristik runtime Solana, termasuk batas transaksi dan kapasitas CU aktual pada jaringan saat uji beban. [[^2]]

## Keamanan dan Model Kepercayaan

Perbedaan mendasar keamanan SNARK vs STARK:
- SNARK: membutuhkan trusted setup (CRS). Keamanan bergantung pada penghancuran trapdoor oleh peserta ceremony; kompromi CRS dapat memungkinkan pembuatan bukti palsu. Asumsi kurva eliptik tidak tahan kuantum. [[^1]] [[^2]]
- STARK: tanpa trusted setup; keamanan bertumpu pada fungsi hash dan transparansi parameter yang dapat diverifikasi publik. Tahan kuantum dan asumsi yang relatif lebih lemah. [[^2]] [[^7]]

Tabel 7 — Matriks keamanan SNARK vs STARK
| Aspek | SNARK | STARK |
|---|---|---|
| Trusted setup | Diperlukan (CRS) | Tidak diperlukan |
| Transparansi | Lebih rendah (bergantung setup) | Tinggi (parameter publik) |
| Ketahanan kuantum | Tidak | Ya |
| Asumsi kriptografi | Kurva eliptik (pairing) | Hash, informasi-teoretis |
| Risiko operasional | Kompromi CRS; ceremony | Fungsi hash dan parameter keacakan |

Sumber: [[^1]] [[^2]] [[^7]]

Implikasi kebijakan dan audit:
- Aplikasi yang mengharuskan audit publik dan ketidakbergantungan pada ceremony cenderung lebih nyaman dengan STARK.
- Aplikasi yang menekankan verifikasi on-chain berulang dengan bukti sangat kecil dapat memilih SNARK, dengan protokol ceremony dan audit CRS yang ketat.

## Kemudahan Implementasi dan Tooling di Solana

Syscall Poseidon sudah aktif sejak Epoch 644 dan menjadi fondasi bagi state tree ZK Compression yang efisien. alt_bn128 menyediakan operasi kurva pairing (BN254) untuk verifikasi SNARK on-chain; status aktif di testnet dan rencana ke devnet/mainnet membuka jalan bagi pipeline verifikasi SNARK native yang stabil. [[^8]] [[^14]] [[^15]] [[^16]]

 Dukungan library:
- groth16-solana (crate) menyederhanakan integrasi verifier Groth16 di Solana program. [[^14]]
- light-poseidon (crate) mengadopsi Poseidon dengan parameter yang kompatibel dengan pipeline Circom; tersedia audit publik. [[^17]] [[^18]]

Ekosistem ZKCompression menyediakan Photon RPC (indekser), prover nodes, dan light forester nodes untuk mengelola state tree dan nullifier queues. Rekomendasi operasional: memisahkan peran RPC, prover, dan forester, dengan monitoring dan fallback bila terjadi gangguan pada syscalls atau fitur gate. [[^8]] [[^12]]

Tabel 8 — Komponen tooling Solana untuk ZKP
| Komponen | Peran | Status |
|---|---|---|
| Poseidon syscall | Hash ramah-ZK untuk state tree | Aktif (Epoch 644) |
| alt_bn128 syscalls | Operasi pairing BN254 untuk verifier SNARK | Testnet; target Devnet/Mainnet-Beta |
| groth16-solana | Library verifier SNARK di Solana | Tersedia |
| light-poseidon | Hash Poseidon (compatible Circom) | Tersedia, diaudit |
| Photon RPC | Indekser ZK Compression | Ekosistem Light/Helius |
| Prover nodes | Pembuatan bukti validity | Node ops tersedia |
| Light forester | Manajemen state tree & nullifier | Node ops tersedia |

Sumber: [[^8]] [[^14]] [[^17]] [[^18]] [[^12]]

Tantangan umum:
- Keterbatasan dukungan library SNARK secara native di masa lalu; perlu adopsi syscall dan crate yang sesuai.
- Perubahan jadwal fitur gate (SIMD) dapat mempengaruhi stabilitas pipeline; perencanaan rilis dan uji regresi wajib.

## Studi Kasus Solana

ZK Compression (Light Protocol & Helius) telah mencatatkan penghematan biaya yang drastis:
- Pembuatan 100 akun token: biaya turun dari ~0.2 SOL menjadi ~0.00004 SOL (sekitar 5.000x lebih murah).
- Pada 10.000 akun dengan SOL ~$130: biaya turun dari ~$2.600 menjadi <$0.50. [[^9]] [[^8]]

ZK Token Proof Program mendukung confidential transfers menggunakan Pedersen commitments dan Twisted ElGamal Encryption pada kurva curve25519, dengan protokol Sigma untuk memvalidasi transfer tanpa membuka informasi sensitif. Fitur ini saat ini diblokir dan akan diganti oleh proposals yang lebih umum. [[^8]]

Dark Protocol, Arcium, dan Bonsol memperluas portofolio privasi dan ZK di ekosistem Solana, menunjukkan menguatnya dukungan untuk primitive ZK pada Layer 1 Solana. [[^8]]

Tabel 9 — Studi kasus ZK Compression di Solana
| Use Case | Metrik Sebelum | Metrik Sesudah | Faktor Penghematan |
|---|---|---|---|
| 100 akun token | ~0.2 SOL | ~0.00004 SOL | ~5.000x |
| 10.000 akun (SOL ~$130) | ~$2.600 | <$0.50 | >>1.000x |
| Proof size | - | ~128 B | Memenuhi batas transaksi |
| Verifikasi on-chain | - | ~100k CU + ~100k CU sistem | Perlu kapasitas CU |

Sumber: [[^9]] [[^8]]

## Rekomendasi Strategis dan Playbook Implementasi

- Pilih SNARK ketika:
  - Verifikasi on-chain sering dan bukti harus sangat kecil (ZK Compression).
  - Throughput tinggi menjadi prioritas dan batas transaksi ketat (~1232 byte).
  - Platform membutuhkan interoperabilitas EVM (BN254) dan alat pairing yang mapan. [[^2]] [[^8]]

- Pilih STARK ketika:
  - Transparansi (tanpa trusted setup) dan ketahanan kuantum adalah keharusan.
  - Dataset dan witness besar, dimana skala kuasi-linier prover/verifier memberi manfaat nyata.
  - Pipeline verifikasi bertahap dan batching dapat mengurangi biaya on-chain. [[^2]] [[^7]] [[^10]]

Playbook implementasi praktis:
1. Desain sirkuit ( bahasa sirkuit, arsitektur witness) → pertimbangkan Poseidon untuk efisiensi.
2. Jika SNARK: rencanakan trusted setup (MPC), audit CRS, dan pengelolaan kunci. Pertimbangkan PLONK untuk universal setup.
3. Setup pipeline prover (off-chain) dan verifikasi on-chain (alt_bn128 untuk SNARK).
4. Integrasikan state tree (Poseidon) dan rencana update root on-chain.
5. Operasional: menjalankan Photon RPC, prover nodes, light forester; monitoring syscalls dan feature gates.
6. Uji beban & pemulihan: fallback verifikasi off-chain, batching bukti, dan optimasi CU.

Kerangka penilaian risiko dipertegas pada Tabel 10.

Tabel 10 — Kerangka penilaian risiko implementasi
| Risiko | Dampak | Mitigasi |
|---|---|---|
| Trusted setup (SNARK) | Bukti palsu bila CRS kompromi | MPC yang diaudit, transparansi ceremony, rotasi kunci |
| Stabilitas syscalls | Verifier gagal/timeout | Uji regresi, fallback off-chain, feature gate monitoring |
| Ketahanan kuantum | Risiko jangka panjang | Prioritaskan STARK untuk use case sensitif |
| Data availability | Integritas state | Indekser Photon, audit state root updates |
| CU/throughput | Degradasi kinerja | Batching verifikasi, optimasi sirkuit, penjadual prover |

Sumber: [[^1]] [[^2]] [[^8]]

## Risiko, Keterbatasan, dan Roadmap

Batasan ukuran bukti STARK dapat menjadi hambatan pada transaksi on-chain dengan batas ukuran ketat; verifikasi besar-besaran perlu strategi batching atau pendekatan bertahap. Параметр syscalls (alt_bn128) memiliki jadwal aktivasi yang dinamis; proyek perlu kesiapan untuk perubahan status devnet/mainnet. [[^8]] [[^10]]

Roadmap ekosistem ZK Solana:
- Peningkatan toolchain dan crate (groth16-solana, light-poseidon) dengan audit publik dan kompatibilitas Circom.
- Pengembangan pipeline verifikasi STARK L1 on-chain dan proposal SIMD yang lebih umum untuk ZK Token Proof.
- Ekosistem node ops (Photon, prover, forester) dengan operasional terpisah untuk skalabilitas dan抗脆弱性.

Tabel 11 — Risiko teknis dan mitigasi
| Risiko | Area | Mitigasi |
|---|---|---|
| Bukti besar STARK | On-chain verification | Batching, verifikasi bertahap, optimasi payload |
| Jadwal syscalls | alt_bn128/feature gates | Uji compat, fallback verifikasi, monitoring release |
| Ceremony CRS | SNARK setup | Audit MPC, transparansi, chain-of-trust |
| Ketersediaan data | State tree | Indekser kuat (Photon), root validation |
| CU overhead | Throughput | Optimasi verifier, penjadual prover, caching witness |

Sumber: [[^8]] [[^10]]

## Kesimpulan

Pada konteks Solana saat ini—dengan batas transaksi ketat, kebutuhan verifikasi on-chain yang sering, dan permintaan efisiensi state—zk-SNARKs (Groth16) offer bukti ~128 B dan verifikasi milidetik yang menjadikan-nya pilihan optimal untuk ZK Compression dan pipeline confidential transfers. zk-STARKs tetap relevan untuk use case yang mengutamakan transparansi tanpa trusted setup, ketahanan kuantum, dan skala pada dataset besar, dengan catatan biaya verifikasi on-chain yang lebih tinggi dan kebutuhan optimasi pipeline.

Kombinasi keduanya, dengan dukungan Poseidon dan alt_bn128 syscalls, membentuk masa depan ZK di Solana: SNARK untuk verifikasi ringkas yang berulang, STARK untuk integritas berskala besar dan kebijakan transparansi. Ekosistem node ops dan toolchain yang matang akan menjadi kunci keberhasilan implementasi. Dalam horizon 6–12 bulan, kami mengharapkan aktivasi syscalls yang lebih stabil, rilis library auditor yang lebih kuat, dan muncul-nya pipeline verifikasi STARK L1 yang teruji, sehingga arsitek dapat memilih protokol ZK yang tepat secara case-by-case dengan metric kinerja, keamanan, dan biaya yang lebih jelas.

## Referensi

[^1]: Chainlink — zk-SNARK vs zk-STARK. https://chain.link/education-hub/zk-snarks-vs-zk-starks  
[^2]: Consensys — Zero-Knowledge Proofs: STARKs vs SNARKs. https://consensys.io/blog/zero-knowledge-proofs-starks-vs-snarks  
[^3]: Hacken — Comparing ZK-SNARKs & ZK-STARKs. https://hacken.io/discover/zk-snark-vs-zk-stark/  
[^4]: MDPI Information — Evaluating the Efficiency of zk-SNARK, zk-STARK, and Bulletproofs. https://www.mdpi.com/2078-2489/15/8/463  
[^5]: UTwente (Systematic Review) — Comparing zk-SNARK, zk-STARK, and Bulletproofs. https://research.utwente.nl/files/484230904/Security_and_Privacy_-_2024_-_Oude_Roelink_-_Systematic_review_Comparing_zk_SNARK_zk_STARK_and_bulletproof_protocols_for.pdf  
[^6]: Ethereum StackExchange — zk-SNARKs vs zk-STARKs vs Bulletproofs (Updated). https://ethereum.stackexchange.com/questions/59145/zk-snarks-vs-zk-starks-vs-bulletproofs-updated  
[^7]: StarkWare — STARK paper (2018). https://starkware.co/wp-content/uploads/2022/05/STARK-paper.pdf  
[^8]: Helius — Zero-Knowledge Proofs: Its Applications on Solana. https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana  
[^9]: Light Protocol — ZK Compression Protocol for Solana (GitHub). https://github.com/Lightprotocol/light-protocol  
[^10]: IACR ePrint 2025/1741 — Full L1 On-Chain ZK-STARK+PQC Verification on Solana. https://eprint.iacr.org/2025/1741.pdf  
[^11]: Ethresear.ch — Benchmarking ZKP Development Frameworks (Starky vs SNARK). https://ethresear.ch/t/benchmarking-zkp-development-frameworks-the-pantheon-of-zkp/14943  
[^12]: Solana StackExchange — Does Solana support any popular zkSNARK libraries? https://solana.stackexchange.com/questions/3264/does-solana-support-any-popular-zksnark-libraries  
[^13]: Solana Labs PR — Poseidon syscalls (PR #27961). https://github.com/solana-labs/solana/pull/27961  
[^14]: Solana Labs PR — alt_bn128 syscalls (PR #32680). https://github.com/solana-labs/solana/pull/32680  
[^15]: EIP-196 — Precompiled contracts for BN254. https://eips.ethereum.org/EIPS/eip-196  
[^16]: EIP-197 — Precompiled contracts for BN254 pairing check. https://eips.ethereum.org/EIPS/eip-197  
[^17]: crates.io — light-poseidon. https://crates.io/crates/light-poseidon  
[^18]: Light Protocol — Audit report for light-poseidon. https://github.com/Lightprotocol/light-poseidon/blob/main/assets/audit.pdf  
[^19]: Solana Docs — Accounts. https://solana.com/docs/core/accounts  
[^20]: ZKCompression — Compressed Account Model. https://www.zkcompression.com/learn/core-concepts/compressed-account-model  
[^21]: Light Protocol — Concurrent Merkle Tree tests (GitHub). https://github.com/Lightprotocol/light-protocol/blob/main/program-libs/concurrent-merkle-tree/tests/tests.rs  
[^22]: Solana Labs PR — alt_bn128 error code simplification. https://github.com/iceomatic/solana-improvement-documents/blob/patch-1/proposals/0129-alt-bn128-simplified-error-code.md  
[^23]: Solana Foundation — Feature Gate Activation Schedule. https://github.com/solana-labs/solana/wiki/Feature-Gate-Activation-Schedule  
[^24]: Agave (Solana) — Feature Gate Activation Schedule. https://github.com/anza-xyz/agave/wiki/Feature-Gate-Activation-Schedule  
[^25]: Solana Improvement Document — SIMD-0153 (ZK Token Proof replacements). https://github.com/solana-foundation/solana-improvement-documents/pull/153