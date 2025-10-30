# zk-SNARKs vs zk-STARKs untuk Implementasi di Blockchain Solana: Performa, Biaya, Keamanan, dan Kompatibilitas untuk Protokol Pembayaran x402

## 1. Pendahuluan: Mengapa x402 di Solana Membutuhkan ZKP

Protokol x402 menghidupkan kembali semantics HTTP 402 “Payment Required” untuk menjahit pembayaran on-chain ke dalam siklus permintaan–respons web, sehingga pembayaran berfungsi sebagai autentikasi tanpa состоя (stateless). Pada praktiknya, server menolak akses dengan 402, klien menghadirkan bukti pembayaran (misalnya transaksi SPL token yang ditandatangani), lalu server memverifikasi dan menyelesaikan pembayaran sebelum memberikan akses. x402 dirancang agar agnostik terhadap blockchain dan token, namun menuntut verifikasi on-chain yang cepat, murah, dan aman agar latensi HTTP tetap rendah.[^18][^19][^20]

Di sisi blockchain, Solana menawarkan eksekusi paralel, biaya per transaksi yang rendah, dan settlement cepat—semuanya cocok untuk micropayments dan alur autentikasi berbasis HTTP. Namun, pertumbuhan state yang eksponensial (ratusan juta akun) serta batas ukuran transaksi (~1232 byte) menuntut primitive yang menekan biaya state tanpa mengorbankan keamanan. Di sinilah bukti nol-pengetahuan (zero-knowledge proofs, ZKP) berperan: kompresi state via validity proofs (misalnya ZK Compression), privasi jumlah via confidential transfers, serta bukti kelayakan/availability dana tanpa membuka detail sensitif.[^9][^12][^13][^14]

Dua paradigma bukti—zk-SNARKs dan zk-STARKs—hadir dengan trade-off berbeda:
- zk-SNARKs memberikan bukti sangat kecil dan verifikasi cepat, ideal untuk on-chain verification yang sering, tetapi membutuhkan trusted setup (CRS) dan tidak tahan kuantum.
- zk-STARKs menghilangkan trusted setup, tahan kuantum, dan skalabilitas kuasi-linier pada prover/verifier, tetapi ukuran bukti lebih besar serta verifikasi on-chain lebih mahal.

Pada x402, implikasinya langsung terasa:
- Untuk verifikasi berulang dan footprint transaksi minimal, SNARK unggul (Groth16/PLONK).
- Untuk transparansi penuh, ketahanan kuantum, atau dataset besar, STARK relevan—dengan strategi batching/verifier bertahap agar beban L1 terkendali.[^5][^6][^7][^10]

Informasi gaps yang perlu diakui di awal:
- Benchmark terstandarisasi lintas-sirkuit besar pada workload Solana masih minim.
- Estimasi gas EVM tidak translate otomatis ke CU Solana; perlu karakterisasi runtime Solana.
- Status ketersediaan alt_bn128 di mainnet vs devnet/testnet dapat berubah; konfirmasi terkini diperlukan.
- Bukti performa verifikasi STARK L1 on-chain Solana dari pipeline riset belum menyediakan angka CU resmi lintas use-case; beberapa hasil masih indikatif.[^10][^12][^16]

Bagian berikut memaparkan landasan arsitektur Solana untuk ZKP, trade-off mendasar SNARK vs STARK, kinerja/keamanan/biaya, kompatibilitas library/tooling, rekomendasi untuk x402, playbook implementasi, hingga risiko dan roadmap.

## 2. Landasan Arsitektur Solana untuk ZKP

Solana mengadopsi model akun (accounts) sebagai sumber kebenaran. Setiap program beroperasi pada state yang tersimpan dalam akun, dan eksekusi dibatasi oleh compute units (CU). Pada desain x402, konsekuensinya: (i) verifikasi bukti ZK sebaiknya memiliki footprint kecil pada payload transaksi, (ii) verifier on-chain harus hemat CU, dan (iii) struktur data (misalnya Merkle tree) harus selaras dengan paralelisme eksekusi.[^13]

Dua syscalls krusial mengubah kelayakan ZKP di L1 Solana:
- Poseidon hash: hash ramah-ZK yang menurunkan biaya on-chain dan kompleksitas sirkuit; aktivasi syscalls Poseidon tersedia di runtime, memudahkan state trees untuk ZK Compression dan verifier.[^15]
- alt_bn128: operasi kurva pairing (BN254) untuk verifikasi SNARK; PR syscalls alt_bn128 membuka verifier Groth16/PLONK on-chain dengan primitif pairing kompatibel EIP-196/197 (precompiles pairing di Ethereum).[^16][^17][^18][^19]

ZK Compression Light Protocol memanfaatkan Poseidon dan Groth16 verifier on-chain untuk memindahkan state off-chain (ledger) dengan bukti validitas ringkas (≈128 B). Bukti ini menjaga headroom transaksi di bawah batas ~1232 byte, sementara root state tree on-chain menyediakan ringkasan integritas. Dengan parameter CU indikatif verifier ≈100k CU dan overhead sistem ≈100k CU, SNARK menjaga kelayakan verifikasi on-chain yang sering.[^9][^12][^20]

Untuk merangkum peran syscalls ZK, lihat Tabel 1.

Tabel 1 — Ringkasan syscalls ZK dan peran on-chain
| Syscall | Fungsi | Dampak on-chain | Kesesuaian bukti |
|---|---|---|---|
| Poseidon hash | Hash ramah-ZK untuk sirkuit/Merkle | Biaya hash rendah; struktur pohon efisien | SNARK/STARK untuk state roots |
| alt_bn128 | Pairing BN254; G1/G2 ops | Verifier SNARK on-chain viable | Groth16/PLONK verifier |
| g1/g2 compression | Memperkecil representasi bukti | Payload transaksi berkurang | Groth16 proof sizes |
| curve25519/ristretto | Operasi kurva alternatif | Privasi/enkripsi spesifik | Enkripsi/identitas (didukung SPL) |

Konsekuensi desain untuk x402: gunakan bukti sangat ringkas untuk verifikasi sering dan pilih struktur data yang kompatibel dengan Poseidon. alt_bn128 memungkinkan verifier SNARK on-chain yang efisien, dipadukan strategi CU (batching, verifikasi bertahap) dan pemilihan library verifier matang.[^15][^16][^17][^18][^19]

## 3. Perbandingan Fundamental: zk-SNARKs vs zk-STARKs

zk-SNARKs memiliki sifat succinctness: bukti konstan kecil, verifier cepat, cocok untuk on-chain verification yang berulang. Namun Groth16 membutuhkan trusted setup per sirkuit (CRS), dan asumsi kurva pairing tidak tahan kuantum; PLONK menawarkan universal setup dengan verifikasi tetap efisien.[^1][^2]

zk-STARKs menghilangkan trusted setup, bergantung pada fungsi hash, tahan kuantum, dan memiliki skalabilitas kuasi-linier pada prover/verifier. Biaya on-chain STARK lebih tinggi karena ukuran bukti yang lebih besar; batching dan verifier bertahap diperlukan untuk kontrol biaya L1.[^6][^7]

Tabel 2 — Perbandingan sifat SNARK vs STARK
| Aspek | SNARK (Groth16/PLONK) | STARK |
|---|---|---|
| Trusted setup | Diperlukan (CRS; universal pada PLONK) | Tidak ada |
| Ukuran bukti | Sangat kecil (≈100–200 B) | Lebih besar (puluhan–ratusan KB) |
| Waktu verifikasi | Sangat cepat | Cepat, on-chain lebih mahal |
| Ketahanan kuantum | Rendah (kurva pairing) | Tinggi (hash) |
| Skala prover | Baik; relatif ke sirkuit | Kuasi-linier; unggul pada dataset besar |
| Asumsi kriptografi | Pairing-friendly curves | Hash + info-teoretis |
| Use-case khas | Frequent on-chain verification | Transparent, large-scale proofs |

Implikasi untuk x402:
- SNARK: frequent on-chain verification, bukti sangat kecil, verifikasi milidetik; cocok settle cepat dan throughput tinggi—dengan proses trusted setup yang kredibel.[^5]
- STARK: pipeline tanpa trusted setup; cocok untuk dataset besar atau kebijakan transparansi/ketahanan kuantum—dengan strategi batching/verifier bertahap.[^6][^7][^10]

## 4. Kinerja & Biaya On-Chain (Compute Units, Payload, Throughput)

Benchmark komunitas memberi indikasi relatif:
- Proof size: SNARK ≈288 B vs STARK ≈45 KB.
- Verifier time: SNARK ≈10 ms vs STARK ≈16 ms.
- Prover time: SNARK ≈2.3 s vs STARK ≈1.6 s.[^11]

ZK Compression di Solana memanfaatkan Groth16 (≈128 B per bukti), verifier ≈100k CU, overhead sistem ≈100k CU, dan tambahan ≈6k CU per RW akun terkompresi. Batas transaksi ≈1232 byte menjaga headroom untuk payload verifikasi dan instruksi lain.[^9][^12]

Tabel 3 — Benchmark indikatif SNARK vs STARK
| Metrik | SNARK | STARK | Catatan |
|---|---|---|---|
| Proof size | ≈288 B | ≈45 KB | Ringkas SNARK bermanfaat pada batas transaksi |
| Verifier time | ≈10 ms | ≈16 ms | SNARK lebih cepat untuk verifier |
| Prover time | ≈2.3 s | ≈1.6 s | STARK unggul untuk prover kuasi-linier |

Tabel 4 — Estimasi CU ZK Compression
| Komponen | Estimasi CU | Implikasi |
|---|---|---|
| Verifier proof | ~100k | Perencanaan kapasitas untuk throughput tinggi |
| System use | ~100k | Overhead tetap per transaksi |
| Per compressed RW | ~6k | Biaya linear pada jumlah akun |
| Proof size | ~128 B | Memenuhi batas transaksi |

Catatan penting: angka CU/overhead STARK pada Solana dari pipeline riset menunjukkan mean verifier STARK ≈1.10×10^6 CU dan mean finalize signature PQC ≈5.01×10^5 CU, dengan anggaran transaksi Solana sekitar 1.4×10^6 CU. Dengan proof size STARK ≈4.4 KB, verifikasi berskala linier terhadap ukuran bukti; batching/verifier bertahap menjadi strategi wajib untuk workload x402 yang sensitif latensi.[^10]

Implikasi x402: gunakan batching untuk amortisasi CU verifier; target bukti kecil untuk pembayaran sering; jadwal verifier bertahap pada STARK untuk menahan biaya L1. Pertahankan kontrol ukuran transaksi agar headroom tersedia bagi instruksi lain.[^10][^12]

## 5. Keamanan & Model Kepercayaan (Trusted Setup, Quantum-Resistance)

Perbedaan mendasar:
- SNARK: membutuhkan trusted setup (CRS); kompromi CRS dapat memungkinkan bukti palsu. Asumsi kurva pairing tidak tahan kuantum. Transparansi bergantung pada ceremony dan audit.[^1]
- STARK: transparansi parameter (tanpa CRS), tahan kuantum. Risiko operative berpindah ke fungsi hash dan kontrol keacakan publik.[^6]

Insiden bug soundness pada ZK proof program Solana (Phantom challenge) menegaskan kebutuhan audit ketat, uji regresi, dan aktivasi bertahap. Perbaikan dengan menyerap semua nilai prover ke dalam transkrip Fiat–Shamir (“hash everything the prover sends”) memperbaiki soundness protokol.[^21]

Tabel 5 — Matriks keamanan SNARK vs STARK
| Aspek | SNARK | STARK |
|---|---|---|
| Trusted setup | Diperlukan (CRS) | Tidak |
| Transparansi | Bergantung setup | Tinggi |
| Ketahanan kuantum | Tidak | Ya |
| Asumsi | Kurva pairing | Hash/info-teoretis |
| Risiko operasional | CRS kompromi | Parameter keacakan, hash |

Untuk x402, SNARK cocok jika verifikasi kecil/sering dan ceremony trusted setup dapat dioperasikan dengan audit publik; STARK bila kebijakan mengharuskan transparansi kuat dan ketahanan kuantum, dengan toleransi ukuran bukti dan biaya verifikasi on-chain yang lebih tinggi.[^1][^6][^21]

## 6. Kemudahan Implementasi & Tooling di Solana

Ekosistem Rust/JS-TS memungkinkan alur hibrida: sirkuit dan bukti dihasilkan off-chain; verifikasi on-chain dijalankan di program Rust memanfaatkan syscalls ZK.

- groth16-solana: library verifier Groth16 untuk Solana, memanfaatkan alt_bn128 dan kompresi g1/g2 untuk on-chain verification yang efisien.[^7]
- light-poseidon: crate Poseidon kompatibel Circom, audited, sesuai untuk state tree/Merkle proofs.[^8]
- @zk-kit: monorepo primitif ZK JS/TS (Poseidon, IMT/LeanIMT/SMT), berguna menyusun struktur data klien/off-chain sebelum diverifikasi on-chain melalui Rust verifier.[^31]
- solana-zk-sdk: crate resmi untuk verifier dan ElGamal proof program (zk-token-proof).[^22][^23][^24]
- Ekosistem Light Protocol: ZK Compression dengan verifier Groth16 dan pipeline state tree.[^9][^12][^20]

Tabel 6 — Peta kompatibilitas library ↔ syscalls/program
| Library | alt_bn128 | Poseidon | g1/g2 compression | zk-token-proof | Light Protocol |
|---|---|---|---|---|---|
| groth16-solana | Ya (pairing) | Tidak langsung | Ya | Tidak langsung | Ya |
| light-poseidon | Tidak langsung | Ya (hash) | Tidak | Tidak | Ya |
| @zk-kit (JS/TS) | Tidak langsung | Indirect | Tidak | Tidak | Tidak |
| solana-zk-sdk (resmi) | Ya | Ya | Ya | Ya | Tidak langsung |

Interpretasi: JS/TS library menghasilkan artefak off-chain; verifikasi on-chain membutuhkan Rust verifier dan syscalls. light-poseidon dan groth16-solana adalah pilar integrasi di sisi Solana L1, sementara @zk-kit mempercepat komponen struktur data di klien.[^7][^8][^22][^31][^9]

## 7. Rekomendasi untuk Protokol x402: SNARK vs STARK

Kriteria utama x402: throughput tinggi, privasi jumlah yang dapat diaudit, bukti kecil pada verifikasi sering, serta kesiapan kebijakan transparansi/ketahanan kuantum.

- Gunakan SNARK untuk:
  - Frequent on-chain verification (misalnya bukti kelayakan/availability dana).
  - Kebutuhan bukti kecil yang menjaga headroom transaksi.
  - Integrasi dengan zk-token-proof dan enkripsi ElGamal untuk confidential amounts (Token22) dengan opsi global auditor key.[^3][^25][^26]

- Gunakan STARK untuk:
  - Transparansi dan ketahanan kuantum prioritas kebijakan.
  - Dataset/witness besar; skala kuasi-linier prover/verifier memberi nilai.
  - Strategi batching/verifier bertahap untuk menekan biaya L1.[^10]

Tabel 7 — Panduan pemilihan untuk x402
| Kebutuhan | Rekomendasi | Alasan | Implikasi biaya |
|---|---|---|---|
| Frequent verification, bukti kecil | SNARK | Bukti sangat kecil, verifier cepat | CU verifier rendah per bukti |
| Confidential amounts (auditability) | SNARK + ElGamal | Skema enkripsi dan bukti ZK matang | CU moderat; audit selektif via global auditor |
| Transparansi + tahan kuantum | STARK | Tanpa trusted setup; hash-based | CU lebih tinggi; perlu batching |
| Dataset/witness besar | STARK | Prover kuasi-linier; scalable | Biaya on-chain perlu kontrol pipeline |

Privasi jumlah berbasis Token22 confidential transfer/balances memberikan fondasi yang tepat, dengan catatan status audit dan aktivasi yang harus dimonitor ketat.[^3][^23][^25][^26]

## 8. Playbook Implementasi (End-to-End) untuk x402 + Solana

Dua alur pembayaran x402:

- On-chain settlement: klien memulai 402 → menyusun bukti pembayaran + ZKP → transaksi token confidential (Confidential Transfer/Balances) → akses diberikan setelah konfirmasi L1. ZKP memvalidasi jumlah, rentang, dan ciphertext.[^19][^3]
- Deferred payments: klien memaparkan komitmen berbayar via HTTP Message Signatures → ZKP bahwa komitmen memenuhi syarat (availability, kepatuhan) → akses diberikan segera → penyelesaian finansial dilakukan kemudian, tanpa biaya L1 tinggi saat permintaan.[^18][^29]

Komponen:
- Syscalls ZK: alt_bn128 (pairing), Poseidon (hash), kompresi g1/g2.[^16][^15]
- Library verifier: groth16-solana, solana-zk-sdk (verifier + ElGamal program), light-poseidon untuk state trees.[^7][^22][^8]
- x402 integration: headers membawa bukti, JWK verification, binding komitmen ke resource, DoS/fee controls.[^18][^29][^10]

Pengujian: beban CU pada on-chain settlement, stabilitas verifier, audit soundness, aktivasi bertahap, fallback bila gangguan fitur.[^21]

Tabel 8 — Checklist implementasi per fitur
| Fitur | Dependensi | Audit/Test | Aktivasi | KPI |
|---|---|---|---|---|
| Confidential Transfer/Balances | Token22, zk-token-proof, syscalls ZK | Audit komunitas; uji beban | Feature gates; canary | CU terkendali; error rate rendah |
| ZK payment proofs (on-chain) | alt_bn128, Groth16, Poseidon | Security review; regresi | POC → devnet → mainnet | Binding komitmen valid; DoS mitigasi |
| Deferred payments (x402) | HTTP message signatures | Functional tests | Produksi (dengan guardrails) | Latensi rendah; settlement async |
| Stealth addresses (aplikasi) | Dompet/SDK, ATA | N/A | Beta → produksi | Unlinkability terjaga |

### 8.1 Privasi Jumlah: Confidential Transfer/Balances

Token22 Confidential Transfer/Balances memungkinkan merahasiakan jumlah dan saldo dengan bukti ZK (equality, ciphertext validity, range). Alur deposit–apply–withdraw memisahkan saldo pending/available untuk mitigasi front-running. Global auditor key memungkinkan akses baca selektif untuk kepatuhan. Status enablement dipengaruhi audit ZK ElGamal program; integrasi menunggu hasil audit dan aktivasi aman.[^3][^25][^26][^21]

Tabel 9 — Alur instruksi Token22 dan implikasi biaya/privasi
| Instruksi | Tujuan | Implikasi |
|---|---|---|
| Initialize/UpdateMint | Persiapan mint untuk transfer rahasia | Governance/policy; inisialisasi bersama |
| ConfigureAccount | Persiapan akun token | Validasi bukti pubkey validity |
| Deposit/Withdraw | Setarakan saldo publik ↔ saldo rahasia | Bukti ZK, range proof; disiplin apply/withdraw |
| Transfer/TransferWithFee | Transfer rahasia antar akun | Bukti kesetaraan, rentang; fee disembunyikan |
| ApplyPendingBalance | Aktivasi saldo pending → available | Memutus linkability saldo publik–rahasia |

### 8.2 Stealth Addresses (Solusi Praktis di SPL)

Stealth addresses memberikan unlinkability penerima via one-time addresses. Di Solana, pendekatan ini berada di lapisan aplikasi/dompet dan memetakan stealth address ke Associated Token Account (ATA). Praktik ERC-5564 di Ethereum dapat diadaptasi ke model akun Solana; kebijakan spending dan pemisahan domain operasional penting menekan metadata leakage.[^17]

Tabel 10 — ERC-5564 (Ethereum) vs pendekatan Solana (aplikasi)
| Aspek | ERC-5564 (EVM) | Solana (aplikasi) |
|---|---|---|
| Implementasi | Standar protokol | Lapisan dompet/aplikasi |
| Skema alamat | Stealth generation + scanning | One-time address mapping ke ATA |
| Privasi | Unlinkability penerima | Unlinkability di ledger; alamat token publik |
| Metadata | Tetap ada (pola on-chain) | Tetap ada; kebijakan spending mitigasi |

### 8.3 Zero-Knowledge Payment Proofs (Deferred vs On-chain)

ZK payment proof di x402 berperan sebagai klaim kriptografis yang mengikat persyaratan pembayaran tanpa membuka detail sensitif. Pada deferred, bukti memverifikasi komitmen melalui HTTP Message Signatures, menjaga latensi rendah; pada on-chain settlement, bukti menjadi bagian transaksi confidential transfer diverifikasi L1 via syscalls/verifier efisien.[^18][^29][^16][^10]

## 9. Risiko, Keterbatasan, dan Roadmap

Batasan on-chain STARK (ukuran bukti besar) dapat menekan throughput; mitigasi via batching/verifier bertahap. Stabilitas syscalls (alt_bn128) mengikuti jadwal feature gate; integrasi harus siap fallback dan monitoring.[^10][^30][^31][^32]

Risiko audit/operasional:
- Trusted setup SNARK memerlukan ceremony terverifikasi/terdokumentasi.[^1]
- Insiden bug soundness ZK proof program menekankan audit komunitas ketat, uji regresi, aktivasi bertahap, dan canary deployments.[^21]

Roadmap ekosistem ZK Solana:
- Peningkatan toolchain verifier dan Poseidon; eksplorasi STARK L1 on-chain berdasarkan paper mutakhir, sambil menunggu angka CU aktual lintas use-case.[^10]
- SIMD-0153 (penggantian ZK Token Proof) menandakan aktivitas standardisasi berkelanjutan.[^27]

Tabel 11 — Risiko teknis dan mitigasi
| Risiko | Area | Mitigasi |
|---|---|---|
| Bukti besar STARK | On-chain verification | Batching; verifier bertahap; payload kontrol |
| Jadwal syscalls | alt_bn128/feature gates | Regresi; fallback verifikasi; monitoring |
| CRS SNARK | Trusted setup ceremony | Audit MPC; transparansi; chain-of-trust |
| Soundness ZK | Verifier program | Audit komunitas; gated activation; canary |

Informasi gaps (konfirmasi diperlukan):
- Benchmark terstandarisasi lintas-sirkuit besar pada workload Solana (pustaka dan runner produksi).
- Hasil audit final dan status enablement Confidential Transfer pasca-penonaktifan; mitigasi pasca-bug soundness.
- Angkabiaya compute aktual verifikasi ZK pada confidential transfers (di luar ZK Compression); benchmark on-chain workload x402.
- Spesifikasi formal adaptasi stealth addresses ke model akun Solana; peta ke SPL/ATA; standardisasi dompet.
- Ketersediaan alt_bn128 di mainnet (feature gates, biaya, stabilitas) dan implikasi pipeline verifier Rust/Solana program.
- Roadmap SIMD-0153 dan dampak replace terhadap program zk-token-proof.
- Bukti performa verifikasi STARK L1 on-chain di Solana (angka CU spesifik) dari pipeline riset/produksi.[^10][^12][^16][^21][^27]

## 10. Kesimpulan & Rekomendasi Eksekutif

Pada konteks Solana saat ini—batas transaksi ketat, verifikasi on-chain sering, permintaan efisiensi state—zk-SNARKs (Groth16) menawarkan bukti ≈128 B dan verifikasi milidetik yang membuatnya pilihan optimal untuk ZK Compression dan pipeline confidential transfers. zk-STARKs tetap relevan untuk use case yang mengutamakan transparansi tanpa trusted setup, ketahanan kuantum, dan skala pada dataset besar, dengan catatan biaya verifikasi on-chain lebih tinggi dan kebutuhan optimasi pipeline.

Kombinasi keduanya, dengan dukungan Poseidon dan alt_bn128, membentuk masa depan ZK di Solana: SNARK untuk verifikasi ringkas berulang, STARK untuk integritas berskala besar dan kebijakan transparansi. Ekosistem node ops dan toolchain matang akan menjadi kunci keberhasilan implementasi.

Rekomendasi eksekutif:
- Pilih SNARK untuk verifikasi berulang on-chain, bukti kecil, throughput tinggi, dan privasi jumlah (Token22 Confidential Transfer/Balances).
- Pilih STARK untuk kebijakan transparansi dan ketahanan kuantum, atau dataset besar, dengan strategi batching/verifier bertahap untuk kontrol biaya L1.
- Standarisasi integrasi x402 + Solana (on-chain settlement vs deferred), manajemen CU verifier, dan mekanisme fallback bila feature gates berubah.

Dalam horizon 6–12 bulan, diharapkan aktivasi syscalls lebih stabil, rilis library auditor kuat, dan pipeline verifikasi STARK L1 teruji, sehingga arsitek dapat memilih protokol ZK yang tepat secara case-by-case dengan metrik kinerja, keamanan, dan biaya yang lebih jelas.[^5][^9][^10]

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
[^19]: Solana Developers — Get started x402 on Solana. https://solana.com/developers/guides/getstarted/intro-to-x402  
[^20]: Light Protocol — ZK Compression Protocol for Solana (GitHub). https://github.com/Lightprotocol/light-protocol  
[^21]: zksecurity Blog — Phantom challenge soundness bug in Solana ZK proof program. https://blog.zksecurity.xyz/posts/solana-phantom-challenge-bug/  
[^22]: solana_zk_sdk (Docs.rs). https://docs.rs/solana-zk-sdk  
[^23]: solana_zk_sdk (Crates.io). https://crates.io/crates/solana-zk-sdk  
[^24]: Solana Docs — ZK Token Proof Program. https://docs.solanalabs.com/runtime/zk-token-proof  
[^25]: SPL Confidential Token Deep Dive — Encryption (Twisted ElGamal). https://spl.solana.com/confidential-token/deep-dive/encryption#twisted-elgamal-encryption  
[^26]: SPL Confidential Token Deep Dive — Global Auditor. https://spl.solana.com/confidential-token/deep-dive/overview#global-auditor  
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