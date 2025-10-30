# Strategi Implementasi ZKx401 di Solana: Integrasi @payai/x402-solana, Arsitektur Program, dan Rencana Deploy

## Pendahuluan & Ruang Lingkup

Dokumen ini merumuskan strategi implementasi “ZKx401” pada blockchain Solana dengan tetap menjaga kompatibilitas terhadap protokol pembayaran HTTP-native x402 dan SDK @payai/x402-solana. ZKx401 dipahami sebagai arahan untuk menambah fitur privasi berbasis nol-pengetahuan (zero-knowledge, ZK) di atas lapisan pembayaran x402. Karena belum ada spesifikasi publik terpisah untuk ZKx401, dokumen ini menetapkan teknis rilis minimal yang terverifikasi: (i) integrasi dengan ekosistem x402 (standar Coinbase dan implementasi PayAI), serta (ii) pemanfaatan primitive privasi Solana yang sudah ada untuk “privacy of amount and/or state”, termasuk Confidential Transfer (ekstensi Token-2022) dan/atau ZK Compression (Light Protocol). Pendekatan ini memastikan kepatuhan terhadap x402 v1 dan kompatibilitas SDK @payai/x402-solana sembari menyiapkan lorong evolusi menuju privasi yang lebih kuat.[^1][^2][^3][^4][^5]

Tujuan implementasi:
- Kompatibilitas end-to-end dengan protokol x402 dan SDK PayAI (klien, server, fasilitator), termasuk preservación alur 402 Payment Required, X-PAYMENT, verifikasi, dan penyelesaian.
- Penambahan fitur privasi yang aman dan dapat diaudit, minimal menutup “amount” dan secara bertahap “state” bila diperlukan.
- Jembatan kompatibilitas antara “amount privacy” (Confidential Transfer) dan “state privacy/compression” (ZK Compression) di bawah paywall x402.

Ruang lingkup meliputi integrasi program Solana (Token-2022, ZK Token Proof Program), arsitektur klien/server/fasilitator, pertimbangan deployment (RPC, gasless, SLO/SLA), pengujian menyeluruh, dan strategi Go/No-Go hingga scale-up. Pendekatan ini memanfaatkan syscalls ZK (alt_bn128, Poseidon) untuk verifikasi bukti yang efisien dan interoperabel.[^3][^4]

Informasi yang belum lengkap (information gaps):
- Tidak ada spesifikasi publik terpisah untuk “ZKx401”; diasumsikan superset/fitur privasi berbasis ZK di atas x402.
- API/arsitektur internal fasilitator PayAI (selain endpoint umum x402) memerlukan klarifikasi untuk integrasi produksi.
- Status reopening Confidential Transfer pasca audit di mainnet/devnet belum terdokumentasi resmi (perlu pemantauan).
- Benchmark independen performa ZK Compression di produksi (CU, throughput) dan artefak operasional Photon/Forester.
- Pola operasional production-grade untuk kombinasi Confidential Transfer + x402 + gasless (Kora) belum banyak Dipublikasikan.[^4][^5]

## Landasan x402 dan Prinsip Privasi di Solana

x402 adalah standar pembayaran HTTP-native yang “menghidupkan kembali” kode status 402 Payment Required. Alur kerja standar: resource server memberi tahu klien tentang persyaratan pembayaran, klien mengirim header X-PAYMENT berisi payload pembayaran, resource server memverifikasi (melalui fasilitator bila perlu), lalu menyelesaikan transaksi on-chain. x402 bersifat chain-agnostic dan mendefinisikan interface fasilitator untuk verifikasi (/verify), penyelesaian (/settle), dan kemampuan yang didukung (/supported). Prinsip trust-minimizing-nya meminimalkan kemampuan server/fasilitator untuk menggerakkan dana bertentangan dengan niat klien.[^1][^2][^3]

@payai/x402-solana menyediakan SDK klien/server yang implementasi x402 untuk Solana dengan fokus USDC, antarmuka dompet agnostik, dan penyelesaian via fasilitator. Di sisi Solana, pertumbuhan infrastruktur ZK——terutama syscalls alt_bn128 (pairing-friendly curve operations) dan Poseidon (hash ZK-friendly)——memungkinkan verifikasi Groth16 yang efisien on-chain dan interoperabilitas verifier dengan ekosistem EVM (EIP-196/197/198). Kombinasi ini menjadi fondasi praktik untuk privasi amount/state tanpa mengorbankan kompatibilitas x402.[^2][^3][^4]

Untuk memperjelas peran ZK di Solana dan Implikasinya terhadap desain solusi, lihat Tabel 1.

Tabel 1. Ringkasan syscall ZK di Solana dan implikasi desain
| Syscall | Fungsi | Implikasi Desain untuk x402+ZK |
|---|---|---|
| alt_bn128 | Operasi pairing-friendly untuk verifikasi SNARK (Groth16/PlonK) | Verifikasi bukti ringkas on-chain; cocok untuk witness yang menyertai “amount privacy” dan interoperability EVM di Bridges |
| Poseidon | Hash yang efisien untuk ZK circuits | Mengurangi biaya witness generation dan verifikasi; cocok untuk sirkuit equality/range yang dibutuhkan Confidential Transfer |

Signifikansinya: alt_bn128 menurunkan biaya verifikasi bukti ZK di L1, menjaga throughput, sementara Poseidon membuat sirkuit verifikasi lebih praktis untuk klien. Keduanya memungkinkan arsitektur paywall x402 di mana bukti ZK yang “ringkas dan cepat diverifikasi” perjalanan bersama transaksi pembayaran.[^4]

### x402 v1: Sequencing, Headers, dan Interface Fasilitator

Sequencing kerja x402 meliputi: permintaan klien, respons 402 dengan persyaratan pembayaran, pembuatan payload X-PAYMENT, verifikasi melalui fasilitator, dan penyelesaian on-chain. x402 menentukan X-PAYMENT (payload base64-encoded) dan X-PAYMENT-RESPONSE (response settlement). Fasilitator menerapkan tiga endpoint: /verify (validitas payload), /settle (penajaan dan penyiaran transaksi), dan /supported (kapabilitas skema/jaringan yang didukung). Prinsip trust-minimizing memastikan server/fasilitator tidak dapat memindahkan dana selain sesuai intent klien.[^1][^2]

Tabel 2. Pemetaan endpoint fasilitator → fungsi → parameter → response
| Endpoint | Fungsi | Parameter Utama | Response Inti |
|---|---|---|---|
| /verify | Memvalidasi X-PAYMENT terhadap PaymentRequirements | x402Version, paymentHeader, paymentRequirements | isValid, invalidReason |
| /settle | Menyelesaikan pembayaran on-chain (signAndSend) | x402Version, paymentHeader, paymentRequirements | success, txHash, networkId |
| /supported | Menyatakan skema & jaringan yang didukung | – | kinds: [{scheme, network}] |

Implikasi implementasi: SDK @payai/x402-solana beroperasi konsisten dengan definisi di atas dan menambahkan adaptasi Solana (UTC-mint, jaringan devnet/mainnet).[^1][^2]

### Privasi di Solana: Primitif dan Kapabilitas

Dua jalur utama privasi di Solana relevan bagi paywall x402:
- Amount/balance privacy: ekstensi Confidential Transfer (Token-2022) menggunakan Twisted ElGamal dan Pedersen commitments, dengan model pending→available untuk mencegah front-running. Bukti ZK menyertakan equality, ciphertext validity, dan range proofs.[^6][^7][^8][^9]
- State privacy & scaling: ZK Compression (Light Protocol) menyimpan root state on-chain dan bukti validitas Groth16 128-byte untuk transisi state, dengan infrastruktur Photon (indexer) dan Foresters (liveness). Biaya pembuatan akun turun drastic (contoh 5000x), sementara verifikasi bukti membutuhkan sekitar 100k CUs.[^10][^11]

Tabel 3. Confidential Transfer vs ZK Compression: ruang lingkup privasi, bukti, CU, biaya, dependensi
| Aspek | Confidential Transfer | ZK Compression |
|---|---|---|
| Ruang lingkup | Enkripsi saldo & amount (alamat publik) | Privasi/penyimpanan state via root; privacy-of-state lebih luas |
| Bukti ZK | Equality, validity, range (ZK Token Proof Program) | Groth16 validity proof (128B) |
| Biaya on-chain | Verifikasi bukti via syscalls; lebih tinggi dari transfer biasa | ~100k CUs verifikasi; read/write per akun terkompresi ~6k CUs |
| Biaya pembuatan akun | SPL Token regular; extension menambah overhead | Penghematan drastis (contoh 5000x) |
| Dependensi | ZK Token Proof Program; pasca-audit gating | Photon indexer, Forester nodes (liveness) |
| Status | Mainnet/devnet sementara disabled pasca audit | Aktif bergerak ke produksi |

Pilihan antara amount privacy vs state privacy bergantung kebutuhan: jika endpoint Berbayar perlu merahasiakan nilai pembayaran (mis. tariff per permintaan), Confidential Transfer memadai; jika merchant mengelola banyak akun/ledger berskala besar, ZK Compression mengurangi biaya state. Keduanya dapat dikombinasikan dalam arsitektur hybrid yang konsisten dengan x402.[^6][^10][^11]

## Pemetaan Kebutuhan: ZKx401 → x402 + Privasi Solana

Definisi kerja ZKx401: superset x402 dengan kemampuan privasi ZK di lapisan pembayaran. Kontrak kompatibilitas harus menjaga alur x402 v1: 402 response, X-PAYMENT header, verifikasi/penyelesaian via fasilitator, dan header X-PAYMENT-RESPONSE. ZKx401 menambah minimal satu assertions ZK:
- “Amount privacy”: bukti bahwa nilai pembayaran tersembunyi tetapi valid (confidential amount).
- “Optionally state privacy”: bukti komposisi state atau akses membaca data terkompresi.

Polanya: integrasi harus menjaga kemampuan gasless via fasilitator (contoh Kora), meminimalkan gesekan UX, dan mengikuti kontrak antarmuka fasilitator x402 agar vendor/SDK lain tetap kompatibel.[^1][^2][^3]

Tabel 4. Pemetaan fitur ZKx401 → kemampuan x402 + mekanisme privasi Solana
| Fitur ZKx401 | Komponen x402 | Mekanisme Privasi Solana | Implikasi Integrasi |
|---|---|---|---|
| Amount privacy | 402 response, X-PAYMENT, /verify, /settle | Confidential Transfer (ElGamal, equality/range proofs) | Amount disembunyikan; bukti ZK diverifikasi via syscalls; gating ketersediaan fitur pasca audit |
| State privacy/scaling | X-PAYMENT-RESPONSE (receipt) | ZK Compression (Groth16 validity, root) | Biaya state menurun; tambahan node Photon/Forester; liveness monitoring |
| Gasless (UX) | Fasilitator, kebijakan biaya | Kora (signer, kebijakan) | Klien/server tidak mengelola gas; “bayar dalam token lain” (mis. USDC) |
| Auditor optional | x402 metadata opsional | Auditor key pada mint | Audit selektif tanpa eksposur publik (ekstensi Token-2022) |

## Arsitektur Target: Integrasi @payai/x402-solana dengan Fitur Privasi

Komponen:
- Klien: menggunakan dompet agnostik (Privy/Phantom/Solflare) untuk membuat transaksi SPL sesuai requirement x402. WSSDK (@solana/web3.js dan @solana/spl-token) memfasilitasi pembangunan transaksi/token ops.[^12][^14]
- Server API: menerapkan middleware x402 (Next/Express) untuk menegakkan paywall, memverifikasi persyaratan pembayaran, dan menjalankan logika bisnis setelah verifikasi.
- Fasilitator: mengadaptasi flujos verifikasi dan penyelesaian on-chain; dapat berupa layanan PayAI atau Kora (gasless).[^2][^3][^13]
- Programas Solana: Token-2022 (Confidential Transfer) dan ZK Token Proof Program (verifikasi bukti ZK), serta integrasi Light Protocol untuk state terkompresi.[^6][^9][^10][^11]

Kontrak data:
- Header X-PAYMENT (base64-encoded payload) berisi scheme/network/payment data.
- Response 402 Payment Required membawa PaymentRequirements (price, asset, network, resource).
- X-PAYMENT-RESPONSE menyimpan Settlement Response (txHash, network, success) untuk receipt audit dan replay protection.[^1][^2]

Alur keputusan:
- Jika privacy “amount” saja → gunakan Confidential Transfer; perlu pemantauan status reopening pasca audit.
- Jika privacy “state”/scale → gunakan ZK Compression; pastikan Photon/Forester tersedia dan SLAdipenuhi.
- Jika privasi eksekusi program (private program logic) → evaluasi DeCC (Arcium) pada tahap lanjut.[^10][^11][^15]

Tabel 5. Interaksi komponen vs data exchange (headers, tx fields, proof types)
| Komponen | Peran | Data/Tx/Proof | Catatan |
|---|---|---|---|
| Klien | Membangun & menandatangani transaksi | SPL tx untuk Transfer/TransferWithFee; witness ZK untuk equality/range (jika amount privacy) | Wallet adapter agnostik; batas maxPaymentAmount |
| Server API | Memverifikasi & melayani resource | X-PAYMENT; PaymentRequirements; X-PAYMENT-RESPONSE | Middleware x402; 402 jika tidak bayar |
| Fasilitator | Verifikasi & penyelesaian | /verify, /settle; signAndSend; receipt | Kora untuk gasless; retry/failover |
| Programs Solana | Eksekusi token & bukti | Token-2022 (Confidential Transfer), ZK Token Proof, Light Protocol | alt_bn128, Poseidon syscalls verifikasi |

### Alur End-to-End: Pembayaran x402 dengan Amount/State Privacy

Klien meminta resource → server mengembalikan 402 Payment Required dengan PaymentRequirements (mis. USDC micro-units, deskripsi resource, jaringan) → klien menyusun X-PAYMENT sesuai scheme/network → fasilitator memverifikasi (termasuk bukti ZK bila privacy amount/state diminta) → transaksi ditandatangani/disiarkan (gasless opsional via Kora) → server mengembalikan 200 OK + X-PAYMENT-RESPONSE berisi txHash dan receipt. Bukti ZK untuk amount/state diverifikasi oleh program Solana menggunakan syscalls alt_bn128 dan Poseidon untuk menekan biaya verifikasi dan menjaga interoperability EVM.[^1][^3][^4]

Tabel 6. Langkah alur, artefak data, dan titik pemeriksaan
| Langkah | Artefak Data | Titik Pemeriksaan | Fungsi |
|---|---|---|---|
| Request | HTTP request | 402 response siapkan | PaymentRequirements terstruktur |
| Payment header | X-PAYMENT (base64) | Valid scheme/network | Klien mematuhi x402 v1 |
| Verifikasi | /verify (fasilitator) | isValid=true | Bukti ZK (jika ada) tervalidasi |
| Penyelesaian | /settle (fasilitator) | txHash | signAndSend; liveness |
| Receipt | X-PAYMENT-RESPONSE | Success=true | Auditable receipt; replay protection |

## Desain Kompatibilitas: Menjaga x402 v1 SDK PayAI

Untuk menjaga kompatibilitas SDK @payai/x402-solana, kita mengandalkanobyek PaymentRequirements standar, header X-PAYMENT dan X-PAYMENT-RESPONSE, serta endpoint fasilitator /verify, /settle, /supported. Klien tetap agnostik dompet (Privy/Phantom/Solflare), server tetap HTTP framework-agnostic (Next/Express), dan network devnet/mainnet diperlakukan melalui konfigurasi. Penambahan ZK disisipkan sebagai “additional proof requirement” tanpa mengubah kontrak antarmuka fasilitator; validasi bukti ZK terjadi di program Solana, sementara fasilitator memastikan transaksi tersampaikan dan receipt tersedia.[^2][^1][^3]

Tabel 7. Matriks kompatibilitas: elemen SDK → mekanisme kompatibilitas → dampak integrasi ZK
| Elemen SDK | Mekanisme Kompatibilitas | Dampak Integrasi ZK |
|---|---|---|
| PaymentRequirements | Standar x402 | Tambahkan field/assurance “ZK required” tanpa ubah skema |
| X-PAYMENT | Header standar (base64) | Payload dapat membawa witness/identitas pembuktian tanpa mengganti encoding |
| /verify, /settle | Interface fasilitator | Verifikasi ZK dilakukan on-chain; fasilitator nurut hasil |
| X-PAYMENT-RESPONSE | Receipt standar | Menyertakan proof metadata untuk audit tanpa expose data sensitif |

### Variance: Amount Privacy (Transfer Rahasia) vs State Privacy (Compression)

- Amount privacy: endpoint dibayar meminta jumlah tetap rahasia; gunakan Confidential Transfer. Perlu pemantauan reopening pasca audit.[^6][^9]
- State privacy/scaling: endpoint Dibayar mengelola banyak akun/state; gunakan ZK Compression untuk menurunkan biaya state; pastikan Photon/Forester running dan SLA terpenuhi.[^10][^11]
- Hybrid: server dapat menerima pembayaran dengan confidential amount (Confidential Transfer) sembari维持 ledger state yang ekonomis melalui kompresi pada sistem internal atau integrasi Light Protocol.

Tabel 8. Perbandingan CU/overhead/dependensi untuk dua pendekatan
| Dimensi | Confidential Transfer | ZK Compression |
|---|---|---|
| Verifikasi bukti | Syscalls ZK; bukti equality/range | ~100k CUs; Groth16 128B |
| Overhead per transaksi | Tambahan bukti ZK untuk tx SPL | Tambahan bukti untuk state read/write |
| Dependensi | ZK Token Proof Program | Photon indexer, Forester |
| Status | Temporarily disabled pasca audit | Aktif; bergantung node eksternal |
| UX | Amount tetap rahasia; alamat publik | State scaling; transparency root on-chain |

## Arsitektur Program Solana untuk Privasi

 Tiga blok utama:
- SPL Token-2022 (Confidential Transfer): enkripsi amount menggunakan Twisted ElGamal dan Pedersen commitments, bukti equality/validity/range; model pending→available mencegah front-running. Konfigurasi auditor key untuk audit selektif.[^6][^8][^9]
- ZK Token Proof Program: menyediakan instruksi verifikasi bukti ZK on-chain, memanfaatkan syscalls alt_bn128 dan Poseidon untuk efisiensi verifikasi dan interoperabilitas EVM.[^4][^9]
- Light Protocol (ZK Compression): bukti validitas Groth16 konstan 128B, concurrent sparse Merkle trees untuk state; Photon mengindeks, Foresters menjaga liveness nullifier queue.[^10][^11]

Tabel 9. Pemetaan instruksi bukti ZK (equality/validity/range/close) → program → fungsi
| Instruksi Bukti | Program | Fungsi | Catatan Implementasi |
|---|---|---|---|
| VerifyCiphertextCommitmentEquality | ZK Token Proof | Menjamin ciphertext sesuai commitment | Deposit/Transfer |
| VerifyBatchedGroupedCiphertext3HandlesValidity | ZK Token Proof | Validitas struktur ciphertext | Well-formedness sebelum spend |
| VerifyBatchedRangeProofU64/U128 | ZK Token Proof | Memastikan nilai dalam rentang | Mencegah overflow/underflow |
| CloseContextState | ZK Token Proof | Menutup state akun bukti sementara | Pengembalian biaya sewa |

### Integrasi Bukti ZK: Witness Generation, Verifikasi, dan Asersi

- Witness generation dilakukan klien atau off-chain prover; bukti equality dan range menyertai Deposit/Transfer pada Confidential Transfer.
- Verifikasi on-chain memanfaatkan syscalls alt_bn128 dan Poseidon untuk efisiensi pairing dan hashing; footprint verifikasi dijaga kecil untuk menjaga throughput L1.
- Pengujian harus menutup:
  - Soundness: bukti hanya accept jika valid (true positives).
  - Completeness: bukti valid selalu accept.
  - No leakage: jumlah/saldo tidak terbuka; hanya metadata minimal yang terekspos.[^4][^11]

## Rencana Deploy & Operasional

Jaringan:
- Devnet terlebih dahulu, dengan USD Circle faucet untuk jangkar uji USDC; mainnet memerlukan kebijakan treasury dan琴 ontrol akses lebih ketat.[^19]
- RPC:
  - Standard RPC untuk transaksi biasa.
  - Fot RPC khusus ZK (mis. endpoint dengan syscalls alt_bn128/Poseidon) untuk klien yang memerlukan verifikasi cepat.
  - Photon RPC untuk ZK Compression state reads (jika dipakai).[^10]

Gasless:
- Gunakan fasilitator Kora untuk menandatangani dan mem电报 biaya, mengurangi friction pengguna. Kora mendukung kebijakan penandatangan dan “allowlist programs” agar hanya program yang Diizinkan yang dapat dizzinkan. Konfigurasi produksi harus menggunakan Vault/Turnkey/Privy sebagai signer.[^3][^13]

Penganggaran Kompute (CU) & biaya:
- ZK Compression: verifikasi bukti ~100k CUs; system use ~100k; read/write per akun terkompresi ~6k CUs. Pembuatan akun besar-besaran menghemat biaya hingga 5000x.[^10]
- Confidential Transfer: menambah overhead bukti ZK pada transaksi SPL; pasca reopening perlu pengukuran ulang di devnet untuk baseline CU.

Observabilitas:
- Logging verifikasi/settle fasilitator; metrik queue transaksi; monitoring backlog nullifier (ZK Compression) dan SLA Foresters.
- Alerting SLO/SLA: missed settlement, slow confirmation, atau elevated error rates.

Penanaan &TOKEN:
- Dana dompet treasury; airdrop SOL untuk signer Kora (devnet); devnet USDC dari Circle faucet untuk uji pembayaran mikro.[^19][^20]

Tabel 10. Checklist produksi: Kora/fasilitator, RPC, Key mgmt, observability
| Area | Checklist | Tujuan |
|---|---|---|
| Kora | Konfigurasi allowed_tokens, allowed_programs, api_key | Keamanan & compliance transaksi |
| RPC | ZK syscalls endpoint; Photon RPC | Verifikasi bukti & reads terkompresi |
| Key mgmt | Vault/Turnkey/Privy | Keamanan penandatangan produksi |
| Observability | Logging, metrik, alerting | Deteksi dini kegagalan/degredasi |
| Token funding | Devnet USDC (Circle), SOL airdrop | Pengujian stabil end-to-end |

Tabel 11. Estimasi biaya CU per transaksi (berdasarkan whitepaper ZK Compression)
| Komponen | Estimasi Biaya | Catatan |
|---|---|---|
| Verifikasi bukti | ~100k CUs | Groth16 128B |
| System use | ~100k CUs | Baseline protokol |
| Read/write akun terkompresi | ~6k CUs | Per akun |
| Pembuatan 100 akun | ~0.00004 SOL | vs ~0.2 SOL tanpa kompresi |

## Keamanan, Privasi, dan Kepatuhan

- Key management: seed dan kunci privat harus disimpan di HSM/KMS (Vault/Turnkey/Privy). Pastikan kebijakan akses berjenjang dan audit trail lengkap.[^3][^13]
- Audit selektif: Confidential Transfer mendukung auditor key untuk akses read-only saldo/amount, memungkinkan kepatuhan terbatas tanpa eksposur publik.[^6]
- Privasi by design: minimalisasi metadata yang tidak perlu pada HTTP responses; gunakan x402 headers sesuai standar, hindari data sensitif di logs.
- Seed handling: edukasi pengguna tentang keamanan seed; SDK memperlakukan seed sebagai material rahasia untuk dekripsi/pembelanjaan.
- Security testing: audit program, fuzzing, static/dynamic analysis, dan test vectors untuk bukti ZK equality/validity/range; simulasi failure/fallback pada fasilitator/Kora.

## Strategi Pengujian & QA

- Unit tests: verifikasi X-PAYMENT, PaymentRequirements, konstruksi transaksi SPL (Transfer/TransferWithFee), dan integritas bukti ZK (sirkuit equality/range).[^12]
- Integration tests: klien ↔ server ↔ fasilitator; termasuk replay protection via X-PAYMENT-RESPONSE; negative tests (payload invalid, insufficient funds, bukti ZK gagal).
- Network tests: devnet terlebih dahulu, lalu mainnet canary; melibatkan throughput dan biaya end-to-end.
- Acceptance criteria: semua skenario golden path dan negative path pass; SLO verifikasi/settle terpenuhi; logging/alerting berjalan.

Tabel 12. Matriks kasus uji: golden path, negative path, edge cases
| Kategori | Kasus Uji | Ekspektasi |
|---|---|---|
| Golden path | 402 → X-PAYMENT → /verify → /settle → 200 + receipt | isValid=true; tx confirmed; receipt valid |
| Negative path | Bukti ZK invalid; payload tidak sesuai scheme | /verify false; server 402; tidak ada settlement |
| Edge cases | Timeout fasilitator; RPC intermiten | Retry/backoff; alerting; deterministik failure handling |
| Replay | Repeated X-PAYMENT | Ditolak; idempotency via receipt/chain state |

## Roadmap Implementasi & Go/No-Go

- Short-term (0–3 bulan):
  - Implementasi paywall x402 dasar dengan @payai/x402-solana.
  - Monitor reopening Confidential Transfer; jika tersedia, uji amount privacy di devnet.
  - Explore ZK Compression untuk state scaling dan cost minimization pada sistem yang mengelola banyak akun (dengan Photon/Forester).[^10]
- Mid-term (3–9 bulan):
  - Produksi untuk mainnet bila semua uji pass; optimalkan RPC syscalls ZK; latih tim operasi Kora/fasilitator.
  - Audit program dan pipeline CI/CD; metrics observability matang.
- Long-term (9+ bulan):
  - Evaluasi DeCC (Arcium) untuk privasi eksekusi program; rancang arsitektur hybrid: Confidential Transfer untuk token-native, ZK Compression untuk state scaling, DeCC untuk logika kompleks.[^15][^10]

Tabel 13. Roadmap ringkas, kriteria sukses, dependensi
| Horizon | Milestone | Kriteria Sukses | Dependensi |
|---|---|---|---|
| 0–3 bulan | Paywall x402 dasar; devnet privacy pilot | Golden & negative path pass; biaya terkontrol | Fasilitator; RPC; Circle faucet |
| 3–9 bulan | Produksi mainnet; observability matang | SLO terpenuhi; audit pass | Kora signer; reopening CT |
| 9+ bulan | Hybrid privacy + DeCC evaluation | Bukti konsep eksekusi privat | Infrastruktur DeCC (Arcium) |

Go/No-Go gates:
- Privasi amount tersedia (Confidential Transfer reopened) atau state privacy via ZK Compression berjalan stabil.
- Throughput & biaya sesuai SLO.
- Audit keamanan program dan operasional fasilitator/Kora selesai tanpa temuan kritis.
- Rencana operasional & compliance ready.

## Lampiran A: Detail Teknis & Referensi

- Spesifikasi x402 v1: definisi PaymentRequirements, header X-PAYMENT dan X-PAYMENT-RESPONSE, sequencing verifikasi/penyelesaian, dan kontrak fasilitator.[^1][^2]
- SDK @payai/x402-solana: antarmuka klien/server, contoh integrasi Next/Express, dukungan dompet agnostik, definisi asset (USDC) dan format jumlah micro-units.[^2][^17][^18]
- Konfigurasi demo Kora: allowed_tokens (USDC devnet), allowed_programs, api_key; langkah instalasi dan eksekusi demo end-to-end termasuk protected API dan klien.[^3][^13]
- Token-2022 Confidential Transfer: instruksi Deposit/Withdraw/Transfer/TransferWithFee, model pending/available, auditor key, cookbook bukti equality/validity/range.[^6][^9][^18]
- Light Protocol ZK Compression: model state tree, bukti validitas, peran Photon/Forester,estimasi CUs dan penghematan pembuatan akun.[^10][^11][^20]

---

## Referensi

[^1]: Coinbase x402: A payments protocol for the internet. Built on HTTP. https://github.com/coinbase/x402  
[^2]: @payai/x402-solana - npm. https://www.npmjs.com/package/@payai/x402-solana  
[^3]: Solana Developers: x402 Integration with Kora - Complete Demo Guide. https://solana.com/developers/guides/getstarted/build-a-x402-facilitator  
[^4]: Helius Blog: Zero-Knowledge Proofs: Its Applications on Solana. https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana  
[^5]: Light Protocol Official Site. https://lightprotocol.com/  
[^6]: Solana Docs: Confidential Transfer. https://solana.com/docs/tokens/extensions/confidential-transfer  
[^7]: Solana SPL: Twisted ElGamal Encryption. https://spl.solana.com/confidential-token/deep-dive/encryption#twisted-elgamal-encryption  
[^8]: RFC 7748: Section 4.1 (curve25519). https://www.rfc-editor.org/rfc/rfc7748#section-4.1  
[^9]: Agave (GitHub): ZK Token Proof Instruction. https://github.com/anza-xyz/agave/blob/bc09ffa335d9773fd6c4b354e61c44b8fc36724a/zk_token_sdk/src/zk_token_proof_instruction.rs  
[^10]: ZK Compression Whitepaper. https://www.zkcompression.com/references/whitepaper  
[^11]: The Block: Light Protocol and Helius introduce ZK Compression. https://www.theblock.co/post/301368/light-protocol-and-helius-labs-introduce-zk-compression-to-further-scale-solana-apps  
[^12]: @solana/web3.js (GitHub). https://github.com/solana-labs/solana-web3.js  
[^13]: Kora: Gasless Signing Infrastructure (GitHub). https://github.com/solana-foundation/kora  
[^14]: SPL Token Program Documentation. https://spl.solana.com/token  
[^15]: Arcium: The Rebirth of Privacy on Solana. https://www.arcium.com/articles/the-rebirth-of-privacy-on-solana  
[^16]: Solana Stack Exchange. https://solana.stackexchange.com/  
[^17]: payai-network/x402-solana (GitHub). https://github.com/payani-network/x402-solana  
[^18]: Solana Developers: Confidential Balances Sample (GitHub). https://github.com/solana-developers/Confidential-Balances-Sample  
[^19]: Circle Devnet USDC Faucet. https://faucet.circle.com/  
[^20]: Solana Faucet. https://faucet.solana.com/