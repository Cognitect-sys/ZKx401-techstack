# Evaluasi Fitur Privasi untuk Protokol x402 di Solana: Kelayakan Implementasi dan Implikasi Keamanan

## Ringkasan Eksekutif

Dokumen ini mengevaluasi penambahan empat fitur privasi ke protokol x402 yang beroperasi di Solana: transaksi anonim, private payment amounts, zero-knowledge payment proofs (ZKP), dan stealth addresses. x402 memanfaatkan status HTTP 402 “Payment Required” untuk mengikat pembayaran on-chain langsung ke alur HTTP, sehingga pembayaran juga berfungsi sebagai autentikasi tanpa состоя (stateless). Integrasi privasi di atas alur ini menuntut pendekatan yang hati-hati agar tidak mengorbankan performa, auditabilitas, dan kepatuhan.

Garis besar temuan kami adalah sebagai berikut. Pertama, private payment amounts mempunyai kelayakan tinggi dan selaras dengan strategi “confidentiality with auditability” yang kini berkembang di ekosistem Solana. Ekstensi Token22—Confidential Transfer dan Confidential Balances—menyediakan komponen primitif untuk merahasiakan jumlah dan saldo, sambil mempertahankan alamat yang terlihat dan opsi kunci auditor untuk pengawasan selektif. Namun, fitur ini sempat dinonaktifkan karena audit keamanan pada Program ZK ElGamal dan bukti-bukti terkait; keputusan pengaktifannya harus menunggu hasil audit dan uji coba yang menyeluruh.[^1][^2][^16]

Kedua, zero-knowledge payment proofs dapat diintegrasikan ke alur x402 sebagai klaim kriptografis yang menyertai komitmen pembayaran (message-signatured) baik untuk penyelesaian on-chain langsung maupun untuk deferred payments (pembayaran tertunda). Di Solana, dukungan primitives ZK semakin matang, termasuk syscalls Poseidon dan alt_bn128 untuk verifikasi Groth16, serta riset verifikasi L1 on-chain ZK-STARK. Dalam kerangka x402, ZKP bisa berperan sebagai bukti kelayakan, ketersediaan dana, atau kepatuhan parameter tanpa membocorkan detail yang tidak perlu.[^9][^11][^10][^7][^8]

Ketiga, stealth addresses paling realistif diimplementasikan pada lapisan aplikasi/dompet, dengan pola one-time addresses yang dipetakan ke akun token SPL. Di Ethereum, praktik ini distandardisasi melalui ERC-5564; adaptasi ke Solana harusmempertimbangkan model akun dan multihadiah (multi-ATA) pada SPL. Risiko utama adalah kebocoran metadata (waktu, pola transaksi, interaksi DeFi) yang dapat mengurangi unlinkability; mitigasi meliputi penggunaan kebijakan spending yang hati-hati dan pemisahan domain operasional.[^3][^19]

Keempat, transaksi anonim tingkat jaringan (network-level anonymity) seperti pada Monero/Zcash saat ini tidak merupakan fokus utama Solana. Pendekatan Solana condong pada kerahasiaan data (jumlah, saldo) yang dapat diaudit, bukan anonimitas penuh. Untuk mencapai anonimitas yang kuat, diperlukan lapisan tambahan seperti komputasi rahasia terdistribusi (MPC/DeCC) dan desain anonimitas yang menyeluruh, yang belum lazim di L1 publik seperti Solana. Untuk x402, hal ini berarti anonymity-by-default kemungkinan besar tidak layak; anonymity-by-policy dapat dipertimbangkan dengan权衡 yang ketat.[^2][^5][^21]

Berdasarkan上述 analisis, prioritas implementasi yang disarankan adalah: (1) Confidential Transfers/Balances; (2) ZK Payment Proofs (deferred dan on-chain settlement); (3) Stealth addresses pada lapisan aplikasi/dompet; (4) studi kelayakan anonimitas tingkat jaringan dengan MPC/DeCC. Rekomendasi ini memaksimalkan manfaat privasi cepat, menjaga auditabilitas, dan meminimalkan friksi integrasi x402 di HTTP.

##背景 dan Ruang Lingkup: x402, Solana, dan Primitif Privasi

x402 adalah standar pembayaran berbasis HTTP yang menghidupkan kembali kode status 402 untuk memungkinkan pertukaran nilai on-chain sebagai bagian dari siklus request–response web. Dalam alur dasar, server menolak akses dengan 402, klien menghadirkan bukti pembayaran (misalnya tanda tangan dan komitmen), fasilitatormemverifikasi dan menyelesaikan transaksi, lalu server memberikan akses. x402 juga memperkenalkan skema deferred payments: komitmen kriptografis ditukar melalui HTTP Message Signatures, sementara penyelesaian finansial dapat dilakukan secara batch atau via skema tradisional. Desain ini memisahkan jabat tangan kriptografis dari penyelesaian, sehingga cocok untuk pagos machine-to-machine dan agen otonom.[^7][^8]

Di sisi blockchain, ekosistem Solana memiliki charakteristik unik: model akun yang mendorong program stateless, eksekusi paralel, dan berbagai ekstensi token. Dalam domain privasi, strategi yang berkembang adalah confidentiality with auditability—menjaga kerahasiaan jumlah atau saldo sembari tetap mempertahankan kemampuan audit. Fitur Confidential Transfer dan Confidential Balances pada Token22 memungkinkan enkripsi jumlah dan saldo, termasuk operasi mint/burn dan pemotongan fee secara rahasia, serta integrasi “global auditor key” untuk akses baca selektif. Ekstensi ini aimed at institutional use cases (misalnya payroll dan B2B) yang membutuhkan privasi tanpa mengorbankan akuntabilitas.[^1][^2][^13]

Privasi dalam blockchain bermanivestasi dalam dua domain utama. Pertama, on-chain privacy: kerahasiaan jumlah, saldo, dan atau alamat (tergantung teknik yang digunakan). Kedua, metadata privacy: keniscayaanobservasi struktur transaksi, waktu, pola interaksi, dan keterkaitan dengan aktivitas DeFi. Keduanya harus dievaluasi karena dampak privasi total tidak hanya ditentukan oleh enkripsi data on-chain, tetapi juga oleh jejak operasional di luar rantai.

Untuk x402, implikasinya jelas: fitur privasi harus berfungsi sebagai tambahan pada alur HTTP-native dan harus menjaga kompatibilitas dengan penyelesaian on-chain (Solana) serta skema deferred. Dengan kata lain, solusi yang diusulkan harus minimal invasif terhadap spesifikasi x402, efisien dalam compute budget, dan tidak memicu risiko kepatuhan yang tidak perlu.

Untuk mengilustrasikan capa Solana saat ini dalam mendukung privasi, Tabel 1 merangkum fitur dan statusnya.

Tabel 1. Pemetaan fitur privasi Solana dan statusnya

| Fitur                         | Deskripsi ringkas                                                                                   | Status utama (saat ini)           | Rujukan utama |
|------------------------------|------------------------------------------------------------------------------------------------------|-----------------------------------|---------------|
| Confidential Transfer        | Transfer token tanpa mengungkap jumlah; saldo pribadi; bukti ZK untuk validitas dan rentang          | Dinonaktifkan sementara (mainnet/devnet) karena audit Program ZK ElGamal | [^1][^16]     |
| Confidential Balances        | Saldo rahasia untuk token; dukungan mint/burn dan fee secara rahasia; opsi global auditor key         | Aktif secara konsep; ekosistem mendorong adopsi institusional             | [^2][^13][^17] |
| ZK Token Proof Program       | Verifikasi bukti ZK untuk enkripsi ElGamal; Sigma protocols; global auditor                          | Variasif; banyak komponen terstandarisasi di SPL; audit bug pernah terjadi | [^6][^12][^16] |
| ZK Syscalls (Poseidon, alt_bn128) | Dukungan verifikasi ZK on-chain: Poseidon untuk hash ZK-friendly; alt_bn128 untuk pairing/Groth16 | Tersedia/bergerak menuju ketersediaan luas untuk verifikasi Groth16       | [^9]          |

### Pemodelan Ancaman dan Asumsi

Dalam konteks x402+Solana, kami mempertimbangkan tiga tingkat adversary.

- On-chain observer: pihak yang membaca blockchain publik dan menganalisis pola transaksi, alamat, dan struktur program.
- Network-level observer: pihak yang mengkombinasikan data on-chain dengan metadata jaringan (IP, waktu, frekuensi akses, korelasi dengan aktivitas HTTP).
- Regulatory auditor: entitas yang memiliki kunci auditor atau akses legal untuk membuka informasi selektif guna memenuhi kewajiban kepatuhan.

Risiko umum meliputi deanonymization via linkage attacks, dust attacks, dan metadata leakage melalui korelasi transaksi HTTP dan on-chain. Asumsi trust meliputi:fasilitator pembayaran yang jujur, key management yang aman pada klien/dompet, serta sifat upgradeable dan governance program yang transparan.

## Evaluasi per Fitur

### Anonymous Transactions (Transaksi Anonim)

Definisi operasional untuk konteks x402+Solana: kemampuan untuk mencegah pengaitan pengirim–penerima dan隐藏 identitas mereka di level jaringan dan ledger, atau minimal mengurangi keterlacakan hingga ke level yang dapat ditoleransi.

Di protokolprivasi khusus seperti Monero, anonimitas достигается melalui ring signatures (mengaburkan pengirim), stealth addresses (memutus linkability penerima), dan RingCT (menyembunyikan jumlah). Di Zcash, zk-SNARKs pada shielded transactions memungkinkan privasi atas pengirim, penerima, dan jumlah. Namun, teknik-teknik ini bergantung pada model UTXO dan asumsi desain yang berbeda dari Solana (account-based). Di ekosistem Solana, komunitas lebih fokus pada confidential amounts dan auditability, bukan anonymity-by-default.[^3][^2]

Kelayakan implementasi anonimitas tingkat jaringan di Solana untuk x402 saat ini rendah. Untuk anonymity-by-default, diperlukan kombinasi teknik yang tidak lazim di L1 publik seperti Solana: bukti rentang agregat, one-time addresses dengan scanning adaptif, dan mekanisme pencegahan double-spending yang tidak mengekspos identitas. Pendekatan alternatif adalah anonymity-by-policy: memberikan unlinkability selektif (misalnya stealth addresses pada lapisan aplikasi) serta penggunaan komputasi rahasia terdistribusi (MPC/DeCC) untuk memproses transaksi pada data terenkripsi, sehingga identitas dan metadata tidak terlihat oleh observer biasa. Arcium menyampaikan DeCC sebagai infrastruktur untuk komputasi terenkripsi universal di Solana. Namun, kompleksitas operasional, trust assumption terhadap node MPC, dan biaya komputasi menjadi zat yang perlu dikelola hat-hati.[^5][^21]

Implikasi keamanan:Anonimitas yang kuat dapat memicu risiko regulasi dan delisting, meningkatkan kompleksitas audit, serta memperluas permukaan serangan terhadap key management dan coordinator anonimitas.trade-off antara privasi dan akuntabilitas harus dieksplisitkan dalam desain dan kebijakan. Studi akademik tentang keseimbangan anonimitas–akuntabilitas menunjukkan bahwa pendekatan selektif (selective de-anonymization) dapat mempertahankan privasi bagi mayoritas transaksi sambil memungkinkan pembukaan identitas pada kasus berisiko tinggi. Untuk x402, mekanisme seperti kunci auditor global atau kebijakan akses berbasis risiko dapat diaplikasikan, dengan tetap meminimalkan akses selektif tersebut.[^20]

Untuk menempatkan teknik-teknik privasi utama dalam perspektif, Tabel 2 merangkum cakupan privasi menurut literature

Tabel 2. Cakupan privasi menurut teknik

| Teknik                         | Pengirim       | Penerima      | Jumlah        | Keterangan ringkas                                               |
|-------------------------------|----------------|---------------|---------------|------------------------------------------------------------------|
| Ring Signatures               | Terbatas       | Tidak         | Tidak         | Mengaburkan pengirim dalam set anonimitas; tidak merahasi jumlah |
| Stealth Addresses             | Tidak          | Kuat          | Tidak         | One-time addresses; unlinkability untuk penerima                 |
| Pedersen Commitments          | Tidak          | Tidak         | Kuat          | Menyembunyikan nilai; memerlukan bukti rentang                  |
| zk-SNARKs                     | Kuat           | Tidak (tanpa z-address) | Kuat    | Bukti ringkas non-interaktif; pada Zcash paired dengan z-addresses |
| Ring Confidential Transactions (RingCT) | Terbatas | Kuat          | Kuat          | Mengaburkan pengirim dan nilai; pencegahan double-spending       |

Sumber: sintesis literatur akademis tentang teknik privasi blockchain.[^3]

### Private Payment Amounts

Solana menyediakan dua fitur inti: Confidential Transfer dan Confidential Balances. Keduanya memungkinkan transfer token dengan jumlah yang tidak terlihat publik, serta menjaga saldo akun tetap pribadi. Confidential Transfer menggunakan skema enkripsi ElGamal dan bukti-bukti ZK untuk memverifikasi kesetaraan input/output, validitas ciphertext, dan rentang nilai (range proof), dengan alur deposit–apply–withdraw yang memisahkan saldo “pending” dan “available” secara rahasia. Confidential Balances melangkah lebih jauh dengan menyediakan mekanisme saldo rahasia yang komprehensif untuk SPL Token, termasuk operasi mint/burn dan pemotongan fee secara rahasia. Ekstensi ini juga mengizinkan penggunaan “global auditor key” untuk akses baca selektif bagi keperluan audit/kepatuhan, sebuah pendekatan yang secara eksplisit mengutamakan auditabilitybeserta privasi.[^1][^13][^2]

Status fitur: Confidential Transfer saat ini dinonaktifkan sementara di mainnet/devnet sambil menunggu audit keamanan Program ZK ElGamal dan bukti-bukti terkait. Insiden bug “Phantom challenge soundness” pada Solana’s ZK proof program mengonfirmasi bahwa verifikasi ZK memerlukan ketelitian tinggi dan uji mendalam; audit oleh komunitas (code423n4) menandakan bahwa fitur ini signifikan secara finansial dan keamanan. Dengan demikian, rekomendasi kami adalah menunggu hasil audit, mengaktifkan kembali secara bertahap (gated activation), dan melengkapi dengan canary deployments serta uji beban yang terkontrol sebelum produksi penuh.[^1][^16][^15]

Integrasi ke alur x402 dapat dilakukan dalam dua mode. Pertama, mode on-chain settlement: klien menitipkan bukti pembayaran dengan ZKP atas jumlah yang disembunyikan, sehingga server memberikan akses setelah penyelesaian on-chain validator确认. Kedua, mode deferred: klien menyajikan komitmen berbayar (HTTP Message Signature) beserta ZKP bahwa komitmen tersebut sah (misalnya ketersediaan dana atau kepatuhan batasan spend). Pada deferred, penyelesaian finansial dapat ditangguhkan, di-batch, atau diselesaikan via skema tradisional, tetapi ZKP tetap memberikan jaminan kriptografis instan bahwa kewajiban tertentu terpenuhi tanpa membocorkan detail sensitif.[^7][^8]

Biaya dan performa adalah pertimbangan praktis. Verifikasi ZK on-chain di Solana membutuhkan compute units (CU) yang cukup besar. Data referensi menunjukkan verifikasi validity proof ZK Compression memerlukan ~100k CU, penggunaan sistem ~100k CU, serta tambahan ~6k CU per baca/tulis akun terkompresi. Namun, perluasan CU untuk bukti Transfer Rahasia (confidential amount) bisa berbeda skala; pembanding ZK Compression memberi gambaran kasar bahwa verifikasi bukti menambah beban signifikan pada runtime. Strategi mitigate meliputi batching proofs, sharding workload, dan off-chain proving yang dioptimalkan.[^9]

Untuk memperjelas aliran privasi jumlah di Token22, Tabel 3 merangkum instruksi utama.

Tabel 3. Alur instruksi Confidential Transfer/Balances

| Instruksi                     | Tujuan utama                                              | Catatan keamanan/privasi                               |
|------------------------------|-----------------------------------------------------------|--------------------------------------------------------|
| Initialize/UpdateMint        | Menyiapkan/mengkonfigurasi mint untuk transfer rahasia    | Harus diinisialisasi dalam transaksi yang sama         |
| ConfigureAccount             | Menyiapkan akun token untuk transfer rahasia              | Validasi bukti pubkey validity diperlukan              |
| ApproveAccount               | Persetujuan akun token baru (jika diperlukan oleh mint)   | Governance/policy kontrol                              |
| Deposit                      | Menyetor saldo publik ke saldo rahasia pending            | Pending→available via ApplyPendingBalance               |
| Withdraw                     | Menarik saldo tersedia rahasia ke saldo publik            | Memerlukan bukti ZK dan validasi rentang                |
| Transfer                     | Mentransfer token secara rahasia antar akun               | Bukti kesetaraan, validitas ciphertext, range proof    |
| ApplyPendingBalance          | Mengaktifkan saldo pending ke saldo tersedia              | Memutus linkability saldo publik–rahasia                |
| Enable/DisableConfidentialCredits | Mengizinkan/menonaktifkan kredit rahasia             | Policy kontrol per akun                                |
| Enable/DisableNonConfidentialCredits | Mengizinkan/menonaktifkan kredit publik          | Memisahkan moda transfer                               |
| TransferWithFee              | Transfer rahasia dengan pemotongan fee                     | Fee disembunyikan; bukti tetap diperlukan              |

Sumber: dokumentasi ekstensi Transfer Rahasia Solana.[^1]

### Zero-Knowledge Payment Proofs (ZK Payment Proofs)

x402 dapat diperluas dengan ZK payment proofs yang beroperasi baik untuk on-chain settlement maupun deferred payments. Pada on-chain settlement, ZKP menjadi bagian dari transaksi token confidential, memverifikasi ketersediaan dana tersembunyi, kesetaraan input/output, dan kepatuhan batasan tanpa membocorkan alamat atau jumlah. Pada deferred payments, ZKP menyertai komitmen HTTP yang ditandatangani, memberi jaminan kriptografis kepada server bahwa klien telah memenuhi syarat tertentu (misalnya batas spend, aktivitas yang diizinkan), sementara penyelesaian finansial baru terjadi kemudian.

Di Solana, primitives untuk ZK sudah tersedia dan terus meningkat maturitasnya. Syscalls Poseidon menyediakan hash yang efisien untuk ZK, sementara alt_bn128 memampukan operasi pairing untuk verifikasi Groth16. Riset akademik menunjukkan kemungkinan verifikasi L1 on-chain ZK-STARK+PQC, membuka jalan untuk proof systems yang transparan (tanpa trusted setup) dan tahan kuantum, meskipun ukuran bukti STARK yang lebih besar menjadi kendala pada bandwidth dan compute budget. Studi ini juga menekankan kontrol DoS, fee controls, dan binding public inputs ke ciphertext sebagai prinsip penting untuk verifikasi L1 yang aman dan efisien.[^9][^11][^10]

Untuk membantu pemilihan teknologi ZK, Tabel 4 membandingkan SNARK vs STARK pada konteks x402+Solana.

Tabel 4. SNARK vs STARK pada x402+Solana

| Kriteria                  | SNARK (mis. Groth16)                                 | STARK                                               |
|--------------------------|-------------------------------------------------------|-----------------------------------------------------|
| Trusted setup            | Diperlukan (per sirkuit untuk Groth16; universal untuk PLONK) | Tidak diperlukan (transparan)                      |
| Ukuran bukti             | Sangat kecil (≈100–200 byte)                          | Lebih besar (beberapa ratus KB)                    |
| Waktu verifikasi         | Sangat cepat (milidetik)                              | Cepat, namun sering lebih berat dari SNARK         |
| Ketahanan kuantum        | Lebih rendah (bergantung pairing-friendly curves)     | Lebih tinggi (bergantung hash dan informasi teori) |
| Kompatibilitas Solana    | Tinggi (alt_bn128; Groth16 verifier di syscalls)      | Mungkin lebih tinggi secara asumsi, namun bukti besar |
| Kebutuhan compute budget | Lebih rendah per bukti                                | Lebih tinggi per bukti (ukuran/verifikasi)          |

Sumber: diskusi teknis Helius; pembanding SNARK–STARK; verifikasi L1 on-chain STARK+PQC.[^9][^10][^11]

Biaya performa on-chain jangan diremehkan. Sebagai gambaran, ZK Compression—yang menggunakan Groth16—mengharuskan ~100k CU untuk verifikasi validity proof dan biaya tambahan yang sebanding untuk penggunaan sistem dan I/O akun terkompresi. Mengintegrasikan bukti pembayaran ZK untuk confidential transfers akan menambah CU di atas baseline transfer biasa; strategi pengurangan biaya meliputi menggabungkan bukti (batching), penggunaan off-chain provers yang kuat, dan meminimalkan reference data on-chain per bukti. Untuk deferred payments, biaya on-chain bisa dikurangi karena bukti主要用于 verifikasi komitmen HTTP, bukan transaksi;namun tetap harus memastikan binding antara public inputs dan ciphertext serta kontrol fee yang memadai.[^9][^11]

### Stealth Addresses

Stealth addresses menyediakan unlinkability penerima dengan menciptakan one-time address per transaksi. Di Ethereum, praktik ini distandardisasi melalui ERC-5564, termasuk panduan untuk generate dan scan stealth addresses. Pada x402+Solana, stealth addresses dapat diimplementasikan di lapisan aplikasi/dompet: setiap invoice atau permintaan pembayaran menghasilkan satu alamat sekali pakai yang dipetakan ke akun SPL (misalnya via Associated Token Account, ATA). Dompet penerima melakukan scanning untuk menemukan dana yang ditujukan ke stealth address dan spend melalui kunci yang relevan.

Implikasi kompatibilitas dengan SPL: Solana tidak memiliki konsep z-addresses seperti Zcash; alamat token adalah publik dalam ledger, sehingga stealth address perlu memetakan ke akun token yang terlihat, tetapione-time address memotong linkability antara alamat publik penerima dan transaksi individual. Unlinkability bergantung pada disiplin penggunaan—pola spending, reuse kunci, dan interaksi DeFi. Metadata seperti waktu transaksi, frekuensi, dan pola interaksi dengan protokol tertentu tetap dapat deanonymize pengguna bila tidak dikelola. Mitigasi meliputi kebijakan spending yang menghindari reuse kunci, pemisahan domain operasional (misal dompet untuk aktivitas publik vs pribadi), dan penggunaan ZKP untuk provenance tanpa membocorkan identitas.[^3][^19]

Untuk mengilustrasikan praktik terbaik, Tabel 5 merangkum perbedaan implementasi stealth address antara ERC-5564 (Ethereum) dan pendekatan potensial di Solana.

Tabel 5. Perbandingan stealth addresses (Ethereum vs Solana)

| Aspek                     | Ethereum (ERC-5564)                                 | Solana (pendekatan aplikasi/dompet)                        |
|--------------------------|------------------------------------------------------|------------------------------------------------------------|
| Lapisan implementasi     | Standar protokol di atas EVM                        | Lapisan aplikasi/dompet; pemetaan ke akun token            |
| Skema alamat             | Stealth address gen. dengan kunci pandang/belanja   | One-time address dipetakan ke ATA/SPL token                |
| Scanning                 | Dompet melakukan scanning sesuai standar            | Dompet scanning stealth address→akun token                 |
| Kompatibilitas token     | ERC-20/721                                           | SPL Token via ATA                                          |
| Privasi yang dicapai     | Unlinkability penerima                               | Unlinkability pada ledger; alamat token tetap publik       |
| Metadata leakage         | Tetap ada via pola on-chain                         | Tetap ada; perlu kebijakan spending dan pemisahan domain   |

Sumber: panduan ERC-5564; literatur stealth addresses Monero; adaptasi ke SPL.[^19][^3]

## Kelayakan Implementasi dan Integrasi ke x402

Pada tingkat protokol, integrasi privasi ke x402 harus memperlakukan payments dan proofs sebagai bagian dari autentikasi tanpa состоя. Untuk pembayaran rahasia berbasis Solana, klien menghadirkan bukti pembayaran dengan header HTTP yang menanggung komitmen (message signatures) serta ZKP yang relevan. Bila settlement dilakukan on-chain, facilitator menyelesaikan transaksi token confidential dan memberi konfirmasi; bila deferred, server menerima bukti kriptografis komitmen dan menandai akses diberikan, sambil menyelesaikan pembayaran secara batch kemudian hari.

Pertukaran data dengan validator/node bertambah复杂性: instruksi Token22 untuk confidential transfer, bukti ZK untuk validitas jumlah dan rentang, serta akun konteks untuk penyimpanan metadata bukti (yang ditutup после penggunaan). Pada integrator/SDK dompet, dukungan untuk Prove–Verify workflow on-chain (untuk settlement) dan untuk komitmen deferred (untuk skema pembayaran tertunda) menjadi kunci. Komponen-komponen praktik seperti syscalls ZK (Poseidon, alt_bn128) mempercepat verifikasi Groth16 pada bukti ZK; namun, biaya CU harus dikelola agar tidak menurunkan pengalaman pengguna pada micropayments.[^7][^8][^1][^9]

Untuk memperjelas pilihan arsitektural, Tabel 6 membandingkan pendekatan on-chain settlement vs deferred payment.

Tabel 6. On-chain settlement vs deferred payments

| Dimensi              | On-chain settlement (Solana)                               | Deferred (x402)                                                |
|----------------------|------------------------------------------------------------|----------------------------------------------------------------|
| Alur                  | 402 → bukti pembayaran → transaksi token confidential → akses | 402 → HTTP message signature + ZKP komitmen → akses → penyelesaian später |
| Privasi               | Jumlah/saldo pribadi via Confidential Transfer/Balances     | Jumlah bisa pribadi atau tetap Privat via ZKP; alamat terlihat   |
| Biaya CU              | Lebih tinggi (verifikasi ZK + eksekusi transfer)            | Lebih rendah di on-chain (bukti主要用于 verifikasi komitmen)     |
| Latensi               | Sekitar konfirmasi on-chain (detik)                         | Akses segera via komitmen; penyelesaian async                   |
| Kepatuhan             | Audit via kunci auditor global (opsional)                   | Audit via binding komitmen; kebijakan akses selektif             |
| Kompleksitas          | Moderat–tinggi (instruksi Token22 + ZK proof)              | Moderat (HTTP-native signatures + ZKP untuk komitmen)           |

Sumber: x402 (Cloudflare); Solana Token22; ZK di Solana.[^7][^8][^1][^9]

## Analisis Keamanan dan Threat Model

Privasi on-chain rentan terhadap berbagai vektor serangan. Deanonymization via linkage attacks memanfaatkan korelasi alamat, pola transaksi, dan metadata operasional untuk memetakan identitas pengguna. Dust attacks mengirim dana kecil ke alamat untuk mengganggu privasi dan memaksa interaksi; pada desain confidential amounts, dampak dust dapat dikurangi karena saldo dan jumlah tidak terlihat, tetapi tetap harus ditangani dengan kebijakan spend yang bijaksana. Double-spend prevention pada scheme privasi membutuhkan nullifier atau key images; pada Solana, confidential transfer mengandalkan bukti ZK dan struktur enkripsi yang mengikat saldo, tetapi disiplin penggunaan (apply/withdraw) berperan penting untuk mencegah kebingungan saldo.

Pada lapisan protokol, integrasi x402 menuntut verifikasi tanda tangan pesan HTTP, binding komitmen ke resource yang diminta, dan enforcement kebijakan akses. Pada lapisan ZK, incident bug “Phantom challenge soundness” pada Solana’s ZK proof program memperlihatkan bahwa kesalahan soundness dapat berakibat fatal.Audit yang kini berjalan pada komponen confidential transfer menandakan kebutuhan akanverifikasi bukti yang ketat, perbaikan bug promptly, dan kebijakan release yang hati-hati (misalnya fitur gates). Secara lebih umum, keamanan program Solana memiliki pola kerentanan yang sering muncul—data validation flaws, arbitrary CPI, ownership/signer checks missing, PDA misuse, seed collisions—yang harus dimitigasi dengan validasi input komprehensif, kontrol akses, dan práticas terbaik pengembangan (Anchor constraints, Address Lookup Tables, pemeriksaan tetap setelah CPI).[^16][^15][^14]

Untuk mengoperasionalkan mitigasi, Tabel 7 memetakanvektor serangan terhadap kontrol yang disarankan.

Tabel 7. Pemetaan serangan → kontrol mitigasi

| Serangan/Vektor                    | Deskripsi                                           | Kontrol mitigasi utama                                          |
|-----------------------------------|-----------------------------------------------------|------------------------------------------------------------------|
| Linkage/deanonymization           | Korelasi alamat, pola transaksi, metadata           | Unlinkability via stealth addresses; kebijakan spend; ZKP untuk privasi jumlah |
| Dust attacks                      | Saldo kecil memaksa interaksi                       | Confidential amounts; pemisahan dompet; kebijakan ignore/merge   |
| Double-spending                   | Pengeluaran ganda pada saldo rahasia                | ZKP binding saldo; nullifier-like controls; apply/withdraw disiplin |
| Arbitrary CPI                     | Pemanggilan program tak sah                         | Validasi program ID; Anchor CPI modules; allowlist program       |
| Ownership/signer check missing    | Operasi istimewa tanpa validasi pemilik/signer      | Pemeriksaan owner & is_signer; Anchor Signer/Account; pemisahanotoritas |
| PDA misuse & seed collisions      | Saluran otoritas bercampur; tabrakan seed           | Unique seeds; bump kanonis; modular PDA per domain; validasi seed |
| ZK soundness bugs                 | Kesalahan verifikasi bukti                          | Audit komunitas; gated activation; canary deployments; regression tests |
| HTTP signature abuse              | Komitmen tidak terikat ke resource                  | Signature binding; header policy; JWK dir verification           |

Sumber:bug ZK Solana; audit code423n4; guide keamanan program Solana; ZK Token Proof Program.[^16][^15][^14][^6]

## Skalabilitas, Biaya, dan Dampak Performa

Dukungan ZK di Solana meningkat, namun verifikasi bukti on-chain membutuhkan biaya CU yang tidak trivial. Data rujukan pada ZK Compression menunjukan verifikasi validity proof ~100k CU, penggunaan sistem ~100k CU, serta tambahan ~6k CU per baca/tulis akun terkompresi. Mengintegrasikan ZKP untuk bukti pembayaran akan menambah biaya di atas operasi transfer biasa. Mengelola compute budget menjadi prioritas utama agar micropayments berbasis x402 tetap efisien.

Strategi optimasi meliputi: batching proofs untuk mengurangi overhead verifikasi per transaksi, penggunaan off-chain provers (misalnya jaringan prover khusus) untuk menghasilkan bukti yang ringan, dan penyesuaian transaksi (sharding workload) agar referensi data on-chain per bukti minimal. Pertimbangan desain seperti ukuran bukti (STARK lebih besar) dan kebutuhan pairing (SNARK dengan alt_bn128) juga memengaruhi kelayakan solusi pada latency-sensitive micropayments.[^9][^10]

Untuk memberi gambaran komparatif biaya, Tabel 8 menyajikan perkiraan CU dan implikasi latency.

Tabel 8. Estimasi biaya dan performa

| Komponen                             | Estimasi CU            | Implikasi latency/payload                    |
|--------------------------------------|------------------------|---------------------------------------------|
| Verifikasi validity proof (Groth16)  | ~100k CU               | Tambahan latency; payload bukti ≈128–200 B  |
| Penggunaan sistem (per transaksi)    | ~100k CU               | overhead ثابت per transaksi                 |
| Per akun terkompresi (read/write)    | ~6k CU                 | Biaya tambahan jika transaksi menyentuh banyak akun |
| Confidential transfer ZKP (estimasi) | Lebih tinggi dari baseline | Bergantung bukti rentang & ciphertext validity |

Sumber: Helius (ZK Compression dan ZK di Solana). Angkaini bersifat indikatif; angka aktual dapat bervariasi.[^9]

## Regulasi dan Kepatuhan

Privasi yang dapat diaudit (confidential with auditability) memiliki posisi lebih kuat di berbagai yurisdiksi dibanding anonimitas penuh. Solana melalui Confidential Balances mengizinkan akses baca selektif menggunakan global auditor key, menyeimbangkan privasi dengan kebutuhan oversight. Dalam kerangka academic privacy–accountability, pendekatan selective de-anonymization dapat menjaga privasi mayoritas transaksi sambil membuka identitas pada kasus berisiko tinggi. Strategi ini selaras dengan prinsip “compliance by design” untuk x402: mekanisme yang memungkinkan akses terbatas dan dapat diaudit, dokumentasi yang jelas, serta kebijakan yang transparan.[^2][^20][^21]

Risiko delisting dan kewajiban pelaporan meningkat untuk fitur yang mendorong anonimitas tak terikat. Oleh sebab itu, x402+Solana sebaiknya mengutamakan kerahasiaan yang dapat diaudit dan kontrol kebijakan akses yang jelas, daripada anonymity-by-default yang membawa ketidakpastian regulasi lebih tinggi.

## Roadmap Implementasi dan Rekomendasi

Tahap 1: Confidential Transfer/Balances. Prioritaskan integrasi ekstensi Token22 untuk merahasiakan jumlah dan saldo. Tunggu hasil audit Program ZK ElGamal; aktifkan kembali secara bertahap dengan feature gates, uji beban terkontrol, dan canary deployments. Dompet harus menyupport instruksi deposit–apply–withdraw dan kebijakan spending yang aman.

Tahap 2: ZK Payment Proofs (deferred dan on-chain). Perluas SDK x402 untuk membawa ZKP yang menyertai komitmen pembayaran—baik pada on-chain settlement maupun deferred payments. Sertakan binding antara public inputs dan ciphertext, verifikasi signature JWK, dan kontrol DoS/fee sesuai temuan riset verifikasi L1. Koordinasikan dengan node RPC yang mendukung verifikasi ZK on-chain (syscalls Poseidon/alt_bn128) dan provers yang relevan.[^1][^7][^11]

Tahap 3: Stealth addresses di lapisan aplikasi/dompet. Terapkan one-time addresses yang dipetakan ke akun token SPL, ikuti pola ERC-5564 dalam hal metadata dan panduan generate/scan. Edukasi pengguna tentang pentingnya kebijakan spending dan pemisahan domain operasional untuk mengurangi metadata leakage. Pastikan kompatibilitas dengan ATA dan integrasi yang mudah di dompet utama.[^19]

Tahap 4: Studi kelayakan anonimitas tingkat jaringan. Jajaki integrasi MPC/DeCC (Arcium) untuk memproses transaksi pada data terenkripsi. Fokus pada trust assumption terhadap node MPC, overhead komputasi, dan kebijakan audit selektif. Jika kompleksitas dan risiko regulasi terlalu tinggi, prioritaskan anonymity-by-policy yang tetap menjaga auditability.

Untuk mengoperasionalkan roadmap, Tabel 9 menyediakan checklist dan milestone.

Tabel 9. Checklist implementasi per fitur

| Fitur                          | Dependensi utama                   | Audit           | Testnet → Mainnet                          | KPI/Ketahanan                        |
|-------------------------------|------------------------------------|-----------------|--------------------------------------------|--------------------------------------|
| Confidential Transfer/Balances | Token22, ZK ElGamal, syscalls ZK    | code423n4, internal | Feature gates, canary → activation penuh     | Verifikasi bukti stabil; CU terkendali; error rate rendah |
| ZK Payment Proofs              | alt_bn128, Groth16, Poseidon        | Security review | POC deferred → on-chain settlement           | Binding komitmen valid; DoS mitigation |
| Stealth addresses              | Dompet/SDK, ATA/SPL                 | N/A             | Beta terbatas → produksi                    | Unlinkability terjaga; metadata minimized |
| Anonimitas jaringan (studi)    | MPC/DeCC, governance                | N/A             | Penelitian → prototype                      | Trust assumptions jelas; audit selektif |

Sumber: Token22; x402 deferred; audit code423n4; Arcium DeCC.[^1][^7][^15][^5]

## Kesimpulan dan权衡 (Trade-offs)

Strategi implementasi privasi x402+Solana yang paling masuk akal saat ini adalah memprioritaskan confidential amounts dan ZK payment proofs, sembari menambahkan stealth addresses pada lapisan aplikasi. Anonimitas tingkat jaringan尽管 menarik secara teknis, namun kurang selaras dengan fokus ekosistem Solana terhadap kerahasiaan yang dapat diaudit dan memerlukan kompleksitas serta asumsi trust yang signifikan.

衡量的 utama meliputi privasi vs akuntabilitas, performa vs biaya verifikasi ZK, serta risiko kepatuhan vs adopsi pasar. Dengan mengaktifkan confidential amounts secara hati-hati, memperkaya x402 dengan ZKP yang terikat pada komitmen pembayaran, dan menjaga kebijakan audit selektif, kita dapat mencapai privasi yang bermakna tanpa mengorbankan transparency yang diperlukan untuk kepatuhan dan kepercayaan ekosistem.

## Informasi yang Masih Kurang (Information Gaps)

Terdapat beberapa celah informasi yang perlu ditangani sebelum produksi: hasil dan status akhir audit Program ZK ElGamal pasca-penonaktifan; angka biaya compute aktual untuk verifikasi bukti ZK pada confidential transfers (selain rujukan ZK Compression); spesifikasi formal adaptasi stealth addresses ke model akun Solana dan peta ke SPL; detail implementasi Arcium/MPC yang relevan untuk operasi pembayaran privat; status ketersediaan alt_bn128 dan Poseidon syscalls di jaringan mainnet (fees, aktivasi fitur); serta kerangka kepatuhan yurisdiksi spesifik jika fitur privasi diadopsi luas.

---

## References

[^1]: Confidential Transfer - Solana. https://solana.com/docs/tokens/extensions/confidential-transfer  
[^2]: Privacy on Solana: How Confidential Balances Work - OKX. https://www.okx.com/learn/solana-blockchain-privacy-confidential-balances  
[^3]: Summarizing and Analyzing the Privacy-Preserving Techniques in Blockchains - arXiv (2109.07634). https://arxiv.org/html/2109.07634v3  
[^4]: Privacy Coins 101: Anonymity-Enhanced Cryptocurrencies - Chainalysis. https://www.chainalysis.com/blog/privacy-coins-anonymity-enhanced-cryptocurrencies/  
[^5]: The Rebirth of Privacy on Solana - Arcium. https://www.arcium.com/articles/the-rebirth-of-privacy-on-solana  
[^6]: ZK Token Proof Program - Solana Docs. https://docs.solanalabs.com/runtime/zk-token-proof  
[^7]: Launching the x402 Foundation with Coinbase, and support for x402 - Cloudflare. https://blog.cloudflare.com/x402/  
[^8]: What Is x402 Protocol: Inside Coinbase's New Standard for Onchain and AI Payments - Bitget Academy. https://web3.bitget.com/en/academy/what-is-x402-protocol-inside-coinbases-new-standard-for-onchain-and-ai-payments  
[^9]: Zero-Knowledge Proofs: Its Applications on Solana - Helius. https://www.helius.dev/blog/zero-knowledge-proofs-its-applications-on-solana  
[^10]: zk-SNARKs vs zk-STARKs - Chainlink. https://chain.link/education-hub/zk-snarks-vs-zk-starks  
[^11]: Full L1 On-Chain ZK-STARK+PQC Verification on Solana - IACR ePrint 2025/1741. https://eprint.iacr.org/2025/1741  
[^12]: Confidential SPL Token Deep Dive: Encryption (Twisted ElGamal) - Solana. https://spl.solana.com/confidential-token/deep-dive/encryption#twisted-elgamal-encryption  
[^13]: Confidential SPL Token Deep Dive: Overview (Global Auditor) - Solana. https://spl.solana.com/confidential-token/deep-dive/overview#global-auditor  
[^14]: A Hitchhiker's Guide to Solana Program Security - Helius. https://www.helius.dev/blog/a-hitchhikers-guide-to-solana-program-security  
[^15]: 2025-08 Solana Foundation: Confidential Transfer Audit - Code4rena (GitHub). https://github.com/code-423n4/2025-08-solana-foundation  
[^16]: Uncovering the Phantom Challenge Soundness Bug in Solana's ZK Proof Program - zksecurity. https://blog.zksecurity.xyz/posts/solana-phantom-challenge-bug/  
[^17]: Solana developers launch 'Confidential Balances' token extensions - The Block. https://www.theblock.co/post/350076/solana-developers-launch-new-confidential-balances-token-extensions-to-improve-onchain-privacy  
[^18]: Confidential Balances: Empowering Confidentiality on Solana - Helius. https://www.helius.dev/blog/confidential-balances  
[^19]: Private Transactions on Ethereum using Stealth Addresses (ERC-5564) - QuickNode. https://www.quicknode.com/guides/ethereum-development/wallets/how-to-use-stealth-addresses-on-ethereum-eip-5564  
[^20]: The Trade-Off Between Anonymity and Accountability in Blockchain - IJCIT (2025). https://www.ijcit.com/index.php/ijcit/article/view/503  
[^21]: Blockchain privacy and regulatory compliance: Towards a practical ... - ScienceDirect. https://www.sciencedirect.com/science/article/pii/S2096720923000519