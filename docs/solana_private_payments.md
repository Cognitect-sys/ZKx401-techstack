# Private Payment Implementations di Solana: Use Cases, Pendekatan Teknis, Proyek, dan Best Practices

## Pendahuluan: Mengapa Private Payments di Solana

Transaksi publik default pada blockchain menghadirkan dua tantangan yang越来越 terasa bagi pengguna institusional dan ritel. Pertama, eksposur saldo dan jumlah Transfer dapat mengungkap strategi pembayaran, radius likuiditas, atau pola perilaku finansial. Kedua, even when amounts are hidden, metadata公开 seperti pengirim, penerima, waktu, dan alamat akun masih menjadi vektor analisis untuk deanonimisasi. Dalam konteks penyelesaian pembayaran lintas yurisdiksi, kebutuhan ini bukan sekadar preferensi privasi; pada banyak kasus, ini adalah keharusan kepatuhan.

Solana modernas telah menanggapi kebutuhan ini melalui serangkaian kemampuan kriptografi dan primitives yang menyatu dengan model akun dan runtime paralelnya. Token-2022 Confidential Transfer memungkinkan enkripsi saldo dan jumlah transfer ( Confidential Balances ), dimana bukti tanpa pengetahuan ( zero-knowledge proofs , ZK) memverifikasi aturan konsistensi tanpa membuka angka sebenarnya. Sementara itu, Light Protocol memopulerkan ZK Compression, sebuah kerangka untuk mengompresi status on-chain dan mengurangi biaya penyimpanan secara signifikan tanpa mengorbankan jaminan L1. Inisiatif lain seperti Arcium ( sebelumnya Dark Protocol ) mendorong komputasi rahasia terdesentralisasi ( DeCC ), yang menjanjikan eksekusi logika pada data terenkripsi untuk pembayaran dan DeFi yangconfidential by design. Bersama-sama, evolusi ini memindahkan privasi di Solana dari “add-on” menjadi fondasi yang dapat diprogram bagi aplikasi finansial modern.[^3][^4][^5][^2]

Laporan ini bertujuan menyajikan gambaran riset teknis dan strategi untuk private payments di Solana: konsep kunci dan landasan kriptografi, pendekatan implementasi ( Confidential Transfer, ZK Compression, pool-based model, dan DeCC ), lanskap proyek, best practices, studi alur end-to-end, rekomendasi arsitektur, serta roadmap implementasi hingga go-live. Fokusnya adalah bagaimana ZK proofs bekerja di Solana, peran syscalls ( Poseidon, alt_bn128 ), dan bagaimana primitive tersebut tradable ke pembayaran pribadi berskala besar, tetap menjaga verifiability dan kepatuhan selektif.

## Fondasi Kriptografi & Mekanisme Privasi di Solana

Privasi di blockchainmuat beberapa domain: confidentiality (data tidak terlihat oleh pihak ketiga), unlinkability (pengirim dan penerima tidak dapat dikorelasikan), dan verifiability (kebenaran state transition dapat diaudit). Bukti tanpa pengetahuan ( ZK ) memungkinkan pembuatan bukti yang ringkas mengenai integritas komputasi tanpa mengungkap input. Secara garis besar, terdapat dua sistem bukti yang dominan:

- zk-SNARK ( Succinct Non-interactive Argument of Knowledge ): bukti sangat kecil dan cepat diverifikasi, mengandalkan trusted setup per sirkuit ( Groth16 ) atau universal setup ( PlonK ). Cocok untuk verifikasi on-chain dengan constrain ukuran bukti minimal.[^4]
- zk-STARK ( Scalable Transparent Argument of Knowledge ): transparan ( tanpa trusted setup ), bukti lebih besar tetapi scalable dan diasumsikan lebih tahan kuantum karena mengandalkan hash dan informasi teoretis. Kadang dikombinasikan secara rekursif dengan SNARK untuk verifikasi akhir yang efisien.[^4]

Di Solana, runtime telah mengadopsi syscalls yang mempercepat sirkuit ZK: Poseidon (hash yang dioptimalkan untuk ZK) dan alt_bn128 (kurva pairing-friendly untuk operasi G1/G2 yang efisien seperti pairing). Kombinasi ini memungkinkan verifikasi bukti Groth16 on-chain yang praktis dan membuka interoperabilitas dengan ekosistem EVM (EIP-196/197/198). Seal- nya dibuat ringkas untuk menjaga throughput L1, sambil tetap menjaga integritas dan komposisi atomik lintas instruksi.[^4]

Untuk payments, skema enkripsi yang relevan mencakup:
- Pedersen commitments dan Twisted ElGamal: memungkinkan operasi pada nilai terenkripsi dan validasi ZK yang menyertainya ( range proofs, equality proofs ), menjaga saldo dan jumlah transfer tetap rahasia tetapi konsisten.[^3][^17][^18]
- curve25519 (RFC 7748): dasar bagi operasi kunci yang efisien dan kompatibel dengan ElGamal, yang kemudian digunakan Token-2022 Confidential Transfer untuk model saldo pending/available.[^18][^1]
- Model saldo pending/available: mencegah front-running dan memungkinkan “confidential credits” agregasi sebelum saldo menjadi spendable, menutup celah dimana miner atau validator tidak dapat menyodok dana sebelum bukti final diverifikasi.[^3]

Untuk memperlihatkan konteks pilihan sistem bukti, tabel berikut merangkum perbedaan inti SNARK vs STARK dalam konteks payments:

Tabel 1. Perbandingan zk-SNARK vs zk-STARK untuk pembayaran
| Aspek | zk-SNARK | zk-STARK |
|---|---|---|
| Trusted setup | Diperlukan (per sirkuit Groth16; universal untuk PlonK) | Tidak diperlukan (transparan) |
| Ukuran bukti | Sangat kecil (contoh Groth16 ~128 byte) | Lebih besar (beberapa ratus KB) |
| Waktu verifikasi | Sangat cepat on-chain | Relatif lebih lambat karena ukuran bukti |
| Keamanan asumsi | Pairing-friendly groups (BN128), kurvaEliptik | Hash dan teori informasi; diasumsikan tahan kuantum |
| Interoperabilitas EVM | Sangat cocok (alt_bn128, EIP-196/197/198) | Mungkin membutuhkan rekursi ke SNARK untuk verifikasi akhir yang ringkas |
| Keterpaduan di Solana | Didukung syscalls Poseidon, alt_bn128 | Mendukung; lebih relevan saat bukti besar dapat diterima atau dialihkan ke verifikasi off-chain/rekursif |

Signifikansinya jelas: untuk payments di mana buktinya harus dipverifikasi on-chain dan footprint transaksi kecil, SNARKs memberi rasio verifikasi terbaik. Untuk skenario yang membutuhkan transparansi ketat atau ukuran komputasi yang sangat besar, STARKs menawarkan jalur rekursif yang canggih, namun perlu perhatian pada biaya verifikasi L1.[^4]

### Zero-Knowledge Proofs di Solana

Di praktik, workflow ZK meliputi penulisan sirkuit ( menyatakan constraints), trusted setup ( untuk SNARK ), pembuatan bukti oleh prover dari witness, dan verifikasi on-chain oleh program verifier. Di Solana, verifikasi ZK semakin efisien berkat Poseidon (arithm-friendly) dan alt_bn128 (pairing operations) syscalls, yang menurunkan biaya verifikasi dan membuka interoperabilitas dengan verifier EVM di Bridges. Hal ini penting untuk private payments lintas rantai, di mana bukti harus singkat, cepat diverifikasi, dan dapat diikat ke state root di L1.[^4]

### Enkripsi Saldo & Amount: Confidential Transfers

Confidential Transfer pada Token-2022 mengenkripsi saldo dan jumlah transfer menggunakan ElGamal dan proofInstructions yang mencakup equality, ciphertext validity, dan range proofs. Model two-stage ( pending → available ) mencegah front-running dan memfasilitasi audit selektif via kunci auditor yang dikonfigurasi pada mint. Instruksi inti yang perlu dipahami tim pembayaran meliputi InitializeMint (dengan ConfidentialTransferMint), ConfigureAccount, Deposit/Withdraw, Transfer/TransferWithFee, dan ApplyPendingBalance. Dengan arsitektur ini, privasi jumlah dan saldo dapat dipertahankan sementara alamat akun tetap publik, menciptakan perimeter privasi yang selaras dengan kebutuhan pasar.[^1][^3][^17][^18]

## Pendekatan Implementasi Private Payments di Solana

Lanskap solusi privasi di Solana dapat dipetakan menjadi empat pendekatan: (A) Token-2022 Confidential Transfer ( Confidential Balances ), (B) ZK Compression Light Protocol, (C) pool-based privacy ( Elusiv ), dan (D) DeCC ( Arcium ). Masing-masing menyelesaikan sekotak masalah: dari enkripsi token-native hingga eksekusi program pada data terenkripsi.

Tabel 2 merangkum perbandingan tersebut.

Tabel 2. Matriks perbandingan pendekatan privasi
| Pendekatan | Model Privasi | Arsitektur Inti | Kompleksitas Implementasi | Status & Risiko | Kepatuhan & Audit |
|---|---|---|---|---|---|
| A. Confidential Transfer (Token-2022) | Enkripsi saldo & jumlah transfer; alamat publik | Twisted ElGamal + Pedersen + ZK proof instructions; model pending/available | Rendah–menengah (SDK/token extensions) | Mainnet/devnet sementara disabled pasca audit ElGamal program | Auditor key opsional; audit selektif |
| B. ZK Compression (Light Protocol) | Kompresi status; bukti validitas ringkas | Groth16; concurrent sparse Merkle trees; Photon indexer; Foresters | Menengah–tinggi (infrastruktur, node) | Bergerak ke produksi; bergantung Forester/Photon RPC | Auditability melalui root & dataHash; kepatuhan sebagai integritas state |
| C. Pool-based (Elusiv) | Putuskan tautan pengirim–penerima | Shared pool; zk-SNARK; view keys | Rendah (SDK) | Sunset (Feb 29, 2024); penarikan hingga 1 Jan 2025 | Kepatuhan via warden; view keys |
| D. DeCC (Arcium) | Komputasi pada data terenkripsi | MPC network; eksekusi logika pada ciphertext | Tinggi (arsitektur baru) | Menjelang TGE; mendapat akuisisi teknologi Inpher | Desain untuk compliance by design |

Signifikansi matriks: jika kebutuhan inti adalah “enkripsi token-native” pada SPL dengan pola pembayaran tradisional, Confidential Transfer menawarkan path-native yang paling sederhana. Bila biaya state menjadi bottleneck dan privasi status diperlukan untuk aplikasi berskala besar, ZK Compression memberi lompatan efisiensi. Pool-based kini historis (Elusiv sunset) dan tidak ideal untuk arsitektur baru. DeCC adalah rencana jangka panjang untuk privasi di level program, membawa pembayaran dan DeFiconfidential by design, tetapi membutuhkan investasi arsitektural yang signifikan.[^3][^4][^7][^5][^2][^14][^15]

### A. Confidential Transfer (Token-2022 Confidential Balances)

Alur pembayaran standar biasanya: InitializeMint dengan ConfidentialTransferMint,ConfigureAccount pada pengirim dan penerima, Deposit dari saldo publik ke saldo rahasia (pending), ApplyPendingBalance untuk memindahkan ke saldo tersedia, Transfer (dengan atau tanpa fee) antara akun yang dikonfigurasi, lalu Withdraw untuk kembali ke saldo publik. Kunci auditor dapat disetel pada mint untuk akses baca terhadap saldo dan jumlah, memungkinkan audit selektif yang terstruktur (misalnya, investigasi kepatuhan terbatas hanya pada mint tertentu). Penggunaan proofInstructions memastikan kecukupan dana dan konsistensi enkripsi tanpa membuka jumlah sebenarnya.

Kondisi saat ini: ekstensi ini dinonaktifkan sementara di mainnet/devnet akibat audit keamanan pada ZK ElGamal Proof Program. Tim perlu memantau reopening dan melakukan contingency plan sementara ( lihat bagian ‘Roadmap’ ).[^1][^3][^21][^22]

Tabel 3. Instruksi Confidential Transfer dan peran operasional
| Instruksi | Peran Operasional | Catatan Penting |
|---|---|---|
| InitializeMint | Memasang ekstensi transfer rahasia pada mint | Disertakan dalam transaksi yang sama dengan InitializeMint |
| UpdateMint | Memperbarui pengaturan transfer rahasia | Untuk konfigurasi kebijakan selanjutnya |
| ConfigureAccount | Mengonfigurasi akun token untuk transfer rahasia | Memerlukan bukti validity kunci publik |
| ApproveAccount | Persetujuan akun baru jika required by mint | Kebijakan akses terhadap akun baru |
| EmptyAccount | Mengosongkan saldo rahasia (pending & available) | Memungkinkan penutupan akun token |
| Deposit | Konversi saldo publik → saldo rahasia (pending) | Transisi awal menuju privacy |
| Withdraw | Konversi saldo rahasia → saldo publik | Pencairan dari mode rahasia |
| Transfer | Transfer rahasia antar akun | Bukti equality, ciphertext validity, range |
| TransferWithFee | Transfer rahasia dengan fee | Meng.handle biaya dalam mode rahasia |
| ApplyPendingBalance | Menyetarakan saldo pending → available | Mengeliminasi front-running |
| Enable/Disable Confidential/Non-Confidential Credits | Mengatur mode kredit ke akun | Mengontrol pembayaran publik vs rahasia |

Penerapan tabel ini menuntun tim pembayaran membangun operasi yang rapi, memisahkan jalur dana publik dan rahasia, serta menjaga integritas bukti di setiap tahap.[^1][^22]

### B. ZK Compression (Light Protocol) untuk Skala Privasi

ZK Compression merevolusi biaya state dengan menyimpan hash akun sebagai leaf pada sparse concurrent Merkle tree dan hanya menyimpan root on-chain. Bukti validitas Groth16 yang ringkas (128 byte) memverifikasi transisi status terhadap root ini, menjaga keamanan dan komposabilitas L1. Arsitektur didukung node Photon (indexer untuk status terkompresi), prover nodes (menghasilkan bukti), dan Foresters (mengosongkan antrean nullifier untuk menjaga liveness). Biaya komputasi per transaksi meliputi verifikasi bukti (~100k CUs), system use (~100k CUs), dan tambahan per read/write akun terkompresi (~6k CUs). Penghematan biaya pembuatan akun token dapat mencapai 5000x (contoh 100 akun token turun dari ~0.2 SOL menjadi ~0.00004 SOL).[^6][^7][^4]

Tabel 4. Perhitungan biaya komputasi dan penyimpanan dengan ZK Compression
| Komponen | Estimasi Biaya | Implikasi Operasional |
|---|---|---|
| Verifikasi bukti validitas | ~100k CUs | On-chain verifier efisien, menjaga throughput |
| System use | ~100k CUs | Overhead baseline protokol |
| Per akun terkompresi (read/write) | ~6k CUs | Skala baik untuk banyak akun |
| Proof size | 128 byte (konstan) | Payload transaksi kecil; cocok untuk L1 |
| Biaya pembuatan 100 akun token | ~0.00004 SOL | vs ~0.2 SOL tanpa kompresi (5000x) |
| Liveness | Bergantung Foresters | Nullifier queue harus drain agar sistem hidup |

Tabel ini menyoroti trade-off: CU tinggi untuk verifikasi bukti, tetapi biaya pembuatan akun turun luar biasa; liveness bergantung pada node Foresters. Untuk pembayaran berskala besar dengan banyak akun (misalnya, treasury dengan banyak sub-akun), ZK Compression menghadirkan ekonomi yang jauh lebih efisien.[^4][^6][^7]

### C. Pool-based Privacy (Elusiv – Historis & Sunset)

Elusiv memutus tautan pengirim–penerima melalui pool bersama. Pengirim menyetor dana ke pool, dan transfers terjadi внутри pool secara privat menggunakan zk-SNARK. View keys memungkinkan visibilitas selektif, dan warden melayani peran kepatuhan (misalnya, pembatasan alamat). Namun, pada 29 Februari 2024 Elusiv announced sunsetting dan beralih ke mode penarikan hingga 1 Januari 2025, menandai akhir lifecycle solusi pool-based ini di Solana. Tim sekarang disarankan tidak memulai proyek baru di atas pool-based dan beralih ke alternatif native Token-2022 atau kompresi state.[^2][^15]

### D. Arcium (DeCC): Komputasi Rahasia Terdesentralisasi

Arcium membangun jaringan komputasi tanpa status yang mengeksekusi logika apa pun pada data yang sepenuhnya terenkripsi menggunakan Multi-Party Computation (MPC). Berbeda dari privasi yang terbatas pada transfers, DeCC memindahkan privasi ke level eksekusi program: dark pools, private lending,dan operasi AI pada data sensitif menjadi mungkin tanpa mengorbankan confidentiality. Arcium mengakuisisi teknologi inti dan tim dari Inpher, memperkuat posisi sebagai tumpukan DeCC paling canggih untuk AI terenkripsi end-to-end. Tantangan utamanya adalah kompleksitas operasional dan adopsi infrastruktur baru, tetapi visinya align dengan kebutuhan enterprise akan “confidential by default”.[^5][^14]

## Use Cases Private Payments di Solana

Private payments bukan monolit; mereka memiliki varian bentuk yang berbeda sesuai kebutuhan kepatuhan, throughput, dan biaya.

- B2B & enterprise: sensitive pricing, supplier payments, payroll dalam stablecoin dengan audit selektif via auditor key pada Confidential Transfer. Alamat publik tetap terlihat, namun saldo dan jumlah transaksi terlindungi.[^1][^3][^24]
- DeFi pribadi: dark pools/CLOBs, private swaps/lending, berbasis ZK dan DeCC untuk melindungi order book dan strategi dari front-running atau MEV.[^14][^5]
- Treasury & stablecoin operations: ZK Compression mengurangi biaya state untuk account trees dan sub-ledgers, menjaga integritas via root dan dataHash.[^7][^4]
- Cross-chain private settlement: verifikasi ZK lintas rantai dengan alt_bn128 syscalls dan EIP-196/197/198 menyederhanakan interoperabilitas bukti.[^4]
- NFT payments & state scaling: token terkompresi untuk biaya pembuatan akun minimal, menghindari eksposur state besar-besaran.[^7]
- DePIN & AI pada data sensitif: DeCC membuka analitik dan training pada ciphertext untuk pembayaran dan layanan berbasis data.[^5]

Tabel 5. Pemetaan use case → pendekatan yang cocok
| Use Case | Pendekatan Rekomendasi | Alasan Utama |
|---|---|---|
| Payroll stabilcoin (B2B) | Confidential Transfer | Audit selektif via auditor key; alur sederhana; native Token-2022 |
| Supplier payments | Confidential Transfer | Kepatuhan terstruktur; pending/available menghindari front-running |
| Dark pools/CLOBs | DeCC (Arcium) | Eksekusi logika pada data terenkripsi; privasi order book by design |
| Private swaps/lending | DeCC / Confidential Transfer | Kebutuhan logika program pribadi vs transfer sederhana |
| Treasury sub-ledgers | ZK Compression | Skala banyak akun; biaya rendah; integritas via root |
| Cross-chain settlement | Confidential Transfer + ZK Compression | Verifikasi bukti ringkas; interoperabilitas alt_bn128/EIP |
| NFT payments | ZK Compression | Minimasi biaya pembuatan akun; status komposisi tetap terjaga |
| AI pembayaran sensitif | DeCC | Training/inferensi pada ciphertext; privasi end-to-end |

Implikasi praktis: pilih Confidential Transfer untuk pembayaran token-native dengan kebutuhan audit selektif; ZK Compression untuk struktur akun berskala besar; DeCC untuk kasus DeFi dan AIconfidential by design.[^1][^4][^5][^14][^24]

## Proyek & Protokol di Solana: Status & Lessons Learned

Lanskap privasi Solana telah berevolusi cepat. Light Protocol SHIFTED fokus ke ZK Compression untuk skala, meninggalkan eksekusi private program yang menjadi fokus awal. Elusiv, sebagai pool-based privacy layer yang sempat populer, berakhir dengan sunset pada 2024. Arcium muncul sebagai katalis Privacy 2.0 dengan DeCC. Secara infrastruktur, ZK syscalls (Poseidon, alt_bn128) semakin matang dan memicu adopsi verifikasi on-chain yang efisien.

Tabel 6. Status proyek dan catatan penting
| Proyek/Protokol | Fokus | Status | Catatan |
|---|---|---|---|
| Light Protocol (ZK Compression) | Kompresi status via Groth16; Photon/Foresters | Aktif; produksi bergerak | Penghematan biaya besar; bergantung Foresters untuk liveness |
| Confidential Transfer (Token-2022) | Enkripsi saldo & jumlah transfer | Mainnet/devnet disabled sementara pasca audit | Siapkan fallback; monitor reopening |
| Elusiv (pool-based) | Transfer privat via zk-SNARK; view keys; warden | Sunset (Feb 29, 2024); penarikan hingga 1 Jan 2025 | Tidak direkomendasikan untuk proyek baru |
| Arcium (DeCC) | Eksekusi logika pada ciphertext; dark pools | Menjelang TGE; akuisisi teknologi Inpher | Privasi by design; kompleksitas tinggi |

Lesson learned: privasi ad-hoc di atas arsitektur yang tidak membuatnya fondasi cenderung rapuh. Desain native Token-2022 dan kompresi state menunjukkan jalur integrasi yang lebih harmonis dengan runtime Solana, sementara DeCC mengisyaratkan masa depan privasi yang lebih dalam untuk eksekusi program.[^2][^15][^5][^4]

## Arsitektur Referensi: Implementasi Confidential Transfer

Implementasi yang kuat dimulai dengan keputusan desain mint dan akun token, penganggaran bukti ( equality, validity, range ), dan strategi audit selektif.

Mint configuration: tentukan kebijakan auto-approve accounts, aktifkan confidential credits, dan tetapkan auditor_elgamal_pubkey untuk akses baca selektif. Akun token: buat ElGamalKeypair dan AeKey (AES) untuk enkripsi saldo, reallocate untuk menyertakan ConfidentialTransferAccount extension, jalankan ConfigureAccount dengan PubkeyValidityProofData. Deposit/Withdraw: alur dua tahap pending → available, yang mencegah front-running dan memastikan hanya saldo tersedia yang bisa dibelanja. Transfer: gunakan Transfer atau TransferWithFee sesuai kebutuhan; verifikasi bukti equality, ciphertext validity, dan range on-chain. Seorang auditor yang memegang kunci dapat membuka saldo dan jumlah untuk audit kepatuhan, tanpa membuka data untuk publik umum.[^1][^3][^17][^18]

Tabel 7. Peran instruksi Confidential Transfer dalam alur pembayaran
| Langkah | Instruksi | Tujuan | Output |
|---|---|---|---|
| Setup mint | InitializeMint | Memasang ekstensi pada mint | Mint siap untuk transfer rahasia |
| Persiapan akun | ConfigureAccount | Mengonfigurasi akun untuk confidential | Bukti validity kunci publik tervalidasi |
| Setoran | Deposit | Publik → pending | Saldo rahasia masuk ke antrian |
| Penerapan | ApplyPendingBalance | Pending → available | Saldo spendable tercipta |
| Transfer | Transfer/TransferWithFee | Transfer antar akun secara rahasia | Bukti equality, validity, range tervalidasi |
| Pencairan | Withdraw | Rahasia → publik | Likuiditas kembali ke mode publik |
| Audit | (Auditor key) | Akses baca saldo/jumlah | Kepatuhan selektif tanpa eksposur publik |

Tabel 8. Pemetaan bukti ZK dan instruksi Proof
| Bukti | Instruksi Proof | Fungsi | Catatan Implementasi |
|---|---|---|---|
| Equality proof | VerifyCiphertextCommitmentEquality | Memastikan ciphertext sesuai commitment | Digunakan pada Deposit/Transfer |
| Ciphertext validity | VerifyBatchedGroupedCiphertext3HandlesValidity | Validitas struktur ciphertext | Menjamin well-formedness sebelum spend |
| Range proof | VerifyBatchedRangeProofU64/U128 | Memastikan nilai dalam rentang yang valid | Mencegah overflow/underflow |
| Close context | CloseContextState | Menutup state akun bukti sementara | Mengembalikan biaya sewa |

Kombinasi instruksi ini menegakkan integritasprivasi: transaksi dapat diverifikasi sah tanpa memaparkan jumlah atau saldo. Tim pembayaran perlu memastikan konteks bukti sementara ditutup untuk efisiensi biaya, dan mengikuti cookbook resmi untuk tata letak akun dan bukti yang tepat.[^17][^21]

## Arsitektur Referensi: ZK Compression untuk Private State & Payments

ZK Compression mengatur status dalam concurrent sparse Merkle trees. Transaksi berisi data off-chain terkompresi dan bukti validitas 128-byte yang diverifikasi terhadap root on-chain. Pembaruan status men-nullify leaf lama via antrean nullifier, dan Foresters memastikan liveness dengan mengosongkan antrean ini secara berkala. Photon RPC mengindeks event untuk memungkinkan klien membangun transaksi terhadap status terkompresi. Trust assumptions meliputi data availability/liveliness (node jujur), upgradeability program, dan ketergantungan pada Foresters.[^7][^6][^4]

Tabel 9. Komponen ZK Compression dan peran operasional
| Komponen | Peran | Signifikansi |
|---|---|---|
| State tree (Merkle) | Menyimpan hash akun terkompresi | Root on-chain menjaga integritas banyak akun |
| Address Space Tree | Alamat unik dengan bukti eksklusi | Ruang alamat 254-bit; bukti eksklusi efisien |
| Proof validitas (Groth16) | Verifikasi transisi status | Bukti 128-byte konstan; verifikasi cepat |
| Photon Indexer | Mengindeks status terkompresi | Klien dapat membaca & membangun transaksi |
| Prover node | Menghasilkan bukti | Mendukung integritas transisi status |
| Forester node | Drain nullifier queue | Liveness protokol; menjaga throughput |

Tabel 10. Biaya & kinerja ZK Compression
| Dimensi | Estimasi | Implikasi |
|---|---|---|
| Verifikasi bukti | ~100k CUs | Bukti singkat, verifikasi on-chain efisien |
| System use | ~100k CUs | Baseline protokol |
| Read/write per akun | ~6k CUs | Skala dengan jumlah akun terkompresi |
| Proof size | 128 byte | Bukti kecil menjaga ruang transaksi |
| Cost pembuatan 100 akun | ~0.00004 SOL | Penghematan 5000x vs regular |
| Liveness | Bergantung Foresters | Nullifier queue harus drain konsisten |

Signifikansi tabel: ZK Compression unggul pada konteks dengan banyak akun dan update yang tidak terlalu sering. Aplikasi dengan write rate sangat tinggi atau data besar per akun harus mengevaluasi dampak CU dan skema akses data on-chain sebelum migrasi.[^4][^6][^7]

## Best Practices Keamanan, Privasi, dan Kepatuhan

Privasi yang baik dimulai dari pengelolaan kunci dan bukti. Untuk Confidential Transfer, kunci auditor pada mint memungkinkan audit selektif tanpa mengorbankan privasi pengguna umum; ini harus diimplementasikan dengan kebijakan akses yang jelas dan log audit. Seed manajemen pada SDK berbasis ZK harus memperlakukan seed sebagai material rahasia yang memungkinkan dekripsi dan pembelanjaan aset privat; praktik operasional perlu mencegah kebocoran seed dan memperkuat kebijakan HSM/KMS.

Audits & testing: audit program, fuzzing, dan static/dynamic analysis wajib dilakukan untuk jalur ZK verifikasi bukti dan ekstensi Token-2022. Pengalaman Elusiv mengajarkan bahwa penanganan seed dan kepatuhan warden perlu ditetapkan dengan tegas dalam produksi. Untuk ZK Compression, Foresters dan Photon harus diawasi untuk memastikan liveness dan integritas data, termasuk mekanisme alert untuk backlog nullifier.

UX privacy perlu dirancang agar aman dan dapat dipakai: alur Deposit/Withdraw/Transfer harus jelas, indikasi status pending/available transparan, dan biaya tidak mengejutkan pengguna. Integrasi wallet & RPC harus memastikan dukungan syscalls ZK dan endpoint yang relevan, serta kompatibilitas dengan Agave dan klien lain. Finally, transparansi dan kepatuhan by design (misalnya melalui auditor keys) akan mengurangi friksi regulasi tanpa mengorbankan privasi end-user.[^1][^3][^7][^2]

## Studi Alur: Private USDC Payment dengan Token-2022 Confidential Transfer (End-to-End)

Alur pembayaran USDC privat end-to-end umumnya mengikuti langkah-langkah berikut:

1. Initialize mint dengan ConfidentialTransferMint. Tentukan kebijakan auto-approve dan set kunci auditor bila diperlukan.
2. Buat Associated Token Account (ATA) untuk pengirim dan penerima, reallocate untuk menyertakan ConfidentialTransferAccount extension.
3. Konfigurasi akun token dengan ElGamal/AeKey dan bukti PubkeyValidityProofData.
4. Deposit: pindahkan saldo publik ke saldo rahasia pending, lakukan ApplyPendingBalance agar saldo tersedia.
5. Transfer: lakukan Transfer atau TransferWithFee; program memverifikasi equality, ciphertext validity, dan range proof tanpa membuka jumlah.
6. Verifikasi: gunakan endpoint RPC untuk memeriksa transaksi; pastikan bukti tervalidasi dan tidak ada kebocoran saldo publik.[^3][^1][^17]

Checklist pemrograman ini membantu tim memastikan ketepatan implementasi.

Tabel 11. Checklist alur dan pemeriksaan krusial
| Langkah | Pemeriksaan | Tujuan |
|---|---|---|
| Mint init | ConfidentialTransferMint terpasang | Mint siap untuk mode rahasia |
| ATA & reallocate | ConfidentialTransferAccount ada | Akun siap untuk enkripsi |
| Key generation | ElGamal/AeKey tersedia | Enkripsi saldo dan jumlah |
| ConfigureAccount | PubkeyValidityProofData tervalidasi | Integritas kunci publik |
| Deposit | Bukti equality/validity/range pass | Publuk → pending aman |
| ApplyPendingBalance | Pending → available | Saldo spendable tercipta |
| Transfer | Proofs pass on-chain | Jumlah/saldo tetap rahasia |
| Withdraw | Bukti pass | Kembali ke mode publik (opsional) |
| Verifikasi RPC | getTransaction & loaded addresses | Tidak ada kebocoran pengirim/penerima |

Fallback bila ekstensi dinonaktifkan: fokus padaZrouting stablecoin melalui arsitektur lain (misalnya, DeCC di masa depan) atau put on hold sambil menunggu reopening; hindari membangun di atas pool-based yang sudah sunset.[^1][^3]

## Risiko, Keterbatasan, dan Trade-off

Tidak ada privasi tanpa trade-off. Confidential Transfer berdampak pada performa dan biaya verifikasi (CU tinggi untuk bukti ZK), dan mengandalkan ZK ElGamal Proof Program yang saat ini dinonaktifkan pasca audit; reopening membutuhkan koordinasi dengan validator dan dokumentasi resmi. ZK Compression, sementara menurunkan biaya state secara drastis, membutuhkan node Photon dan Foresters untuk liveness dan integritas; kepercayaan pada Foresters untuk kemajuan root dan nullifier queue harus dikelola dengan SLO/SLA. DeCC (Arcium) menghadirkan kompleksitas tinggi, adopsi infrastruktur baru, dan kebutuhan trust assumptions di jaringan MPC. Pool-based privacy memiliki risiko utilisasi rendah dan telah sunset (Elusiv), sehingga tidak relevan untuk desain baru. Dari sudut pandang regulasi, privasi dapat welcomed atau diawasi ketat; desain harus preemptif dalam audit selektif dan kebijakan akses untuk menghindari Einschränkungen operasional.[^4][^7][^5][^15]

## Rekomendasi & Roadmap Implementasi

- short-term (0–3 bulan): hindari pool-based; monitor reopening Confidential Transfer; uji coba internal di testnet/devnet; siapkan audit program dan kebijakan akses kunci auditor; jika you are a high-throughput enterprise payer, explore ZK Compression untuk sub-ledgers dan akun token masivo (dengan Photon & Forester).[^3][^4]
- mid-term (3–9 bulan): productionize Confidential Transfer bila sudah reopened; integrasikan audit pipelines; optimasi RPC untuk syscalls ZK (Poseidon, alt_bn128); latih tim tentang bukti equality/validity/range dan praktik pengelolaan seed/KMS.[^3][^4]
- long-term (9+ bulan): evaluasi DeCC (Arcium) untuk private program execution ( dark pools, private lending ) dan AI pada data pembayaran sensitif; bangun arsitektur hybrid: Confidential Transfer untuk token-native payments dan ZK Compression untuk state scaling; DeCC untuk logika kompleks yang membutuhkan privasi eksekusi.[^5][^4]

Tabel 12. Roadmap ringkas dan milestones
| Horizon | Milestone | Kriteria Sukses |
|---|---|---|
| 0–3 bulan | Monitor reopening; testnet/devnet | Rangkaian test pass; audit prep |
| 3–9 bulan | Productionize Confidential Transfer | Stable throughput; audit selektif aktif |
| 9+ bulan | Evaluasi & pilot DeCC | Integrasi MPC network; privasi eksekusi confirmed |

## Lampiran: Sumber & Rujukan Teknis

- Dokumen resmi Token-2022 Confidential Transfer: instruksi, model pending/available, bukti equality/validity/range, auditor key opsional.[^1]
- Dokumentasi ZK Compression: model akun terkompresi, syscalls, Photon/Forester, trust assumptions, biaya CUs.[^7][^4]
- SDK & panduan implementasi: QuickNode developer guide, cookbook saldo rahasia, SDK untuk Elusiv (termasuk sunset announcement).[^3][^21][^15]
- Arsitektur DeCC (Arcium): MPC jaringan, kasus DeFi dan AI, status akuisisi teknologi Inpher.[^5]

## Informasi yang Belum Tersedia (Information Gaps)

Beberapa detail masih membutuhkan klarifikasi dari sumber resmi dan komunitas validator:
- Status reopening pasca audit ZK ElGamal Proof Program ( Confidential Transfer ) untuk mainnet/devnet dan cronograma fitur gate yang relevan.[^1][^4]
- Benchmark independen regarding latency, throughput, dan biaya CU pada produksi ZK Compression (Light Protocol) di mainnet; artefak operasional Photon/Forester dan SLO/SLA.[^7][^4]
- Status produksi Arcium (DeCC), termasuk timeline TGE dan konfigurasi node operasional; bukti integritas untuk private program execution di mainnet.[^5]
- Detail teknis terverifikasi terkait stealth addresses pada Solana (misalnya, implementasi Vantum) dan bukti audit independen atas privasi unlinkability; beberapa sumber diblokir Cloudflare.
- Gambaran kepatuhan regulasi end-to-end untuk Confidential Transfer dan DeCC (KYC/AML, auditability), serta rekomendasi operasional untuk audit by design.[^1][^3][^5]

---

## References

[^1]: Solana Docs. Confidential Transfer - Solana. https://solana.com/docs/tokens/extensions/confidential-transfer  
[^2]: Helius Blog. Privacy on Solana with Elusiv and Light. https://www.helius.dev/blog/privacy-on-solana-with-elusiv-and-light  
[^3]: QuickNode Guide. Confidential Transfers on Solana: A Developer's Guide. https://www.quicknode.com/guides/solana-development/spl-tokens/token-2022/confidential  
[^4]: Helius Blog. Zero-Knowledge Proofs: Its Applications on Solana. https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana  
[^5]: Arcium. The Rebirth of Privacy on Solana. https://www.arcium.com/articles/the-rebirth-of-privacy-on-solana  
[^6]: Light Protocol Official Site. https://lightprotocol.com/  
[^7]: ZK Compression Whitepaper. https://www.zkcompression.com/references/whitepaper  
[^8]: Solana Compass. Light Protocol. https://solanacompass.com/projects/light-protocol  
[^9]: The Block. Solana launches 'Confidential Balances' token extensions. https://www.theblock.co/post/350076/solana-developers-launch-new-confidential-balances-token-extensions-to-improve-onchain-privacy  
[^10]: Solana Program Docs. Confidential Balances Overview. https://www.solana-program.com/docs/confidential-balances/overview  
[^11]: Solana Program Docs. Confidential Balances Encryption. https://www.solana-program.com/docs/confidential-balances#setup  
[^12]: Solana Program Docs. Confidential Balances — Quick Start Setup. https://www.solana-program.com/docs/confidential-balances#setup  
[^13]: Solana Developers (GitHub). Confidential Balances Cookbook. https://github.com/solana-developers/Confidential-Balances-Sample  
[^14]: Helius Blog. Arcium: Privacy 2.0 for Solana. https://www.helius.dev/blog/solana-privacy  
[^15]: Twitter. Elusiv Sunset Announcement. https://twitter.com/elusivprivacy/status/1763263327763841493  
[^16]: Elusiv SDK Docs. https://elusiv-privacy.github.io/elusiv-sdk/  
[^17]: Agave (GitHub). ZK Token Proof Instruction. https://github.com/anza-xyz/agave/blob/bc09ffa335d9773fd6c4b354e61c44b8fc36724a/zk_token_sdk/src/zk_token_proof_instruction.rs  
[^18]: Solana SPL. Twisted ElGamal Encryption. https://spl.solana.com/confidential-token/deep-dive/encryption#twisted-elgamal-encryption  
[^19]: RFC 7748. Section 4.1 (curve25519). https://www.rfc-editor.org/rfc/rfc7748#section-4.1  
[^20]: Solana Docs. ZK Token Proof Program. https://docs.solanalabs.com/runtime/zk-token-proof  
[^21]: Solana Program Docs. Confidential Balances — Quick Start Setup (Instruction List). https://www.solana-program.com/docs/confidential-balances#setup  
[^22]: Solana Program Docs. Confidential Balances Overview (Instructions & Audit). https://www.solana-program.com/docs/confidential-balances/overview  
[^23]: The Block. Light Protocol and Helius introduce ZK Compression. https://www.theblock.co/post/301368/light-protocol-and-helius-labs-introduce-zk-compression-to-further-scale-solana-apps  
[^24]: Helius Blog. Solana for Enterprise: Reasons and Use Cases. https://www.helius.dev/blog/solana-for-enterprise