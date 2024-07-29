const word_dic = {
    '가다': '行く',
    '오다': '来る',
    '보다': '見る',
    '사다': '買う',
    '부르다': '呼ぶ・歌う',
    '타다': '乗る',
    '내리다': '降りる',
    '만나다': '会う',
    '먹다': '食べる',
    '마시다': '飲む',
    '웃다': '笑う',
    '울다': '泣く',
    '놀다': '遊ぶ',
    '자다': '寝る',
    '공부하다': '勉強する',
    '전화하다': '電話する',
    '사랑하다': '愛する',
    '좋아하다': '好きだ'
}

function wordQuiz() {
    let result_list = [];
    let statement, choices;
    let index;
    let dic_key_array = [];
    let w;
    for (let i in word_dic) {
        dic_key_array.push(i);
    }
    console.log(dic_key_array);
    for (let key in word_dic) {
        choices = [];
        choices.push(word_dic[key]);
        for (let i = 0; i < 4; i++) {
            index = random(0, dic_key_array.length - 1);
            w = word_dic[dic_key_array[index]];
            while (choices.indexOf(w) != -1) {
                index = random(0, dic_key_array.length - 1);
                w = word_dic[dic_key_array[index]];
            }
            choices.push(w);
        }
        statement = key + "の意味は？";
        let obj = new quizObject(statement, choices, 0);
        result_list.push(obj);
    }
    return result_list;
}

function TwiproData() {
    return wordQuiz();
}