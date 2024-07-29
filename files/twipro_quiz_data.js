const word_dic = {
    '과제' : '課題'
}

function wordQuiz(){
    for(let key in word_dic){
        console.log(key);
        console.log(word_dic[key]);
    }
    return [
        new quizObject("과제の意味は？", ["価値", "課題", "内容"], 1),
        new quizObject("Test", ["a", "b", "c"], 0)
    ];
}

function TwiproData() {
    return wordQuiz();
}