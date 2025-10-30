# Blueprint Laporan: zk-SNARKs vs zk-STARKs untuk Solana (Fokus Protokol Pembayaran x402)

## Pendahuluan & Ringkasan Eksekutif

x402 memanfaatkan kode status HTTP 402 “Payment Required” untuk mengikat penyelesaian on-chain sebagai bagian dari alur HTTP, sehingga pembayaran berfungsi sebagai autentikasi tanpa состоя. Di ekosistem Solana, pendekatan ini menjanjikan skala tinggi dan latensi rendah, tetapi menuntut jaminan privasi dan integritas yang tepat guna, biaya on-chain yang terkontrol, serta verifikasi bukti nol-pengetahuan (zero-knowledge proofs, ZKP) yang efisien pada Layer 1 (L1). Dua paradigma bukti yang dominan—zk-SNARKs (Succinct Non-interactive Argument of Knowledge) dan zk-STARKs (Scalable Transparent Argument of Knowledge)—hadir dengan trade-off berbeda pada ukuran bukti, waktu verifikasi, kebutuhan trusted setup, dan ketahanan kuantum. Pemilihan yang tepat untuk x402 akan memengaruhi kelayakan biaya, pengalaman pengguna, dan postur keamanan jangka panjang.[^9]

Ringkasan eksekutif:
- zk-SNARKs unggul untuk verifikasi on-chain yang sering dengan bukti sangat kecil dan verifikasi sangat cepat. Di Solana, syscalls Poseidon dan alt_bn128 membuat verifikasi SNARK (mis. Groth16) semakin layak on-chain. trusted setup tetap menjadi isu utama dan memerlukan operasi ceremony yang dapat diaudit.[^5][^6][^3][^4][^7][^8][^15][^16][^17]
- zk-STARKs menghilangkan kebutuhan trusted setup, bersifat transparan, dan tahan kuantum, dengan skalabilitas kuasi-linier pada prover dan verifier. Namun, ukuran bukti yang lebih besar meningkatkan beban on-chain; riset mutakhir menunjukkan verifikasi L1 on-chain di Solana makin mendekati kelayakan, tetapi tetap memerlukan strategi batching dan verifikasi bertahap.[^5][^6][^7][^10]
- Pada x402, gunakan SNARK untuk pembayaran cepat dan verifikasi berulang pada L1 (misalnya bukti kelayakan atau availability fondos dengan bukti kecil), dan pertimbangkan STARK untuk skenario yang mengutamakan transparansi, ketahanan kuantum, atau dataset/witness besar yang diproses off-chain, dengan biaya verifikasi di L1 yang dikelola melalui batching dan pipelineverifier yang dioptimalkan.

Untuk memudahkan penentuan awal, Tabel 1 menyajikan matriks keputusan ringkas.

Tabel 1 — Matriks keputusan ringkas (SNARK vs STARK) untuk skenario x402
| Skenario | Kebutuhan utama | Batas transaksi/Bukti | Kemampuan syscalls | Rekomendasi |
|---|---|---|---|---|
| Pembayaran HTTP-native (on-chain settlement) | Bukti kecil, verifikasi cepat | Bukti ≲ few hundred bytes | Poseidon + alt_bn128 | SNARK (Groth16/PLONK) |
| Privasi jumlah (Confidential Transfer/Balances) | Bukti rentang/validitas ciphertext; auditability | Bukti kecil membantu throughput | Poseidon + zk-token-proof (ElGamal) | SNARK + Enkripsi (ElGamal) |
| Verifikasi berulang (frequent verification) | Verifier konstan, biaya CU rendah | Bukti harus ringkas | alt_bn128 pairing | SNARK |
| Dataset besar, transparansi prioritas | Skala prover kuasi-linier, tanpa trusted setup | Bukti besar dapat diterima | Evaluasi pipeline L1 STARK | STARK (dengan batching/verifier bertahap) |

Bagian berikut menguraikan landasan arsitektur Solana, trade-off proof systems, opsi library/tooling, dan playbook implementasi yang relevan khusus untuk x402.

## Landasan Arsitektur Solana untuk ZKP (Accounts, CU, Syscalls)

Solana mengadopsi model akun (accounts) sebagai sumber kebenaran. Setiap program beroperasi pada state yang tersimpan dalam akun, dan eksekusi dibatasi oleh compute units (CU). Pada desain x402, implikasi utamanya adalah: (i) verifikasi bukti ZK sebaiknya memiliki footprint kecil pada payload transaksi, (ii) verifier on-chain harus hemat CU, dan (iii) struktur data yang digunakan (misalnya Merkle tree) harus selaras dengan pola akses dan paralelisme eksekusi yangetnik pada Solana.[^14]

Syscalls krusial:
- Poseidon hash: hash ramah-ZK yang menurunkan biaya on-chain dan efisiensi dalam sirkuit; implementasisyscall diaktifkan melalui PR Solana, mendukung komputasi hash yang diperlukan untuk state trees dan verifier.[^15]
- alt_bn128: operasi kurva pairing (BN254) untuk verifikasi SNARK; PR syscalls alt_bn128 di Solana membuka potensi verifier Groth16/PLONK on-chain dengan primitif pairing yang kompatibel terhadap EIP-196/197 (precompiles pairing di Ethereum).[^16][^17][^18][^19]

Dukungan ZK terkini di Solana tercermin dalam aplikasi seperti ZK Compression Light Protocol yang memanfaatkan Poseidon dan Groth16 verifier on-chain untuk compress state. Parameter operasional (ukuran bukti, CU) memandu desain x402, termasuk batas ukuran transaksi (sekitar 1232 byte) yang memaksa bukti ZK tetap ringkas.[^9][^12][^20]

Tabel 2 — Ringkasan syscalls ZK dan peran on-chain
| Syscall | Fungsi | Dampak on-chain | Kesesuaian bukti |
|---|---|---|---|
| Poseidon hash | Hash ramah-ZK untuk sirkuit/Merkle | Biaya hash rendah; struktur pohon efisien | SNARK/STARK untuk state roots |
| alt_bn128 | Pairing BN254; G1/G2 ops | Verifier SNARK on-chain viable | Groth16/PLONK verifier |
| g1/g2 compression | Memperkecil representasi bukti | Payload transaksi berkurang | Groth16 proof sizes |
| curve25519/ristretto | Operasi kurva alternatif | Privasi/enkripsi spesifik | Enkripsi/identitas (didukung SPL) |

Konsekuensi desain untuk x402: gunakan bukti yang sangat ringkas untuk verifikasi sering, dan pilih struktur data yang compat dengan Poseidon. alt_bn128 memungkinkan verifier SNARK on-chain yang efisien, tetapi harus dipadukan dengan strategi CU (batching, verifikasi bertahap) dan pemilihan library verifier yang matang.

## Perbandingan Fundamental: zk-SNARKs vs zk-STARKs

zk-SNARKs memiliki sifat succinctness kuat: bukti konstan kecil dan verifikasi cepat terhadap ukuran sirkuit. Namun, Groth16 membutuhkan trusted setup per sirkuit (CRS), dan asumsi kurva pairing tidak tahan kuantum. PLONK menawarkan universal setup yang fleksibel dengan verifikasi yang masih efisien. zk-STARKs menghilangkan trusted setup, bergantung pada fungsi hash, tahan kuantum, dan memiliki skalabilitas kuasi-linier pada prover/verifier. Biaya on-chain STARK lebih tinggi karena ukuran bukti yang lebih besar, meskipun sifat ini dapat dikelola melalui batching dan verifier bertahap.[^1][^2][^6][^7]

Implikasi untuk x402:
- SNARK: verifikasi on-chain yang sering, bukti sangat kecil, verifikasi milidetik; Cocok untuk settle cepat dan throughput tinggi, dengan syarat proses trusted setup yang kredibel.[^5][^3][^4]
- STARK: pipeline tanpa trusted setup, cocok untuk dataset besar atau kebijakan transparansi/ketahanan kuantum; biaya on-chain lebih tinggi dan ukuran bukti lebih besar sehingga strategi verifikasi dan payload perlu dirancang ketat.[^5][^6][^7][^10]

Tabel 3 — Perbandingan sifat SNARK vs STARK
| Aspek | SNARK (Groth16/PLONK) | STARK |
|---|---|---|
| Trusted setup | Diperlukan (CRS; universal pada PLONK) | Tidak ada |
| Ukuran bukti | Sangat kecil (≈100–200 B) | Lebih besar (puluhan–ratusan KB) |
| Waktu verifikasi | Sangat cepat | Cepat, on-chain lebih mahal |
| Ketahanan kuantum | Rendah (kurva pairing) | Tinggi (hash) |
| Skala prover | Baik; relatif ke sirkuit | Kuasi-linier; unggul pada dataset besar |
| Asumsi kriptografi | Pairing-friendly curves | Hash + info-teoretis |
| Use-case khas | Frequent on-chain verification | Transparent, large-scale proofs |

### Model Kepercayaan & Keamanan

- SNARK: membutuhkan ceremony trusted setup (MPC). Keamanan bergantung pada penghancuran trapdoor; kompromi CRS berpotensi memungkinkan bukti palsu. Asumsi kurva eliptik tidak tahan kuantum.[^1]
- STARK: transparansi parameter (tidak perlu CRS) dan tahan kuantum. Risiko operative berpindah ke fungsihash dan kontrol keacakan publik.[^6]

Dalam konteks x402, pilih SNARK jika kebutuhan verifikasi kecil/sering dan ceremony trusted setup dapat dioperasikan dengan audit publik. Pilih STARK bila kebijakan mengharuskan transparansi kuat dan ketahanan kuantum, dengan toleransi ukuran bukti dan biaya verifikasi on-chain yang lebih tinggi.

## Kinerja & Biaya On-Chain (Compute Units, Payload, Throughput)

Secara indikatif, SNARK menyajikan bukti jauh lebih kecil (≈288 B) dibanding STARK (≈45 KB) pada benchmark umum; verifier SNARK sekitar 10 ms versus STARK ≈16 ms; prover STARK ≈1.6 s versus SNARK ≈2.3 s. Walau angka spesifik workload Solana belum tersedia, indikasi ini cukup untuk memandu keputusan arquitectural pada x402.[^11]

ZK Compression di Solana memanfaatkan Groth16 dengan bukti ≈128 B, verifier ≈100k CU, overhead sistem ≈100k CU, dan tambahan ≈6k CU per RW akun terkompresi. Dengan batas transaksi ≈1232 B, SNARK menjaga headroom yang cukup bagi payload transaksi, meningkatkan kelayakan on-chain verification yang sering.[^12][^9]

Tabel 4 — Benchmark indikatif SNARK vs STARK
| Metrik | SNARK | STARK | Catatan |
|---|---|---|---|
| Proof size | ≈288 B | ≈45 KB | Ringkas SNARK bermanfaat pada batas transaksi |
| Verifier time | ≈10 ms | ≈16 ms | SNARK lebih cepat untuk verifier |
| Prover time | ≈2.3 s | ≈1.6 s | STARK unggul untuk prover kuasi-linier |

Tabel 5 — Estimasi CU ZK Compression
| Komponen | Estimasi CU | Implikasi |
|---|---|---|
| Verifier proof | ~100k | Perencanaan kapasitas untuk throughput tinggi |
| System use | ~100k | Overhead tetap per transaksi |
| Per compressed RW | ~6k | Biaya linear pada jumlah akun |
| Proof size | ~128 B | Memenuhi batas transaksi |

Implikasi x402: gunakan batching untuk amortisasi CU verifier; target bukti kecil untuk pembayaran sering; jadualverifier bertahap pada STARK untuk menahan biaya L1. Pertahankan kontrol ukuran transaksi agar headroom tersedia untuk instruksi lain.

## Keamanan & Model Kepercayaan (Trusted Setup, Quantum-Resistance)

Matriks keamanan SNARK vs STARK menegaskan trade-off yang harus dipertimbangkan pada kebijakan.

Tabel 6 — Matriks keamanan SNARK vs STARK
| Aspek | SNARK | STARK |
|---|---|---|
| Trusted setup | Diperlukan (CRS) | Tidak |
| Transparansi | Bergantung setup | Tinggi |
| Ketahanan kuantum | Tidak | Ya |
| Asumsi | Kurva pairing | Hash/info-teoretis |
| Risiko operasional | CRS kompromi | Parameter keacakan, hash |

Referensi SNARK/StARK menegaskan implikasi trusted setup dan ketahanan kuantum.[^1][^6] Insiden bug soundness pada ZK proof program Solana menegaskan kebutuhan audit ketat, uji regresi, dan aktivasi bertahap.[^21]

## Kemudahan Implementasi & Tooling di Solana

Dukungan libraryRust dan JS/TS di ekosistem Solana memungkinkan alur hibrida: sirkuit dan bukti dihasilkan di klien/off-chain; verifikasi on-chain dijalankan di program Rust memanfaatkan syscalls ZK.

- groth16-solana: library verifier Groth16 untuk Solana, memanfaatkan alt_bn128 dan kompresi g1/g2 untuk on-chain verification yang efisien.[^7]
- light-poseidon: crate Poseidon yang kompatibel dengan ekosistem Circom, audited, dan sesuai untuk state tree/Merkle proofs.[^8]
- @zk-kit: monorepo primitif ZK JS/TS (Poseidon, IMT/LeanIMT/SMT), berguna untuk menyusun struktur data klien/off-chain sebelum diverifikasi on-chain melalui Rust verifier.[^31]

Tabel 7 — Peta kompatibilitas library ↔ syscalls/program
| Library | alt_bn128 | Poseidon | g1/g2 compression | zk-token-proof | Light Protocol |
|---|---|---|---|---|---|
| groth16-solana | Ya (pairing) | Tidak langsung | Ya | Tidak langsung | Ya |
| light-poseidon | Tidak langsung | Ya (hash) | Tidak | Tidak | Ya |
| @zk-kit (JS/TS) | Tidak langsung | Indirect | Tidak | Tidak | Tidak |
| solana-zk-sdk (resmi) | Ya | Ya | Ya | Ya | Tidak langsung |

Interpretasi: JS/TS library menghasilkan artefak off-chain; verifikasi on-chain membutuhkan Rust verifier dan syscalls. light-poseidon dan groth16-solana adalah pilar integrasi di sisi Solana L1, sementara @zk-kit mempercepat komponen struktur data di klien.

## Rekomendasi untuk Protokol x402: SNARK vs STARK

Kriteria utama x402: throughput tinggi, privasi jumlah yang dapat diaudit, bukti kecil pada verifikasi sering, serta kesiapan terhadap kebijakan transparansi dan ketahanan kuantum.

- Gunakan SNARK untuk:
  - Frequent on-chain verification (misalnya komitmen pembayaran di HTTP-native flow).
  - Kebutuhan bukti kecil yang menjaga headroom transaksi.
  - Integrasi dengan zk-token-proof dan enkripsi ElGamal untuk confidential amounts dengan opsi global auditor key (auditability).[^24][^25][^26]

- Gunakan STARK untuk:
  - Transparansi dan Ketahanan kuantum prioritas kebijakan.
  - Dataset/witness besar, dimana skala kuasi-linier prover/verifier memberi nilai; dengan strategi batching/verifier bertahap untuk menekan biaya L1.[^10]

Tabel 8 — Panduan pemilihan untuk x402
| Kebutuhan | Rekomendasi | Alasan | Implikasi biaya |
|---|---|---|---|
| Frequent verification, bukti kecil | SNARK | Bukti sangat kecil, verifier cepat | CU verifier rendah per bukti |
| Confidential amounts (auditability) | SNARK + ElGamal | Skema enkripsi dan bukti ZK matang | CU moderat; audit selektif via global auditor |
| Transparansi + tahan kuantum | STARK | Tanpa trusted setup; hash-based | CU lebih tinggi; perlu batching |
| Dataset/witness besar | STARK | Prover kuasi-linier; scalable | Biaya on-chain perlu kontrol pipeline |

Privasi jumlah berbasis Token22 confidential transfer/balances memberikan fondasi yang tepat, dengan catatan status audit dan aktivasi yang harus dimonitor secara ketat.[^3][^23][^4][^25][^26]

## Playbook Implementasi (End-to-End) untuk x402 + Solana

Dua alur pembayaran x402:

- On-chain settlement: klien memulai 402 → menyusun bukti pembayaran + ZKP → transaksi token confidential (Confidential Transfer/Balances) → akses diberikan setelah konfirmasi L1. ZKP memvalidasi jumlah, rentang, dan ciphertext.[^3]
- Deferred payments: klien memaparkan komitmen berbayar via HTTP Message Signatures → ZKP bahwa komitmen memenuhi syarat (availability, kepatuhan) → akses diberikan segera → penyelesaian finansial dilakukan kemudian, tanpa biaya L1 tinggi pada saat permintaan.[^28][^29]

Komponen:
- Syscalls ZK: alt_bn128 (pairing), Poseidon (hash), kompresi g1/g2.[^16][^15]
- Library verifier: groth16-solana, solana-zk-sdk (verifier + ElGamal program), light-poseidon untuk state trees.[^7][^22][^8]
- x402 integration: headers untuk membawa bukti, JWK verification, binding komitmen ke resource, DoS/fee controls.[^28][^29][^10]

Pengujian: beban CU pada on-chain settlement, stabilitasverifier, audit soundness, aktivasi bertahap, dan fallback bila terjadi gangguan fitur.

Tabel 9 — Checklist implementasi per fitur
| Fitur | Dependensi | Audit/Test | Aktivasi | KPI |
|---|---|---|---|---|
| Confidential Transfer/Balances | Token22, zk-token-proof, syscalls ZK | Audit komunitas; uji beban | Feature gates; canary | CU terkendali; error rate rendah |
| ZK payment proofs (on-chain) | alt_bn128, Groth16, Poseidon | Security review; regresi | POC → devnet → mainnet | Binding komitmen valid; DoS mitigasi |
| Deferred payments (x402) | HTTP message signatures | Functional tests | Langsung di produksi (dengan guardrails) | Latensi rendah; settlement async |
| Stealth addresses (aplikasi) | Dompet/SDK, ATA | N/A | Beta → produksi | Unlinkability terjaga |

### Privasi Jumlah: Confidential Transfer/Balances

Token22 Confidential Transfer/Balances enable merahasiakan jumlah dan saldo, dengan bukti ZK untuk kesetaraan, validitas ciphertext, dan range. Alur deposit–apply–withdraw memisahkan saldo pending dan available secara rahasia. Global auditor key memungkinkan akses baca selektif untuk kepatuhan. Status enablement dipengaruhi oleh audit ZK ElGamal program; integrasi harus menunggu hasil audit dan aktivasi yang aman.[^3][^26]

Tabel 10 — Alur instruksi Token22 dan implikasi biaya/privasi
| Instruksi | Tujuan | Implikasi |
|---|---|---|
| Initialize/UpdateMint | Persiapan mint untuk transfer rahasia | Governance/policy; harus inisialisasi bersama |
| ConfigureAccount | Persiapan akun token | Validasi bukti pubkey validity |
| Deposit/Withdraw | Setarakan saldo publik ↔ saldo rahasia | Bukti ZK, range proof; disiplin apply/withdraw |
| Transfer/TransferWithFee | Transfer rahasia antar akun | Bukti kesetaraan, rentang; fee disembunyikan |
| ApplyPendingBalance | Aktivasi saldo pending ke available | Memutus linkability saldo publik–rahasia |

### Stealth Addresses (Solusi Praktis di SPL)

Stealth addresses member unlinkability penerima via one-time addresses. Di Solana, pendekatan ini berada pada lapisan aplikasi/dompet dan memetakan stealth address ke akun token (ATA). PraktikERC-5564 di Ethereum dapat diadaptasi ke model akun Solana. Disiplin spending dan pemisahan domain operasional penting untuk menekan metadata leakage.[^19][^3]

Tabel 11 — Perbandingan ERC-5564 (Ethereum) vs pendekatan Solana (aplikasi)
| Aspek | ERC-5564 (EVM) | Solana (aplikasi) |
|---|---|---|
| Implementasi | Standar protokol | Lapisan dompet/aplikasi |
| Skema alamat | Stealth generation + scanning | One-time address mapping ke ATA |
| Privasi | Unlinkability penerima | Unlinkability di ledger; alamat token publik |
| Metadata | Tetap ada (pola on-chain) | Tetap ada; kebijakan spending mitigasi |

### Zero-Knowledge Payment Proofs (Deferred vs On-chain)

ZK payment proof di x402 berperan sebagai klaim kriptografis yang mengikat persyaratan pembayaran tanpa membuka detail sensitif. Pada deferred, bukti memverifikasi komitmen yang ditukar melalui HTTP Message Signatures, menjaga latensi rendah; pada on-chain settlement, bukti menjadi bagian dari transaksi confidential transfer yang diverifikasi di L1 melalui syscalls dan verifier yang efisien.[^28][^29][^16][^10]

## Risiko, Keterbatasan, dan Roadmap

Batasan on-chain STARK (ukuran bukti besar) dapat menekan throughput; mitigasi melalui batching dan verifier bertahap. Stabilitas syscalls (alt_bn128) mengikuti jadwal feature gate; integrasi harus siap dengan fallback dan monitoring.[^30][^31][^32]

Risiko audit/operasional:
- Trusted setup SNARK memerlukan ceremony yang terverifikasi dan terdokumentasi.[^1]
- Insiden bug soundness pada ZK proof program Solana menandakan kebutuhan akan audit komunitas yang ketat, uji regresi, aktivasi bertahap, dan canary deployments sebelum produksi penuh.[^21][^33]

Roadmap ekosistem ZK Solana:
- Peningkatan toolchain verifier dan Poseidon; eksplorasi STARK L1 on-chain dengan paper mutakhir sebagai rujukan, sambil menunggu angka CU aktual lintas use-case.[^10]
- Proposal SIMD-0153 untuk penggantian ZK Token Proof Replacement menandakan aktivitas standardisasi yang berkelanjutan.[^27]

Tabel 12 — Risiko teknis dan mitigasi
| Risiko | Area | Mitigasi |
|---|---|---|
| Bukti besar STARK | On-chain verification | Batching; verifier bertahap; payload kontrol |
| Jadwal syscalls | alt_bn128/feature gates | Regresi; fallback verifikasi; monitoring |
| CRS SNARK | Trusted setup ceremony | Audit MPC; transparansi; chain-of-trust |
| Soundness ZK | Verifier program | Audit komunitas; gated activation; canary |

## Lampiran A: Data & Benchmark Pendukung

Tabel 13 — Benchmark ringkas SNARK vs STARK (indikatif)
| Metrik | SNARK | STARK | Sumber |
|---|---|---|---|
| Proof size | ≈288 B | ≈45 KB | [^11] |
| Verifier time | ≈10 ms | ≈16 ms | [^11] |
| Prover time | ≈2.3 s | ≈1.6 s | [^11] |

Tabel 14 — Estimasi CU ZK Compression (indikatif)
| Komponen | Estimasi CU | Sumber |
|---|---|---|
| Verifier proof | ~100k | [^12] |
| System use | ~100k | [^12] |
| Per compressed RW | ~6k | [^12] |

## Lampiran B: Library & Sumber Lanjutan

Tabel 15 — Ringkasan library/tooling
| Library/Tool | Bahasa | Lisensi | Status audit | Peran | Kesesuaian Solana |
|---|---|---|---|---|---|
| groth16-solana | Rust | — | — | Verifier Groth16 on-chain | alt_bn128 syscalls | [^7] |
| light-poseidon | Rust | — | Audit publik | Hash Poseidon | State tree/Merkle | [^8] |
| @zk-kit | TS/JS | MIT | Beberapa paket ter-audit | Primitif ZK (Poseidon, IMT/SMT) | Off-chain data structures | [^31] |
| solana-zk-sdk | Rust | Apache-2.0 | Vended program | Verifier + ElGamal proof | zk-token-proof | [^22] |
| snarkjs | JS/WASM | GPL-3.0 | — | Trusted setup; proof gen/verify | Off-chain workflow | [^34] |
| circom | Rust/DSL | GPL-3.0 | Tooling analisis | Compiler sirkuit R1CS | Off-chain circ + verifier Rust | [^35] |

Tabel 16 — Sumber utama
| Nama | Deskripsi | URL | Kategori |
|---|---|---|---|
| Helius Blog (ZK on Solana) | Overview ZK di Solana | https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana | Ekosistem |
| Light Protocol (ZK Compression) | Protokol kompresi state ZK | https://lightprotocol.com/ | Protokol |
| Light Protocol GitHub | Implementasi dan uji | https://github.com/Lightprotocol/light-protocol | Implementasi |
| ZKCompression Learn | Model akun terkompresi | https://www.zkcompression.com/learn/core-concepts/compressed-account-model | Dokumentasi |
| IACR ePrint 2025/1741 | STARK L1 on-chain di Solana | https://eprint.iacr.org/2025/1741.pdf | Akademik |
| Ethereum EIP-196/197 | Precomp pairing BN254 | https://eips.ethereum.org/EIPS/eip-196; https://eips.ethereum.org/EIPS/eip-197 | Referensi kurva |
| Solana Accounts Docs | Model akun runtime | https://solana.com/docs/core/accounts | Runtime |
| Solana PR Poseidon | Aktivasi syscalls Poseidon | https://github.com/solana-labs/solana/pull/27961 | Syscalls |
| Solana PR alt_bn128 | Aktivasi alt_bn128 syscalls | https://github.com/solana-labs/solana/pull/32680 | Syscalls |
| ERC-5564 Guide | Stealth addresses di EVM | https://www.quicknode.com/guides/ethereum-development/wallets/how-to-use-stealth-addresses-on-ethereum-eip-5564 | Stealth |
| Token22 Confidential Transfer | Dokumentasi ekstensi privasi token | https://solana.com/docs/tokens/extensions/confidential-transfer | SPL |

## Information Gaps (yang perlu ditangani)
- Hasil audit final dan status enablement Confidential Transfer pasca-penonaktifan; koordinasi dengan temuan Code4rena dan mitigasi bug soundness.[^33][^21]
- Angkabiaya compute aktual verifikasi ZK pada confidential transfers (selain rujukan ZK Compression); perlu benchmark on-chain khusus workload x402.[^12][^9]
- Spesifikasi formal adaptasi stealth addresses ke model akun Solana (peta ke SPL/ATA); usul standarisasi lintas dompet.[^19]
- Detail implementasi Arcium/MPC relevan untuk operasi pembayaran privat (asumsi trust, overhead, audit selektif).[^36]
- Ketersediaan alt_bn128 di mainnet (feature gates, biaya, stabilitas) dan implikasi pada pipeline verifier Rust/Solana program.[^30][^31][^32]
- Roadmap SIMD-0153 dan dampak replace terhadap program zk-token-proof.[^27]
- Bukti performa verifikasi STARK L1 on-chain di Solana (angka CU spesifik) dari studi/production pipeline.[^10]

---

## Referensi

[^1]: Chainlink — zk-SNARK vs zk-STARK. https://chain.link/education-hub/zk-snarks-vs-zk-starks  
[^2]: Consensys — Zero-Knowledge Proofs: STARKs vs SNARKs. https://consensys.io/blog/zero-knowledge-proofs-starks-vs-snarks  
[^3]: Solana Docs — Confidential Transfer. https://solana.com/docs/tokens/extensions/confidential-transfer  
[^4]: OKX Learn — Privacy on Solana: Confidential Balances. https://www.okx.com/learn/solana-blockchain-privacy-confidential-balances  
[^5]: MDPI Information — Evaluating the Efficiency of zk-SNARK, zk-STARK, and Bulletproofs. https://www.mdpi.com/2078-2489/15/8/463  
[^6]: StarkWare — STARK paper (2018). https://starkware.co/wp-content/uploads/2022/05/STARK-paper.pdf  
[^7]: Light Protocol GitHub — Groth16 verifier di Solana. https://github.com/Lightprotocol/groth16-solana  
[^8]: light-poseidon (crates.io). https://crates.io/crates/light-poseidon  
[^9]: Helius Blog — Zero-Knowledge Proofs: Its Applications on Solana. https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana  
[^10]: IACR ePrint 2025/1741 — Full L1 On-Chain ZK-STARK+PQC Verification on Solana. https://eprint.iacr.org/2025/1741.pdf  
[^11]: Ethereum StackExchange — zk-SNARKs vs zk-STARKs vs Bulletproofs (Updated). https://ethereum.stackexchange.com/questions/59145/zk-snarks-vs-zk-starks-vs-bulletproofs-updated  
[^12]: ZKCompression — Compressed Account Model. https://www.zkcompression.com/learn/core-concepts/compressed-account-model  
[^13]: Solana Docs — Accounts. https://solana.com/docs/core/accounts  
[^14]: Solana PR — Poseidon syscalls (#27961). https://github.com/solana-labs/solana/pull/27961  
[^15]: Solana PR — alt_bn128 syscalls (#32680). https://github.com/solana-labs/solana/pull/32680  
[^16]: EIP-196 — Precompiled contracts for BN254. https://eips.ethereum.org/EIPS/eip-196  
[^17]: EIP-197 — Precompiled contracts for BN254 pairing check. https://eips.ethereum.org/EIPS/eip-197  
[^18]: QuickNode Guide — ERC-5564 Stealth Addresses on Ethereum. https://www.quicknode.com/guides/ethereum-development/wallets/how-to-use-stealth-addresses-on-ethereum-eip-5564  
[^19]: Helius Blog — Confidential Balances. https://www.helius.dev/blog/confidential-balances  
[^20]: SPL Confidential Token Deep Dive — Encryption (Twisted ElGamal). https://spl.solana.com/confidential-token/deep-dive/encryption#twisted-elgamal-encryption  
[^21]: zksecurity Blog — Phantom challenge soundness bug in Solana ZK proof program. https://blog.zksecurity.xyz/posts/solana-phantom-challenge-bug/  
[^22]: solana_zk_sdk (Docs.rs). https://docs.rs/solana-zk-sdk  
[^23]: solana_zk_sdk (Crates.io). https://crates.io/crates/solana-zk-sdk  
[^24]: Solana Docs — ZK Token Proof Program. https://docs.solanalabs.com/runtime/zk-token-proof  
[^25]: SPL Confidential Token Deep Dive — Global Auditor. https://spl.solana.com/confidential-token/deep-dive/overview#global-auditor  
[^26]: Helius Blog — A Hitchhiker's Guide to Solana Program Security. https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security  
[^27]: SIMD-0153 — ZK Token Proof replacements. https://github.com/solana-foundation/solana-improvement-documents/pull/153  
[^28]: Cloudflare — x402 Foundation. https://blog.cloudflare.com/x402/  
[^29]: Bitget Academy — What Is x402 Protocol. https://web3.bitget.com/en/academy/what-is-x402-protocol-inside-coinbases-new-standard-for-onchain-and-ai-payments  
[^30]: Solana Foundation — Feature Gate Activation Schedule. https://github.com/solana-labs/solana/wiki/Feature-Gate-Activation-Schedule  
[^31]: Agave — Feature Gate Activation Schedule. https://github.com/anza-xyz/agave/wiki/Feature-Gate-Activation-Schedule  
[^32]: Code4rena — 2025-08 Solana Foundation: Confidential Transfer Audit. https://github.com/code-423n4/2025-08-solana-foundation  
[^33]: Arcium — The Rebirth of Privacy on Solana. https://www.arcium.com/articles/the-rebirth-of-privacy-on-solana  
[^34]: iden3/snarkjs (GitHub). https://github.com/iden3/snarkjs  
[^35]: iden3/circom (GitHub). https://github.com/iden3/circom  
[^36]: zk-kit/zk-kit (GitHub). https://github.com/privacy-scaling-explorations/zk-kit