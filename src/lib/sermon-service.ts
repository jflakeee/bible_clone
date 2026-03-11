import { Sermon, SermonSearchResult } from '@/types/sermon';
import { BIBLE_BOOKS } from '@/lib/constants';

export const SAMPLE_SERMONS: Sermon[] = [
  {
    id: '1',
    title: '하나님의 사랑',
    preacher: '김은혜 목사',
    date: '2024-01-07',
    verses: ['Jhn 3:16', 'Rom 8:38-39'],
    summary: '하나님의 무조건적인 사랑에 대한 설교. 하나님이 독생자를 주셨을 정도로 우리를 사랑하셨다는 복음의 핵심을 전합니다.',
    content: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라. 이 말씀은 성경 전체를 요약하는 핵심 구절입니다. 하나님의 사랑은 조건 없는 사랑이며, 우리가 아직 죄인 되었을 때에 그리스도께서 우리를 위하여 죽으심으로 하나님께서 우리에 대한 자기의 사랑을 확증하셨습니다. 누가 우리를 그리스도의 사랑에서 끊을 수 있겠습니까? 환난이나 곤고나 핍박이나 기근이나 적신이나 위험이나 칼이랴. 그 어떤 것도 우리를 하나님의 사랑에서 끊을 수 없습니다.',
    tags: ['사랑', '구원', '은혜'],
    source: 'sample',
  },
  {
    id: '2',
    title: '창조의 신비',
    preacher: '박창조 목사',
    date: '2024-01-14',
    verses: ['Gen 1:1', 'Gen 1:27', 'Psa 19:1'],
    summary: '하나님의 창조 사역을 통해 그분의 위대하심과 지혜를 묵상하는 설교입니다.',
    content: '태초에 하나님이 천지를 창조하시니라. 이 첫 번째 말씀은 모든 것의 시작을 선포합니다. 하나님은 말씀으로 세상을 창조하셨고, 그분의 지혜와 능력으로 만물을 지으셨습니다. 하늘이 하나님의 영광을 선포하고 궁창이 그의 손으로 하신 일을 나타내나니. 우리는 자연을 통해 하나님의 존재와 능력을 알 수 있습니다. 특별히 하나님은 사람을 자기 형상대로 창조하셨는데, 이것은 인간의 존엄성과 가치의 근거가 됩니다.',
    tags: ['창조', '하나님의 능력', '지혜'],
    source: 'sample',
  },
  {
    id: '3',
    title: '믿음의 조상 아브라함',
    preacher: '이신앙 목사',
    date: '2024-01-21',
    verses: ['Gen 12:1-3', 'Heb 11:8', 'Rom 4:3'],
    summary: '아브라함의 믿음을 통해 우리가 배워야 할 신앙의 자세를 살펴봅니다.',
    content: '여호와께서 아브람에게 이르시되 너는 너의 고향과 친척과 아버지의 집을 떠나 내가 네게 보여 줄 땅으로 가라. 아브라함은 갈 바를 알지 못하고 나아갔습니다. 이것이 믿음입니다. 보이지 않는 것을 바라는 확신이요, 보이지 않는 것을 증거하는 실상입니다. 아브라함이 하나님을 믿으매 이것이 그에게 의로 여겨진 것같이, 우리도 예수 그리스도를 믿는 믿음으로 의롭다 함을 받습니다.',
    tags: ['믿음', '순종', '축복'],
    source: 'sample',
  },
  {
    id: '4',
    title: '출애굽의 은혜',
    preacher: '최해방 목사',
    date: '2024-01-28',
    verses: ['Exo 14:13-14', 'Exo 15:2'],
    summary: '이스라엘의 출애굽 사건을 통해 하나님의 구원과 해방의 은혜를 선포합니다.',
    content: '모세가 백성에게 이르되 너희는 두려워하지 말고 가만히 서서 여호와께서 오늘 너희를 위하여 행하시는 구원을 보라. 하나님은 홍해를 가르시고 이스라엘 백성을 건너게 하셨습니다. 우리 삶에도 홍해 같은 난관이 있지만, 하나님은 길을 만드시는 분입니다. 여호와는 나의 힘이요 노래시며 나의 구원이시로다. 이 하나님을 의지할 때 우리는 어떤 상황에서도 승리할 수 있습니다.',
    tags: ['구원', '해방', '기적', '신뢰'],
    source: 'sample',
  },
  {
    id: '5',
    title: '십계명과 거룩한 삶',
    preacher: '정율법 목사',
    date: '2024-02-04',
    verses: ['Exo 20:1-17', 'Mat 22:37-40'],
    summary: '십계명의 의미와 그리스도인으로서 거룩한 삶을 살아가는 방법을 살펴봅니다.',
    content: '하나님이 이 모든 말씀으로 이르시되, 나는 너를 애굽 땅 종 되었던 집에서 인도하여 낸 네 하나님 여호와니라. 십계명은 하나님과의 관계와 이웃과의 관계를 규정하는 하나님의 말씀입니다. 예수님은 이것을 두 가지로 요약하셨습니다. 네 마음을 다하고 목숨을 다하고 뜻을 다하여 주 너의 하나님을 사랑하라, 그리고 네 이웃을 네 자신 같이 사랑하라. 이것이 율법의 핵심이며, 우리 삶의 기준이 되어야 합니다.',
    tags: ['율법', '거룩', '사랑', '순종'],
    source: 'sample',
  },
  {
    id: '6',
    title: '다윗의 회개와 용서',
    preacher: '김회복 목사',
    date: '2024-02-11',
    verses: ['Psa 51:1-4', 'Psa 51:10', '2Sa 12:13'],
    summary: '다윗의 진실한 회개를 통해 하나님의 용서와 회복의 은혜를 배웁니다.',
    content: '하나님이여 주의 인자를 따라 나를 긍휼히 여기시며 주의 많은 자비를 따라 내 죄악을 지워 주소서. 다윗은 큰 죄를 범했지만, 진심으로 회개했습니다. 하나님은 상한 심령과 통회하는 마음을 멸시하지 않으십니다. 하나님이여 내 속에 정한 마음을 창조하시고 내 안에 정직한 영을 새롭게 하소서. 회개는 단순히 미안함이 아니라 완전한 방향 전환입니다. 하나님은 진심으로 돌아오는 자를 반드시 용서하시고 회복시켜 주십니다.',
    tags: ['회개', '용서', '회복', '은혜'],
    source: 'sample',
  },
  {
    id: '7',
    title: '여호와는 나의 목자',
    preacher: '이평안 목사',
    date: '2024-02-18',
    verses: ['Psa 23:1-6', 'Jhn 10:11'],
    summary: '시편 23편을 통해 하나님의 인도하심과 돌보심을 묵상합니다.',
    content: '여호와는 나의 목자시니 내게 부족함이 없으리로다. 그가 나를 푸른 초장에 누이시며 쉴 만한 물 가로 인도하시는도다. 하나님은 우리의 목자이시며, 우리를 가장 좋은 길로 인도하십니다. 내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라. 예수님도 자신을 선한 목자라 하셨습니다. 선한 목자는 양들을 위하여 목숨을 버립니다. 이런 하나님의 돌보심 안에서 우리는 평안을 누릴 수 있습니다.',
    tags: ['평안', '인도하심', '신뢰', '돌보심'],
    source: 'sample',
  },
  {
    id: '8',
    title: '지혜의 근본',
    preacher: '박지혜 목사',
    date: '2024-02-25',
    verses: ['Pro 1:7', 'Pro 3:5-6', 'Jas 1:5'],
    summary: '참된 지혜의 근본이 여호와를 경외하는 것임을 선포하는 설교입니다.',
    content: '여호와를 경외하는 것이 지식의 근본이거늘 미련한 자는 지혜와 훈계를 멸시하느니라. 세상의 지혜와 하나님의 지혜는 다릅니다. 너는 마음을 다하여 여호와를 신뢰하고 네 명철을 의지하지 말라. 너의 모든 길에서 그를 인정하라 그리하면 네 길을 지도하시리라. 지혜가 부족한 자가 있으면 하나님께 구하라. 그리하면 후히 주시고 꾸짖지 않으시는 하나님께서 주실 것입니다.',
    tags: ['지혜', '경외', '신뢰', '기도'],
    source: 'sample',
  },
  {
    id: '9',
    title: '이사야의 소명',
    preacher: '정소명 목사',
    date: '2024-03-03',
    verses: ['Isa 6:1-8', 'Isa 6:8'],
    summary: '이사야의 소명 경험을 통해 하나님의 거룩하심과 우리의 사명을 생각합니다.',
    content: '웃시야 왕이 죽던 해에 내가 본즉 주께서 높이 들린 보좌에 앉으셨는데 그의 옷자락은 성전에 가득하였고, 스랍들이 거룩하다 거룩하다 거룩하다 만군의 여호와여 그의 영광이 온 땅에 충만하도다 하고 있었습니다. 이사야는 하나님의 거룩하심 앞에서 자신의 부족함을 깨달았고, 하나님의 정결케 하심을 경험했습니다. 그리고 내가 누구를 보내며 누가 우리를 위하여 갈꼬 하시는 주의 음성을 듣고, 내가 여기 있나이다 나를 보내소서 라고 응답했습니다.',
    tags: ['소명', '거룩', '헌신', '섬김'],
    source: 'sample',
  },
  {
    id: '10',
    title: '새 힘을 얻는 비결',
    preacher: '김은혜 목사',
    date: '2024-03-10',
    verses: ['Isa 40:29-31'],
    summary: '피곤하고 지친 자들에게 새 힘을 주시는 하나님의 약속을 전합니다.',
    content: '피곤한 자에게는 능력을 주시며 무능한 자에게는 힘을 더하시나니. 소년이라도 피곤하며 곤비하며 장정이라도 넘어지며 자빠지되, 오직 여호와를 앙망하는 자는 새 힘을 얻으리니 독수리가 날개치며 올라감 같을 것이요, 달음박질하여도 곤비하지 아니하겠고 걸어가도 피곤하지 아니하리로다. 우리의 힘으로는 한계가 있지만, 하나님을 의지하면 새 힘을 얻습니다. 여호와를 앙망하는 것, 곧 기도와 말씀 묵상을 통해 날마다 새롭게 됩시다.',
    tags: ['소망', '회복', '기도', '인내'],
    source: 'sample',
  },
  {
    id: '11',
    title: '예레미야의 눈물과 소망',
    preacher: '이신앙 목사',
    date: '2024-03-17',
    verses: ['Jer 29:11', 'Lam 3:22-23'],
    summary: '고난 가운데에서도 소망을 잃지 않는 믿음에 대해 이야기합니다.',
    content: '여호와의 말씀이니라 너희를 향한 나의 생각을 내가 아나니 평안이요 재앙이 아니니라 너희에게 미래와 희망을 주는 것이니라. 바벨론 포로기 중에도 하나님은 소망의 말씀을 주셨습니다. 여호와의 인자와 긍휼이 무궁하시도다. 이것들이 아침마다 새로우니 주의 성실하심이 크시도다. 아무리 어두운 밤이 지나도 아침은 반드시 옵니다. 하나님의 신실하심은 변함없으시며, 그분의 계획은 우리를 향한 선한 것입니다.',
    tags: ['소망', '위로', '신실하심', '미래'],
    source: 'sample',
  },
  {
    id: '12',
    title: '다니엘의 신앙 고백',
    preacher: '최해방 목사',
    date: '2024-03-24',
    verses: ['Dan 3:17-18', 'Dan 6:10'],
    summary: '다니엘과 세 친구의 흔들리지 않는 신앙을 통해 담대한 믿음을 배웁니다.',
    content: '왕이여 우리가 섬기는 하나님이 우리를 능히 건져내시리이다. 그렇게 하지 않으실지라도 우리는 왕의 신들을 섬기지도 않고 왕이 세우신 금 신상에게 절하지도 않겠나이다. 이것이 참된 믿음의 고백입니다. 하나님이 건져주시든 그렇지 않으시든, 우리의 신앙은 흔들리지 않아야 합니다. 다니엘도 사자 굴에 던져질 것을 알면서도 날마다 세 번씩 무릎을 꿇고 기도하였습니다. 이런 담대한 믿음이 우리에게도 필요합니다.',
    tags: ['믿음', '담대함', '기도', '신앙고백'],
    source: 'sample',
  },
  {
    id: '13',
    title: '산상수훈 - 팔복',
    preacher: '박복음 목사',
    date: '2024-03-31',
    verses: ['Mat 5:3-12'],
    summary: '예수님의 산상수훈 팔복을 통해 참된 행복이 무엇인지 살펴봅니다.',
    content: '심령이 가난한 자는 복이 있나니 천국이 그들의 것임이요. 애통하는 자는 복이 있나니 그들이 위로를 받을 것임이요. 온유한 자는 복이 있나니 그들이 땅을 기업으로 받을 것임이요. 예수님의 팔복은 세상의 행복관과 완전히 다릅니다. 세상은 부유함, 즐거움, 강함을 행복이라 하지만, 예수님은 가난함, 애통함, 온유함 속에서 참된 복을 말씀하셨습니다. 의에 주리고 목마른 자, 긍휼히 여기는 자, 마음이 청결한 자, 화평하게 하는 자가 되어야 합니다.',
    tags: ['축복', '행복', '겸손', '온유'],
    source: 'sample',
  },
  {
    id: '14',
    title: '주기도문의 의미',
    preacher: '김기도 목사',
    date: '2024-04-07',
    verses: ['Mat 6:9-13', 'Luk 11:1-4'],
    summary: '주기도문 각 구절의 의미를 깊이 묵상하며 기도의 모범을 배웁니다.',
    content: '하늘에 계신 우리 아버지여 이름이 거룩히 여김을 받으시오며 나라가 임하시오며 뜻이 하늘에서 이루어진 것 같이 땅에서도 이루어지이다. 주기도문은 예수님이 가르쳐 주신 기도의 모범입니다. 먼저 하나님의 이름과 나라와 뜻을 구하고, 그 후에 우리의 필요를 구합니다. 일용할 양식, 죄의 용서, 시험에서의 보호를 구합니다. 기도는 하나님과의 대화이며, 주기도문은 그 대화의 가장 아름다운 모범입니다.',
    tags: ['기도', '신앙생활', '하나님 나라'],
    source: 'sample',
  },
  {
    id: '15',
    title: '겨자씨 비유',
    preacher: '이성장 목사',
    date: '2024-04-14',
    verses: ['Mat 13:31-32', 'Mrk 4:30-32'],
    summary: '겨자씨 비유를 통해 작은 믿음이 크게 자라나는 하나님 나라의 원리를 배웁니다.',
    content: '천국은 마치 사람이 자기 밭에 갖다 심은 겨자씨 한 알 같으니 이는 모든 씨보다 작은 것이로되 자란 후에는 풀보다 커서 나무가 되매 공중의 새들이 와서 그 가지에 깃들이느니라. 하나님 나라는 작은 것에서 시작됩니다. 우리의 믿음이 비록 겨자씨만큼 작을지라도, 하나님은 그것을 크게 자라게 하십니다. 작은 헌신, 작은 섬김, 작은 기도가 모여 위대한 하나님의 역사가 이루어집니다.',
    tags: ['믿음', '성장', '하나님 나라', '비유'],
    source: 'sample',
  },
  {
    id: '16',
    title: '잃어버린 양의 비유',
    preacher: '박목자 목사',
    date: '2024-04-21',
    verses: ['Luk 15:3-7', 'Mat 18:12-14'],
    summary: '잃어버린 양의 비유를 통해 한 영혼을 향한 하나님의 사랑을 전합니다.',
    content: '너희 중에 어떤 사람이 양 백 마리가 있는데 그 중의 하나를 잃으면 아흔아홉 마리를 들에 두고 그 잃은 것을 찾아다니지 아니하겠느냐. 또 찾으면 기뻐하며 그 양을 어깨에 메고 집에 와서 벗과 이웃을 불러 함께 기뻐하리라. 하나님은 한 영혼도 포기하지 않으십니다. 아흔아홉 마리의 의인보다 한 명의 죄인이 회개하는 것을 더 기뻐하십니다. 이것이 우리가 전도해야 하는 이유입니다.',
    tags: ['사랑', '전도', '회개', '비유'],
    source: 'sample',
  },
  {
    id: '17',
    title: '탕자의 귀환',
    preacher: '정은혜 목사',
    date: '2024-04-28',
    verses: ['Luk 15:11-32'],
    summary: '탕자의 비유를 통해 아버지의 무한한 사랑과 용서를 묵상합니다.',
    content: '아버지가 그를 보고 측은히 여겨 달려가 목을 안고 입을 맞추니. 탕자는 아버지의 유산을 미리 받아 허랑방탕한 생활을 했습니다. 그러나 자신의 처지를 깨닫고 아버지께 돌아왔을 때, 아버지는 종이라도 되게 해달라는 아들을 품에 안으시고 상등 옷을 입히시고 반지를 끼우시고 잔치를 베푸셨습니다. 이것이 하나님 아버지의 사랑입니다. 우리가 아무리 멀리 떠나갔더라도, 돌아오기만 하면 하나님은 두 팔 벌려 환영하십니다.',
    tags: ['용서', '회개', '사랑', '은혜', '회복'],
    source: 'sample',
  },
  {
    id: '18',
    title: '포도나무와 가지',
    preacher: '김연합 목사',
    date: '2024-05-05',
    verses: ['Jhn 15:1-8', 'Jhn 15:5'],
    summary: '예수님이 참 포도나무이시며 우리가 가지라는 비유를 통해 주님과의 연합을 강조합니다.',
    content: '나는 포도나무요 너희는 가지라. 그가 내 안에, 내가 그 안에 거하면 사람이 열매를 많이 맺나니 나를 떠나서는 너희가 아무것도 할 수 없음이라. 그리스도인의 삶에서 가장 중요한 것은 예수님 안에 거하는 것입니다. 가지가 나무에 붙어 있어야 양분을 받고 열매를 맺을 수 있듯이, 우리도 예수님 안에 거해야 합니다. 기도, 말씀, 찬양, 교제를 통해 주님과 깊이 연합하면 삶에서 풍성한 열매가 맺힙니다.',
    tags: ['연합', '열매', '기도', '신앙생활'],
    source: 'sample',
  },
  {
    id: '19',
    title: '부활의 능력',
    preacher: '이부활 목사',
    date: '2024-05-12',
    verses: ['Jhn 11:25-26', '1Co 15:55-57', 'Rom 6:9'],
    summary: '예수 그리스도의 부활이 우리에게 주는 의미와 소망을 선포합니다.',
    content: '나는 부활이요 생명이니 나를 믿는 자는 죽어도 살겠고 무릇 살아서 나를 믿는 자는 영원히 죽지 아니하리니 이것을 네가 믿느냐. 예수님의 부활은 기독교 신앙의 핵심입니다. 사망아 너의 승리가 어디 있느냐 사망아 너의 쏘는 것이 어디 있느냐. 우리 주 예수 그리스도로 말미암아 우리에게 승리를 주시는 하나님께 감사하노라. 부활의 주님은 오늘도 살아 계시며, 우리에게 영원한 생명의 소망을 주십니다.',
    tags: ['부활', '소망', '영생', '승리'],
    source: 'sample',
  },
  {
    id: '20',
    title: '성령의 열매',
    preacher: '박성령 목사',
    date: '2024-05-19',
    verses: ['Gal 5:22-23', 'Act 1:8'],
    summary: '성령의 아홉 가지 열매를 살펴보고 성령 충만한 삶을 살도록 권면합니다.',
    content: '오직 성령의 열매는 사랑과 희락과 화평과 오래 참음과 자비와 양선과 충성과 온유와 절제니 이같은 것을 금지할 법이 없느니라. 성령의 열매는 우리가 노력해서 만들어내는 것이 아니라, 성령님께서 우리 안에서 맺으시는 것입니다. 오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라. 성령 충만한 삶을 통해 아름다운 열매를 맺읍시다.',
    tags: ['성령', '열매', '성품', '성화'],
    source: 'sample',
  },
  {
    id: '21',
    title: '사랑의 찬가',
    preacher: '김사랑 목사',
    date: '2024-05-26',
    verses: ['1Co 13:1-13', '1Co 13:4-7'],
    summary: '고린도전서 13장의 사랑의 정의를 통해 참된 사랑의 의미를 깨닫습니다.',
    content: '사랑은 오래 참고 사랑은 온유하며 시기하지 아니하며 사랑은 자랑하지 아니하며 교만하지 아니하며 무례히 행하지 아니하며 자기의 유익을 구하지 아니하며 성내지 아니하며 악한 것을 생각하지 아니하며. 내가 사람의 방언과 천사의 말을 할지라도 사랑이 없으면 소리 나는 구리와 울리는 꽹과리가 되고. 믿음 소망 사랑 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라. 사랑은 모든 신앙생활의 기초입니다.',
    tags: ['사랑', '은사', '신앙생활', '관계'],
    source: 'sample',
  },
  {
    id: '22',
    title: '의의 무장',
    preacher: '이전사 목사',
    date: '2024-06-02',
    verses: ['Eph 6:10-18'],
    summary: '영적 전쟁에서 승리하기 위한 하나님의 전신갑주에 대해 배웁니다.',
    content: '끝으로 형제들아 주 안에서와 그 힘의 능력으로 강건하여지고 마귀의 간계를 능히 대적하기 위하여 하나님의 전신갑주를 입으라. 진리의 허리띠, 의의 흉배, 평안의 복음의 신, 믿음의 방패, 구원의 투구, 성령의 검 곧 하나님의 말씀. 우리의 싸움은 혈과 육에 대한 것이 아니요 통치자들과 권세들과 이 어둠의 세상 주관자들과 하늘에 있는 악의 영들에게 대함이라. 모든 기도와 간구를 하되 항상 성령 안에서 기도하라.',
    tags: ['영적전쟁', '믿음', '기도', '승리'],
    source: 'sample',
  },
  {
    id: '23',
    title: '빌립보의 기쁨',
    preacher: '정기쁨 목사',
    date: '2024-06-09',
    verses: ['Php 4:4-7', 'Php 4:13'],
    summary: '어떤 환경에서도 기뻐할 수 있는 비결을 빌립보서에서 찾아봅니다.',
    content: '주 안에서 항상 기뻐하라 내가 다시 말하노니 기뻐하라. 바울은 감옥에서 이 편지를 썼습니다. 그런데도 기뻐하라고 말합니다. 아무것도 염려하지 말고 다만 모든 일에 기도와 간구로 너희 구할 것을 감사함으로 하나님께 아뢰라. 그리하면 모든 지각에 뛰어난 하나님의 평강이 그리스도 예수 안에서 너희 마음과 생각을 지키시리라. 내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.',
    tags: ['기쁨', '감사', '평안', '기도'],
    source: 'sample',
  },
  {
    id: '24',
    title: '믿음의 경주',
    preacher: '박달음 목사',
    date: '2024-06-16',
    verses: ['Heb 12:1-2', '2Ti 4:7-8', 'Heb 11:1'],
    summary: '믿음의 경주를 인내로 달리며 예수님을 바라보는 삶을 권면합니다.',
    content: '이러므로 우리에게 구름 같이 둘러싼 허다한 증인들이 있으니 모든 무거운 것과 얽매이기 쉬운 죄를 벗어 버리고 인내로써 우리 앞에 당한 경주를 하며 믿음의 주요 또 온전하게 하시는 이인 예수를 바라보자. 나는 선한 싸움을 싸우고 나의 달려갈 길을 마치고 믿음을 지켰으니 이제 후로는 나를 위하여 의의 면류관이 예비되었으므로. 믿음은 바라는 것들의 실상이요 보이지 않는 것들의 증거니.',
    tags: ['믿음', '인내', '소망', '경주'],
    source: 'sample',
  },
  {
    id: '25',
    title: '야고보의 실천적 신앙',
    preacher: '최실천 목사',
    date: '2024-06-23',
    verses: ['Jas 2:17', 'Jas 1:22', 'Jas 2:26'],
    summary: '행함이 있는 믿음, 실천하는 신앙에 대해 야고보서를 통해 배웁니다.',
    content: '이와 같이 행함이 없는 믿음은 그 자체가 죽은 것이라. 너희는 말씀을 행하는 자가 되고 듣기만 하여 자신을 속이는 자가 되지 말라. 영혼 없는 몸이 죽은 것 같이 행함이 없는 믿음도 죽은 것이니라. 야고보서는 우리의 믿음이 삶에서 실천으로 나타나야 함을 강조합니다. 진정한 신앙은 고아와 과부를 돌보고, 이웃을 사랑하며, 말을 조심하고, 겸손히 행하는 것입니다. 믿음과 행함은 분리될 수 없습니다.',
    tags: ['실천', '믿음', '행함', '봉사'],
    source: 'sample',
  },
  {
    id: '26',
    title: '새 하늘과 새 땅',
    preacher: '이영광 목사',
    date: '2024-06-30',
    verses: ['Rev 21:1-4', 'Rev 22:1-5'],
    summary: '요한계시록에 나타난 새 하늘과 새 땅의 약속을 통해 영원한 소망을 전합니다.',
    content: '또 내가 새 하늘과 새 땅을 보니 처음 하늘과 처음 땅이 없어졌고 바다도 다시 있지 않더라. 모든 눈물을 그 눈에서 닦아 주시니 다시는 사망이 없고 애통하는 것이나 곡하는 것이나 아픈 것이 다시 있지 아니하리니. 하나님은 이 세상의 모든 고통과 아픔을 끝내시고, 새 하늘과 새 땅에서 우리와 영원히 함께 하실 것입니다. 이것이 우리의 최종적인 소망이며, 이 소망이 현재의 고난을 이겨낼 힘을 줍니다.',
    tags: ['소망', '천국', '영생', '위로'],
    source: 'sample',
  },
  {
    id: '27',
    title: '요나의 순종과 하나님의 긍휼',
    preacher: '박순종 목사',
    date: '2024-07-07',
    verses: ['Jon 1:1-3', 'Jon 3:10', 'Jon 4:2'],
    summary: '요나서를 통해 하나님의 부르심에 대한 순종과 모든 민족을 향한 긍휼을 배웁니다.',
    content: '여호와의 말씀이 요나에게 임하니라. 그러나 요나는 여호와의 낯을 피하여 다시스로 도망하려 했습니다. 하나님의 부르심을 거부할 때, 우리의 삶에 폭풍이 옵니다. 결국 요나가 순종했을 때, 니느웨 온 성이 회개했고 하나님은 그들을 긍휼히 여기셨습니다. 주께서는 은혜로우시며 자비로우시며 노하기를 더디하시며 인애가 크시사 뜻을 돌이켜 재앙을 내리지 아니하시는 하나님이시니이다.',
    tags: ['순종', '긍휼', '선교', '회개'],
    source: 'sample',
  },
  {
    id: '28',
    title: '선한 사마리아인',
    preacher: '김이웃 목사',
    date: '2024-07-14',
    verses: ['Luk 10:25-37'],
    summary: '선한 사마리아인 비유를 통해 참된 이웃 사랑의 의미를 생각합니다.',
    content: '어떤 사마리아 사람은 여행하는 중 그를 보고 불쌍히 여겨 가까이 가서 기름과 포도주를 그 상처에 붓고 싸매고 자기 짐승에 태워 주막으로 데리고 가서 돌보아 주니라. 제사장과 레위인은 지나쳤지만, 원수로 여겨지던 사마리아인이 도왔습니다. 예수님은 물으셨습니다. 이 세 사람 중에 누가 강도 만난 자의 이웃이 되겠느냐. 가서 너도 이와 같이 하라. 참된 이웃 사랑은 경계를 넘어서는 것입니다.',
    tags: ['사랑', '이웃', '섬김', '비유', '긍휼'],
    source: 'sample',
  },
  {
    id: '29',
    title: '베드로의 고백과 반석',
    preacher: '이고백 목사',
    date: '2024-07-21',
    verses: ['Mat 16:13-18', '1Pe 2:4-5'],
    summary: '베드로의 신앙 고백과 그 위에 세워지는 교회의 의미를 살펴봅니다.',
    content: '시몬 베드로가 대답하여 이르되 주는 그리스도시요 살아 계신 하나님의 아들이시니이다. 예수님이 이르시되 바요나 시몬아 네가 복이 있도다. 이를 네게 알게 한 이는 혈육이 아니요 하늘에 계신 내 아버지시니라. 내가 이 반석 위에 내 교회를 세우리니 음부의 권세가 이기지 못하리라. 참된 신앙 고백은 인간적인 지식이 아니라 하나님의 계시로부터 옵니다. 이 고백 위에 교회가 세워집니다.',
    tags: ['신앙고백', '교회', '믿음', '계시'],
    source: 'sample',
  },
  {
    id: '30',
    title: '오병이어의 기적',
    preacher: '정나눔 목사',
    date: '2024-07-28',
    verses: ['Jhn 6:1-14', 'Mat 14:13-21'],
    summary: '오병이어 기적을 통해 작은 것을 드릴 때 하나님이 크게 사용하심을 전합니다.',
    content: '여기 한 아이가 있어 보리떡 다섯 개와 물고기 두 마리를 가지고 있나이다. 그러나 그것이 이 많은 사람에게 얼마나 되겠나이까. 안드레의 말처럼 보리떡 다섯 개와 물고기 두 마리는 오천 명을 먹이기에 턱없이 부족했습니다. 그러나 예수님이 축사하시고 떼어 나눠주시니 다 배불리 먹고 남은 조각이 열두 바구니나 되었습니다. 우리가 가진 작은 것을 주님께 드리면, 주님은 그것을 크게 사용하십니다.',
    tags: ['기적', '헌신', '나눔', '믿음'],
    source: 'sample',
  },
  {
    id: '31',
    title: '물 위를 걸은 베드로',
    preacher: '김담대 목사',
    date: '2024-08-04',
    verses: ['Mat 14:22-33'],
    summary: '물 위를 걸은 베드로의 경험을 통해 믿음과 의심에 대해 생각합니다.',
    content: '베드로가 배에서 내려 물 위로 걸어서 예수께로 가되 바람을 보고 무서워 빠져가는지라. 주여 나를 구원하소서 하니 예수께서 즉시 손을 내밀어 그를 붙잡으시며 이르시되 믿음이 작은 자여 왜 의심하였느냐. 베드로는 예수님을 바라볼 때 물 위를 걸었지만, 환경을 바라볼 때 빠졌습니다. 우리 삶도 마찬가지입니다. 환경이 아닌 예수님을 바라볼 때 불가능한 일도 가능해집니다. 의심이 올 때 주님의 손을 잡읍시다.',
    tags: ['믿음', '의심', '신뢰', '도전'],
    source: 'sample',
  },
  {
    id: '32',
    title: '룻의 결단과 충성',
    preacher: '이충성 목사',
    date: '2024-08-11',
    verses: ['Rut 1:16-17', 'Rut 2:12'],
    summary: '룻의 시어머니 나오미를 향한 충성과 하나님의 인도하심을 살펴봅니다.',
    content: '어머니를 떠나며 어머니의 하나님을 버리라 강권하지 마옵소서. 어머니께서 가시는 곳에 나도 가고 어머니께서 머무시는 곳에서 나도 머물겠나이다. 어머니의 백성이 나의 백성이 되고 어머니의 하나님이 나의 하나님이 되시리니. 룻의 결단은 단순한 효도가 아니라 하나님을 향한 믿음의 고백이었습니다. 이 이방 여인의 충성을 통해 하나님은 그녀를 다윗 왕의 증조모, 나아가 예수 그리스도의 족보에 넣어주셨습니다.',
    tags: ['충성', '결단', '믿음', '인도하심'],
    source: 'sample',
  },
  {
    id: '33',
    title: '사무엘의 응답',
    preacher: '박경청 목사',
    date: '2024-08-18',
    verses: ['1Sa 3:1-10', '1Sa 3:10'],
    summary: '어린 사무엘의 하나님 음성 듣기를 통해 말씀에 귀 기울이는 삶을 배웁니다.',
    content: '여호와께서 오셔서 서서 전과 같이 사무엘아 사무엘아 부르시는지라 사무엘이 이르되 말씀하옵소서 주의 종이 듣겠나이다. 하나님은 우리에게 말씀하기 원하십니다. 문제는 우리가 들을 준비가 되어 있느냐입니다. 사무엘은 어린 나이에도 하나님의 음성에 응답했습니다. 말씀하옵소서 주의 종이 듣겠나이다. 이것이 우리의 기도가 되어야 합니다. 하나님의 음성은 성경 말씀, 기도, 성령의 감동을 통해 오늘도 우리에게 임합니다.',
    tags: ['경청', '순종', '소명', '기도'],
    source: 'sample',
  },
  {
    id: '34',
    title: '엘리야의 기도',
    preacher: '최기도 목사',
    date: '2024-08-25',
    verses: ['1Ki 18:36-39', 'Jas 5:17-18'],
    summary: '갈멜산에서의 엘리야의 기도와 하나님의 응답을 통해 기도의 능력을 배웁니다.',
    content: '아브라함과 이삭과 이스라엘의 하나님 여호와여 주께서 이스라엘에서 하나님이 되심과 내가 주의 종인 것과 내가 주의 말씀대로 이 모든 일을 행하는 것을 오늘 알게 하옵소서. 여호와여 내게 응답하옵소서. 여호와의 불이 내려와 번제물과 나무와 돌과 흙을 태우고 또 도랑의 물도 핥은지라. 뭇 백성이 이를 보고 엎드려 여호와 그는 하나님이시로다 하니라. 엘리야와 같은 성정을 가진 사람의 간절한 기도가 역사합니다.',
    tags: ['기도', '능력', '믿음', '부흥'],
    source: 'sample',
  },
  {
    id: '35',
    title: '전도서의 인생 교훈',
    preacher: '정지혜 목사',
    date: '2024-09-01',
    verses: ['Ecc 3:1-8', 'Ecc 12:13'],
    summary: '전도서의 지혜를 통해 인생의 의미와 하나님 경외의 중요성을 배웁니다.',
    content: '천하에 범사가 기한이 있고 모든 목적이 이룰 때가 있나니 날 때가 있고 죽을 때가 있으며 심을 때가 있고 심은 것을 뽑을 때가 있으며. 전도서는 해 아래에서의 모든 것이 헛되다고 말하지만, 결론은 이것입니다. 일의 결국을 다 들었으니 하나님을 경외하고 그의 명령들을 지킬지어다. 이것이 모든 사람의 본분이니라. 인생의 모든 계절에는 하나님의 뜻이 있으며, 그분을 경외하는 것이 인생의 참된 의미입니다.',
    tags: ['지혜', '경외', '인생', '시간'],
    source: 'sample',
  },
  {
    id: '36',
    title: '고난 중의 욥',
    preacher: '김인내 목사',
    date: '2024-09-08',
    verses: ['Job 1:21', 'Job 42:5-6', 'Job 19:25'],
    summary: '욥의 고난을 통해 시련 가운데서도 하나님을 신뢰하는 믿음을 배웁니다.',
    content: '여호와께서 주셨고 여호와께서 거두어 가셨으니 여호와의 이름이 찬송을 받으실지니이다. 욥은 모든 것을 잃었지만 하나님을 원망하지 않았습니다. 그리고 마침내 고백합니다. 내가 주께 대하여 귀로 듣기만 하였사오나 이제는 눈으로 주를 뵈옵나이다. 또한 나는 나의 대속자가 살아 계신 줄을 아오며 마침내 그가 땅 위에 서실 줄을 아노라. 고난은 때로 하나님을 더 깊이 만나는 통로가 됩니다.',
    tags: ['고난', '인내', '신뢰', '회복'],
    source: 'sample',
  },
  {
    id: '37',
    title: '오순절 성령 강림',
    preacher: '이오순 목사',
    date: '2024-09-15',
    verses: ['Act 2:1-4', 'Act 2:17', 'Act 2:38'],
    summary: '오순절 성령 강림 사건과 초대교회의 탄생을 살펴봅니다.',
    content: '오순절 날이 이미 이르매 그들이 다같이 한 곳에 모였더니 홀연히 하늘로부터 급하고 강한 바람 같은 소리가 있어 그들이 앉은 온 집에 가득하며 마치 불의 혀처럼 갈라지는 것들이 그들에게 보여 각 사람 위에 하나씩 임하여 있더니 그들이 다 성령의 충만함을 받고. 말세에 내가 내 영을 모든 육체에 부어 주리니. 너희가 회개하여 각각 예수 그리스도의 이름으로 세례를 받고 죄 사함을 받으라 그리하면 성령의 선물을 받으리니.',
    tags: ['성령', '교회', '부흥', '회개'],
    source: 'sample',
  },
  {
    id: '38',
    title: '바울의 회심',
    preacher: '박변화 목사',
    date: '2024-09-22',
    verses: ['Act 9:1-6', 'Act 9:15', '1Ti 1:15'],
    summary: '바울의 극적인 회심을 통해 하나님의 은혜와 변화시키는 능력을 전합니다.',
    content: '사울아 사울아 네가 어찌하여 나를 박해하느냐. 주께서 이르시되 나는 네가 박해하는 예수라. 교회를 박해하던 사울이 복음의 사도 바울이 되었습니다. 주께서 이르시되 이 사람은 내 이름을 이방인과 임금들과 이스라엘 자손들에게 전하기 위하여 택한 나의 그릇이라. 미쁘다 모든 사람이 받을 만한 이 말이여 그리스도 예수께서 죄인을 구원하시려고 세상에 임하셨다 하였도다 죄인 중에 내가 괴수니라. 하나님은 누구든지 변화시킬 수 있습니다.',
    tags: ['회심', '은혜', '변화', '선교'],
    source: 'sample',
  },
  {
    id: '39',
    title: '의를 위한 칭의',
    preacher: '정복음 목사',
    date: '2024-09-29',
    verses: ['Rom 3:23-24', 'Rom 5:1', 'Rom 8:1'],
    summary: '로마서를 통해 이신칭의의 교리를 명확히 이해하고 확신을 갖습니다.',
    content: '모든 사람이 죄를 범하였으매 하나님의 영광에 이르지 못하더니 그리스도 예수 안에 있는 속량으로 말미암아 하나님의 은혜로 값 없이 의롭다 하심을 얻은 자 되었느니라. 그러므로 우리가 믿음으로 의롭다 하심을 받았으니 우리 주 예수 그리스도로 말미암아 하나님과 화평을 누리자. 그러므로 이제 그리스도 예수 안에 있는 자에게는 결코 정죄함이 없나니. 이것이 복음의 핵심이며, 우리 신앙의 기초입니다.',
    tags: ['구원', '칭의', '은혜', '믿음'],
    source: 'sample',
  },
  {
    id: '40',
    title: '감사의 능력',
    preacher: '김감사 목사',
    date: '2024-10-06',
    verses: ['1Th 5:16-18', 'Psa 100:4', 'Col 3:17'],
    summary: '범사에 감사하라는 말씀을 통해 감사의 삶이 주는 능력과 축복을 전합니다.',
    content: '항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라. 감사함으로 그의 문에 들어가며 찬송함으로 그의 궁정에 들어가서 그에게 감사하며 그의 이름을 송축할지어다. 또 무엇을 하든지 말에나 일에나 다 주 예수의 이름으로 하고 그를 힘입어 하나님 아버지께 감사하라. 감사는 선택이며, 감사할 때 우리의 시선이 문제에서 하나님께로 향합니다.',
    tags: ['감사', '기쁨', '기도', '신앙생활'],
    source: 'sample',
  },
];

// All unique tags from sample sermons
export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  SAMPLE_SERMONS.forEach((sermon) => {
    sermon.tags.forEach((tag) => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}

// Normalize a verse reference for comparison
function normalizeVerseRef(ref: string): string {
  return ref.toLowerCase().replace(/\s+/g, ' ').trim();
}

// Check if two verse references overlap (handles ranges like "Gen 1:1-3")
function verseRefsOverlap(ref1: string, ref2: string): boolean {
  const n1 = normalizeVerseRef(ref1);
  const n2 = normalizeVerseRef(ref2);

  // Extract book and chapter from both
  const parseRef = (r: string) => {
    const match = r.match(/^(\d?\s*\w+)\s+(\d+)(?::(\d+))?/);
    if (!match) return null;
    return { book: match[1].trim(), chapter: match[2], verse: match[3] };
  };

  const p1 = parseRef(n1);
  const p2 = parseRef(n2);

  if (!p1 || !p2) return n1.includes(n2) || n2.includes(n1);

  // Same book and chapter is a match
  if (p1.book === p2.book && p1.chapter === p2.chapter) {
    return true;
  }

  return false;
}

export function searchSermons(query: string): SermonSearchResult[] {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase();
  const results: SermonSearchResult[] = [];

  for (const sermon of SAMPLE_SERMONS) {
    let score = 0;
    const matchedVerses: string[] = [];

    // Title match (highest weight)
    if (sermon.title.toLowerCase().includes(queryLower)) {
      score += 10;
    }

    // Tag match
    for (const tag of sermon.tags) {
      if (tag.toLowerCase().includes(queryLower)) {
        score += 7;
      }
    }

    // Verse reference match
    for (const verse of sermon.verses) {
      if (normalizeVerseRef(verse).includes(queryLower)) {
        score += 8;
        matchedVerses.push(verse);
      }
    }

    // Summary match
    if (sermon.summary.toLowerCase().includes(queryLower)) {
      score += 5;
    }

    // Content match
    if (sermon.content.toLowerCase().includes(queryLower)) {
      score += 3;
    }

    // Preacher match
    if (sermon.preacher.toLowerCase().includes(queryLower)) {
      score += 4;
    }

    if (score > 0) {
      results.push({
        sermon,
        relevanceScore: score,
        matchedVerses,
      });
    }
  }

  // Sort by relevance score descending
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results;
}

export function getSermonsByVerse(
  bookId: number,
  chapter: number,
  verse?: number,
): SermonSearchResult[] {
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) return [];

  const results: SermonSearchResult[] = [];

  for (const sermon of SAMPLE_SERMONS) {
    const matchedVerses: string[] = [];

    for (const verseRef of sermon.verses) {
      const refLower = normalizeVerseRef(verseRef);
      const abbrevLower = book.abbreviation.toLowerCase();

      // Check if the verse reference starts with the book abbreviation
      if (refLower.startsWith(abbrevLower)) {
        // Check chapter
        const chapterMatch = refLower.match(
          new RegExp(`${abbrevLower}\\s+(\\d+)`),
        );
        if (chapterMatch && parseInt(chapterMatch[1]) === chapter) {
          if (verse !== undefined) {
            // Check specific verse
            const verseMatch = refLower.match(
              new RegExp(`${abbrevLower}\\s+${chapter}:(\\d+)(?:-(\\d+))?`),
            );
            if (verseMatch) {
              const startVerse = parseInt(verseMatch[1]);
              const endVerse = verseMatch[2]
                ? parseInt(verseMatch[2])
                : startVerse;
              if (verse >= startVerse && verse <= endVerse) {
                matchedVerses.push(verseRef);
              }
            } else {
              // Chapter-level reference matches any verse
              matchedVerses.push(verseRef);
            }
          } else {
            matchedVerses.push(verseRef);
          }
        }
      }
    }

    if (matchedVerses.length > 0) {
      results.push({
        sermon,
        relevanceScore: matchedVerses.length * 10,
        matchedVerses,
      });
    }
  }

  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results;
}

export function getSermonsByTag(tag: string): Sermon[] {
  return SAMPLE_SERMONS.filter((sermon) =>
    sermon.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export function getSermonById(id: string): Sermon | undefined {
  return SAMPLE_SERMONS.find((sermon) => sermon.id === id);
}

export function getRecommendedSermons(recentVerses: string[]): Sermon[] {
  if (!recentVerses.length) return SAMPLE_SERMONS.slice(0, 5);

  const sermonScores = new Map<string, number>();

  for (const recentVerse of recentVerses) {
    for (const sermon of SAMPLE_SERMONS) {
      for (const sermonVerse of sermon.verses) {
        if (verseRefsOverlap(recentVerse, sermonVerse)) {
          const current = sermonScores.get(sermon.id) || 0;
          sermonScores.set(sermon.id, current + 1);
        }
      }
    }
  }

  // Sort by score and return sermons
  const scored = Array.from(sermonScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  if (scored.length === 0) {
    // Return random sermons if no matches
    return SAMPLE_SERMONS.slice(0, 5);
  }

  return scored
    .map(([id]) => SAMPLE_SERMONS.find((s) => s.id === id)!)
    .filter(Boolean);
}

export function getRelatedSermons(sermonId: string): Sermon[] {
  const sermon = getSermonById(sermonId);
  if (!sermon) return [];

  const scores = new Map<string, number>();

  for (const other of SAMPLE_SERMONS) {
    if (other.id === sermonId) continue;

    let score = 0;

    // Tag overlap
    for (const tag of sermon.tags) {
      if (other.tags.includes(tag)) {
        score += 3;
      }
    }

    // Verse overlap
    for (const v1 of sermon.verses) {
      for (const v2 of other.verses) {
        if (verseRefsOverlap(v1, v2)) {
          score += 5;
        }
      }
    }

    if (score > 0) {
      scores.set(other.id, score);
    }
  }

  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => SAMPLE_SERMONS.find((s) => s.id === id)!)
    .filter(Boolean);
}
