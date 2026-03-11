export interface ProperNoun {
  id: string;
  original: string;
  english: string;
  korean: string;
  type: 'person' | 'place' | 'object' | 'title' | 'tribe' | 'nation';
  description: string;
  descriptionKo: string;
  strongsNumber?: string;
  occurrences: number;
}

export const PROPER_NOUNS: ProperNoun[] = [
  // ===== PEOPLE (인물) =====
  { id: 'adam', original: 'אָדָם', english: 'Adam', korean: '아담', type: 'person', description: 'The first man created by God.', descriptionKo: '하나님이 창조하신 최초의 사람.', strongsNumber: 'H121', occurrences: 30 },
  { id: 'eve', original: 'חַוָּה', english: 'Eve', korean: '하와', type: 'person', description: 'The first woman, wife of Adam.', descriptionKo: '최초의 여자, 아담의 아내.', strongsNumber: 'H2332', occurrences: 4 },
  { id: 'noah', original: 'נֹחַ', english: 'Noah', korean: '노아', type: 'person', description: 'Builder of the ark who survived the great flood.', descriptionKo: '방주를 지어 대홍수에서 살아남은 사람.', strongsNumber: 'H5146', occurrences: 46 },
  { id: 'abraham', original: 'אַבְרָהָם', english: 'Abraham', korean: '아브라함', type: 'person', description: 'Father of the Jewish nation, called by God from Ur.', descriptionKo: '유대 민족의 조상, 하나님께서 우르에서 부르신 사람.', strongsNumber: 'H85', occurrences: 175 },
  { id: 'sarah', original: 'שָׂרָה', english: 'Sarah', korean: '사라', type: 'person', description: 'Wife of Abraham, mother of Isaac.', descriptionKo: '아브라함의 아내, 이삭의 어머니.', strongsNumber: 'H8283', occurrences: 38 },
  { id: 'isaac', original: 'יִצְחָק', english: 'Isaac', korean: '이삭', type: 'person', description: 'Son of Abraham and Sarah, father of Jacob and Esau.', descriptionKo: '아브라함과 사라의 아들, 야곱과 에서의 아버지.', strongsNumber: 'H3327', occurrences: 112 },
  { id: 'rebekah', original: 'רִבְקָה', english: 'Rebekah', korean: '리브가', type: 'person', description: 'Wife of Isaac, mother of Jacob and Esau.', descriptionKo: '이삭의 아내, 야곱과 에서의 어머니.', strongsNumber: 'H7259', occurrences: 30 },
  { id: 'jacob', original: 'יַעֲקֹב', english: 'Jacob', korean: '야곱', type: 'person', description: 'Son of Isaac, father of the twelve tribes of Israel.', descriptionKo: '이삭의 아들, 이스라엘 열두 지파의 조상.', strongsNumber: 'H3290', occurrences: 349 },
  { id: 'esau', original: 'עֵשָׂו', english: 'Esau', korean: '에서', type: 'person', description: 'Twin brother of Jacob, father of the Edomites.', descriptionKo: '야곱의 쌍둥이 형, 에돔 사람들의 조상.', strongsNumber: 'H6215', occurrences: 97 },
  { id: 'rachel', original: 'רָחֵל', english: 'Rachel', korean: '라헬', type: 'person', description: 'Wife of Jacob, mother of Joseph and Benjamin.', descriptionKo: '야곱의 아내, 요셉과 베냐민의 어머니.', strongsNumber: 'H7354', occurrences: 47 },
  { id: 'leah', original: 'לֵאָה', english: 'Leah', korean: '레아', type: 'person', description: 'First wife of Jacob, mother of six sons.', descriptionKo: '야곱의 첫째 아내, 여섯 아들의 어머니.', strongsNumber: 'H3812', occurrences: 34 },
  { id: 'joseph', original: 'יוֹסֵף', english: 'Joseph', korean: '요셉', type: 'person', description: 'Son of Jacob who became ruler of Egypt.', descriptionKo: '야곱의 아들로 이집트의 통치자가 된 사람.', strongsNumber: 'H3130', occurrences: 213 },
  { id: 'moses', original: 'מֹשֶׁה', english: 'Moses', korean: '모세', type: 'person', description: 'Prophet who led Israel out of Egypt and received the Law.', descriptionKo: '이스라엘을 이집트에서 이끌어 내고 율법을 받은 선지자.', strongsNumber: 'H4872', occurrences: 803 },
  { id: 'aaron', original: 'אַהֲרֹן', english: 'Aaron', korean: '아론', type: 'person', description: 'Brother of Moses, first high priest of Israel.', descriptionKo: '모세의 형, 이스라엘의 첫 대제사장.', strongsNumber: 'H175', occurrences: 347 },
  { id: 'miriam', original: 'מִרְיָם', english: 'Miriam', korean: '미리암', type: 'person', description: 'Sister of Moses and Aaron, a prophetess.', descriptionKo: '모세와 아론의 누이, 여선지자.', strongsNumber: 'H4813', occurrences: 15 },
  { id: 'joshua', original: 'יְהוֹשֻׁעַ', english: 'Joshua', korean: '여호수아', type: 'person', description: 'Successor of Moses who led Israel into the Promised Land.', descriptionKo: '모세의 후계자로 이스라엘을 약속의 땅으로 인도한 사람.', strongsNumber: 'H3091', occurrences: 218 },
  { id: 'caleb', original: 'כָּלֵב', english: 'Caleb', korean: '갈렙', type: 'person', description: 'One of two faithful spies who entered the Promised Land.', descriptionKo: '약속의 땅에 들어간 두 명의 충실한 정탐꾼 중 한 명.', strongsNumber: 'H3612', occurrences: 36 },
  { id: 'deborah', original: 'דְּבוֹרָה', english: 'Deborah', korean: '드보라', type: 'person', description: 'Prophetess and judge of Israel.', descriptionKo: '여선지자이자 이스라엘의 사사.', strongsNumber: 'H1683', occurrences: 10 },
  { id: 'gideon', original: 'גִּדְעוֹן', english: 'Gideon', korean: '기드온', type: 'person', description: 'Judge who defeated the Midianites with 300 men.', descriptionKo: '300명의 군사로 미디안 사람들을 무찌른 사사.', strongsNumber: 'H1439', occurrences: 39 },
  { id: 'samson', original: 'שִׁמְשׁוֹן', english: 'Samson', korean: '삼손', type: 'person', description: 'Judge known for extraordinary strength from God.', descriptionKo: '하나님으로부터 비범한 힘을 받은 사사.', strongsNumber: 'H8123', occurrences: 38 },
  { id: 'ruth', original: 'רוּת', english: 'Ruth', korean: '룻', type: 'person', description: 'Moabite woman who became ancestor of David and Jesus.', descriptionKo: '다윗과 예수님의 조상이 된 모압 여인.', strongsNumber: 'H7327', occurrences: 12 },
  { id: 'samuel', original: 'שְׁמוּאֵל', english: 'Samuel', korean: '사무엘', type: 'person', description: 'Last judge and prophet who anointed Saul and David.', descriptionKo: '사울과 다윗에게 기름을 부은 마지막 사사이자 선지자.', strongsNumber: 'H8050', occurrences: 140 },
  { id: 'saul', original: 'שָׁאוּל', english: 'Saul', korean: '사울', type: 'person', description: 'First king of Israel.', descriptionKo: '이스라엘의 첫 번째 왕.', strongsNumber: 'H7586', occurrences: 399 },
  { id: 'david', original: 'דָּוִד', english: 'David', korean: '다윗', type: 'person', description: 'Second king of Israel, author of many Psalms.', descriptionKo: '이스라엘의 두 번째 왕, 많은 시편의 저자.', strongsNumber: 'H1732', occurrences: 1076 },
  { id: 'solomon', original: 'שְׁלֹמֹה', english: 'Solomon', korean: '솔로몬', type: 'person', description: 'Son of David, wisest king, builder of the Temple.', descriptionKo: '다윗의 아들, 가장 지혜로운 왕, 성전을 건축한 왕.', strongsNumber: 'H8010', occurrences: 293 },
  { id: 'elijah', original: 'אֵלִיָּהוּ', english: 'Elijah', korean: '엘리야', type: 'person', description: 'Prophet who confronted the prophets of Baal on Mount Carmel.', descriptionKo: '갈멜산에서 바알의 선지자들과 대결한 선지자.', strongsNumber: 'H452', occurrences: 69 },
  { id: 'elisha', original: 'אֱלִישָׁע', english: 'Elisha', korean: '엘리사', type: 'person', description: 'Prophet who succeeded Elijah with a double portion of his spirit.', descriptionKo: '엘리야의 뒤를 이어 갑절의 영을 받은 선지자.', strongsNumber: 'H477', occurrences: 58 },
  { id: 'isaiah', original: 'יְשַׁעְיָהוּ', english: 'Isaiah', korean: '이사야', type: 'person', description: 'Major prophet who prophesied about the coming Messiah.', descriptionKo: '오실 메시아에 대해 예언한 대선지자.', strongsNumber: 'H3470', occurrences: 32 },
  { id: 'jeremiah', original: 'יִרְמְיָהוּ', english: 'Jeremiah', korean: '예레미야', type: 'person', description: 'Weeping prophet who warned Judah of coming judgment.', descriptionKo: '유다에게 다가올 심판을 경고한 눈물의 선지자.', strongsNumber: 'H3414', occurrences: 147 },
  { id: 'ezekiel', original: 'יְחֶזְקֵאל', english: 'Ezekiel', korean: '에스겔', type: 'person', description: 'Prophet and priest who prophesied during the Babylonian exile.', descriptionKo: '바벨론 포로기에 예언한 선지자이자 제사장.', strongsNumber: 'H3168', occurrences: 2 },
  { id: 'daniel', original: 'דָּנִיֵּאל', english: 'Daniel', korean: '다니엘', type: 'person', description: 'Prophet in Babylon known for dream interpretation and the lion\'s den.', descriptionKo: '꿈의 해석과 사자 굴로 알려진 바벨론의 선지자.', strongsNumber: 'H1840', occurrences: 74 },
  { id: 'jonah', original: 'יוֹנָה', english: 'Jonah', korean: '요나', type: 'person', description: 'Prophet sent to Nineveh who was swallowed by a great fish.', descriptionKo: '니느웨로 보내졌다가 큰 물고기에게 삼켜진 선지자.', strongsNumber: 'H3124', occurrences: 19 },
  { id: 'hosea', original: 'הוֹשֵׁעַ', english: 'Hosea', korean: '호세아', type: 'person', description: 'Prophet who married unfaithful Gomer as an illustration of God\'s love.', descriptionKo: '하나님의 사랑을 보여주기 위해 불신실한 고멜과 결혼한 선지자.', strongsNumber: 'H1954', occurrences: 3 },
  { id: 'amos', original: 'עָמוֹס', english: 'Amos', korean: '아모스', type: 'person', description: 'Shepherd-prophet who proclaimed social justice.', descriptionKo: '사회 정의를 선포한 목자 출신 선지자.', strongsNumber: 'H5986', occurrences: 7 },
  { id: 'micah', original: 'מִיכָה', english: 'Micah', korean: '미가', type: 'person', description: 'Prophet who predicted the birthplace of the Messiah.', descriptionKo: '메시아의 탄생지를 예언한 선지자.', strongsNumber: 'H4318', occurrences: 4 },
  { id: 'nahum', original: 'נַחוּם', english: 'Nahum', korean: '나훔', type: 'person', description: 'Prophet who foretold the fall of Nineveh.', descriptionKo: '니느웨의 멸망을 예언한 선지자.', strongsNumber: 'H5151', occurrences: 1 },
  { id: 'habakkuk', original: 'חֲבַקּוּק', english: 'Habakkuk', korean: '하박국', type: 'person', description: 'Prophet who questioned God about injustice.', descriptionKo: '불의에 대해 하나님께 질문한 선지자.', strongsNumber: 'H2265', occurrences: 2 },
  { id: 'zephaniah', original: 'צְפַנְיָה', english: 'Zephaniah', korean: '스바냐', type: 'person', description: 'Prophet who warned of the Day of the Lord.', descriptionKo: '여호와의 날을 경고한 선지자.', strongsNumber: 'H6846', occurrences: 3 },
  { id: 'haggai', original: 'חַגַּי', english: 'Haggai', korean: '학개', type: 'person', description: 'Post-exilic prophet who urged rebuilding the Temple.', descriptionKo: '성전 재건을 촉구한 포로 귀환 후 선지자.', strongsNumber: 'H2292', occurrences: 9 },
  { id: 'zechariah', original: 'זְכַרְיָה', english: 'Zechariah', korean: '스가랴', type: 'person', description: 'Post-exilic prophet with apocalyptic visions.', descriptionKo: '묵시적 환상을 본 포로 귀환 후 선지자.', strongsNumber: 'H2148', occurrences: 33 },
  { id: 'malachi', original: 'מַלְאָכִי', english: 'Malachi', korean: '말라기', type: 'person', description: 'Last Old Testament prophet.', descriptionKo: '구약의 마지막 선지자.', strongsNumber: 'H4401', occurrences: 1 },
  { id: 'ezra', original: 'עֶזְרָא', english: 'Ezra', korean: '에스라', type: 'person', description: 'Priest and scribe who led Jewish reforms after exile.', descriptionKo: '포로 귀환 후 유대인 개혁을 이끈 제사장이자 서기관.', strongsNumber: 'H5830', occurrences: 22 },
  { id: 'nehemiah', original: 'נְחֶמְיָה', english: 'Nehemiah', korean: '느헤미야', type: 'person', description: 'Cupbearer who rebuilt Jerusalem\'s walls.', descriptionKo: '예루살렘 성벽을 재건한 술 관원.', strongsNumber: 'H5166', occurrences: 8 },
  { id: 'esther', original: 'אֶסְתֵּר', english: 'Esther', korean: '에스더', type: 'person', description: 'Jewish queen of Persia who saved her people.', descriptionKo: '자기 민족을 구한 페르시아의 유대인 왕비.', strongsNumber: 'H635', occurrences: 55 },
  { id: 'job', original: 'אִיּוֹב', english: 'Job', korean: '욥', type: 'person', description: 'Righteous man who suffered greatly and was restored by God.', descriptionKo: '큰 고통을 겪었으나 하나님에 의해 회복된 의로운 사람.', strongsNumber: 'H347', occurrences: 58 },
  { id: 'boaz', original: 'בֹּעַז', english: 'Boaz', korean: '보아스', type: 'person', description: 'Kinsman-redeemer who married Ruth.', descriptionKo: '룻과 결혼한 기업 무를 자.', strongsNumber: 'H1162', occurrences: 24 },
  { id: 'naomi', original: 'נָעֳמִי', english: 'Naomi', korean: '나오미', type: 'person', description: 'Mother-in-law of Ruth.', descriptionKo: '룻의 시어머니.', strongsNumber: 'H5281', occurrences: 21 },
  { id: 'bathsheba', original: 'בַּת־שֶׁבַע', english: 'Bathsheba', korean: '밧세바', type: 'person', description: 'Wife of Uriah, later wife of David, mother of Solomon.', descriptionKo: '우리야의 아내, 후에 다윗의 아내, 솔로몬의 어머니.', strongsNumber: 'H1339', occurrences: 11 },
  { id: 'absalom', original: 'אַבְשָׁלוֹם', english: 'Absalom', korean: '압살롬', type: 'person', description: 'Son of David who led a rebellion against his father.', descriptionKo: '아버지에 대해 반란을 일으킨 다윗의 아들.', strongsNumber: 'H53', occurrences: 109 },
  { id: 'jonathan', original: 'יְהוֹנָתָן', english: 'Jonathan', korean: '요나단', type: 'person', description: 'Son of Saul and close friend of David.', descriptionKo: '사울의 아들이자 다윗의 절친한 친구.', strongsNumber: 'H3083', occurrences: 106 },
  { id: 'goliath', original: 'גָּלְיָת', english: 'Goliath', korean: '골리앗', type: 'person', description: 'Philistine giant defeated by David.', descriptionKo: '다윗에게 패한 블레셋의 거인.', strongsNumber: 'H1555', occurrences: 6 },
  { id: 'delilah', original: 'דְּלִילָה', english: 'Delilah', korean: '들릴라', type: 'person', description: 'Woman who betrayed Samson\'s secret of his strength.', descriptionKo: '삼손의 힘의 비밀을 배반한 여인.', strongsNumber: 'H1807', occurrences: 6 },
  { id: 'hagar', original: 'הָגָר', english: 'Hagar', korean: '하갈', type: 'person', description: 'Egyptian servant of Sarah, mother of Ishmael.', descriptionKo: '사라의 이집트 여종, 이스마엘의 어머니.', strongsNumber: 'H1904', occurrences: 12 },
  { id: 'ishmael', original: 'יִשְׁמָעֵאל', english: 'Ishmael', korean: '이스마엘', type: 'person', description: 'Son of Abraham and Hagar, ancestor of Arab nations.', descriptionKo: '아브라함과 하갈의 아들, 아랍 민족의 조상.', strongsNumber: 'H3458', occurrences: 48 },
  { id: 'lot', original: 'לוֹט', english: 'Lot', korean: '롯', type: 'person', description: 'Nephew of Abraham who lived in Sodom.', descriptionKo: '소돔에 살았던 아브라함의 조카.', strongsNumber: 'H3876', occurrences: 33 },
  { id: 'melchizedek', original: 'מַלְכִּי־צֶדֶק', english: 'Melchizedek', korean: '멜기세덱', type: 'person', description: 'King of Salem and priest of God Most High.', descriptionKo: '살렘의 왕이자 지극히 높으신 하나님의 제사장.', strongsNumber: 'H4442', occurrences: 11 },
  { id: 'pharaoh', original: 'פַּרְעֹה', english: 'Pharaoh', korean: '바로', type: 'person', description: 'Title of Egyptian kings mentioned throughout the Bible.', descriptionKo: '성경 전체에 걸쳐 언급되는 이집트 왕들의 칭호.', strongsNumber: 'H6547', occurrences: 274 },
  { id: 'nebuchadnezzar', original: 'נְבוּכַדְנֶאצַּר', english: 'Nebuchadnezzar', korean: '느부갓네살', type: 'person', description: 'King of Babylon who destroyed Jerusalem\'s Temple.', descriptionKo: '예루살렘 성전을 파괴한 바벨론의 왕.', strongsNumber: 'H5019', occurrences: 91 },
  // New Testament People
  { id: 'jesus', original: 'Ἰησοῦς', english: 'Jesus', korean: '예수', type: 'person', description: 'Son of God, Savior of the world.', descriptionKo: '하나님의 아들, 세상의 구세주.', strongsNumber: 'G2424', occurrences: 983 },
  { id: 'mary-mother', original: 'Μαρία', english: 'Mary (Mother of Jesus)', korean: '마리아', type: 'person', description: 'Mother of Jesus Christ.', descriptionKo: '예수 그리스도의 어머니.', strongsNumber: 'G3137', occurrences: 54 },
  { id: 'joseph-husband', original: 'Ἰωσήφ', english: 'Joseph (Husband of Mary)', korean: '요셉 (마리아의 남편)', type: 'person', description: 'Earthly father of Jesus, a carpenter from Nazareth.', descriptionKo: '예수님의 양부, 나사렛의 목수.', strongsNumber: 'G2501', occurrences: 35 },
  { id: 'john-baptist', original: 'Ἰωάννης', english: 'John the Baptist', korean: '세례 요한', type: 'person', description: 'Prophet who prepared the way for Jesus and baptized Him.', descriptionKo: '예수님의 길을 예비하고 그에게 세례를 베푼 선지자.', strongsNumber: 'G2491', occurrences: 92 },
  { id: 'peter', original: 'Πέτρος', english: 'Peter', korean: '베드로', type: 'person', description: 'Apostle, leader of the early church.', descriptionKo: '사도, 초대 교회의 지도자.', strongsNumber: 'G4074', occurrences: 156 },
  { id: 'paul', original: 'Παῦλος', english: 'Paul', korean: '바울', type: 'person', description: 'Apostle to the Gentiles, author of many epistles.', descriptionKo: '이방인의 사도, 많은 서신의 저자.', strongsNumber: 'G3972', occurrences: 163 },
  { id: 'john-apostle', original: 'Ἰωάννης', english: 'John (Apostle)', korean: '요한', type: 'person', description: 'Beloved disciple, author of the Gospel of John and Revelation.', descriptionKo: '사랑받는 제자, 요한복음과 요한계시록의 저자.', strongsNumber: 'G2491', occurrences: 131 },
  { id: 'james-son-zebedee', original: 'Ἰάκωβος', english: 'James (Son of Zebedee)', korean: '야고보', type: 'person', description: 'Apostle, brother of John, one of the inner three.', descriptionKo: '사도, 요한의 형제, 핵심 세 제자 중 한 명.', strongsNumber: 'G2385', occurrences: 42 },
  { id: 'andrew', original: 'Ἀνδρέας', english: 'Andrew', korean: '안드레', type: 'person', description: 'Apostle, brother of Peter.', descriptionKo: '사도, 베드로의 형제.', strongsNumber: 'G406', occurrences: 13 },
  { id: 'philip-apostle', original: 'Φίλιππος', english: 'Philip (Apostle)', korean: '빌립', type: 'person', description: 'Apostle from Bethsaida.', descriptionKo: '벳새다 출신의 사도.', strongsNumber: 'G5376', occurrences: 36 },
  { id: 'thomas', original: 'Θωμᾶς', english: 'Thomas', korean: '도마', type: 'person', description: 'Apostle known as "Doubting Thomas."', descriptionKo: '"의심하는 도마"로 알려진 사도.', strongsNumber: 'G2381', occurrences: 11 },
  { id: 'matthew-apostle', original: 'Μαθθαῖος', english: 'Matthew', korean: '마태', type: 'person', description: 'Tax collector who became an apostle and Gospel writer.', descriptionKo: '세리에서 사도가 되어 복음서를 쓴 사람.', strongsNumber: 'G3156', occurrences: 5 },
  { id: 'judas-iscariot', original: 'Ἰούδας Ἰσκαριώτης', english: 'Judas Iscariot', korean: '가룟 유다', type: 'person', description: 'Apostle who betrayed Jesus.', descriptionKo: '예수님을 배반한 사도.', strongsNumber: 'G2455', occurrences: 22 },
  { id: 'bartholomew', original: 'Βαρθολομαῖος', english: 'Bartholomew', korean: '바돌로매', type: 'person', description: 'One of the twelve apostles.', descriptionKo: '열두 사도 중 한 명.', strongsNumber: 'G918', occurrences: 4 },
  { id: 'simon-zealot', original: 'Σίμων', english: 'Simon the Zealot', korean: '셀롯인 시몬', type: 'person', description: 'One of the twelve apostles.', descriptionKo: '열두 사도 중 한 명.', strongsNumber: 'G4613', occurrences: 4 },
  { id: 'barnabas', original: 'Βαρνάβας', english: 'Barnabas', korean: '바나바', type: 'person', description: 'Companion of Paul on his first missionary journey.', descriptionKo: '바울의 첫 번째 선교 여행의 동반자.', strongsNumber: 'G921', occurrences: 28 },
  { id: 'timothy', original: 'Τιμόθεος', english: 'Timothy', korean: '디모데', type: 'person', description: 'Young disciple and companion of Paul.', descriptionKo: '바울의 젊은 제자이자 동반자.', strongsNumber: 'G5095', occurrences: 24 },
  { id: 'titus', original: 'Τίτος', english: 'Titus', korean: '디도', type: 'person', description: 'Greek convert and companion of Paul.', descriptionKo: '그리스인 개종자이자 바울의 동반자.', strongsNumber: 'G5103', occurrences: 13 },
  { id: 'silas', original: 'Σιλᾶς', english: 'Silas', korean: '실라', type: 'person', description: 'Companion of Paul on his second missionary journey.', descriptionKo: '바울의 두 번째 선교 여행의 동반자.', strongsNumber: 'G4609', occurrences: 13 },
  { id: 'luke', original: 'Λουκᾶς', english: 'Luke', korean: '누가', type: 'person', description: 'Physician and author of the Gospel of Luke and Acts.', descriptionKo: '의사이자 누가복음과 사도행전의 저자.', strongsNumber: 'G3065', occurrences: 3 },
  { id: 'mark', original: 'Μᾶρκος', english: 'Mark', korean: '마가', type: 'person', description: 'Author of the Gospel of Mark, companion of Paul and Peter.', descriptionKo: '마가복음의 저자, 바울과 베드로의 동반자.', strongsNumber: 'G3138', occurrences: 8 },
  { id: 'stephen', original: 'Στέφανος', english: 'Stephen', korean: '스데반', type: 'person', description: 'First Christian martyr.', descriptionKo: '최초의 기독교 순교자.', strongsNumber: 'G4736', occurrences: 7 },
  { id: 'philip-evangelist', original: 'Φίλιππος', english: 'Philip the Evangelist', korean: '전도자 빌립', type: 'person', description: 'One of the seven deacons, evangelist.', descriptionKo: '일곱 집사 중 한 명, 전도자.', strongsNumber: 'G5376', occurrences: 16 },
  { id: 'cornelius', original: 'Κορνήλιος', english: 'Cornelius', korean: '고넬료', type: 'person', description: 'Roman centurion, first Gentile convert.', descriptionKo: '로마 백부장, 최초의 이방인 개종자.', strongsNumber: 'G2883', occurrences: 8 },
  { id: 'lazarus', original: 'Λάζαρος', english: 'Lazarus', korean: '나사로', type: 'person', description: 'Brother of Mary and Martha, raised from the dead by Jesus.', descriptionKo: '마리아와 마르다의 오빠, 예수님에 의해 죽음에서 살아남.', strongsNumber: 'G2976', occurrences: 15 },
  { id: 'martha', original: 'Μάρθα', english: 'Martha', korean: '마르다', type: 'person', description: 'Sister of Mary and Lazarus.', descriptionKo: '마리아와 나사로의 자매.', strongsNumber: 'G3136', occurrences: 13 },
  { id: 'mary-magdalene', original: 'Μαρία Μαγδαληνή', english: 'Mary Magdalene', korean: '막달라 마리아', type: 'person', description: 'Follower of Jesus, first witness of the resurrection.', descriptionKo: '예수님의 추종자, 부활의 첫 번째 증인.', strongsNumber: 'G3137', occurrences: 12 },
  { id: 'nicodemus', original: 'Νικόδημος', english: 'Nicodemus', korean: '니고데모', type: 'person', description: 'Pharisee who visited Jesus at night.', descriptionKo: '밤에 예수님을 찾아온 바리새인.', strongsNumber: 'G3530', occurrences: 5 },
  { id: 'herod-great', original: 'Ἡρῴδης', english: 'Herod the Great', korean: '헤롯', type: 'person', description: 'King of Judea who tried to kill baby Jesus.', descriptionKo: '아기 예수를 죽이려 한 유대의 왕.', strongsNumber: 'G2264', occurrences: 44 },
  { id: 'pontius-pilate', original: 'Πόντιος Πιλᾶτος', english: 'Pontius Pilate', korean: '본디오 빌라도', type: 'person', description: 'Roman governor who sentenced Jesus to crucifixion.', descriptionKo: '예수님에게 십자가형을 선고한 로마 총독.', strongsNumber: 'G4091', occurrences: 55 },
  { id: 'caiaphas', original: 'Καϊάφας', english: 'Caiaphas', korean: '가야바', type: 'person', description: 'High priest who presided over Jesus\' trial.', descriptionKo: '예수님의 재판을 주재한 대제사장.', strongsNumber: 'G2533', occurrences: 9 },
  { id: 'barabbas', original: 'Βαραββᾶς', english: 'Barabbas', korean: '바라바', type: 'person', description: 'Prisoner released instead of Jesus.', descriptionKo: '예수님 대신 석방된 죄수.', strongsNumber: 'G912', occurrences: 11 },
  { id: 'zacchaeus', original: 'Ζακχαῖος', english: 'Zacchaeus', korean: '삭개오', type: 'person', description: 'Tax collector who climbed a tree to see Jesus.', descriptionKo: '예수님을 보기 위해 나무에 올라간 세리.', strongsNumber: 'G2195', occurrences: 3 },
  { id: 'apollos', original: 'Ἀπολλῶς', english: 'Apollos', korean: '아볼로', type: 'person', description: 'Eloquent Jewish Christian teacher from Alexandria.', descriptionKo: '알렉산드리아 출신의 능변의 유대인 기독교 교사.', strongsNumber: 'G625', occurrences: 10 },
  { id: 'priscilla', original: 'Πρίσκιλλα', english: 'Priscilla', korean: '브리스길라', type: 'person', description: 'Wife of Aquila, co-worker with Paul.', descriptionKo: '아굴라의 아내, 바울의 동역자.', strongsNumber: 'G4252', occurrences: 6 },
  { id: 'aquila', original: 'Ἀκύλας', english: 'Aquila', korean: '아굴라', type: 'person', description: 'Jewish tentmaker, husband of Priscilla, co-worker with Paul.', descriptionKo: '유대인 천막 만드는 사람, 브리스길라의 남편, 바울의 동역자.', strongsNumber: 'G207', occurrences: 6 },
  { id: 'lydia', original: 'Λυδία', english: 'Lydia', korean: '루디아', type: 'person', description: 'Seller of purple cloth, first European convert.', descriptionKo: '자주색 옷감 장사, 유럽 최초의 개종자.', strongsNumber: 'G3070', occurrences: 2 },
  { id: 'philemon', original: 'Φιλήμων', english: 'Philemon', korean: '빌레몬', type: 'person', description: 'Christian slave owner to whom Paul wrote an epistle.', descriptionKo: '바울이 서신을 보낸 기독교인 노예 주인.', strongsNumber: 'G5371', occurrences: 1 },
  { id: 'onesimus', original: 'Ὀνήσιμος', english: 'Onesimus', korean: '오네시모', type: 'person', description: 'Runaway slave of Philemon converted by Paul.', descriptionKo: '바울에 의해 개종한 빌레몬의 도망 노예.', strongsNumber: 'G3682', occurrences: 2 },
  { id: 'levi-person', original: 'לֵוִי', english: 'Levi', korean: '레위', type: 'person', description: 'Third son of Jacob, ancestor of the priestly tribe.', descriptionKo: '야곱의 셋째 아들, 제사장 지파의 조상.', strongsNumber: 'H3878', occurrences: 64 },
  { id: 'benjamin', original: 'בִּנְיָמִין', english: 'Benjamin', korean: '베냐민', type: 'person', description: 'Youngest son of Jacob and Rachel.', descriptionKo: '야곱과 라헬의 막내 아들.', strongsNumber: 'H1144', occurrences: 167 },

  // ===== PLACES (장소) =====
  { id: 'jerusalem', original: 'יְרוּשָׁלַיִם', english: 'Jerusalem', korean: '예루살렘', type: 'place', description: 'Holy city, capital of ancient Israel.', descriptionKo: '거룩한 도시, 고대 이스라엘의 수도.', strongsNumber: 'H3389', occurrences: 811 },
  { id: 'bethlehem', original: 'בֵּית לֶחֶם', english: 'Bethlehem', korean: '베들레헴', type: 'place', description: 'Birthplace of Jesus Christ and King David.', descriptionKo: '예수 그리스도와 다윗 왕의 출생지.', strongsNumber: 'H1035', occurrences: 44 },
  { id: 'nazareth', original: 'Ναζαρέθ', english: 'Nazareth', korean: '나사렛', type: 'place', description: 'Hometown of Jesus where He grew up.', descriptionKo: '예수님이 자라신 고향.', strongsNumber: 'G3478', occurrences: 12 },
  { id: 'egypt', original: 'מִצְרַיִם', english: 'Egypt', korean: '이집트', type: 'place', description: 'Land where Israel was enslaved before the Exodus.', descriptionKo: '출애굽 전에 이스라엘이 종으로 살았던 땅.', strongsNumber: 'H4714', occurrences: 611 },
  { id: 'babylon-place', original: 'בָּבֶל', english: 'Babylon', korean: '바벨론', type: 'place', description: 'Capital of the Babylonian Empire; place of Jewish exile.', descriptionKo: '바벨론 제국의 수도; 유대인 포로의 장소.', strongsNumber: 'H894', occurrences: 287 },
  { id: 'rome-place', original: 'Ῥώμη', english: 'Rome', korean: '로마', type: 'place', description: 'Capital of the Roman Empire.', descriptionKo: '로마 제국의 수도.', strongsNumber: 'G4516', occurrences: 11 },
  { id: 'sinai', original: 'סִינַי', english: 'Sinai', korean: '시내산', type: 'place', description: 'Mountain where God gave the Ten Commandments to Moses.', descriptionKo: '하나님이 모세에게 십계명을 주신 산.', strongsNumber: 'H5514', occurrences: 35 },
  { id: 'jordan', original: 'יַרְדֵּן', english: 'Jordan River', korean: '요단강', type: 'place', description: 'River where Jesus was baptized.', descriptionKo: '예수님이 세례를 받으신 강.', strongsNumber: 'H3383', occurrences: 182 },
  { id: 'galilee-place', original: 'גָּלִיל', english: 'Galilee', korean: '갈릴리', type: 'place', description: 'Northern region where Jesus spent most of His ministry.', descriptionKo: '예수님이 사역 대부분을 보내신 북부 지역.', strongsNumber: 'H1551', occurrences: 73 },
  { id: 'samaria-place', original: 'שֹׁמְרוֹן', english: 'Samaria', korean: '사마리아', type: 'place', description: 'Capital of the northern kingdom of Israel.', descriptionKo: '북이스라엘 왕국의 수도.', strongsNumber: 'H8111', occurrences: 109 },
  { id: 'canaan-place', original: 'כְּנַעַן', english: 'Canaan', korean: '가나안', type: 'place', description: 'The Promised Land given to Abraham\'s descendants.', descriptionKo: '아브라함의 후손에게 주어진 약속의 땅.', strongsNumber: 'H3667', occurrences: 93 },
  { id: 'eden', original: 'עֵדֶן', english: 'Eden', korean: '에덴', type: 'place', description: 'Garden where God placed Adam and Eve.', descriptionKo: '하나님이 아담과 하와를 두신 동산.', strongsNumber: 'H5731', occurrences: 16 },
  { id: 'sodom', original: 'סְדֹם', english: 'Sodom', korean: '소돔', type: 'place', description: 'Wicked city destroyed by God with fire.', descriptionKo: '하나님의 불로 멸망한 악한 도시.', strongsNumber: 'H5467', occurrences: 39 },
  { id: 'gomorrah', original: 'עֲמֹרָה', english: 'Gomorrah', korean: '고모라', type: 'place', description: 'City destroyed along with Sodom.', descriptionKo: '소돔과 함께 멸망한 도시.', strongsNumber: 'H6017', occurrences: 19 },
  { id: 'nineveh-place', original: 'נִינְוֵה', english: 'Nineveh', korean: '니느웨', type: 'place', description: 'Capital of the Assyrian Empire.', descriptionKo: '앗시리아 제국의 수도.', strongsNumber: 'H5210', occurrences: 17 },
  { id: 'jericho-place', original: 'יְרִיחוֹ', english: 'Jericho', korean: '여리고', type: 'place', description: 'Ancient city whose walls fell before Joshua.', descriptionKo: '여호수아 앞에서 성벽이 무너진 고대 도시.', strongsNumber: 'H3405', occurrences: 57 },
  { id: 'capernaum-place', original: 'Καφαρναούμ', english: 'Capernaum', korean: '가버나움', type: 'place', description: 'Center of Jesus\' Galilean ministry.', descriptionKo: '예수님의 갈릴리 사역 중심지.', strongsNumber: 'G2584', occurrences: 16 },
  { id: 'damascus-place', original: 'דַּמֶּשֶׂק', english: 'Damascus', korean: '다메섹', type: 'place', description: 'Where Saul had his conversion experience.', descriptionKo: '사울이 회심한 곳.', strongsNumber: 'H1834', occurrences: 60 },
  { id: 'hebron-place', original: 'חֶבְרוֹן', english: 'Hebron', korean: '헤브론', type: 'place', description: 'City of Abraham; David\'s first capital.', descriptionKo: '아브라함의 도시; 다윗의 첫 번째 수도.', strongsNumber: 'H2275', occurrences: 71 },
  { id: 'corinth-place', original: 'Κόρινθος', english: 'Corinth', korean: '고린도', type: 'place', description: 'Greek city where Paul established a church.', descriptionKo: '바울이 교회를 세운 그리스 도시.', strongsNumber: 'G2882', occurrences: 6 },
  { id: 'ephesus-place', original: 'Ἔφεσος', english: 'Ephesus', korean: '에베소', type: 'place', description: 'Major city in Asia Minor; one of the seven churches.', descriptionKo: '소아시아의 주요 도시; 일곱 교회 중 하나.', strongsNumber: 'G2181', occurrences: 16 },
  { id: 'antioch-place', original: 'Ἀντιόχεια', english: 'Antioch', korean: '안디옥', type: 'place', description: 'Base for Paul\'s missionary journeys.', descriptionKo: '바울 선교 여행의 기지.', strongsNumber: 'G490', occurrences: 18 },
  { id: 'philippi-place', original: 'Φίλιπποι', english: 'Philippi', korean: '빌립보', type: 'place', description: 'First European city where Paul preached.', descriptionKo: '바울이 유럽에서 처음 복음을 전한 도시.', strongsNumber: 'G5375', occurrences: 4 },
  { id: 'thessalonica-place', original: 'Θεσσαλονίκη', english: 'Thessalonica', korean: '데살로니가', type: 'place', description: 'Greek city where Paul founded a church.', descriptionKo: '바울이 교회를 세운 그리스 도시.', strongsNumber: 'G2332', occurrences: 5 },
  { id: 'athens-place', original: 'Ἀθῆναι', english: 'Athens', korean: '아덴', type: 'place', description: 'Where Paul preached at the Areopagus.', descriptionKo: '바울이 아레오바고에서 설교한 곳.', strongsNumber: 'G116', occurrences: 4 },
  { id: 'tarsus', original: 'Ταρσός', english: 'Tarsus', korean: '다소', type: 'place', description: 'Birthplace of Paul.', descriptionKo: '바울의 출생지.', strongsNumber: 'G5019', occurrences: 5 },
  { id: 'patmos-place', original: 'Πάτμος', english: 'Patmos', korean: '밧모', type: 'place', description: 'Island where John received the Revelation.', descriptionKo: '요한이 계시를 받은 섬.', strongsNumber: 'G3963', occurrences: 1 },
  { id: 'golgotha-place', original: 'Γολγοθᾶ', english: 'Golgotha', korean: '골고다', type: 'place', description: 'Place of Jesus\' crucifixion.', descriptionKo: '예수님이 십자가에 못 박히신 곳.', strongsNumber: 'G1115', occurrences: 3 },
  { id: 'gethsemane', original: 'Γεθσημανῆ', english: 'Gethsemane', korean: '겟세마네', type: 'place', description: 'Garden where Jesus prayed before His arrest.', descriptionKo: '예수님이 잡히기 전에 기도하신 동산.', strongsNumber: 'G1068', occurrences: 2 },
  { id: 'bethany-place', original: 'Βηθανία', english: 'Bethany', korean: '베다니', type: 'place', description: 'Home of Mary, Martha, and Lazarus.', descriptionKo: '마리아, 마르다, 나사로의 집.', strongsNumber: 'G963', occurrences: 11 },
  { id: 'mount-olives', original: 'Ὄρος τῶν Ἐλαιῶν', english: 'Mount of Olives', korean: '감람산', type: 'place', description: 'Where Jesus gave the Olivet Discourse and ascended.', descriptionKo: '예수님이 감람산 설교를 하시고 승천하신 곳.', strongsNumber: 'G1636', occurrences: 13 },
  { id: 'mount-zion-place', original: 'צִיּוֹן', english: 'Mount Zion', korean: '시온산', type: 'place', description: 'Hill in Jerusalem symbolizing God\'s city.', descriptionKo: '하나님의 도시를 상징하는 예루살렘의 언덕.', strongsNumber: 'H6726', occurrences: 154 },

  // ===== OBJECTS (물건) =====
  { id: 'ephod', original: 'אֵפוֹד', english: 'Ephod', korean: '에봇', type: 'object', description: 'Priestly garment worn by the high priest.', descriptionKo: '대제사장이 입은 제사장 옷.', strongsNumber: 'H646', occurrences: 49 },
  { id: 'ark-covenant', original: 'אֲרוֹן הַבְּרִית', english: 'Ark of the Covenant', korean: '언약궤', type: 'object', description: 'Sacred chest containing the Ten Commandments.', descriptionKo: '십계명을 담은 거룩한 궤.', strongsNumber: 'H727', occurrences: 48 },
  { id: 'tabernacle', original: 'מִשְׁכָּן', english: 'Tabernacle', korean: '성막', type: 'object', description: 'Portable sanctuary used during the wilderness period.', descriptionKo: '광야 시대에 사용된 이동식 성소.', strongsNumber: 'H4908', occurrences: 139 },
  { id: 'temple', original: 'הֵיכָל', english: 'Temple', korean: '성전', type: 'object', description: 'God\'s dwelling place in Jerusalem, built by Solomon.', descriptionKo: '솔로몬이 세운 예루살렘에 있는 하나님의 거처.', strongsNumber: 'H1964', occurrences: 80 },
  { id: 'manna', original: 'מָן', english: 'Manna', korean: '만나', type: 'object', description: 'Bread from heaven that fed Israel in the wilderness.', descriptionKo: '광야에서 이스라엘을 먹인 하늘에서 내린 양식.', strongsNumber: 'H4478', occurrences: 14 },
  { id: 'urim-thummim', original: 'אוּרִים וְתֻמִּים', english: 'Urim and Thummim', korean: '우림과 둠밈', type: 'object', description: 'Sacred lots used to discern God\'s will.', descriptionKo: '하나님의 뜻을 분별하기 위해 사용된 거룩한 제비.', strongsNumber: 'H224', occurrences: 7 },
  { id: 'mercy-seat', original: 'כַּפֹּרֶת', english: 'Mercy Seat', korean: '속죄소', type: 'object', description: 'Gold cover on the Ark of the Covenant.', descriptionKo: '언약궤 위의 금 덮개.', strongsNumber: 'H3727', occurrences: 27 },
  { id: 'bronze-serpent', original: 'נְחַשׁ נְחֹשֶׁת', english: 'Bronze Serpent', korean: '놋뱀', type: 'object', description: 'Serpent on a pole that healed those who looked at it.', descriptionKo: '보는 자들을 치유한 장대 위의 뱀.', strongsNumber: 'H5178', occurrences: 3 },
  { id: 'ten-commandments', original: 'עֲשֶׂרֶת הַדְּבָרִים', english: 'Ten Commandments', korean: '십계명', type: 'object', description: 'God\'s law given to Moses on Mount Sinai.', descriptionKo: '시내산에서 모세에게 주어진 하나님의 율법.', strongsNumber: 'H1697', occurrences: 10 },
  { id: 'showbread', original: 'לֶחֶם הַפָּנִים', english: 'Showbread', korean: '진설병', type: 'object', description: 'Twelve loaves placed on the golden table in the tabernacle.', descriptionKo: '성막의 금 상 위에 놓인 열두 덩이의 빵.', strongsNumber: 'H3899', occurrences: 7 },
  { id: 'golden-calf', original: 'עֵגֶל זָהָב', english: 'Golden Calf', korean: '금송아지', type: 'object', description: 'Idol made by Aaron while Moses was on Sinai.', descriptionKo: '모세가 시내산에 있는 동안 아론이 만든 우상.', strongsNumber: 'H5695', occurrences: 6 },
  { id: 'aarons-rod', original: 'מַטֵּה אַהֲרֹן', english: 'Aaron\'s Rod', korean: '아론의 지팡이', type: 'object', description: 'Staff that budded, confirming Aaron\'s priesthood.', descriptionKo: '싹이 난 지팡이, 아론의 제사장직을 확인해 줌.', strongsNumber: 'H4294', occurrences: 4 },
  { id: 'sling', original: 'קֶלַע', english: 'Sling', korean: '물매', type: 'object', description: 'Weapon David used to defeat Goliath.', descriptionKo: '다윗이 골리앗을 무찌르는 데 사용한 무기.', strongsNumber: 'H7050', occurrences: 6 },
  { id: 'menorah', original: 'מְנוֹרָה', english: 'Menorah', korean: '메노라', type: 'object', description: 'Seven-branched golden lampstand in the tabernacle.', descriptionKo: '성막에 있는 일곱 가지 금 등잔대.', strongsNumber: 'H4501', occurrences: 40 },
  { id: 'altar-incense', original: 'מִזְבֵּחַ הַקְּטֹרֶת', english: 'Altar of Incense', korean: '향단', type: 'object', description: 'Golden altar for burning incense before the Lord.', descriptionKo: '여호와 앞에서 향을 피우는 금 제단.', strongsNumber: 'H4196', occurrences: 8 },
  { id: 'noahs-ark', original: 'תֵּבָה', english: 'Noah\'s Ark', korean: '노아의 방주', type: 'object', description: 'Ship built by Noah to survive the great flood.', descriptionKo: '대홍수에서 살아남기 위해 노아가 지은 배.', strongsNumber: 'H8392', occurrences: 28 },
  { id: 'breastplate', original: 'חֹשֶׁן', english: 'Breastplate (of Judgment)', korean: '흉패', type: 'object', description: 'Priestly garment with twelve gemstones representing the tribes.', descriptionKo: '열두 지파를 상징하는 보석이 달린 제사장 옷.', strongsNumber: 'H2833', occurrences: 25 },
  { id: 'shofar', original: 'שׁוֹפָר', english: 'Shofar', korean: '나팔', type: 'object', description: 'Ram\'s horn trumpet used in worship and battle.', descriptionKo: '예배와 전쟁에서 사용된 양의 뿔 나팔.', strongsNumber: 'H7782', occurrences: 72 },

  // ===== TITLES (칭호) =====
  { id: 'christ', original: 'Χριστός', english: 'Christ', korean: '그리스도', type: 'title', description: 'The Anointed One, title of Jesus.', descriptionKo: '기름부음 받은 자, 예수님의 칭호.', strongsNumber: 'G5547', occurrences: 569 },
  { id: 'messiah', original: 'מָשִׁיחַ', english: 'Messiah', korean: '메시아', type: 'title', description: 'The promised deliverer of Israel.', descriptionKo: '약속된 이스라엘의 구원자.', strongsNumber: 'H4899', occurrences: 39 },
  { id: 'lord-title', original: 'κύριος', english: 'Lord', korean: '주', type: 'title', description: 'Title for God and Jesus Christ.', descriptionKo: '하나님과 예수 그리스도의 칭호.', strongsNumber: 'G2962', occurrences: 748 },
  { id: 'immanuel', original: 'עִמָּנוּאֵל', english: 'Immanuel', korean: '임마누엘', type: 'title', description: '"God with us," prophetic name of the Messiah.', descriptionKo: '"하나님이 우리와 함께 계시다," 메시아의 예언적 이름.', strongsNumber: 'H6005', occurrences: 3 },
  { id: 'son-of-man', original: 'בֶּן־אָדָם', english: 'Son of Man', korean: '인자', type: 'title', description: 'Title Jesus used for Himself, messianic title from Daniel.', descriptionKo: '예수님이 자신을 지칭할 때 사용한 칭호, 다니엘서의 메시아적 칭호.', strongsNumber: 'G5207', occurrences: 88 },
  { id: 'son-of-god', original: 'υἱὸς τοῦ θεοῦ', english: 'Son of God', korean: '하나님의 아들', type: 'title', description: 'Divine title of Jesus Christ.', descriptionKo: '예수 그리스도의 신성한 칭호.', strongsNumber: 'G5207', occurrences: 47 },
  { id: 'lamb-of-god', original: 'ἀμνὸς τοῦ θεοῦ', english: 'Lamb of God', korean: '하나님의 어린 양', type: 'title', description: 'Title for Jesus as the ultimate sacrifice.', descriptionKo: '궁극적인 제물로서의 예수님의 칭호.', strongsNumber: 'G286', occurrences: 2 },
  { id: 'almighty', original: 'שַׁדַּי', english: 'Almighty (El Shaddai)', korean: '전능하신 하나님', type: 'title', description: 'Name of God meaning "God Almighty."', descriptionKo: '"전능하신 하나님"을 의미하는 하나님의 이름.', strongsNumber: 'H7706', occurrences: 48 },
  { id: 'most-high', original: 'עֶלְיוֹן', english: 'Most High', korean: '지극히 높으신 이', type: 'title', description: 'Title of God emphasizing His supremacy.', descriptionKo: '하나님의 최고의 지위를 강조하는 칭호.', strongsNumber: 'H5945', occurrences: 31 },
  { id: 'good-shepherd', original: 'ὁ ποιμὴν ὁ καλός', english: 'Good Shepherd', korean: '선한 목자', type: 'title', description: 'Title Jesus used for Himself in John 10.', descriptionKo: '요한복음 10장에서 예수님이 자신을 지칭한 칭호.', strongsNumber: 'G4166', occurrences: 3 },
  { id: 'alpha-omega', original: 'Ἄλφα καὶ Ὦ', english: 'Alpha and Omega', korean: '알파와 오메가', type: 'title', description: 'Title of God/Christ meaning the beginning and the end.', descriptionKo: '처음과 마지막을 의미하는 하나님/그리스도의 칭호.', strongsNumber: 'G1', occurrences: 4 },
  { id: 'king-of-kings', original: 'βασιλεὺς βασιλέων', english: 'King of Kings', korean: '만왕의 왕', type: 'title', description: 'Supreme title of Jesus Christ.', descriptionKo: '예수 그리스도의 최고의 칭호.', strongsNumber: 'G935', occurrences: 3 },
  { id: 'prince-of-peace', original: 'שַׂר שָׁלוֹם', english: 'Prince of Peace', korean: '평강의 왕', type: 'title', description: 'Messianic title from Isaiah 9:6.', descriptionKo: '이사야 9:6의 메시아적 칭호.', strongsNumber: 'H8269', occurrences: 1 },
  { id: 'holy-spirit', original: 'πνεῦμα ἅγιον', english: 'Holy Spirit', korean: '성령', type: 'title', description: 'The third person of the Trinity.', descriptionKo: '삼위일체의 제3위.', strongsNumber: 'G4151', occurrences: 90 },
  { id: 'morning-star', original: 'ἀστὴρ πρωϊνός', english: 'Morning Star', korean: '새벽별', type: 'title', description: 'Title of Jesus in Revelation.', descriptionKo: '요한계시록에 나오는 예수님의 칭호.', strongsNumber: 'G792', occurrences: 2 },
  { id: 'word-of-god', original: 'λόγος τοῦ θεοῦ', english: 'Word (Logos)', korean: '말씀 (로고스)', type: 'title', description: 'Title of Jesus in John 1, the eternal Word.', descriptionKo: '요한복음 1장에서 예수님의 칭호, 영원한 말씀.', strongsNumber: 'G3056', occurrences: 7 },
  { id: 'high-priest', original: 'כֹּהֵן גָּדוֹל', english: 'High Priest', korean: '대제사장', type: 'title', description: 'Chief priest of Israel; title applied to Jesus in Hebrews.', descriptionKo: '이스라엘의 대제사장; 히브리서에서 예수님에게 적용된 칭호.', strongsNumber: 'H3548', occurrences: 78 },

  // ===== TRIBES (지파) =====
  { id: 'judah', original: 'יְהוּדָה', english: 'Judah', korean: '유다', type: 'tribe', description: 'Fourth son of Jacob; tribe from which David and Jesus descended.', descriptionKo: '야곱의 넷째 아들; 다윗과 예수님이 나온 지파.', strongsNumber: 'H3063', occurrences: 820 },
  { id: 'levi-tribe', original: 'לֵוִי', english: 'Levi (Tribe)', korean: '레위 지파', type: 'tribe', description: 'Priestly tribe, descendants of Levi.', descriptionKo: '제사장 지파, 레위의 후손.', strongsNumber: 'H3878', occurrences: 64 },
  { id: 'reuben', original: 'רְאוּבֵן', english: 'Reuben', korean: '르우벤', type: 'tribe', description: 'Firstborn son of Jacob; a tribe of Israel.', descriptionKo: '야곱의 장남; 이스라엘의 한 지파.', strongsNumber: 'H7205', occurrences: 72 },
  { id: 'simeon', original: 'שִׁמְעוֹן', english: 'Simeon', korean: '시므온', type: 'tribe', description: 'Second son of Jacob; a tribe of Israel.', descriptionKo: '야곱의 둘째 아들; 이스라엘의 한 지파.', strongsNumber: 'H8095', occurrences: 44 },
  { id: 'issachar', original: 'יִשָּׂשכָר', english: 'Issachar', korean: '잇사갈', type: 'tribe', description: 'Ninth son of Jacob; a tribe known for understanding the times.', descriptionKo: '야곱의 아홉째 아들; 시대를 분별하는 것으로 알려진 지파.', strongsNumber: 'H3485', occurrences: 43 },
  { id: 'zebulun', original: 'זְבוּלֻן', english: 'Zebulun', korean: '스불론', type: 'tribe', description: 'Tenth son of Jacob; a tribe of Israel.', descriptionKo: '야곱의 열째 아들; 이스라엘의 한 지파.', strongsNumber: 'H2074', occurrences: 45 },
  { id: 'dan-tribe', original: 'דָּן', english: 'Dan (Tribe)', korean: '단 지파', type: 'tribe', description: 'Fifth son of Jacob; a tribe of Israel.', descriptionKo: '야곱의 다섯째 아들; 이스라엘의 한 지파.', strongsNumber: 'H1835', occurrences: 71 },
  { id: 'naphtali', original: 'נַפְתָּלִי', english: 'Naphtali', korean: '납달리', type: 'tribe', description: 'Sixth son of Jacob; a tribe of Israel.', descriptionKo: '야곱의 여섯째 아들; 이스라엘의 한 지파.', strongsNumber: 'H5321', occurrences: 51 },
  { id: 'gad', original: 'גָּד', english: 'Gad', korean: '갓', type: 'tribe', description: 'Seventh son of Jacob; a tribe of Israel.', descriptionKo: '야곱의 일곱째 아들; 이스라엘의 한 지파.', strongsNumber: 'H1410', occurrences: 70 },
  { id: 'asher', original: 'אָשֵׁר', english: 'Asher', korean: '아셀', type: 'tribe', description: 'Eighth son of Jacob; a tribe of Israel.', descriptionKo: '야곱의 여덟째 아들; 이스라엘의 한 지파.', strongsNumber: 'H836', occurrences: 43 },
  { id: 'ephraim', original: 'אֶפְרַיִם', english: 'Ephraim', korean: '에브라임', type: 'tribe', description: 'Son of Joseph; a major tribe of Israel.', descriptionKo: '요셉의 아들; 이스라엘의 주요 지파.', strongsNumber: 'H669', occurrences: 180 },
  { id: 'manasseh', original: 'מְנַשֶּׁה', english: 'Manasseh', korean: '므낫세', type: 'tribe', description: 'Firstborn son of Joseph; a tribe of Israel.', descriptionKo: '요셉의 장남; 이스라엘의 한 지파.', strongsNumber: 'H4519', occurrences: 146 },
  { id: 'benjamin-tribe', original: 'בִּנְיָמִין', english: 'Benjamin (Tribe)', korean: '베냐민 지파', type: 'tribe', description: 'Youngest son of Jacob; tribe of Saul and Paul.', descriptionKo: '야곱의 막내 아들; 사울과 바울의 지파.', strongsNumber: 'H1144', occurrences: 167 },

  // ===== NATIONS (민족) =====
  { id: 'israel-nation', original: 'יִשְׂרָאֵל', english: 'Israel', korean: '이스라엘', type: 'nation', description: 'God\'s chosen people, descendants of Jacob.', descriptionKo: '하나님이 택하신 백성, 야곱의 후손.', strongsNumber: 'H3478', occurrences: 2505 },
  { id: 'philistines', original: 'פְּלִשְׁתִּים', english: 'Philistines', korean: '블레셋', type: 'nation', description: 'Coastal enemies of Israel.', descriptionKo: '이스라엘의 해안 지역 적.', strongsNumber: 'H6430', occurrences: 288 },
  { id: 'assyria', original: 'אַשּׁוּר', english: 'Assyria', korean: '앗시리아', type: 'nation', description: 'Empire that conquered the northern kingdom of Israel.', descriptionKo: '북이스라엘 왕국을 정복한 제국.', strongsNumber: 'H804', occurrences: 151 },
  { id: 'persia', original: 'פָּרַס', english: 'Persia', korean: '바사', type: 'nation', description: 'Empire that allowed Jews to return from exile.', descriptionKo: '유대인들이 포로에서 돌아오도록 허용한 제국.', strongsNumber: 'H6539', occurrences: 29 },
  { id: 'moab-nation', original: 'מוֹאָב', english: 'Moab', korean: '모압', type: 'nation', description: 'Nation east of the Dead Sea, descendants of Lot.', descriptionKo: '사해 동쪽의 민족, 롯의 후손.', strongsNumber: 'H4124', occurrences: 182 },
  { id: 'ammon', original: 'עַמּוֹן', english: 'Ammon', korean: '암몬', type: 'nation', description: 'Nation east of the Jordan, descendants of Lot.', descriptionKo: '요단강 동쪽의 민족, 롯의 후손.', strongsNumber: 'H5983', occurrences: 106 },
  { id: 'amalek', original: 'עֲמָלֵק', english: 'Amalek', korean: '아말렉', type: 'nation', description: 'Nomadic enemies of Israel, descendants of Esau.', descriptionKo: '이스라엘의 유목민 적, 에서의 후손.', strongsNumber: 'H6002', occurrences: 39 },
  { id: 'midian', original: 'מִדְיָן', english: 'Midian', korean: '미디안', type: 'nation', description: 'Desert people descended from Abraham.', descriptionKo: '아브라함의 후손인 사막 민족.', strongsNumber: 'H4080', occurrences: 59 },
  { id: 'edom-nation', original: 'אֱדוֹם', english: 'Edom', korean: '에돔', type: 'nation', description: 'Nation descended from Esau, southeast of Israel.', descriptionKo: '에서의 후손 민족, 이스라엘 남동쪽.', strongsNumber: 'H123', occurrences: 100 },
  { id: 'hittites', original: 'חִתִּי', english: 'Hittites', korean: '헷', type: 'nation', description: 'Ancient people of Canaan.', descriptionKo: '가나안의 고대 민족.', strongsNumber: 'H2850', occurrences: 48 },
  { id: 'canaanites', original: 'כְּנַעֲנִי', english: 'Canaanites', korean: '가나안 사람', type: 'nation', description: 'Inhabitants of Canaan before Israel\'s conquest.', descriptionKo: '이스라엘의 정복 전 가나안의 주민.', strongsNumber: 'H3669', occurrences: 73 },
  { id: 'amorites', original: 'אֱמֹרִי', english: 'Amorites', korean: '아모리', type: 'nation', description: 'One of the peoples of Canaan.', descriptionKo: '가나안의 민족 중 하나.', strongsNumber: 'H567', occurrences: 87 },
  { id: 'samaritans', original: 'Σαμαρῖται', english: 'Samaritans', korean: '사마리아 사람', type: 'nation', description: 'Mixed people of Samaria, considered outsiders by Jews.', descriptionKo: '사마리아의 혼혈 민족, 유대인들에게 이방인으로 여겨짐.', strongsNumber: 'G4541', occurrences: 9 },
  { id: 'greeks', original: 'Ἕλληνες', english: 'Greeks', korean: '헬라인', type: 'nation', description: 'Greek-speaking peoples of the ancient world.', descriptionKo: '고대 세계의 그리스어를 사용하는 민족.', strongsNumber: 'G1672', occurrences: 26 },
  { id: 'romans-nation', original: 'Ῥωμαῖοι', english: 'Romans', korean: '로마인', type: 'nation', description: 'Citizens of the Roman Empire.', descriptionKo: '로마 제국의 시민.', strongsNumber: 'G4514', occurrences: 12 },
  { id: 'babylonians', original: 'כַּשְׂדִּים', english: 'Babylonians (Chaldeans)', korean: '갈대아 사람', type: 'nation', description: 'People of Babylonia who conquered Judah.', descriptionKo: '유다를 정복한 바벨론 사람들.', strongsNumber: 'H3778', occurrences: 80 },
  { id: 'egyptians', original: 'מִצְרִי', english: 'Egyptians', korean: '이집트 사람', type: 'nation', description: 'People of ancient Egypt.', descriptionKo: '고대 이집트의 사람들.', strongsNumber: 'H4713', occurrences: 91 },
  { id: 'jebusites', original: 'יְבוּסִי', english: 'Jebusites', korean: '여부스', type: 'nation', description: 'Original inhabitants of Jerusalem.', descriptionKo: '예루살렘의 원래 주민.', strongsNumber: 'H2983', occurrences: 41 },
  { id: 'hivites', original: 'חִוִּי', english: 'Hivites', korean: '히위', type: 'nation', description: 'One of the peoples of Canaan.', descriptionKo: '가나안의 민족 중 하나.', strongsNumber: 'H2340', occurrences: 25 },
  { id: 'perizzites', original: 'פְּרִזִּי', english: 'Perizzites', korean: '브리스', type: 'nation', description: 'One of the peoples of Canaan.', descriptionKo: '가나안의 민족 중 하나.', strongsNumber: 'H6522', occurrences: 23 },
];

// Build lookup maps for fast access
const englishMap = new Map<string, ProperNoun>();
const koreanMap = new Map<string, ProperNoun>();

for (const noun of PROPER_NOUNS) {
  // Map by English name (case-insensitive key)
  englishMap.set(noun.english.toLowerCase(), noun);
  // Map by Korean name
  koreanMap.set(noun.korean, noun);
}

// Sort terms by length descending so longer matches take priority
const englishTerms = Array.from(englishMap.keys()).sort((a, b) => b.length - a.length);
const koreanTerms = Array.from(koreanMap.keys()).sort((a, b) => b.length - a.length);

export interface ProperNounMatch {
  noun: ProperNoun;
  start: number;
  end: number;
}

/**
 * Find proper nouns in a text string.
 * Returns non-overlapping matches sorted by position.
 */
export function findProperNouns(
  text: string,
  language: 'ko' | 'en'
): ProperNounMatch[] {
  const matches: ProperNounMatch[] = [];
  const occupied = new Set<number>();

  const terms = language === 'ko' ? koreanTerms : englishTerms;
  const map = language === 'ko' ? koreanMap : englishMap;

  for (const term of terms) {
    const searchText = language === 'ko' ? text : text.toLowerCase();
    let idx = 0;
    while (idx < searchText.length) {
      const pos = searchText.indexOf(term, idx);
      if (pos === -1) break;

      const end = pos + term.length;

      // Check word boundaries for English
      if (language === 'en') {
        const before = pos > 0 ? text[pos - 1] : ' ';
        const after = end < text.length ? text[end] : ' ';
        if (/\w/.test(before) || /\w/.test(after)) {
          idx = pos + 1;
          continue;
        }
      }

      // Check for overlap with existing matches
      let overlap = false;
      for (let i = pos; i < end; i++) {
        if (occupied.has(i)) {
          overlap = true;
          break;
        }
      }

      if (!overlap) {
        const noun = map.get(term)!;
        matches.push({ noun, start: pos, end });
        for (let i = pos; i < end; i++) {
          occupied.add(i);
        }
      }

      idx = pos + 1;
    }
  }

  // Sort by position
  matches.sort((a, b) => a.start - b.start);
  return matches;
}

export function getProperNounById(id: string): ProperNoun | undefined {
  return PROPER_NOUNS.find((n) => n.id === id);
}

export function getProperNounsByType(type: ProperNoun['type']): ProperNoun[] {
  return PROPER_NOUNS.filter((n) => n.type === type);
}

export function searchProperNouns(query: string): ProperNoun[] {
  const q = query.toLowerCase();
  return PROPER_NOUNS.filter(
    (n) =>
      n.english.toLowerCase().includes(q) ||
      n.korean.includes(query) ||
      n.original.includes(query)
  );
}
